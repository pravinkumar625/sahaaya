import { getContextSummary } from './contextFeeds';

const GEMINI_API_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

const SYSTEM_PROMPT = `You are Sahaaya — an AI that converts messy, unstructured real-world inputs into structured, verified, life-saving action plans.

Analyze ALL provided inputs together (text, images, audio transcripts, and live context data). Cross-verify facts between inputs. Output ONLY a valid JSON object with this exact schema:

{
  "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "verified_facts": ["string", ...],  // 4-6 specific facts extracted and cross-verified from the inputs
  "actions": [
    {
      "label": "string",          // short action title (max 5 words)
      "type": "call" | "navigate" | "reminder" | "book",
      "detail": "string"          // 1-2 sentence specific instruction
    }
  ],  // exactly 2-3 actions
  "confidence": number,           // 0-100, your confidence in this assessment
  "why_this_matters": "string",   // 1-2 sentences on real-world impact
  "cross_checks": ["string", ...]  // 2-4 explicit cross-verifications you performed
}

Rules:
- Be specific and actionable, not generic
- Cross-verify: does the photo match the text? Does context data affect the recommendation?
- Severity CRITICAL = immediate life threat, HIGH = urgent action within hours, MEDIUM = action today, LOW = advisory
- Output ONLY the JSON, no markdown, no extra text`;

/**
 * Sanitise user-supplied text to prevent prompt injection.
 * Strips characters that could break JSON parsing and limits length.
 * @param {string} text — raw user input
 * @returns {string} sanitised string
 */
function sanitiseInput(text) {
  if (!text || typeof text !== 'string') return '';
  // Limit to 5000 chars to prevent abuse
  return text.slice(0, 5000).trim();
}

/**
 * Validate the API key format before making a network request.
 * @param {string} key — Gemini API key
 * @returns {boolean} true if the key looks valid
 */
function isValidApiKey(key) {
  return typeof key === 'string' && key.trim().length > 0;
}

/**
 * Call Gemini API with multimodal inputs.
 * Uses x-goog-api-key header for secure key transmission (never in URL).
 * @param {Object} inputs - { text, audioTranscript, imageBase64, imageMimeType, contextActive }
 * @param {string} apiKey - Gemini API key
 * @returns {Promise<Object>} Structured action result
 */
export async function callGemini({ text, audioTranscript, imageBase64, imageMimeType, contextActive }, apiKey) {
  if (!isValidApiKey(apiKey)) {
    throw new Error('No API key provided');
  }

  const parts = [];

  // Add system prompt as first text part
  parts.push({ text: SYSTEM_PROMPT });

  // Build the user input section with sanitised inputs
  let userInput = 'INPUT DATA:\n\n';

  const cleanText = sanitiseInput(text);
  if (cleanText) {
    userInput += `TEXT INPUT:\n${cleanText}\n\n`;
  }

  const cleanTranscript = sanitiseInput(audioTranscript);
  if (cleanTranscript) {
    userInput += `VOICE NOTE (TRANSCRIPT):\n${cleanTranscript}\n\n`;
  }

  if (contextActive) {
    userInput += `LIVE CONTEXT DATA:\n${getContextSummary()}\n\n`;
  }

  if (imageBase64) {
    userInput += 'ATTACHED IMAGE: (analyze the image provided below)\n\n';
  }

  userInput += 'Based on all provided inputs, generate the structured action JSON:';

  parts.push({ text: userInput });

  // Add image if provided
  if (imageBase64 && imageMimeType) {
    parts.push({
      inline_data: {
        mime_type: imageMimeType,
        data: imageBase64,
      },
    });
  }

  const requestBody = {
    contents: [{ parts }],
    generationConfig: {
      temperature: 0.3,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 1024,
    },
  };

  // Pass API key via query parameter and x-goog-api-key header for maximum compatibility and security
  const url = `${GEMINI_API_URL}?key=${encodeURIComponent(apiKey)}`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error('No response from Gemini');
  }

  // Extract JSON from response
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Could not parse structured response from Gemini');
  }

  const parsed = JSON.parse(jsonMatch[0]);

  // Validate schema before returning
  if (!parsed.severity || !Array.isArray(parsed.actions)) {
    throw new Error('Gemini response does not match expected schema');
  }

  return parsed;
}

/**
 * Convert a File object to base64.
 * Validates file type and size before processing.
 * @param {File} file — image file to convert
 * @returns {Promise<string>} base64-encoded file content (without data URL prefix)
 */
export function fileToBase64(file) {
  if (!file) {
    return Promise.reject(new Error('No file provided'));
  }

  // Limit to 10MB to prevent memory issues
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return Promise.reject(new Error('File size exceeds 10MB limit'));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = reader.result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

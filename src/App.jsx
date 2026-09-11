import { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCursorPos } from './hooks/useCursorPos';
import ParticleBackground from './components/ParticleBackground';
import CursorTrail from './components/CursorTrail';
import Hero from './components/Hero';
import InputZone from './components/InputZone';
import DemoScenarios from './components/DemoScenarios';
import ChaosStage from './components/ChaosStage';
import ActionCard from './components/ActionCard';
import HowItWorks from './components/HowItWorks';
import { demoScenarios } from './lib/demoData';
import { callGemini, fileToBase64 } from './lib/gemini';

// App states: hero → input → processing → result
const STATES = { HERO: 'hero', INPUT: 'input', PROCESSING: 'processing', RESULT: 'result' };

const EMPTY_INPUTS = {
  text: '',
  audioTranscript: null,
  imageFile: null,
  imagePreview: null,
  imageMimeType: null,
  hasImage: false,
  imageEmoji: null,
  imageName: null,
  contextActive: false,
};

export default function App() {
  const [appState, setAppState] = useState(STATES.HERO);
  const [inputs, setInputs] = useState(EMPTY_INPUTS);
  const [activeDemo, setActiveDemo] = useState(null);
  const [result, setResult] = useState(null);
  const [verificationSteps, setVerificationSteps] = useState(null);
  const [apiKey, setApiKey] = useState(import.meta.env.VITE_GEMINI_API_KEY || '');
  const [error, setError] = useState(null);

  const cursorPos = useCursorPos();

  // Hero complete → show input
  const handleHeroComplete = useCallback(() => {
    setAppState(STATES.INPUT);
  }, []);

  // Demo selection → pre-fill inputs
  const handleDemoSelect = useCallback((demoId) => {
    const scenario = demoScenarios.find((s) => s.id === demoId);
    if (!scenario) return;

    setActiveDemo(demoId);
    setInputs({
      ...EMPTY_INPUTS,
      text: scenario.inputs.text || '',
      audioTranscript: scenario.inputs.audioTranscript,
      hasImage: scenario.inputs.hasImage,
      imageEmoji: scenario.inputs.imageEmoji,
      imageName: scenario.inputs.imageName,
      contextActive: scenario.inputs.contextActive || false,
    });
    setError(null);
  }, []);

  // Analyse → start processing
  const handleAnalyze = useCallback(async () => {
    setError(null);
    setAppState(STATES.PROCESSING);

    // Get verification steps from demo or use defaults
    const scenario = demoScenarios.find((s) => s.id === activeDemo);
    setVerificationSteps(scenario?.verificationSteps || null);

    // If it's a demo scenario and no custom text was added, use pre-computed result
    const isCleanDemo = activeDemo && !inputs.imageFile &&
      (inputs.text === scenario?.inputs.text || !inputs.text || inputs.text === '') &&
      inputs.audioTranscript === scenario?.inputs.audioTranscript;

    if (isCleanDemo) {
      // Use pre-computed demo result (reliable for hackathon)
      setTimeout(() => {
        setResult(scenario.result);
        setAppState(STATES.RESULT);
      }, 4200); // Wait for chaos animation
      return;
    }

    // Try live Gemini API call
    if (apiKey) {
      try {
        let imageBase64 = null;
        let imageMimeType = null;

        if (inputs.imageFile) {
          imageBase64 = await fileToBase64(inputs.imageFile);
          imageMimeType = inputs.imageMimeType;
        }

        let geminiResult;
        const keyToUse = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
        const secondaryKey = import.meta.env.VITE_GEMINI_API_KEY_SECONDARY;

        try {
          geminiResult = await callGemini(
            {
              text: inputs.text,
              audioTranscript: inputs.audioTranscript,
              imageBase64,
              imageMimeType,
              contextActive: inputs.contextActive,
            },
            keyToUse
          );
        } catch (primaryErr) {
          if (secondaryKey && secondaryKey !== keyToUse) {
            console.warn('Primary Gemini API key failed, trying secondary key...', primaryErr);
            geminiResult = await callGemini(
              {
                text: inputs.text,
                audioTranscript: inputs.audioTranscript,
                imageBase64,
                imageMimeType,
                contextActive: inputs.contextActive,
              },
              secondaryKey
            );
          } else {
            throw primaryErr;
          }
        }

        // Wait for chaos animation to finish
        setTimeout(() => {
          setResult(geminiResult);
          setAppState(STATES.RESULT);
        }, 4200);
      } catch (err) {
        console.error('Gemini API error:', err);
        setTimeout(() => {
          setError(`Gemini API error: ${err.message}. Showing demo result instead.`);
          // Fall back to the best matching demo result
          const fallback = scenario?.result || demoScenarios[0].result;
          setResult(fallback);
          setAppState(STATES.RESULT);
        }, 4200);
      }
    } else {
      // No API key, no active demo — show the health emergency as fallback
      setTimeout(() => {
        setError('No API key provided. Showing a demo result. Add your Gemini key to analyse live inputs.');
        const fallback = scenario?.result || demoScenarios[0].result;
        setResult(fallback);
        setAppState(STATES.RESULT);
      }, 4200);
    }
  }, [activeDemo, inputs, apiKey]);

  // Chaos animation complete → handled by handleAnalyze's setTimeout above
  const handleChaosComplete = useCallback(() => {
    // The chaos stage signals completion, but result is set by handleAnalyze's timer
    // This is called when the visual is done — state change is already queued
  }, []);

  // Reset → back to input
  const handleReset = useCallback(() => {
    setAppState(STATES.INPUT);
    setResult(null);
    setActiveDemo(null);
    setInputs(EMPTY_INPUTS);
    setError(null);
    setVerificationSteps(null);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* Skip to content — accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[99999] focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
        style={{ background: 'var(--teal)', color: '#050812' }}
      >
        Skip to main content
      </a>

      {/* Fixed background layers */}
      <ParticleBackground />
      <CursorTrail />

      {/* Custom cursor dot + ring */}
      <div
        className="cursor-dot"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />
      <div
        className="cursor-ring"
        style={{ left: cursorPos.x, top: cursorPos.y }}
      />

      {/* Hero */}
      <AnimatePresence>
        {appState === STATES.HERO && <Hero onComplete={handleHeroComplete} />}
      </AnimatePresence>

      {/* Chaos Stage — fixed overlay */}
      <AnimatePresence>
        {appState === STATES.PROCESSING && (
          <ChaosStage
            inputs={inputs}
            verificationSteps={verificationSteps}
            onComplete={handleChaosComplete}
          />
        )}
      </AnimatePresence>

      {/* Main App Content */}
      <AnimatePresence>
        {(appState === STATES.INPUT || appState === STATES.RESULT) && (
          <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10 min-h-screen flex flex-col"
          >
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4" role="banner">
              <button
                onClick={handleReset}
                className="flex items-center gap-2"
                style={{ cursor: 'none' }}
                aria-label="Sahaaya — go to home"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-display font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #00F5D4, #7C3AED)', color: '#050812' }}
                  aria-hidden="true"
                >
                  S
                </div>
                <span className="font-display font-bold text-gradient text-lg">Sahaaya</span>
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs opacity-30 hidden sm:inline">Powered by</span>
                <div className="flex items-center gap-1.5 glass rounded-full px-3 py-1.5">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #4285F4, #34A853, #FBBC05, #EA4335)' }}
                  >
                    <span className="text-white" style={{ fontSize: '9px' }}>G</span>
                  </div>
                  <span className="text-xs opacity-60">Gemini</span>
                </div>
              </div>
            </header>

            {/* Page content */}
            <div id="main-content" className="flex-1 flex flex-col items-center px-4 pb-16" role="main">

              {appState === STATES.INPUT && (
                <div className="w-full max-w-2xl space-y-8 mt-6">
                  {/* Hero line */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <h1 className="font-display font-bold text-gradient mb-2"
                      style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)' }}>
                      Messy input. Verified action.
                    </h1>
                    <p className="text-sm opacity-40">
                      Drop any combination of text, photo, voice, or live context — Gemini does the rest.
                    </p>
                  </motion.div>

                  {/* Demo scenarios */}
                  <DemoScenarios activeId={activeDemo} onSelect={handleDemoSelect} />

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    <span className="text-xs opacity-30">or enter your own</span>
                    <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  </div>

                  {/* Input zone */}
                  <InputZone
                    inputs={inputs}
                    setInputs={setInputs}
                    onAnalyze={handleAnalyze}
                    isLoading={false}
                    apiKey={apiKey}
                    setApiKey={setApiKey}
                  />

                  {/* How it works */}
                  <HowItWorks />
                </div>
              )}

              {appState === STATES.RESULT && result && (
                <div className="w-full max-w-2xl mt-6 space-y-6">
                  {/* Error banner */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass rounded-xl px-4 py-3 text-xs"
                      style={{ borderColor: 'rgba(255,159,28,0.3)', color: '#FF9F1C' }}
                    >
                      ⚠️ {error}
                    </motion.div>
                  )}

                  {/* Scenario tag if from demo */}
                  {activeDemo && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      {(() => {
                        const s = demoScenarios.find((d) => d.id === activeDemo);
                        return s ? (
                          <>
                            <span>{s.icon}</span>
                            <span className="text-sm font-display font-semibold">{s.label}</span>
                            <span className="text-xs opacity-40">— {s.tagline}</span>
                          </>
                        ) : null;
                      })()}
                    </motion.div>
                  )}

                  <ActionCard result={result} onReset={handleReset} />
                  <HowItWorks />
                </div>
              )}
            </div>

            {/* Footer */}
            <footer className="text-center py-4 text-xs opacity-20" role="contentinfo">
              Sahaaya · Built for the future of emergency intelligence ·{' '}
              <span className="text-gradient opacity-100">Gemini 2.0 Flash</span>
            </footer>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

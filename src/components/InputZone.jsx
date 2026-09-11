import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Image, AlignLeft, Radio, Upload, X, Play, Square } from 'lucide-react';
import ContextFeed from './ContextFeed';
import PropTypes from 'prop-types';

const TABS = [
  { id: 'text', label: 'Text', icon: AlignLeft },
  { id: 'photo', label: 'Photo', icon: Image },
  { id: 'voice', label: 'Voice', icon: Mic },
  { id: 'context', label: 'Live Context', icon: Radio },
];

const DEMO_TRANSCRIPTS = [
  "Dadi is confused about her medicines. She took her blood pressure pill this morning but I'm not sure about the diabetes pill.",
  "I have severe chest pain and shortness of breath since 20 minutes.",
  "My child fell from a bicycle and is bleeding heavily from her knee.",
];

export default function InputZone({ inputs, setInputs, onAnalyze, isLoading, apiKey, setApiKey }) {
  const [activeTab, setActiveTab] = useState('text');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const fileInputRef = useRef(null);
  const timerRef = useRef(null);
  const zoneRef = useRef(null);

  // Breathing ripple on mouse move within zone
  const handleZoneMouseMove = useCallback((e) => {
    if (!zoneRef.current) return;
    const rect = zoneRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    zoneRef.current.style.setProperty('--mx', `${x}%`);
    zoneRef.current.style.setProperty('--my', `${y}%`);
  }, []);

  // Simulate voice recording
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      clearInterval(timerRef.current);
      setRecordingTime(0);
      // Set a simulated transcript
      const transcript = DEMO_TRANSCRIPTS[Math.floor(Math.random() * DEMO_TRANSCRIPTS.length)];
      setInputs((prev) => ({ ...prev, audioTranscript: transcript }));
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => setRecordingTime((t) => t + 1), 1000);
    }
  };

  // Image upload
  const handleImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setInputs((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: url,
      imageMimeType: file.type,
    }));
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageFile(file);
    setActiveTab('photo');
  };

  const canAnalyze =
    inputs.text?.trim() ||
    inputs.audioTranscript?.trim() ||
    inputs.imageFile ||
    inputs.contextActive;

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4" role="form" aria-label="Emergency input form">
      {/* API Key toggle */}
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => setShowApiKey((v) => !v)}
          className="text-xs opacity-40 hover:opacity-70 transition-opacity flex items-center gap-1"
        >
          <span>⚙</span> {showApiKey ? 'Hide' : 'Gemini API Key'}
        </button>
      </div>

      <AnimatePresence>
        {showApiKey && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass rounded-xl p-3 flex gap-2 items-center">
              <input
                type="password"
                placeholder="Enter Gemini API Key (optional — demos work without it)"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="flex-1 bg-transparent text-xs outline-none placeholder-white/20 text-white/70"
                aria-label="Gemini API key"
                autoComplete="off"
              />
              {apiKey && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,245,212,0.15)', color: 'var(--teal)' }}>
                  ✓ Key set
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Input Zone */}
      <div
        ref={zoneRef}
        className="glass gradient-border rounded-2xl p-1 input-zone-breathe"
        onMouseMove={handleZoneMouseMove}
        onDrop={handleFileDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        style={{
          background: dragOver
            ? 'rgba(0,245,212,0.08)'
            : 'rgba(255,255,255,0.03)',
          transition: 'background 0.3s',
        }}
      >
        {/* Tabs */}
        <div className="flex rounded-xl overflow-hidden mb-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold transition-all duration-300 ${
                  active ? 'tab-active' : 'opacity-40 hover:opacity-70'
                }`}
                style={{ fontFamily: 'Space Grotesk' }}
                role="tab"
                aria-selected={active}
                aria-controls={`panel-${tab.id}`}
                id={`tab-${tab.id}`}
              >
                <Icon size={13} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-3 min-h-[180px]">
          <AnimatePresence mode="wait">
            {/* TEXT */}
            {activeTab === 'text' && (
              <motion.div
                key="text"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <textarea
                  placeholder="Describe your situation in plain language... symptoms, location, what happened — anything."
                  value={inputs.text || ''}
                  onChange={(e) => setInputs((p) => ({ ...p, text: e.target.value }))}
                  className="w-full bg-transparent text-sm outline-none resize-none placeholder-white/20 leading-relaxed"
                  rows={7}
                  style={{ fontFamily: 'Inter' }}
                  aria-label="Describe your emergency situation"
                  id="input-text"
                />
              </motion.div>
            )}

            {/* PHOTO */}
            {activeTab === 'photo' && (
              <motion.div
                key="photo"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center h-44"
              >
                {inputs.imagePreview ? (
                  <div className="relative">
                    <img
                      src={inputs.imagePreview}
                      alt="Uploaded"
                      className="max-h-36 max-w-full rounded-xl object-contain"
                      style={{ border: '1px solid rgba(0,245,212,0.2)' }}
                    />
                    <button
                      onClick={() => setInputs((p) => ({ ...p, imageFile: null, imagePreview: null }))}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: '#FF4D6D' }}
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-3 opacity-50 hover:opacity-80 transition-opacity"
                  >
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{ border: '2px dashed rgba(0,245,212,0.3)', background: 'rgba(0,245,212,0.05)' }}
                    >
                      <Upload size={22} style={{ color: 'var(--teal)' }} />
                    </div>
                    <span className="text-sm">Drop photo or click to upload</span>
                    <span className="text-xs opacity-50">Medical reports, prescriptions, ID cards, wounds…</span>
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageFile(e.target.files[0])}
                />
              </motion.div>
            )}

            {/* VOICE */}
            {activeTab === 'voice' && (
              <motion.div
                key="voice"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center gap-4 py-4"
              >
                {/* Waveform visualizer */}
                <div className="flex items-center gap-1 h-10">
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full"
                      style={{
                        background: isRecording ? 'var(--teal)' : 'rgba(255,255,255,0.15)',
                        height: isRecording ? `${20 + Math.random() * 28}px` : '8px',
                        animation: isRecording ? `waveBar ${0.4 + Math.random() * 0.4}s ease-in-out infinite alternate` : 'none',
                        animationDelay: `${i * 0.05}s`,
                        transition: 'height 0.3s, background 0.3s',
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={toggleRecording}
                  className="btn-ripple-effect w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    background: isRecording
                      ? 'rgba(255,77,109,0.2)'
                      : 'linear-gradient(135deg, rgba(0,245,212,0.2), rgba(124,58,237,0.2))',
                    border: `2px solid ${isRecording ? '#FF4D6D' : 'rgba(0,245,212,0.4)'}`,
                    boxShadow: isRecording ? '0 0 20px rgba(255,77,109,0.4)' : '0 0 15px rgba(0,245,212,0.2)',
                  }}
                >
                  {isRecording ? <Square size={20} fill="#FF4D6D" color="#FF4D6D" /> : <Mic size={20} style={{ color: 'var(--teal)' }} />}
                </button>

                {isRecording && (
                  <div className="text-xs" style={{ color: '#FF4D6D' }}>
                    Recording… {formatTime(recordingTime)}
                  </div>
                )}

                {inputs.audioTranscript && (
                  <div className="w-full glass rounded-xl p-3">
                    <div className="text-xs opacity-40 mb-1 flex items-center gap-1">
                      <Play size={10} /> Transcript
                    </div>
                    <p className="text-xs opacity-80 leading-relaxed">{inputs.audioTranscript}</p>
                    <button
                      onClick={() => setInputs((p) => ({ ...p, audioTranscript: null }))}
                      className="mt-2 text-xs opacity-40 hover:opacity-70"
                    >
                      × Clear
                    </button>
                  </div>
                )}

                {!inputs.audioTranscript && !isRecording && (
                  <p className="text-xs opacity-30 text-center max-w-xs">
                    Tap to record. Voice is transcribed and sent to Gemini for analysis.
                  </p>
                )}
              </motion.div>
            )}

            {/* CONTEXT */}
            {activeTab === 'context' && (
              <motion.div
                key="context"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs opacity-50">Include live context data in analysis</span>
                  <button
                    onClick={() => setInputs((p) => ({ ...p, contextActive: !p.contextActive }))}
                    className="relative w-10 h-5 rounded-full transition-all duration-300"
                    style={{
                      background: inputs.contextActive
                        ? 'linear-gradient(90deg, var(--teal), var(--violet))'
                        : 'rgba(255,255,255,0.1)',
                    }}
                  >
                    <div
                      className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-300"
                      style={{ left: inputs.contextActive ? '22px' : '2px' }}
                    />
                  </button>
                </div>
                <ContextFeed />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Analyse Button */}
      <motion.button
        onClick={onAnalyze}
        disabled={!canAnalyze || isLoading}
        whileHover={{ scale: canAnalyze ? 1.02 : 1 }}
        whileTap={{ scale: 0.97 }}
        className="btn-ripple-effect w-full py-4 rounded-2xl font-display font-bold text-base tracking-wide transition-all duration-300 relative overflow-hidden"
        style={{
          background: canAnalyze
            ? 'linear-gradient(135deg, #00F5D4 0%, #7C3AED 100%)'
            : 'rgba(255,255,255,0.05)',
          color: canAnalyze ? '#050812' : 'rgba(255,255,255,0.3)',
          boxShadow: canAnalyze ? '0 0 30px rgba(0,245,212,0.3)' : 'none',
          cursor: canAnalyze ? 'none' : 'not-allowed',
        }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Analysing with Gemini…
          </span>
        ) : (
          '⚡ Analyse with Gemini'
        )}
      </motion.button>
    </div>
  );
}

InputZone.propTypes = {
  inputs: PropTypes.object.isRequired,
  setInputs: PropTypes.func.isRequired,
  onAnalyze: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  apiKey: PropTypes.string,
  setApiKey: PropTypes.func,
};

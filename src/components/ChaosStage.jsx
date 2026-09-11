import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import VerificationChecklist from './VerificationChecklist';

// Generate a random scatter position on screen edges/middle
const scatter = (i, total) => {
  const angle = (i / total) * Math.PI * 2 + Math.random() * 0.5;
  const radius = 220 + Math.random() * 120;
  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    rotate: -25 + Math.random() * 50,
    scale: 0.7 + Math.random() * 0.4,
  };
};

function FragmentCard({ emoji, label, content, index, total, phase }) {
  const { x, y, rotate, scale } = useMemo(() => scatter(index, total), [index, total]);

  const variants = {
    initial: { x: 0, y: 0, rotate: 0, scale: 0, opacity: 0 },
    chaos: {
      x,
      y,
      rotate,
      scale,
      opacity: 1,
      transition: { type: 'spring', stiffness: 80, damping: 12, delay: index * 0.08 },
    },
    converge: {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 0.85,
      opacity: 0.4,
      transition: { type: 'spring', stiffness: 120, damping: 18, delay: index * 0.05 },
    },
    gone: {
      scale: 0,
      opacity: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate={phase}
      className="absolute glass rounded-xl p-2.5 pointer-events-none select-none"
      style={{
        maxWidth: '160px',
        border: '1px solid rgba(0,245,212,0.2)',
        filter: phase === 'chaos' ? 'blur(0.3px)' : 'none',
      }}
    >
      {/* Glitch scanline overlay during chaos */}
      {phase === 'chaos' && (
        <div
          className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none"
          style={{
            background:
              'repeating-linear-gradient(0deg, rgba(0,245,212,0.03) 0px, rgba(0,245,212,0.03) 1px, transparent 1px, transparent 3px)',
          }}
        />
      )}
      <div className="text-base mb-1">{emoji}</div>
      <div className="text-xs font-display font-semibold opacity-60 mb-0.5">{label}</div>
      <div className="text-xs opacity-50 leading-snug truncate">{content}</div>
    </motion.div>
  );
}

export default function ChaosStage({ inputs, verificationSteps, onComplete }) {
  const [phase, setPhase] = useState('initial'); // initial → chaos → converge → gone
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklistComplete, setChecklistComplete] = useState(false);

  // Build fragment cards from inputs
  const fragments = useMemo(() => {
    const frags = [];
    if (inputs.text) frags.push({ emoji: '📝', label: 'Text Input', content: inputs.text.slice(0, 60) + '…' });
    if (inputs.imagePreview || inputs.hasImage)
      frags.push({ emoji: inputs.imageEmoji || '📷', label: 'Photo', content: inputs.imageName || 'uploaded image' });
    if (inputs.audioTranscript)
      frags.push({ emoji: '🎙️', label: 'Voice Note', content: inputs.audioTranscript.slice(0, 50) + '…' });
    if (inputs.contextActive)
      frags.push({ emoji: '📡', label: 'Live Context', content: 'Weather · Traffic · News feeds' });
    // Always show at least 2 fragments
    if (frags.length < 2) frags.push({ emoji: '🔍', label: 'Gemini Parse', content: 'Cross-verification engine' });
    return frags;
  }, [inputs]);

  useEffect(() => {
    // Phase 1: Scatter fragments
    const t1 = setTimeout(() => setPhase('chaos'), 100);
    // Phase 2: Show checklist
    const t2 = setTimeout(() => setShowChecklist(true), 600);
    // Phase 3: Converge fragments
    const t3 = setTimeout(() => setPhase('converge'), 2800);
    // Phase 4: Mark checklist complete
    const t4 = setTimeout(() => setChecklistComplete(true), 3200);
    // Phase 5: Fade out & signal done
    const t5 = setTimeout(() => setPhase('gone'), 3500);
    const t6 = setTimeout(() => onComplete(), 3900);

    return () => [t1, t2, t3, t4, t5, t6].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: phase === 'gone' ? 0 : 1 }}
      transition={{ duration: 0.5 }}
      style={{ background: 'rgba(5,8,18,0.95)' }}
    >
      {/* Central convergence point — glowing ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 80,
          height: 80,
          background: 'radial-gradient(circle, rgba(0,245,212,0.15) 0%, transparent 70%)',
          border: '1px solid rgba(0,245,212,0.3)',
        }}
        animate={{
          scale: phase === 'converge' ? [1, 1.4, 1] : [1, 1.1, 1],
          boxShadow:
            phase === 'converge'
              ? ['0 0 20px rgba(0,245,212,0.2)', '0 0 60px rgba(0,245,212,0.5)', '0 0 20px rgba(0,245,212,0.2)']
              : ['0 0 10px rgba(0,245,212,0.1)', '0 0 20px rgba(0,245,212,0.2)', '0 0 10px rgba(0,245,212,0.1)'],
        }}
        transition={{ duration: 0.8, repeat: phase === 'converge' ? 2 : Infinity }}
      />

      {/* Gemini G badge */}
      <motion.div
        className="absolute rounded-full flex items-center justify-center font-display font-bold text-sm z-10"
        style={{
          width: 44,
          height: 44,
          background: 'linear-gradient(135deg, #00F5D4, #7C3AED)',
          color: '#050812',
        }}
        animate={{ rotate: phase === 'chaos' ? 360 : 0 }}
        transition={{ duration: 2, ease: 'linear', repeat: phase === 'chaos' ? Infinity : 0 }}
      >
        G
      </motion.div>

      {/* Glitch text at top */}
      <AnimatePresence>
        {phase === 'chaos' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-16 text-center"
          >
            <p className="text-xs font-display uppercase tracking-widest fragment-glitch" style={{ color: 'rgba(0,245,212,0.6)' }}>
              ⚡ Parsing unstructured inputs…
            </p>
          </motion.div>
        )}
        {phase === 'converge' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute top-16 text-center"
          >
            <p className="text-xs font-display uppercase tracking-widest" style={{ color: 'var(--teal)' }}>
              ✓ Structuring verified action…
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Fragments */}
      {fragments.map((frag, i) => (
        <FragmentCard
          key={frag.label}
          {...frag}
          index={i}
          total={fragments.length}
          phase={phase === 'gone' ? 'gone' : phase}
        />
      ))}

      {/* Verification Checklist — side panel */}
      <AnimatePresence>
        {showChecklist && (
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ type: 'spring', stiffness: 150 }}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-72 hidden lg:block"
          >
            <VerificationChecklist steps={verificationSteps} isComplete={checklistComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile checklist — bottom */}
      <AnimatePresence>
        {showChecklist && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="absolute bottom-8 left-4 right-4 lg:hidden"
          >
            <VerificationChecklist steps={verificationSteps} isComplete={checklistComplete} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

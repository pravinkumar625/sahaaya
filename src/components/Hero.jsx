import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const taglineWords = ['Messy', 'input.', 'Verified', 'action.'];
const subWords = ['Any input.', 'Any crisis.', 'One bridge.'];

export default function Hero({ onComplete }) {
  const [phase, setPhase] = useState(0); // 0=hidden, 1=tagline, 2=sub, 3=fade

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 300);
    const t2 = setTimeout(() => setPhase(2), 1600);
    const t3 = setTimeout(() => setPhase(3), 3200);
    const t4 = setTimeout(() => onComplete(), 3900);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: '#050812' }}
      animate={{ opacity: phase === 3 ? 0 : 1 }}
      transition={{ duration: 0.7, ease: 'easeInOut' }}
    >
      {/* Radial glow behind text */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0,245,212,0.08) 0%, rgba(124,58,237,0.06) 50%, transparent 100%)',
        }}
      />

      {/* Tagline */}
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6 px-4">
        {taglineWords.map((word, i) => (
          <AnimatePresence key={word}>
            {phase >= 1 && (
              <motion.span
                initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{
                  delay: i * 0.18,
                  duration: 0.7,
                  type: 'spring',
                  stiffness: 120,
                  damping: 14,
                }}
                className="font-display font-bold text-gradient"
                style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)', lineHeight: 1.1 }}
              >
                {word}
              </motion.span>
            )}
          </AnimatePresence>
        ))}
      </div>

      {/* Subline */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex gap-6 flex-wrap justify-center"
          >
            {subWords.map((w, i) => (
              <motion.span
                key={w}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: i * 0.2, duration: 0.4 }}
                className="text-sm md:text-base font-sans tracking-widest uppercase"
                style={{ color: 'rgba(0,245,212,0.6)' }}
              >
                {w}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name badge */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="mt-10 px-6 py-2 rounded-full gradient-border glass"
            style={{ fontFamily: 'Space Grotesk' }}
          >
            <span className="text-gradient font-semibold text-lg tracking-wider">SAHAAYA ⚡</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Animated corner dots */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full"
          style={{
            background: 'var(--teal)',
            top: i < 2 ? '5%' : '95%',
            left: i % 2 === 0 ? '5%' : '95%',
            boxShadow: '0 0 8px var(--teal)',
          }}
          animate={{ scale: [1, 1.8, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}
    </motion.div>
  );
}

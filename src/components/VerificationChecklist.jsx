import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, Loader } from 'lucide-react';

const DEFAULT_STEPS = [
  'Parsing multimodal inputs…',
  'Extracting key entities…',
  'Cross-referencing context data…',
  'Verifying facts across sources…',
  'Applying domain heuristics…',
  'Structuring action plan…',
];

export default function VerificationChecklist({ steps, isComplete }) {
  const [revealedCount, setRevealedCount] = useState(0);
  const [checkedCount, setCheckedCount] = useState(0);
  const activeSteps = steps || DEFAULT_STEPS;

  useEffect(() => {
    setRevealedCount(0);
    setCheckedCount(0);

    let revealTimer;
    let checkTimer;

    const revealNext = (i) => {
      if (i >= activeSteps.length) return;
      revealTimer = setTimeout(() => {
        setRevealedCount(i + 1);
        checkTimer = setTimeout(() => {
          setCheckedCount((c) => c + 1);
          revealNext(i + 1);
        }, 420);
      }, i === 0 ? 200 : 480);
    };

    revealNext(0);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(checkTimer);
    };
  }, [activeSteps]);

  return (
    <div className="glass rounded-2xl p-5 w-full max-w-sm mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, var(--teal), var(--violet))' }}
        >
          <span className="text-xs text-black font-bold">G</span>
        </div>
        <div>
          <div className="text-xs font-display font-semibold" style={{ color: 'var(--teal)' }}>
            Gemini is cross-verifying
          </div>
          <div className="text-xs opacity-40">Checking all inputs against each other</div>
        </div>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {activeSteps.slice(0, revealedCount).map((step, i) => {
            const isChecked = i < checkedCount;
            return (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -15, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="flex items-center gap-2.5"
              >
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {isChecked ? (
                    <CheckCircle
                      size={16}
                      style={{ color: 'var(--teal)', filter: 'drop-shadow(0 0 4px rgba(0,245,212,0.5))' }}
                    />
                  ) : (
                    <Loader size={16} className="animate-spin opacity-50" style={{ color: 'var(--teal)' }} />
                  )}
                </motion.div>

                <span
                  className={`text-xs transition-all duration-300 ${isChecked ? 'opacity-70' : 'opacity-100'}`}
                  style={{
                    color: isChecked ? 'rgba(255,255,255,0.6)' : 'white',
                    textDecoration: isChecked ? 'none' : 'none',
                  }}
                >
                  {isChecked ? (
                    <span className="flex items-center gap-1">
                      <span style={{ color: 'var(--teal)' }}>✓</span> {step.replace('…', ' done')}
                    </span>
                  ) : (
                    step
                  )}
                </span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--teal), var(--violet))' }}
          initial={{ width: '0%' }}
          animate={{ width: `${(checkedCount / activeSteps.length) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs opacity-30">{checkedCount}/{activeSteps.length} checks</span>
        {isComplete && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs font-semibold"
            style={{ color: 'var(--teal)' }}
          >
            Complete ✓
          </motion.span>
        )}
      </div>
    </div>
  );
}

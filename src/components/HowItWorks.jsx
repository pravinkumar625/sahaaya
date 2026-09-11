import { useState, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, GitMerge } from 'lucide-react';

/**
 * Pipeline step data for the "How It Works" visualization.
 * Represents the full Sahaay processing pipeline.
 */
const PIPELINE_NODES = [
  {
    label: 'Any Input',
    sub: 'Text · Photo · Voice · Live Feeds',
    icon: '🌀',
    color: 'rgba(0,245,212,0.2)',
    border: 'rgba(0,245,212,0.4)',
  },
  {
    label: 'Gemini Multimodal Parse',
    sub: 'gemini-2.0-flash processes all modalities simultaneously',
    icon: '🤖',
    color: 'rgba(124,58,237,0.15)',
    border: 'rgba(124,58,237,0.4)',
  },
  {
    label: 'Cross-Verification Engine',
    sub: 'Facts cross-checked between inputs, context, & domain knowledge',
    icon: '⟳',
    color: 'rgba(0,245,212,0.1)',
    border: 'rgba(0,245,212,0.25)',
  },
  {
    label: 'Strict JSON Schema',
    sub: '{ severity, verified_facts, actions, confidence }',
    icon: '{ }',
    color: 'rgba(255,159,28,0.1)',
    border: 'rgba(255,159,28,0.3)',
  },
  {
    label: 'Action Card',
    sub: 'Verified facts → concrete next steps',
    icon: '⚡',
    color: 'rgba(0,245,212,0.15)',
    border: 'rgba(0,245,212,0.4)',
  },
];

function ArrowSVG({ delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="hidden sm:flex items-center justify-center w-8 flex-shrink-0"
      style={{ transformOrigin: 'left' }}
      aria-hidden="true"
    >
      <svg width="32" height="12" viewBox="0 0 32 12">
        <defs>
          <linearGradient id="arrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F5D4" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <line x1="0" y1="6" x2="26" y2="6" stroke="url(#arrowGrad)" strokeWidth="1.5" strokeDasharray="4 2" />
        <polygon points="24,2 32,6 24,10" fill="url(#arrowGrad)" />
      </svg>
    </motion.div>
  );
}

function DownArrow({ delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, scaleY: 0 }}
      animate={{ opacity: 1, scaleY: 1 }}
      transition={{ delay, duration: 0.3, ease: 'easeOut' }}
      className="flex sm:hidden justify-center py-1"
      style={{ transformOrigin: 'top' }}
      aria-hidden="true"
    >
      <svg width="12" height="24" viewBox="0 0 12 24">
        <defs>
          <linearGradient id="dArrowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00F5D4" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>
        </defs>
        <line x1="6" y1="0" x2="6" y2="18" stroke="url(#dArrowGrad)" strokeWidth="1.5" strokeDasharray="4 2" />
        <polygon points="2,16 6,24 10,16" fill="url(#dArrowGrad)" />
      </svg>
    </motion.div>
  );
}

/**
 * HowItWorks — collapsible section that visualises the Sahaay
 * processing pipeline from messy input to structured action card.
 */
export default function HowItWorks() {
  const [open, setOpen] = useState(false);

  return (
    <section className="w-full max-w-2xl mx-auto" aria-label="How Sahaay works">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm opacity-40 hover:opacity-70 transition-opacity mx-auto"
        style={{ cursor: 'none' }}
        aria-expanded={open}
        aria-controls="how-it-works-panel"
      >
        <GitMerge size={14} aria-hidden="true" />
        How Sahaay Works
        {open ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            id="how-it-works-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-4 glass rounded-2xl p-5">
              <p className="text-xs opacity-40 mb-5 text-center">
                The complete pipeline from messy input to verified action
              </p>

              {/* Desktop: horizontal pipeline */}
              <div className="hidden sm:flex items-center justify-between gap-1" role="list" aria-label="Processing pipeline">
                {PIPELINE_NODES.map((node, i) => (
                  <Fragment key={node.label}>
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12, type: 'spring', stiffness: 180 }}
                      className="pipeline-node flex-1 min-w-0"
                      style={{ background: node.color, borderColor: node.border }}
                      role="listitem"
                    >
                      <div className="text-lg mb-1" aria-hidden="true">{node.icon}</div>
                      <div className="text-xs font-display font-semibold leading-tight mb-1">{node.label}</div>
                      <div className="text-xs opacity-40 leading-snug hidden lg:block">{node.sub}</div>
                    </motion.div>
                    {i < PIPELINE_NODES.length - 1 && <ArrowSVG delay={i * 0.12 + 0.1} />}
                  </Fragment>
                ))}
              </div>

              {/* Mobile: vertical pipeline */}
              <div className="flex sm:hidden flex-col" role="list" aria-label="Processing pipeline (mobile)">
                {PIPELINE_NODES.map((node, i) => (
                  <Fragment key={node.label}>
                    <motion.div
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1, type: 'spring', stiffness: 180 }}
                      className="pipeline-node"
                      style={{ background: node.color, borderColor: node.border }}
                      role="listitem"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base" aria-hidden="true">{node.icon}</span>
                        <div>
                          <div className="text-xs font-display font-semibold">{node.label}</div>
                          <div className="text-xs opacity-40">{node.sub}</div>
                        </div>
                      </div>
                    </motion.div>
                    {i < PIPELINE_NODES.length - 1 && <DownArrow delay={i * 0.1 + 0.08} />}
                  </Fragment>
                ))}
              </div>

              {/* Key insight row */}
              <div className="mt-4 grid grid-cols-3 gap-2 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                {[
                  { stat: 'Multimodal', label: 'All input types at once' },
                  { stat: 'Cross-verified', label: 'Facts checked against facts' },
                  { stat: 'Strict JSON', label: 'Reliable, parseable output' },
                ].map((item) => (
                  <div key={item.stat} className="text-center">
                    <div className="text-xs font-display font-bold text-gradient">{item.stat}</div>
                    <div className="text-xs opacity-40 mt-0.5">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

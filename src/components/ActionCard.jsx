import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Navigation2, Bell, Calendar, CheckCircle, AlertTriangle, Info, Shield, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { useMagneticHover } from '../hooks/useMagneticHover';
import PropTypes from 'prop-types';

const ACTION_ICONS = {
  call: Phone,
  navigate: Navigation2,
  reminder: Bell,
  book: Calendar,
};

const ACTION_COLORS = {
  call: '#FF4D6D',
  navigate: '#00F5D4',
  reminder: '#7C3AED',
  book: '#FF9F1C',
};

const SEVERITY_CONFIG = {
  CRITICAL: { icon: AlertTriangle, label: 'CRITICAL', pulse: true },
  HIGH: { icon: AlertTriangle, label: 'HIGH', pulse: false },
  MEDIUM: { icon: Info, label: 'MEDIUM', pulse: false },
  LOW: { icon: Shield, label: 'LOW', pulse: false },
};

function ActionButton({ action, index }) {
  const { ref, handleMouseMove, handleMouseLeave } = useMagneticHover({ magnetStrength: 0.2, tiltStrength: 8 });
  const Icon = ACTION_ICONS[action.type] || Bell;
  const color = ACTION_COLORS[action.type] || '#00F5D4';
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.15, type: 'spring', stiffness: 180 }}
    >
      <div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setExpanded((v) => !v)}
        className={`action-${action.type} glass rounded-xl p-3 cursor-none border transition-all duration-300`}
        role="button"
        aria-expanded={expanded}
        aria-label={`${action.label} — click to ${expanded ? 'collapse' : 'expand'} details`}
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded((v) => !v); } }}
        style={{ cursor: 'none' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${color}20`, border: `1px solid ${color}40` }}
          >
            <Icon size={16} style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-display font-semibold leading-tight" style={{ color }}>
              {action.label}
            </div>
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="text-xs opacity-60 leading-snug mt-1">{action.detail}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex-shrink-0 opacity-40">
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function ActionCard({ result, onReset }) {
  const cardRef = useRef(null);
  const { ref: headerRef, handleMouseMove: headerHover, handleMouseLeave: headerLeave } = useMagneticHover({
    magnetStrength: 0.1,
    tiltStrength: 6,
  });
  const [showCrossChecks, setShowCrossChecks] = useState(false);

  const severity = result.severity || 'MEDIUM';
  const SevConfig = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.MEDIUM;
  const SevIcon = SevConfig.icon;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 120, damping: 16 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Card */}
      <div
        className="glass gradient-border rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
      >
        {/* Header */}
        <div
          ref={headerRef}
          onMouseMove={headerHover}
          onMouseLeave={headerLeave}
          className="p-5 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.06)', cursor: 'none' }}
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 250 }}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display font-bold tracking-wider badge-${severity} ${SevConfig.pulse ? 'animate-pulse-border' : ''}`}
                >
                  <SevIcon size={12} />
                  {severity}
                </motion.span>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.5 }}
                  transition={{ delay: 0.4 }}
                  className="text-xs"
                >
                  {result.confidence}% confidence
                </motion.span>
              </div>
              <h2 className="font-display font-bold text-lg text-white leading-snug">
                Action Plan Ready
              </h2>
            </div>

            {/* Confidence ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="flex-shrink-0 relative w-14 h-14"
            >
              <svg viewBox="0 0 56 56" className="w-14 h-14 -rotate-90">
                <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
                <motion.circle
                  cx="28" cy="28" r="24"
                  fill="none"
                  stroke="url(#confGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 24}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 24 * (1 - result.confidence / 100) }}
                  transition={{ delay: 0.5, duration: 1.2, ease: 'easeOut' }}
                />
                <defs>
                  <linearGradient id="confGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00F5D4" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-display font-bold text-gradient">{result.confidence}%</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Verified Facts */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <CheckCircle size={13} style={{ color: 'var(--teal)' }} />
              <span className="text-xs font-display font-semibold uppercase tracking-wider" style={{ color: 'var(--teal)' }}>
                Verified Facts
              </span>
            </div>
            <div className="space-y-1.5">
              {result.verified_facts?.map((fact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-2"
                >
                  <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: 'var(--teal)' }}>✓</span>
                  <span className="text-sm opacity-75 leading-snug">{fact}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div>
            <div className="flex items-center gap-1.5 mb-2.5">
              <span className="text-xs font-display font-semibold uppercase tracking-wider opacity-60">
                Recommended Actions
              </span>
            </div>
            <div className="space-y-2">
              {result.actions?.map((action, i) => (
                <ActionButton key={i} action={action} index={i} />
              ))}
            </div>
          </div>

          {/* Cross-checks (collapsible) */}
          {result.cross_checks?.length > 0 && (
            <div>
              <button
                onClick={() => setShowCrossChecks((v) => !v)}
                className="flex items-center gap-1.5 text-xs opacity-40 hover:opacity-70 transition-opacity"
                style={{ cursor: 'none' }}
              >
                {showCrossChecks ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {showCrossChecks ? 'Hide' : 'Show'} cross-verifications ({result.cross_checks.length})
              </button>
              <AnimatePresence>
                {showCrossChecks && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-2 space-y-1"
                  >
                    {result.cross_checks.map((check, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs opacity-50">
                        <span style={{ color: 'var(--violet)' }}>⟳</span>
                        {check}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Footer — "Why this matters" */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="px-5 py-4 border-t"
          style={{
            borderColor: 'rgba(255,255,255,0.06)',
            background: 'linear-gradient(135deg, rgba(0,245,212,0.04), rgba(124,58,237,0.04))',
          }}
        >
          <div className="flex items-start gap-2">
            <span className="text-sm flex-shrink-0">💡</span>
            <p className="text-xs leading-relaxed opacity-60 italic">{result.why_this_matters}</p>
          </div>
        </motion.div>
      </div>

      {/* Reset button */}
      <motion.button
        onClick={onReset}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="mt-4 w-full py-3 glass rounded-xl text-sm opacity-50 hover:opacity-80 transition-opacity flex items-center justify-center gap-2"
        style={{ cursor: 'none' }}
      >
        <RotateCcw size={14} />
        Try Another Scenario
      </motion.button>
    </motion.div>
  );
}

ActionCard.propTypes = {
  result: PropTypes.shape({
    severity: PropTypes.oneOf(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
    verified_facts: PropTypes.arrayOf(PropTypes.string),
    actions: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['call', 'navigate', 'reminder', 'book']).isRequired,
        detail: PropTypes.string.isRequired,
      })
    ),
    confidence: PropTypes.number,
    why_this_matters: PropTypes.string,
    cross_checks: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onReset: PropTypes.func.isRequired,
};

import { motion, AnimatePresence } from 'framer-motion';
import { demoScenarios } from '../lib/demoData';
import { Zap } from 'lucide-react';
import PropTypes from 'prop-types';

/**
 * DemoScenarios — a grid of pre-built demo cards the user can click
 * to pre-fill the input zone with curated emergency scenarios.
 *
 * @param {Object}   props
 * @param {string|null} props.activeId — currently selected scenario ID
 * @param {Function}    props.onSelect — callback fired with scenario ID on click
 */
export default function DemoScenarios({ activeId, onSelect }) {
  return (
    <div className="w-full max-w-2xl mx-auto" role="group" aria-label="Demo scenario selector">
      <div className="flex items-center gap-2 mb-3">
        <Zap size={14} style={{ color: 'var(--teal)' }} aria-hidden="true" />
        <span className="text-xs font-display font-semibold uppercase tracking-widest opacity-60">
          Try a Demo Scenario
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {demoScenarios.map((scenario, i) => {
          const isActive = activeId === scenario.id;
          return (
            <motion.button
              key={scenario.id}
              onClick={() => onSelect(scenario.id)}
              aria-pressed={isActive ? 'true' : 'false'}
              aria-label={`${scenario.label} — ${scenario.description}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 200 }}
              whileHover={{ y: -3, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              className={`demo-card glass rounded-xl p-3 text-left transition-all duration-300 ${isActive ? 'active' : ''}`}
              style={{
                borderColor: isActive ? scenario.color : 'rgba(255,255,255,0.06)',
                boxShadow: isActive ? `0 0 20px ${scenario.color}30` : 'none',
                background: isActive ? `${scenario.color}0D` : undefined,
                cursor: 'none',
              }}
            >
              <div className="text-2xl mb-1.5" aria-hidden="true">{scenario.icon}</div>
              <div
                className="text-xs font-display font-semibold mb-0.5 leading-tight"
                style={{ color: isActive ? scenario.color : 'rgba(255,255,255,0.8)' }}
              >
                {scenario.label}
              </div>
              <div className="text-xs opacity-40 leading-snug">{scenario.description}</div>

              {isActive && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="mt-2 h-px rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${scenario.color}, transparent)`,
                    transformOrigin: 'left',
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

DemoScenarios.propTypes = {
  activeId: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
};

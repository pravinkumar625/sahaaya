import { motion } from 'framer-motion';
import { contextFeeds } from '../lib/contextFeeds';
import { Wifi, Wind, Navigation, Newspaper } from 'lucide-react';

const icons = { weather: Wind, traffic: Navigation, news: Newspaper };
const colors = {
  weather: { dot: '#00F5D4', bg: 'rgba(0,245,212,0.08)' },
  traffic: { dot: '#FF9F1C', bg: 'rgba(255,159,28,0.08)' },
  news: { dot: '#FF4D6D', bg: 'rgba(255,77,109,0.08)' },
};

export default function ContextFeed() {
  return (
    <section className="space-y-2" aria-label="Live context data feeds">
      <div className="flex items-center gap-2 mb-3">
        <Wifi size={14} className="text-accent-teal" style={{ color: 'var(--teal)' }} />
        <span className="text-xs font-display font-semibold uppercase tracking-widest" style={{ color: 'var(--teal)' }}>
          Live Context Feeds
        </span>
        <span className="ml-auto flex items-center gap-1">
          <span
            className="w-1.5 h-1.5 rounded-full animate-pulse"
            style={{ background: '#00F5D4', boxShadow: '0 0 6px #00F5D4' }}
          />
          <span className="text-xs opacity-50">Live</span>
        </span>
      </div>

      {Object.entries(contextFeeds).map(([key, feed], idx) => {
        const Icon = icons[key];
        const col = colors[key];

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass rounded-xl p-3"
            style={{ background: col.bg, borderColor: `${col.dot}22` }}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: col.dot, boxShadow: `0 0 6px ${col.dot}` }}
              />
              <Icon size={12} style={{ color: col.dot }} />
              <span className="text-xs font-semibold" style={{ color: col.dot }}>
                {feed.label}
              </span>
              <span className="ml-auto text-xs opacity-40">{feed.source}</span>
            </div>

            {key === 'news' ? (
              <div className="space-y-1">
                {feed.data.slice(0, 2).map((item, i) => (
                  <div key={i} className="text-xs opacity-60 leading-snug truncate">
                    {item.headline}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs opacity-60 leading-snug">
                {key === 'weather'
                  ? `${feed.data.condition} · ${feed.data.rainfall} · Wind ${feed.data.windSpeed}`
                  : `${feed.data.status} · ${feed.data.delay}`}
              </div>
            )}
          </motion.div>
        );
      })}
    </section>
  );
}

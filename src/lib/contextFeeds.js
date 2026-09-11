// Mock live context feeds — traffic, weather, local news
// These simulate what a real integration would pull from live APIs

export const contextFeeds = {
  weather: {
    label: 'Weather Feed',
    icon: '🌦️',
    source: 'IMD Live',
    data: {
      location: 'Mumbai–Pune Corridor',
      condition: 'Heavy Rain',
      rainfall: '52mm/hr at Khalapur',
      temperature: '24°C',
      humidity: '94%',
      windSpeed: '67 km/hr',
      visibility: '180m',
      alert: '⚠️ Red alert: Avoid non-essential travel on NH-48',
      forecast: 'Improving after 3PM — rain subsides to light drizzle',
    },
  },
  traffic: {
    label: 'Traffic Feed',
    icon: '🚗',
    source: 'Live Traffic API',
    data: {
      highway: 'NH-48 (Mumbai–Pune Expressway)',
      status: 'Severely Congested',
      delay: '8km jam near Khalapur',
      incidents: ['Landslide alert: km 42', 'Landslide alert: km 56'],
      ndrf: 'NDRF team deployed at Khopoli',
      closure: 'Partial closure expected within 90 minutes',
      alternate: 'Old Mumbai–Pune Highway (via Khandala) — currently clear',
    },
  },
  news: {
    label: 'Local News Feed',
    icon: '📰',
    source: 'PTI / ANI',
    data: [
      {
        headline: 'Flash flood warning issued for Raigad, Pune districts',
        time: '45 mins ago',
        severity: 'HIGH',
      },
      {
        headline: 'NDRF units deployed at Khopoli and Lonavala',
        time: '1.2 hrs ago',
        severity: 'HIGH',
      },
      {
        headline: 'IMD forecasts 3-day heavy rainfall across Western Maharashtra',
        time: '3 hrs ago',
        severity: 'MEDIUM',
      },
      {
        headline: 'Two vehicles stuck in waterlogging near Khalapur toll',
        time: '22 mins ago',
        severity: 'HIGH',
      },
    ],
  },
};

export const getContextSummary = () => {
  const { weather, traffic, news } = contextFeeds;
  return `
LIVE WEATHER: ${weather.data.condition}, ${weather.data.rainfall}, Wind ${weather.data.windSpeed}. Alert: ${weather.data.alert}.
LIVE TRAFFIC: ${traffic.data.highway} — ${traffic.data.status}. ${traffic.data.delay}. Incidents: ${traffic.data.incidents.join(', ')}.
LIVE NEWS: ${news.data.map((n) => n.headline).join(' | ')}
  `.trim();
};

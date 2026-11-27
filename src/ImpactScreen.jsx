import { useState } from 'react'

const PERIODS = {
  Week: { labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'], bars: [40, 65, 50, 82, 63, 100, 75] },
  Month: { labels: ['W1', 'W2', 'W3', 'W4'], bars: [55, 70, 62, 90] },
  Year: { labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'], bars: [30, 38, 45, 50, 55, 48, 60, 66, 72, 70, 82, 90] },
}

const CATEGORIES = [
  { name: 'Plastic', value: 82, color: '#1f6b4a' },
  { name: 'Energy', value: 65, color: '#f0a35a' },
  { name: 'Water', value: 74, color: '#7ab0cc' },
  { name: 'Food', value: 68, color: '#c5e07a' },
]

const sectionTitle = {
  fontSize: 13,
  letterSpacing: 1,
  color: 'var(--muted)',
  margin: '24px 0 10px',
  fontWeight: 600,
}

export default function ImpactScreen({ score = 78 }) {
  const [period, setPeriod] = useState('Week')
  const { labels, bars } = PERIODS[period]

  return (
    <div>
      <div
        role="group"
        aria-label="Select time period"
        style={{ display: 'flex', background: 'var(--card)', borderRadius: 14, padding: 4, gap: 4 }}
      >
        {Object.keys(PERIODS).map((p) => (
          <button
            key={p}
            type="button"
            aria-pressed={period === p}
            onClick={() => setPeriod(p)}
            style={{
              flex: 1,
              minHeight: 44,
              border: 'none',
              borderRadius: 10,
              fontSize: 15,
              cursor: 'pointer',
              background: period === p ? 'var(--green)' : 'transparent',
              color: period === p ? '#fff' : 'var(--muted)',
            }}
          >
            {p}
          </button>
        ))}
      </div>

      <div
        style={{
          background: 'var(--green)',
          color: '#fff',
          borderRadius: 20,
          padding: '22px 20px',
          marginTop: 16,
        }}
      >
        <div style={{ fontSize: 13, letterSpacing: 1 }}>YOUR ECO SCORE</div>
        <div style={{ fontSize: 48, fontWeight: 700, margin: '8px 0' }}>{score} / 100</div>
        <div style={{ color: '#c5e88a', fontSize: 15 }}>↗ 12% from last {period.toLowerCase()}</div>
      </div>

      <div style={sectionTitle}>{period.toUpperCase()}LY PROGRESS</div>
      <div style={{ background: 'var(--card)', borderRadius: 18, padding: '20px 16px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 150, gap: 6 }}>
          {bars.map((h, i) => (
            <div
              key={i}
              role="img"
              aria-label={`${labels[i]}: ${h}%`}
              style={{
                flex: 1,
                height: `${h}%`,
                background: '#276b4d',
                borderRadius: 8,
                maxWidth: 28,
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, gap: 6 }}>
          {labels.map((l, i) => (
            <div key={i} style={{ flex: 1, maxWidth: 28, textAlign: 'center', fontSize: 12, color: 'var(--muted)' }}>
              {l}
            </div>
          ))}
        </div>
      </div>

      <div style={sectionTitle}>IMPACT BY CATEGORY</div>
      {CATEGORIES.map((c) => (
        <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '16px 0' }}>
          <span style={{ width: 64, fontWeight: 600 }}>{c.name}</span>
          <div
            role="progressbar"
            aria-valuenow={c.value}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${c.name} impact`}
            style={{ flex: 1, height: 12, background: 'var(--border)', borderRadius: 6, overflow: 'hidden' }}
          >
            <div style={{ width: `${c.value}%`, height: '100%', background: c.color, borderRadius: 6 }} />
          </div>
          <span style={{ width: 40, textAlign: 'right', fontSize: 14, color: 'var(--muted)' }}>{c.value}%</span>
        </div>
      ))}
    </div>
  )
}
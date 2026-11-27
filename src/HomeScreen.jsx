const sectionTitle = {
  fontSize: 13,
  letterSpacing: 1,
  color: 'var(--muted)',
  margin: '24px 0 10px',
  fontWeight: 600,
}

const card = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 18,
  padding: 18,
}

export default function HomeScreen({ score = 78, points = 1240, onChallenge }) {
  return (
    <div>
      <div
        style={{
          background: 'var(--green)',
          color: '#fff',
          borderRadius: 24,
          padding: '22px 20px',
        }}
      >
        <div style={{ fontSize: 13, letterSpacing: 1, opacity: 0.85 }}>YOUR IMPACT SCORE</div>
        <div style={{ margin: '6px 0 10px' }}>
          <span style={{ fontSize: 56, fontWeight: 700 }}>{score}</span>
          <span style={{ fontSize: 20, opacity: 0.85 }}> / 100</span>
        </div>
        <div style={{ fontSize: 16 }}>You're doing great! Keep it up.</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }}>
        <div style={card}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>🔥 6-day streak</div>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>You're on a roll</div>
        </div>

        <div style={card}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>✦ {points.toLocaleString()} pts</div>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>Eco points earned</div>
        </div>
      </div>

      <div style={sectionTitle}>TODAY'S CHALLENGE</div>
      <div style={card}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ fontSize: 40 }} aria-hidden="true">♻️</div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Bring a reusable bottle</div>
            <div style={{ color: 'var(--muted)', fontSize: 15, marginTop: 4 }}>
              Skip single-use plastic today
            </div>
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 20,
          }}
        >
          <span style={{ color: 'var(--green)', fontWeight: 700, fontSize: 18 }}>+50 points</span>
          <button
            type="button"
            onClick={onChallenge}
            style={{
              minHeight: 48,
              padding: '0 20px',
              border: 'none',
              borderRadius: 14,
              background: 'var(--green)',
              color: '#fff',
              fontSize: 17,
              cursor: 'pointer',
            }}
          >
            Complete challenge
          </button>
        </div>
      </div>

      <div style={sectionTitle}>YOUR IMPACT THIS WEEK</div>
      <div style={{ ...card, minHeight: 110 }}>
        <div style={{ fontSize: 44, fontWeight: 700, color: 'var(--green)' }}>12%</div>
        <div style={{ color: 'var(--muted)', fontSize: 16 }}>more positive impact than last week</div>
      </div>
    </div>
  )
}

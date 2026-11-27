import { useState } from 'react'

const WEEKLY = [
  { id: 'w1', icon: '🌍', title: 'Zero Waste Week', desc: 'Produce as little trash as you can', pts: 200 },
  { id: 'w2', icon: '🚶', title: 'Walk 5 Days', desc: 'Walk instead of driving', pts: 150 },
  { id: 'w3', icon: '🛍️', title: 'Reusable Bags', desc: 'Skip plastic bags all week', pts: 100 },
]

const FRIENDS = [
  { name: 'Maha', pts: 1860, icon: '🌟' },
  { name: 'Sara', pts: 1540, icon: '🌿' },
  { name: 'You', pts: 0, icon: '💚', you: true },
  { name: 'Noura', pts: 980, icon: '🌸' },
  { name: 'Layan', pts: 760, icon: '🌱' },
]

const card = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 18,
  padding: 16,
}

function ChallengeRow({ item, state, onClick }) {
  const label = !state ? 'Start' : state === 'progress' ? 'Complete' : 'Done'

  return (
    <div style={{ ...card, display: 'flex', gap: 14, alignItems: 'center' }}>
      <div
        aria-hidden="true"
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: 'rgba(31, 107, 74, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30,
          flexShrink: 0,
        }}
      >
        {item.icon}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>{item.title}</div>
        <div style={{ color: 'var(--muted)', fontSize: 14, margin: '2px 0 8px' }}>{item.desc}</div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: 'var(--green)', fontWeight: 700 }}>+{item.pts} pts</span>
          <button
            type="button"
            disabled={state === 'done'}
            onClick={onClick}
            style={{
              minHeight: 44,
              minWidth: 84,
              padding: '0 18px',
              border: 'none',
              borderRadius: 14,
              background: state === 'done' ? 'var(--border)' : 'rgba(31, 107, 74, 0.12)',
              color: 'var(--green)',
              fontSize: 16,
              fontWeight: 600,
              cursor: state === 'done' ? 'default' : 'pointer',
            }}
          >
            {label}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ChallengesScreen({ challenges, status, onAdvance, points = 1240, onInvite }) {
  const [tab, setTab] = useState('Daily')
  const [weeklyStatus, setWeeklyStatus] = useState({})

  function advanceWeekly(id) {
    const s = weeklyStatus[id]
    if (!s) setWeeklyStatus({ ...weeklyStatus, [id]: 'progress' })
    else if (s === 'progress') setWeeklyStatus({ ...weeklyStatus, [id]: 'done' })
  }

  const leaders = FRIENDS.map((f) => (f.you ? { ...f, pts: points } : f)).sort((a, b) => b.pts - a.pts)
  const myRank = leaders.findIndex((l) => l.you) + 1

  return (
    <div>
      <div
        role="group"
        aria-label="Challenge type"
        style={{ display: 'flex', background: 'var(--card)', borderRadius: 16, padding: 4, gap: 4, marginBottom: 14 }}
      >
        {['Daily', 'Weekly', 'Friends'].map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={tab === t}
            onClick={() => setTab(t)}
            style={{
              flex: 1,
              minHeight: 48,
              border: 'none',
              borderRadius: 12,
              fontSize: 16,
              cursor: 'pointer',
              background: tab === t ? 'var(--green)' : 'transparent',
              color: tab === t ? '#fff' : 'var(--muted)',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Daily' && (
        <div style={{ display: 'grid', gap: 12 }}>
          {challenges.map((c) => (
            <ChallengeRow key={c.id} item={c} state={status[c.id]} onClick={() => onAdvance(c)} />
          ))}
        </div>
      )}

      {tab === 'Weekly' && (
        <div style={{ display: 'grid', gap: 12 }}>
          {WEEKLY.map((c) => (
            <ChallengeRow key={c.id} item={c} state={weeklyStatus[c.id]} onClick={() => advanceWeekly(c.id)} />
          ))}
        </div>
      )}

      {tab === 'Friends' && (
        <div>
          <p style={{ color: 'var(--muted)', fontSize: 14, margin: '0 0 12px' }}>
            A little friendly competition goes a long way
          </p>

          <div style={{ background: 'var(--green)', color: '#fff', borderRadius: 24, padding: '20px 22px' }}>
            <div style={{ fontSize: 13, letterSpacing: 1, opacity: 0.9 }}>THIS WEEK'S LEADERS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 10 }}>
              <span style={{ fontSize: 48, fontWeight: 700 }}>#{myRank}</span>
              <span style={{ fontSize: 20 }}>
                {myRank <= 3 ? "You're in the top 3!" : 'Keep going, you can catch up!'}
              </span>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
            {leaders.map((l, i) => (
              <div
                key={l.name}
                style={{ ...card, display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}
              >
                <span style={{ width: 24, fontSize: 24, fontWeight: 700, color: 'var(--green)' }}>{i + 1}</span>
                <span style={{ fontSize: 28 }} aria-hidden="true">{l.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>{l.name}</div>
                  <div style={{ color: 'var(--muted)', fontSize: 14 }}>{l.pts.toLocaleString()} pts</div>
                </div>
                {l.you && <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>YOU</span>}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="btn"
            onClick={onInvite}
            style={{ marginTop: 18 }}
          >
            Invite friends
          </button>
        </div>
      )}
    </div>
  )
}
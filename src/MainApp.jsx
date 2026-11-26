import { useState } from 'react'

const CHALLENGES = [
  { id: 1, icon: '♻️', title: 'No Plastic Day', desc: 'Avoid single-use plastic today', pts: 120 },
  { id: 2, icon: '💡', title: 'Save Energy', desc: 'Switch off unused lights and devices', pts: 100 },
  { id: 3, icon: '🚿', title: 'Shorter Shower', desc: 'Keep your shower under 5 minutes', pts: 80 },
  { id: 4, icon: '🚌', title: 'Public Transport', desc: 'Skip the car for one trip', pts: 150 },
  { id: 5, icon: '🥗', title: 'Plant-Based Meal', desc: 'Swap one meal for a plant-based one', pts: 100 },
]

const REWARDS = [
  { id: 1, icon: '🌱', title: 'Plant a tree', cost: 1000 },
  { id: 2, icon: '🥤', title: 'Reusable cup', cost: 500 },
  { id: 3, icon: '👜', title: 'Eco tote bag', cost: 400 },
  { id: 4, icon: '🌊', title: 'Ocean cleanup', cost: 300 },
]

const TABS = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'challenges', label: 'Challenges', icon: '✓' },
  { id: 'impact', label: 'Impact', icon: '◔' },
  { id: 'rewards', label: 'Rewards', icon: '★' },
  { id: 'profile', label: 'Profile', icon: '☺' },
]

const card = { background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14, padding: 14 }
const hero = { background: 'var(--green)', color: '#fff', borderRadius: 16, padding: 18 }
const smallBtn = { minHeight: 36, padding: '0 14px', border: 'none', borderRadius: 10, background: 'var(--green)', color: '#fff', cursor: 'pointer' }

function Header({ title, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ color: 'var(--green)', fontWeight: 700 }}>eco-swap</div>
      <h2 style={{ margin: '6px 0 2px' }}>{title}</h2>
      <div style={{ color: 'var(--muted)', fontSize: 14 }}>{sub}</div>
    </div>
  )
}

export default function MainApp({ onSignOut }) {
  const [tab, setTab] = useState('home')
  const [status, setStatus] = useState({})
  const [points, setPoints] = useState(1240)
  const [redeemed, setRedeemed] = useState([])

  const done = CHALLENGES.filter((c) => status[c.id] === 'done').length
  const score = Math.min(100, 78 + done * 2)

  function advance(c) {
    const s = status[c.id]
    if (!s) setStatus({ ...status, [c.id]: 'progress' })
    else if (s === 'progress') {
      setStatus({ ...status, [c.id]: 'done' })
      setPoints(points + c.pts)
    }
  }

  function redeem(r) {
    if (points >= r.cost && !redeemed.includes(r.id)) {
      setPoints(points - r.cost)
      setRedeemed([...redeemed, r.id])
    }
  }

  let content
  if (tab === 'home') {
    content = (
      <>
        <Header title="Good morning, Ghala" sub="Small steps, big impact" />
        <div style={hero}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>YOUR IMPACT SCORE</div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>{score} / 100</div>
          <div style={{ fontSize: 13 }}>{done} challenge(s) completed today</div>
        </div>
        <div style={{ ...card, marginTop: 14 }}>
          <div style={{ fontWeight: 600 }}>Today's challenge</div>
          <div style={{ color: 'var(--muted)', fontSize: 14, margin: '4px 0 10px' }}>No Plastic Day · +120 pts</div>
          <button style={smallBtn} onClick={() => setTab('challenges')}>View challenges</button>
        </div>
        <div style={{ ...card, marginTop: 14 }}>
          <div style={{ fontWeight: 600 }}>Reward points</div>
          <div style={{ fontSize: 24, color: 'var(--green)' }}>{points}</div>
        </div>
      </>
    )
  } else if (tab === 'challenges') {
    content = (
      <>
        <Header title="Challenges" sub="Choose a challenge and earn points" />
        <div style={{ display: 'grid', gap: 10 }}>
          {CHALLENGES.map((c) => {
            const s = status[c.id]
            return (
              <div key={c.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 26 }}>{c.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{c.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{c.desc} · +{c.pts} pts</div>
                </div>
                <button style={{ ...smallBtn, opacity: s === 'done' ? 0.5 : 1 }} disabled={s === 'done'} onClick={() => advance(c)}>
                  {!s ? 'Start' : s === 'progress' ? 'Complete' : 'Done'}
                </button>
              </div>
            )
          })}
        </div>
      </>
    )
  } else if (tab === 'impact') {
    const bars = [40, 55, 45, 70, 60, 80, score]
    const cats = [['Food', 70], ['Energy', 55], ['Water', 40], ['Transport', 30]]
    content = (
      <>
        <Header title="Your impact" sub="See the difference you are making" />
        <div style={hero}>
          <div style={{ fontSize: 40, fontWeight: 700 }}>{score} / 100</div>
        </div>
        <div style={{ ...card, marginTop: 14, display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
          {bars.map((h, i) => (
            <div key={i} style={{ flex: 1, height: h + '%', background: 'var(--green)', borderRadius: 6 }} />
          ))}
        </div>
        <div style={{ ...card, marginTop: 14 }}>
          {cats.map(([name, v]) => (
            <div key={name} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 13 }}>{name} · {v}%</div>
              <div style={{ background: 'var(--border)', borderRadius: 6, height: 8 }}>
                <div style={{ width: v + '%', height: 8, borderRadius: 6, background: 'var(--green)' }} />
              </div>
            </div>
          ))}
        </div>
      </>
    )
  } else if (tab === 'rewards') {
    content = (
      <>
        <Header title="Rewards" sub="Use your points on real eco rewards" />
        <div style={hero}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>AVAILABLE POINTS</div>
          <div style={{ fontSize: 40, fontWeight: 700 }}>{points}</div>
        </div>
        <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
          {REWARDS.map((r) => (
            <div key={r.id} style={{ ...card, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: 26 }}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{r.title}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{r.cost} pts</div>
              </div>
              <button
                style={{ ...smallBtn, opacity: points < r.cost || redeemed.includes(r.id) ? 0.5 : 1 }}
                disabled={points < r.cost || redeemed.includes(r.id)}
                onClick={() => redeem(r)}
              >
                {redeemed.includes(r.id) ? 'Redeemed' : 'Redeem'}
              </button>
            </div>
          ))}
        </div>
      </>
    )
  } else {
    content = (
      <>
        <Header title="Ghala" sub="ghala@example.com" />
        <div style={{ ...card, display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
          <div><div style={{ fontSize: 22, color: 'var(--green)' }}>{score}</div><div style={{ fontSize: 12 }}>Score</div></div>
          <div><div style={{ fontSize: 22, color: 'var(--green)' }}>{points}</div><div style={{ fontSize: 12 }}>Points</div></div>
          <div><div style={{ fontSize: 22, color: 'var(--green)' }}>{done}</div><div style={{ fontSize: 12 }}>Done</div></div>
        </div>
        <button className="btn btn-light" style={{ marginTop: 14 }} onClick={onSignOut}>Sign out</button>
      </>
    )
  }

  return (
    <div style={{ padding: '24px 20px 96px' }}>
      {content}
      <nav style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 420, display: 'flex', background: 'var(--card)', borderTop: '1px solid var(--border)' }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{ flex: 1, minHeight: 56, border: 'none', background: 'none', cursor: 'pointer', color: tab === t.id ? 'var(--green)' : 'var(--muted)', fontWeight: tab === t.id ? 700 : 400 }}
          >
            <div style={{ fontSize: 18 }}>{t.icon}</div>
            <div style={{ fontSize: 11 }}>{t.label}</div>
          </button>
        ))}
      </nav>
    </div>
  )
}
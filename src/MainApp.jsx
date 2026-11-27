import { useState, useEffect } from 'react'
import AdaptiveSwapForm from '../AdaptiveSwapForm'
import HomeScreen from './HomeScreen'
import ChallengesScreen from './ChallengesScreen'
import InviteFriends from './InviteFriends'
import ImpactScreen from './ImpactScreen'
import { ProfileHome, EditProfile, Achievements, Settings } from './ProfileScreens'

const CHALLENGES = [
  { id: 1, icon: '♻️', title: 'No Plastic Day', desc: 'Avoid single-use plastics', pts: 50 },
  { id: 2, icon: '💡', title: 'Save Energy', desc: 'Turn off unused lights', pts: 20 },
  { id: 3, icon: '🚿', title: 'Shorter Shower', desc: 'Save water with a 5-min shower', pts: 30 },
  { id: 4, icon: '🚌', title: 'Public Transport', desc: 'Choose greener transport', pts: 40 },
  { id: 5, icon: '🥗', title: 'Plant-Based Meal', desc: 'Try a plant-based meal', pts: 30 },
]

const REWARDS = [
  { id: 1, icon: '🌱', title: 'Plant a tree', cost: 1000 },
  { id: 2, icon: '🥤', title: 'Reusable cup', cost: 500 },
  { id: 3, icon: '👜', title: 'Eco tote bag', cost: 400 },
  { id: 4, icon: '🌊', title: 'Ocean cleanup', cost: 300 },
]

const TABS = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'swap', label: 'Swap', icon: '♻️' },
  { id: 'challenges', label: 'Challenges', icon: '✓' },
  { id: 'impact', label: 'Impact', icon: '◔' },
  { id: 'rewards', label: 'Rewards', icon: '★' },
  { id: 'profile', label: 'Profile', icon: '☺' },
]

const card = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 14,
  padding: 14
}

const hero = {
  background: 'var(--green)',
  color: '#fff',
  borderRadius: 16,
  padding: 18
}

const smallBtn = {
  minHeight: 36,
  padding: '0 14px',
  border: 'none',
  borderRadius: 10,
  background: 'var(--green)',
  color: '#fff',
  cursor: 'pointer'
}

function Header({ title, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ color: 'var(--green)', fontWeight: 700 }}>eco-swap</div>
      <h2 style={{ margin: '6px 0 2px' }}>{title}</h2>
      <div style={{ color: 'var(--muted)', fontSize: 14 }}>{sub}</div>
    </div>
  )
}

export default function MainApp({ onSignOut, logFriction, userName, userEmail }) {
  const [tab, setTab] = useState('home')
  const [status, setStatus] = useState({})
  const [points, setPoints] = useState(1240)
  const [redeemed, setRedeemed] = useState([])
  const [listing, setListing] = useState(null)
  const [published, setPublished] = useState(false)
  const [contrast, setContrast] = useState(false)
  const [profile, setProfile] = useState({
    name: userName || 'Ghala Alharbi',
    email: userEmail || 'ghala@email.com',
    location: 'Jeddah, Saudi Arabia',
    about: 'Making everyday choices greener',
  })

  // whenever the name / email from sign up or sign in changes, update the profile
  useEffect(() => {
    if (userName || userEmail) {
      setProfile((p) => ({
        ...p,
        name: userName || p.name,
        email: userEmail || p.email,
      }))
    }
  }, [userName, userEmail])

  useEffect(() => {
    const el = document.documentElement
    const update = () => setContrast(el.classList.contains('high-contrast-mode'))
    update()
    const observer = new MutationObserver(update)
    observer.observe(el, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  function toggleContrast() {
    document.querySelector('.adaptive-hud button')?.click()
  }

  const done = CHALLENGES.filter((c) => status[c.id] === 'done').length
  const score = Math.min(100, 78 + done * 2)
  const firstName = profile.name.split(' ')[0] || 'friend'

  function advance(c) {
    const s = status[c.id]

    if (!s) {
      setStatus({ ...status, [c.id]: 'progress' })
    } else if (s === 'progress') {
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

  function startSwap() {
    setListing(null)
    setPublished(false)
    setTab('swap')
  }

  let content

  if (tab === 'swap') {
    content = (
      <>
        <button
          style={smallBtn}
          onClick={() => setTab('home')}
        >
          Back to Home
        </button>

        {published ? (
          <div style={{ ...card, marginTop: 14 }} role="status">
            <h2>Listing published!</h2>
            <p>Your item has been added to this demo session.</p>
            <p>Thank you for making a sustainable choice.</p>
            <button style={smallBtn} onClick={startSwap}>
              Swap another item
            </button>
          </div>
        ) : (
          <>
            <div hidden={!!listing}>
              <AdaptiveSwapForm
                onError={(error) => {
                  logFriction?.(
                    `Swap validation: ${error.field} - ${error.reason} (Attempt ${error.count})`,
                    0
                  )
                }}
                onPublish={(data) => setListing(data)}
              />
            </div>

            {listing && (
              <div style={{ ...card, marginTop: 14 }}>
                <h2>Review your listing</h2>
                <p><strong>Item:</strong> {listing.title}</p>
                <p><strong>Description:</strong> {listing.description}</p>
                <p><strong>Condition:</strong> {listing.condition}</p>
                <p><strong>Photo:</strong> {listing.photo?.name}</p>

                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    style={smallBtn}
                    onClick={() => setListing(null)}
                  >
                    Edit details
                  </button>

                  <button
                    style={smallBtn}
                    onClick={() => setPublished(true)}
                  >
                    Publish listing
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </>
    )

  } else if (tab === 'home') {
    content = (
      <>
        <Header title={`Good morning, ${firstName}`} sub="Small steps, big impact" />
        <HomeScreen
          score={score}
          points={points}
          onChallenge={() => setTab('challenges')}
        />
      </>
    )

  } else if (tab === 'challenges') {
    content = (
      <>
        <Header
          title="Challenges"
          sub="Choose a challenge and earn points"
        />

        <ChallengesScreen
          key="challenges"
          challenges={CHALLENGES}
          status={status}
          onAdvance={advance}
          points={points}
          onInvite={() => setTab('invite')}
        />
      </>
    )

  } else if (tab === 'friends') {
    content = (
      <>
        <Header
          title="Friends challenge"
          sub="Compete with your friends"
        />

        <ChallengesScreen
          key="friends"
          initialTab="Friends"
          challenges={CHALLENGES}
          status={status}
          onAdvance={advance}
          points={points}
          onInvite={() => setTab('invite')}
        />
      </>
    )

  } else if (tab === 'invite') {
    content = (
      <InviteFriends
        onDone={() => setTab('challenges')}
        onHome={() => setTab('home')}
      />
    )

  } else if (tab === 'impact') {
    content = (
      <>
        <Header
          title="Your impact"
          sub="See the difference you are making"
        />

        <ImpactScreen score={score} />
      </>
    )

  } else if (tab === 'rewards') {
    content = (
      <>
        <Header
          title="Rewards"
          sub="Use your points on real eco rewards"
        />

        <div style={hero}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>
            AVAILABLE POINTS
          </div>

          <div style={{ fontSize: 40, fontWeight: 700 }}>
            {points}
          </div>
        </div>

        <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
          {REWARDS.map((r) => (
            <div
              key={r.id}
              style={{ ...card, display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <div style={{ fontSize: 26 }}>{r.icon}</div>

              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{r.title}</div>

                <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {r.cost} pts
                </div>
              </div>

              <button
                style={{
                  ...smallBtn,
                  opacity: points < r.cost || redeemed.includes(r.id) ? 0.5 : 1
                }}
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

  } else if (tab === 'edit-profile') {
    content = (
      <EditProfile
        profile={profile}
        onSave={setProfile}
        onHome={() => setTab('home')}
      />
    )

  } else if (tab === 'achievements') {
    content = (
      <Achievements
        onBack={() => setTab('profile')}
        onHome={() => setTab('home')}
      />
    )

  } else if (tab === 'settings') {
    content = (
      <Settings
        onBack={() => setTab('profile')}
        onHome={() => setTab('home')}
        highContrast={contrast}
        onToggleContrast={toggleContrast}
      />
    )

  } else {
    content = (
      <ProfileHome
        profile={profile}
        score={score}
        points={points}
        onNavigate={setTab}
        onSignOut={onSignOut}
      />
    )
  }

  const activeTab =
    ['edit-profile', 'achievements', 'settings'].includes(tab) ? 'profile'
      : tab === 'friends' || tab === 'invite' ? 'challenges'
        : tab

  return (
    <div style={{ padding: '24px 20px 96px' }}>
      {content}

      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: 420,
        display: 'flex',
        background: 'var(--card)',
        borderTop: '1px solid var(--border)'
      }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              flex: 1,
              minHeight: 56,
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: activeTab === t.id ? 'var(--green)' : 'var(--muted)',
              fontWeight: activeTab === t.id ? 700 : 400
            }}
          >
            <div style={{ fontSize: 18 }}>{t.icon}</div>
            <div style={{ fontSize: 11 }}>{t.label}</div>
          </button>
        ))}
      </nav>
    </div>
  )
}
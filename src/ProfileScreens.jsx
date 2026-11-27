import { useState } from 'react'

const card = {
  background: 'var(--card)',
  border: '1px solid var(--border)',
  borderRadius: 16,
  padding: 16,
  boxShadow: 'var(--shadow)',
}

const primaryBtn = {
  width: '100%',
  minHeight: 48,
  borderRadius: 14,
  border: 'none',
  background: 'var(--green)',
  color: '#fff',
  fontSize: 16,
  fontWeight: 600,
  cursor: 'pointer',
}

const linkBtn = {
  width: '100%',
  minHeight: 48,
  background: 'none',
  border: 'none',
  color: 'var(--green)',
  fontSize: 15,
  cursor: 'pointer',
}

function SubHeader({ title, onBack, onHome }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <button
        onClick={onBack}
        aria-label="Back"
        style={{ minHeight: 44, minWidth: 44, background: 'none', border: 'none', color: 'var(--green)', fontSize: 16, cursor: 'pointer' }}
      >
        ‹ Back
      </button>
      <h1 style={{ margin: 0, fontSize: 20, color: 'var(--text-h)' }}>{title}</h1>
      <button
        onClick={onHome}
        aria-label="Home"
        style={{ minHeight: 44, minWidth: 44, background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}
      >
        ⌂
      </button>
    </div>
  )
}

function Row({ icon, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        ...card,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        textAlign: 'left',
        minHeight: 64,
        cursor: 'pointer',
        marginBottom: 10,
        color: 'var(--text)',
      }}
    >
      <span style={{ fontSize: 22 }}>{icon}</span>
      <span style={{ flex: 1 }}>
        <span style={{ display: 'block', fontWeight: 600, color: 'var(--text-h)' }}>{title}</span>
        {subtitle && <span style={{ display: 'block', fontSize: 13, color: 'var(--muted)' }}>{subtitle}</span>}
      </span>
      <span aria-hidden="true" style={{ color: 'var(--muted)' }}>›</span>
    </button>
  )
}

function Avatar({ profile, size = 64 }) {
  const leaf = profile.avatar === 'leaf'
  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.25)',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.45,
        fontWeight: 700,
      }}
    >
      {leaf ? '🌿' : (profile.name || 'E').charAt(0).toUpperCase()}
    </div>
  )
}

/* ---------------- Profile home ---------------- */
export function ProfileHome({ profile, score, points, onNavigate, onSignOut }) {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ background: 'var(--green)', color: '#fff', borderRadius: 20, padding: 20, marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Avatar profile={profile} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{profile.name}</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>{profile.email}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.18)', borderRadius: 12, padding: 10, textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{score}</div>
            <div style={{ fontSize: 12 }}>Eco score</div>
          </div>
          <div style={{ flex: 1, background: 'rgba(255,255,255,0.18)', borderRadius: 12, padding: 10, textAlign: 'center' }}>
            <div style={{ fontWeight: 700, fontSize: 18 }}>{points}</div>
            <div style={{ fontSize: 12 }}>Points</div>
          </div>
        </div>
      </div>

      <div style={{ fontSize: 12, letterSpacing: 1, color: 'var(--muted)', margin: '8px 4px' }}>ACCOUNT</div>
      <Row icon="✏️" title="Edit profile" subtitle="Name, email, location" onClick={() => onNavigate('edit-profile')} />
      <Row icon="🏆" title="Achievements" subtitle="Your badges" onClick={() => onNavigate('achievements')} />
      <Row icon="👥" title="Friends challenge" subtitle="Compete with friends" onClick={() => onNavigate('friends')} />
      <Row icon="⚙️" title="Settings" subtitle="Notifications, appearance" onClick={() => onNavigate('settings')} />
      <button onClick={onSignOut} style={{ ...linkBtn, color: '#b3261e', marginTop: 8 }}>Sign out</button>
    </div>
  )
}

/* ---------------- Edit profile ---------------- */
export function EditProfile({ profile, onSave, onHome }) {
  const [view, setView] = useState('form')
  const [draft, setDraft] = useState({ ...profile })
  const [saved, setSaved] = useState(false)
  const [warn, setWarn] = useState(false)

  const set = (key, value) => {
    setSaved(false)
    setDraft((d) => ({ ...d, [key]: value }))
  }

  const setEmail = (value) => {
    if (/[^\x20-\x7E]/.test(value)) {
      setWarn(true)
      value = value.replace(/[^\x20-\x7E]/g, '')
    } else {
      setWarn(false)
    }
    set('email', value)
  }

  const save = () => {
    if (onSave) onSave(draft)
    setSaved(true)
  }

  if (view === 'photo') {
    return (
      <div style={{ padding: 16 }}>
        <h1 style={{ fontSize: 24, color: 'var(--text-h)', marginTop: 24 }}>Choose profile image</h1>
        <p style={{ color: 'var(--muted)' }}>Try a sample profile to preview the editing flow.</p>
        <button
          style={primaryBtn}
          onClick={() => {
            set('avatar', 'leaf')
            setView('form')
          }}
        >
          Use leaf avatar
        </button>
        <button style={{ ...linkBtn, marginTop: 12 }} onClick={() => setView('form')}>
          Cancel
        </button>
      </div>
    )
  }

  const input = {
    width: '100%',
    minHeight: 48,
    borderRadius: 12,
    border: '1px solid var(--border)',
    padding: '0 12px',
    fontSize: 16,
    background: 'var(--card)',
    color: 'var(--text)',
    boxSizing: 'border-box',
  }

  return (
    <div style={{ padding: 16 }}>
      <SubHeader title="Edit profile" onBack={onHome} onHome={onHome} />

      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ display: 'inline-block', background: 'var(--green)', borderRadius: '50%' }}>
          <Avatar profile={draft} size={84} />
        </div>
        <div>
          <button onClick={() => setView('photo')} style={{ ...linkBtn, width: 'auto', padding: '0 12px' }}>
            Change photo
          </button>
        </div>
      </div>

      <label style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Name</label>
      <input style={{ ...input, marginBottom: 12 }} value={draft.name || ''} onChange={(e) => set('name', e.target.value)} />

      <label style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>Email</label>
      <input style={{ ...input, marginBottom: 4 }} type="email" value={draft.email || ''} onChange={(e) => setEmail(e.target.value)} />
      {warn && (
        <div role="alert" style={{ color: '#b3261e', fontSize: 13, marginBottom: 8 }}>
          English characters only
        </div>
      )}

      <label style={{ display: 'block', fontSize: 13, color: 'var(--muted)', margin: '8px 0 4px' }}>Location</label>
      <input style={{ ...input, marginBottom: 12 }} value={draft.location || ''} onChange={(e) => set('location', e.target.value)} />

      <label style={{ display: 'block', fontSize: 13, color: 'var(--muted)', marginBottom: 4 }}>About</label>
      <textarea
        style={{ ...input, minHeight: 90, padding: 12, marginBottom: 16, fontFamily: 'inherit' }}
        value={draft.about || ''}
        onChange={(e) => set('about', e.target.value)}
      />

      <button style={primaryBtn} onClick={save}>Save changes</button>
      {saved && (
        <div role="status" style={{ textAlign: 'center', color: 'var(--green)', marginTop: 12, fontWeight: 600 }}>
          Changes saved ✓
        </div>
      )}
      <button style={{ ...linkBtn, marginTop: 8 }} onClick={onHome}>Back to profile</button>
    </div>
  )
}

/* ---------------- Achievements ---------------- */
const BADGES = [
  { id: 'starter', icon: '🌱', name: 'Green Starter', unlocked: true },
  { id: 'plastic', icon: '♻️', name: 'Plastic Hero', unlocked: true },
  { id: 'water', icon: '💧', name: 'Water Saver', unlocked: true },
  { id: 'streak', icon: '🔥', name: '7-Day Streak', unlocked: true },
  { id: 'planet', icon: '🌍', name: 'Planet Protector', unlocked: false },
  { id: 'commuter', icon: '🚌', name: 'Clean Commuter', unlocked: false },
]

function goToChallenges() {
  // press the "Challenges" tab in the bottom bar
  const buttons = document.querySelectorAll('nav button')
  if (buttons[2]) buttons[2].click()
}

export function Achievements({ onBack, onHome, onExplore }) {
  const [open, setOpen] = useState(null)
  const badge = BADGES.find((b) => b.id === open)

  if (badge) {
    return (
      <div style={{ padding: 16 }}>
        <div style={{ textAlign: 'center', fontSize: 56, marginTop: 24 }} aria-hidden="true">{badge.icon}</div>
        <h1 style={{ fontSize: 24, color: 'var(--text-h)', textAlign: 'center' }}>{badge.name}</h1>
        <p style={{ color: 'var(--muted)', textAlign: 'center' }}>
          Keep completing green activities to reach your next milestone.
        </p>
        <button style={primaryBtn} onClick={onExplore || goToChallenges}>Explore challenges</button>
        <button style={{ ...linkBtn, marginTop: 12 }} onClick={() => setOpen(null)}>Back to achievements</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 16 }}>
      <SubHeader title="Achievements" onBack={onBack} onHome={onHome} />
      <div style={{ ...card, textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--green)' }}>8 / 20</div>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>badges unlocked</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        {BADGES.map((b) => (
          <button
            key={b.id}
            onClick={() => setOpen(b.id)}
            aria-label={`${b.name}, ${b.unlocked ? 'unlocked' : 'locked'}`}
            style={{
              ...card,
              minHeight: 110,
              cursor: 'pointer',
              opacity: b.unlocked ? 1 : 0.55,
              color: 'var(--text)',
            }}
          >
            <div style={{ fontSize: 30 }} aria-hidden="true">{b.icon}</div>
            <div style={{ fontWeight: 600, fontSize: 14, marginTop: 6 }}>{b.name}</div>
          </button>
        ))}
      </div>
      <button style={primaryBtn} onClick={onBack}>Back to profile</button>
    </div>
  )
}

/* ---------------- Settings ---------------- */
function InfoPage({ title, text, onBack, children }) {
  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ fontSize: 24, color: 'var(--text-h)', marginTop: 24 }}>{title}</h1>
      <p style={{ color: 'var(--muted)', lineHeight: 1.5 }}>{text}</p>
      {children}
      <button style={{ ...linkBtn, marginTop: 12 }} onClick={onBack}>Back to settings</button>
    </div>
  )
}

const AUDIT = [
  {
    title: '1. Touch targets',
    text: 'Before: Start and Redeem had 38 px-high tap areas. After: their active tap areas are at least 44 px high.',
  },
  {
    title: '2. Button contrast',
    text: 'Before: the new swap and recommendation actions had no defined color pair. After: white labels on dark green use approximately 8.5:1 contrast.',
  },
  {
    title: '3. Error identification',
    text: 'Before: the swap flow had no error feedback. After: each error shows a warning symbol, a specific explanation and a recovery button.',
  },
]

export function Settings({ onBack, onHome, highContrast, onToggleContrast }) {
  const [page, setPage] = useState(null)
  const [reminders, setReminders] = useState(true)
  const back = () => setPage(null)

  if (page === 'notifications') {
    return (
      <InfoPage title="Notifications" text={reminders ? 'Reminders are on.' : 'Reminders are off.'} onBack={back}>
        <button style={primaryBtn} onClick={() => setReminders((r) => !r)}>
          {reminders ? 'Turn off reminders' : 'Turn on reminders'}
        </button>
      </InfoPage>
    )
  }
  if (page === 'appearance') {
    return (
      <InfoPage
        title="Appearance"
        text={highContrast ? 'High contrast mode is on.' : 'Eco-Swap uses a light, nature-inspired theme.'}
        onBack={back}
      >
        <button style={primaryBtn} aria-pressed={highContrast} onClick={onToggleContrast}>
          {highContrast ? 'Turn off high contrast' : 'Turn on high contrast'}
        </button>
      </InfoPage>
    )
  }
  if (page === 'language') {
    return <InfoPage title="Language" text="English is selected for this prototype." onBack={back} />
  }
  if (page === 'privacy') {
    return (
      <InfoPage
        title="Privacy"
        text="You control your profile information. This prototype does not access your location or share your data."
        onBack={back}
      />
    )
  }
  if (page === 'help') {
    return (
      <InfoPage
        title="How Eco-Swap works"
        text="Start a challenge, complete the activity, then view your impact. Use reward points after confirming a redemption."
        onBack={back}
      />
    )
  }
  if (page === 'about') {
    return <InfoPage title="About Eco-Swap" text="Small steps, big impact. Eco-Swap · Version 2.0" onBack={back} />
  }
  if (page === 'audit') {
    return (
      <div style={{ padding: 16 }}>
        <h1 style={{ fontSize: 28, color: 'var(--green)', marginTop: 16 }}>Accessibility audit</h1>
        {AUDIT.map((item) => (
          <section key={item.title} style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, color: 'var(--green)', marginBottom: 8 }}>{item.title}</h2>
            <p style={{ color: 'var(--green)', lineHeight: 1.5, margin: 0 }}>{item.text}</p>
          </section>
        ))}
        <button style={primaryBtn} onClick={back}>Back to settings</button>
      </div>
    )
  }

  return (
    <div style={{ padding: 16 }}>
      <SubHeader title="Settings" onBack={onBack} onHome={onHome} />
      <div style={{ fontSize: 12, letterSpacing: 1, color: 'var(--muted)', margin: '8px 4px' }}>PREFERENCES</div>
      <Row icon="🔔" title="Notifications" subtitle="Manage reminders and alerts" onClick={() => setPage('notifications')} />
      <Row icon="🌙" title="Appearance" subtitle={highContrast ? 'High contrast' : 'Light mode'} onClick={() => setPage('appearance')} />
      <Row icon="🌐" title="Language" subtitle="English" onClick={() => setPage('language')} />
      <div style={{ fontSize: 12, letterSpacing: 1, color: 'var(--muted)', margin: '16px 4px 8px' }}>ACCOUNT & PRIVACY</div>
      <Row icon="🔒" title="Privacy" subtitle="Your data and permissions" onClick={() => setPage('privacy')} />
      <Row icon="❓" title="Help & support" subtitle="FAQs and contact" onClick={() => setPage('help')} />
      <Row icon="ℹ️" title="About Eco-Swap" subtitle="Version 2.0" onClick={() => setPage('about')} />
      <Row icon="♿" title="Accessibility audit" subtitle="Touch targets, contrast, errors" onClick={() => setPage('audit')} />
      <button style={{ ...primaryBtn, marginTop: 8 }} onClick={onBack}>Back to profile</button>
    </div>
  )
}
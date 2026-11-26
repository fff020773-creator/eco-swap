import { useState, useEffect } from 'react'
import { useAdaptiveUX } from './useAdaptiveUX'
import MainApp from './MainApp'

function Screen({ children }) {
  return (
    <div style={{ padding: 24, minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 14 }}>
      {children}
    </div>
  )
}

function Field({ label, type = 'text', placeholder }) {
  const englishOnly = type === 'email' || type === 'password'
  const [value, setValue] = useState('')
  const [warn, setWarn] = useState(false)

  function handleChange(e) {
    const raw = e.target.value
    if (englishOnly) {
      const clean = raw.replace(/[^\x20-\x7E]/g, '')
      setWarn(clean !== raw)
      setValue(clean)
    } else {
      setValue(raw)
    }
  }

  return (
    <label style={{ display: 'block', fontSize: 12, color: 'var(--muted)', letterSpacing: 1 }}>
      {label}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        dir={englishOnly ? 'ltr' : undefined}
        placeholder={placeholder}
        style={{ display: 'block', width: '100%', minHeight: 48, marginTop: 6, padding: '0 14px', border: '1px solid var(--border)', borderRadius: 12, fontSize: 16, background: 'var(--card)' }}
      />
      {warn && (
        <span role="alert" style={{ color: '#b3261e', fontSize: 12 }}>
          English characters only
        </span>
      )}
    </label>
  )
}

function Link({ onClick, children }) {
  return (
    <button onClick={onClick} style={{ background: 'none', border: 'none', color: 'var(--green)', fontSize: 15, minHeight: 44, cursor: 'pointer' }}>
      {children}
    </button>
  )
}

export default function App() {
  const [screen, setScreen] = useState('welcome')

  const {
    highContrast,
    setHighContrast,
    frictionLog,
    logFriction
  } = useAdaptiveUX({
    dwellThresholdMs: 7000,
    idleThresholdMs: 4000,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      logFriction(`Dwell/hesitation on "${screen}" screen`, 7000)
    }, 7000)

    return () => clearTimeout(timer)
  }, [screen, logFriction])

  const hud = (
    <div className="adaptive-hud" role="region" aria-label="Adaptive UX Controls">
      <span>Friction Logs: {frictionLog.length}</span>

      <button
        type="button"
        onClick={() => setHighContrast((prev) => !prev)}
      >
        {highContrast ? 'Disable High Contrast' : 'Enable High Contrast'}
      </button>
    </div>
  )

  if (screen === 'app') {
    return (
      <>
        <MainApp
          onSignOut={() => setScreen('welcome')}
          logFriction={logFriction}
        />
        {hud}
      </>
    )
  }

  if (screen === 'welcome') {
    return (
      <>
        <Screen>
          <h1 style={{ color: 'var(--green)', margin: 0 }}>
            eco-swap
          </h1>

          <p style={{ margin: 0, color: 'var(--muted)' }}>
            Small steps, big impact
          </p>

          <h2 style={{ margin: '24px 0 0' }}>
            Make every choice count
          </h2>

          <p style={{ color: 'var(--muted)' }}>
            Swap habits, save resources, and grow a greener community.
          </p>

          <button
            className="btn"
            onClick={() => setScreen('create')}
          >
            Create account
          </button>

          <button
            className="btn btn-light"
            onClick={() => setScreen('signin')}
          >
            I already have an account
          </button>

          <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
            By continuing, you agree to our Terms & Privacy Policy.
          </p>
        </Screen>

        {hud}
      </>
    )
  }

  if (screen === 'signin') {
    return (
      <>
        <Screen>
          <h1 style={{ color: 'var(--green)', margin: 0 }}>
            eco-swap
          </h1>

          <h2 style={{ margin: 0 }}>
            Welcome back
          </h2>

          <p style={{ margin: 0, color: 'var(--muted)' }}>
            Sign in to continue your eco journey.
          </p>

          <Field
            label="EMAIL ADDRESS"
            type="email"
            placeholder="you@example.com"
          />

          <Field
            label="PASSWORD"
            type="password"
            placeholder="Enter your password"
          />

          <Link onClick={() => setScreen('forgot')}>
            Forgot password?
          </Link>

          <button
            className="btn"
            onClick={() => setScreen('app')}
          >
            Sign in
          </button>

          <Link onClick={() => setScreen('create')}>
            Don't have an account? Create one
          </Link>
        </Screen>

        {hud}
      </>
    )
  }

  if (screen === 'create') {
    return (
      <>
        <Screen>
          <h1 style={{ color: 'var(--green)', margin: 0 }}>
            eco-swap
          </h1>

          <h2 style={{ margin: 0 }}>
            Create your account
          </h2>

          <p style={{ margin: 0, color: 'var(--muted)' }}>
            Join the Eco-Swap community.
          </p>

          <Field
            label="FULL NAME"
            placeholder="Your name"
          />

          <Field
            label="EMAIL ADDRESS"
            type="email"
            placeholder="you@example.com"
          />

          <Field
            label="PASSWORD"
            type="password"
            placeholder="Create a password"
          />

          <button
            className="btn"
            onClick={() => setScreen('app')}
          >
            Create account
          </button>

          <Link onClick={() => setScreen('signin')}>
            Already have an account? Sign in
          </Link>

          <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
            Your details stay private and secure.
          </p>
        </Screen>

        {hud}
      </>
    )
  }

  return (
    <>
      <Screen>
        <Link onClick={() => setScreen('signin')}>
          ← Back to sign in
        </Link>

        <h2 style={{ margin: 0 }}>
          Forgot your password?
        </h2>

        <p style={{ color: 'var(--muted)' }}>
          Enter your email and we'll send you a reset link.
        </p>

        <Field
          label="EMAIL ADDRESS"
          type="email"
          placeholder="you@example.com"
        />

        <button className="btn">
          Send reset link
        </button>

        <p style={{ fontSize: 12, color: 'var(--muted)', textAlign: 'center' }}>
          Didn't receive an email? Check your spam folder.
        </p>
      </Screen>

      {hud}
    </>
  )
}

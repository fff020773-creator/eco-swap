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

function Field({ label, type = 'text', placeholder, value, onChange, error }) {
  const englishOnly = type === 'email' || type === 'password'
  const [warn, setWarn] = useState(false)

  function handleChange(e) {
    const raw = e.target.value
    if (englishOnly) {
      const clean = raw.replace(/[^\x20-\x7E]/g, '')
      setWarn(clean !== raw)
      onChange(clean)
    } else {
      onChange(raw)
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
        aria-invalid={error ? 'true' : 'false'}
        style={{
          display: 'block',
          width: '100%',
          minHeight: 48,
          marginTop: 6,
          padding: '0 14px',
          border: error ? '2px solid #d93025' : '1px solid var(--border)',
          borderRadius: 12,
          fontSize: 16,
          background: 'var(--card)',
        }}
      />
      {warn && (
        <span role="alert" style={{ display: 'block', color: '#b3261e', fontSize: 12, marginTop: 4 }}>
          English characters only
        </span>
      )}
      {error && (
        <span role="alert" style={{ display: 'block', color: '#d93025', fontSize: 13, marginTop: 4, letterSpacing: 0 }}>
          ⚠ {error}
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

function FormAlert({ children }) {
  if (!children) return null
  return (
    <div
      role="alert"
      style={{
        border: '2px solid #d93025',
        borderRadius: 12,
        padding: '10px 14px',
        color: '#d93025',
        background: 'var(--card)',
        fontSize: 14,
        fontWeight: 600,
      }}
    >
      ⚠ {children}
    </div>
  )
}

const REQUIRED = 'This field is required.'

function nameFromEmail(email) {
  const local = email.split('@')[0].replace(/[^a-zA-Z]+/g, ' ').trim().split(' ')[0]
  if (!local) return 'Friend'
  return local.charAt(0).toUpperCase() + local.slice(1).toLowerCase()
}

const validEmail = (e) => /^\S+@\S+\.\S+$/.test(e)

export default function App() {
  const [screen, setScreen] = useState('welcome')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [resetSent, setResetSent] = useState(false)

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

  function goTo(next) {
    setErrors({})
    setFormError('')
    setResetSent(false)
    setScreen(next)
  }

  function clearError(key) {
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    setFormError('')
  }

  // returns true when the form is OK, otherwise shows the errors
  function validate(fields, message) {
    const found = {}
    if (fields.includes('name') && !fullName.trim()) found.name = REQUIRED
    if (fields.includes('email')) {
      if (!email.trim()) found.email = REQUIRED
      else if (!validEmail(email.trim())) found.email = 'Please enter a valid email address.'
    }
    if (fields.includes('password') && !password) found.password = REQUIRED

    setErrors(found)
    if (Object.keys(found).length > 0) {
      setFormError(message)
      logFriction(`Form validation error on "${screen}" screen: ${Object.keys(found).join(', ')}`, 0)
      return false
    }
    setFormError('')
    return true
  }

  const displayName = fullName.trim() || nameFromEmail(email)

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
          onSignOut={() => goTo('welcome')}
          logFriction={logFriction}
          userName={displayName}
          userEmail={email}
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
            onClick={() => goTo('create')}
          >
            Create account
          </button>

          <button
            className="btn btn-light"
            onClick={() => goTo('signin')}
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
            value={email}
            onChange={(v) => { setEmail(v); clearError('email') }}
            error={errors.email}
          />

          <Field
            label="PASSWORD"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(v) => { setPassword(v); clearError('password') }}
            error={errors.password}
          />

          <Link onClick={() => goTo('forgot')}>
            Forgot password?
          </Link>

          <FormAlert>{formError}</FormAlert>

          <button
            className="btn"
            onClick={() => {
              if (validate(['email', 'password'], 'Please enter your email and password.')) {
                goTo('app')
              }
            }}
          >
            Sign in
          </button>

          <Link onClick={() => goTo('create')}>
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
            value={fullName}
            onChange={(v) => { setFullName(v); clearError('name') }}
            error={errors.name}
          />

          <Field
            label="EMAIL ADDRESS"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(v) => { setEmail(v); clearError('email') }}
            error={errors.email}
          />

          <Field
            label="PASSWORD"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(v) => { setPassword(v); clearError('password') }}
            error={errors.password}
          />

          <FormAlert>{formError}</FormAlert>

          <button
            className="btn"
            onClick={() => {
              if (validate(['name', 'email', 'password'], 'Please fill in all required fields.')) {
                goTo('app')
              }
            }}
          >
            Create account
          </button>

          <Link onClick={() => goTo('signin')}>
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
        <Link onClick={() => goTo('signin')}>
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
          value={email}
          onChange={(v) => { setEmail(v); clearError('email'); setResetSent(false) }}
          error={errors.email}
        />

        <FormAlert>{formError}</FormAlert>

        {resetSent && (
          <div
            role="status"
            style={{ border: '2px solid var(--green)', borderRadius: 12, padding: '10px 14px', color: 'var(--green)', fontWeight: 600 }}
          >
            Reset link sent ✓ Check your email.
          </div>
        )}

        <button
          className="btn"
          onClick={() => {
            if (validate(['email'], 'Please enter your email address.')) {
              setResetSent(true)
            }
          }}
        >
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
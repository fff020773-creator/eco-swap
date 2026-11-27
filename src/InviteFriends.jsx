import { useState } from 'react'

export default function InviteFriends({ onDone, onHome, code = 'ECO-GHALA' }) {
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div>
      <div style={{ color: 'var(--green)', fontWeight: 700 }}>eco-swap</div>
      <h2 style={{ margin: '6px 0 2px' }}>Invite friends</h2>

      <p style={{ color: 'var(--muted)', fontSize: 14, margin: '16px 0 8px' }}>
        Your demo invite code
      </p>

      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: 18,
          textAlign: 'center',
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: 2,
          color: 'var(--green)',
        }}
      >
        {code}
      </div>

      <p style={{ color: 'var(--muted)', fontSize: 14, margin: '12px 0 20px' }}>
        Show this code to a friend to try Eco-Swap together.
      </p>

      <button
        type="button"
        className="btn btn-light"
        onClick={copyCode}
        style={{ marginBottom: 10 }}
      >
        {copied ? 'Copied!' : 'Copy code'}
      </button>

      <p role="status" style={{ minHeight: 18, fontSize: 13, color: 'var(--green)', margin: '0 0 10px' }}>
        {copied ? 'Invite code copied to clipboard' : ''}
      </p>

      <button type="button" className="btn" onClick={onDone}>
        Done
      </button>

      <button
        type="button"
        onClick={onHome}
        style={{
          display: 'block',
          margin: '16px auto 0',
          background: 'none',
          border: 'none',
          color: 'var(--green)',
          fontSize: 15,
          minHeight: 44,
          cursor: 'pointer',
        }}
      >
        Home
      </button>
    </div>
  )
}

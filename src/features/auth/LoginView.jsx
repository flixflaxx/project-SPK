import { useState } from 'react'
import { LogIn, ShieldCheck } from 'lucide-react'
import { DEMO_USERS } from '../../services/mockData.js'

export function LoginView({ onLoginSuccess }) {
  const [selectedUserEmail, setSelectedUserEmail] = useState(DEMO_USERS[0].email)
  const [password, setPassword] = useState('password123')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const user = DEMO_USERS.find((u) => u.email === selectedUserEmail)
    if (!user) {
      setError('Pengguna tidak ditemukan.')
      return
    }
    if (password.length < 6) {
      setError('Kata sandi minimal 6 karakter.')
      return
    }
    setError('')
    onLoginSuccess(user)
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#09291f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 25%, rgba(32, 180, 124, 0.28), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="clay-card page-enter-content"
        style={{
          width: '100%',
          maxWidth: '460px',
          borderRadius: '32px',
          padding: '44px 38px',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div
            className="clay-bubble"
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#0d382e',
              color: 'var(--color-lime)',
              fontFamily: 'var(--font-heading)',
              fontWeight: '900',
              fontSize: '24px',
              margin: '0 auto 18px',
              boxShadow: '4px 8px 18px rgba(9, 41, 31, 0.3), inset 2px 2px 5px rgba(255, 255, 255, 0.2), inset -2px -2px 5px rgba(0, 0, 0, 0.4)',
            }}
          >
            SPK
          </div>
          <h1
            style={{
              fontSize: '22px',
              fontWeight: '800',
              color: 'var(--color-green-950)',
              lineHeight: 1.25,
            }}
          >
            Sistem Pendukung Keputusan Bansos
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: 'var(--color-text-muted)',
              marginTop: '5px',
            }}
          >
            Kampung Bulak Amah · Metode SAW
          </p>
        </div>

        {error && (
          <div
            className="clay-badge"
            style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '10px 16px',
              fontSize: '12.5px',
              marginBottom: '20px',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="demo-user"
              style={{
                display: 'block',
                fontSize: '12.5px',
                fontWeight: '700',
                color: 'var(--color-green-950)',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                marginBottom: '8px',
              }}
            >
              Pilih Akun Pengguna
            </label>
            <select
              id="demo-user"
              value={selectedUserEmail}
              onChange={(e) => setSelectedUserEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '13.5px',
                fontWeight: '600',
              }}
            >
              {DEMO_USERS.map((user) => (
                <option key={user.id} value={user.email}>
                  {user.displayName} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '26px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '12.5px',
                fontWeight: '700',
                color: 'var(--color-green-950)',
                textTransform: 'uppercase',
                letterSpacing: '0.4px',
                marginBottom: '8px',
              }}
            >
              Kata Sandi
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '13.5px',
              }}
              required
            />
            <span style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '6px', display: 'block' }}>
              Mode prototipe: kata sandi bebas (min 6 karakter)
            </span>
          </div>

          <button
            type="submit"
            className="clay-btn"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '14.5px',
              fontWeight: '800',
              justifyContent: 'center',
            }}
          >
            <LogIn size={18} />
            <span>Masuk ke Aplikasi</span>
          </button>
        </form>

        <div
          style={{
            marginTop: '28px',
            paddingTop: '18px',
            fontSize: '11.5px',
            color: 'var(--color-text-subtle)',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <div
            className="clay-badge"
            style={{
              backgroundColor: '#edf8f3',
              color: 'var(--color-green-700)',
              padding: '6px 14px',
              fontSize: '11.5px',
            }}
          >
            <ShieldCheck size={14} style={{ color: 'var(--color-green-700)' }} />
            <span>Sistem Pendukung Keputusan Terproteksi © 2026</span>
          </div>
        </div>
      </div>
    </div>
  )
}

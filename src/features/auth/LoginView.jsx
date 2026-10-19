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
        backgroundColor: 'var(--color-green-950)',
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
          background: 'radial-gradient(circle at 50% 25%, rgba(32, 180, 124, 0.22), transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div
        className="page-enter-content"
        style={{
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--color-surface)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-modal)',
          padding: '38px 34px',
          position: 'relative',
          zIndex: 10,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '16px',
              backgroundColor: 'var(--color-green-900)',
              color: 'var(--color-lime)',
              fontFamily: 'var(--font-heading)',
              fontWeight: '900',
              fontSize: '22px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 8px 20px rgba(9, 41, 31, 0.35)',
            }}
          >
            SPK
          </div>
          <h1
            style={{
              fontSize: '20px',
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
              marginTop: '4px',
            }}
          >
            Kampung Bulak Amah · Metode SAW
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: 'var(--color-danger-bg)',
              border: '1px solid var(--color-danger-border)',
              color: 'var(--color-danger)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              marginBottom: '18px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label
              htmlFor="demo-user"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--color-green-950)',
                marginBottom: '6px',
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
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-line-dark)',
                fontSize: '13.5px',
                fontWeight: '600',
                backgroundColor: 'var(--color-surface)',
                outline: 'none',
              }}
            >
              {DEMO_USERS.map((user) => (
                <option key={user.id} value={user.email}>
                  {user.displayName} ({user.role})
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '700',
                color: 'var(--color-green-950)',
                marginBottom: '6px',
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
                padding: '11px 14px',
                borderRadius: 'var(--radius-md)',
                border: '1.5px solid var(--color-line-dark)',
                fontSize: '13.5px',
                outline: 'none',
              }}
              required
            />
            <span style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '5px', display: 'block' }}>
              Mode prototipe: kata sandi bebas (min 6 karakter)
            </span>
          </div>

          <button
            type="submit"
            className="btn-action-glow"
            style={{
              width: '100%',
              backgroundColor: 'var(--color-green-700)',
              color: 'var(--color-text-inverse)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '14.5px',
              fontWeight: '700',
              fontFamily: 'var(--font-heading)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <LogIn size={17} />
            <span>Masuk ke Aplikasi</span>
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--color-line)',
            fontSize: '11.5px',
            color: 'var(--color-text-subtle)',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
          }}
        >
          <ShieldCheck size={14} style={{ color: 'var(--color-green-700)' }} />
          <span>Sistem Pendukung Keputusan Terproteksi © 2026</span>
        </div>
      </div>
    </div>
  )
}

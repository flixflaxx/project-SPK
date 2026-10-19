import { Component } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('SPK Bansos Runtime Error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--color-bg, #f4f7f5)',
            padding: '24px',
            fontFamily: 'var(--font-body, system-ui, sans-serif)',
          }}
        >
          <div
            style={{
              maxWidth: '560px',
              width: '100%',
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              border: '1px solid #e1e7e4',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-danger-bg, #fde8e8)',
                color: 'var(--color-danger, #d32f2f)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}
            >
              <AlertTriangle size={28} />
            </div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '800',
                color: '#1a3328',
                marginBottom: '8px',
              }}
            >
              Terjadi Kesalahan Tampilan
            </h2>
            <p
              style={{
                fontSize: '14px',
                color: '#52695f',
                lineHeight: 1.5,
                marginBottom: '20px',
              }}
            >
              Sistem mendeteksi kendala pada antarmuka. Anda dapat menyegarkan halaman atau memuat ulang sesi preview.
            </p>
            {this.state.error && (
              <pre
                style={{
                  textAlign: 'left',
                  backgroundColor: '#f8faf9',
                  border: '1px solid #e1e7e4',
                  borderRadius: '6px',
                  padding: '12px',
                  fontSize: '12px',
                  color: '#9e2b2b',
                  overflowX: 'auto',
                  marginBottom: '24px',
                }}
              >
                {this.state.error.message || String(this.state.error)}
              </pre>
            )}
            <button
              type="button"
              onClick={this.handleReset}
              style={{
                backgroundColor: 'var(--color-green-700, #156247)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <RotateCcw size={16} />
              <span>Muat Ulang Halaman</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

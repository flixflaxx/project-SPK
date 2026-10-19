import { useState, useEffect, useRef } from 'react'
import { Search, User, Award, Activity, ArrowRight } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { StatusBadge } from '../../components/common/StatusBadge.jsx'

export function SearchView({ residents, candidates, auditLogs, onNavigate }) {
  const [searchTerm, setSearchTerm] = useState('')
  const containerRef = useRef(null)

  const term = searchTerm.trim().toLowerCase()

  const matchedResidents = term
    ? residents.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.addressRtRw.includes(term) ||
          r.addressStreet.toLowerCase().includes(term)
      )
    : []

  const matchedCandidates = term
    ? candidates.filter((c) => {
        const res = residents.find((r) => r.id === c.residentId)
        return (
          res?.name.toLowerCase().includes(term) ||
          c.id.toLowerCase().includes(term) ||
          c.verificationNotes?.toLowerCase().includes(term)
        )
      })
    : []

  const matchedAudit = term
    ? auditLogs.filter(
        (a) =>
          a.action.toLowerCase().includes(term) ||
          a.actorName.toLowerCase().includes(term) ||
          a.requestSummary?.toLowerCase().includes(term)
      )
    : []

  useEffect(() => {
    if (typeof window !== 'undefined' && window.anime && containerRef.current && term) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.search-result-card'),
        opacity: [0, 1],
        translateY: [8, 0],
        delay: window.anime.stagger(40),
        duration: 350,
        easing: 'easeOutCubic',
      })
    }
  }, [term])

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={22}
        title="Pencarian Data"
        description="Pencarian terpadu data warga, calon penerima, dan aktivitas sistem."
      />

      <Panel>
        <div style={{ maxWidth: '640px', marginBottom: '24px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-green-950)' }}>
            Kata Kunci Pencarian Terpadu
          </label>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-green-700)' }} />
            <input
              type="search"
              placeholder="Ketik kata kunci, misalnya: Kuswanto, 001/003, atau CALCULATION..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px 12px 42px',
                borderRadius: 'var(--radius-md)',
                border: '2px solid var(--color-green-700)',
                fontSize: '14.5px',
                fontWeight: '600',
                backgroundColor: 'var(--color-surface)',
                outline: 'none',
                boxShadow: '0 2px 8px rgba(22, 118, 91, 0.1)',
              }}
            />
          </div>

          {/* Search suggestions tags */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)' }}>Saran pencarian:</span>
            {['Kuswanto', '001/003', 'CALCULATION', 'VERIFIED'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchTerm(tag)}
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '3px 8px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-surface-muted)',
                  color: 'var(--color-green-700)',
                  border: '1px solid var(--color-line-dark)',
                  cursor: 'pointer',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {!term ? (
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13.5px' }}>
            Silakan masukkan kata kunci pada kolom di atas untuk mencari data warga, calon, atau audit log.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Warga */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={15} />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-green-950)' }}>
                  Hasil Data Warga ({matchedResidents.length})
                </h3>
              </div>
              {matchedResidents.length === 0 ? (
                <p style={{ fontSize: '12.5px', color: 'var(--color-text-subtle)' }}>Tidak ada data warga yang cocok.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {matchedResidents.map((r) => (
                    <div
                      key={r.id}
                      className="search-result-card interactive-card"
                      style={{
                        padding: '12px 16px',
                        backgroundColor: 'var(--color-surface)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--color-line)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '13px',
                      }}
                    >
                      <div>
                        <strong style={{ color: 'var(--color-green-950)' }}>{r.name}</strong> · NIK: <code style={{ color: 'var(--color-green-700)' }}>{r.nikMasked}</code> · RT/RW: {r.addressRtRw}
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigate('residents')}
                        className="btn-action-glow"
                        style={{
                          fontSize: '12px',
                          color: 'var(--color-green-700)',
                          fontWeight: '700',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <span>Buka di Data Warga</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Calon */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#edf8f3', color: 'var(--color-green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={15} />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-green-950)' }}>
                  Hasil Calon Penerima ({matchedCandidates.length})
                </h3>
              </div>
              {matchedCandidates.length === 0 ? (
                <p style={{ fontSize: '12.5px', color: 'var(--color-text-subtle)' }}>Tidak ada calon yang cocok.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {matchedCandidates.map((c) => {
                    const res = residents.find((r) => r.id === c.residentId)
                    return (
                      <div
                        key={c.id}
                        className="search-result-card interactive-card"
                        style={{
                          padding: '12px 16px',
                          backgroundColor: 'var(--color-surface)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--color-line)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontSize: '13px',
                        }}
                      >
                        <div>
                          <strong style={{ color: 'var(--color-green-950)' }}>{res?.name || c.id}</strong> ({c.id}) · <StatusBadge status={c.verificationStatus} />
                        </div>
                        <button
                          type="button"
                          onClick={() => onNavigate('candidates')}
                          className="btn-action-glow"
                          style={{
                            fontSize: '12px',
                            color: 'var(--color-green-700)',
                            fontWeight: '700',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <span>Buka di Calon</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Audit */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#fef3c7', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={15} />
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-green-950)' }}>
                  Hasil Log Audit ({matchedAudit.length})
                </h3>
              </div>
              {matchedAudit.length === 0 ? (
                <p style={{ fontSize: '12.5px', color: 'var(--color-text-subtle)' }}>Tidak ada audit log yang cocok.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {matchedAudit.map((a) => (
                    <div
                      key={a.id}
                      className="search-result-card interactive-card"
                      style={{
                        padding: '12px 16px',
                        backgroundColor: 'var(--color-surface-muted)',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '12.5px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <div>
                        <code style={{ fontWeight: '700', color: 'var(--color-green-700)' }}>{a.action}</code>: {a.requestSummary}
                      </div>
                      <span style={{ color: 'var(--color-text-subtle)', fontSize: '11.5px' }}>
                        {new Date(a.occurredAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Panel>
    </div>
  )
}

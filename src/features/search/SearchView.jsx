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
        <div style={{ maxWidth: '680px', marginBottom: '28px' }}>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: '800', marginBottom: '10px', color: 'var(--color-green-950)' }}>
            Kata Kunci Pencarian Terpadu
          </label>
          <div
            className="clay-sunken"
            style={{
              position: 'relative',
              borderRadius: '9999px',
              padding: '2px',
            }}
          >
            <Search size={18} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-green-700)' }} />
            <input
              type="search"
              placeholder="Ketik kata kunci, misalnya: Kuswanto, 001/003, atau CALCULATION..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 18px 12px 48px',
                borderRadius: '9999px',
                border: 'none',
                background: 'transparent',
                fontSize: '14.5px',
                fontWeight: '700',
                outline: 'none',
                color: 'var(--color-green-950)',
              }}
            />
          </div>

          {/* Search suggestions tags */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', fontWeight: '600' }}>Saran pencarian:</span>
            {['Kuswanto', '001/003', 'CALCULATION', 'VERIFIED'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSearchTerm(tag)}
                className="clay-badge"
                style={{
                  fontSize: '11px',
                  fontWeight: '800',
                  padding: '4px 10px',
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-green-700)',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {!term ? (
          <div
            className="clay-item"
            style={{
              padding: '24px',
              textAlign: 'center',
              color: 'var(--color-text-muted)',
              fontSize: '13.5px',
              borderRadius: '20px',
            }}
          >
            Silakan ketikkan nama warga, RT/RW, ID calon, atau jenis aktivitas pada kolom di atas untuk menelusuri data sistem.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
            {/* Warga */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div className="clay-bubble" style={{ width: '32px', height: '32px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <User size={16} />
                </div>
                <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--color-green-950)' }}>
                  Hasil Data Warga ({matchedResidents.length})
                </h3>
              </div>
              {matchedResidents.length === 0 ? (
                <p style={{ fontSize: '12.5px', color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>Tidak ada data warga yang cocok.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {matchedResidents.map((r) => (
                    <div
                      key={r.id}
                      className="search-result-card clay-item"
                      style={{
                        padding: '14px 20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '10px',
                        fontSize: '13px',
                        borderRadius: '18px',
                      }}
                    >
                      <div>
                        <strong style={{ color: 'var(--color-green-950)', fontSize: '14px' }}>{r.name}</strong> · NIK: <code style={{ color: 'var(--color-green-700)', fontWeight: '700' }}>{r.nikMasked}</code> · RT/RW: {r.addressRtRw}
                      </div>
                      <button
                        type="button"
                        onClick={() => onNavigate('residents')}
                        className="clay-btn"
                        style={{
                          fontSize: '12px',
                          padding: '6px 14px',
                          fontWeight: '800',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          borderRadius: '12px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div className="clay-bubble" style={{ width: '32px', height: '32px', backgroundColor: '#edf8f3', color: 'var(--color-green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={16} />
                </div>
                <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--color-green-950)' }}>
                  Hasil Calon Penerima ({matchedCandidates.length})
                </h3>
              </div>
              {matchedCandidates.length === 0 ? (
                <p style={{ fontSize: '12.5px', color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>Tidak ada calon yang cocok.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {matchedCandidates.map((c) => {
                    const res = residents.find((r) => r.id === c.residentId)
                    return (
                      <div
                        key={c.id}
                        className="search-result-card clay-item"
                        style={{
                          padding: '14px 20px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '10px',
                          fontSize: '13px',
                          borderRadius: '18px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <strong style={{ color: 'var(--color-green-950)', fontSize: '14px' }}>{res?.name || c.id}</strong>
                          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>({c.id})</span>
                          <StatusBadge status={c.verificationStatus} />
                        </div>
                        <button
                          type="button"
                          onClick={() => onNavigate('candidates')}
                          className="clay-btn"
                          style={{
                            fontSize: '12px',
                            padding: '6px 14px',
                            fontWeight: '800',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            borderRadius: '12px',
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div className="clay-bubble" style={{ width: '32px', height: '32px', backgroundColor: '#fef3c7', color: 'var(--color-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={16} />
                </div>
                <h3 style={{ fontSize: '15.5px', fontWeight: '800', color: 'var(--color-green-950)' }}>
                  Hasil Log Audit ({matchedAudit.length})
                </h3>
              </div>
              {matchedAudit.length === 0 ? (
                <p style={{ fontSize: '12.5px', color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>Tidak ada audit log yang cocok.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {matchedAudit.map((a) => (
                    <div
                      key={a.id}
                      className="search-result-card clay-item"
                      style={{
                        padding: '14px 20px',
                        fontSize: '12.5px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderRadius: '18px',
                      }}
                    >
                      <div>
                        <code style={{ fontWeight: '800', color: 'var(--color-green-700)' }}>{a.action}</code>: {a.requestSummary}
                      </div>
                      <span style={{ color: 'var(--color-text-subtle)', fontSize: '11.5px', fontWeight: '600' }}>
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

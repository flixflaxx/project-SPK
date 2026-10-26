import { useState, useEffect, useRef } from 'react'
import { Plus, Users, CheckCircle2, Clock } from 'lucide-react'
import { DataTable } from '../../components/common/DataTable.jsx'
import { Modal } from '../../components/common/Modal.jsx'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { StatusBadge } from '../../components/common/StatusBadge.jsx'

export function CandidatesView({
  candidates,
  residents,
  activePeriod,
  onRegisterCandidate,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedResidentId, setSelectedResidentId] = useState('')
  const [error, setError] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    const anime = typeof window !== 'undefined' ? window.anime : null
    if (anime && containerRef.current) {
      anime({
        targets: containerRef.current.querySelectorAll('.cand-stat-card'),
        opacity: [0, 1],
        translateY: [16, 0],
        delay: anime.stagger(80),
        duration: 550,
        easing: 'easeOutBack',
      })
    }
  }, [])

  // Warga yang belum didaftarkan sebagai calon pada periode aktif
  const unregisteredResidents = residents.filter(
    (r) => !candidates.some((c) => c.residentId === r.id && c.periodId === activePeriod?.id)
  )

  const verifiedCount = candidates.filter((c) => c.verificationStatus === 'VERIFIED').length
  const pendingCount = candidates.filter((c) => c.verificationStatus === 'PENDING').length

  function handleRegister(e) {
    e.preventDefault()
    if (!selectedResidentId) {
      setError('Pilih warga yang akan didaftarkan.')
      return
    }
    const newCandidate = {
      id: `cand-${Date.now()}`,
      residentId: selectedResidentId,
      periodId: activePeriod.id,
      applicationStatus: 'APPLIED',
      verificationStatus: 'PENDING',
      verificationNotes: 'Pendaftaran baru, menunggu verifikasi berkas.',
      verifiedBy: null,
      verifiedAt: null,
      createdAt: new Date().toISOString(),
    }
    onRegisterCandidate(newCandidate)
    setIsModalOpen(false)
    setSelectedResidentId('')
    setError('')
  }

  const columns = [
    {
      key: 'resident',
      label: 'Nama Calon & NIK',
      width: '28%',
      render: (_, row) => {
        const res = residents.find((r) => r.id === row.residentId)
        return (
          <div>
            <div style={{ fontWeight: '800', color: 'var(--color-green-950)' }}>
              {res?.name || row.residentId}
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
              NIK: <code>{res?.nikMasked || '—'}</code> · {res?.addressRtRw || '—'}
            </div>
          </div>
        )
      },
    },
    {
      key: 'verificationStatus',
      label: 'Status Verifikasi',
      width: '18%',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'verificationNotes',
      label: 'Catatan Kelayakan / Verifikasi',
      width: '32%',
      render: (val) => (
        <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
          {val || 'Belum ada catatan.'}
        </span>
      ),
    },
    {
      key: 'applicationStatus',
      label: 'Status Aplikasi',
      width: '12%',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'createdAt',
      label: 'Tgl Daftar',
      width: '10%',
      render: (val) => (
        <span className="clay-badge" style={{ backgroundColor: '#ffffff', fontSize: '11px', padding: '3px 9px', color: 'var(--color-text-subtle)' }}>
          {new Date(val).toLocaleDateString('id-ID')}
        </span>
      ),
    },
  ]

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={4}
        title="Calon Penerima Bansos"
        description="Pendaftaran alternatif warga calon penerima bantuan untuk periode aktif."
        actions={
          <button
            type="button"
            className="clay-btn"
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '11px 22px',
              fontSize: '13px',
            }}
          >
            <Plus size={16} />
            <span>Daftarkan Calon Penerima</span>
          </button>
        }
      />

      {/* Top 3 Squircle Metric Cards with Claymorphism */}
      <div
        className="responsive-kpi-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 220px), 1fr))',
          gap: '18px',
          marginBottom: '26px',
        }}
      >
        <div
          className="cand-stat-card clay-card"
          style={{
            padding: '22px 24px',
            borderRadius: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              TOTAL CALON TERDAFTAR
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '6px', lineHeight: 1.1 }}>
              {candidates.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Periode {activePeriod?.name || 'Aktif'}
            </div>
          </div>
          <div
            className="clay-bubble"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
            }}
          >
            <Users size={22} />
          </div>
        </div>

        <div
          className="cand-stat-card clay-card"
          style={{
            padding: '22px 24px',
            borderRadius: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                TERVERIFIKASI SAH
              </span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '6px', lineHeight: 1.1 }}>
              {verifiedCount} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Memenuhi syarat masuk SAW
            </div>
          </div>
          <div
            className="clay-bubble"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              backgroundColor: '#edf8f3',
              color: 'var(--color-green-700)',
            }}
          >
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div
          className="cand-stat-card clay-card"
          style={{
            padding: '22px 24px',
            borderRadius: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '800', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              MENUNGGU VERIFIKASI
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-warning)', marginTop: '6px', lineHeight: 1.1 }}>
              {pendingCount} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Calon</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Dalam antrean periksa berkas
            </div>
          </div>
          <div
            className="clay-bubble"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '16px',
              backgroundColor: '#fef3c7',
              color: 'var(--color-warning)',
            }}
          >
            <Clock size={22} />
          </div>
        </div>
      </div>

      <Panel
        title={`Daftar Calon — ${activePeriod?.name || 'Periode Aktif'}`}
        subtitle={`Total: ${candidates.length} calon terdaftar.`}
      >
        <DataTable columns={columns} data={candidates} />
      </Panel>

      {/* Modal Pendaftaran Calon */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Daftarkan Warga sebagai Calon Alternatif"
      >
        {error && (
          <div
            className="clay-badge"
            style={{
              backgroundColor: '#fee2e2',
              color: '#dc2626',
              padding: '10px 14px',
              fontSize: '12.5px',
              marginBottom: '16px',
              width: '100%',
              justifyContent: 'center',
            }}
          >
            {error}
          </div>
        )}
        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '8px', color: 'var(--color-green-950)' }}>
              Pilih Warga (dari Data Master Warga)
            </label>
            <select
              value={selectedResidentId}
              onChange={(e) => setSelectedResidentId(e.target.value)}
              style={{ width: '100%' }}
            >
              <option value="">— Pilih Warga —</option>
              {unregisteredResidents.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} (NIK: {r.nikMasked}) — RT/RW: {r.addressRtRw}
                </option>
              ))}
            </select>
            {unregisteredResidents.length === 0 && (
              <span style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '6px', display: 'block' }}>
                Semua warga telah terdaftar pada periode seleksi ini.
              </span>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="clay-badge"
              style={{ padding: '9px 18px', backgroundColor: '#ffffff', color: 'var(--color-text-muted)', cursor: 'pointer', fontSize: '13px' }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={unregisteredResidents.length === 0}
              className="clay-btn"
              style={{
                padding: '9px 22px',
                fontSize: '13px',
                opacity: unregisteredResidents.length === 0 ? 0.6 : 1,
              }}
            >
              Daftarkan Calon
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

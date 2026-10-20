import { useState, useEffect, useRef } from 'react'
import { Database, CheckCircle2, Loader2, ShieldCheck, HardDrive } from 'lucide-react'
import { DataTable } from '../../components/common/DataTable.jsx'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { StatusBadge } from '../../components/common/StatusBadge.jsx'

export function BackupView({ backupJobs, onTriggerBackup, onRecordAudit }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [successNotice, setSuccessNotice] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.backup-stat-card'),
        opacity: [0, 1],
        translateY: [12, 0],
        delay: window.anime.stagger(80),
        duration: 450,
        easing: 'easeOutCubic',
      })
    }
  }, [])

  const totalBytes = backupJobs.reduce((sum, b) => sum + (b.byteSize || 0), 0)
  const totalMb = (totalBytes / 1024 / 1024).toFixed(2)

  function handleCreateBackup() {
    setIsProcessing(true)

    setTimeout(() => {
      const newJob = {
        id: `bkp-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Date.now().toString().slice(-2)}`,
        requestedAt: new Date().toISOString(),
        startedAt: new Date().toISOString(),
        completedAt: new Date(Date.now() + 2000).toISOString(),
        status: 'RESTORE_TESTED',
        storageKey: `backups/2026/spk-snapshot-${Date.now()}.enc`,
        checksum: `sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855`,
        byteSize: 1520000,
        retentionDays: 30,
        restoreTestResult: 'Simulasi drill restore snapshot PostgreSQL terenkripsi berhasil diverifikasi.',
      }

      onTriggerBackup(newJob)
      onRecordAudit({
        action: 'BACKUP_TRIGGERED',
        targetType: 'BackupJob',
        targetId: newJob.id,
        requestSummary: `Pencadangan terenkripsi baru dibuat (Job: ${newJob.id}).`,
      })

      setIsProcessing(false)
      setSuccessNotice('Snapshot pencadangan baru berhasil dibuat dan status RESTORE_TESTED terkonfirmasi.')
      setTimeout(() => setSuccessNotice(''), 6000)
    }, 600)
  }

  const columns = [
    {
      key: 'id',
      label: 'Job ID & Storage Key',
      width: '28%',
      render: (val, row) => (
        <div>
          <div style={{ fontWeight: '800', fontFamily: 'monospace', color: 'var(--color-green-950)' }}>
            {val}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
            {row.storageKey}
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status Pekerjaan',
      width: '18%',
      render: (val) => <StatusBadge status={val} />,
    },
    {
      key: 'byteSize',
      label: 'Ukuran & Retensi',
      width: '18%',
      render: (val, row) => (
        <span
          className="clay-badge"
          style={{
            fontSize: '11.5px',
            fontWeight: '800',
            backgroundColor: '#edf8f3',
            color: 'var(--color-green-700)',
            padding: '4px 10px',
          }}
        >
          {(val / 1024 / 1024).toFixed(2)} MB · {row.retentionDays} hari
        </span>
      ),
    },
    {
      key: 'checksum',
      label: 'Integritas / Hash SHA-256',
      width: '18%',
      render: (val) => (
        <span style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>
          {val ? `${val.slice(0, 18)}...` : '—'}
        </span>
      ),
    },
    {
      key: 'requestedAt',
      label: 'Waktu Selesai',
      width: '18%',
      render: (val) => (
        <span style={{ fontSize: '12px', fontWeight: '600' }}>
          {new Date(val).toLocaleString('id-ID')}
        </span>
      ),
    },
  ]

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={23}
        title="Backup Database & Pemulihan (Disaster Recovery)"
        description="Jadwal pencadangan berkala, enkripsi snapshot, metadata integritas (checksum), serta pencatatan uji pemulihan (restore drill)."
        actions={
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleCreateBackup}
            className="clay-btn"
            style={{
              padding: '10px 20px',
              fontWeight: '800',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: isProcessing ? 'wait' : 'pointer',
              opacity: isProcessing ? 0.7 : 1,
            }}
          >
            {isProcessing ? (
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <Database size={16} />
            )}
            <span>{isProcessing ? 'Memproses Backup...' : 'Jalankan Backup Sekarang'}</span>
          </button>
        }
      />

      {/* Top 3 Squircle Metric Cards with Claymorphism */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div
          className="backup-stat-card clay-card"
          style={{
            padding: '18px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
              TOTAL SNAPSHOT CADANGAN
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '4px' }}>
              {backupJobs.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>File</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Snapshot terenkripsi AES-256
            </div>
          </div>
          <div
            className="clay-bubble"
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Database size={22} />
          </div>
        </div>

        <div
          className="backup-stat-card clay-card"
          style={{
            padding: '18px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
                UJI DRILL PEMULIHAN
              </span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '4px' }}>
              TERUJI
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Restore drill status verified
            </div>
          </div>
          <div
            className="clay-bubble"
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: '#edf8f3',
              color: 'var(--color-green-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ShieldCheck size={22} />
          </div>
        </div>

        <div
          className="backup-stat-card clay-card"
          style={{
            padding: '18px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '11.5px', fontWeight: '800', color: 'var(--color-text-muted)', letterSpacing: '0.5px' }}>
              TOTAL STORAGE BACKUP
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-warning)', marginTop: '4px' }}>
              {totalMb} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>MB</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Retensi penyimpanan 30 hari
            </div>
          </div>
          <div
            className="clay-bubble"
            style={{
              width: '44px',
              height: '44px',
              backgroundColor: '#fef3c7',
              color: 'var(--color-warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HardDrive size={22} />
          </div>
        </div>
      </div>

      {successNotice && (
        <div
          className="clay-badge"
          style={{
            backgroundColor: '#edf8f3',
            color: 'var(--color-green-700)',
            padding: '14px 20px',
            marginBottom: '20px',
            fontSize: '13.5px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            width: '100%',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successNotice}</span>
        </div>
      )}

      <Panel title="Riwayat Pekerjaan Backup Terenkripsi">
        <DataTable columns={columns} data={backupJobs} />
      </Panel>
    </div>
  )
}

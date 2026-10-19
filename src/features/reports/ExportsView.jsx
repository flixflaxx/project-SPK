import { useState, useEffect, useRef } from 'react'
import { CheckCircle2, Download, Printer, FileSpreadsheet, FileText } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { formatExact } from '@shared/domain/saw/fraction.js'

export function ExportsView({
  calculationRun,
  activePeriod,
  residents,
  candidates,
  onRecordAudit,
}) {
  const [downloadSuccess, setDownloadSuccess] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.export-card'),
        opacity: [0, 1],
        translateY: [14, 0],
        delay: window.anime.stagger(100),
        duration: 450,
        easing: 'easeOutCubic',
      })
    }
  }, [])

  function handleExportCsv() {
    if (!calculationRun) {
      alert('Belum ada data run SAW untuk diekspor.')
      return
    }

    const { results, criteria } = calculationRun

    // Headers
    const headers = ['Peringkat', 'ID Calon', 'Nama Warga', 'NIK Masked', ...criteria.map((c) => `Nilai Mentah ${c.code}`), 'Nilai Preferensi (V)']
    const rows = results.map((row) => {
      const cand = candidates.find((c) => c.id === row.candidateId)
      const res = residents.find((r) => r.id === cand?.residentId)
      return [
        row.rank,
        row.candidateId,
        `"${res?.name || row.candidateId}"`,
        `"${res?.nikMasked || ''}"`,
        ...criteria.map((c) => row.raw[c.code]),
        formatExact(row.preference.exact, 6),
      ]
    })

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `SPK_Bansos_Hasil_SAW_${calculationRun.id}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    // Trigger Audit Event
    onRecordAudit({
      action: 'DATA_EXPORTED',
      targetType: 'CalculationRun',
      targetId: calculationRun.id,
      requestSummary: `Ekspor CSV data peringkat SAW (Run ID: ${calculationRun.id}).`,
    })

    setDownloadSuccess('File CSV (UTF-8 kompatibel Excel) berhasil diunduh dan dicatat ke audit log.')
    setTimeout(() => setDownloadSuccess(''), 5000)
  }

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={19}
        title="Cetak dan Ekspor Laporan (PDF / CSV)"
        description="Unduh spreadsheet dan cetak laporan hasil seleksi dengan pencatatan jejak audit otomatis."
      />

      {downloadSuccess && (
        <div
          style={{
            backgroundColor: 'var(--color-success-bg)',
            border: '1px solid var(--color-success-border)',
            color: 'var(--color-success)',
            padding: '12px 18px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '20px',
            fontSize: '13.5px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{downloadSuccess}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="export-card interactive-card">
          <Panel
            title="Ekspor Spreadsheet (CSV)"
            subtitle={`Mengunduh data peringkat lengkap periode ${activePeriod?.name || 'aktif'} dan nilai V.`}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#e0f2fe',
                  color: '#0284c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FileSpreadsheet size={22} />
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                File memuat data alternatif terverifikasi pada Run <code>{calculationRun?.id || '—'}</code>. Setiap aksi pengunduhan akan dicatat otomatis ke audit log aktivitas.
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportCsv}
              disabled={!calculationRun}
              className={calculationRun ? 'btn-action-glow' : ''}
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--color-green-700)',
                color: '#ffffff',
                borderRadius: 'var(--radius-md)',
                fontWeight: '700',
                fontSize: '13.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                cursor: calculationRun ? 'pointer' : 'not-allowed',
                opacity: calculationRun ? 1 : 0.6,
              }}
            >
              <Download size={16} />
              <span>Unduh File CSV (.csv)</span>
            </button>
          </Panel>
        </div>

        <div className="export-card interactive-card">
          <Panel
            title="Cetak Lembar Resmi / Simpan PDF"
            subtitle="Format cetak dokumen resmi dengan kop pemerintah kampung dan disclaimer."
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  backgroundColor: '#edf8f3',
                  color: 'var(--color-green-700)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <FileText size={22} />
              </div>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                Menggunakan tampilan ramah cetak (print stylesheet) yang otomatis merapikan header, tabel bobot, dan peringkat saat jendela cetak browser dibuka.
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="btn-action-glow"
              style={{
                padding: '10px 20px',
                backgroundColor: 'var(--color-green-950)',
                color: 'var(--color-lime)',
                borderRadius: 'var(--radius-md)',
                fontWeight: '700',
                fontSize: '13.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <Printer size={16} />
              <span>Buka Dialog Cetak Browser</span>
            </button>
          </Panel>
        </div>
      </div>
    </div>
  )
}

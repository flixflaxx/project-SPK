import { useState, useEffect, useRef } from 'react'
import { CheckCircle2, Download, Printer, FileSpreadsheet, FileText } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader.jsx'
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
          <span>{downloadSuccess}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        <div className="export-card clay-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
            <div
              className="clay-bubble"
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--color-green-950)' }}>
                Ekspor Spreadsheet (CSV)
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                Mengunduh data peringkat lengkap periode <strong>{activePeriod?.name || 'aktif'}</strong> dan nilai preferensi V yang kompatibel dengan Microsoft Excel.
              </p>
            </div>
          </div>

          <div
            className="clay-item"
            style={{
              padding: '14px 18px',
              fontSize: '12.5px',
              color: 'var(--color-text-muted)',
              marginBottom: '22px',
              borderRadius: '16px',
            }}
          >
            File memuat data alternatif terverifikasi pada Run <code>{calculationRun?.id || '—'}</code>. Setiap aksi pengunduhan akan dicatat otomatis ke audit log.
          </div>

          <button
            type="button"
            onClick={handleExportCsv}
            disabled={!calculationRun}
            className={calculationRun ? 'clay-btn' : ''}
            style={{
              padding: '12px 24px',
              fontWeight: '700',
              fontSize: '13.5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: calculationRun ? 'pointer' : 'not-allowed',
              opacity: calculationRun ? 1 : 0.6,
              borderRadius: '16px',
            }}
          >
            <Download size={16} />
            <span>Unduh File CSV (.csv)</span>
          </button>
        </div>

        <div className="export-card clay-card" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
            <div
              className="clay-bubble"
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#edf8f3',
                color: 'var(--color-green-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <FileText size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--color-green-950)' }}>
                Cetak Lembar Resmi / Simpan PDF
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px', lineHeight: 1.5 }}>
                Format cetak dokumen resmi dengan kop Pemerintah Kampung Bulak Amah, tabel kriteria, bobot, dan disclaimer sistem.
              </p>
            </div>
          </div>

          <div
            className="clay-item"
            style={{
              padding: '14px 18px',
              fontSize: '12.5px',
              color: 'var(--color-text-muted)',
              marginBottom: '22px',
              borderRadius: '16px',
            }}
          >
            Menggunakan tampilan ramah cetak (print stylesheet) yang otomatis merapikan tata letak saat jendela cetak browser dibuka.
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="clay-btn"
            style={{
              padding: '12px 24px',
              fontWeight: '700',
              fontSize: '13.5px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              borderRadius: '16px',
            }}
          >
            <Printer size={16} />
            <span>Buka Dialog Cetak Browser</span>
          </button>
        </div>
      </div>
    </div>
  )
}

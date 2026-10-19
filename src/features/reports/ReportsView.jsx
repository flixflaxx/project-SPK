import { Printer } from 'lucide-react'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'
import { StatusBadge } from '../../components/common/StatusBadge.jsx'
import { formatExact } from '@shared/domain/saw/fraction.js'
import { latestDecision } from '@shared/domain/decisions/approval.js'

export function ReportsView({
  calculationRun,
  activePeriod,
  residents,
  candidates,
  decisions,
}) {
  if (!calculationRun) {
    return (
      <div>
        <PageHeader
          featureNum={18}
          title="Laporan Hasil Perhitungan SAW"
          description="Laporan komprehensif pemilihan penerima bantuan sosial berdasarkan snapshot kalkulasi resmi."
        />
        <Panel>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '13.5px' }}>
            Belum ada hasil kalkulasi SAW untuk dicetak sebagai laporan.
          </p>
        </Panel>
      </div>
    )
  }

  const { criteria, results, executedAt, criteriaVersionLabel, algorithmVersion } = calculationRun
  const quota = activePeriod?.quota ?? 0

  return (
    <div>
      <PageHeader
        featureNum={18}
        title="Laporan Hasil Perhitungan SAW"
        description="Dokumen laporan resmi metodologi SAW, bobot, normalisasi matriks, ranking, serta status persetujuan akhir."
        actions={
          <button
            type="button"
            className="btn-action-glow"
            onClick={() => window.print()}
            style={{
              backgroundColor: 'var(--color-green-700)',
              color: '#ffffff',
              padding: '9px 18px',
              borderRadius: 'var(--radius-md)',
              fontWeight: '700',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <Printer size={16} />
            <span>Cetak / Simpan PDF Browser</span>
          </button>
        }
      />

      {/* Official Report Document Container */}
      <div
        className="printable-report interactive-card"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--color-line)',
          padding: '36px 40px',
          boxShadow: 'var(--shadow-md)',
        }}
      >
        {/* Report Official Header */}
        <div
          style={{
            textAlign: 'center',
            borderBottom: '3px double var(--color-green-950)',
            paddingBottom: '20px',
            marginBottom: '24px',
          }}
        >
          <h2
            style={{
              fontSize: '19px',
              fontWeight: '800',
              textTransform: 'uppercase',
              color: 'var(--color-green-950)',
              letterSpacing: '0.5px',
            }}
          >
            Pemerintah Kampung Bulak Amah
          </h2>
          <h3
            style={{
              fontSize: '15px',
              fontWeight: '700',
              color: 'var(--color-green-900)',
              marginTop: '4px',
            }}
          >
            Laporan Hasil Seleksi Calon Penerima Bantuan Sosial
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Periode: <strong>{activePeriod?.name}</strong> · Pagu Kuota: {quota} Penerima
          </p>
        </div>

        {/* Metadata section */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '12px',
            fontSize: '12.5px',
            backgroundColor: 'var(--color-surface-hover)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-md)',
            marginBottom: '24px',
            border: '1px solid var(--color-line)',
          }}
        >
          <div>
            <div><strong>Nomor Run:</strong> <code>{calculationRun.id}</code></div>
            <div><strong>Waktu Kalkulasi:</strong> {new Date(executedAt).toLocaleString('id-ID')}</div>
            <div><strong>Metodologi:</strong> Simple Additive Weighting (SAW) Deterministik</div>
          </div>
          <div>
            <div><strong>Versi Algoritme:</strong> <code>{algorithmVersion}</code></div>
            <div><strong>Versi Kriteria:</strong> {criteriaVersionLabel}</div>
            <div><strong>Status Dokumen:</strong> RESMI (Snapshot Immutable)</div>
          </div>
        </div>

        {/* Section 1: Kriteria & Bobot */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--color-green-950)', marginBottom: '10px' }}>
            I. Konfigurasi Kriteria dan Bobot Preferensi
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-line-dark)' }}>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Kode</th>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Nama Kriteria</th>
                <th style={{ padding: '8px 12px', textAlign: 'center' }}>Tipe</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>Bobot (W)</th>
                <th style={{ padding: '8px 12px', textAlign: 'left' }}>Satuan</th>
              </tr>
            </thead>
            <tbody>
              {criteria.map((c) => (
                <tr key={c.code} style={{ borderBottom: '1px solid var(--color-line)' }}>
                  <td style={{ padding: '8px 12px', fontWeight: '700' }}>{c.code}</td>
                  <td style={{ padding: '8px 12px' }}>{c.name}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'center' }}>{c.type}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: '700' }}>{c.weightText}</td>
                  <td style={{ padding: '8px 12px', color: 'var(--color-text-muted)' }}>{c.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 2: Hasil Akhir & Keputusan */}
        <div style={{ marginBottom: '28px' }}>
          <h4 style={{ fontSize: '14.5px', fontWeight: '800', color: 'var(--color-green-950)', marginBottom: '10px' }}>
            II. Tabel Perangkingan SAW dan Status Penetapan Akhir
          </h4>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--color-surface-muted)', borderBottom: '1px solid var(--color-line-dark)' }}>
                <th style={{ padding: '10px 12px', textAlign: 'center', width: '8%' }}>Rank</th>
                <th style={{ padding: '10px 12px', textAlign: 'left' }}>Nama Warga & NIK</th>
                <th style={{ padding: '10px 12px', textAlign: 'right', width: '15%' }}>Skor SAW (V)</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', width: '18%' }}>Rekomendasi Kuota</th>
                <th style={{ padding: '10px 12px', textAlign: 'center', width: '22%' }}>Keputusan Pimpinan</th>
              </tr>
            </thead>
            <tbody>
              {results.map((row) => {
                const cand = candidates.find((c) => c.id === row.candidateId)
                const res = residents.find((r) => r.id === cand?.residentId)
                const dec = latestDecision(decisions, calculationRun.id, row.candidateId)
                const isWithinQuota = row.rank <= quota

                return (
                  <tr key={row.candidateId} style={{ borderBottom: '1px solid var(--color-line)' }}>
                    <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: '800', color: 'var(--color-green-950)' }}>
                      #{row.rank}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: '700' }}>{res?.name || row.candidateId}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>NIK: {res?.nikMasked}</div>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: '700', fontFamily: 'monospace', color: 'var(--color-green-700)' }}>
                      {formatExact(row.preference.exact, 4)}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: isWithinQuota ? 'var(--color-success)' : 'var(--color-text-muted)' }}>
                        {isWithinQuota ? 'Dalam Kuota' : 'Cadangan'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      {dec ? (
                        <div>
                          <StatusBadge status={dec.outcome} />
                          <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
                            "{dec.reason.slice(0, 35)}..."
                          </div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)' }}>
                          Belum Ditetapkan
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Disclaimer SOT */}
        <div
          style={{
            fontSize: '11.5px',
            color: 'var(--color-text-muted)',
            borderTop: '1px solid var(--color-line)',
            paddingTop: '14px',
            lineHeight: 1.5,
          }}
        >
          <strong>DISCLAIMER SISTEM:</strong> Skor SAW dan pemeringkatan dalam dokumen ini dihasilkan secara matematis berdasarkan kriteria pembobotan yang berlaku untuk membantu pengambilan keputusan administratif. Keputusan penerima bantuan sah sepenuhnya mengacu pada ketetapan pimpinan yang disahkan melalui musyawarah desa.
        </div>
      </div>
    </div>
  )
}

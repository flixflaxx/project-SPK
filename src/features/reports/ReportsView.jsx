import { Printer, FileText, Award } from 'lucide-react'
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
          <div
            className="clay-item"
            style={{
              padding: '24px',
              textAlign: 'center',
              color: 'var(--color-text-muted)',
              fontSize: '13.5px',
            }}
          >
            Belum ada hasil kalkulasi SAW untuk dicetak sebagai laporan resmi. Silakan jalankan kalkulasi terlebih dahulu.
          </div>
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
            className="clay-btn"
            onClick={() => window.print()}
            style={{
              padding: '10px 20px',
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

      {/* Official Report Document Container with Claymorphism */}
      <div
        className="printable-report clay-card"
        style={{
          padding: '36px 40px',
          marginBottom: '24px',
        }}
      >
        {/* Report Official Header */}
        <div
          style={{
            textAlign: 'center',
            borderBottom: '3px double rgba(22, 118, 91, 0.3)',
            paddingBottom: '22px',
            marginBottom: '24px',
          }}
        >
          <h2
            style={{
              fontSize: '20px',
              fontWeight: '900',
              textTransform: 'uppercase',
              color: 'var(--color-green-950)',
              letterSpacing: '0.8px',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Pemerintah Kampung Bulak Amah
          </h2>
          <h3
            style={{
              fontSize: '15.5px',
              fontWeight: '800',
              color: 'var(--color-green-800)',
              marginTop: '6px',
            }}
          >
            Laporan Hasil Seleksi Calon Penerima Bantuan Sosial
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
            Periode: <strong>{activePeriod?.name}</strong> · Pagu Kuota: <strong>{quota} Penerima</strong>
          </p>
        </div>

        {/* Metadata section in Clay Item */}
        <div
          className="clay-item"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '14px',
            fontSize: '12.5px',
            padding: '18px 24px',
            borderRadius: '20px',
            marginBottom: '26px',
          }}
        >
          <div>
            <div><strong>Nomor Run:</strong> <code>{calculationRun.id}</code></div>
            <div style={{ marginTop: '3px' }}><strong>Waktu Kalkulasi:</strong> {new Date(executedAt).toLocaleString('id-ID')}</div>
            <div style={{ marginTop: '3px' }}><strong>Metodologi:</strong> Simple Additive Weighting (SAW) Deterministik</div>
          </div>
          <div>
            <div><strong>Versi Algoritme:</strong> <code>{algorithmVersion}</code></div>
            <div style={{ marginTop: '3px' }}><strong>Versi Kriteria:</strong> {criteriaVersionLabel}</div>
            <div style={{ marginTop: '3px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <strong>Status Dokumen:</strong>
              <span className="clay-badge" style={{ backgroundColor: '#edf8f3', color: 'var(--color-green-700)', padding: '2px 8px', fontSize: '11px', fontWeight: '800' }}>
                RESMI (Snapshot Immutable)
              </span>
            </div>
          </div>
        </div>

        {/* Section 1: Kriteria & Bobot */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div className="clay-bubble" style={{ width: '28px', height: '28px', backgroundColor: '#e0f2fe', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={15} />
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-green-950)' }}>
              I. Konfigurasi Kriteria dan Bobot Preferensi
            </h4>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '8px 14px', textAlign: 'left', fontWeight: '800' }}>Kode</th>
                  <th style={{ padding: '8px 14px', textAlign: 'left', fontWeight: '800' }}>Nama Kriteria</th>
                  <th style={{ padding: '8px 14px', textAlign: 'center', fontWeight: '800' }}>Tipe</th>
                  <th style={{ padding: '8px 14px', textAlign: 'right', fontWeight: '800' }}>Bobot (W)</th>
                  <th style={{ padding: '8px 14px', textAlign: 'left', fontWeight: '800' }}>Deskripsi</th>
                </tr>
              </thead>
              <tbody>
                {criteria.map((c) => (
                  <tr key={c.code} className="clay-item">
                    <td style={{ padding: '10px 14px', fontWeight: '800', borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px' }}>
                      <span className="clay-badge" style={{ backgroundColor: '#edf8f3', color: 'var(--color-green-800)', padding: '2px 8px', fontSize: '11px' }}>
                        {c.code}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', fontWeight: '700', color: 'var(--color-green-950)' }}>{c.name}</td>
                    <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                      <span className="clay-badge" style={{ backgroundColor: c.type === 'COST' ? '#fef3c7' : '#e0f2fe', color: c.type === 'COST' ? 'var(--color-warning)' : '#0284c7', padding: '2px 8px', fontSize: '11px', fontWeight: '800' }}>
                        {c.type}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: '800', color: 'var(--color-green-900)' }}>{c.weightText}</td>
                    <td style={{ padding: '10px 14px', color: 'var(--color-text-muted)', borderTopRightRadius: '12px', borderBottomRightRadius: '12px' }}>{c.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: Hasil Akhir & Keputusan */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div className="clay-bubble" style={{ width: '28px', height: '28px', backgroundColor: '#edf8f3', color: 'var(--color-green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={15} />
            </div>
            <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--color-green-950)' }}>
              II. Tabel Perangkingan SAW dan Status Penetapan Akhir
            </h4>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px', fontSize: '12.5px' }}>
              <thead>
                <tr style={{ color: 'var(--color-text-muted)', fontSize: '11px', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px 14px', textAlign: 'center', width: '8%', fontWeight: '800' }}>Rank</th>
                  <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '800' }}>Nama Warga & NIK</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', width: '16%', fontWeight: '800' }}>Skor SAW (V)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', width: '18%', fontWeight: '800' }}>Rekomendasi Kuota</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center', width: '24%', fontWeight: '800' }}>Keputusan Pimpinan</th>
                </tr>
              </thead>
              <tbody>
                {results.map((row) => {
                  const cand = candidates.find((c) => c.id === row.candidateId)
                  const res = residents.find((r) => r.id === cand?.residentId)
                  const dec = latestDecision(decisions, calculationRun.id, row.candidateId)
                  const isWithinQuota = row.rank <= quota

                  return (
                    <tr key={row.candidateId} className="clay-item">
                      <td style={{ padding: '12px 14px', textAlign: 'center', fontWeight: '900', color: 'var(--color-green-950)', borderTopLeftRadius: '14px', borderBottomLeftRadius: '14px' }}>
                        <span className="clay-marble" style={{ width: '28px', height: '28px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          #{row.rank}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: '800', color: 'var(--color-green-950)' }}>{res?.name || row.candidateId}</div>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                          NIK: <code style={{ color: 'var(--color-green-700)' }}>{res?.nikMasked}</code>
                        </div>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: '800', fontFamily: 'monospace', fontSize: '13.5px', color: 'var(--color-green-700)' }}>
                        {formatExact(row.preference.exact, 4)}
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                        <span
                          className="clay-badge"
                          style={{
                            fontSize: '11.5px',
                            fontWeight: '800',
                            backgroundColor: isWithinQuota ? '#edf8f3' : 'var(--color-surface-muted)',
                            color: isWithinQuota ? 'var(--color-green-700)' : 'var(--color-text-muted)',
                            padding: '4px 10px',
                          }}
                        >
                          {isWithinQuota ? 'Dalam Kuota' : 'Cadangan'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 14px', textAlign: 'center', borderTopRightRadius: '14px', borderBottomRightRadius: '14px' }}>
                        {dec ? (
                          <div>
                            <StatusBadge status={dec.outcome} />
                            <div style={{ fontSize: '11px', color: 'var(--color-text-subtle)', marginTop: '3px' }}>
                              "{dec.reason.slice(0, 32)}..."
                            </div>
                          </div>
                        ) : (
                          <span style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', fontStyle: 'italic' }}>
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
        </div>

        {/* Disclaimer SOT */}
        <div
          className="clay-item"
          style={{
            fontSize: '11.5px',
            color: 'var(--color-text-muted)',
            padding: '16px 20px',
            borderRadius: '16px',
            lineHeight: 1.6,
          }}
        >
          <strong style={{ color: 'var(--color-green-950)' }}>DISCLAIMER SISTEM:</strong> Skor SAW dan pemeringkatan dalam dokumen ini dihasilkan secara matematis berdasarkan kriteria pembobotan yang berlaku untuk membantu pengambilan keputusan administratif. Keputusan penerima bantuan sah sepenuhnya mengacu pada ketetapan pimpinan yang disahkan melalui musyawarah desa.
        </div>
      </div>
    </div>
  )
}

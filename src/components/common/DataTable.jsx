import { FolderOpen, Loader2 } from 'lucide-react'

export function DataTable({
  columns,
  data,
  keyField = 'id',
  emptyMessage = 'Tidak ada data ditemukan.',
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <div
        className="clay-item"
        style={{
          padding: '40px 24px',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '14px',
          margin: '12px 0',
        }}
      >
        <Loader2
          size={26}
          color="var(--color-green-700)"
          aria-hidden="true"
          style={{ display: 'inline-block', marginBottom: '8px', animation: 'spin 1s linear infinite' }}
        />
        <p style={{ fontWeight: '600' }}>Memuat data...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div
        className="clay-item"
        style={{
          padding: '40px 24px',
          textAlign: 'center',
          margin: '12px 0',
        }}
      >
        <FolderOpen
          size={36}
          color="var(--color-text-subtle)"
          aria-hidden="true"
          style={{ display: 'inline-block', marginBottom: '8px' }}
        />
        <p style={{ fontWeight: '700', color: 'var(--color-green-950)', fontSize: '15px' }}>Data Kosong</p>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="table-responsive-container" style={{ overflowX: 'auto', width: '100%', WebkitOverflowScrolling: 'touch' }}>
      <table
        style={{
          width: '100%',
          minWidth: '580px',
          borderCollapse: 'separate',
          borderSpacing: '0 4px',
          fontSize: '13.5px',
          textAlign: 'left',
        }}
      >
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                style={{
                  padding: '12px 14px',
                  fontWeight: '800',
                  color: 'var(--color-green-950)',
                  backgroundColor: '#eaf4ef',
                  whiteSpace: 'nowrap',
                  fontSize: '12px',
                  letterSpacing: '0.4px',
                  textTransform: 'uppercase',
                  width: col.width,
                  textAlign: col.align || 'left',
                  borderTop: 'none',
                  borderBottom: '2px solid #dce8e0',
                  borderLeft: 'none',
                  borderRight: 'none',
                  borderRadius: idx === 0 ? '12px 0 0 12px' : idx === columns.length - 1 ? '0 12px 12px 0' : undefined,
                }}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={row[keyField] || rowIdx}
              style={{
                backgroundColor: rowIdx % 2 === 0 ? '#ffffff' : '#f9fcfb',
                transition: 'background-color 0.2s ease, transform 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#edf8f3'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  rowIdx % 2 === 0 ? '#ffffff' : '#f9fcfb'
              }}
            >
              {columns.map((col, colIdx) => {
                const value = row[col.key]
                return (
                  <td
                    key={col.key || colIdx}
                    style={{
                      padding: '13px 14px',
                      color: 'var(--color-text-main)',
                      verticalAlign: 'middle',
                      textAlign: col.align || 'left',
                      borderBottom: '1px solid rgba(22, 118, 91, 0.06)',
                      borderRadius:
                        colIdx === 0
                          ? '12px 0 0 12px'
                          : colIdx === columns.length - 1
                            ? '0 12px 12px 0'
                            : undefined,
                    }}
                  >
                    {col.render ? col.render(value, row, rowIdx) : value ?? '—'}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

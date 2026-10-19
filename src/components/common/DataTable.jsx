

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
        style={{
          padding: 'var(--space-2xl)',
          textAlign: 'center',
          color: 'var(--color-text-muted)',
          fontSize: '14px',
        }}
      >
        <Loader2
          size={24}
          color="var(--color-green-700)"
          aria-hidden="true"
          style={{ display: 'inline-block', marginBottom: '8px', animation: 'spin 1s linear infinite' }}
        />
        <p>Memuat data...</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div
        style={{
          padding: 'var(--space-2xl)',
          textAlign: 'center',
          backgroundColor: 'var(--color-surface-hover)',
          borderRadius: 'var(--radius-md)',
          border: '1px dashed var(--color-line-dark)',
          margin: 'var(--space-sm) 0',
        }}
      >
        <FolderOpen
          size={32}
          color="var(--color-text-subtle)"
          aria-hidden="true"
          style={{ display: 'inline-block', marginBottom: '8px' }}
        />
        <p style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>Data Kosong</p>
        <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: '4px' }}>{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '13.5px',
          textAlign: 'left',
        }}
      >
        <thead>
          <tr style={{ borderBottom: '2px solid var(--color-line)' }}>
            {columns.map((col, idx) => (
              <th
                key={col.key || idx}
                style={{
                  padding: '12px 14px',
                  fontWeight: '700',
                  color: 'var(--color-green-950)',
                  backgroundColor: 'var(--color-surface-muted)',
                  whiteSpace: 'nowrap',
                  fontSize: '12.5px',
                  letterSpacing: '0.3px',
                  textTransform: 'uppercase',
                  width: col.width,
                  textAlign: col.align || 'left',
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
                borderBottom: '1px solid var(--color-line)',
                backgroundColor: rowIdx % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-hover)',
                transition: 'background-color var(--transition-fast)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f8f5'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor =
                  rowIdx % 2 === 0 ? 'var(--color-surface)' : 'var(--color-surface-hover)'
              }}
            >
              {columns.map((col, colIdx) => {
                const value = row[col.key]
                return (
                  <td
                    key={col.key || colIdx}
                    style={{
                      padding: '12px 14px',
                      color: 'var(--color-text-main)',
                      verticalAlign: 'middle',
                      textAlign: col.align || 'left',
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

import { useState, useEffect, useRef } from 'react'
import { FolderOpen, Plus, Users, FileCheck2, Home, Search } from 'lucide-react'
import { DataTable } from '../../components/common/DataTable.jsx'
import { Modal } from '../../components/common/Modal.jsx'
import { PageHeader } from '../../components/common/PageHeader.jsx'
import { Panel } from '../../components/common/Panel.jsx'

export function ResidentsView({ residents, onAddResident }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    nik: '',
    birthDate: '',
    addressStreet: '',
    addressRtRw: '',
    phone: '',
  })
  const [formError, setFormError] = useState('')
  const containerRef = useRef(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.anime && containerRef.current) {
      window.anime({
        targets: containerRef.current.querySelectorAll('.resident-stat-card'),
        opacity: [0, 1],
        translateY: [12, 0],
        delay: window.anime.stagger(80),
        duration: 450,
        easing: 'easeOutCubic',
      })
    }
  }, [])

  const filteredResidents = residents.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.addressRtRw.includes(searchQuery) ||
      r.addressStreet.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalDocuments = residents.reduce((acc, r) => acc + (r.documentCount || 0), 0)

  function handleCreate(e) {
    e.preventDefault()
    if (!formData.name.trim()) {
      setFormError('Nama lengkap warga wajib diisi.')
      return
    }
    if (formData.nik.length !== 16 || !/^\d+$/.test(formData.nik)) {
      setFormError('NIK harus tepat 16 digit angka.')
      return
    }
    const masked = `${formData.nik.slice(0, 6)}******${formData.nik.slice(12)}`
    const newResident = {
      id: `res-${Date.now()}`,
      nikMasked: masked,
      nikLookupHash: `hash-${Date.now()}`,
      name: formData.name.trim(),
      birthDate: formData.birthDate || '1980-01-01',
      addressStreet: formData.addressStreet.trim() || 'Kampung Bulak Amah',
      addressRtRw: formData.addressRtRw.trim() || '001/003',
      phone: formData.phone.trim() || '0812-****-0000',
      documentCount: 1,
      createdAt: new Date().toISOString(),
    }
    onAddResident(newResident)
    setIsModalOpen(false)
    setFormData({ name: '', nik: '', birthDate: '', addressStreet: '', addressRtRw: '', phone: '' })
    setFormError('')
  }

  const columns = [
    {
      key: 'name',
      label: 'Nama Warga',
      width: '22%',
      render: (val) => (
        <span style={{ fontWeight: '700', color: 'var(--color-green-950)' }}>
          {val}
        </span>
      ),
    },
    {
      key: 'nikMasked',
      label: 'NIK (Masked)',
      width: '18%',
      render: (val) => (
        <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--color-green-700)' }}>
          {val}
        </span>
      ),
    },
    {
      key: 'addressRtRw',
      label: 'RT / RW',
      width: '12%',
      render: (val) => (
        <span style={{ fontWeight: '600', color: 'var(--color-text-main)' }}>{val}</span>
      ),
    },
    { key: 'addressStreet', label: 'Alamat Detail', width: '22%' },
    {
      key: 'documentCount',
      label: 'Bukti Berkas',
      width: '14%',
      render: (count) => (
        <span
          style={{
            fontSize: '12px',
            color: 'var(--color-green-700)',
            backgroundColor: '#edf8f3',
            padding: '3px 8px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
        >
          <FolderOpen size={13} /> {count} Dokumen
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Aksi',
      width: '12%',
      render: (_, row) => (
        <button
          type="button"
          onClick={() => alert(`Detail profil ${row.name} (Simulasi preview)`)}
          style={{
            fontSize: '12px',
            color: 'var(--color-green-700)',
            fontWeight: '700',
            textDecoration: 'underline',
          }}
        >
          Lihat Profil
        </button>
      ),
    },
  ]

  return (
    <div ref={containerRef}>
      <PageHeader
        featureNum={3}
        title="Data Warga"
        description="Pengelolaan identitas warga dan berkas kependudukan."
        actions={
          <button
            type="button"
            className="btn-action-glow"
            onClick={() => setIsModalOpen(true)}
            style={{
              backgroundColor: 'var(--color-green-700)',
              color: 'var(--color-text-inverse)',
              padding: '9px 18px',
              borderRadius: 'var(--radius-md)',
              fontWeight: '700',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Plus size={16} />
            <span>Tambah Data Warga</span>
          </button>
        }
      />

      {/* Top 3 Squircle Metric Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div
          className="resident-stat-card interactive-card"
          style={{
            backgroundColor: 'var(--color-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-line)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>TOTAL WARGA TERDAFTAR</div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '4px' }}>
              {residents.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Jiwa</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              Basis data master kependudukan
            </div>
          </div>
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
            }}
          >
            <Users size={22} />
          </div>
        </div>

        <div
          className="resident-stat-card interactive-card"
          style={{
            backgroundColor: 'var(--color-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-line)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>BERKAS TERALOKASI</span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '4px' }}>
              {totalDocuments} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Dokumen</span>
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              KTP, KK, dan surat keterangan RT
            </div>
          </div>
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
            }}
          >
            <FileCheck2 size={22} />
          </div>
        </div>

        <div
          className="resident-stat-card interactive-card"
          style={{
            backgroundColor: 'var(--color-surface)',
            padding: '16px 20px',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-line)',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--color-text-muted)' }}>WILAYAH CAKUPAN</div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--color-green-950)', marginTop: '6px' }}>
              Bulak Amah
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--color-text-subtle)', marginTop: '2px' }}>
              RT 001 - RT 003 / RW 003
            </div>
          </div>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#fef3c7',
              color: 'var(--color-warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Home size={22} />
          </div>
        </div>
      </div>

      <Panel>
        <div style={{ marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, maxWidth: '420px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-subtle)' }} />
            <input
              type="text"
              placeholder="Cari berdasarkan nama warga atau RT/RW..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px 9px 36px',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-line-dark)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
          </div>
          <span style={{ fontSize: '12.5px', color: 'var(--color-text-muted)' }}>
            Menampilkan {filteredResidents.length} dari {residents.length} warga
          </span>
        </div>

        <DataTable columns={columns} data={filteredResidents} />
      </Panel>

      {/* Modal Tambah Warga */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Data Warga Baru">
        {formError && (
          <div
            style={{
              backgroundColor: 'var(--color-danger-bg)',
              color: 'var(--color-danger)',
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '12.5px',
              marginBottom: '14px',
            }}
          >
            {formError}
          </div>
        )}
        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '4px' }}>
              Nama Lengkap Warga
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-line-dark)', fontSize: '13px' }}
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '4px' }}>
              NIK (16 Digit Angka)
            </label>
            <input
              type="text"
              maxLength={16}
              required
              placeholder="3201012345670001"
              value={formData.nik}
              onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-line-dark)', fontSize: '13px', fontFamily: 'monospace' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '4px' }}>
                RT / RW
              </label>
              <input
                type="text"
                placeholder="001/003"
                value={formData.addressRtRw}
                onChange={(e) => setFormData({ ...formData, addressRtRw: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-line-dark)', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '4px' }}>
                Nomor Telepon / HP
              </label>
              <input
                type="text"
                placeholder="0812-xxxx-xxxx"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-line-dark)', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '600', marginBottom: '4px' }}>
              Alamat Jalan / Tempat Tinggal
            </label>
            <input
              type="text"
              placeholder="Jl. Bulak Amah RT 01"
              value={formData.addressStreet}
              onChange={(e) => setFormData({ ...formData, addressStreet: e.target.value })}
              style={{ width: '100%', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-line-dark)', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              style={{ padding: '8px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-line-dark)', fontSize: '13px' }}
            >
              Batal
            </button>
            <button
              type="submit"
              className="btn-action-glow"
              style={{ padding: '8px 18px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-green-700)', color: '#fff', fontWeight: '700', fontSize: '13px' }}
            >
              Simpan Data Warga
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

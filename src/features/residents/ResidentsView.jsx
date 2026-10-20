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
    const anime = typeof window !== 'undefined' ? window.anime : null
    if (anime && containerRef.current) {
      anime({
        targets: containerRef.current.querySelectorAll('.resident-stat-card'),
        opacity: [0, 1],
        translateY: [16, 0],
        delay: anime.stagger(80),
        duration: 550,
        easing: 'easeOutBack',
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
        <span style={{ fontWeight: '800', color: 'var(--color-green-950)' }}>
          {val}
        </span>
      ),
    },
    {
      key: 'nikMasked',
      label: 'NIK (Masked)',
      width: '18%',
      render: (val) => (
        <span style={{ fontFamily: 'monospace', fontWeight: '800', color: 'var(--color-green-700)' }}>
          {val}
        </span>
      ),
    },
    {
      key: 'addressRtRw',
      label: 'RT / RW',
      width: '12%',
      render: (val) => (
        <span className="clay-badge" style={{ backgroundColor: '#edf8f3', color: 'var(--color-green-800)', padding: '3px 10px' }}>
          {val}
        </span>
      ),
    },
    { key: 'addressStreet', label: 'Alamat Detail', width: '22%' },
    {
      key: 'documentCount',
      label: 'Bukti Berkas',
      width: '14%',
      render: (count) => (
        <span
          className="clay-badge"
          style={{
            fontSize: '11.5px',
            color: 'var(--color-green-700)',
            backgroundColor: '#edf8f3',
            padding: '4px 10px',
            fontWeight: '700',
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
          className="clay-badge"
          style={{
            fontSize: '11.5px',
            color: 'var(--color-green-700)',
            backgroundColor: '#ffffff',
            fontWeight: '700',
            cursor: 'pointer',
            padding: '4px 12px',
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
            className="clay-btn"
            onClick={() => setIsModalOpen(true)}
            style={{
              padding: '11px 22px',
              fontSize: '13px',
            }}
          >
            <Plus size={16} />
            <span>Tambah Data Warga</span>
          </button>
        }
      />

      {/* Top 3 Squircle Metric Cards with Claymorphism */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '20px',
          marginBottom: '26px',
        }}
      >
        <div
          className="resident-stat-card clay-card"
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
              TOTAL WARGA TERDAFTAR
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-950)', marginTop: '6px', lineHeight: 1.1 }}>
              {residents.length} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Jiwa</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              Basis data master kependudukan
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
          className="resident-stat-card clay-card"
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
                BERKAS TERALOKASI
              </span>
              <span className="pulse-indicator" />
            </div>
            <div style={{ fontSize: '30px', fontWeight: '800', fontFamily: 'var(--font-heading)', color: 'var(--color-green-700)', marginTop: '6px', lineHeight: 1.1 }}>
              {totalDocuments} <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-text-muted)' }}>Dokumen</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              KTP, KK, dan surat keterangan RT
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
            <FileCheck2 size={22} />
          </div>
        </div>

        <div
          className="resident-stat-card clay-card"
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
              WILAYAH CAKUPAN
            </div>
            <div style={{ fontSize: '26px', fontWeight: '800', color: 'var(--color-green-950)', marginTop: '6px', lineHeight: 1.1 }}>
              Bulak Amah
            </div>
            <div style={{ fontSize: '12px', color: 'var(--color-text-subtle)', marginTop: '4px' }}>
              RT 001 - RT 003 / RW 003
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
            <Home size={22} />
          </div>
        </div>
      </div>

      <Panel>
        <div style={{ marginBottom: '20px', display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px', maxWidth: '440px' }}>
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-green-700)' }} />
            <input
              type="text"
              placeholder="Cari berdasarkan nama warga atau RT/RW..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 16px 11px 42px',
                borderRadius: '9999px',
                fontSize: '13px',
              }}
            />
          </div>
          <span className="clay-badge" style={{ backgroundColor: '#ffffff', color: 'var(--color-text-muted)', fontSize: '12px', padding: '7px 14px' }}>
            Menampilkan {filteredResidents.length} dari {residents.length} warga
          </span>
        </div>

        <DataTable columns={columns} data={filteredResidents} />
      </Panel>

      {/* Modal Tambah Warga */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah Data Warga Baru">
        {formError && (
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
            {formError}
          </div>
        )}
        <form onSubmit={handleCreate}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px', color: 'var(--color-green-950)' }}>
              Nama Lengkap Warga
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px', color: 'var(--color-green-950)' }}>
              NIK (16 Digit Angka)
            </label>
            <input
              type="text"
              maxLength={16}
              required
              placeholder="3201012345670001"
              value={formData.nik}
              onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
              style={{ width: '100%', fontFamily: 'monospace' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px', color: 'var(--color-green-950)' }}>
                RT / RW
              </label>
              <input
                type="text"
                placeholder="001/003"
                value={formData.addressRtRw}
                onChange={(e) => setFormData({ ...formData, addressRtRw: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px', color: 'var(--color-green-950)' }}>
                Nomor Telepon / HP
              </label>
              <input
                type="text"
                placeholder="0812-xxxx-xxxx"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{ width: '100%' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '22px' }}>
            <label style={{ display: 'block', fontSize: '12.5px', fontWeight: '700', marginBottom: '6px', color: 'var(--color-green-950)' }}>
              Alamat Jalan / Tempat Tinggal
            </label>
            <input
              type="text"
              placeholder="Jl. Bulak Amah RT 01"
              value={formData.addressStreet}
              onChange={(e) => setFormData({ ...formData, addressStreet: e.target.value })}
              style={{ width: '100%' }}
            />
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
              className="clay-btn"
              style={{ padding: '9px 22px', fontSize: '13px' }}
            >
              Simpan Data Warga
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

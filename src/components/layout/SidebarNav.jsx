import { useState, useEffect, useRef } from 'react'
import {
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  X,
  Sparkles,
} from 'lucide-react'
import { NAVIGATION_GROUPS } from '../../app/navigation.js'

export function SidebarNav({
  activeView,
  onViewChange,
  isOpen,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) {
  // State manual toggle oleh pengguna: mapping groupId -> boolean
  const [manualToggles, setManualToggles] = useState({})

  // Temukan grup induk dari activeView saat ini
  const activeParent = NAVIGATION_GROUPS.find((group) =>
    group.items.some((item) => item.id === activeView)
  )

  // Tentukan apakah grup terbuka: jika di-toggle user ikuti user, jika belum otomatis buka jika grup aktif
  function isGroupOpen(groupId) {
    if (groupId in manualToggles) {
      return manualToggles[groupId]
    }
    return activeParent?.id === groupId
  }

  // Toggle buka/tutup accordion submenu
  function handleToggleGroup(groupId) {
    setManualToggles((prev) => ({
      ...prev,
      [groupId]: !isGroupOpen(groupId),
    }))
  }

  // State popover submenu saat collapsed mode: { groupId, rect } | null
  const [flyoutMenu, setFlyoutMenu] = useState(null)
  const asideRef = useRef(null)

  // Listener tombol Escape untuk mobile drawer dan popover
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        if (isOpen && onClose) onClose()
        setFlyoutMenu(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Menutup flyout saat klik di luar
  useEffect(() => {
    function handleClickOutside(e) {
      if (flyoutMenu && !e.target.closest('.sidebar-flyout-popover') && !e.target.closest('.sidebar-item-parent')) {
        setFlyoutMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [flyoutMenu])

  // Handle klik item submenu
  function handleItemClick(itemId) {
    onViewChange(itemId)
    setFlyoutMenu(null)
    if (onClose) onClose()
  }

  // Handle hover pada collapsed mode
  function handleMouseEnterGroup(group, e) {
    if (!isCollapsed || group.single) return
    const rect = e.currentTarget.getBoundingClientRect()
    setFlyoutMenu({
      group,
      top: Math.max(12, Math.min(rect.top, window.innerHeight - 300)),
    })
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(9, 41, 31, 0.58)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            zIndex: 990,
            transition: 'opacity 0.25s ease',
          }}
        />
      )}

      {/* Main Sidebar Element */}
      <aside
        ref={asideRef}
        className={`sidebar-container sidebar-aside-desktop ${isOpen ? 'drawer-open' : ''}`}
        style={{
          width: isCollapsed ? '78px' : '270px',
          backgroundColor: 'var(--color-green-950)',
          background: 'linear-gradient(180deg, #09291f 0%, #0d382e 100%)',
          color: 'var(--color-text-inverse)',
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderRight: 'none',
          boxShadow: '8px 0 28px rgba(9, 41, 31, 0.24), inset -3px 0 8px rgba(0, 0, 0, 0.35)',
          userSelect: 'none',
          flexShrink: 0,
          overflow: 'visible',
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: isCollapsed ? '18px 12px' : '18px 16px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            gap: '10px',
            minHeight: '72px',
          }}
        >
          {/* Logo & Brand Info */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              overflow: 'hidden',
              cursor: 'pointer',
            }}
            onClick={() => handleItemClick('dashboard')}
            title="Ke Dashboard Utama"
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                backgroundColor: 'var(--color-green-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: 'var(--color-lime)',
                fontWeight: '900',
                fontFamily: 'var(--font-heading)',
                boxShadow:
                  '3px 5px 12px rgba(0, 0, 0, 0.3), inset 2px 2px 5px rgba(255, 255, 255, 0.35), inset -2px -2px 5px rgba(0, 0, 0, 0.25)',
                flexShrink: 0,
              }}
            >
              SPK
            </div>

            {!isCollapsed && (
              <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <h2
                  style={{
                    fontSize: '15px',
                    fontWeight: '800',
                    color: '#ffffff',
                    fontFamily: 'var(--font-heading)',
                    letterSpacing: '-0.2px',
                    lineHeight: 1.2,
                  }}
                >
                  Bansos Bulak Amah
                </h2>
                <p
                  style={{
                    fontSize: '11px',
                    color: '#9fe8d0',
                    fontWeight: '500',
                    marginTop: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>Metode SAW</span>
                  <span
                    style={{
                      width: '4px',
                      height: '4px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-lime)',
                    }}
                  />
                  <span style={{ fontSize: '10px', color: '#709689' }}>v0.1.0</span>
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons in Header: Collapse Toggle & Mobile Close */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Collapse/Expand Toggle Button (Hidden on Mobile) */}
            {onToggleCollapse && (
              <button
                type="button"
                onClick={onToggleCollapse}
                title={isCollapsed ? 'Perbesar Sidebar' : 'Kecilkan Sidebar'}
                aria-label={isCollapsed ? 'Perbesar Sidebar' : 'Kecilkan Sidebar'}
                style={{
                  display: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  color: '#9fe8d0',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                className="desktop-collapse-toggle"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.16)'
                  e.currentTarget.style.color = '#ffffff'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.color = '#9fe8d0'
                }}
              >
                {isCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
              </button>
            )}

            {/* Close Button on Mobile Drawer */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup Menu Navigasi"
              className="drawer-close-btn"
              style={{
                display: 'none',
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation List Container */}
        <nav
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: isCollapsed ? '14px 8px' : '14px 10px',
          }}
          aria-label="Navigasi Utama Sistem"
        >
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {NAVIGATION_GROUPS.map((group) => {
              // 1. Single Direct Link Menu (e.g. Dashboard)
              if (group.single && group.items[0]) {
                const item = group.items[0]
                const isActive = activeView === item.id
                const IconComponent = item.icon

                return (
                  <li key={group.id} className={isCollapsed ? 'sidebar-item-collapsed' : ''} style={{ position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => handleItemClick(item.id)}
                      title={isCollapsed ? item.label : undefined}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: isCollapsed ? 'center' : 'flex-start',
                        gap: isCollapsed ? '0' : '12px',
                        padding: isCollapsed ? '12px' : '10px 14px',
                        borderRadius: '16px',
                        backgroundColor: isActive ? 'var(--color-green-700)' : 'transparent',
                        color: isActive ? '#ffffff' : '#c8ded5',
                        fontSize: '13px',
                        fontWeight: isActive ? '800' : '600',
                        textAlign: 'left',
                        boxShadow: isActive
                          ? '3px 5px 14px rgba(0, 0, 0, 0.28), inset 2px 2px 4px rgba(255, 255, 255, 0.25), inset -2px -2px 4px rgba(0, 0, 0, 0.2)'
                          : 'none',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                          e.currentTarget.style.color = '#ffffff'
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.backgroundColor = 'transparent'
                          e.currentTarget.style.color = '#c8ded5'
                        }
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isActive ? 'var(--color-lime)' : 'inherit',
                          flexShrink: 0,
                        }}
                      >
                        <IconComponent size={18} />
                      </span>

                      {!isCollapsed && (
                        <>
                          <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.label}
                          </span>
                          {isActive && (
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--color-lime)',
                                boxShadow: '0 0 6px var(--color-lime)',
                              }}
                            />
                          )}
                        </>
                      )}
                    </button>

                    {/* Tooltip saat collapsed */}
                    {isCollapsed && (
                      <div className="sidebar-icon-tooltip">
                        {item.label}
                      </div>
                    )}
                  </li>
                )
              }

              // 2. Accordion Group Menu (with Submenu)
              const isOpenMenu = isGroupOpen(group.id)
              const hasActiveChild = group.items.some((item) => item.id === activeView)
              const GroupIcon = group.icon

              return (
                <li
                  key={group.id}
                  className={`sidebar-item-parent ${isCollapsed ? 'sidebar-item-collapsed' : ''}`}
                  style={{ position: 'relative' }}
                  onMouseEnter={(e) => handleMouseEnterGroup(group, e)}
                >
                  {/* Parent Accordion Trigger */}
                  <button
                    type="button"
                    onClick={() => {
                      if (isCollapsed) {
                        // Di mode collapsed, klik membuka flyout
                        handleMouseEnterGroup(group, { currentTarget: asideRef.current })
                      } else {
                        handleToggleGroup(group.id)
                      }
                    }}
                    title={isCollapsed ? group.title : undefined}
                    aria-expanded={isOpenMenu}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: isCollapsed ? 'center' : 'space-between',
                      gap: isCollapsed ? '0' : '10px',
                      padding: isCollapsed ? '12px' : '10px 14px',
                      borderRadius: '16px',
                      backgroundColor: hasActiveChild && !isOpenMenu ? 'rgba(22, 118, 91, 0.45)' : 'transparent',
                      color: hasActiveChild ? '#ffffff' : '#c8ded5',
                      fontSize: '13px',
                      fontWeight: hasActiveChild ? '800' : '600',
                      textAlign: 'left',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                      e.currentTarget.style.color = '#ffffff'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        hasActiveChild && !isOpenMenu ? 'rgba(22, 118, 91, 0.45)' : 'transparent'
                      e.currentTarget.style.color = hasActiveChild ? '#ffffff' : '#c8ded5'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                      <span
                        aria-hidden="true"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: hasActiveChild ? 'var(--color-lime)' : 'inherit',
                          flexShrink: 0,
                        }}
                      >
                        <GroupIcon size={18} />
                      </span>

                      {!isCollapsed && (
                        <span
                          style={{
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {group.title}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {hasActiveChild && (
                          <span
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              backgroundColor: 'var(--color-lime)',
                            }}
                          />
                        )}
                        <span
                          className={`chevron-icon ${isOpenMenu ? 'open' : ''}`}
                          style={{ color: '#709689' }}
                        >
                          <ChevronRight size={15} />
                        </span>
                      </div>
                    )}
                  </button>

                  {/* Tooltip saat collapsed */}
                  {isCollapsed && (
                    <div className="sidebar-icon-tooltip">
                      {group.title} ({group.items.length})
                    </div>
                  )}

                  {/* Accordion Submenu Body (Hanya aktif di mode Expanded) */}
                  {!isCollapsed && (
                    <div className={`accordion-submenu-wrapper ${isOpenMenu ? 'open' : ''}`}>
                      <div className="accordion-submenu-inner" style={{ paddingLeft: '14px', paddingTop: '4px' }}>
                        <div
                          style={{
                            borderLeft: '2px solid rgba(255, 255, 255, 0.1)',
                            marginLeft: '14px',
                            paddingLeft: '10px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '3px',
                            paddingBottom: '4px',
                          }}
                        >
                          {group.items.map((subItem) => {
                            const isSubActive = activeView === subItem.id
                            const SubIcon = subItem.icon

                            return (
                              <button
                                key={subItem.id}
                                type="button"
                                onClick={() => handleItemClick(subItem.id)}
                                style={{
                                  width: '100%',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  padding: '8px 12px',
                                  borderRadius: '12px',
                                  backgroundColor: isSubActive ? 'var(--color-green-700)' : 'transparent',
                                  color: isSubActive ? '#ffffff' : '#9fe8d0',
                                  fontSize: '12.5px',
                                  fontWeight: isSubActive ? '800' : '500',
                                  textAlign: 'left',
                                  boxShadow: isSubActive
                                    ? '2px 4px 10px rgba(0, 0, 0, 0.22), inset 1px 1px 3px rgba(255, 255, 255, 0.2)'
                                    : 'none',
                                  transition: 'all 0.15s ease',
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSubActive) {
                                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'
                                    e.currentTarget.style.color = '#ffffff'
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSubActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent'
                                    e.currentTarget.style.color = '#9fe8d0'
                                  }
                                }}
                              >
                                <span
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    opacity: isSubActive ? 1 : 0.7,
                                    color: isSubActive ? 'var(--color-lime)' : 'inherit',
                                  }}
                                >
                                  <SubIcon size={14} />
                                </span>

                                <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {subItem.label}
                                </span>

                                {isSubActive && (
                                  <span
                                    style={{
                                      width: '5px',
                                      height: '5px',
                                      borderRadius: '50%',
                                      backgroundColor: 'var(--color-lime)',
                                    }}
                                  />
                                )}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer Identity & Collapse Hint */}
        <div
          style={{
            padding: isCollapsed ? '14px 8px' : '14px 16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            fontSize: '11px',
            color: '#709689',
            display: 'flex',
            justifyContent: isCollapsed ? 'center' : 'space-between',
            alignItems: 'center',
          }}
        >
          {isCollapsed ? (
            <span style={{ fontSize: '10px', color: 'var(--color-lime)', fontWeight: '700' }}>v0.1</span>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={12} color="var(--color-lime)" />
                <span style={{ color: '#c8ded5', fontWeight: '600' }}>Bulak Amah</span>
              </div>
              <span style={{ fontSize: '10.5px' }}>SAW System</span>
            </>
          )}
        </div>
      </aside>

      {/* Floating Flyout Submenu on Collapsed Mode */}
      {isCollapsed && flyoutMenu && (
        <div
          className="sidebar-flyout-popover"
          style={{
            top: `${flyoutMenu.top}px`,
            left: '86px',
          }}
          onMouseLeave={() => setFlyoutMenu(null)}
        >
          <div
            style={{
              padding: '6px 8px 8px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <flyoutMenu.group.icon size={16} color="var(--color-lime)" />
            <span style={{ fontSize: '13px', fontWeight: '800', color: '#ffffff' }}>
              {flyoutMenu.group.title}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {flyoutMenu.group.items.map((item) => {
              const isSubActive = activeView === item.id
              const SubIcon = item.icon

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleItemClick(item.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '10px',
                    backgroundColor: isSubActive ? 'var(--color-green-700)' : 'transparent',
                    color: isSubActive ? '#ffffff' : '#c8ded5',
                    fontSize: '12.5px',
                    fontWeight: isSubActive ? '800' : '500',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSubActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.color = '#ffffff'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSubActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = '#c8ded5'
                    }
                  }}
                >
                  <SubIcon size={14} color={isSubActive ? 'var(--color-lime)' : 'inherit'} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {isSubActive && (
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--color-lime)',
                      }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

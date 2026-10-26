import { useState, useEffect } from 'react'
import { DemoBanner } from '../common/DemoBanner.jsx'
import { SidebarNav } from './SidebarNav.jsx'
import { Topbar } from './Topbar.jsx'

export function AppShell({
  activeView,
  onViewChange,
  activePeriod,
  currentUser,
  users,
  onUserChange,
  onLogoutClick,
  children,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(() => {
    try {
      return localStorage.getItem('spk_sidebar_collapsed') === 'true'
    } catch {
      return false
    }
  })

  // Sync isCollapsed ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem('spk_sidebar_collapsed', String(isCollapsed))
    } catch {
      // Ignore in private browsing
    }
  }, [isCollapsed])

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: '#eaf4ef',
      }}
    >
      <DemoBanner />
      <div style={{ display: 'flex', flex: 1, position: 'relative' }}>
        <SidebarNav
          activeView={activeView}
          onViewChange={onViewChange}
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          isCollapsed={isCollapsed}
          onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        />
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0,
            backgroundColor: '#eaf4ef',
          }}
        >
          <Topbar
            activePeriod={activePeriod}
            currentUser={currentUser}
            users={users}
            onUserChange={onUserChange}
            onSearchClick={() => onViewChange('search')}
            onLogoutClick={onLogoutClick}
            onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
            isCollapsed={isCollapsed}
          />
          <main
            key={activeView}
            className="page-enter-content app-main-content"
            style={{
              flex: 1,
              padding: '24px 32px',
              maxWidth: '1440px',
              width: '100%',
              margin: '0 auto',
              backgroundColor: '#eaf4ef',
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
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
            onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
          />
          <main
            key={activeView}
            className="page-enter-content"
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

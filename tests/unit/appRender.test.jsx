import { describe, it, expect } from 'vitest'
import { renderToString } from 'react-dom/server'
import { App } from '../../src/App.jsx'
import { ErrorBoundary } from '../../src/components/common/ErrorBoundary.jsx'

describe('App Smoke Test & Rendering Safety', () => {
  it('renders root App without crashing or white-screen errors', () => {
    const html = renderToString(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    )
    expect(html).toContain('Bansos Bulak Amah')
    expect(html).toContain('SPK')
    expect(html).toContain('Dashboard')
    expect(html.length).toBeGreaterThan(1000)
  })
})

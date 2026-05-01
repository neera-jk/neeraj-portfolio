import Nav from './components/Nav'
import Hero from './components/Hero'

function App() {
  return (
    <div className="page-wrapper" style={{ position: 'relative' }}>
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 55% 40% at 85% 5%, rgba(99,102,241,0.13) 0%, transparent 70%),
          radial-gradient(ellipse 40% 30% at 5% 90%, rgba(6,182,212,0.08) 0%, transparent 70%)
        `
      }} />
      <Nav />
      <Hero />
    </div>
  )
}

export default App
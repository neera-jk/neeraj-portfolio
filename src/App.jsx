import { useScroll, useTransform, motion } from 'framer-motion'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'

function App() {
  const { scrollYProgress } = useScroll()
  const progressHeight = useTransform(scrollYProgress, [0, 1], ['0vh', '100vh'])
  const orbX1 = useTransform(scrollYProgress, [0, 1], [85, 70])
  const orbX2 = useTransform(scrollYProgress, [0, 1], [5, 20])

  return (
    <div className="page-wrapper" style={{ position: 'relative' }}>
      <motion.div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: useTransform(
          [orbX1, orbX2],
          ([x1, x2]) => `
            radial-gradient(ellipse 55% 40% at ${x1}% 5%, rgba(99,102,241,0.13) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at ${x2}% 90%, rgba(6,182,212,0.08) 0%, transparent 70%)
          `
        ),
      }} />
      <motion.div
        style={{
          position: 'fixed',
          left: '20px',
          top: 0,
          width: '0.5px',
          height: progressHeight,
          background: 'linear-gradient(to bottom, #6366f1, #06b6d4)',
          zIndex: 200,
          borderRadius: '2px',
          transformOrigin: 'top',
        }}
      />
      <Nav />
      <Hero />
      <About />
    </div>
  )
}

export default App
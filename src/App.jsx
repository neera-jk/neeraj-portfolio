import { useRef, useEffect, useState, useCallback } from 'react'
import Nav from './components/Nav'
import SideNav from './components/SideNav'
import Hero from './components/Hero'
import About from './components/About'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Education from './components/Education'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Splash from './components/Splash'

function App() {
  const canvasRef = useRef(null)
  const [canvasOpacity, setCanvasOpacity] = useState(1)
  const [splashDone, setSplashDone] = useState(false)
  const [showNavLogo, setShowNavLogo] = useState(false)

  const handleSplashComplete = useCallback(() => setSplashDone(true), [])
  const handleLogoLanded = useCallback(() => setShowNavLogo(true), [])

  useEffect(() => {
    const onScroll = () => {
      const fade = Math.max(0, 1 - window.scrollY / (window.innerHeight * 0.6))
      setCanvasOpacity(fade)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!splashDone) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId
    let particles = []

    const dpr = window.devicePixelRatio || 1
    let w, h

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const init = () => {
      resize()
      particles = Array.from({ length: 400 }, () => {
        const tier = Math.random()
        const big = tier < 0.05
        const mid = tier < 0.22
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          // very slow drift, barely perceptible
          vx: (Math.random() - 0.5) * 0.04,
          vy: (Math.random() - 0.5) * 0.04,
          r: big ? 1.6 + Math.random() * 1.0
            : mid ? 0.7 + Math.random() * 0.7
              : 0.15 + Math.random() * 0.4,
          baseOpacity: big ? 0.9 + Math.random() * 0.1
            : mid ? 0.5 + Math.random() * 0.3
              : 0.15 + Math.random() * 0.2,
          phase: Math.random() * Math.PI * 2,
          twinkleSpeed: big ? 0.8 + Math.random() * 1.0
            : mid ? 0.4 + Math.random() * 0.7
              : 0.15 + Math.random() * 0.4,
          // glow radius very tight, just 1.5-2x the star size
          glowRatio: big ? 1.8 + Math.random() * 0.8
            : mid ? 1.5 + Math.random() * 0.6
              : 1.2 + Math.random() * 0.4,
          color: Math.random() < 0.78 ? '255,255,255'
            : Math.random() < 0.65 ? '165,180,252'
              : '103,232,249',
          big,
          mid
        }
      })
    }

    let t = 0

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      t += 0.008

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = w
        if (p.x > w) p.x = 0
        if (p.y < 0) p.y = h
        if (p.y > h) p.y = 0

        const twinkle = Math.sin(t * p.twinkleSpeed + p.phase) * 0.22
        const opacity = Math.min(1, Math.max(0, p.baseOpacity + twinkle))

        // tight glow, only slightly larger than the star core
        const glowR = p.r * p.glowRatio
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR)
        glow.addColorStop(0, `rgba(${p.color},${opacity * 0.35})`)
        glow.addColorStop(0.5, `rgba(${p.color},${opacity * 0.1})`)
        glow.addColorStop(1, `rgba(${p.color},0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // sharp bright core
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color},${opacity})`
        ctx.fill()

        // subtle cross flare only on the biggest brightest stars
        if (p.big && opacity > 0.85) {
          const fl = p.r * 4
          ctx.strokeStyle = `rgba(${p.color},${opacity * 0.15})`
          ctx.lineWidth = 0.5
          ctx.beginPath(); ctx.moveTo(p.x - fl, p.y); ctx.lineTo(p.x + fl, p.y); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(p.x, p.y - fl); ctx.lineTo(p.x, p.y + fl); ctx.stroke()
        }
      }

      animId = requestAnimationFrame(draw)
    }

    window.addEventListener('resize', resize)
    init()
    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [splashDone])

  return (
    <div style={{ position: 'relative' }}>
      {!splashDone && <Splash onComplete={handleSplashComplete} onLogoLanded={handleLogoLanded} />}
      <canvas ref={canvasRef} style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: canvasOpacity,
        transition: 'opacity 0.15s ease-out',
      }} />
      <div className="dot-grid" />
      <SideNav />
      <Nav showLogo={showNavLogo} />
      <div className="page-wrapper">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Projects />
        <Education />
        <Contact />
        <Footer />
      </div>
    </div>
  )
}

export default App
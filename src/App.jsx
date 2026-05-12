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
import CursorEffects from './components/CursorEffects'
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
    if (!splashDone) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    const dpr = window.devicePixelRatio || 1;
    let w, h;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const init = () => {
      resize();
      particles = Array.from({ length: 200 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.2 + 0.3,
        o: Math.random() * 0.6 + 0.2
      }));
    };

    let cachedTheme = document.documentElement.getAttribute('data-theme');
    let dotColor = cachedTheme === 'light' ? '79,70,229' : '165,180,252';
    let lineColor = cachedTheme === 'light' ? '79,70,229' : '99,102,241';

    const observer = new MutationObserver(() => {
      cachedTheme = document.documentElement.getAttribute('data-theme');
      dotColor = cachedTheme === 'light' ? '79,70,229' : '165,180,252';
      lineColor = cachedTheme === 'light' ? '79,70,229' : '99,102,241';
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const LINK_DIST = 100;
    const LINK_DIST_SQ = LINK_DIST * LINK_DIST;
    const TWO_PI = Math.PI * 2;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // -- update positions & draw dots in one batched path per opacity group --
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, TWO_PI);
        ctx.fillStyle = `rgba(${dotColor},${p.o})`;
        ctx.fill();
      }

      // -- draw connecting lines: compare squared distances, batch by opacity --
      ctx.lineWidth = 0.6;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < LINK_DIST_SQ) {
            const alpha = 0.15 * (1 - Math.sqrt(distSq) / LINK_DIST);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${lineColor},${alpha})`;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    init();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
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
      <CursorEffects />
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
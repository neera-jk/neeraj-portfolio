import { useState, useEffect, useCallback, useRef } from 'react'
import '../styles/Nav.css'

const SECTIONS = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Contact' },
]

const VISIBLE_COUNT = 4

function Nav({ showLogo = true }) {
    const [active, setActive] = useState('hero')
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
    const [carouselStart, setCarouselStart] = useState(0)
    const [isCompact, setIsCompact] = useState(false)
    const [thumb, setThumb] = useState({ left: 0, width: 0, ready: false })

    // One ref per section id, filled in as the buttons render.
    const linkRefs = useRef({})

    // detect compact mode based on nav center width
    useEffect(() => {
        const check = () => setIsCompact(window.innerWidth < 900)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    // keep active section in view on carousel
    useEffect(() => {
        if (!isCompact) return
        const idx = SECTIONS.findIndex(s => s.id === active)
        if (idx < carouselStart) {
            setCarouselStart(idx)
        } else if (idx >= carouselStart + VISIBLE_COUNT) {
            setCarouselStart(idx - VISIBLE_COUNT + 1)
        }
    }, [active, isCompact])

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    useEffect(() => {
        const detect = () => {
            const midY = window.scrollY + window.innerHeight / 2
            let current = SECTIONS[0]
            for (let i = SECTIONS.length - 1; i >= 0; i--) {
                const el = document.getElementById(SECTIONS[i].id)
                if (!el) continue
                if (el.offsetTop <= midY) {
                    current = SECTIONS[i]
                    break
                }
            }
            setActive(current.id)
        }
        window.addEventListener('scroll', detect, { passive: true })
        detect()
        return () => window.removeEventListener('scroll', detect)
    }, [])

    // Measure the active button and move the thumb onto it. If the active
    // section is outside the carousel window there is no button to measure, so
    // the thumb hides instead of jumping to a stale position.
    const measureThumb = useCallback(() => {
        const el = linkRefs.current[active]
        if (!el) {
            setThumb(prev => ({ ...prev, ready: false }))
            return
        }
        setThumb({ left: el.offsetLeft, width: el.offsetWidth, ready: true })
    }, [active])

    useEffect(() => {
        measureThumb()
    }, [measureThumb, isCompact, carouselStart])

    // Label widths change when the webfont swaps in, so measure again then.
    useEffect(() => {
        if (!document.fonts) return
        document.fonts.ready.then(measureThumb)
    }, [measureThumb])

    useEffect(() => {
        window.addEventListener('resize', measureThumb)
        return () => window.removeEventListener('resize', measureThumb)
    }, [measureThumb])

    const toggleTheme = useCallback(() => {
        const overlay = document.createElement('div')
        overlay.className = 'theme-fade-overlay'
        overlay.style.background = theme === 'dark' ? '#000' : '#fff'
        document.body.appendChild(overlay)
        overlay.offsetHeight
        overlay.classList.add('active')
        setTimeout(() => {
            setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
            setTimeout(() => {
                overlay.classList.remove('active')
                overlay.addEventListener('transitionend', () => overlay.remove())
            }, 80)
        }, 350)
    }, [theme])

    const scrollTo = (id) => {
        if (id === 'hero') {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
        }
    }

    const visibleSections = isCompact
        ? SECTIONS.slice(carouselStart, carouselStart + VISIBLE_COUNT)
        : SECTIONS

    const canPrev = carouselStart > 0
    const canNext = carouselStart + VISIBLE_COUNT < SECTIONS.length

    return (
        <nav className="nav">
            <a
                href="#hero"
                className={`nav-logo${showLogo ? '' : ' nav-logo--hidden'}`}
                onClick={(e) => {
                    e.preventDefault()
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
            >
                nk<em>.</em>
            </a>

            <div className="nav-center">
                {isCompact && (
                    <button
                        className={`nav-arrow ${!canPrev ? 'nav-arrow--hidden' : ''}`}
                        onClick={() => setCarouselStart(s => Math.max(0, s - 1))}
                        aria-label="Previous sections"
                    >
                        ‹
                    </button>
                )}

                <div className="nav-links">
                    <span
                        className={`nav-thumb${thumb.ready ? ' nav-thumb--ready' : ''}`}
                        style={{ left: `${thumb.left}px`, width: `${thumb.width}px` }}
                        aria-hidden="true"
                    />
                    {visibleSections.map(s => (
                        <button
                            key={s.id}
                            type="button"
                            ref={(el) => { linkRefs.current[s.id] = el }}
                            className={`nav-link ${active === s.id ? 'nav-link--active' : ''}`}
                            onClick={() => scrollTo(s.id)}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>

                {isCompact && (
                    <button
                        className={`nav-arrow ${!canNext ? 'nav-arrow--hidden' : ''}`}
                        onClick={() => setCarouselStart(s => Math.min(SECTIONS.length - VISIBLE_COUNT, s + 1))}
                        aria-label="Next sections"
                    >
                        ›
                    </button>
                )}
            </div>

            <div className="nav-right">
                <button
                    className="theme-toggle"
                    onClick={toggleTheme}
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="5" />
                            <line x1="12" y1="1" x2="12" y2="3" />
                            <line x1="12" y1="21" x2="12" y2="23" />
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                            <line x1="1" y1="12" x2="3" y2="12" />
                            <line x1="21" y1="12" x2="23" y2="12" />
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                        </svg>
                    ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                        </svg>
                    )}
                </button>
                <a href="/resume.pdf" className="nav-resume" target="_blank">
                    Resume ↗
                </a>
            </div>
        </nav>
    )
}

export default Nav

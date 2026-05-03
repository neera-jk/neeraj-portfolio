import { useState, useEffect, useCallback } from 'react'
import '../styles/Nav.css'

const SECTIONS = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About Me' },
    { id: 'experience', label: 'Work Experience' },
    { id: 'skills', label: 'Skills & Tech' },
    { id: 'projects', label: 'Selected Projects' },
    { id: 'education', label: 'Education' },
    { id: 'contact', label: 'Get in Touch' },
]

function Nav() {
    const [section, setSection] = useState('Home')
    const [pastHero, setPastHero] = useState(false)
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')

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
            setSection(current.label)
            setPastHero(window.scrollY > window.innerHeight * 0.5)
        }

        window.addEventListener('scroll', detect, { passive: true })
        detect()
        return () => window.removeEventListener('scroll', detect)
    }, [])

    const toggleTheme = useCallback(() => {
        const overlay = document.createElement('div')
        overlay.className = 'theme-fade-overlay'
        overlay.style.background = theme === 'dark' ? '#000' : '#fff'
        document.body.appendChild(overlay)

        // Force reflow then fade in
        overlay.offsetHeight
        overlay.classList.add('active')

        // Swap theme while screen is covered
        setTimeout(() => {
            setTheme(prev => (prev === 'dark' ? 'light' : 'dark'))
            // Fade out
            setTimeout(() => {
                overlay.classList.remove('active')
                overlay.addEventListener('transitionend', () => overlay.remove())
            }, 80)
        }, 350)
    }, [theme])

    return (
        <nav className="nav">
            <a href="#hero" className="nav-logo">
                nk<em>.</em>
            </a>
            <div className={`nav-section${pastHero ? ' visible' : ''}`}>
                {section}
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
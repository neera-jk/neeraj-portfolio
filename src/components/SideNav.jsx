import { useState, useEffect } from 'react'

const SECTIONS = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
]

function SideNav() {
    const [active, setActive] = useState('hero')
    const [hovered, setHovered] = useState(null)
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const onScroll = () => {
            setVisible(window.scrollY > window.innerHeight * 0.6)
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const observers = []
        SECTIONS.forEach(({ id }) => {
            const el = document.getElementById(id)
            if (!el) return
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActive(id)
                },
                { threshold: 0.3, rootMargin: '0px 0px -50% 0px' }
            )
            obs.observe(el)
            observers.push(obs)
        })
        return () => observers.forEach((o) => o.disconnect())
    }, [])

    return (
        <div className="side-nav" style={{
            opacity: visible ? 1 : 0,
            pointerEvents: visible ? 'auto' : 'none',
            transition: 'opacity 0.4s ease',
        }}>
            {SECTIONS.map(({ id, label }) => {
                const isActive = active === id
                const showLabel = hovered === id || isActive
                return (
                    <div
                        key={id}
                        className="side-nav-item"
                        onClick={() =>
                            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                        }
                        onMouseEnter={() => setHovered(id)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        <span
                            className="side-nav-dot"
                            style={{
                                width: isActive ? 10 : 6,
                                height: isActive ? 10 : 6,
                                background: isActive ? '#6366f1' : 'rgba(255,255,255,0.15)',
                                boxShadow: isActive ? '0 0 12px rgba(99,102,241,0.6)' : 'none',
                            }}
                        />
                        <span
                            className="side-nav-label"
                            style={{
                                opacity: showLabel ? 1 : 0,
                                color: isActive ? '#a5b4fc' : 'rgba(232,230,240,0.5)',
                            }}
                        >
                            {label}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}

export default SideNav

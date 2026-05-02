import { useState, useEffect } from 'react'

const SECTIONS = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
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
        const detect = () => {
            const midY = window.scrollY + window.innerHeight / 2
            let closest = SECTIONS[0].id
            let minDist = Infinity

            SECTIONS.forEach(({ id }) => {
                const el = document.getElementById(id)
                if (!el) return
                const top = el.offsetTop
                const dist = Math.abs(top - midY)
                if (dist < minDist) {
                    minDist = dist
                    closest = id
                }
            })
            setActive(closest)
        }

        window.addEventListener('scroll', detect, { passive: true })
        detect()
        return () => window.removeEventListener('scroll', detect)
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

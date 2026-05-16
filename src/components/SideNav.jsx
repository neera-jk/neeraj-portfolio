import { useState, useEffect } from 'react'
import '../styles/SideNav.css'

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
            let current = SECTIONS[0].id

            for (let i = SECTIONS.length - 1; i >= 0; i--) {
                const el = document.getElementById(SECTIONS[i].id)
                if (!el) continue
                if (el.offsetTop <= midY) {
                    current = SECTIONS[i].id
                    break
                }
            }
            setActive(current)
        }

        window.addEventListener('scroll', detect, { passive: true })
        detect()
        return () => window.removeEventListener('scroll', detect)
    }, [])

    return (
        <div className={`side-nav${visible ? ' side-nav--visible' : ''}`}>
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
                            className={`side-nav-dot${isActive ? ' side-nav-dot--active' : ''}`}
                        />
                        <span
                            className={`side-nav-label${showLabel ? ' side-nav-label--visible' : ''}${isActive ? ' side-nav-label--active' : ''}`}
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

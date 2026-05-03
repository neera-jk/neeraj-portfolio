import { useEffect, useRef } from 'react'
import '../styles/CursorEffects.css'

function CursorEffects() {
    const spotlightRef = useRef(null)

    useEffect(() => {
        const spotlight = spotlightRef.current
        let mx = 0, my = 0

        // Track mouse
        const onMove = (e) => {
            mx = e.clientX
            my = e.clientY

            // Spotlight follows instantly
            if (spotlight) {
                spotlight.style.background = `radial-gradient(circle 200px at ${mx}px ${my}px, rgba(99,102,241,0.06) 0%, transparent 70%)`
            }
        }

        // Ripple on click
        const onClick = (e) => {
            const ripple = document.createElement('div')
            ripple.className = 'click-ripple'
            ripple.style.left = e.clientX + 'px'
            ripple.style.top = e.clientY + 'px'
            document.body.appendChild(ripple)
            ripple.addEventListener('animationend', () => ripple.remove())
        }

        // Magnetic buttons — pull toward cursor on hover
        const magnetSelector = '.btn-main, .btn-ghost, .nav-resume, .social-icon'
        const onMagnetMove = (e) => {
            const target = e.target.closest(magnetSelector)
            if (!target) return
            const rect = target.getBoundingClientRect()
            const cx = rect.left + rect.width / 2
            const cy = rect.top + rect.height / 2
            const dx = (e.clientX - cx) * 0.25
            const dy = (e.clientY - cy) * 0.25
            target.style.transform = `translate(${dx}px, ${dy}px)`
            target.style.transition = 'transform 0.15s ease-out'
        }

        const onMagnetLeave = (e) => {
            const target = e.target.closest(magnetSelector)
            if (!target) return
            target.style.transform = ''
            target.style.transition = 'transform 0.3s ease-out'
        }

        window.addEventListener('mousemove', onMove)
        window.addEventListener('click', onClick)
        document.addEventListener('mousemove', onMagnetMove)
        document.addEventListener('mouseleave', onMagnetLeave, true)

        return () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('click', onClick)
            document.removeEventListener('mousemove', onMagnetMove)
            document.removeEventListener('mouseleave', onMagnetLeave, true)
        }
    }, [])

    return (
        <>
            {/* Spotlight overlay */}
            <div ref={spotlightRef} className="cursor-spotlight" />
        </>
    )
}

export default CursorEffects

import { useState, useEffect, useRef } from 'react'
import '../styles/Splash.css'

function Splash({ onComplete, onLogoLanded }) {
    const [phase, setPhase] = useState('revealing') // revealing → idle → flying → done
    const logoRef = useRef(null)

    useEffect(() => {
        const idleTimer = setTimeout(() => setPhase('idle'), 900)

        const flyTimer = setTimeout(() => {
            const navLogo = document.querySelector('.nav-logo')
            const splashLogo = logoRef.current
            if (navLogo && splashLogo) {
                const target = navLogo.getBoundingClientRect()
                const current = splashLogo.getBoundingClientRect()

                const dx = target.left + target.width / 2 - (current.left + current.width / 2)
                const dy = target.top + target.height / 2 - (current.top + current.height / 2)

                // Logo stays fully visible — only transform, no opacity
                splashLogo.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.0, 1)'
                splashLogo.style.transform = `translate(${dx}px, ${dy}px) scale(1)`
            }
            setPhase('flying')
        }, 1400)

        // Once logo has landed, show nav logo then fade out splash logo to match
        const doneTimer = setTimeout(() => {
            if (onLogoLanded) onLogoLanded()
            const splashLogo = logoRef.current
            if (splashLogo) {
                splashLogo.style.transition = 'opacity 0.15s ease'
                splashLogo.style.opacity = '0'
            }
            // Remove after crossfade completes
            setTimeout(() => {
                setPhase('done')
                onComplete()
            }, 160)
        }, 2200)

        return () => {
            clearTimeout(idleTimer)
            clearTimeout(flyTimer)
            clearTimeout(doneTimer)
        }
    }, [onComplete, onLogoLanded])

    if (phase === 'done') return null

    return (
        <div className={`splash ${phase}`}>
            <div className="splash-logo" ref={logoRef}>
                <span className="splash-text">nk</span>
                <span className="splash-text splash-accent">.</span>
            </div>
        </div>
    )
}

export default Splash

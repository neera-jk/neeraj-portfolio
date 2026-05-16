import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import '../styles/Hero.css'

const ROLES = [
    'ms cs @ northeastern \'27',
    'frontend engineer',
    'focused on healthtech UX',
]

const SUB_WORDS = [
    { text: 'Building' },
    { text: 'interfaces', accent: true },
    { text: 'that feel' },
    { text: 'good', accent: true },
    { text: 'to use.' }
]

const TYPE_SPEED = 60
const DELETE_SPEED = 36
const PAUSE_FULL = 1900
const PAUSE_NEXT = 400

function MaskReveal({ delay = 0, children, className = '' }) {
    return (
        <div className={`mask-wrap ${className}`}>
            <motion.div
                className="mask-inner"
                initial={{ y: '110%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
            >
                {children}
            </motion.div>
        </div>
    )
}

function Hero() {
    const [roleIdx, setRoleIdx] = useState(0)
    const [typed, setTyped] = useState('')
    const [phase, setPhase] = useState('typing')
    const [scrolled, setScrolled] = useState(false)

    const sectionRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start start', 'end start'],
    })
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
    const heroY = useTransform(scrollYProgress, [0, 0.8], [0, -60])

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    useEffect(() => {
        const current = ROLES[roleIdx]
        let timer

        if (phase === 'typing') {
            if (typed.length < current.length) {
                timer = setTimeout(() => {
                    setTyped(current.slice(0, typed.length + 1))
                }, TYPE_SPEED)
            } else {
                timer = setTimeout(() => setPhase('deleting'), PAUSE_FULL)
            }
        } else if (phase === 'deleting') {
            if (typed.length > 0) {
                timer = setTimeout(() => {
                    setTyped(current.slice(0, typed.length - 1))
                }, DELETE_SPEED)
            } else {
                timer = setTimeout(() => {
                    setRoleIdx((i) => (i + 1) % ROLES.length)
                    setPhase('typing')
                }, PAUSE_NEXT)
            }
        }

        return () => clearTimeout(timer)
    }, [typed, phase, roleIdx])

    return (
        <section className="hero" id="hero" ref={sectionRef}>
            <motion.div className="hero-content" style={{ opacity: heroOpacity, y: heroY }}>
                <div className="hero-left">
                    <MaskReveal delay={0.1}>
                        <div className="hero-eyebrow">
                            <span className="eyebrow-dot"></span>
                            Open to summer 2026 internships
                        </div>
                    </MaskReveal>

                    <MaskReveal delay={0.25}>
                        <div className="hero-greeting">Hi, I'm</div>
                    </MaskReveal>

                    <MaskReveal delay={0.4}>
                        <h1 className="hero-name">Neeraj Kumar</h1>
                    </MaskReveal>

                    <MaskReveal delay={0.55}>
                        <div className="hero-terminal">
                            <span className="terminal-prompt">❯</span>
                            <AnimatePresence mode="wait">
                                <span key={roleIdx} className="terminal-text">
                                    {typed}
                                </span>
                            </AnimatePresence>
                            <span className="cursor"></span>
                        </div>
                    </MaskReveal>

                    <div className="hero-sub">
                        {SUB_WORDS.map((w, i) => (
                            <span key={i} className="word-wrap">
                                <motion.span
                                    className={`word ${w.accent ? 'accent' : ''}`}
                                    initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
                                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                                    transition={{
                                        duration: 0.6,
                                        delay: 1.2 + i * 0.18,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                >
                                    {w.text}
                                </motion.span>
                            </span>
                        ))}
                    </div>

                    <motion.div
                        className="hero-btns"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <a href="#projects" className="btn-main">View work ↗</a>
                        <a href="/resume.pdf" className="btn-ghost" target="_blank" rel="noreferrer">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14,2 14,8 20,8" />
                            </svg>
                            View resume
                        </a>
                    </motion.div>

                    <motion.div
                        className="hero-socials"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <a href="https://github.com/neera-jk" target="_blank" rel="noreferrer" className="social-icon" aria-label="GitHub">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" /></svg>
                        </a>
                        <a href="https://linkedin.com/in/-neerajkumar-" target="_blank" rel="noreferrer" className="social-icon" aria-label="LinkedIn">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                        </a>
                        <a href="mailto:kumar.nee@northeastern.edu" className="social-icon" aria-label="Email">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                        </a>
                    </motion.div>
                </div>

                <motion.div
                    className="hero-right"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                >
                    <div className="avatar-wrap">
                        <div className="avatar-glow"></div>
                        <div className="avatar-ring">
                            <div className="avatar-inner">
                                <img src="/neeraj_emoji.png" alt="Neeraj" className="avatar-img" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            <motion.div
                className="scroll-hint"
                animate={{ opacity: scrolled ? 0 : 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className="scroll-mouse">
                    <div className="scroll-mouse-wheel"></div>
                </div>
                <span className="scroll-hint-label">scroll</span>
            </motion.div>
        </section >
    )
}

export default Hero
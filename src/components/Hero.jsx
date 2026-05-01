import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import '../styles/Hero.css'

const ROLES = [
    'frontend engineer',
    'healthcare tech builder',
    'ms cs @ northeastern \'27',
    'open to summer 2026 roles',
]

const SUB_WORDS = [
    { text: 'Building' },
    { text: 'interfaces', accent: true },
    { text: 'that feel' },
    { text: 'good', accent: true },
    { text: 'to use.' },
    { text: 'Currently at' },
    { text: 'LongevAI', accent: true },
    { text: 'in Boston.' },
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
        <section className="hero" ref={sectionRef}>
            <motion.div className="hero-content" style={{ opacity: heroOpacity, y: heroY }}>
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
                                initial={{ opacity: 0, y: 18 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.7 + i * 0.08,
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
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path d="M2 9h8M6 1v6M3 5l3 3 3-3" />
                        </svg>
                        Download resume
                    </a>
                </motion.div>
            </motion.div>

            <motion.div
                className="scroll-hint"
                animate={{ opacity: scrolled ? 0 : 1 }}
                transition={{ duration: 0.4 }}
            >
                <div className="scroll-hint-line"></div>
                <div className="scroll-hint-chevron"></div>
                <span className="scroll-hint-label">scroll</span>
            </motion.div>
        </section >
    )
}

export default Hero
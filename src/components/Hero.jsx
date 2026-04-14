import { motion } from 'framer-motion'
import '../styles/Hero.css'

function Hero() {
    return (
        <section className="hero">

            <motion.div
                className="hero-eyebrow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <span className="eyebrow-dot"></span>
                Open to summer 2026 internships
            </motion.div>

            <motion.div
                className="hero-greeting"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                Hi, I'm
            </motion.div>

            <motion.h1
                className="hero-name"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                Neeraj Kumar
            </motion.h1>

            <motion.div
                className="hero-terminal"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <span className="terminal-prompt">❯</span>
                <span className="terminal-text">frontend engineer & ML enthusiast</span>
                <span className="cursor"></span>
            </motion.div>

            <motion.p
                className="hero-sub"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                Frontend engineer building interfaces that feel good to use.
                Currently at LongevAI in Boston.
            </motion.p>

            <motion.div
                className="hero-btns"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
            >
                <a href="#projects" className="btn-main">View work ↗</a>
                <a href="/resume.pdf" className="btn-ghost" target="_blank">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M2 9h8M6 1v6M3 5l3 3 3-3" />
                    </svg>
                    Download resume
                </a>
            </motion.div>

        </section>
    )
}

export default Hero
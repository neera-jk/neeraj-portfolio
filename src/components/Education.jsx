import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import '../styles/Education.css'

const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
})

function Education() {
    const sectionRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    })
    const pubY = useTransform(scrollYProgress, [0, 1], [80, -60])

    return (
        <section className="education" id="education" ref={sectionRef}>

            <div className="edu-grid">
                <motion.div className="edu-card" {...fade(0)}>
                    <span className="edu-badge">Current</span>
                    <div className="edu-degree">MS in Computer Science</div>
                    <div className="edu-school">Northeastern University</div>
                    <div className="edu-meta">Boston, MA · Graduating 2026</div>
                    <div className="edu-courses">Algorithms · NLP · HCI · Distributed Systems · Database Management</div>
                </motion.div>

                <motion.div className="edu-card" {...fade(0.1)}>
                    <span className="edu-badge secondary">Undergrad</span>
                    <div className="edu-degree">B.Tech in Telecommunication Engineering</div>
                    <div className="edu-school secondary">BMS Institute of Technology</div>
                    <div className="edu-meta">Bangalore, India</div>
                    <div className="edu-courses">Signal Processing · Network Theory · Python · Digital Communications</div>
                </motion.div>
            </div>

            <motion.div className="pub-card" {...fade(0.2)} style={{ y: pubY }}>
                <span className="edu-badge pub">Publication</span>
                <div className="pub-title">Fuzzy-Based Hierarchical Routing Protocol for Wireless Sensor Networks</div>
                <div className="pub-publisher">Springer — Sustainable Computing</div>
                <p className="pub-desc">
                    Co-authored research on applying fuzzy logic to optimize decision-making and resource allocation in distributed sensor networks.
                </p>
                <div className="pub-tags">
                    {['Fuzzy Logic', 'MATLAB', 'WSN', 'Distributed Systems'].map(t => (
                        <span className="pub-tag" key={t}>{t}</span>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}

export default Education

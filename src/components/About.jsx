import { motion } from 'framer-motion'
import '../styles/About.css'

const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
})

const STATS = [
    { value: '2+', label: 'Years experience' },
    { value: '10+', label: 'Projects shipped' },
    { value: '6k+', label: 'Lines contributed' },
    { value: 'MS CS', label: 'Northeastern \'27' },
]

function About() {
    return (
        <section className="about" id="about">
            <div className="sec-label">about me</div>

            <div className="about-grid">
                <motion.div
                    className="about-card about-bio"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                    style={{ position: 'relative' }}
                >
                    <div style={{
                        position: 'absolute',
                        inset: 0,
                        overflow: 'hidden',
                        pointerEvents: 'none',
                        zIndex: 0,
                    }}>
                        <motion.div
                            style={{
                                fontSize: 'clamp(3rem, 8vw, 6rem)',
                                fontWeight: 800,
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                whiteSpace: 'nowrap',
                            }}
                            initial={{ color: 'rgba(99,102,241,0)' }}
                            whileInView={{ color: ['rgba(99,102,241,0)', 'rgba(99,102,241,0.04)', 'rgba(99,102,241,0)'] }}
                            transition={{ duration: 2 }}
                            viewport={{ once: false }}
                        >
                            Neeraj Kumar
                        </motion.div>
                    </div>
                    <motion.div {...fade(0)}>
                        <p className="about-text">
                            I'm a CS grad student at Northeastern who somehow went from
                            studying <span className="hi">radio waves in Bangalore</span> to
                            building <span className="hi">healthcare dashboards in Boston</span>.
                        </p>
                    </motion.div>

                    <div className="about-divider" />

                    <motion.div {...fade(0.15)}>
                        <p className="about-text">
                            My focus is <span className="hi">frontend development</span>. I
                            build interfaces that feel good to use and keep my code clean
                            enough that the next person doesn't hate me for it. I've done
                            real work at <span className="hi">LongevAI</span> and{' '}
                            <span className="hi">Latitude Health</span>, both in healthtech.
                        </p>
                    </motion.div>

                    <div className="about-divider" />

                    <motion.div {...fade(0.3)}>
                        <p className="about-text">
                            Looking for summer 2026 internships where I can contribute from
                            day one and occasionally <span className="hi">push back</span>{' '}
                            when something could be built better.
                        </p>
                    </motion.div>
                </motion.div>

                <div className="about-sidebar">
                    {STATS.map((s, i) => (
                        <motion.div
                            className="stat-card"
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true }}
                        >
                            <span className="stat-value">{s.value}</span>
                            <span className="stat-label">{s.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default About

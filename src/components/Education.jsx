import { motion } from 'framer-motion'
import '../styles/Education.css'

const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] },
})

function Education() {
    return (
        <section className="education" id="education">
            <div className="edu-list">
                <motion.div className="edu-row" {...fade(0)}>
                    <div className="edu-year">2024<br />now</div>
                    <div className="edu-divider" />
                    <div className="edu-info">
                        <div className="edu-deg">MS in Computer Science</div>
                        <div className="edu-sch ind">Northeastern University</div>
                        <div className="edu-meta">Boston, MA · May 2027</div>
                        <div className="edu-crs">Algorithms · HCI · Object Oriented Design · Database Management</div>
                    </div>
                    <span className="edu-badge current">Current</span>
                </motion.div>

                <motion.div className="edu-row" {...fade(0.1)}>
                    <div className="edu-year">2018<br />2022</div>
                    <div className="edu-divider" />
                    <div className="edu-info">
                        <div className="edu-deg">B.Tech in Telecommunication Engineering</div>
                        <div className="edu-sch cyn">BMS Institute of Technology</div>
                        <div className="edu-meta">Bangalore, India</div>
                        <div className="edu-crs">Signal Processing · Network Theory · Python · Digital Communications</div>
                    </div>
                    <span className="edu-badge undergrad">Undergrad</span>
                </motion.div>
            </div>

            <motion.a
                className="pub-block"
                href="https://link.springer.com/chapter/10.1007/978-3-031-13577-4_13"
                target="_blank"
                rel="noreferrer"
                {...fade(0.2)}
            >
                <div className="pub-left">
                    <span className="edu-badge pub">Publication</span>
                    <div className="pub-title">Fuzzy-Based Hierarchical Routing Protocol for Wireless Sensor Networks</div>
                    <div className="pub-publisher">Springer — Sustainable Computing</div>
                    <div className="pub-doi">DOI: 10.1007/978-3-031-13577-4_13</div>
                </div>
                <div className="pub-right">
                    <p className="pub-desc">Co-authored research on applying fuzzy logic to optimize decision-making and resource allocation in distributed sensor networks.</p>
                    <div className="pub-tags">
                        {['Fuzzy Logic', 'MATLAB', 'WSN', 'Distributed Systems'].map(t => (
                            <span className="pub-tag" key={t}>{t}</span>
                        ))}
                    </div>
                    <div className="pub-link">View on Springer ↗</div>
                </div>
            </motion.a>
        </section>
    )
}

export default Education
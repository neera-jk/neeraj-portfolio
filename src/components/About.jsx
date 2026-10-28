import { motion } from 'framer-motion'
import '../styles/About.css'

const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] },
})

function About() {

    return (
        <section className="about" id="about">

            <div className="about-grid">
                <motion.div
                    className="about-card about-bio"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    viewport={{ once: true }}
                >
                    <motion.div {...fade(0)}>
                        <p className="about-text">
                            CS grad student at Northeastern, graduating May 2027. I studied
                            telecommunications engineering in Bangalore before moving into
                            software.
                        </p>
                    </motion.div>

                    <div className="about-divider" />

                    <motion.div {...fade(0.15)}>
                        <p className="about-text">
                            I've built React interfaces for clinicians and care managers
                            across two healthtech internships. Lately I've been building
                            with LLMs, including a tool that visualizes how transformers work.
                        </p>
                    </motion.div>

                    <div className="about-divider" />

                    <motion.div {...fade(0.3)}>
                        <p className="about-text">
                            I'm looking for software engineering and AI engineering roles
                            where I can build products people actually use.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default About

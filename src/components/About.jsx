import { motion } from 'framer-motion'
import { useRef } from 'react'
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
                            I'm a CS grad student at Northeastern who went from
                            studying <span className="hi">radio waves in Bangalore</span> to
                            building <span className="hi">healthcare dashboards in Boston</span>.
                        </p>
                    </motion.div>

                    <div className="about-divider" />

                    <motion.div {...fade(0.15)}>
                        <p className="about-text">
                            Frontend is where I do my best work. I've spent two internships
                            in healthtech building <span className="hi">React interfaces</span> used
                            by clinicians and care managers, and I take both
                            the <span className="hi">craft</span> and
                            the <span className="hi">codebase</span> seriously.
                        </p>
                    </motion.div>

                    <div className="about-divider" />

                    <motion.div {...fade(0.3)}>
                        <p className="about-text">
                            I'm looking for <span className="hi">frontend or full-stack roles</span> where
                            I can contribute from day one. Healthtech is where I've built my
                            experience, but good <span className="hi">engineering problems</span> exist
                            everywhere.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}

export default About

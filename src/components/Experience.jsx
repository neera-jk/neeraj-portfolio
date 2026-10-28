import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/Experience.css'
const ITEMS = [
    {
        role: 'Graduate Teaching Assistant',
        date: 'Sep 2026 – Present',
        company: 'Northeastern University · Human-Computer Interaction',
        desc: 'Mentor 6 student teams (25 students) through a semester-long user-centered design project, from problem framing and user interview analysis to low- and high-fidelity prototypes. Grade team and individual deliverables against a standardized rubric and give written feedback at each project milestone.',
        current: true,
    },
    {
        role: 'AI Developer Intern',
        date: 'Feb – May 2026',
        company: 'LongevAI Inc.',
        desc: 'Built 10 role-based dashboards in React and Vite for a geriatric care platform, with a reusable dashboard shell that sped up each new dashboard after the first. Built a JavaScript UI auditing tool for a client\'s 5-role veterinary clinic management system and documented 106 bugs, producing the QA report the team adopted as its main remediation reference. Redesigned 8 screens and led a full visual rebrand of the client system with a unified design token system, approved and adopted by the client.',
    },
    {
        role: 'Software Engineering Intern',
        date: 'May – Aug 2024',
        company: 'Latitude Health',
        desc: 'Delivered a Utilization Management reviewer dashboard in 2 weeks from Figma designs. Built 9 reusable React components (tooltip, status, and priority indicators) adopted across multiple pages, and developed 4 user-facing pages, including SSO login and error-handling flows, supporting the company\'s first client onboarding.',
    },
    {
        role: 'Web Developer',
        date: 'Oct 2022 – Nov 2023',
        company: 'Wyoming Global Research',
        desc: 'Integrated a ChatGPT-powered chatbot into educational websites after evaluating 3 frameworks on response latency, usability, and integration complexity.',
    },
    {
        role: 'Software Intern',
        date: 'Apr – Aug 2022',
        company: 'Cognizant',
        desc: 'Ran automated test suites in Selenium, Java, and XPath to validate UI behavior and frontend-backend data integrity across 4 landing pages as part of a 6-engineer Agile team.',
    },
]
function Experience() {
    const [openIdx, setOpenIdx] = useState(0)
    return (
        <section className="experience" id="experience">
            <div className="exp-list">
                {ITEMS.map((item, i) => {
                    const isOpen = openIdx === i
                    const isCurrent = item.current
                    return (
                        <motion.div
                            key={i}
                            className="exp-row"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                            viewport={{ once: true, margin: '-60px' }}
                        >
                            <div className="exp-date-col">
                                <span className="exp-date">{item.date}</span>
                            </div>
                            <div className="exp-card-wrap">
                                <div
                                    className={`exp-card-header ${isOpen ? 'open' : ''} ${isCurrent ? 'current' : ''}`}
                                    onClick={() => setOpenIdx(isOpen ? null : i)}
                                    role="button"
                                    tabIndex={0}
                                    aria-expanded={isOpen}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            setOpenIdx(isOpen ? null : i)
                                        }
                                    }}
                                >
                                    <div className="exp-header-left">
                                        <div className="exp-role">{item.role}</div>
                                        <div className="exp-company">{item.company}</div>
                                    </div>
                                    <div className="exp-header-right">
                                        {isCurrent && (
                                            <span className="exp-current-badge">Current</span>
                                        )}
                                        <motion.span
                                            className="exp-chevron"
                                            animate={{ rotate: isOpen ? 180 : 0 }}
                                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            ▾
                                        </motion.span>
                                    </div>
                                </div>
                                <AnimatePresence initial={false}>
                                    {isOpen && (
                                        <motion.div
                                            className="exp-card-body"
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{
                                                height: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                                                opacity: { duration: 0.35, ease: 'easeInOut' }
                                            }}
                                        >
                                            <div className="exp-body-inner">
                                                <p className="exp-desc">{item.desc}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    )
                })}
            </div>
        </section>
    )
}
export default Experience
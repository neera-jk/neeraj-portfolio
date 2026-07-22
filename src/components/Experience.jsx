import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/Experience.css'
const ITEMS = [
    {
        role: 'AI Developer Intern',
        date: 'Feb – May 2026',
        company: 'LongevAI Inc.',
        desc: 'Built and overhauled 5 role-based dashboards on a full-stack geriatric care platform. Built UI Inspector, a Chrome extension that traverses the React Fiber tree, captures screenshots, and exports structured bug reports, cataloging 106 UI bugs across the codebase.',
        metric: '5 dashboards overhauled · 106 bugs cataloged',
        tags: [
            { label: 'React' },
            { label: 'Next.js' },
            { label: 'Node.js' },
            { label: 'GraphQL', cls: 'cyan' },
        ],
    },
    {
        role: 'Software Engineering Intern',
        date: 'May – Aug 2024',
        company: 'Latitude Health',
        desc: 'Built a UM Reviewer dashboard end-to-end for a clinical utilization management platform. Designed 9 reusable React components and shipped 4 pages including SSO login flow.',
        metric: '9 components · 4 pages shipped · SSO login',
        tags: [
            { label: 'React' },
            { label: 'JavaScript' },
            { label: 'Figma', cls: 'n' },
            { label: 'Python APIs', cls: 'cyan' },
        ],
    },
    {
        role: 'Web Developer',
        date: 'Oct 2022 – Nov 2023',
        company: 'Wyoming Global Research',
        desc: 'Built a ChatGPT-powered chatbot to automate student queries on the company website. Evaluated 3 integration frameworks and shipped the highest-performing solution.',
        tags: [
            { label: 'WordPress' },
            { label: 'JavaScript', cls: 'n' },
            { label: 'ChatGPT API', cls: 'cyan' },
        ],
    },
    {
        role: 'Software Intern',
        date: 'Apr – Aug 2022',
        company: 'Cognizant',
        desc: 'Automated test suites with Selenium and Java across 4 landing pages for 3 client projects, improving regression testing coverage.',
        tags: [
            { label: 'Selenium', cls: 'n' },
            { label: 'Java', cls: 'n' },
            { label: 'SQL', cls: 'n' },
        ],
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
                                                <div className="exp-body-divider" />
                                                <p className="exp-desc">{item.desc}</p>
                                                {item.metric && (
                                                    <p className="exp-metric">{item.metric}</p>
                                                )}
                                                <div className="exp-tags">
                                                    {item.tags.map((t) => (
                                                        <span
                                                            key={t.label}
                                                            className={`exp-tag${t.cls ? ' ' + t.cls : ''}`}
                                                        >
                                                            {t.label}
                                                        </span>
                                                    ))}
                                                </div>
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
import { motion } from 'framer-motion'
import '../styles/Experience.css'

const ITEMS = [
    {
        role: 'AI Developer Intern',
        date: 'Feb 2026 – present',
        company: 'LongevAI Inc.',
        desc: 'Full-stack geriatric health platform. Overhauled 5 role-based dashboards and cataloged 106+ bugs as the team\'s QA reference.',
        tags: [
            { label: 'React' },
            { label: 'Next.js' },
            { label: 'Node.js' },
            { label: 'GraphQL', cls: 'cyan' },
        ],
        active: true,
    },
    {
        role: 'Software Engineering Intern',
        date: 'May – Aug 2024',
        company: 'Latitude Health',
        desc: 'Built a UM Reviewer dashboard end-to-end. Designed 9 reusable components and shipped 4 pages including SSO login.',
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
        desc: 'Built a ChatGPT-powered chatbot to automate student queries. Evaluated 3 frameworks and shipped the top performer.',
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
        desc: 'Automated test suites with Selenium and Java across 4 landing pages for 3 client projects.',
        tags: [
            { label: 'Selenium', cls: 'n' },
            { label: 'Java', cls: 'n' },
            { label: 'SQL', cls: 'n' },
        ],
    },
]

function Experience() {
    return (
        <section className="experience" id="experience">
            <div className="exp-list">
                {ITEMS.map((item, i) => (
                    <div key={i} className="exp-row">
                        <div className="exp-date-col">
                            <span className="exp-date">{item.date}</span>
                        </div>
                        <div className="exp-timeline">
                            <div className="exp-dot" />
                            {i < ITEMS.length - 1 && <div className="exp-line" />}
                        </div>
                        <motion.div
                            className="exp-card"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.1 }}
                            viewport={{ once: true, margin: '-80px' }}
                        >
                            <div className="exp-content" data-date={item.date}>
                                <h3 className="exp-role">{item.role}</h3>
                                <div className="exp-company">{item.company}</div>
                                <p className="exp-desc">{item.desc}</p>
                                <div className="exp-tags">
                                    {item.tags.map((t) => (
                                        <span key={t.label} className={`exp-tag${t.cls ? ' ' + t.cls : ''}`}>
                                            {t.label}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Experience

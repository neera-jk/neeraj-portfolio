import { motion } from 'framer-motion'
import '../styles/Experience.css'

const ITEMS = [
    {
        role: 'AI Developer Intern',
        date: 'Feb 2026 – present',
        company: 'LongevAI Inc.',
        desc: 'Building a full-stack geriatric health platform with React, Next.js and Node.js. Overhauled 5 role-based dashboards and cataloged 106 bugs used as the team\'s primary QA reference.',
        tags: [
            { label: 'React' },
            { label: 'Next.js' },
            { label: 'Node.js' },
            { label: 'GraphQL', cls: 'cyan' },
            { label: 'REST APIs', cls: 'cyan' },
            { label: 'Figma', cls: 'n' },
        ],
        active: true,
    },
    {
        role: 'Software Engineering Intern',
        date: 'May – Aug 2024',
        company: 'Latitude Health',
        desc: 'Built a UM Reviewer dashboard end-to-end from Figma to production. Designed 9 reusable React components and delivered 4 user-facing pages including SSO login ahead of first client onboarding.',
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
        company: 'Wyoming Global Research World Pvt. Ltd.',
        desc: 'Built a ChatGPT-powered chatbot to automate student queries for educational websites. Evaluated 3 chatbot frameworks and recommended the top performer for production.',
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
        desc: 'Developed automated test suites using Selenium and Java to validate UI and data integrity across 4 landing pages for 3 client projects.',
        tags: [
            { label: 'Selenium', cls: 'n' },
            { label: 'Java', cls: 'n' },
            { label: 'HTML/CSS', cls: 'n' },
            { label: 'SQL', cls: 'n' },
        ],
    },
]

function Experience() {
    return (
        <section className="experience" id="experience">
            <div className="sec-label">work experience</div>

            <div className="timeline">
                {ITEMS.map((item, i) => (
                    <div key={i} className="tl-item">
                        <div className={`tl-dot${item.active ? ' active' : ''}`}></div>
                        <motion.div
                            className="tl-card"
                            initial={{ opacity: 0, x: -16 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.12 }}
                            viewport={{ once: true }}
                        >
                            <div className="tl-header">
                                <div className="tl-role">{item.role}</div>
                                <div className="tl-date">{item.date}</div>
                            </div>
                            <div className="tl-company">{item.company}</div>
                            <div className="tl-desc">{item.desc}</div>
                            <div className="tl-tags">
                                {item.tags.map((t) => (
                                    <span key={t.label} className={`tl-tag${t.cls ? ' ' + t.cls : ''}`}>
                                        {t.label}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                ))}
            </div>
        </section>
    )
}

export default Experience

import { useState } from 'react'
import { motion } from 'framer-motion'
import '../styles/Skills.css'

const SKILLS = [
    { name: 'React', cat: 'frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Next.js', cat: 'frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'TypeScript', cat: 'lang', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'JavaScript', cat: 'lang', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'Python', cat: 'lang', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'Node.js', cat: 'backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Java', cat: 'lang', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'GraphQL', cat: 'backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg' },
    { name: 'MongoDB', cat: 'backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'MySQL', cat: 'backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'Git', cat: 'tools', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'Figma', cat: 'tools', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
    { name: 'HTML', cat: 'frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS', cat: 'frontend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'Express.js', cat: 'backend', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
    { name: 'VS Code', cat: 'tools', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
]

const TABS = [
    { key: 'all', label: 'All' },
    { key: 'frontend', label: 'Frontend' },
    { key: 'backend', label: 'Backend' },
    { key: 'lang', label: 'Languages' },
    { key: 'tools', label: 'Tools' },
]

const marqueeSkills = [...SKILLS, ...SKILLS]

function Skills() {
    const [active, setActive] = useState('all')
    const filtered = active === 'all' ? SKILLS : SKILLS.filter(s => s.cat === active)

    return (
        <section className="skills" id="skills">
            <div className="sec-label">skills & technologies</div>

            <div className="skills-tabs">
                {TABS.map(t => (
                    <button
                        key={t.key}
                        className={`skills-tab ${active === t.key ? 'active' : ''}`}
                        onClick={() => setActive(t.key)}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="skills-grid">
                {filtered.map((s, i) => (
                    <motion.div
                        className="skill-card"
                        key={s.name}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true }}
                    >
                        <div className="skill-icon">
                            <img src={s.logo} alt={s.name} />
                        </div>
                        <span className="skill-name">{s.name}</span>
                    </motion.div>
                ))}
            </div>

            <div className="marquee-wrap">
                <div className="marquee-track">
                    {marqueeSkills.map((s, i) => (
                        <span className="marquee-item" key={i}>
                            <img src={s.logo} alt={s.name} />
                            {s.name}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Skills

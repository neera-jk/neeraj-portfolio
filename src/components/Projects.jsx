import { motion } from 'framer-motion'
import { useCallback } from 'react'
import '../styles/Projects.css'

const PROJECTS = [
    {
        title: 'UI Inspector',
        desc: 'Chrome extension for frontend QA. Traverses the React Fiber tree, captures screenshots via html2canvas, and exports structured bug reports. Used to catalog 106 UI bugs during co-op at LongevAI.',
        tags: ['Vanilla JS', 'Chrome Ext', 'Manifest V3', 'html2canvas'],
        link: 'https://github.com/neera-jk/ui-inspector',
        type: 'Chrome Extension',
        metric: '106 bugs cataloged · shipped in 4 weeks',
        gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
    },
    {
        title: 'MassWater',
        desc: 'Massachusetts snow depth tracker built with React and Vite. Pulls live NOAA station data, visualizes snow depth across the state with a custom canvas gauge component and real-time station picker.',
        tags: ['React', 'Vite', 'NOAA API', 'Canvas'],
        link: 'https://github.com/neera-jk/masswater',
        type: 'Full Stack',
        metric: 'Live NOAA data · React + Express + PostgreSQL',
        gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0e7490 50%, #06b6d4 100%)',
    },
]

function Projects() {
    const handleTiltMove = useCallback((e) => {
        const el = e.currentTarget
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        el.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg)`
    }, [])

    const handleTiltLeave = useCallback((e) => {
        e.currentTarget.style.transform = ''
    }, [])

    return (
        <section className="projects" id="projects">

            <div className="projects-list">
                {PROJECTS.map((p, i) => (
                    <motion.a
                        className={`proj-card ${i % 2 !== 0 ? 'proj-card--flipped' : ''}`}
                        key={p.title}
                        href={p.link}
                        target="_blank"
                        rel="noreferrer"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                        viewport={{ once: true }}
                        onMouseMove={handleTiltMove}
                        onMouseLeave={handleTiltLeave}
                    >
                        <div className="proj-preview" style={{ background: p.gradient }}>
                            <div className="proj-browser-frame">
                                <div className="proj-browser-dots">
                                    <span></span><span></span><span></span>
                                </div>
                                <div className="proj-browser-content">
                                    <span className="proj-preview-label">{p.title}</span>
                                </div>
                            </div>
                        </div>

                        <div className="proj-info">
                            <div className="proj-header">
                                <span className="proj-title">{p.title}</span>
                                <svg className="proj-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                                </svg>
                            </div>
                            <span className="proj-type">{p.type}</span>
                            <p className="proj-desc">{p.desc}</p>
                            <p className="proj-metric">{p.metric}</p>
                            <div className="proj-tags">
                                {p.tags.map(t => (
                                    <span className="proj-tag" key={t}>{t}</span>
                                ))}
                            </div>
                        </div>
                    </motion.a>
                ))}
            </div>
        </section>
    )
}

export default Projects

import { motion } from 'framer-motion'
import '../styles/Contact.css'

const LINKS = [
    {
        label: 'Send an email',
        sub: 'kumar.nee@northeastern.edu',
        href: 'mailto:kumar.nee@northeastern.edu',
        arrow: '↗',
        primary: true,
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="1.5">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
            </svg>
        ),
    },
    {
        label: 'LinkedIn',
        sub: '-neerajkumar-',
        href: 'https://linkedin.com/in/-neerajkumar-',
        arrow: '↗',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#a5b4fc">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
            </svg>
        ),
    },
    {
        label: 'GitHub',
        sub: 'neera-jk',
        href: 'https://github.com/neera-jk',
        arrow: '↗',
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="#a5b4fc">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
            </svg>
        ),
    },
    {
        label: 'Resume',
        sub: 'Download PDF',
        href: '/resume.pdf',
        arrow: '↓',
        resume: true,
        icon: (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a5b4fc" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14,2 14,8 20,8" />
            </svg>
        ),
    },
]

function Contact() {
    return (
        <section className="contact" id="contact">
            <motion.div
                className="contact-card"
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                style={{ willChange: 'auto' }}
            >
                <div className="contact-left">
                    <h2 className="contact-title">
                        Let's work<br />
                        <span>together.</span>
                    </h2>
                    <p className="contact-body">
                        You've seen the work. I'm a <strong>frontend engineer</strong> with
                        two years of healthtech experience, currently finishing my{' '}
                        <strong>MS at Northeastern</strong>.<br /><br />
                        If you have a problem worth solving, I'd like to hear about it.
                    </p>
                    <div className="contact-availability">
                        Open to internships · Boston or remote
                    </div>
                </div>

                <div className="contact-right">
                    {LINKS.map(l => (
                        <a
                            key={l.label}
                            href={l.href}
                            target="_blank"
                            rel="noreferrer"
                            className={`contact-cta${l.primary ? ' primary' : ' secondary'}${l.resume ? ' resume' : ''}`}
                        >
                            <div className={`cta-icon${l.primary ? ' ind' : ' muted'}`}>
                                {l.icon}
                            </div>
                            <div className="cta-label">
                                <div>{l.label}</div>
                                <div className="cta-sub">{l.sub}</div>
                            </div>
                            <span className="cta-arrow">{l.arrow}</span>
                        </a>
                    ))}
                </div>
            </motion.div>
        </section>
    )
}

export default Contact
import '../styles/Nav.css'

function Nav() {
    return (
        <nav className="nav">
            <div className="nav-logo">
                nk<em>.</em>
            </div>
            <div className="nav-links">
                <a href="#about">about</a>
                <a href="#work">work</a>
                <a href="#projects">projects</a>
                <a href="#contact">contact</a>
                <a href="/resume.pdf" className="nav-resume" target="_blank">
                    Resume ↗
                </a>
            </div>
        </nav>
    )
}

export default Nav
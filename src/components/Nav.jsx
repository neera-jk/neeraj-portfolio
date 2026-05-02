import '../styles/Nav.css'

function Nav() {
    return (
        <nav className="nav">
            <div className="nav-logo">
                nk<em>.</em>
            </div>
            <a href="/resume.pdf" className="nav-resume" target="_blank">
                Resume ↗
            </a>
        </nav>
    )
}

export default Nav
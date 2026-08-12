import '../styles/Atmosphere.css'

// Full-viewport-width background layer for the hero. It lives outside
// .page-wrapper (which is capped at 820px) so the dusk mesh and bloom can
// span the whole screen. Purely decorative, so it is hidden from assistive tech.
function Atmosphere() {
    return (
        <div className="atmosphere" aria-hidden="true">
            <div className="atmosphere-mesh" />
            <div className="atmosphere-inner">
                <div className="atmosphere-bloom" />
            </div>
            <div className="atmosphere-veil" />
            <div className="atmosphere-grain" />
        </div>
    )
}

export default Atmosphere

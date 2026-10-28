import { useEffect, useRef, useState } from 'react'
// aliased to an uppercase name so the flat eslint config (which has no
// jsx-uses-vars rule) does not flag it as an unused import
import { motion as Motion } from 'framer-motion'
import '../styles/Hero.css'

/* ==========================================================================
   Signal graphic - the hero centrepiece.

   One data series drawn in two states: raw and noisy on the left, cleaned
   into a smooth trend line and a bar chart on the right, so it reads as messy
   data becoming something readable. The boundary between the two follows the
   cursor.

   All geometry is computed once at module load and rendered declaratively in
   JSX. The animation loop only mutates a handful of attributes through refs,
   it never rebuilds path strings per frame.
   ========================================================================== */

/* ---- Fixed geometry (SVG user units) ---- */
const VIEW_W = 1200
const VIEW_H = 180
const AXIS = 171         // baseline the bars sit on
const BASE = 96          // vertical centre of the trend
const RAW_STEP = 5       // horizontal spacing of the raw data points
const NOISE = 16         // spread of the raw jitter
const SPIKE_CHANCE = 0.05 // share of raw points that become outliers
const SAMPLE = 26        // width of one bar slot
const GRID_LINES = [36, 81, 126]

/* ---- Tuned animation constants ---- */
const REVEAL_MS = 1660   // left-to-right draw on load
const CLEAN_MS = 2100    // raw data resolving into the clean side
const FOLLOW = 0.28      // how hard the split chases the cursor
const REST = 0.5         // where the split parks when idle
const FADE = 64          // width of the crossfade at the split
const BAR_COUNT = 7
const BAR_GAP = 5
const BAR_EASE = 0.16    // how far a bar moves toward its target per frame

/* ---- The signal itself: a few slow waves plus a gentle upward drift ---- */
function trendAt(x) {
    return BASE
        - 30 * Math.sin((x / 520) * Math.PI * 2 + 0.4)
        - 14 * Math.sin((x / 230) * Math.PI * 2 + 2.1)
        - 5 * Math.sin((x / 90) * Math.PI * 2 + 0.7)
        - (22 * x) / VIEW_W
}

/* ---- Small maths helpers ---- */
function clamp(value, low, high) {
    return Math.min(high, Math.max(low, value))
}

function easeOutCubic(p) {
    return 1 - Math.pow(1 - p, 3)
}

function easeInOutCubic(p) {
    if (p < 0.5) {
        return 4 * p * p * p
    } else {
        return 1 - Math.pow(-2 * p + 2, 3) / 2
    }
}

// Seeded random so the noise looks identical on every load.
function mulberry32(seed) {
    return function next() {
        seed = (seed + 0x6d2b79f5) | 0
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
}

/* ---- Precompute the raw polyline (trend plus jitter and a few spikes) ---- */
function buildRawPoints() {
    const random = mulberry32(7)
    const points = []
    for (let x = 0; x <= VIEW_W; x += RAW_STEP) {
        // Summing three uniforms gives a rough bell curve around the trend.
        let noise = (random() + random() + random() - 1.5) * NOISE
        if (random() < SPIKE_CHANCE) {
            const direction = random() < 0.5 ? -1 : 1
            noise += direction * (18 + random() * 16)
        }
        const y = clamp(trendAt(x) + noise, 8, AXIS - 8)
        points.push(`${x},${y.toFixed(1)}`)
    }
    return points.join(' ')
}

/* ---- Precompute the clean polyline (trend sampled every 2px) ---- */
function buildCleanPoints() {
    const points = []
    for (let x = 0; x <= VIEW_W; x += 2) {
        points.push(`${x},${trendAt(x).toFixed(2)}`)
    }
    return points.join(' ')
}

/* ---- Precompute the bars ----
   One bar per slot along the right edge, each topped by the trend at the
   slot's centre so the clean line passes through every bar top. */
function buildBars() {
    const lastIndex = Math.floor(VIEW_W / SAMPLE) - 1
    const bars = []
    for (let index = lastIndex - BAR_COUNT + 1; index <= lastIndex; index++) {
        const xSample = index * SAMPLE
        const top = trendAt(xSample + SAMPLE / 2)
        bars.push({
            xSample,
            x: xSample + BAR_GAP / 2,
            y: top,
            width: SAMPLE - BAR_GAP,
            height: AXIS - top,
        })
    }
    return bars
}

const RAW_POINTS = buildRawPoints()
const CLEAN_POINTS = buildCleanPoints()
const BARS = buildBars()

const REST_SPLIT_X = REST * VIEW_W

function SignalGraphic() {
    const svgRef = useRef(null)
    const clipRectRef = useRef(null)
    const gradRawRef = useRef(null)
    const gradCleanRef = useRef(null)
    const playLineRef = useRef(null)
    const playDotRef = useRef(null)
    const barRefs = useRef([])
    const hintRef = useRef(null)

    useEffect(() => {
        const svg = svgRef.current
        const clipRect = clipRectRef.current
        const gradRaw = gradRawRef.current
        const gradClean = gradCleanRef.current
        const playLine = playLineRef.current
        const playDot = playDotRef.current

        // Live animation state kept out of React so frames never re-render.
        const state = {
            phase: 'reveal',       // 'reveal' -> 'clean' -> 'live'
            phaseStart: null,
            split: 1,              // boundary position as a fraction 0..1
            target: REST,
            presence: BARS.map(() => 0),
            frame: null,
        }

        // Move the crossfade gradients and the playhead to the current split.
        function applySplit() {
            const splitX = state.split * VIEW_W
            gradRaw.setAttribute('x1', String(splitX - FADE))
            gradRaw.setAttribute('x2', String(splitX + FADE))
            gradClean.setAttribute('x1', String(splitX - FADE))
            gradClean.setAttribute('x2', String(splitX + FADE))
            playLine.setAttribute('x1', String(splitX))
            playLine.setAttribute('x2', String(splitX))
            playDot.setAttribute('cx', String(splitX))
            playDot.setAttribute('cy', String(trendAt(splitX)))
        }

        // Grow a bar up from the axis in proportion to its presence.
        function paintBar(index) {
            const node = barRefs.current[index]
            if (!node) return
            const p = easeOutCubic(clamp(state.presence[index], 0, 1))
            node.style.opacity = String(p)
            node.style.transform = `scaleY(${0.1 + 0.9 * p})`
        }

        // Ease each bar's presence toward its wanted value: shown once the
        // split has passed to its left, hidden otherwise.
        function updateBars() {
            const splitX = state.split * VIEW_W
            for (let b = 0; b < BARS.length; b++) {
                const wanted = BARS[b].xSample >= splitX ? 1 : 0
                state.presence[b] += (wanted - state.presence[b]) * BAR_EASE
                paintBar(b)
            }
        }

        // True once every bar has essentially reached its wanted presence.
        function barsSettled() {
            const splitX = state.split * VIEW_W
            for (let b = 0; b < BARS.length; b++) {
                const wanted = BARS[b].xSample >= splitX ? 1 : 0
                if (Math.abs(state.presence[b] - wanted) > 0.004) {
                    return false
                }
            }
            return true
        }

        function frame(now) {
            if (state.phaseStart === null) {
                state.phaseStart = now
            }
            const elapsed = now - state.phaseStart

            if (state.phase === 'reveal') {
                // Widen the clip rect so the raw data draws left to right.
                const p = clamp(elapsed / REVEAL_MS, 0, 1)
                clipRect.setAttribute('width', String(easeOutCubic(p) * VIEW_W))
                if (p >= 1) {
                    state.phase = 'clean'
                    state.phaseStart = now
                }
            } else if (state.phase === 'clean') {
                clipRect.setAttribute('width', String(VIEW_W))
                // Drive the split from the far right in to its resting place,
                // so the clean line and bars resolve from the right.
                const p = clamp(elapsed / CLEAN_MS, 0, 1)
                state.split = 1 + (REST - 1) * easeInOutCubic(p)
                if (p >= 1) {
                    state.phase = 'live'
                    state.phaseStart = now
                }
            } else {
                clipRect.setAttribute('width', String(VIEW_W))
                // Ease the split toward wherever the cursor last pointed.
                state.split += (state.target - state.split) * FOLLOW
            }

            applySplit()
            updateBars()

            // Stop the loop once nothing is moving; a pointer move restarts it.
            const splitStill = Math.abs(state.split - state.target) < 0.0006
            if (state.phase === 'live' && splitStill && barsSettled()) {
                state.frame = null
                return
            }
            state.frame = requestAnimationFrame(frame)
        }

        function startLoop() {
            if (state.frame === null) {
                state.frame = requestAnimationFrame(frame)
            }
        }

        // Render a single final frame with no animation.
        function renderFinalStatic() {
            state.phase = 'live'
            state.split = REST
            state.target = REST
            clipRect.setAttribute('width', String(VIEW_W))
            applySplit()
            const splitX = state.split * VIEW_W
            for (let b = 0; b < BARS.length; b++) {
                state.presence[b] = BARS[b].xSample >= splitX ? 1 : 0
                paintBar(b)
            }
        }

        function handlePointerMove(event) {
            if (event.pointerType === 'touch') return
            // The hint has done its job the moment the user explores the wave.
            if (hintRef.current) {
                hintRef.current.style.opacity = '0'
            }
            const rect = svg.getBoundingClientRect()
            const fraction = (event.clientX - rect.left) / rect.width
            state.target = clamp(fraction, 0.05, 0.95)
            startLoop()
        }

        function handlePointerLeave() {
            state.target = REST
            startLoop()
        }

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        if (reducedMotion) {
            // No loop, no pointer tracking: show the finished state and hide
            // the hint, since there is no interaction to invite.
            renderFinalStatic()
            if (hintRef.current) {
                hintRef.current.style.opacity = '0'
            }
        } else {
            applySplit()
            svg.addEventListener('pointermove', handlePointerMove)
            svg.addEventListener('pointerleave', handlePointerLeave)
            state.frame = requestAnimationFrame(frame)
        }

        return () => {
            if (!reducedMotion) {
                svg.removeEventListener('pointermove', handlePointerMove)
                svg.removeEventListener('pointerleave', handlePointerLeave)
            }
            if (state.frame !== null) {
                cancelAnimationFrame(state.frame)
                state.frame = null
            }
        }
    }, [])

    return (
        <div className="signal">
            <svg
                ref={svgRef}
                className="signal-svg"
                viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
                preserveAspectRatio="none"
                role="img"
                aria-label="A noisy data line on the left that becomes a smooth trend line and a bar chart on the right."
            >
                <defs>
                    {/* white -> black: keeps the raw side visible left of the split */}
                    <linearGradient
                        ref={gradRawRef}
                        id="signal-grad-raw"
                        gradientUnits="userSpaceOnUse"
                        x1={REST_SPLIT_X - FADE}
                        y1="0"
                        x2={REST_SPLIT_X + FADE}
                        y2="0"
                    >
                        <stop offset="0" stopColor="#fff" />
                        <stop offset="1" stopColor="#000" />
                    </linearGradient>
                    {/* black -> white: complementary, keeps the clean side visible right of the split */}
                    <linearGradient
                        ref={gradCleanRef}
                        id="signal-grad-clean"
                        gradientUnits="userSpaceOnUse"
                        x1={REST_SPLIT_X - FADE}
                        y1="0"
                        x2={REST_SPLIT_X + FADE}
                        y2="0"
                    >
                        <stop offset="0" stopColor="#000" />
                        <stop offset="1" stopColor="#fff" />
                    </linearGradient>
                    {/* Bar fill, bottom to top; stop colours come from the theme tokens */}
                    <linearGradient id="signal-grad-bar" x1="0" y1="1" x2="0" y2="0">
                        <stop offset="0" className="bar-stop-low" />
                        <stop offset="1" className="bar-stop-high" />
                    </linearGradient>
                    <mask id="signal-mask-raw" maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW_W} height={VIEW_H}>
                        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#signal-grad-raw)" />
                    </mask>
                    <mask id="signal-mask-clean" maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW_W} height={VIEW_H}>
                        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#signal-grad-clean)" />
                    </mask>
                    <clipPath id="signal-reveal" clipPathUnits="userSpaceOnUse">
                        <rect ref={clipRectRef} x="0" y="0" width="0" height={VIEW_H} />
                    </clipPath>
                </defs>

                <g clipPath="url(#signal-reveal)">
                    {/* Clean side, behind everything: faint dashboard gridlines and axis */}
                    <g mask="url(#signal-mask-clean)">
                        {GRID_LINES.map((y) => (
                            <line key={`grid-${y}`} className="grid-line" x1="0" y1={y} x2={VIEW_W} y2={y} />
                        ))}
                        <line className="grid-axis" x1="0" y1={AXIS} x2={VIEW_W} y2={AXIS} />
                    </g>

                    {/* Interface end: the bar chart */}
                    {BARS.map((bar, index) => (
                        <rect
                            key={`bar-${bar.xSample}`}
                            ref={(el) => { barRefs.current[index] = el }}
                            className="signal-bar"
                            x={bar.x}
                            y={bar.y}
                            width={bar.width}
                            height={bar.height}
                            rx="2"
                            fill="url(#signal-grad-bar)"
                            style={{ opacity: 0 }}
                        />
                    ))}

                    {/* Clean side, over the bars: the smoothed trend line */}
                    <g mask="url(#signal-mask-clean)">
                        <polyline className="wave-clean" points={CLEAN_POINTS} />
                    </g>

                    {/* Raw side: the noisy data */}
                    <g mask="url(#signal-mask-raw)">
                        <polyline className="wave-raw" points={RAW_POINTS} />
                    </g>

                    {/* Playhead sitting on the split */}
                    <line
                        ref={playLineRef}
                        className="play-line"
                        x1={REST_SPLIT_X}
                        y1="0"
                        x2={REST_SPLIT_X}
                        y2={VIEW_H}
                    />
                    <circle ref={playDotRef} className="play-dot" cx={REST_SPLIT_X} cy={trendAt(REST_SPLIT_X)} r="2.6" />
                </g>
            </svg>

            <div className="signal-labels">
                <div className="signal-row signal-row-top">
                    <span className="signal-raw">Raw data</span>
                    <span className="signal-interface">Interface</span>
                </div>
                <div className="signal-row signal-row-bottom">
                    <span className="signal-caption">
                        I turn messy data into <em>interfaces</em> people can actually use.
                    </span>
                    <span className="signal-hint" ref={hintRef}>hover the wave</span>
                </div>
            </div>
        </div>
    )
}

const EASE = [0.22, 1, 0.36, 1]

function Hero() {
    // The scroll cue fades out for good once the visitor starts scrolling.
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        function onScroll() {
            if (window.scrollY > 40) {
                setScrolled(true)
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <section className="hero" id="hero">
            {/* Corner registration marks - purely decorative */}
            <span className="reg-mark reg-mark-tl" aria-hidden="true" />
            <span className="reg-mark reg-mark-tr" aria-hidden="true" />
            <span className="reg-mark reg-mark-bl" aria-hidden="true" />
            <span className="reg-mark reg-mark-br" aria-hidden="true" />

            <Motion.div
                className="hero-status"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.05, ease: EASE }}
            >
                <span className="status-dot" />
                Open to full-time SWE roles from May 2027
            </Motion.div>

            <Motion.div
                className="hero-block"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.15, ease: EASE }}
            >
                <h1 className="hero-name">Neeraj Kumar</h1>
                <p className="hero-role">Frontend engineer · Healthtech</p>
                <p className="hero-pitch">
                    Building <b>interfaces</b> that feel <b>good</b> to use.
                </p>
                <a href="#projects" className="btn-main">
                    <span>View work</span>
                    <span className="btn-arrow">↓</span>
                </a>
            </Motion.div>

            <Motion.div
                className="hero-graphic"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.28, ease: EASE }}
            >
                <SignalGraphic />
            </Motion.div>

            <div
                className={`hero-scroll ${scrolled ? 'hero-scroll--hidden' : ''}`}
                aria-hidden="true"
            >
                <span className="hero-scroll-label">Scroll</span>
                <span className="hero-scroll-track" />
                <span className="hero-scroll-chevron">
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.4">
                        <path d="M1 1.5L6 6.5L11 1.5" />
                    </svg>
                </span>
            </div>
        </section>
    )
}

export default Hero

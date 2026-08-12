import { useEffect, useRef, useState } from 'react'
// aliased to an uppercase name so the flat eslint config (which has no
// jsx-uses-vars rule) does not flag it as an unused import
import { motion as Motion } from 'framer-motion'
import '../styles/Hero.css'

/* ==========================================================================
   Signal graphic — the hero centrepiece.

   One sine function drawn in two states: continuous on the left, sampled and
   held (quantised) on the right, so it reads as analog-to-digital conversion.
   The boundary between the two follows the cursor.

   All geometry is computed once at module load and rendered declaratively in
   JSX. The animation loop only mutates a handful of attributes through refs —
   it never rebuilds path strings per frame.
   ========================================================================== */

/* ---- Fixed geometry (SVG user units) ---- */
const VIEW_W = 1200
const VIEW_H = 180
const AXIS = 171     // baseline the LED bars sit on
const BASE = 84      // vertical centre of the wave
const AMP = 52       // sine amplitude
const WAVELEN = 300  // sine wavelength
const SAMPLE = 26    // one sample-and-hold interval
const LEVELS = 16    // amplitude quantisation step

/* ---- Tuned animation constants ---- */
const REVEAL_MS = 1660   // left-to-right draw on load
const QUANT_MS = 2100    // sine crystallising into steps
const FOLLOW = 0.28      // how hard the split chases the cursor
const REST = 0.5         // where the split parks when idle
const CASCADE = 1.7      // how fast segments light bottom to top
const FADE = 64          // width of the crossfade at the split
const BAR_COUNT = 7
const INSET_SAMPLES = 0  // whole samples in from the right edge
const BAR_GAP = 5
const SEG_PITCH = 15     // target segment spacing
const SEG_FILL = 0.71    // segment height as a fraction of pitch
const RAMP_CURVE = 0.4   // where along the bar the colour brightens
const OPACITY_FLOOR = 0.53 // opacity of the dimmest segment

/* ---- The wave itself ---- */
function sineAt(x) {
    return BASE - AMP * Math.sin((x / WAVELEN) * Math.PI * 2)
}

function quantAt(x) {
    return BASE - Math.round((BASE - sineAt(x)) / LEVELS) * LEVELS
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

// Linearly interpolate between two 6-digit hex colours. The LED tokens are
// always 6-digit hex, so this can parse them directly.
function mixHex(from, to, t) {
    const fromR = parseInt(from.slice(1, 3), 16)
    const fromG = parseInt(from.slice(3, 5), 16)
    const fromB = parseInt(from.slice(5, 7), 16)
    const toR = parseInt(to.slice(1, 3), 16)
    const toG = parseInt(to.slice(3, 5), 16)
    const toB = parseInt(to.slice(5, 7), 16)
    const r = Math.round(fromR + (toR - fromR) * t)
    const g = Math.round(fromG + (toG - fromG) * t)
    const b = Math.round(fromB + (toB - fromB) * t)
    return `rgb(${r}, ${g}, ${b})`
}

/* ---- Precompute the analog polyline (sine sampled every 2px) ---- */
function buildAnalogPoints() {
    const points = []
    for (let x = 0; x <= VIEW_W; x += 2) {
        points.push(`${x},${sineAt(x).toFixed(2)}`)
    }
    return points.join(' ')
}

/* ---- Precompute the staircase polyline (sample and hold) ----
   For each sample x the quantised value is held flat across [x, x + SAMPLE];
   the jump to the next value happens as a vertical segment at the next x. */
function buildStairPoints() {
    const points = []
    const lastSample = Math.floor(VIEW_W / SAMPLE)
    for (let n = 0; n <= lastSample; n++) {
        const x = n * SAMPLE
        const y = quantAt(x).toFixed(2)
        points.push(`${x},${y}`)
        points.push(`${x + SAMPLE},${y}`)
    }
    return points.join(' ')
}

/* ---- Precompute every sample point (for the dots and ticks) ---- */
function buildSamples() {
    const samples = []
    for (let n = 0; n * SAMPLE <= VIEW_W; n++) {
        const x = n * SAMPLE
        samples.push({ x, y: quantAt(x) })
    }
    return samples
}

/* ---- Precompute the LED bars ----
   Bars must sit on the sample grid so each bar's top matches the single
   staircase step above it. The per-bar segment pitch is derived from the bar's
   own span so the stack aligns at both the axis and the staircase line. */
function buildBars() {
    const lastFullSample = Math.floor(VIEW_W / SAMPLE) - 1
    const rightIndex = lastFullSample - INSET_SAMPLES
    const firstIndex = rightIndex - BAR_COUNT + 1

    const bars = []
    for (let index = firstIndex; index <= rightIndex; index++) {
        const xSample = index * SAMPLE
        const y = quantAt(xSample)
        const span = AXIS - y
        const count = Math.max(2, Math.round(span / SEG_PITCH))
        const pitch = span / count
        const segHeight = pitch * SEG_FILL
        const width = SAMPLE - BAR_GAP
        const xRect = xSample + BAR_GAP / 2

        const segments = []
        for (let s = 0; s < count; s++) {
            const segY = AXIS - (s + 1) * pitch
            // The bottom segment is a full pitch tall so the bar is seated on
            // the axis; every other segment uses the shorter fill height.
            const height = s === 0 ? pitch : segHeight
            const ramp = count === 1 ? 1 : s / (count - 1)
            const baseOpacity = OPACITY_FLOOR + (1 - OPACITY_FLOOR) * Math.pow(ramp, 0.9)
            segments.push({ x: xRect, y: segY, width, height, ramp, baseOpacity, index: s })
        }
        bars.push({ xSample, count, segments })
    }
    return bars
}

const ANALOG_POINTS = buildAnalogPoints()
const STAIR_POINTS = buildStairPoints()
const SAMPLES = buildSamples()
const BARS = buildBars()

// Flattened view of every segment, in the same order they are rendered, so the
// animation loop can walk it in lockstep with the ref array.
const FLAT_SEGMENTS = []
BARS.forEach((bar, barIndex) => {
    bar.segments.forEach((segment) => {
        FLAT_SEGMENTS.push({
            barIndex,
            indexInBar: segment.index,
            count: bar.count,
            ramp: segment.ramp,
            baseOpacity: segment.baseOpacity,
        })
    })
})

// Starting index of each bar's first segment within FLAT_SEGMENTS, so the
// render can address ref slots without a running counter.
const BAR_FLAT_OFFSETS = []
let flatRunning = 0
BARS.forEach((bar) => {
    BAR_FLAT_OFFSETS.push(flatRunning)
    flatRunning += bar.count
})

const REST_SPLIT_X = REST * VIEW_W

function SignalGraphic() {
    const svgRef = useRef(null)
    const clipRectRef = useRef(null)
    const gradAnalogRef = useRef(null)
    const gradDigitalRef = useRef(null)
    const playLineRef = useRef(null)
    const playDotRef = useRef(null)
    const segRefs = useRef([])
    const hintRef = useRef(null)

    useEffect(() => {
        const svg = svgRef.current
        const clipRect = clipRectRef.current
        const gradAnalog = gradAnalogRef.current
        const gradDigital = gradDigitalRef.current
        const playLine = playLineRef.current
        const playDot = playDotRef.current

        // Live animation state kept out of React so frames never re-render.
        const state = {
            phase: 'reveal',       // 'reveal' -> 'quantise' -> 'live'
            phaseStart: null,
            split: 1,              // boundary position as a fraction 0..1
            target: REST,
            presence: BARS.map(() => 0),
            frame: null,
        }

        // Paint each segment's colour from the current theme's LED tokens.
        function paintColors() {
            const styles = getComputedStyle(document.documentElement)
            const low = styles.getPropertyValue('--led-low').trim()
            const high = styles.getPropertyValue('--led-high').trim()
            for (let i = 0; i < FLAT_SEGMENTS.length; i++) {
                const node = segRefs.current[i]
                if (!node) continue
                const segment = FLAT_SEGMENTS[i]
                node.style.fill = mixHex(low, high, Math.pow(segment.ramp, RAMP_CURVE))
            }
        }

        // Move the crossfade gradients and the playhead to the current split.
        function applySplit() {
            const splitX = state.split * VIEW_W
            gradAnalog.setAttribute('x1', String(splitX - FADE))
            gradAnalog.setAttribute('x2', String(splitX + FADE))
            gradDigital.setAttribute('x1', String(splitX - FADE))
            gradDigital.setAttribute('x2', String(splitX + FADE))
            playLine.setAttribute('x1', String(splitX))
            playLine.setAttribute('x2', String(splitX))
            playDot.setAttribute('cx', String(splitX))
            playDot.setAttribute('cy', String(sineAt(splitX)))
        }

        // Ease each bar's presence toward its wanted value, then light the
        // segments bottom to top from that presence.
        function updateBars() {
            const splitX = state.split * VIEW_W
            for (let b = 0; b < BARS.length; b++) {
                const wanted = BARS[b].xSample >= splitX ? 1 : 0
                state.presence[b] += (wanted - state.presence[b]) * 0.16
            }
            for (let i = 0; i < FLAT_SEGMENTS.length; i++) {
                const node = segRefs.current[i]
                if (!node) continue
                const segment = FLAT_SEGMENTS[i]
                const presence = state.presence[segment.barIndex]
                const local = clamp(presence * (segment.count + CASCADE) - segment.indexInBar, 0, 1)
                node.style.opacity = String(segment.baseOpacity * local)
                node.style.transform = `scaleY(${0.25 + 0.75 * local})`
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
                // Widen the clip rect so the wave draws left to right.
                const p = clamp(elapsed / REVEAL_MS, 0, 1)
                clipRect.setAttribute('width', String(easeOutCubic(p) * VIEW_W))
                if (p >= 1) {
                    state.phase = 'quantise'
                    state.phaseStart = now
                }
            } else if (state.phase === 'quantise') {
                clipRect.setAttribute('width', String(VIEW_W))
                // Drive the split from the far right in to its resting place,
                // so the staircase materialises from the right.
                const p = clamp(elapsed / QUANT_MS, 0, 1)
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
            }
            for (let i = 0; i < FLAT_SEGMENTS.length; i++) {
                const node = segRefs.current[i]
                if (!node) continue
                const segment = FLAT_SEGMENTS[i]
                const presence = state.presence[segment.barIndex]
                const local = clamp(presence * (segment.count + CASCADE) - segment.indexInBar, 0, 1)
                node.style.opacity = String(segment.baseOpacity * local)
                node.style.transform = `scaleY(${0.25 + 0.75 * local})`
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

        // Repaint bar colours when the theme toggle flips data-theme.
        const themeObserver = new MutationObserver(paintColors)

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

        paintColors()
        themeObserver.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        })

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
            themeObserver.disconnect()
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
                aria-label="A sine wave being converted from a continuous analog signal on the left into sampled digital steps on the right."
            >
                <defs>
                    {/* white -> black: keeps the analog side visible left of the split */}
                    <linearGradient
                        ref={gradAnalogRef}
                        id="signal-grad-analog"
                        gradientUnits="userSpaceOnUse"
                        x1={REST_SPLIT_X - FADE}
                        y1="0"
                        x2={REST_SPLIT_X + FADE}
                        y2="0"
                    >
                        <stop offset="0" stopColor="#fff" />
                        <stop offset="1" stopColor="#000" />
                    </linearGradient>
                    {/* black -> white: complementary, keeps the digital side visible right of the split */}
                    <linearGradient
                        ref={gradDigitalRef}
                        id="signal-grad-digital"
                        gradientUnits="userSpaceOnUse"
                        x1={REST_SPLIT_X - FADE}
                        y1="0"
                        x2={REST_SPLIT_X + FADE}
                        y2="0"
                    >
                        <stop offset="0" stopColor="#000" />
                        <stop offset="1" stopColor="#fff" />
                    </linearGradient>
                    <mask id="signal-mask-analog" maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW_W} height={VIEW_H}>
                        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#signal-grad-analog)" />
                    </mask>
                    <mask id="signal-mask-digital" maskUnits="userSpaceOnUse" x="0" y="0" width={VIEW_W} height={VIEW_H}>
                        <rect x="0" y="0" width={VIEW_W} height={VIEW_H} fill="url(#signal-grad-digital)" />
                    </mask>
                    <clipPath id="signal-reveal" clipPathUnits="userSpaceOnUse">
                        <rect ref={clipRectRef} x="0" y="0" width="0" height={VIEW_H} />
                    </clipPath>
                </defs>

                <g clipPath="url(#signal-reveal)">
                    {/* Digital side, behind the bars: only the faint sample ticks,
                        so the LED stacks stay uncluttered */}
                    <g mask="url(#signal-mask-digital)">
                        {SAMPLES.map((sample) => (
                            <line
                                key={`tick-${sample.x}`}
                                className="wave-tick"
                                x1={sample.x}
                                y1={sample.y}
                                x2={sample.x}
                                y2={AXIS}
                            />
                        ))}
                    </g>

                    {/* Interface end: stacked LED bars */}
                    {BARS.map((bar, barIndex) => (
                        <g key={`bar-${barIndex}`} className="led-bar">
                            {bar.segments.map((segment) => {
                                const refIndex = BAR_FLAT_OFFSETS[barIndex] + segment.index
                                return (
                                    <rect
                                        key={`seg-${barIndex}-${segment.index}`}
                                        ref={(el) => { segRefs.current[refIndex] = el }}
                                        className="led-seg"
                                        x={segment.x}
                                        y={segment.y}
                                        width={segment.width}
                                        height={segment.height}
                                        style={{ opacity: 0 }}
                                    />
                                )
                            })}
                        </g>
                    ))}

                    {/* Digital side, over the bars: the staircase line and sample
                        dots, so the line cleanly traces every bar top */}
                    <g mask="url(#signal-mask-digital)">
                        <polyline className="wave-stair" points={STAIR_POINTS} />
                        {SAMPLES.map((sample) => (
                            <circle key={`dot-${sample.x}`} className="wave-dot" cx={sample.x} cy={sample.y} r="2" />
                        ))}
                    </g>

                    {/* Analog side: the continuous sine */}
                    <g mask="url(#signal-mask-analog)">
                        <polyline className="wave-analog" points={ANALOG_POINTS} />
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
                    <circle ref={playDotRef} className="play-dot" cx={REST_SPLIT_X} cy={sineAt(REST_SPLIT_X)} r="2.6" />
                </g>
            </svg>

            <div className="signal-labels">
                <div className="signal-row signal-row-top">
                    <span className="signal-analog">Analog</span>
                    <span className="signal-interface">Interface</span>
                </div>
                <div className="signal-row signal-row-bottom">
                    <span className="signal-caption">
                        One wave, <em>two disciplines</em>.
                    </span>
                    <span className="signal-hint" ref={hintRef}>move across the wave</span>
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
            {/* Corner registration marks — purely decorative */}
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
                Open to fall 2026 co-ops and internships
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

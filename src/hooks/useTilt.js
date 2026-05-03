import { useRef, useCallback } from 'react'

export function useTilt(strength = 8) {
    const ref = useRef(null)

    const onMouseMove = useCallback((e) => {
        const el = ref.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const x = (e.clientX - rect.left) / rect.width - 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5
        el.style.transform = `perspective(600px) rotateY(${x * strength}deg) rotateX(${-y * strength}deg) scale(1.01)`
    }, [strength])

    const onMouseLeave = useCallback(() => {
        const el = ref.current
        if (!el) return
        el.style.transform = ''
    }, [])

    return { ref, onMouseMove, onMouseLeave }
}

import { useRef, useEffect, useCallback } from 'react'
import { LUMA_SIZE } from './constants'
import { findLumaAt } from './collision'
import { startLevel, stepGame } from './engine'
import type { EngineState } from './engine'
import { drawBackground, drawRosalina, drawLuma, createStars } from './renderer'
import type { Star } from './renderer'

export interface HudState {
  level: number
  timeLeft: number
  lumasLeft: number
}

export interface GameLoopCallbacks {
  onHudChange: (hud: HudState) => void
  onCatch: (hue: number) => void
  onGameOver: () => void
}

const PICK_RADIUS = LUMA_SIZE * 2

function hudFromEngine(engine: EngineState): HudState {
  return {
    level: engine.level,
    timeLeft: Math.max(0, Math.ceil(engine.timeLeft)),
    lumasLeft: engine.lumas.length,
  }
}

export function useGameLoop(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  callbacks: GameLoopCallbacks,
) {
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const stateRef = useRef({
    engine: null as EngineState | null,
    running: false,
    rafId: 0,
    stars: [] as Star[],
    lastHud: null as HudState | null,
  })
  const startTimeRef = useRef(0)

  const emitHud = useCallback((engine: EngineState) => {
    const s = stateRef.current
    const next = hudFromEngine(engine)
    const prev = s.lastHud
    if (
      prev &&
      prev.level === next.level &&
      prev.timeLeft === next.timeLeft &&
      prev.lumasLeft === next.lumasLeft
    ) {
      return
    }
    s.lastHud = next
    callbacksRef.current.onHudChange(next)
  }, [])

  const start = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = stateRef.current
    const elapsed = (performance.now() - startTimeRef.current) / 1000
    s.running = true
    s.engine = startLevel(1, elapsed, canvas.width, canvas.height)
    emitHud(s.engine)
  }, [canvasRef, emitHud])

  const stop = useCallback(() => {
    stateRef.current.running = false
  }, [])

  const pointerDown = useCallback((x: number, y: number) => {
    const s = stateRef.current
    const engine = s.engine
    if (!s.running || !engine) return
    const luma = findLumaAt(engine.lumas, x, y, PICK_RADIUS)
    if (luma) engine.draggedId = luma.id
  }, [])

  const pointerMove = useCallback((x: number, y: number) => {
    const engine = stateRef.current.engine
    if (!engine || engine.draggedId === null) return
    const luma = engine.lumas.find((l) => l.id === engine.draggedId)
    if (luma) {
      luma.x = x
      luma.y = y
    }
  }, [])

  const pointerUp = useCallback(() => {
    const engine = stateRef.current.engine
    if (engine) engine.draggedId = null
  }, [])

  // canvas sizing + idle starfield
  useEffect(() => {
    const canvas = canvasRef.current!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    stateRef.current.stars = createStars(canvas.width, canvas.height)
    startTimeRef.current = performance.now()

    function onResize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [canvasRef])

  // global drag move/release listeners
  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      pointerMove(e.clientX, e.clientY)
    }
    function onTouchMove(e: TouchEvent) {
      const t = e.touches[0]
      if (t) pointerMove(t.clientX, t.clientY)
    }
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', pointerUp)
    window.addEventListener('touchmove', onTouchMove)
    window.addEventListener('touchend', pointerUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', pointerUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', pointerUp)
    }
  }, [pointerMove, pointerUp])

  // render/simulate loop
  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext('2d')!
    const s = stateRef.current
    let alive = true

    function loop() {
      if (!alive) return

      const w = canvas.width
      const h = canvas.height
      const cx = w / 2
      const cy = h / 2
      const elapsed = (performance.now() - startTimeRef.current) / 1000

      drawBackground(ctx, w, h, s.stars, elapsed)
      drawRosalina(ctx, cx, cy)

      if (s.running && s.engine) {
        const result = stepGame(s.engine, elapsed, w, h)
        s.engine = result.state

        for (const luma of s.engine.lumas) drawLuma(ctx, luma)

        for (const hue of result.events.caughtHues) {
          callbacksRef.current.onCatch(hue)
        }

        if (result.events.gameOver) {
          s.running = false
          callbacksRef.current.onGameOver()
        } else {
          emitHud(s.engine)
        }
      }

      s.rafId = requestAnimationFrame(loop)
    }

    s.rafId = requestAnimationFrame(loop)

    return () => {
      alive = false
      cancelAnimationFrame(s.rafId)
    }
  }, [canvasRef, emitHud])

  return { pointerDown, start, stop }
}

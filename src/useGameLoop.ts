import { useRef, useEffect, useCallback } from 'react'
import type { Luma } from './types'
import { CATCH_RADIUS, LUMA_SIZE } from './constants'
import { computeDrift } from './physics'
import { isCaught, findLumaAt } from './collision'
import { spawnLumas } from './luma-spawner'
import { getLevelConfig, tickTimer } from './difficulty'
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

export function useGameLoop(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  callbacks: GameLoopCallbacks,
) {
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const stateRef = useRef({
    level: 1,
    timeLeft: 30,
    lumas: [] as Luma[],
    running: false,
    rafId: 0,
    draggedId: null as number | null,
    stars: [] as Star[],
  })
  const startTimeRef = useRef(0)

  const emitHud = useCallback(() => {
    const s = stateRef.current
    callbacksRef.current.onHudChange({
      level: s.level,
      timeLeft: Math.max(0, s.timeLeft),
      lumasLeft: s.lumas.length,
    })
  }, [])

  const startLevel = useCallback(
    (level: number) => {
      const canvas = canvasRef.current
      if (!canvas) return
      const s = stateRef.current
      const { timeLeft, lumaCount } = getLevelConfig(level)
      s.level = level
      s.timeLeft = timeLeft
      s.lumas = spawnLumas(lumaCount, canvas.width, canvas.height)
      s.draggedId = null
      emitHud()
    },
    [canvasRef, emitHud],
  )

  const start = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = stateRef.current
    s.running = true
    startLevel(1)
  }, [canvasRef, startLevel])

  const stop = useCallback(() => {
    stateRef.current.running = false
  }, [])

  const pointerDown = useCallback((x: number, y: number) => {
    const s = stateRef.current
    if (!s.running) return
    const luma = findLumaAt(s.lumas, x, y, PICK_RADIUS)
    if (luma) s.draggedId = luma.id
  }, [])

  const pointerMove = useCallback((x: number, y: number) => {
    const s = stateRef.current
    if (s.draggedId === null) return
    const luma = s.lumas.find((l) => l.id === s.draggedId)
    if (luma) {
      luma.x = x
      luma.y = y
    }
  }, [])

  const pointerUp = useCallback(() => {
    stateRef.current.draggedId = null
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

  // level timer
  useEffect(() => {
    const id = setInterval(() => {
      const s = stateRef.current
      if (!s.running) return
      const result = tickTimer(s.timeLeft)
      s.timeLeft = result.timeLeft
      emitHud()
      if (result.expired) {
        s.running = false
        callbacksRef.current.onGameOver()
      }
    }, 1000)
    return () => clearInterval(id)
  }, [emitHud])

  // render/update loop
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

      if (s.running) {
        for (const luma of s.lumas) {
          if (luma.id !== s.draggedId) {
            const { x, y } = computeDrift(
              luma.baseX,
              luma.baseY,
              luma.offset,
              elapsed,
            )
            luma.x = x
            luma.y = y
          }
          drawLuma(ctx, luma)
        }

        const caught = s.lumas.filter((l) => isCaught(l, cx, cy, CATCH_RADIUS))
        if (caught.length > 0) {
          for (const luma of caught) callbacksRef.current.onCatch(luma.hue)
          const caughtIds = new Set(caught.map((l) => l.id))
          s.lumas = s.lumas.filter((l) => !caughtIds.has(l.id))
          if (s.draggedId !== null && caughtIds.has(s.draggedId)) {
            s.draggedId = null
          }

          if (s.lumas.length === 0) {
            startLevel(s.level + 1)
          } else {
            emitHud()
          }
        }
      }

      s.rafId = requestAnimationFrame(loop)
    }

    s.rafId = requestAnimationFrame(loop)

    return () => {
      alive = false
      cancelAnimationFrame(s.rafId)
    }
  }, [canvasRef, startLevel, emitHud])

  return { pointerDown, start, stop }
}

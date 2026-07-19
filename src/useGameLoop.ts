import { useRef, useEffect, useCallback } from 'react'
import type { Pipe, Character } from './types'
import {
  GRAVITY,
  JUMP_STRENGTH,
  BASE_PIPE_SPEED,
  BASE_SPAWN_RATE,
  BLOOPER_WIDTH,
  BLOOPER_HEIGHT,
} from './constants'
import { applyGravity, updatePosition, isOutOfBounds } from './physics'
import { checkPipeCollision } from './collision'
import { spawnPipe, movePipes, removeOffscreen } from './pipe-manager'
import { tickScore } from './difficulty'
import { renderChar, drawBackground, drawPipes } from './renderer'

export interface GameLoopCallbacks {
  onScoreChange: (score: number) => void
  onGameOver: (score: number) => void
  onLevelUp: (level: number) => void
}

const blooperConfig = { width: BLOOPER_WIDTH, height: BLOOPER_HEIGHT }

export function useGameLoop(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  selectedCharacter: Character,
  callbacks: GameLoopCallbacks,
) {
  const callbacksRef = useRef(callbacks)
  callbacksRef.current = callbacks

  const stateRef = useRef({
    y: 0,
    velocity: 0,
    pipes: [] as Pipe[],
    score: 0,
    frameCount: 0,
    spawnTimer: 0,
    pipeSpeed: BASE_PIPE_SPEED,
    spawnRate: BASE_SPAWN_RATE,
    running: false,
    rafId: 0,
  })

  const jump = useCallback(() => {
    if (stateRef.current.running) stateRef.current.velocity = JUMP_STRENGTH
  }, [])

  const start = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const s = stateRef.current
    s.y = canvas.height / 2
    s.velocity = 0
    s.pipes = []
    s.score = 0
    s.pipeSpeed = BASE_PIPE_SPEED
    s.spawnRate = BASE_SPAWN_RATE
    s.frameCount = 0
    s.spawnTimer = 0
    s.running = true
    callbacksRef.current.onScoreChange(0)
  }, [canvasRef])

  const stop = useCallback(() => {
    stateRef.current.running = false
    cancelAnimationFrame(stateRef.current.rafId)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current!
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    function onResize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [canvasRef])

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas!.getContext('2d')!

    let prevLevel = 0
    let running = true

    function loop() {
      const s = stateRef.current
      if (!s.running || !running) return
      s.frameCount++

      const w = canvas.width
      const h = canvas.height
      const cb = callbacksRef.current

      drawBackground(ctx, w, h, s.frameCount)

      s.velocity = applyGravity(s.velocity, GRAVITY)
      s.y = updatePosition(s.y, s.velocity)

      if (isOutOfBounds(s.y, h)) {
        s.running = false
        cb.onGameOver(s.score)
        return
      }

      s.spawnTimer++
      if (s.spawnTimer >= s.spawnRate) {
        s.pipes.push(spawnPipe(h))
        s.spawnTimer = 0
      }

      s.pipes = movePipes(s.pipes, s.pipeSpeed)

      for (const p of s.pipes) {
        if (checkPipeCollision(s.y, p, h, blooperConfig)) {
          s.running = false
          cb.onGameOver(s.score)
          return
        }

        if (!p.passed && p.x + 60 < BLOOPER_WIDTH * 0.2) {
          const result = tickScore({
            score: s.score,
            pipeSpeed: s.pipeSpeed,
            spawnRate: s.spawnRate,
          })
          s.score = result.score
          s.pipeSpeed = result.pipeSpeed
          s.spawnRate = result.spawnRate
          p.passed = true
          cb.onScoreChange(s.score)
          if (result.levelUp) {
            prevLevel++
            cb.onLevelUp(prevLevel)
          }
        }
      }

      s.pipes = removeOffscreen(s.pipes)

      drawPipes(ctx, s.pipes, h)

      ctx.save()
      ctx.translate(BLOOPER_WIDTH * 0.3, s.y + BLOOPER_HEIGHT / 2)
      const rotation = Math.min(
        Math.PI / 6,
        Math.max(-Math.PI / 6, s.velocity * 0.1),
      )
      ctx.rotate(rotation)
      renderChar(ctx, selectedCharacter, 0, 0)
      ctx.restore()

      s.rafId = requestAnimationFrame(loop)
    }

    if (stateRef.current.running) {
      stateRef.current.rafId = requestAnimationFrame(loop)
    }

    return () => {
      running = false
      cancelAnimationFrame(stateRef.current.rafId)
    }
  }, [canvasRef, selectedCharacter])

  return { jump, start, stop }
}

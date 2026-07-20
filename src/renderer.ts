import type { Luma } from './types'
import { LUMA_SIZE } from './constants'

export interface Star {
  x: number
  y: number
  radius: number
  duration: number
  seed: number
}

export function createStars(
  canvasW: number,
  canvasH: number,
  count = 100,
  rng: () => number = Math.random,
): Star[] {
  const stars: Star[] = []
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rng() * canvasW,
      y: rng() * canvasH,
      radius: rng() * 1.5,
      duration: rng() * 3 + 2,
      seed: rng() * Math.PI * 2,
    })
  }
  return stars
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  stars: Star[],
  elapsedSeconds: number,
) {
  const grad = ctx.createRadialGradient(
    w / 2,
    h / 2,
    0,
    w / 2,
    h / 2,
    Math.max(w, h) / 1.2,
  )
  grad.addColorStop(0, '#1b2735')
  grad.addColorStop(1, '#050b24')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  ctx.fillStyle = 'white'
  for (const star of stars) {
    const phase = (elapsedSeconds / star.duration) * Math.PI * 2 + star.seed
    const opacity = 0.3 + (Math.sin(phase) * 0.5 + 0.5) * 0.7
    ctx.globalAlpha = opacity
    ctx.beginPath()
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
}

export function drawRosalina(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
) {
  ctx.fillStyle = '#ffd700'
  ctx.fillRect(cx - 40, cy, 80, 30)
  ctx.fillRect(cx - 30, cy - 30, 60, 30)

  ctx.fillStyle = '#4a90e2'
  ctx.beginPath()
  ctx.moveTo(cx, cy - 10)
  ctx.lineTo(cx - 20, cy + 10)
  ctx.lineTo(cx + 20, cy + 10)
  ctx.fill()

  ctx.fillStyle = '#ffe0bd'
  ctx.beginPath()
  ctx.arc(cx, cy - 20, 12, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = '#fdf5e6'
  ctx.beginPath()
  ctx.arc(cx, cy - 25, 14, Math.PI, 0)
  ctx.fill()
  ctx.fillRect(cx + 10, cy - 25, 8, 20)

  ctx.fillStyle = 'gold'
  ctx.fillRect(cx - 5, cy - 35, 10, 5)
}

function starPath(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number,
) {
  let rot = (Math.PI / 2) * 3
  const step = Math.PI / spikes
  ctx.beginPath()
  ctx.moveTo(cx, cy - outerRadius)
  for (let i = 0; i < spikes; i++) {
    let x = cx + Math.cos(rot) * outerRadius
    let y = cy + Math.sin(rot) * outerRadius
    ctx.lineTo(x, y)
    rot += step

    x = cx + Math.cos(rot) * innerRadius
    y = cy + Math.sin(rot) * innerRadius
    ctx.lineTo(x, y)
    rot += step
  }
  ctx.lineTo(cx, cy - outerRadius)
  ctx.closePath()
}

export function drawLuma(ctx: CanvasRenderingContext2D, luma: Luma) {
  const color = `hsl(${luma.hue}, 100%, 70%)`

  ctx.save()
  ctx.shadowBlur = 15
  ctx.shadowColor = color
  ctx.fillStyle = color
  ctx.lineJoin = 'round'
  ctx.lineWidth = 4
  starPath(ctx, luma.x, luma.y, 5, LUMA_SIZE, LUMA_SIZE / 2)
  ctx.fill()
  ctx.stroke()
  ctx.restore()

  ctx.fillStyle = 'black'
  ctx.beginPath()
  ctx.arc(luma.x - 4, luma.y - 2, 2, 0, Math.PI * 2)
  ctx.arc(luma.x + 4, luma.y - 2, 2, 0, Math.PI * 2)
  ctx.fill()
}

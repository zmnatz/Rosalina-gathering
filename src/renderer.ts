import type { Character } from './types'

export function renderChar(
  ctx: CanvasRenderingContext2D,
  charKey: Character,
  xOffset = 0,
  yOffset = 0,
) {
  ctx.save()
  ctx.translate(xOffset, yOffset)

  ctx.fillStyle = '#ffeb3b'
  ctx.strokeStyle = '#fbc02d'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.ellipse(0, 15, 35, 12, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()

  if (charKey.includes('princess')) {
    const dressColor = charKey === 'pink_princess' ? '#ff69b4' : '#40e0d0'
    ctx.fillStyle = dressColor
    ctx.beginPath()
    ctx.moveTo(-15, 10)
    ctx.lineTo(15, 10)
    ctx.lineTo(20, -10)
    ctx.lineTo(-20, -10)
    ctx.closePath()
    ctx.fill()
    ctx.fillStyle = '#ffe4c4'
    ctx.beginPath()
    ctx.arc(0, -15, 12, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ffd700'
    ctx.beginPath()
    ctx.arc(0, -18, 14, Math.PI, 0)
    ctx.fill()
    ctx.fillRect(-14, -18, 5, 20)
    ctx.fillRect(9, -18, 5, 20)
  } else {
    let bodyColor = 'white'
    if (charKey === 'red') bodyColor = '#ff4444'
    if (charKey === 'luigi') bodyColor = '#4caf50'
    ctx.fillStyle = bodyColor
    ctx.strokeStyle = '#ddd'
    ctx.beginPath()
    ctx.ellipse(0, -5, 20, 25, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    for (let i = -15; i <= 15; i += 10) {
      ctx.moveTo(i, 10)
      ctx.quadraticCurveTo(i + 5, 20, i + 10, 10)
    }
    ctx.stroke()
    ctx.fillStyle = '#333'
    ctx.beginPath()
    ctx.ellipse(-8, -10, 10, 6, 0.2, 0, Math.PI * 2)
    ctx.ellipse(8, -10, 10, 6, -0.2, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'white'
    ctx.beginPath()
    ctx.arc(-8, -10, 5, 0, Math.PI * 2)
    ctx.arc(8, -10, 5, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = 'black'
    ctx.beginPath()
    ctx.arc(-8, -10, 3, 0, Math.PI * 2)
    ctx.arc(8, -10, 3, 0, Math.PI * 2)
    ctx.fill()
    if (charKey === 'mario') {
      ctx.fillStyle = 'red'
      ctx.beginPath()
      ctx.arc(0, -25, 12, Math.PI, 0)
      ctx.fill()
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(0, -28, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = 'red'
      ctx.font = 'bold 8px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('M', 0, -27)
    }
    if (charKey === 'luigi') {
      ctx.fillStyle = '#4caf50'
      ctx.beginPath()
      ctx.arc(0, -25, 12, Math.PI, 0)
      ctx.fill()
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(0, -28, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#4caf50'
      ctx.font = 'bold 8px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('L', 0, -27)
    }
  }
  ctx.restore()
}

export function generateMenuImage(char: Character): string {
  const c = document.createElement('canvas')
  c.width = 100
  c.height = 100
  const ctx = c.getContext('2d')!
  renderChar(ctx, char, 50, 50)
  return c.toDataURL()
}

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  frameCount: number,
) {
  const skyGrad = ctx.createLinearGradient(0, 0, 0, h)
  skyGrad.addColorStop(0, '#81d4fa')
  skyGrad.addColorStop(0.5, '#4fc3f7')
  ctx.fillStyle = skyGrad
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#ffe082'
  ctx.fillRect(0, h - 100, w, 100)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    const offset = i * 50
    const speed = (i + 1) * 0.02
    ctx.moveTo(0, h - 80 - offset)
    for (let x = 0; x <= w; x += 10) {
      const y = Math.sin(x * 0.01 + frameCount * speed) * 15
      ctx.lineTo(x, h - 80 - offset + y)
    }
    ctx.lineTo(w, h)
    ctx.lineTo(0, h)
    ctx.fill()
  }
}

export function drawPipes(
  ctx: CanvasRenderingContext2D,
  pipes: { x: number; top: number; bottom: number }[],
  canvasH: number,
) {
  for (const p of pipes) {
    ctx.fillStyle = '#8d6e63'
    ctx.strokeStyle = '#5d4037'
    ctx.lineWidth = 5
    ctx.beginPath()
    ctx.roundRect(p.x + 15, 0, 30, p.top, [0, 0, 10, 10])
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#4caf50'
    ctx.beginPath()
    ctx.arc(p.x + 30, p.top, 40, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#8d6e63'
    ctx.beginPath()
    ctx.roundRect(p.x + 15, canvasH - p.bottom, 30, p.bottom, [10, 10, 0, 0])
    ctx.fill()
    ctx.stroke()
    ctx.fillStyle = '#4caf50'
    ctx.beginPath()
    ctx.arc(p.x + 30, canvasH - p.bottom, 40, 0, Math.PI * 2)
    ctx.fill()
  }
}

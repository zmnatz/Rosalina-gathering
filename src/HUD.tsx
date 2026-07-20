interface HUDProps {
  level: number
  timeLeft: number
  lumasLeft: number
  visible: boolean
}

export default function HUD({ level, timeLeft, lumasLeft, visible }: HUDProps) {
  if (!visible) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: 20,
        left: 20,
        pointerEvents: 'none',
        textShadow: '2px 2px #000',
        fontSize: '1.5rem',
        color: 'white',
        zIndex: 5,
      }}
    >
      <div>Level: {level}</div>
      <div>Time: {timeLeft}s</div>
      <div>Lumas Left: {lumasLeft}</div>
    </div>
  )
}

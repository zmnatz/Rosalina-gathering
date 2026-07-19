interface HUDProps {
  score: number
  levelUp: boolean
  visible: boolean
}

export default function HUD({ score, levelUp, visible }: HUDProps) {
  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 30,
          width: '100%',
          textAlign: 'center',
          fontSize: '4rem',
          fontWeight: 'bold',
          color: 'white',
          textShadow: '4px 4px #ff69b4',
          pointerEvents: 'none',
          display: visible ? 'block' : 'none',
          zIndex: 10,
        }}
      >
        {score}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 110,
          width: '100%',
          textAlign: 'center',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#ffeb3b',
          textShadow: '3px 3px #e91e63',
          pointerEvents: 'none',
          opacity: levelUp ? 1 : 0,
          transform: levelUp ? 'scale(1.2)' : 'scale(1)',
          transition: 'opacity 0.3s, transform 0.3s',
          zIndex: 10,
        }}
      >
        GETTING TOUGH! 🚀
      </div>
    </>
  )
}

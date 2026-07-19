interface GameOverScreenProps {
  score: number
  onBackToMenu: () => void
}

export default function GameOverScreen({
  score,
  onBackToMenu,
}: GameOverScreenProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.4)',
          backdropFilter: 'blur(15px)',
          padding: 30,
          borderRadius: 40,
          pointerEvents: 'auto',
          border: '8px solid #fff',
          boxShadow: '0 15px 30px rgba(0,0,0,0.3)',
          maxWidth: '90%',
        }}
      >
        <h1
          style={{
            margin: '0 0 10px',
            fontSize: '3rem',
            textShadow: '4px 4px #ff69b4',
            color: '#fff',
          }}
        >
          Wipe Out!
        </h1>
        <p
          style={{
            fontSize: '1.3rem',
            marginBottom: 20,
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          You got {score} points!
        </p>
        <button
          onClick={onBackToMenu}
          style={{
            padding: '20px 50px',
            fontSize: '2rem',
            background: '#ffeb3b',
            border: 'none',
            borderRadius: 50,
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#e91e63',
            boxShadow: '0 8px #fbc02d',
          }}
        >
          BACK TO MENU
        </button>
      </div>
    </div>
  )
}

interface GameOverScreenProps {
  onBackToMenu: () => void
}

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  color: 'white',
  textAlign: 'center',
  zIndex: 10,
}

const buttonStyle: React.CSSProperties = {
  padding: '15px 30px',
  fontSize: '1.25rem',
  fontFamily: "'Courier New', Courier, monospace",
  background: '#4a90e2',
  color: 'white',
  border: '4px solid #fff',
  cursor: 'pointer',
  marginTop: 20,
}

export default function GameOverScreen({ onBackToMenu }: GameOverScreenProps) {
  return (
    <div style={overlayStyle}>
      <h1>Game Over!</h1>
      <p>The stars drifted too far away.</p>
      <button onClick={onBackToMenu} style={buttonStyle}>
        TRY AGAIN
      </button>
    </div>
  )
}

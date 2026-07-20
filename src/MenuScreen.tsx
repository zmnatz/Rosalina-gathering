interface MenuScreenProps {
  onStart: () => void
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

export default function MenuScreen({ onStart }: MenuScreenProps) {
  return (
    <div style={overlayStyle}>
      <h1>Rosalina's Rainbow Lumas</h1>
      <p>Drag the colorful stars back to Rosalina in the center!</p>
      <button onClick={onStart} style={buttonStyle}>
        START GAME
      </button>
    </div>
  )
}

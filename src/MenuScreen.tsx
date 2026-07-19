import type { Character } from './types'
import { generateMenuImage } from './renderer'

const CHARACTERS: Character[] = [
  'original',
  'mario',
  'red',
  'luigi',
  'pink_princess',
  'teal_princess',
]

const charImages: Record<Character, string> = {} as Record<Character, string>
for (const c of CHARACTERS) {
  charImages[c] = generateMenuImage(c)
}

interface MenuScreenProps {
  selectedChar: Character
  onSelectChar: (c: Character) => void
  onStart: () => void
}

export default function MenuScreen({
  selectedChar,
  onSelectChar,
  onStart,
}: MenuScreenProps) {
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
          🌴 Surfing Blooper 🦑
        </h1>
        <p
          style={{
            fontSize: '1.3rem',
            marginBottom: 20,
            color: '#fff',
            fontWeight: 'bold',
          }}
        >
          Choose your Surfer!
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 15,
            marginBottom: 25,
          }}
        >
          {CHARACTERS.map((c) => (
            <button
              key={c}
              onClick={() => onSelectChar(c)}
              style={{
                padding: 10,
                background: selectedChar === c ? '#ffeb3b' : '#fff',
                border: `4px solid ${selectedChar === c ? '#e91e63' : '#ffeb3b'}`,
                borderRadius: 20,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: selectedChar === c ? 'scale(1.1)' : 'scale(1)',
                boxShadow: selectedChar === c ? '0 0 15px #fff' : 'none',
              }}
            >
              <img
                src={charImages[c]}
                alt={c}
                style={{ width: 60, height: 60, objectFit: 'contain' }}
              />
            </button>
          ))}
        </div>

        <button
          onClick={onStart}
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
          PLAY!
        </button>
      </div>
    </div>
  )
}

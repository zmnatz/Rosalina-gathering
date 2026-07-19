import { useState, useRef, useCallback } from 'react'
import type { Character } from './types'
import { useGameLoop } from './useGameLoop'
import { useAudio } from './useAudio'
import MenuScreen from './MenuScreen'
import GameOverScreen from './GameOverScreen'
import HUD from './HUD'

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [screen, setScreen] = useState<'menu' | 'playing' | 'gameover'>('menu')
  const [selectedChar, setSelectedChar] = useState<Character>('original')
  const [score, setScore] = useState(0)
  const [levelUp, setLevelUp] = useState(false)
  const audio = useAudio()

  const callbacks = useCallback(
    () => ({
      onScoreChange(s: number) {
        setScore(s)
      },
      onGameOver(s: number) {
        setScore(s)
        setScreen('gameover')
        audio.stop()
      },
      onLevelUp(level: number) {
        audio.setLevel(level)
        setLevelUp(true)
        setTimeout(() => setLevelUp(false), 1000)
      },
    }),
    [audio],
  )

  const { jump, start } = useGameLoop(canvasRef, selectedChar, callbacks())

  const handleStart = useCallback(() => {
    audio.init()
    setScore(0)
    setScreen('playing')
    start()
    audio.start()
  }, [audio, start])

  const handleJump = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (e.target instanceof HTMLElement && e.target.tagName === 'BUTTON')
        return
      jump()
    },
    [jump],
  )

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100vh' }}
      onMouseDown={handleJump}
      onTouchStart={handleJump}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />

      <HUD score={score} levelUp={levelUp} visible={screen === 'playing'} />

      {screen === 'menu' && (
        <MenuScreen
          selectedChar={selectedChar}
          onSelectChar={setSelectedChar}
          onStart={handleStart}
        />
      )}

      {screen === 'gameover' && (
        <GameOverScreen
          score={score}
          onBackToMenu={() => setScreen('menu')}
        />
      )}
    </div>
  )
}

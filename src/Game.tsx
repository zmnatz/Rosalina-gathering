import { useState, useRef, useCallback } from 'react'
import { useGameLoop } from './useGameLoop'
import type { HudState } from './useGameLoop'
import { useAudio } from './useAudio'
import MenuScreen from './MenuScreen'
import GameOverScreen from './GameOverScreen'
import HUD from './HUD'

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [screen, setScreen] = useState<'menu' | 'playing' | 'gameover'>('menu')
  const [hud, setHud] = useState<HudState>({ level: 1, timeLeft: 30, lumasLeft: 0 })
  const audio = useAudio()

  const callbacks = useCallback(
    () => ({
      onHudChange(next: HudState) {
        setHud(next)
      },
      onCatch(hue: number) {
        audio.playChime(hue)
      },
      onGameOver() {
        setScreen('gameover')
        audio.stop()
      },
    }),
    [audio],
  )

  const { pointerDown, start } = useGameLoop(canvasRef, callbacks())

  const handleStart = useCallback(() => {
    audio.init()
    setScreen('playing')
    start()
    audio.start()
  }, [audio, start])

  const handlePointerDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (e.target instanceof HTMLElement && e.target.tagName === 'BUTTON') {
        return
      }
      if ('touches' in e) {
        const touch = e.touches[0]
        if (touch) pointerDown(touch.clientX, touch.clientY)
      } else {
        pointerDown(e.clientX, e.clientY)
      }
    },
    [pointerDown],
  )

  return (
    <div
      style={{ position: 'relative', width: '100%', height: '100vh' }}
      onMouseDown={handlePointerDown}
      onTouchStart={handlePointerDown}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />

      <HUD
        level={hud.level}
        timeLeft={hud.timeLeft}
        lumasLeft={hud.lumasLeft}
        visible={screen === 'playing'}
      />

      {screen === 'menu' && <MenuScreen onStart={handleStart} />}

      {screen === 'gameover' && (
        <GameOverScreen onBackToMenu={() => setScreen('menu')} />
      )}
    </div>
  )
}

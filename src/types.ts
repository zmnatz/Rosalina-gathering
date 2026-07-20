export interface Luma {
  id: number
  x: number
  y: number
  baseX: number
  baseY: number
  offset: number
  hue: number
}

export interface GameState {
  level: number
  timeLeft: number
  lumas: Luma[]
  gameRunning: boolean
  screen: 'menu' | 'playing' | 'gameover'
}

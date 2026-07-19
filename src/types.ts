export type Character = 'original' | 'mario' | 'red' | 'luigi' | 'pink_princess' | 'teal_princess'

export interface Pipe {
  x: number
  top: number
  bottom: number
  passed: boolean
}

export interface GameState {
  blooper: { x: number; y: number; velocity: number }
  pipes: Pipe[]
  score: number
  frameCount: number
  spawnTimer: number
  pipeSpeed: number
  spawnRate: number
  gameRunning: boolean
  selectedCharacter: Character
  screen: 'menu' | 'playing' | 'gameover'
}

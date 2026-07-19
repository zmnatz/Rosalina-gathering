export interface DifficultyState {
  score: number
  pipeSpeed: number
  spawnRate: number
}

export interface TickResult {
  score: number
  pipeSpeed: number
  spawnRate: number
  levelUp: boolean
}

export function tickScore(state: DifficultyState): TickResult {
  const newScore = state.score + 1
  const isLevelUp = newScore % 5 === 0

  if (!isLevelUp) {
    return {
      score: newScore,
      pipeSpeed: state.pipeSpeed,
      spawnRate: state.spawnRate,
      levelUp: false,
    }
  }

  return {
    score: newScore,
    pipeSpeed: state.pipeSpeed + 0.2,
    spawnRate: Math.max(80, state.spawnRate - 15),
    levelUp: true,
  }
}

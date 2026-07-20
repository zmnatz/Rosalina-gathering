import {
  BASE_TIME,
  MIN_TIME,
  TIME_DECREASE_PER_LEVEL,
  BASE_LUMA_COUNT,
  LUMA_COUNT_PER_LEVEL,
} from './constants'

export interface LevelConfig {
  timeLeft: number
  lumaCount: number
}

export function getLevelConfig(level: number): LevelConfig {
  return {
    timeLeft: Math.max(MIN_TIME, BASE_TIME - level * TIME_DECREASE_PER_LEVEL),
    lumaCount: BASE_LUMA_COUNT + level * LUMA_COUNT_PER_LEVEL,
  }
}

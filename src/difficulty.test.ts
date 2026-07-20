import { describe, it, expect } from 'vitest'
import { getLevelConfig, tickTimer } from './difficulty'

describe('getLevelConfig', () => {
  it('gives level 1 the base time and luma count', () => {
    expect(getLevelConfig(1)).toEqual({ timeLeft: 28, lumaCount: 8 })
  })

  it('reduces time and increases lumas as level rises', () => {
    expect(getLevelConfig(3)).toEqual({ timeLeft: 24, lumaCount: 14 })
  })

  it('floors time at the minimum', () => {
    expect(getLevelConfig(20)).toEqual({ timeLeft: 10, lumaCount: 65 })
  })
})

describe('tickTimer', () => {
  it('decrements the timer by one second', () => {
    expect(tickTimer(10)).toEqual({ timeLeft: 9, expired: false })
  })

  it('reports expired when time runs out', () => {
    expect(tickTimer(1)).toEqual({ timeLeft: 0, expired: true })
  })

  it('reports expired if already past zero', () => {
    expect(tickTimer(0)).toEqual({ timeLeft: -1, expired: true })
  })
})

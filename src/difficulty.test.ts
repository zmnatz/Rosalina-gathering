import { describe, it, expect } from 'vitest'
import { tickScore } from './difficulty'

const base = { score: 0, pipeSpeed: 1.8, spawnRate: 160 }

describe('tickScore', () => {
  it('increments score by 1 without level up', () => {
    const result = tickScore(base)
    expect(result.score).toBe(1)
    expect(result.levelUp).toBe(false)
    expect(result.pipeSpeed).toBe(1.8)
    expect(result.spawnRate).toBe(160)
  })

  it('triggers level up at score 5', () => {
    const result = tickScore({ ...base, score: 4 })
    expect(result.score).toBe(5)
    expect(result.levelUp).toBe(true)
    expect(result.pipeSpeed).toBe(2.0)
    expect(result.spawnRate).toBe(145)
  })

  it('normal tick after level up does not trigger another', () => {
    const result = tickScore({ ...base, score: 5 })
    expect(result.score).toBe(6)
    expect(result.levelUp).toBe(false)
  })

  it('triggers level up at score 10', () => {
    const result = tickScore({
      score: 9,
      pipeSpeed: 2.0,
      spawnRate: 145,
    })
    expect(result.score).toBe(10)
    expect(result.levelUp).toBe(true)
    expect(result.pipeSpeed).toBe(2.2)
    expect(result.spawnRate).toBe(130)
  })

  it('floors spawnRate at 80', () => {
    const result = tickScore({
      score: 59,
      pipeSpeed: 4.0,
      spawnRate: 85,
    })
    expect(result.score).toBe(60)
    expect(result.levelUp).toBe(true)
    expect(result.pipeSpeed).toBe(4.2)
    expect(result.spawnRate).toBe(80)
  })

  it('does not reduce spawnRate below 80', () => {
    const result = tickScore({
      score: 64,
      pipeSpeed: 4.2,
      spawnRate: 80,
    })
    expect(result.score).toBe(65)
    expect(result.levelUp).toBe(true)
    expect(result.pipeSpeed).toBe(4.4)
    expect(result.spawnRate).toBe(80)
  })
})

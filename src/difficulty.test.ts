import { describe, it, expect } from 'vitest'
import { getLevelConfig } from './difficulty'

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

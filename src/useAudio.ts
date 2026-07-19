import { useRef, useEffect, useCallback } from 'react'

const melody = [
  { note: 261.63, len: 0.2 },
  { note: 329.63, len: 0.2 },
  { note: 392.0, len: 0.2 },
  { note: 523.25, len: 0.4 },
  { note: 392.0, len: 0.2 },
  { note: 329.63, len: 0.2 },
  { note: 261.63, len: 0.4 },
  { note: 0, len: 0.2 },
  { note: 349.23, len: 0.2 },
  { note: 392.0, len: 0.2 },
  { note: 440.0, len: 0.2 },
  { note: 523.25, len: 0.4 },
  { note: 440.0, len: 0.2 },
  { note: 349.23, len: 0.2 },
  { note: 261.63, len: 0.6 },
]

function playNote(
  ctx: AudioContext,
  freq: number,
  duration: number,
  type: OscillatorType = 'square',
  volume = 0.1,
) {
  if (freq === 0) return
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, ctx.currentTime)
  gain.gain.setValueAtTime(volume, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + duration)
}

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null)
  const loopRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const noteIndexRef = useRef(0)
  const levelRef = useRef(0)

  const init = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext()
  }, [])

  const playMusic = useCallback(() => {
    const ctx = ctxRef.current
    if (!ctx) return

    const current = melody[noteIndexRef.current]
    const level = levelRef.current
    const mainType: OscillatorType = level >= 2 ? 'sawtooth' : 'square'

    playNote(ctx, current.note, current.len, mainType, 0.07)
    playNote(ctx, 130.81, 0.4, 'triangle', 0.1)
    if (level >= 1 && noteIndexRef.current % 2 === 0)
      playNote(ctx, 150, 0.05, 'square', 0.05)
    if (level >= 2 && current.note !== 0)
      playNote(ctx, current.note * 1.5, current.len, 'square', 0.04)
    if (level >= 3 && noteIndexRef.current % 2 === 1)
      playNote(ctx, current.note * 2, 0.1, 'sawtooth', 0.03)
    if (level >= 4 && noteIndexRef.current % 4 === 0)
      playNote(ctx, 65.41, 0.4, 'sawtooth', 0.08)

    noteIndexRef.current = (noteIndexRef.current + 1) % melody.length
    loopRef.current = setTimeout(playMusic, current.len * 1000)
  }, [])

  const start = useCallback(() => {
    levelRef.current = 0
    noteIndexRef.current = 0
    playMusic()
  }, [playMusic])

  const stop = useCallback(() => {
    if (loopRef.current) clearTimeout(loopRef.current)
  }, [])

  const setLevel = useCallback((level: number) => {
    levelRef.current = level
  }, [])

  useEffect(() => {
    return () => {
      if (loopRef.current) clearTimeout(loopRef.current)
      if (ctxRef.current) ctxRef.current.close()
    }
  }, [])

  return { init, start, stop, setLevel }
}

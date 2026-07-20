import { useRef, useCallback, useEffect } from 'react'

const AMBIENT_NOTES = [261.63, 329.63, 392.0, 523.25]

function playChimeTone(ctx: AudioContext, hue: number) {
  const freq = 261.63 + (hue / 360) * (880 - 261.63)
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(freq, ctx.currentTime)
  osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.1)

  gain.gain.setValueAtTime(0.2, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.3)
}

function playAmbientNote(ctx: AudioContext, freq: number) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()

  osc.type = 'square'
  osc.frequency.setValueAtTime(freq, ctx.currentTime)
  gain.gain.setValueAtTime(0.03, ctx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4)

  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start()
  osc.stop(ctx.currentTime + 0.5)
}

export function useAudio() {
  const ctxRef = useRef<AudioContext | null>(null)
  const loopRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const stepRef = useRef(0)

  const init = useCallback(() => {
    if (!ctxRef.current) ctxRef.current = new AudioContext()
  }, [])

  const playChime = useCallback((hue: number) => {
    const ctx = ctxRef.current
    if (!ctx) return
    playChimeTone(ctx, hue)
  }, [])

  const start = useCallback(() => {
    const ctx = ctxRef.current
    if (!ctx) return
    stepRef.current = 0
    loopRef.current = setInterval(() => {
      playAmbientNote(ctx, AMBIENT_NOTES[stepRef.current % AMBIENT_NOTES.length])
      stepRef.current++
    }, 500)
  }, [])

  const stop = useCallback(() => {
    if (loopRef.current) clearInterval(loopRef.current)
    loopRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      if (loopRef.current) clearInterval(loopRef.current)
      if (ctxRef.current) ctxRef.current.close()
    }
  }, [])

  return { init, start, stop, playChime }
}

import type { Pipe } from './types'

export interface BlooperConfig {
  width: number
  height: number
}

export function checkPipeCollision(
  blooperY: number,
  pipe: Pipe,
  canvasH: number,
  config: BlooperConfig,
): boolean {
  const leftNudge = config.width * 0.2
  const rightNudge = config.width * 0.8
  const pipeLeft = pipe.x + 15
  const pipeRight = pipe.x + 45

  const hitsPipe =
    leftNudge < pipeRight &&
    rightNudge > pipeLeft &&
    (blooperY + 15 < pipe.top ||
      blooperY + config.height - 15 > canvasH - pipe.bottom)

  return hitsPipe
}

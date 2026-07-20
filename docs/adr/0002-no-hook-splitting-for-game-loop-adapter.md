# ADR-0002: No further hook-splitting for the useGameLoop adapter

**Date:** 2026-07-19

## Status

Accepted.

## Context

During an architecture review, `useGameLoop` was flagged as a god hook — one 216-line module mixing simulation composition (drift, catch detection, level-up, timer expiry) with DOM plumbing (canvas sizing/resize, drag input, the rAF loop).

That composition logic was extracted into a pure `stepGame(state, elapsed, canvasW, canvasH, rng?)` function (see the engine module) that owns level transitions and the countdown timer directly, returning next state plus an explicit event list (`caughtHues`, `gameOver`). `useGameLoop` became a thin adapter calling `stepGame` and translating its result into draws and callbacks.

A follow-up candidate proposed splitting what's left of `useGameLoop` into separate hooks — `useCanvasSize`, `useDragInput`, and a slimmer simulation hook.

## Decision

Do not split `useGameLoop` further after the `stepGame` extraction.

Applying the deletion test to the post-extraction hook: deleting the canvas-sizing effect and inlining it elsewhere doesn't concentrate complexity anywhere — it just relocates three already-short, already-readable effects across more files. There's no shallow interface hiding a fat implementation left to deepen; what remains is plumbing that does exactly what its names say.

Drag input in particular resists clean extraction: it reaches directly into the same state `stepGame` consumes (the dragged luma's live position), so splitting it into its own hook would mean exposing that state across a new seam rather than removing one.

## Consequences

- `useGameLoop` keeps canvas sizing/resize/stars, drag input, and the rAF loop (calling `stepGame` and drawing) in one module.
- Revisit if a genuinely independent concern is added that doesn't touch simulation state (e.g., a second canvas layer, or input handling that needs to be swapped/mocked independently in tests).

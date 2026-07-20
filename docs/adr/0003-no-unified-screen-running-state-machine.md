# ADR-0003: No unified state machine for screen/running state

**Date:** 2026-07-19

## Status

Accepted.

## Context

During an architecture review, it was noted that "is the game currently playable" is represented twice: `Game.tsx` holds a `screen` state (`'menu' | 'playing' | 'gameover'`), and `useGameLoop` holds an internal `running` flag. The two are kept in sync one-directionally — `useGameLoop` flips `running` false and fires `onGameOver`, which `Game.tsx` uses to flip `screen` to `'gameover'`.

A candidate proposed collapsing both into a single state machine owned in one place.

## Decision

Do not introduce a unified state machine for screen/running state at this time.

There is no observed bug from the duplication, and after the `stepGame` extraction (ADR-0002's context), there is exactly one moment `running` needs to change (the `gameOver` event `stepGame` returns) and exactly one place already reacting to it (`Game.tsx`'s `onGameOver` callback). The deletion test doesn't show hidden complexity here — collapsing the two representations now would optimize a seam that isn't causing friction.

This does not conflict with ADR-0001: that decision is about prop-drilling depth and the shallow component tree, not about state representation.

## Consequences

- `screen` (React state, `Game.tsx`) and `running` (ref, `useGameLoop`) remain separate, synced via the existing callback.
- Revisit under the same trigger ADR-0001 already names: when the component tree deepens (e.g., a pause menu, a settings panel) or when a third consumer needs to read "is it running" independently of the callback chain.

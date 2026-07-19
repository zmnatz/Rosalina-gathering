# ADR-0001: No application context/provider for game state

**Date:** 2026-07-19

## Status

Accepted.

## Context

During an architecture review of the Surfing Blooper codebase, the question arose whether to introduce a React context (application provider) to avoid prop drilling.

The component tree is flat and shallow:

- `Game` holds all state and actions.
- `MenuScreen`, `HUD`, and `GameOverScreen` are direct children of `Game`.
- At most, one component level deep (a button inside `MenuScreen`).

## Decision

Do not introduce a React context for game state at this time.

The prop drilling in this codebase is only one level deep for all cases, and the component tree is not nested enough to cause any of the problems context solves:

- There is no intermediate component that receives a prop only to pass it to a child.
- 7 total props are passed to 3 children — well below the threshold where context pays off in locality.
- Context would make component interfaces implicit — callers cannot tell what `HUD` needs without reading its body.
- The only seam where context would add value is if the tree deepens in the future (e.g., nested pause menu, settings panel).

## Consequences

- State and actions will continue to be passed as props to direct children.
- When the component tree deepens or the number of consumers for any given state fragment reaches 3+, revisit this decision.
- All data flow can be understood by reading `Game.tsx`'s template — no indirection.

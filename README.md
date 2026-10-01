# Verbinski Protocol

## Good Luck, Have Fun, Don't Die as a branching counterfactual search problem

> **Known issues:** humanity; social media; objective functions; memory asymmetry; Sam Rockwell is exhausted.

This repository is an independent narrative-systems case study inspired by Gore Verbinski's 2026 film *Good Luck, Have Fun, Don't Die*, written by Matthew Robinson.

The official synopsis describes a man claiming to be from the future who recruits an unlikely group of diner patrons to confront social-media brainrot and an impending AI apocalypse. Contemporary criticism also describes a repeated-reset structure in which the traveler has tried the mission over and over.

The repo asks one question:

**What happens if we treat that narrative mechanism as an explicit branching-search architecture?**

## Core equation

For attempt `k`:

```text
plan_k = choose(cohort_k, interventions_k | history_k)
outcome_k = evolve(origin, plan_k)
history_(k+1) = history_k + {plan_k, outcome_k, score_k}
world_(k+1) = origin
```

Or more compactly:

```text
branch -> intervene -> observe -> remember -> reset -> recurse
```

The fictional traveler is therefore interpretable as four things at once:

1. experimenter,
2. branch selector,
3. persistent memory store,
4. moral witness to branches that everyone else forgets.

## Run the 117-attempt toy search

```bash
npm test
npm run demo
```

No dependencies are required.

The simulator is intentionally **not** a prediction engine. It is a transparent toy model for examining retained memory across resets, cohort selection, interventions, and the danger of compressing human futures into an objective function.

## Repository map

- `src/protocol.js` — deterministic branch/reset/search model
- `examples/run-117.js` — 117-attempt demonstration
- `tests/protocol.test.js` — determinism, reset-memory, search, and objective tests
- `docs/NARRATIVE-MODEL.md` — narrative state machine
- `docs/ARCHIMEDES-MAPPING.md` — mapping to checkpointed counterfactual simulation
- `docs/OBJECTIVE-FUNCTION.md` — why the score is the dangerous part
- `docs/ETHICS.md` — human-agency boundaries
- `docs/SOURCES.md` — public source basis
- `RIGHTS.md` — copyright / affiliation boundary

## The Archimedes connection

The interesting overlap is not time travel. It is **counterfactual replay**.

A simulation engine can checkpoint a state, run an intervention, measure the result, restore the checkpoint, and try another intervention. If knowledge of prior branches persists outside the reset state, the system can learn across branches.

That is the computational skeleton underneath the film-inspired interpretation.

## The warning

The model includes an explicit toy objective:

```text
J = wS*survival + wA*agency + wC*cohesion + wT*truth - wD*dependency
```

Change the weights and you change what counts as a "good" future.

That is not a bug in this repository. It is the point.

A system can become extraordinarily good at searching futures without acquiring any independent knowledge of which future ought to be chosen.

## Status

`v0.1.0` — runnable analytical prototype.

Not affiliated with the filmmakers or rights holders. No screenplay text or production assets are included.

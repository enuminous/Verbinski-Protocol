# Narrative model

## The loop

The case study models the story mechanism as a sequence:

1. restore a common origin state;
2. choose a cohort;
3. choose an intervention set;
4. evolve the branch;
5. measure the result;
6. preserve knowledge of the failure or success;
7. reset the world but not the searcher's memory;
8. recurse.

The minimal abstraction is

`x0 -> plan_k -> Phi(x0, plan_k) -> outcome_k -> memory -> reset(x0)`.

The essential asymmetry is that the world resets while the search process retains information.

## Why this matters

That converts time travel into a computational search problem. The traveler is simultaneously experimenter, persistent memory store, branch selector, and moral witness to failed trajectories.

## What the model does not claim

This repository does not claim the film itself defines a formal algorithm, that its fictional time travel is physically possible, or that a five-metric objective captures human welfare. The formalization is an analytical lens.

# VERBINSKI-EXP-001 — Recursive Institutional Feedback

**Status:** runnable toy experiment; hypothesis test, not political forecast.

## Question
Do systems with causally independent error-detection channels recover from introduced decision errors more reliably than otherwise comparable systems whose evaluators share the decision-maker's information/error, or systems with no feedback?

## Conditions
1. **Independent feedback** — evaluator receives a separately noisy measurement of the hidden error.
2. **Correlated feedback** — evaluator is partially coupled to the decision process and systematically under-observes the error.
3. **No feedback** — no corrective sensor.

Each seeded trial injects the same class of hidden decision error. The experimental manipulation is feedback architecture.

## Prespecified metrics
- detection latency
- correction latency
- accumulated damage before/after correction
- false-correction rate
- recovery rate

## Hypothesis
Independent feedback should increase recovery and reduce accumulated damage relative to correlated/no feedback.

## Failure condition
The hypothesis fails if independent feedback shows no reproducible recovery advantage, or reliably increases accumulated damage versus correlated/no feedback.

The code does **not** encode a political party, officeholder, ideology, or desired policy outcome. Real institutions may violate nearly every simplifying assumption here; applying the model to a government is a stress-test analogy, not evidence that the simulation predicts political outcomes.

## Run
```bash
node examples/run-exp-001.js
node --test tests/*.test.js
```

## Interpretation boundary
A positive toy result establishes only that the chosen simulation mechanics reward independent sensing under the specified noise/correction process. It does not establish that a particular real institution is independent, that a particular administration is correct or incorrect, or that the model has external validity. External validation requires operational definitions and empirical data chosen independently of the desired conclusion.

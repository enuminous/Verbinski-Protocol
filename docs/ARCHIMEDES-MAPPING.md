# Archimedes mapping

The film-inspired loop maps cleanly onto a generic branching simulation architecture.

| Narrative mechanic | Simulation analogue |
| --- | --- |
| repeated night / origin | checkpointed initial state |
| select diner patrons | cohort / agent-set selection |
| choose what to do | intervention policy |
| future unfolds | deterministic or stochastic transition function |
| catastrophe | terminal cost / failure condition |
| traveler remembers | memory retained across branch reset |
| retry | restore checkpoint and branch |
| accumulated knowledge | search history / evidence ledger |

In Archimedes terms, the interesting primitive is not time travel. It is **counterfactual replay from a fixed checkpoint with retained search memory**.

A minimal formulation is

`pi_(k+1) = Search(H_k, x0)`

`y_k = Phi_T(x0; pi_k)`

`H_(k+1) = H_k union {(pi_k, y_k, J(y_k))}`

`x_(k+1) = x0`

The software in `src/protocol.js` is deliberately small. It demonstrates the information structure, not a literal model of the film or civilization.

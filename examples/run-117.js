const V = require('../src/protocol.js');
const result = V.search(
  { seed: 'GOOD-LUCK-117' },
  ['teacher','parent','skeptic','organizer','engineer','medic'],
  [
    ['coordinate','verify'],
    ['disconnect','preserve-memory'],
    ['decentralize','coordinate','verify'],
    ['disconnect','coordinate','preserve-memory']
  ],
  117
);
console.log(JSON.stringify({
  attempts: result.attempts,
  bestAttempt: result.best.attempt,
  bestPlan: result.best.plan,
  bestOutcome: result.best.outcome,
  objective: V.explainObjective()
}, null, 2));

const test = require('node:test');
const assert = require('node:assert/strict');
const V = require('../src/protocol.js');

test('same seed and plan are deterministic', () => {
  const a = V.applyPlan(V.createWorld('x'), { cohort:['teacher','parent'], actions:['coordinate','verify'] });
  const b = V.applyPlan(V.createWorld('x'), { cohort:['teacher','parent'], actions:['coordinate','verify'] });
  assert.deepEqual(V.metrics(a), V.metrics(b));
});

test('reset returns physical state to origin while preserving memory', () => {
  const origin = V.createWorld('reset');
  const tried = V.applyPlan(origin, { cohort:['teacher','organizer'], actions:['disconnect','coordinate'] });
  const reset = V.resetFromOrigin(origin, tried);
  assert.equal(reset.survival, origin.survival);
  assert.equal(reset.attempt, 1);
  assert.equal(reset.memory.length, 1);
});

test('search retains 117 evaluated attempts', () => {
  const r = V.search({seed:'117'}, ['teacher','parent','skeptic','organizer','engineer','medic'], [
    ['coordinate','verify'],
    ['disconnect','preserve-memory'],
    ['decentralize','coordinate','verify']
  ], 117);
  assert.equal(r.attempts, 117);
  assert.equal(r.memory.length, 117);
  assert.ok(r.best.outcome.score > -1);
});

test('objective function exposes its normative weights', () => {
  const o = V.explainObjective();
  assert.match(o.warning, /weights/i);
  assert.equal(Object.keys(o.weights).length, 5);
});

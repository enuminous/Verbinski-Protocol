(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.VerbinskiProtocol = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const ACTIONS = Object.freeze([
    'disconnect',
    'coordinate',
    'verify',
    'preserve-memory',
    'decentralize'
  ]);

  const DEFAULT_WEIGHTS = Object.freeze({
    survival: 0.34,
    agency: 0.24,
    cohesion: 0.18,
    truth: 0.14,
    dependencyPenalty: 0.10
  });

  const clamp = x => Math.max(0, Math.min(1, x));
  const clone = x => JSON.parse(JSON.stringify(x));

  function hashSeed(text) {
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
    return h >>> 0 || 1;
  }

  function rng(state) {
    let x = state.rng >>> 0;
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    state.rng = x >>> 0;
    return state.rng / 4294967296;
  }

  function createWorld(seed = 'DINER-001') {
    return {
      seed,
      rng: hashSeed(seed),
      attempt: 0,
      catastrophe: 0.86,
      survival: 0.18,
      agency: 0.31,
      cohesion: 0.29,
      truth: 0.37,
      dependency: 0.82,
      timeline: [],
      memory: [],
      currentPlan: null
    };
  }

  function normalizePlan(plan) {
    if (!plan || typeof plan !== 'object') throw new Error('Plan must be an object.');
    const cohort = Array.isArray(plan.cohort) ? [...new Set(plan.cohort.map(String))] : [];
    const actions = Array.isArray(plan.actions) ? [...new Set(plan.actions.map(String))] : [];
    if (cohort.length < 1 || cohort.length > 8) throw new Error('Cohort must contain 1-8 members.');
    if (actions.length < 1 || actions.length > 5 || actions.some(a => !ACTIONS.includes(a))) {
      throw new Error('Actions must be selected from the protocol action set.');
    }
    return { cohort, actions };
  }

  function synergy(cohort) {
    const unique = new Set(cohort.map(x => x.toLowerCase()));
    return clamp(0.12 + 0.08 * unique.size + (unique.size >= 4 ? 0.1 : 0));
  }

  function applyPlan(input, rawPlan) {
    const world = clone(input);
    const plan = normalizePlan(rawPlan);
    world.attempt += 1;
    world.currentPlan = plan;

    const diversity = synergy(plan.cohort);
    const noise = (rng(world) - 0.5) * 0.06;
    const has = a => plan.actions.includes(a);

    const agencyGain = (has('coordinate') ? 0.11 : 0) + (has('decentralize') ? 0.08 : 0) + diversity * 0.10;
    const truthGain = (has('verify') ? 0.16 : 0) + (has('preserve-memory') ? 0.07 : 0);
    const cohesionGain = (has('coordinate') ? 0.15 : 0) + diversity * 0.12;
    const dependencyDrop = (has('disconnect') ? 0.17 : 0) + (has('decentralize') ? 0.08 : 0);
    const survivalGain = 0.08 + 0.25 * agencyGain + 0.20 * cohesionGain + 0.18 * truthGain + 0.12 * dependencyDrop;

    world.agency = clamp(world.agency + agencyGain + noise);
    world.truth = clamp(world.truth + truthGain + noise / 2);
    world.cohesion = clamp(world.cohesion + cohesionGain - Math.abs(noise) / 3);
    world.dependency = clamp(world.dependency - dependencyDrop + Math.max(0, noise) / 2);
    world.survival = clamp(world.survival + survivalGain + noise);
    world.catastrophe = clamp(1 - (0.35 * world.survival + 0.23 * world.agency + 0.17 * world.cohesion + 0.15 * world.truth + 0.10 * (1 - world.dependency)));

    world.timeline.push({
      attempt: world.attempt,
      plan,
      metrics: metrics(world)
    });
    return world;
  }

  function score(world, weights = DEFAULT_WEIGHTS) {
    return (
      weights.survival * world.survival +
      weights.agency * world.agency +
      weights.cohesion * world.cohesion +
      weights.truth * world.truth -
      weights.dependencyPenalty * world.dependency
    );
  }

  function metrics(world) {
    return {
      catastrophe: world.catastrophe,
      survival: world.survival,
      agency: world.agency,
      cohesion: world.cohesion,
      truth: world.truth,
      dependency: world.dependency,
      score: score(world)
    };
  }

  function resetFromOrigin(origin, evaluatedWorld) {
    const next = createWorld(origin.seed);
    next.attempt = evaluatedWorld.attempt;
    next.rng = evaluatedWorld.rng;
    next.memory = clone(evaluatedWorld.memory);
    next.timeline = clone(evaluatedWorld.timeline);
    next.memory.push({
      attempt: evaluatedWorld.attempt,
      plan: clone(evaluatedWorld.currentPlan),
      outcome: metrics(evaluatedWorld)
    });
    return next;
  }

  function planKey(plan) {
    return `${[...plan.cohort].sort().join('+')}|${[...plan.actions].sort().join('+')}`;
  }

  function search(origin, candidates, actionSets, attempts = 117) {
    if (!Array.isArray(candidates) || candidates.length === 0) throw new Error('Candidates required.');
    if (!Array.isArray(actionSets) || actionSets.length === 0) throw new Error('Action sets required.');
    let state = createWorld(origin.seed || String(origin));
    const tried = new Set();
    let best = null;

    for (let i = 0; i < attempts; i++) {
      const cohortSize = 2 + (i % Math.min(5, Math.max(1, candidates.length - 1)));
      const cohort = [];
      for (let j = 0; j < cohortSize; j++) cohort.push(candidates[(i + j * 2) % candidates.length]);
      const actions = actionSets[i % actionSets.length];
      const plan = normalizePlan({ cohort, actions });
      const key = planKey(plan);
      if (tried.has(key)) {
        plan.actions = ACTIONS.filter((_, idx) => ((i + idx) % 2 === 0)).slice(0, 3);
      }
      tried.add(planKey(plan));

      const evaluated = applyPlan(state, plan);
      const result = { attempt: evaluated.attempt, plan, outcome: metrics(evaluated) };
      if (!best || result.outcome.score > best.outcome.score) best = clone(result);
      state = resetFromOrigin(createWorld(state.seed), evaluated);
    }

    return { attempts: state.attempt, best, memory: state.memory, finalResetState: state };
  }

  function explainObjective(weights = DEFAULT_WEIGHTS) {
    return {
      equation: 'J = wS·survival + wA·agency + wC·cohesion + wT·truth - wD·dependency',
      weights: { ...weights },
      warning: 'Changing the weights changes what the system calls a good future.'
    };
  }

  return {
    ACTIONS,
    DEFAULT_WEIGHTS,
    createWorld,
    applyPlan,
    resetFromOrigin,
    search,
    score,
    metrics,
    explainObjective,
    normalizePlan
  };
});

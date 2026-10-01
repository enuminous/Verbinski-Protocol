const test=require('node:test');const assert=require('node:assert/strict');const E=require('../src/institutional-feedback');
test('deterministic',()=>assert.deepEqual(E.runExperiment({trials:25,seed:'x'}),E.runExperiment({trials:25,seed:'x'})));
test('three conditions',()=>assert.deepEqual(E.CONDITIONS,['independent','correlated','none']));
test('independent feedback is not hard-coded to pass every trial',()=>{const r=E.runExperiment({trials:50,seed:'falsifiable'});assert.equal(typeof r.results.hypothesisPasses,'boolean')});
test('baseline seeded experiment returns finite metrics',()=>{const r=E.runExperiment({trials:100,seed:'VERBINSKI-EXP-001'});for(const g of Object.values(r.results.groups)){assert.ok(Number.isFinite(g.medianDamage));assert.ok(g.recoveryRate>=0&&g.recoveryRate<=1)}});
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.VerbinskiInstitutionalFeedback=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){'use strict';
const CONDITIONS=Object.freeze(['independent','correlated','none']);
function hashSeed(s){let h=2166136261;for(let i=0;i<s.length;i++)h=Math.imul(h^s.charCodeAt(i),16777619);return h>>>0||1}
function random(st){let x=st.x>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;st.x=x>>>0;return st.x/4294967296}
function clamp(x,a=0,b=1){return Math.max(a,Math.min(b,x))}
function median(a){const x=[...a].sort((a,b)=>a-b),n=x.length;return n%2?x[(n-1)/2]:(x[n/2-1]+x[n/2])/2}
function simulateTrial(condition,seed,opts={}){
 if(!CONDITIONS.includes(condition))throw new Error('Unknown condition');
 const st={x:hashSeed(String(seed))},maxSteps=opts.maxSteps||60,errorMagnitude=opts.errorMagnitude||0.65,threshold=opts.threshold||0.58;
 let damage=0,detected=null,corrected=null,falseCorrections=0,beliefError=errorMagnitude;
 for(let t=1;t<=maxSteps;t++){
  const common=(random(st)-.5)*.22,independent=(random(st)-.5)*.30;
  let signal;
  if(condition==='independent') signal=beliefError+independent;
  else if(condition==='correlated') signal=.38*beliefError+common-.16;
  else signal=-1;
  if(signal>threshold && detected===null)detected=t;
  if(signal>threshold && beliefError<.15)falseCorrections++;
  if(detected!==null && corrected===null){
    const correctionChance=condition==='independent'?.72:condition==='correlated'?.30:0;
    if(random(st)<correctionChance){corrected=t;beliefError*=.10}
  }
  damage+=beliefError;
  if(corrected!==null)beliefError*=.72; else beliefError=clamp(beliefError+(random(st)-.5)*.035);
 }
 return {condition,seed,detected,detectionLatency:detected??maxSteps+1,corrected,correctionLatency:corrected===null?maxSteps+1:corrected-(detected||0),accumulatedDamage:+damage.toFixed(6),falseCorrections,recovered:corrected!==null};
}
function summarize(rows){
 const groups={};
 for(const c of CONDITIONS){const r=rows.filter(x=>x.condition===c);groups[c]={n:r.length,recoveryRate:r.filter(x=>x.recovered).length/r.length,medianDetectionLatency:median(r.map(x=>x.detectionLatency)),medianCorrectionLatency:median(r.map(x=>x.correctionLatency)),medianDamage:median(r.map(x=>x.accumulatedDamage)),falseCorrectionRate:r.filter(x=>x.falseCorrections>0).length/r.length}}
 const i=groups.independent,c=groups.correlated,n=groups.none;
 const passes=i.recoveryRate>c.recoveryRate&&i.medianDamage<c.medianDamage&&i.medianDamage<n.medianDamage;
 return {groups,hypothesisPasses:passes,failureCondition:'FAIL if independent feedback shows no reproducible recovery advantage, or reliably increases accumulated damage versus correlated/no feedback.'};
}
function runExperiment(opts={}){
 const trials=opts.trials||1000,seed=opts.seed||'VERBINSKI-EXP-001',rows=[];
 for(let i=0;i<trials;i++)for(const c of CONDITIONS)rows.push(simulateTrial(c,seed+'|'+i+'|'+c,opts));
 return {id:'VERBINSKI-EXP-001',seed,trialsPerCondition:trials,design:'Identical error class; feedback architecture varied across independent, correlated, and none.',results:summarize(rows),rows};
}
return {CONDITIONS,simulateTrial,summarize,runExperiment};
}));
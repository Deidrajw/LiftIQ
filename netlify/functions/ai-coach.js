// Gemini interpretation of already-computed training metrics. No direct write to Hevy.
const {reply,verifyUser}=require('./auth-lib');
const ALLOWED_ACTIONS=new Set(['hold','increase','reduce']);
function cleanText(v,n=250){return String(v??'').replace(/[\u0000-\u001f]/g,' ').slice(0,n);}
function finite(v,min,max){const n=Number(v);return Number.isFinite(n)&&n>=min&&n<=max?n:null;}
function sanitize(input){
  const lifts=Array.isArray(input?.lifts)?input.lifts.slice(0,35):[];
  return {goal:cleanText(input?.goal,150),sessions:finite(input?.sessions,0,10000),avgRPE:finite(input?.avgRPE,0,10),
    period:cleanText(input?.period,70),
    muscles:Object.fromEntries(Object.entries(input?.muscles||{}).slice(0,20).map(([k,v])=>[cleanText(k,60),finite(v,0,30000)])),
    flags:{kneePain:input?.flags?.kneePain===true,ankleIssue:input?.flags?.ankleIssue===true,backTightness:input?.flags?.backTightness===true,lowRecovery:input?.flags?.lowRecovery===true},
    trends:sanitizeTrends(input?.trends),
    lifts:lifts.map(x=>({name:cleanText(x.name,110),weightLb:finite(x.weightLb,0,2000),reps:finite(x.reps,0,200),rpe:finite(x.rpe,0,10),
      sessionsAtWeight:finite(x.sessionsAtWeight,0,1000),e1rmLb:finite(x.e1rmLb,0,3000),ruleAction:cleanText(x.ruleAction,35),ruleTargetLb:finite(x.ruleTargetLb,0,2000)}))};
}
function sanitizeTrends(trends){
 const windows={};const source=trends?.windows||{};
 for(const key of ['7d','28d','84d']){
  const w=source[key]||{};
  const appearances=Object.fromEntries(Object.entries(w.muscleExerciseAppearances||{}).slice(0,12).map(([k,v])=>[cleanText(k,50),finite(v,0,5000)]));
  windows[key]={daysWithWorkouts:finite(w.daysWithWorkouts,0,100),totalSets:finite(w.totalSets,0,20000),avgRPE:finite(w.avgRPE,0,10),muscleExerciseAppearances:appearances};
 }
 const history={};
 for(const [name,records] of Object.entries(source.priorityLiftHistory||{}).slice(0,16)){
  history[cleanText(name,100)]=(Array.isArray(records)?records:[]).slice(-12).map(x=>({date:cleanText(x.date,10),weightLb:finite(x.weightLb,0,2000),reps:finite(x.reps,0,200),e1rmLb:finite(x.e1rmLb,0,3000),rpe:finite(x.rpe,0,10)}));
 }
 return {anchorDate:cleanText(trends?.anchorDate,12),windows,priorityLiftHistory:history,limitation:'Daily best set per exercise, not full intra-session set history; muscle appearances are not set counts.'};
}
function extract(response){return (response?.candidates?.[0]?.content?.parts||[]).map(p=>p.text||'').join('');}
exports.handler=async(event)=>{
 if(event.httpMethod!=='POST')return reply(405,{error:'POST only.'});
 const auth=await verifyUser(event);if(auth.error)return reply(auth.status,{error:auth.error});
 const apiKey=process.env.GEMINI_API_KEY;if(!apiKey)return reply(503,{error:'Set GEMINI_API_KEY in Netlify Environment variables and redeploy.'});
 if((event.body||'').length>32000)return reply(413,{error:'Request too large.'});
 let body;try{body=JSON.parse(event.body||'{}');}catch{return reply(400,{error:'Invalid request.'});}
 if(!['review','question'].includes(body.mode))return reply(400,{error:'Invalid mode.'});
 const data=sanitize(body.training);
 if(!data.lifts.length)return reply(400,{error:'Sync or import Hevy workout data before requesting analysis.'});
 const question=cleanText(body.question,350);
 if(body.mode==='question' && !question.trim())return reply(400,{error:'Enter a question.'});
 const instructions=`You are LiftIQ, a conservative evidence-based strength training analyst. You receive 7/28/84-day summaries and up to 12 dated best-set observations per priority lift, NOT complete sessions. Never invent session comparisons, dates or injury diagnoses. Treat goals and status flags as user-reported. Training numbers and ruleTargets are supplied by deterministic code. Reference exact available lift data and dated history in your rationale. Do not treat exercise appearances as hard-set counts. Distinguish observations from hypotheses. If insufficient data say so. Respect reported knee, back, ankle pain and recovery concerns; do not propose load increases if lowRecovery is true, or unsafe increases while relevant pain is present. Never prescribe pain-provoking exercise. No medical diagnosis. Proposals require user acceptance and must not imply Hevy is changed. Output strict JSON, not markdown. Schema: {"summary":"string", "insights":["string"], "proposals":[{"lift":"exact input lift name", "action":"hold|increase|reduce", "targetLb":number, "reps":integer, "reason":"string", "evidence":"string"}], "answer":"string"}. 0-4 proposals. Propose plausible exercise-level target load adjustments only, generally within 10% of recorded weight, and stay close to deterministic ruleTarget; prefer hold when uncertain. Consider weights in pounds.`;
 const prompt=JSON.stringify({task:body.mode,question:body.mode==='question'?question:undefined,training:data});
 const model=process.env.GEMINI_MODEL||'gemini-2.5-flash';
 if(!/^gemini-[a-zA-Z0-9.-]+$/.test(model))return reply(503,{error:'Invalid Gemini model configuration.'});
 try{
  const res=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{
   method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':apiKey},
   body:JSON.stringify({systemInstruction:{parts:[{text:instructions}]},contents:[{role:'user',parts:[{text:prompt}]}],
     generationConfig:{responseMimeType:'application/json',temperature:0.2,maxOutputTokens:1600}}),signal:AbortSignal.timeout(24000)});
  if(!res.ok){const safe=res.status===429?'Gemini rate limit reached. Try later.':res.status===400?'Gemini rejected this request or model configuration.':res.status===403?'Gemini key does not have access to this model.':'Gemini returned HTTP '+res.status;return reply(502,{error:safe});}
  const raw=await res.json();let result;try{result=JSON.parse(extract(raw));}catch{return reply(502,{error:'Gemini did not return valid JSON. Please retry.'});}
  const reference=new Map(data.lifts.map(x=>[x.name,x]));
  const proposals=(Array.isArray(result.proposals)?result.proposals:[]).slice(0,4).map(p=>{
    const original=reference.get(p.lift), target=finite(p.targetLb,0,2000),reps=finite(p.reps,1,40);
    if(!original||!original.weightLb||target===null||reps===null||!ALLOWED_ACTIONS.has(p.action))return null;
    if(Math.abs(target-original.weightLb)>Math.max(10,original.weightLb*0.10))return null;
    if(p.action==='increase'&&(data.flags.lowRecovery||(data.flags.kneePain&&/squat|lunge/i.test(p.lift))||(data.flags.backTightness&&/deadlift|rdl|extension/i.test(p.lift))))return null;
    if(p.action==='increase'&&target<=original.weightLb)return null;
    if(p.action==='reduce'&&target>=original.weightLb)return null;
    if(p.action==='hold'&&Math.abs(target-original.weightLb)>0.01)return null;
    return {lift:original.name,action:p.action,targetLb:Math.round(target*2)/2,reps:Math.round(reps),reason:cleanText(p.reason,450),evidence:cleanText(p.evidence,350)};
  }).filter(Boolean);
  return reply(200,{summary:cleanText(result.summary,1100),insights:(Array.isArray(result.insights)?result.insights:[]).slice(0,5).map(x=>cleanText(x,450)),proposals,answer:cleanText(result.answer,1700),model});
 }catch(e){return reply(502,{error:e.name==='TimeoutError'?'Gemini request timed out. Try again.':'Gemini connection failed.'});}
};

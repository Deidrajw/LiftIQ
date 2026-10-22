// Gemini interpretation of already-computed training metrics. No direct write to Hevy.
const {reply,verifyUser}=require('./auth-lib');
const ALLOWED_ACTIONS=new Set(['hold','increase','reduce']);
function cleanText(v,n=250){return String(v??'').replace(/[\u0000-\u001f]/g,' ').slice(0,n);}
function finite(v,min,max){const n=Number(v);return Number.isFinite(n)&&n>=min&&n<=max?n:null;}
function sanitize(input){
  const lifts=Array.isArray(input?.lifts)?input.lifts.slice(0,35):[];
  return {goal:cleanText(input?.goal,150),experience:cleanText(input?.experience,30),trainingPreferences:{sessionsPerWeek:finite(input?.trainingPreferences?.sessionsPerWeek,1,7),sessionMinutes:finite(input?.trainingPreferences?.sessionMinutes,20,240),equipment:cleanText(input?.trainingPreferences?.equipment,250),limitations:cleanText(input?.trainingPreferences?.limitations,400),routinePreference:cleanText(input?.trainingPreferences?.routinePreference,250)},cycleSuccessCriteria:Object.fromEntries(Object.entries(input?.cycleSuccessCriteria||{}).slice(0,8).map(([k,v])=>[cleanText(k,12),cleanText(v,400)])),recentWorkoutTitles:(Array.isArray(input?.recentWorkoutTitles)?input.recentWorkoutTitles:[]).slice(0,12).map(x=>({name:cleanText(x?.name,100),date:cleanText(x?.date,10)})),displayUnits:cleanText(input?.displayUnits,8),priorityMode:cleanText(input?.priorityMode,12),activePriorityNames:(Array.isArray(input?.activePriorityNames)?input.activePriorityNames:[]).slice(0,16).map(x=>cleanText(x,110)),priorityAudit:(Array.isArray(input?.priorityAudit)?input.priorityAudit:[]).slice(0,16).map(x=>({name:cleanText(x?.name,110),status:cleanText(x?.status,50),observation:cleanText(x?.observation,260),allTimeTrainingDates:finite(x?.allTimeTrainingDates,0,1000),lastDate:cleanText(x?.lastDate,12),priorityStatus:cleanText(x?.priorityStatus,20),goalProgress:x?.goalProgress?{metric:cleanText(x.goalProgress.metric,15),current:(x.goalProgress.current==null?null:finite(x.goalProgress.current,0,3000)),target:finite(x.goalProgress.target,0,3000),achieved:x.goalProgress.achieved===true,reason:cleanText(x.goalProgress.reason,180)}:null})),discoveredPriorityMovements:(Array.isArray(input?.discoveredPriorityMovements)?input.discoveredPriorityMovements:[]).slice(0,25).map(x=>({name:cleanText(x?.name,110),trainingDates:finite(x?.trainingDates,0,1000),recent84Days:finite(x?.recent84Days,0,100),lastDate:cleanText(x?.lastDate,10),status:cleanText(x?.status,20),goalMatch:x?.goalMatch===true,target:x?.target?{metric:cleanText(x.target.metric,16),baseline:finite(x.target.baseline,0,3000),target:finite(x.target.target,0,3000)}:null,latestBestSets:(Array.isArray(x?.latestBestSets)?x.latestBestSets:[]).slice(-6).map(r=>({date:cleanText(r.date,10),weightLb:finite(r.weightLb,0,2000),reps:finite(r.reps,0,200),e1rmLb:finite(r.e1rmLb,0,3000)}))})),evidenceByLift:sanitizeLiftEvidence(input?.evidenceByLift),sessions:finite(input?.sessions,0,10000),avgRPE:finite(input?.avgRPE,0,10),
    period:cleanText(input?.period,70),
    recordMetrics:input?.recordMetrics?{sessions:finite(input.recordMetrics.sessions,0,10000),strengthSets:finite(input.recordMetrics.strengthSets,0,100000),rpeRecorded:finite(input.recordMetrics.rpeRecorded,0,100000),rpeEligible:finite(input.recordMetrics.rpeEligible,0,100000)}:null,
    cycle:input?.cycle?{label:cleanText(input.cycle.label,20),name:cleanText(input.cycle.name,70),start:cleanText(input.cycle.start,10),end:cleanText(input.cycle.end,10),rpe:cleanText(input.cycle.rpe,25),reps:cleanText(input.cycle.reps,25),week:finite(input.cycle.week,0,52),paused:input.cycle.paused===true}:null,
    muscles:Object.fromEntries(Object.entries(input?.muscles||{}).slice(0,20).map(([k,v])=>[cleanText(k,60),finite(v,0,30000)])),
    flags:{kneePain:input?.flags?.kneePain===true,ankleIssue:input?.flags?.ankleIssue===true,backTightness:input?.flags?.backTightness===true,lowRecovery:input?.flags?.lowRecovery===true},
    trends:sanitizeTrends(input?.trends),
    lifts:lifts.map(x=>({name:cleanText(x.name,110),weightLb:finite(x.weightLb,0,2000),reps:finite(x.reps,0,200),rpe:finite(x.rpe,0,10),
      sessionsAtWeight:finite(x.sessionsAtWeight,0,1000),e1rmLb:finite(x.e1rmLb,0,3000),ruleAction:cleanText(x.existingRuleSuggestion?.action||x.ruleAction,35),ruleTargetLb:finite(x.existingRuleSuggestion?.targetLb??x.ruleTargetLb,0,2000)}))};
}
function sanitizeLiftEvidence(value){
 return (Array.isArray(value)?value:[]).slice(0,12).map(item=>({
  name:cleanText(item?.name,110),classification:cleanText(item?.classification,45),observation:cleanText(item?.observation,260),
  datedSets:(Array.isArray(item?.datedSets)?item.datedSets:[]).slice(-6).map(x=>({
   date:/^\d{4}-\d{2}-\d{2}$/.test(String(x?.date||''))?x.date:null,
   weightLb:finite(x?.weightLb,0,2000),reps:finite(x?.reps,0,200),e1rmLb:finite(x?.e1rmLb,0,3000),rpe:x?.rpe==null?null:finite(x?.rpe,0,10)
  })).filter(x=>x.date&&x.weightLb!=null&&x.reps!=null)
 }));
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
// Retry only transient upstream failures. Never repeat authorization or other 4xx errors.
const RETRYABLE_STATUS=new Set([429,500,502,503,504]);
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function fetchGemini(url,options){
 let res;
 for(let attempt=0;attempt<3;attempt++){
  try{
   res=await fetch(url,{...options,signal:AbortSignal.timeout(14000)});
  }catch(err){
   // Network hiccups and timeouts may be transient; don't retry a programming error.
   if(attempt===2)throw err;
   await delay(650*Math.pow(2,attempt));
   continue;
  }
  if(!RETRYABLE_STATUS.has(res.status)||attempt===2)return res;
  // A retry of the same inference may generate another billable request.
  // Respect provider Retry-After for modest waits, bounded for function runtime.
  const ra=Number(res.headers.get('retry-after'));
  const wait=Number.isFinite(ra)&&ra>0?Math.min(ra*1000,3500):650*Math.pow(2,attempt);
  try{await res.body?.cancel();}catch{}
  await delay(wait);
 }
 return res;
}
exports.handler=async(event)=>{
 if(event.httpMethod!=='POST')return reply(405,{error:'POST only.'});
 const auth=await verifyUser(event);if(auth.error)return reply(auth.status,{error:auth.error});
 const apiKey=process.env.GEMINI_API_KEY;if(!apiKey)return reply(503,{error:'Set GEMINI_API_KEY in Netlify Environment variables and redeploy.'});
 if((event.body||'').length>32000)return reply(413,{error:'Coach context exceeded the 32,000-character request limit. LiftIQ should send a compact training summary; refresh the app after deploying the latest version.'});
 let body;try{body=JSON.parse(event.body||'{}');}catch{return reply(400,{error:'Invalid request.'});}
 if(!['review','question'].includes(body.mode))return reply(400,{error:'Invalid mode.'});
 const data=sanitize(body.training);
 if(!data.lifts.length)return reply(400,{error:'Sync or import Hevy workout data before requesting analysis.'});
 const question=cleanText(body.question,350);
 const conversationContext=(Array.isArray(body.conversationContext)?body.conversationContext:[]).slice(-6).map(x=>({role:x?.role==='assistant'?'assistant':'user',text:cleanText(x?.text,600)}));
 if(body.mode==='question' && !question.trim())return reply(400,{error:'Enter a question.'});
 const instructions=`You are LiftIQ, a conservative evidence-based strength training analyst. You receive a bounded training summary with discoveredPriorityMovements, 7/28/84-day windows, and evidenceByLift containing a few dated qualifying best sets per selected lift, NOT full sessions. Missing evidence may have been omitted to fit the request; do not infer absent activity. When user-approved numerical targets appear in discoveredPriorityMovements, use them only as user-chosen goals, distinguish them from evidence, and avoid claiming an outcome has been achieved unless observed. Treat activePriorityNames and priorityAudit as the CURRENT priority lens for this user, not the original baseline. If priorityMode is augmented, analyze user-selected lifts first while retaining existing baseline movements as secondary context. Consider goals only when priorityStatus is tracked, and avoid interpreting no recent data as a plateau. Give explicitly pinned or tracked movements consideration alongside the rest of training; avoid inventing goals, equating variant weights, session comparisons, dates or injury diagnoses. Distinguish recorded workout count from weighted working-set count and explicitly mention RPE coverage when interpreting effort. Do not infer elevated fatigue from cumulative sessions, arbitrary weekly set thresholds, or hamstring-to-glute volume ratios. If asked about training cycle timing, consider the supplied cycle schedule as context and provide cautious recommendations for staying longer, deloading or shortening, with specific supporting observations and acknowledged limitations; never pretend to have edited a cycle or automatically make a cycle change. Treat goals and status flags as user-reported. Training numbers and ruleTargets are supplied by deterministic code. Reference exact available lift data and evidenceByLift dated history in your rationale. Where useful, explain the difference between rep and estimated-strength progression; estimated 1RM is only a rough proxy. Do not treat exercise appearances as hard-set counts. Distinguish observations from hypotheses. If insufficient data say so. Respect reported knee, back, ankle pain and recovery concerns; do not propose load increases if lowRecovery is true, or unsafe increases while relevant pain is present. Never prescribe pain-provoking exercise. No medical diagnosis. Proposals require user acceptance and must not imply Hevy is changed. Output strict JSON, not markdown. Schema: {"summary":"string", "insights":["string"], "proposals":[{"lift":"exact input lift name", "action":"hold|increase|reduce", "targetLb":number, "reps":integer, "reason":"string", "evidence":"string"}], "answer":"string"}. 0-4 proposals. Propose plausible exercise-level target load adjustments only, generally within 10% of recorded weight, and stay close to deterministic ruleTarget; prefer hold when uncertain. Consider weights in pounds.`;
 const prompt=JSON.stringify({task:body.mode,question:body.mode==='question'?question:undefined,conversationContext:body.mode==='question'?conversationContext:[],training:data});
 const model=process.env.GEMINI_MODEL||'gemini-3.5-flash-lite';
 if(!/^gemini-[a-zA-Z0-9.-]+$/.test(model))return reply(503,{error:'Invalid Gemini model configuration.'});
 try{
  const res=await fetchGemini(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,{
   method:'POST',headers:{'Content-Type':'application/json','x-goog-api-key':apiKey},
   body:JSON.stringify({systemInstruction:{parts:[{text:instructions}]},contents:[{role:'user',parts:[{text:prompt}]}],
     generationConfig:{responseMimeType:'application/json',temperature:0.2,maxOutputTokens:1600}})});
  if(!res.ok){
   // Google may return 404 for an unavailable model, even when the key itself is valid.
   let providerMessage='';
   try{const errorBody=await res.json();providerMessage=cleanText(errorBody?.error?.message,240);}catch{}
   const safe=res.status===429?'Gemini is at its request limit right now. Please wait a minute and try again.':
     res.status===503?'Gemini is temporarily overloaded or unavailable. LiftIQ retried automatically; please try again in a few minutes. Your workout data and approved targets are safe.':
     res.status===502||res.status===504?'Gemini is temporarily having service issues. LiftIQ retried automatically; please try again shortly.':
     res.status===404?`Gemini model ${model} was not found or is unavailable to this API key. Check GEMINI_MODEL in Netlify (or remove it to use the app default).`:
     res.status===400?'Gemini rejected the request or model configuration.':
     res.status===403?'Your Gemini API key cannot access this model.':
     `Gemini returned HTTP ${res.status}.`;
   // Do not return raw provider errors for authentication failures.
   return reply(502,{error:safe+(res.status===404&&providerMessage?' Google: '+providerMessage:'')});
  }
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
 }catch(e){return reply(502,{error:e.name==='TimeoutError'?'Gemini request timed out. Try again.':'Gemini connection failed after retrying. Please try again in a few minutes.'});}
};

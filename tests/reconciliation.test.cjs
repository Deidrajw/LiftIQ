/**
 * LiftIQ V15.7 reconciliation regression suite, source-derived.
 * Run: node --test tests/reconciliation.test.cjs
 * Requires Node 20+, no external packages, no network, and no live user data.
 * Executes functions extracted from the ACTUAL public/index.html under a sandbox.
 * Browser layout, Google OAuth, Hevy API, and Gemini are NOT covered.
 */
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const html=fs.readFileSync(path.join(__dirname,'../public/index.html'),'utf8');
const start=html.indexOf("var LI157_LINKS_KEY=");
const finish=html.indexOf("function liJournalHTML(){",start);
const removeStart=html.indexOf("function liDeleteSession(id){");
const removeFinish=html.indexOf("function liCoach(id,old){",removeStart);
assert(start>=0&&finish>start&&removeStart>=0&&removeFinish>removeStart);
const region=html.slice(start,finish);
const end=region.indexOf("document.addEventListener('click',function(event){");
assert(end>0);
const runtimeSource=region.slice(0,end)+'\n'+html.slice(removeStart,removeFinish);
const KEY_S='liftiq_hevy_session_evidence_v157';
const KEY_L='liftiq_journal_hevy_links_v157';
const KEY_J='liftiq_training_context_v142';
function makeJournal(id,at='2026-10-23T22:00:00Z',name='Glutes & Hamstrings'){
 return {id,at,ended:at,name,events:[{id:id+'e',type:'swap',ex:'Romanian Deadlift (Barbell)',note:'Equipment unavailable'}]};
}
function makeWorkout(id,title='Glutes & Hamstrings',start='2026-10-23T21:30:00Z'){
 return {id,title,start_time:start,exercises:[{title:'Romanian Deadlift (Barbell)'},{title:'Seated Leg Curl'}]};
}
function env(opts={}){
 const saved=opts.saved||new Map(),LI=opts.LI||{history:[],active:null},messages=[];
 const state={cancel:false,failKey:null};
 const localStorage={
  getItem:k=>saved.get(k)||null,
  setItem:(k,v)=>{if(state.failKey===k)throw Error('Storage blocked');saved.set(k,String(v));}
 };
 const context={localStorage,LI,console:{warn(){}},document:{addEventListener(){}},
  parseHevyDate:s=>({dateKey:String(s).slice(0,10)}),
  normalizeExerciseName:s=>String(s||'').trim(),
  liEsc:s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
  confirm:()=>!state.cancel,alert:s=>messages.push(s),renderNextSessionCoach(){},
  liSave:()=>localStorage.setItem(KEY_J,JSON.stringify(LI))
 };
 vm.createContext(context);
 vm.runInContext(runtimeSource,context,{timeout:1500});
 return {ctx:context,LI,saved,messages,state};
}
test('full inline application script parses',()=>{
 const inline=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
 for(const script of inline)assert.doesNotThrow(()=>new vm.Script(script));
});
test('retains unique Hevy workout IDs and distinct exercise names',()=>{
 const t=env(),w=makeWorkout('w1');
 assert.equal(t.ctx.li157CaptureHevy([w,w]),true);
 assert.equal(t.ctx.LI157_SESSIONS.length,1);
 assert.equal(t.ctx.LI157_SESSIONS[0].exercises.length,2);
});
test('never links automatically; two same-day candidates both visible',()=>{
 const j=makeJournal('j'),t=env({LI:{history:[j]}});
 t.ctx.li157CaptureHevy([makeWorkout('w1'),makeWorkout('w2','Upper Body','2026-10-23T23:30:00Z')]);
 assert.equal(t.ctx.li157Candidates(j).length,2);
 assert.equal(Object.keys(t.ctx.LI157_LINKS).length,0);
});
test('offers adjacent day but does not suggest distant workouts',()=>{
 const j=makeJournal('j'),t=env({LI:{history:[j]}});
 t.ctx.li157CaptureHevy([makeWorkout('next','Upper Body','2026-10-24T21:30:00Z')]);
 assert.equal(t.ctx.li157Candidates(j)[0].delta,1);
 assert.equal(t.ctx.li157Candidates(makeJournal('old','2026-08-10T12:00:00Z')).length,0);
});
test('offset-aware session matching compares both timestamps in viewer-local calendar',()=>{
 const j=makeJournal('j','2026-10-24T03:53:00Z'),t=env({LI:{history:[j]}});
 t.ctx.li157CaptureHevy([makeWorkout('w','Glutes & Hamstrings','2026-10-23T23:52:00-04:00')]);
 assert.equal(t.ctx.li157Candidates(j)[0].delta,0);
 assert.ok(t.ctx.li157SessionTime(t.ctx.LI157_SESSIONS[0]));
});
test('explicit confirmation, duplicate prevention and reversible unlink',()=>{
 const j=makeJournal('j'),j2=makeJournal('j2'),t=env({LI:{history:[j,j2]}});
 t.ctx.li157CaptureHevy([makeWorkout('w')]);
 assert.equal(t.ctx.li157Confirm('j','w'),true);
 assert.equal(t.ctx.li157Confirm('j2','w'),false);
 assert.equal(t.ctx.li157Unlink('j'),true);
 assert.equal(t.ctx.li157Confirm('j2','w'),true);
 assert.equal(t.LI.history.length,2);
});
test('cancel confirmation/unlink does not mutate links',()=>{
 const j=makeJournal('j'),t=env({LI:{history:[j]}});
 t.ctx.li157CaptureHevy([makeWorkout('w')]);
 t.state.cancel=true;
 assert.equal(t.ctx.li157Confirm('j','w'),false);
 t.state.cancel=false;t.ctx.li157Confirm('j','w');
 t.state.cancel=true;
 assert.equal(t.ctx.li157Unlink('j'),false);
 assert.equal(t.ctx.LI157_LINKS.j.workoutId,'w');
});
test('cache and confirmed associations survive reinitialization',()=>{
 const j=makeJournal('j'),saved=new Map(),t=env({saved,LI:{history:[j]}});
 t.ctx.li157CaptureHevy([makeWorkout('w')]);t.ctx.li157Confirm('j','w');
 const restored=env({saved,LI:{history:[j]}});
 assert.equal(restored.ctx.LI157_SESSIONS.length,1);
 assert.equal(restored.ctx.LI157_LINKS.j.workoutId,'w');
});
test('corrupted/missing cache gives uncertainty, not invented comparison',()=>{
 const j=makeJournal('j'),saved=new Map([[KEY_S,'{invalid']]),t=env({saved});
 assert.equal(t.ctx.LI157_SESSIONS.length,0);
 assert.match(t.ctx.li157Comparison(j,null),/Re-sync/);
 assert.equal(t.ctx.li157Candidates(j).length,0);
});
test('missing exercise name is not described as a skipped exercise',()=>{
 const j=makeJournal('j'),t=env({LI:{history:[j]}});
 t.ctx.li157CaptureHevy([makeWorkout('w')]);
 const content=t.ctx.li157Comparison({...j,events:[{ex:'Dumbbell Deadlift',type:'swap',note:'Substituted'}]},t.ctx.LI157_SESSIONS[0]);
 assert.match(content,/variation or substitution/);
 assert.match(content,/Missing names do not prove/);
});
test('malformed title/id are escaped in matching markup',()=>{
 const j=makeJournal('j<id>'),t=env({LI:{history:[j]}});
 t.ctx.li157CaptureHevy([makeWorkout('w<id>','<img src=x onerror=1>')]);
 t.ctx.LI157_OPEN=j.id;
 const h=t.ctx.li157ReviewHTML(j);
 assert.doesNotMatch(h,/data-li157-id="j<id>"/);
 assert.match(h,/j&lt;id&gt;/);
 assert.match(h,/&lt;img src=x onerror=1&gt;/);
});
test('storage failure rolls back journal deletion and keeps prior association',()=>{
 const j=makeJournal('j'),saved=new Map(),t=env({saved,LI:{history:[j]}});
 t.ctx.li157CaptureHevy([makeWorkout('w')]);t.ctx.li157Confirm('j','w');
 t.state.failKey=KEY_L;
 t.ctx.liDeleteSession('j');
 assert.equal(t.LI.history.length,1);
 assert.equal(t.ctx.LI157_LINKS.j.workoutId,'w');
 assert.equal(JSON.parse(saved.get(KEY_J)).history.length,1);
});
test('journal storage failure also preserves journal and link',()=>{
 const j=makeJournal('j'),t=env({LI:{history:[j]}});
 t.ctx.li157CaptureHevy([makeWorkout('w')]);t.ctx.li157Confirm('j','w');
 t.state.failKey=KEY_J;t.ctx.liDeleteSession('j');
 assert.equal(t.LI.history.length,1);
 assert.equal(t.ctx.LI157_LINKS.j.workoutId,'w');
});
test('successful journal deletion removes its link, not another journal',()=>{
 const j1=makeJournal('j1'),j2=makeJournal('j2'),t=env({LI:{history:[j1,j2]}});
 t.ctx.li157CaptureHevy([makeWorkout('w1'),makeWorkout('w2','Upper Body')]);
 t.ctx.li157Confirm('j1','w1');t.ctx.li157Confirm('j2','w2');t.ctx.liDeleteSession('j1');
 assert.equal(t.LI.history.length,1);
 assert.equal(t.LI.history[0].id,'j2');
 assert.equal(t.ctx.LI157_LINKS.j1,undefined);
 assert.equal(t.ctx.LI157_LINKS.j2.workoutId,'w2');
});
test('reconciliation source has no Gemini-send or network side effects',()=>{
 assert.doesNotMatch(runtimeSource,/\bfetch\s*\(|XMLHttpRequest|_aiQuestion/);
 assert.match(html,/function liCoach\(/);
});

const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../public/index.html'),'utf8');
const start=html.indexOf('function v10TrendAssessment('),end=html.indexOf('/* V12: Movement family discovery',start);
assert(start>0&&end>start,'Trend evaluator source must exist');
const fnSource=html.slice(start,end);
function assess(sets){
 const context={v10ComparableHistory:()=>sets.map((s,i)=>({date:'2026-10-'+String(i+1).padStart(2,'0'),weightLb:s[0],reps:s[1],e1rmLb:s[2]})),uiLongDate:s=>s};
 vm.createContext(context);
 vm.runInContext(fnSource,context);
 return context.v10TrendAssessment('Fictional Test Exercise',84);
}
test('full frontend inline JavaScript parses',()=>{
 for(const [,code] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))
  if(code.trim())assert.doesNotThrow(()=>new vm.Script(code));
});
test('insufficient history does not claim a progressing trend',()=>{
 const a=assess([[90,8,114],[110,7,136],[110,8,139]]);
 assert.equal(a.status,'Limited evidence');
 assert.match(a.evidence,/4 comparable dates needed/);
});
test('strong consistent estimated strength increase is labeled as estimate',()=>{
 const a=assess([[90,8,114],[90,8,114],[110,7,136],[110,8,139]]);
 assert.equal(a.status,'Est. strength up');
 assert.match(a.evidence,/estimated-strength trend/);
 assert.match(a.evidence,/not a confirmed strength gain/);
});
test('consistent decline is described as estimated strength down',()=>{
 const a=assess([[110,8,139],[110,7,136],[90,8,114],[90,8,114]]);
 assert.equal(a.status,'Est. strength down');
});
test('mixed values do not claim a reliable improvement',()=>{
 const a=assess([[100,8,126],[105,8,130],[101,8,127],[103,8,128]]);
 assert.equal(a.status,'Stable / mixed');
});
test('no dated qualifying entries explains missing evidence',()=>{
 const a=assess([]);
 assert.equal(a.status,'No comparable records');
});
test('trend status requires separate dated results',()=>{
 const a=assess([[100,8,126],[110,8,139]]);
 assert.equal(a.status,'Limited evidence');
});
test('mobile body clearance includes bottom safe area',()=>{
 assert.match(html,/padding-bottom:calc\(168px \+ env\(safe-area-inset-bottom, 0px\)\)/);
});
test('trend labels are explicitly estimated rather than generic progressing',()=>{
 assert.match(html,/Est\. strength up/);
 assert.match(html,/early vs recent median/);
});

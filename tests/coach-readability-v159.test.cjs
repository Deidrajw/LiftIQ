const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync('public/index.html','utf8');
const start=source.indexOf('function li159SectionBody(');
const end=source.indexOf('function liqChatHTML()',start);
assert(start>0&&end>start);
const context={aiSafe:value=>String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))};
vm.createContext(context);vm.runInContext(source.slice(start,end),context);
function render(s){return context.li159CoachHTML(s);}
test('frontend scripts have valid syntax',()=>{for(const [,code] of source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)){if(code.trim())new vm.Script(code);}});
test('typed Coach answer renders Takeaway, recommendation and collapsed evidence',()=>{
 const html=render('Takeaway: Consider an easier session.\nRecommendation:\n- Glute Drive — tentative 330 lb\n- Squat Press — tentative 260 lb\nEvidence: Earlier best sets dated Oct 18.\nLimits: These are not established training targets.');
 assert.match(html,/li159-primary/);
 assert.equal((html.match(/li159-exercise-row/g)||[]).length,2);
 assert.equal((html.match(/<details class="li159-detail"/g)||[]).length,2);
 assert.match(html,/Glute Drive/);
 assert.match(html,/Limits/);
});
test('narrative old conversation stays readable, including escaped markup',()=>{
 const html=render('Prior answer <script>alert(1)</script>');
 assert.match(html,/li159-plain/);
 assert.doesNotMatch(html,/<script>/);
 assert.match(html,/&lt;script&gt;/);
});
test('bullet text is escaped; malicious markup never executes',()=>{
 const html=render('Takeaway: Check training.\nRecommendation:\n- <img src=x onerror=alert(1)>\n- Squat Press');
 assert.match(html,/&lt;img/);
 assert.doesNotMatch(html,/<img/);
});
test('unstructured content and single heading fallback stay intact',()=>{
 assert.match(render('Takeaway: one only'),/li159-plain/);
});
test('renderer does not alter underlying saved chat data or make Gemini calls',()=>{
 const fn=source.slice(start,end);
 assert.doesNotMatch(fn,/localStorage|fetch\(/);
 assert.match(source,/li159CoachHTML\(m\.text\)/);
 assert.match(source,/li159CoachHTML\(_aiResult\.answer\|\|_aiResult\.summary\)/);
});
test('prompt aligns across Cloudflare and Netlify',()=>{
 for(const p of ['functions/api/ai-coach.js','netlify/functions/ai-coach.js']){
  const src=fs.readFileSync(p,'utf8');
  assert.match(src,/For question answers use exactly these labels/);
  assert.match(src,/Do not assume a load change implies a specific RPE/);
 }
});

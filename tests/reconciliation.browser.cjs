/**
 * LiftIQ V15.7.1 actual-application browser smoke tests.
 * Run: npm install --no-save playwright@1.56.1 && npx playwright install chromium
 *      node tests/reconciliation.browser.cjs
 * Launches the actual public/index.html in Chromium with isolated, fictional
 * Hevy sessions and local-only journals. No login, external API or real data.
 */
const assert=require('node:assert/strict');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const {chromium}=require('playwright');
const html=fs.readFileSync(path.join(__dirname,'../public/index.html'));
async function main(){
 const server=http.createServer((req,res)=>{
  if(req.url==='/'||req.url==='/index.html'){
   res.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});res.end(html);
  }else{res.writeHead(404);res.end('Not found')}
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const port=server.address().port;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const errors=[];
 try{
  const context=await browser.newContext({viewport:{width:390,height:780},timezoneId:'America/Toronto'});
  // No external authentication, user API, fonts or network access in the test.
  await context.route('**/*',r=>{
   if(r.request().url().startsWith('http://127.0.0.1:'+port+'/'))return r.continue();
   return r.abort();
  });
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(String(e.message)));
  page.on('dialog',async d=>d.accept());
  await page.goto('http://127.0.0.1:'+port+'/',{waitUntil:'domcontentloaded',timeout:20000});
  assert.match(await page.title(),/V15\.7\.1 QA preview/);
  await page.evaluate(()=>{
   const journal=(id,name,at,ex)=>({id,name,at,ended:at,events:[{id:id+'e',type:'swap',ex,note:'Equipment changed during workout'}]});
   LI.active=null;
   LI.history=[
    journal('j1','Glutes & Hamstrings','2026-10-24T01:45:00Z','Romanian Deadlift (Barbell)'),
    journal('j2','Upper Body','2026-10-24T02:05:00Z','Lat Pulldown')
   ];
   LI157_SESSIONS=[
    {id:'w1',name:'Glutes & Hamstrings',date:'2026-10-24',startedAt:'2026-10-24T01:42:00.000Z',exercises:['Romanian Deadlift (Barbell)','Seated Leg Curl']},
    {id:'w2',name:'Upper Body',date:'2026-10-24',startedAt:'2026-10-24T02:01:00.000Z',exercises:['Lat Pulldown','Chest Press']}
   ];
   LI157_LINKS={};LI157_OPEN='';
   liSave();
   localStorage.setItem(LI157_CACHE_KEY,JSON.stringify(LI157_SESSIONS));
   localStorage.setItem(LI157_LINKS_KEY,'{}');
   renderNextSessionCoach();
  });
  // No journal ever becomes a completed Hevy workout merely by matching.
  assert.equal(await page.locator('.liq-mini-status button').count(),1);
  await page.locator('.liq-mini-status button').click();
  assert.equal(await page.locator('#liqJournalOverlay.open').count(),1);
  await page.locator('#liqJournalContents details > summary').first().click();
  await page.locator('[data-li157-action="toggle"]').first().click();
  assert.equal(await page.locator('[data-li157-action="confirm"]').count(),2);
  const options=await page.locator('[data-li157-journal="j1"] .li157-candidate').allTextContents();
  assert(options.some(x=>x.includes('Glutes & Hamstrings')));
  assert(options.some(x=>x.includes('Upper Body')));
  assert(options.every(x=>x.includes('Same local calendar day')));
  await page.locator('[data-li157-journal="j1"] [data-li157-workout="w1"]').click();
  assert.match(await page.locator('#liqJournalContents').innerText(),/User-confirmed match/i);
  const persisted=await page.evaluate(()=>({
   workoutId:LI157_LINKS.j1?.workoutId,
   journals:LI.history.length,
   sessionCount:LI157_SESSIONS.length,
   stored:JSON.parse(localStorage.getItem(LI157_LINKS_KEY)).j1?.workoutId
  }));
  assert.equal(persisted.workoutId,'w1');
  assert.equal(persisted.journals,2);
  assert.equal(persisted.stored,'w1');
  assert.equal(persisted.sessionCount,2);
  // Check genuine UI output for name-level evidence, not skipped-movement claims.
  assert.match(await page.locator('#liqJournalContents').innerText(),/exercise names/i);
  for(const width of [320,375,390,960]){
   await page.setViewportSize({width,height:780});
   const metrics=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
   assert(metrics.scrollWidth<=metrics.width, 'Horizontal overflow at '+width+': '+JSON.stringify(metrics));
  }
  // Reload app from local-only journal + Hevy cache and verify link survives.
  await page.reload({waitUntil:'domcontentloaded'});
  await page.locator('.liq-mini-status button').click();
  await page.locator('#liqJournalContents details > summary').first().click();
  assert.match(await page.locator('#liqJournalContents').innerText(),/User-confirmed match/i);
  await page.locator('[data-li157-journal="j1"] [data-li157-action="unlink"]').click();
  assert.equal(await page.evaluate(()=>LI157_LINKS.j1),undefined);
  // No Hevy evidence: clear matching UI, no invented workout.
  await page.evaluate(()=>{
   LI157_SESSIONS=[];LI157_OPEN='j1';renderNextSessionCoach();
  });
  assert.match(await page.locator('#liqJournalContents').innerText(),/No workout-level Hevy evidence is stored yet/);
  assert.deepEqual(errors,[],'Unexpected application JavaScript errors: '+errors.join(', '));
  console.log('PASS: Real LiftIQ HTML with fictional data; two same-day candidates, user-confirmed linking, persistence, unlink, no-data UI and 320/375/390/960px widths');
  await context.close();
 }finally{
  await browser.close();await new Promise(resolve=>server.close(resolve));
 }
}
main().catch(err=>{console.error(err);process.exitCode=1});

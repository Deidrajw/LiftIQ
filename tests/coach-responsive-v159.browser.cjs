/* V15.9 fictional-data responsive browser QA. No real auth or API calls. */
const assert=require('node:assert/strict'),http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const {chromium}=require('playwright');
const html=fs.readFileSync(path.join(__dirname,'../public/index.html'));
const demo=fs.readFileSync(path.join(__dirname,'../public/demo-coach-v159.html'));
async function main(){
 const server=http.createServer((req,res)=>{res.writeHead(200,{'Content-Type':'text/html;charset=UTF-8'});res.end(req.url.startsWith('/demo')?demo:html);});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port;
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 try{
  for(const width of [320,375,390,960]){
   const ctx=await browser.newContext({viewport:{width,height:820},timezoneId:'America/Toronto'});
   await ctx.route('**/*',route=>route.request().url().startsWith(base)?route.continue():route.abort());
   const page=await ctx.newPage(),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'/',{waitUntil:'domcontentloaded'});
   await page.evaluate(()=>{
    const pane=document.createElement('div');pane.id='v159-browser-test';document.body.prepend(pane);
    pane.innerHTML='<div class="liq-message assistant"><strong>LiftIQ Coach</strong>'+li159CoachHTML('Takeaway: Consider a lighter deload.\nRecommendation:\n- Glute Drive: example 330 lb\n- Squat Press: example 260 lb\nEvidence: fictional dated records\nLimits: not a real prescription')+'</div>'+liq156Context();
   });
   assert.equal(await page.locator('#v159-browser-test .li159-exercise-row').count(),2);
   assert.equal(await page.locator('#v159-browser-test .li159-detail:not([open])').count(),2);
   assert.equal(await page.locator('#v159-browser-test .li159-why:not([open])').count(),1);
   await page.locator('#v159-browser-test .li159-why summary').click();
   assert.equal(await page.locator('#v159-browser-test .li159-why[open]').count(),1);
   const widths=await page.locator('#v159-browser-test').evaluate(el=>({scroll:el.scrollWidth,client:el.clientWidth}));
   assert(widths.scroll<=widths.client+1,'Coach content overflows at '+width+': '+JSON.stringify(widths));
   assert.deepEqual(errors,[],'page errors at '+width);
   await page.evaluate(()=>{
    document.getElementById('liqJournalOverlay').classList.add('open');
    liqJournalRefresh();
   });
   const journalHeader=await page.locator('.liq-journal-top').boundingBox();
   const closeButton=await page.locator('#liqJournalClose').boundingBox();
   assert(journalHeader&&closeButton,'journal header missing at '+width);
   assert(closeButton.y>=journalHeader.y && closeButton.y+closeButton.height<=journalHeader.y+journalHeader.height+1,'Close clipped at '+width);
   assert(closeButton.height>=44,'Close touch height below 44 at '+width);
   assert(closeButton.x+closeButton.width<=width+1,'Close horizontally clipped at '+width);
   assert.equal(await page.locator('#liqJournalContents .liq-review h4').filter({hasText:'Completed Hevy workouts'}).count(),1);
   await page.locator('#liqJournalClose').click();
   assert.equal(await page.locator('#liqJournalOverlay.open').count(),0);
   await page.evaluate(()=>{LI.active=null;LI.history=[];LI157_SESSIONS=[];STATE.dailyLog={'2026-10-24':{sets:3,ex:{}}};liqJournalOpen();});
   const overlay=page.locator('#liqJournalOverlay');
   assert.equal(await overlay.count(),1);
   assert.equal(await overlay.locator('#liqJournalClose').count(),1);
   const safe=await page.evaluate(()=>{const o=document.getElementById('liqJournalOverlay'),b=document.getElementById('liqJournalClose');const a=b.getBoundingClientRect(),top=o.getBoundingClientRect();return {top:a.top,width:a.width,overlayTop:top.top,innerWidth,scroll:o.scrollWidth,client:o.clientWidth}});
   assert(safe.top>=14,'Journal close clipped at '+width+': '+JSON.stringify(safe));
   assert(safe.width>=44,'Journal close touch target too narrow');
   assert(safe.scroll<=safe.client+1,'Journal overlay overflow '+width);
   assert.equal(await overlay.locator('.liux-hevy-list').count(),1);
   assert.equal(await overlay.locator('.liux-hevy-list:not([open])').count(),1);
   await overlay.locator('#liqJournalClose').click();
   assert.equal(await page.locator('#liqJournalOverlay.open').count(),0);
   // Real existing journal overlay, with fictional local data and no external calls.
   await page.evaluate(()=>{LI.active=null;LI.history=[];if(typeof STATE!=='undefined')STATE.dailyLog={};liqJournalOpen();});
   const close=page.locator('#liqJournalClose');
   assert.equal(await close.isVisible(),true,'journal Close visible at '+width);
   const geo=await close.boundingBox();
   assert(geo&&geo.y>=0&&geo.x>=0&&geo.x+geo.width<=width+1,'journal Close clipped at '+width+': '+JSON.stringify(geo));
   assert(geo.width>=44&&geo.height>=44,'journal Close touch target too small '+width);
   assert.equal(await page.locator('#liqJournalOverlay .liux-ux-header').count(),0);
   assert.equal(await page.locator('#liqJournalOverlay .liq-ux-header').count(),1);
   assert.equal(await page.locator('#liqJournalContents .liux-primary-action').count(),1);
   assert.equal(await page.evaluate(()=>{const x=document.getElementById('liqJournalOverlay');return x.scrollWidth<=x.clientWidth+1}),true,'journal horizontal overflow '+width);
   // Keyboard focus remains contained and returns to the opening control.
   await close.focus();
   await page.keyboard.press('Shift+Tab');
   assert.equal(await page.evaluate(()=>document.getElementById('liqJournalOverlay').contains(document.activeElement)),true,'focus escaped dialog at '+width);
   await page.evaluate(()=>{const outside=document.createElement('button');outside.id='outside-focus-test';outside.textContent='Outside';document.body.append(outside);outside.focus();});
   await page.keyboard.press('Tab');
   assert.equal(await page.evaluate(()=>document.getElementById('liqJournalOverlay').contains(document.activeElement)),true,'escaped focus was not recovered at '+width);
   await close.focus();
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#liqJournalOverlay.open').count(),0,'Escape did not close journal');
   await page.evaluate(()=>{const opener=document.createElement('button');opener.id='journal-qa-opener';opener.textContent='Open journal test';document.body.append(opener);opener.focus();liqJournalOpen();});
   await page.locator('#liqJournalClose').click();
   assert.equal(await page.locator('#liqJournalOverlay.open').count(),0,'journal did not close');
   assert.equal(await page.evaluate(()=>document.activeElement?.id), 'journal-qa-opener','journal focus not restored at '+width);
   if(width===390){
    // Exercise actual Journal data handlers with fictional records on an isolated origin.
    const lifecycle=await page.evaluate(()=>{
     const oldConfirm=window.confirm,oldPrompt=window.prompt;
     window.confirm=()=>true;window.prompt=()=> 'Edited fictional substitution';
     try{
      LI.active=null;LI.history=[];LI157_LINKS={};LI157_SESSIONS=[];
      const hevyBefore=JSON.stringify(STATE.dailyLog||{});
      liStart();
      const journalId=LI.active.id;
      document.getElementById('liType').value='swap';
      document.getElementById('liEx').value='Fictional RDL';
      document.getElementById('liNote').value='Fictional equipment substitution';
      liAdd();
      const added=LI.active.events.length===1&&LI.active.events[0].note==='Fictional equipment substitution';
      const eventId=LI.active.events[0]?.id;
      liEdit(eventId);
      const edited=LI.active.events[0].note==='Edited fictional substitution';
      liDelete(eventId);
      const deleted=LI.active.events.length===0;
      liFinish();
      const finished=LI.active===null&&LI.history[0]?.id===journalId;
      const notHevy=hevyBefore===JSON.stringify(STATE.dailyLog||{});
      const notLinked=LI157_LINKS[journalId]===undefined;
      const persisted=JSON.parse(localStorage.getItem(LI_KEY)||'{}').history?.[0]?.id===journalId;
      liDeleteSession(journalId);
      const removed=!LI.history.some(j=>j.id===journalId);
      return {added,edited,deleted,finished,notHevy,notLinked,persisted,removed};
     }finally{window.confirm=oldConfirm;window.prompt=oldPrompt}
    });
    for(const [name,passed] of Object.entries(lifecycle))assert.equal(passed,true,'Journal lifecycle '+name+' failed');
    assert.deepEqual(errors,[],'Journal lifecycle page errors');
   }
   await page.goto(base+'/demo-coach-v159.html',{waitUntil:'domcontentloaded'});
   assert.match(await page.locator('body').innerText(),/Fictional workouts/);
   assert.equal(await page.locator('details').count(),2);
   assert.equal(await page.locator('details[open]').count(),0);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),true,'demo horizontal overflow '+width);
   assert.deepEqual(errors,[],'demo errors at '+width);
   await ctx.close();
   console.log('PASS responsive width '+width);
  }
 }finally{await browser.close();await new Promise(r=>server.close(r));}
}
main().catch(e=>{console.error(e);process.exitCode=1});

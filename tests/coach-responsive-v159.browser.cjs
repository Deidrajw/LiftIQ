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

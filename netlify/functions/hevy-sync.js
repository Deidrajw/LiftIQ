// Secure, read-only Hevy Pro bridge for a personal Netlify site.
// Configure HEVY_API_KEY and TI_SYNC_SECRET in Netlify Environment Variables.
// Never expose the Hevy API key in index.html or ship a .env file.
const crypto = require('node:crypto');

function matchesSecret(given, expected) {
  if (typeof given !== 'string' || typeof expected !== 'string') return false;
  const a = crypto.createHash('sha256').update(given).digest();
  const b = crypto.createHash('sha256').update(expected).digest();
  return crypto.timingSafeEqual(a,b);
}
const reply = (statusCode,body)=>({
  statusCode, headers:{'Content-Type':'application/json; charset=utf-8',
    'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff'},
  body:JSON.stringify(body)
});
exports.handler=async(event)=>{
  if (event.httpMethod !== 'GET') return reply(405,{error:'Only GET is supported.'});
  const apiKey=process.env.HEVY_API_KEY;
  const expected=process.env.TI_SYNC_SECRET;
  if(!apiKey || !expected || expected.length<24)
    return reply(503,{error:'Netlify secrets not configured. Set HEVY_API_KEY and a 24+ character TI_SYNC_SECRET.'});
  const provided=event.headers['x-ti-sync-secret'] || event.headers['X-Ti-Sync-Secret'] || '';
  if(!matchesSecret(provided,expected))return reply(401,{error:'Invalid sync passphrase.'});
  const page=Number(event.queryStringParameters?.page||1);
  if(!Number.isInteger(page)||page<1||page>250)
    return reply(400,{error:'Invalid workout page.'});
  const url=new URL('https://api.hevyapp.com/v1/workouts');
  url.searchParams.set('page',String(page));
  url.searchParams.set('pageSize','10');
  try {
    const res=await fetch(url,{headers:{'api-key':apiKey,'Accept':'application/json'},
      signal:AbortSignal.timeout(10000)});
    if(!res.ok){
      return reply(res.status===401||res.status===403?502:res.status,{
        error:res.status===401||res.status===403?
          'Hevy rejected the server-side API key. Verify the Hevy Pro developer key.':
          'Hevy returned HTTP '+res.status
      });
    }
    const data=await res.json();
    return reply(200,{
      page:Number(data.page)||page,
      page_count:Number(data.page_count)||1,
      workouts:Array.isArray(data.workouts)?data.workouts:[]
    });
  } catch(err){
    return reply(502,{error:err.name==='TimeoutError'?
      'Hevy request timed out. Try again.':'Hevy could not be reached.'});
  }
};

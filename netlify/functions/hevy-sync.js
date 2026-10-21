// Secure, read-only Hevy Pro bridge for a personal Netlify site.
// Configure HEVY_API_KEY, GOOGLE_CLIENT_ID, ALLOWED_GOOGLE_EMAIL in Netlify.
// Never expose the Hevy API key in index.html or ship a .env file.
const {reply,verifyUser}=require('./auth-lib');
exports.handler=async(event)=>{
  if (event.httpMethod !== 'GET') return reply(405,{error:'Only GET is supported.'});
  const apiKey=process.env.HEVY_API_KEY;
  if(!apiKey) return reply(503,{error:'HEVY_API_KEY is missing from Netlify environment variables.'});
  const user=await verifyUser(event);
  if(user.error)return reply(user.status,{error:user.error});
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

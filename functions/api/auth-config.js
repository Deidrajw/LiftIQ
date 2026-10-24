import {reply} from './_auth.js';
export async function onRequest(context){
 const env=context.env;
 const event={httpMethod:context.request.method,headers:Object.fromEntries(context.request.headers),queryStringParameters:Object.fromEntries(new URL(context.request.url).searchParams),body:context.request.method==='POST'?await context.request.text():''};
 const result=await (async(event)=>{
  if(event.httpMethod!=='GET')return reply(405,{error:'Only GET is supported.'});
  const clientId=env.GOOGLE_CLIENT_ID;
  if(!clientId || !env.ALLOWED_GOOGLE_EMAIL)return reply(503,{error:'Set GOOGLE_CLIENT_ID and ALLOWED_GOOGLE_EMAIL in Cloudflare.'});
  // OAuth client IDs are public identifiers, not secrets.
  return reply(200,{clientId});
})(event);
 return new Response(result.body,{status:result.statusCode,headers:result.headers});
}

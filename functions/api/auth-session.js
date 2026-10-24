import {reply,verifyUser} from '../../cloudflare/auth.js';
export async function onRequest(context){
 const env=context.env;
 const event={httpMethod:context.request.method,headers:Object.fromEntries(context.request.headers),queryStringParameters:Object.fromEntries(new URL(context.request.url).searchParams),body:context.request.method==='POST'?await context.request.text():''};
 const result=await (async(event)=>{
  if(event.httpMethod!=='GET')return reply(405,{error:'Only GET is supported.'});
  const user=await verifyUser(event,env);
  if(user.error)return reply(user.status,{error:user.error});
  return reply(200,{authenticated:true,email:user.email});
})(event);
 return new Response(result.body,{status:result.statusCode,headers:result.headers});
}

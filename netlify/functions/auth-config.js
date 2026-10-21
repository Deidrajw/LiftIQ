const {reply}=require('./auth-lib');
exports.handler=async(event)=>{
  if(event.httpMethod!=='GET')return reply(405,{error:'Only GET is supported.'});
  const clientId=process.env.GOOGLE_CLIENT_ID;
  if(!clientId || !process.env.ALLOWED_GOOGLE_EMAIL)return reply(503,{error:'Set GOOGLE_CLIENT_ID and ALLOWED_GOOGLE_EMAIL in Netlify.'});
  // OAuth client IDs are public identifiers, not secrets.
  return reply(200,{clientId});
};

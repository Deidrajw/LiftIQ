const {reply,verifyUser}=require('./auth-lib');
exports.handler=async(event)=>{
  if(event.httpMethod!=='GET')return reply(405,{error:'Only GET is supported.'});
  const user=await verifyUser(event);
  if(user.error)return reply(user.status,{error:user.error});
  return reply(200,{authenticated:true,email:user.email});
};

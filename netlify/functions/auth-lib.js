// Server-side Google Identity Services token verification and single-user allowlist.
// Never accept an unverified email from the browser.
async function verifyUser(event) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const allowedEmail = (process.env.ALLOWED_GOOGLE_EMAIL || '').trim().toLowerCase();
  if (!clientId || !allowedEmail) return {status:503,error:'Google sign-in is not configured in Netlify. Set GOOGLE_CLIENT_ID and ALLOWED_GOOGLE_EMAIL.'};
  const auth = event.headers.authorization || event.headers.Authorization || '';
  const match = /^Bearer\s+([^\s]+)$/i.exec(auth);
  if (!match || match[1].length > 8192) return {status:401,error:'Please sign in with your Google account.'};
  let response;
  try {
    // Google validates token signature, issuer and expiry; we validate audience and owner below.
    response = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token='+encodeURIComponent(match[1]),
      {signal:AbortSignal.timeout(8000),headers:{Accept:'application/json'}});
  } catch(e) { return {status:503,error:'Google sign-in verification is temporarily unavailable.'}; }
  if (!response.ok) return {status:401,error:'Your Google sign-in expired. Please sign in again.'};
  let profile;
  try { profile=await response.json(); } catch(e) { return {status:502,error:'Google returned an invalid identity response.'}; }
  if (profile.aud !== clientId || !['accounts.google.com','https://accounts.google.com'].includes(profile.iss)
      || profile.email_verified !== 'true' && profile.email_verified !== true
      || String(profile.email||'').toLowerCase() !== allowedEmail) {
    return {status:403,error:'This Google account is not authorized to access Hevy data.'};
  }
  return {email:profile.email};
}
const reply = (statusCode,body)=>({statusCode,headers:{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'},body:JSON.stringify(body)});
module.exports={verifyUser,reply};

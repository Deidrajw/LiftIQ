// Standalone smoke checks; no credentials or actual Hevy/Gemini calls.
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm');
const api=['auth-config','auth-session','hevy-sync','ai-coach'];
for(const name of api){
 const code=fs.readFileSync('functions/api/'+name+'.js','utf8');
 assert.match(code,/export async function onRequest\(context\)/);
 assert.match(code,/context\.env/);
 if(name!=='auth-config')assert.match(code,/verifyUser\(event,env\)/);
 assert.doesNotMatch(code,/process\.env|exports\.handler/);
 new vm.SourceTextModule(code,{identifier:name});
}
const auth=fs.readFileSync('cloudflare/auth.js','utf8');
new vm.SourceTextModule(auth,{identifier:'auth'});
assert.match(auth,/profile\.aud !== clientId/);
assert.match(auth,/profile\.email_verified/);
assert.match(auth,/profile\.email\|\|''\)\.toLowerCase\(\) !== allowedEmail/);
const html=fs.readFileSync('public/index.html','utf8');
assert.match(html,/location\.hostname==='liftiqtrainingtracker\.netlify\.app'/);
assert.match(html,/\/\.netlify\/functions\//);
assert.match(html,/liftIQApiPath\("hevy-sync"\)/);
assert.match(html,/liftIQApiPath\('ai-coach'\)/);
for(const [,code] of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g))if(code.trim())new vm.Script(code);
console.log('Cloudflare route, auth-guard, and frontend syntax smoke checks passed.');

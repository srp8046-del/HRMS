const SUPABASE_URL='https://slsiwqvbdcdcgrkufsln.supabase.co';
const SUPABASE_KEY='sb_publishable_dtWiemrqMQHEXN5SGLGnPw_VGs-ottO';
const SB=window.supabase.createClient(SUPABASE_URL,SUPABASE_KEY);
const $=id=>document.getElementById(id); let profile=null,employees=[],attendance=[],summary={};
const emailFor=u=>{u=String(u||'').trim().toLowerCase();return u==='admin'?'srp8046@gmail.com':(u.includes('@')?u:`${u}@login.leeway.local`)};
const esc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
async function fn(name,body){const {data,error}=await SB.functions.invoke(name,{body});if(error)throw new Error(error.message);if(data?.error)throw new Error(data.error);return data}
function score(s){return ({P:4,LC:3,HD:2,A:1,NP:0}[s||'NP'])}
function statusClass(s){return `<span class="status ${esc(s||'NP')}">${esc(s||'NP')}</span>`}

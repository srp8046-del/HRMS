(function(){
  const sb=window.HRMS_SB;
  function showSession(){document.getElementById('loginView')?.classList.add('hidden');document.getElementById('appView')?.classList.remove('hidden')}
  function showLogin(){document.getElementById('appView')?.classList.add('hidden');document.getElementById('loginView')?.classList.remove('hidden')}
  if(!sb)return;
  window.HRMS_logout=async function(){try{await sb.auth.signOut({scope:'local'});localStorage.removeItem('hrmsDateRange')}finally{showLogin();window.location.reload()}};
  document.addEventListener('DOMContentLoaded',()=>{
    const b=document.getElementById('topLogout');
    if(b){b.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();window.HRMS_logout()};}
    try{
      const r=JSON.parse(localStorage.getItem('hrmsDateRange')||'{}');
      if(r.start==='2026-07-31'&&r.end==='2026-08-30'){localStorage.setItem('hrmsDateRange',JSON.stringify({start:'2026-08-01',end:'2026-08-31'}));}
    }catch{}
    setTimeout(async()=>{try{const {data}=await sb.auth.getSession();if(data.session)showSession()}catch{}},700);
  });
  sb.auth.onAuthStateChange((event,session)=>{if(session&&(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='INITIAL_SESSION'))showSession();if(event==='SIGNED_OUT')showLogin()});
})();
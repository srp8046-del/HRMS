(function(){
  const sb=window.HRMS_SB;
  if(!sb)return;
  document.addEventListener('DOMContentLoaded',()=>{
    const form=document.getElementById('loginForm');
    const user=document.getElementById('username');
    const pass=document.getElementById('password');
    const btn=document.getElementById('loginBtn');
    const err=document.getElementById('loginError');
    if(!form||!user||!pass)return;
    form.addEventListener('submit',async e=>{
      e.preventDefault();
      e.stopImmediatePropagation();
      if(err)err.textContent='';
      if(btn){btn.disabled=true;btn.textContent='Signing in…';}
      try{
        const raw=String(user.value||'').trim().toLowerCase();
        const email=raw==='admin'?'srp8046@gmail.com':(raw.includes('@')?raw:`${raw}@login.leeway.local`);
        const password=String(pass.value||'');
        const {data,error}=await sb.auth.signInWithPassword({email,password});
        if(error)throw error;
        if(!data?.session)throw new Error('Login session could not be created.');
        document.getElementById('loginView')?.classList.add('hidden');
        document.getElementById('appView')?.classList.remove('hidden');
        if(typeof window.boot==='function')await window.boot();
      }catch(ex){
        if(err)err.textContent=ex?.message||'Unable to sign in. Please check username and password.';
      }finally{
        if(btn){btn.disabled=false;btn.textContent='Sign in';}
      }
    },true);
  });
})();

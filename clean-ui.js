(function(){
  'use strict';

  const $=id=>document.getElementById(id);
  const pages={dashboard:'Dashboard',attendance:'Attendance','detailed-attendance':'Detailed Attendance',employees:'Employees',upload:'Data Upload',users:'User Management'};
  let routing=false;

  function safeRender(page){
    if(routing)return;
    routing=true;
    try{
      const title=$('pageTitle');
      if(title)title.textContent=pages[page]||'Dashboard';
      document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
      if(page!=='upload'){
        const f=$('dateFilter');
        if(f)f.innerHTML=(typeof dateFilter==='function'&&rangeStart&&rangeEnd)?dateFilter():'';
      }else{
        const f=$('dateFilter');
        if(f)f.innerHTML='';
      }
      if(page==='dashboard'){
        Promise.resolve(typeof loadData==='function'?loadData():{}).then(r=>dashboard(r)).catch(showError);
      }else if(page==='attendance'){
        attendancePage().catch(showError);
      }else if(page==='detailed-attendance'){
        detailedPage().catch(showError);
      }else if(page==='employees'){
        employeesPage().catch(showError);
      }else if(page==='upload'){
        uploadPage();
        guardUploadControls();
      }else if(page==='users'){
        if(typeof usersPage==='function')usersPage().catch(showError);else shell('User Management','ADMIN','User administration', '<div class="notice">User Management is available to administrators.</div>');
      }
      history.replaceState({page},'',location.pathname+'#'+page);
    }catch(e){showError(e)}
    finally{setTimeout(()=>{routing=false},0)}
  }

  function showError(e){
    const c=$('content');
    if(c)c.innerHTML='<div class="notice"><strong>Unable to load this section.</strong><br>'+String(e?.message||e||'Unknown error').replace(/[<>]/g,'')+'</div>';
  }

  function guardUploadControls(){
    ['empFile','bioFile','tosFile'].forEach(id=>{
      const el=$(id); if(!el)return;
      el.addEventListener('click',e=>e.stopPropagation());
      el.addEventListener('change',e=>e.stopPropagation());
    });
    document.querySelectorAll('.upload-btn').forEach(btn=>{
      btn.addEventListener('click',e=>e.stopPropagation());
    });
  }

  function install(){
    const nav=$('nav');
    if(!nav)return;
    nav.addEventListener('click',function(e){
      const b=e.target.closest('.nav-item');
      if(!b)return;
      e.preventDefault();
      e.stopImmediatePropagation();
      const page=b.dataset.page;
      if(page)safeRender(page);
    },true);

    document.addEventListener('click',function(e){
      const control=e.target.closest('input,select,textarea,button,a,label');
      if(control && (control.closest('#content')||control.closest('#dateFilter'))){
        if(control.closest('.upload-card')||control.closest('#applyDateRange')||control.closest('#latestMonth')||control.closest('.toolbar'))e.stopPropagation();
      }
    },true);

    const apply=()=>{
      const s=$('hrmsStartDate'),en=$('hrmsEndDate');
      if(!s||!en)return;
      if(!s.value||!en.value||s.value>en.value){alert('Please select a valid date range.');return;}
      rangeStart=s.value;rangeEnd=en.value;
      localStorage.setItem('hrmsDateRange',JSON.stringify({start:rangeStart,end:rangeEnd}));
      const active=document.querySelector('.nav-item.active')?.dataset.page||'dashboard';
      safeRender(active);
    };
    document.addEventListener('click',e=>{
      if(e.target.closest('#applyDateRange')){e.preventDefault();e.stopImmediatePropagation();apply();}
      if(e.target.closest('#latestMonth')){e.preventDefault();e.stopImmediatePropagation();latestRange().then(()=>safeRender(document.querySelector('.nav-item.active')?.dataset.page||'dashboard')).catch(showError);}
    },true);

    window.addEventListener('popstate',()=>safeRender(location.hash.slice(1)||'dashboard'));

    // Replace the old navigation state once authentication has made the app visible.
    const observer=new MutationObserver(()=>{
      const app=$('appView');
      if(app&&!app.classList.contains('hidden')){
        const page=location.hash.slice(1);
        if(page&&pages[page])safeRender(page);
        observer.disconnect();
      }
    });
    observer.observe(document.body,{subtree:true,attributes:true,attributeFilter:['class']});
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();

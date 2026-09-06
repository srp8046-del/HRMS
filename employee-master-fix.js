(function(){
  const escV=v=>String(v??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  function fmtDate(v){if(!v)return '—';const s=String(v);const m=s.match(/^(\d{4})-(\d{2})-(\d{2})$/);if(!m)return s;const d=new Date(`${s}T00:00:00`);return d.toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'2-digit'}).replace(/ /g,'-');}
  function table(rows){return rows.length?`<div class="table-wrap"><table class="table"><thead><tr><th>Employee ID</th><th>OLM ID</th><th>Employee Name</th><th>Designation</th><th>Supervisor Name</th><th>Supervisor Employee ID</th><th>Process</th><th>Date of Joining</th><th>Shift</th></tr></thead><tbody>${rows.map(e=>`<tr><td>${escV(e.employee_code)}</td><td>${escV(e.olm_id||'—')}</td><td><strong>${escV(e.employee_name)}</strong></td><td>${escV(e.designation||'—')}</td><td>${escV(e.supervisor_name||'—')}</td><td>${escV(e.supervisor_employee_id||'—')}</td><td>${escV(e.process||'—')}</td><td>${escV(fmtDate(e.date_of_joining))}</td><td>${escV(e.shift||'—')}</td></tr>`).join('')}</tbody></table></div>`:'<div class="notice">No employee master uploaded yet.</div>'}
  async function refresh(){
    const content=document.getElementById('content');
    if(!content)return;
    const title=document.getElementById('pageTitle');
    if(!title || title.textContent!=='Employees')return;
    if(content.dataset.employeeMasterFixed==='1')return;
    const h3=content.querySelector('h3');
    if(!h3 || h3.textContent.trim()!=='Employee Master')return;
    content.dataset.employeeMasterFixed='1';
    try{
      const sb=window.HRMS_SB;
      const {data,error}=await sb.from('hrms_employee_master').select('employee_code,olm_id,employee_name,designation,supervisor_name,supervisor_employee_id,process,date_of_joining,shift').order('employee_code');
      if(error)throw error;
      h3.closest('.hero').nextElementSibling?.remove();
      const hero=h3.closest('.hero');
      hero.querySelector('.muted').textContent='Employee Master · 9-column standard format.';
      hero.insertAdjacentHTML('afterend',table(data||[]));
    }catch(e){content.dataset.employeeMasterFixed='';console.error('Employee Master fix:',e);}
  }
  window.employeesPage=function(){return `<div class="hero"><div><div class="eyebrow">PEOPLE</div><h3>Employee Master</h3><div class="muted">Employee Master · 9-column standard format.</div></div></div>`};
  const obs=new MutationObserver(()=>refresh());
  function start(){const c=document.getElementById('content');if(c)obs.observe(c,{childList:true,subtree:true});refresh();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();

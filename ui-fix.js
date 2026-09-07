(function(){
  const esc=v=>String(v??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const sb=window.HRMS_SB;
  function removeDashboardTable(){const title=[...document.querySelectorAll('.section-title')].find(x=>x.textContent.trim()==='Workforce');if(title)title.closest('.section')?.remove()}
  async function renderEmployees(){if(!sb)return;const c=document.getElementById('content');if(!c)return;const q=await sb.from('hrms_employee_master').select('employee_code,olm_id,employee_name,designation,supervisor_name,supervisor_employee_id,process,date_of_joining,shift').eq('active',true).order('employee_code');if(q.error){c.innerHTML=`<div class="error">Unable to load Employee Master: ${esc(q.error.message)}</div>`;return}const rows=q.data||[];const cols=[['employee_code','Employee ID'],['olm_id','OLM ID'],['employee_name','Employee Name'],['designation','Designation'],['supervisor_name','Supervisor Name'],['supervisor_employee_id','Supervisor Employee ID'],['process','Process'],['date_of_joining','Date of Joining'],['shift','Shift']];c.innerHTML=`<div class="hero"><div><div class="eyebrow">PEOPLE</div><h3>Employee Master</h3><div class="muted">New Employee Master format · ${rows.length} records</div></div></div><div class="table-wrap employee-master-wrap"><table class="table employee-master-table"><thead><tr>${cols.map(x=>`<th>${x[1]}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(e=>`<tr>${cols.map(x=>`<td>${esc(e[x[0]]||'—')}</td>`).join('')}</tr>`).join(''):'<tr><td colspan="9">No Employee Master records found.</td></tr>'}</tbody></table></div>`}
  function activePage(){return document.querySelector('.nav-item.active')?.dataset.page||''}
  function patch(){const p=activePage();if(p==='dashboard')removeDashboardTable();if(p==='employees')renderEmployees()}

  // Own the navigation click in capture phase. This prevents the old bubble-phase
  // handler in app.js from receiving the same tap and accidentally rendering Dashboard.
  document.addEventListener('click',e=>{
    const n=e.target.closest('.nav-item[data-page]');
    if(!n)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    const p=n.dataset.page;
    document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b===n));
    if(p==='detailed-attendance'){
      const title=document.getElementById('pageTitle');
      if(title)title.textContent='Detailed Attendance';
      setTimeout(()=>{document.dispatchEvent(new CustomEvent('hrms:attendance-refresh'));},0);
    }else if(typeof window.render==='function'){
      window.render(p);
    }
    setTimeout(patch,120);
  },true);

  new MutationObserver(()=>{if(activePage()==='dashboard')removeDashboardTable()}).observe(document.getElementById('content')||document.body,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',()=>setTimeout(patch,150));
})();

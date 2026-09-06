(function(){
  const esc=v=>String(v??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  const sb=window.HRMS_SB;
  function removeDashboardTable(){
    const title=[...document.querySelectorAll('.section-title')].find(x=>x.textContent.trim()==='Workforce');
    if(title)title.closest('.section')?.remove();
  }
  async function renderEmployees(){
    if(!sb)return;const c=document.getElementById('content');if(!c)return;
    const q=await sb.from('hrms_employee_master').select('*').order('employee_code');
    if(q.error){c.innerHTML=`<div class="error">Unable to load Employee Master: ${esc(q.error.message)}</div>`;return}
    const rows=q.data||[];
    const cols=[['employee_code','Employee ID'],['employee_name','Employee Name'],['designation','Designation'],['circle','Circle'],['revised_area','Revised Area'],['manager_employee_code','Process Supervisor'],['team_leader_employee_code','TL'],['bio_id','BIO ID'],['tos_id','TOS / OLM ID'],['shift_in','Shift In'],['active','Active'],['updated_at','Last Updated']];
    c.innerHTML=`<div class="hero"><div><div class="eyebrow">PEOPLE</div><h3>Employee Master</h3><div class="muted">Complete Employee Master data · ${rows.length} records</div></div></div><div class="table-wrap" style="overflow:auto"><table class="table" style="min-width:1450px"><thead><tr>${cols.map(x=>`<th>${x[1]}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(e=>`<tr>${cols.map(x=>{let v=e[x[0]];if(x[0]==='active')v=v?'Active':'Inactive';if(x[0]==='updated_at'&&v)v=new Date(v).toLocaleString('en-IN');return `<td>${esc(v||'—')}</td>`}).join('')}</tr>`).join(''):'<tr><td colspan="12">No Employee Master records found.</td></tr>'}</tbody></table></div>`;
  }
  function activePage(){return document.querySelector('.nav-item.active')?.dataset.page||''}
  function patch(){const p=activePage();if(p==='dashboard')removeDashboardTable();if(p==='employees')renderEmployees()}
  window.addEventListener('click',e=>{const n=e.target.closest('.nav-item[data-page="employees"]');if(n){setTimeout(patch,30)}},true);
  window.addEventListener('click',e=>{if(e.target.closest('.nav-item[data-page="dashboard"]'))setTimeout(patch,30)},true);
  new MutationObserver(()=>{if(activePage()==='dashboard')removeDashboardTable()}).observe(document.getElementById('content')||document.body,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',()=>setTimeout(patch,100));
})();

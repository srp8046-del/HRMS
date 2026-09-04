/* HRMS User Management UI — admin-controlled hierarchy */
(function(){
  const hEsc=v=>String(v??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const roleLabel=r=>({admin:'Admin',manager:'Manager',team_leader:'Team Leader',tele_sales_executive:'Tele Sales Executive',viewer:'MIS / Viewer',uploader:'Uploader'}[r]||r);
  const usersState={rows:[]};
  window.usersPage=function(){return `<div class="hero"><div><div class="eyebrow">ADMINISTRATION</div><h3>User Management</h3><div class="muted">Admin creates users and manually assigns Employee ID, Manager and Team Leader.</div></div></div>
  <div class="card"><div class="section-title">Create User</div><div class="toolbar user-form">
  <input id="uUsername" placeholder="Username" autocomplete="off"><input id="uEmail" type="email" placeholder="Login email"><input id="uPassword" type="password" placeholder="Temporary password (min 6)">
  <input id="uName" placeholder="Employee name"><input id="uEmployeeCode" placeholder="Employee ID (e.g. LEE001 / TTA001)">
  <input id="uDesignation" placeholder="Designation"><select id="uRole"><option value="viewer">MIS / Viewer</option><option value="uploader">Uploader</option><option value="manager">Manager</option><option value="team_leader">Team Leader</option><option value="tele_sales_executive">Tele Sales Executive</option><option value="admin">Admin</option></select>
  <input id="uManager" placeholder="Manager Employee ID"><input id="uTeamLeader" placeholder="Team Leader Employee ID">
  <label class="check"><input id="uViewAll" type="checkbox"> View all</label><label class="check"><input id="uCanUpload" type="checkbox"> Upload access</label>
  <button id="createUser" class="primary">Create User</button></div><div id="userFormResult" class="section"></div></div>
  <div class="section"><div class="section-title">Existing Users</div><div class="toolbar"><input id="userSearch" placeholder="Search username, employee ID, manager or TL"></div><div id="usersList" class="table-wrap"></div></div>`};
  window.bindUsers=async function(){
    const result=$('userFormResult');
    $('createUser').onclick=async()=>{try{
      const username=$('uUsername').value.trim(), email=$('uEmail').value.trim(), password=$('uPassword').value, display_name=$('uName').value.trim(), employee_code=$('uEmployeeCode').value.trim().toUpperCase(), designation=$('uDesignation').value.trim(), role=$('uRole').value, manager_employee_code=$('uManager').value.trim().toUpperCase(), team_leader_employee_code=$('uTeamLeader').value.trim().toUpperCase();
      if(!username||!email||!password||!display_name){throw Error('Username, email, password and employee name are required.')} if(password.length<6)throw Error('Password must be at least 6 characters.');
      $('createUser').disabled=true;$('createUser').textContent='Creating…';
      const r=await fn('hrms-admin',{action:'create',username,email,password,display_name,employee_code,designation,role,manager_employee_code,team_leader_employee_code,can_view_all:$('uViewAll').checked,can_upload:$('uCanUpload').checked});
      result.innerHTML=`<div class="notice">User <strong>${hEsc(username)}</strong> created successfully.</div>`;
      ['uUsername','uEmail','uPassword','uName','uEmployeeCode','uDesignation','uManager','uTeamLeader'].forEach(id=>$(id).value='');$('uRole').value='viewer';$('uViewAll').checked=false;$('uCanUpload').checked=false;await loadUsers();
    }catch(e){result.innerHTML=`<div class="error">${hEsc(e.message||'Unable to create user.')}</div>`}finally{$('createUser').disabled=false;$('createUser').textContent='Create User'}};
    $('userSearch').oninput=()=>renderUsers($('userSearch').value);
    await loadUsers();
  };
  async function loadUsers(){try{const r=await fn('hrms-admin',{action:'list'});usersState.rows=r.data||[];renderUsers('')}catch(e){$('usersList').innerHTML=`<div class="error">${hEsc(e.message)}</div>`}}
  function renderUsers(q){const needle=(q||'').toLowerCase();const rows=usersState.rows.filter(u=>JSON.stringify(u).toLowerCase().includes(needle));$('usersList').innerHTML=`<table class="table"><thead><tr><th>User</th><th>Employee ID</th><th>Role</th><th>Manager</th><th>Team Leader</th><th>Status</th></tr></thead><tbody>${rows.length?rows.map(u=>`<tr><td><strong>${hEsc(u.display_name||u.username)}</strong><small class="muted">${hEsc(u.username)}</small></td><td>${hEsc(u.employee_code||'—')}</td><td>${hEsc(roleLabel(u.role))}</td><td>${hEsc(u.manager_employee_code||'—')}</td><td>${hEsc(u.team_leader_employee_code||'—')}</td><td>${u.active?'Active':'Inactive'}</td></tr>`).join(''):'<tr><td colspan="6">No users found.</td></tr>'}</tbody></table>`}
})();

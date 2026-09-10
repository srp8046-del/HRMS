(function(){
  const stop=e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()};
  const esc=v=>String(v??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]));
  function file(id){return document.getElementById(id)?.files?.[0]||null}
  async function run(btn){
    const type=btn.dataset.type, f=file(btn.dataset.file), out=document.getElementById('uploadResult');
    if(!f){if(out)out.innerHTML='<div class="error">Please select a file first.</div>';return}
    btn.disabled=true; const old=btn.textContent; btn.textContent='Uploading…';
    try{
      if(typeof window.readUpload!=='function'||typeof window.fn!=='function')throw Error('Upload service is not ready. Refresh the page once.');
      const rows=await window.readUpload(f,type); if(!rows.length)throw Error('No usable data rows found.');
      if(type==='employees'){
        const expected=['Employee ID','OLM ID','Employee Name','Designation','Supervisor Name','Supervisor Employee ID','Process','Date of Joining','Shift'];
        const keys=Object.keys(rows[0]).map(x=>x.trim());
        if(keys.length!==expected.length||expected.some((x,i)=>keys[i]!==x))throw Error('Invalid Employee Master format. Only the new 9-column format is allowed: Employee ID, OLM ID, Employee Name, Designation, Supervisor Name, Supervisor Employee ID, Process, Date of Joining, Shift.');
      }
      const r=await window.fn('hrms-upload',{type,rows,source_file:f.name});
      if(out)out.innerHTML=`<div class="notice"><strong>${esc(type.toUpperCase())} uploaded.</strong> Accepted: ${r.accepted??r.inserted??0} · Skipped: ${r.skipped??0} · Finalized: ${r.finalized??0}</div>`;
      if(typeof window.loadData==='function')await window.loadData();
    }catch(e){if(out)out.innerHTML=`<div class="error">${esc(e.message||'Upload failed.')}</div>`}
    finally{btn.disabled=false;btn.textContent=old}
  }
  document.addEventListener('change',e=>{if(e.target?.matches?.('#empFile,#bioFile,#tosFile'))stop(e)},true);
  document.addEventListener('click',e=>{const b=e.target?.closest?.('.upload-btn');if(!b)return;stop(e);run(b)},true);
})();

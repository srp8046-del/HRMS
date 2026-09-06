(function(){
  const stop=e=>{e.preventDefault();e.stopPropagation();e.stopImmediatePropagation()};
  function fileForInput(id){return document.getElementById(id)?.files?.[0]||null}
  async function upload(btn){
    const type=btn.dataset.type;
    const file=fileForInput(btn.dataset.file);
    if(!file){alert('Please select a file first.');return}
    const result=$('uploadResult');
    btn.disabled=true;
    const old=btn.textContent;
    btn.textContent='Uploading…';
    try{
      if(typeof readUpload!=='function'||typeof fn!=='function')throw new Error('Upload module is not ready. Please refresh once.');
      const rows=await readUpload(file,type);
      if(!rows.length)throw new Error('No usable data rows found');
      const r=await fn('hrms-upload',{type,rows,source_file:file.name});
      if(result)result.innerHTML=`<div class="notice"><strong>${esc(type.toUpperCase())} uploaded.</strong> Accepted: ${r.accepted??r.inserted??0} · Skipped: ${r.skipped??0} · Finalized: ${r.finalized??0}</div>`;
      if(typeof loadData==='function')await loadData();
    }catch(e){
      if(result)result.innerHTML=`<div class="error">${esc(e.message||'Upload failed.')}</div>`;
    }finally{
      btn.disabled=false;
      btn.textContent=old;
    }
  }
  window.addEventListener('change',e=>{
    if(e.target?.matches?.('#empFile,#bioFile,#tosFile'))stop(e);
  },true);
  window.addEventListener('click',e=>{
    const btn=e.target?.closest?.('.upload-btn');
    if(!btn)return;
    stop(e);
    upload(btn);
  },true);
})();

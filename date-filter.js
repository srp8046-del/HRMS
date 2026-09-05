(function(){
  const KEY='hrmsDateRange';
  const saved=JSON.parse(localStorage.getItem(KEY)||'null')||{};
  const pad=n=>String(n).padStart(2,'0');
  const today=new Date();
  const defaultEnd=`${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
  const defaultStart=`${today.getFullYear()}-${pad(today.getMonth()+1)}-01`;
  let start=saved.start||defaultStart,end=saved.end||defaultEnd;
  function build(){
    const host=document.getElementById('dateFilter'); if(!host)return;
    host.innerHTML=`<div class="date-filter-inner"><span class="date-filter-label">DATE RANGE</span><label>Start <input id="hrmsStartDate" type="date" value="${start}"></label><label>End <input id="hrmsEndDate" type="date" value="${end}"></label><button id="applyDateRange" class="primary">Apply</button><button id="clearDateRange" class="ghost">Current Month</button></div>`;
    document.getElementById('applyDateRange').onclick=async()=>{const s=document.getElementById('hrmsStartDate').value,e=document.getElementById('hrmsEndDate').value;if(!s||!e||s>e){alert('Please select a valid Start and End date.');return}start=s;end=e;localStorage.setItem(KEY,JSON.stringify({start,end}));await refresh()};
    document.getElementById('clearDateRange').onclick=async()=>{const d=new Date();start=`${d.getFullYear()}-${pad(d.getMonth()+1)}-01`;end=`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;localStorage.setItem(KEY,JSON.stringify({start,end}));build();await refresh()};
  }
  async function refresh(){try{await window.loadData();if(typeof window.render==='function')window.render('dashboard')}catch(e){console.error(e)}}
  const wait=setInterval(()=>{if(window.SB&&document.getElementById('dateFilter')){clearInterval(wait);const original=window.SB.functions.invoke.bind(window.SB.functions);window.SB.functions.invoke=async(name,opts={})=>{if(name==='hrms-dashboard'){const body=Object.assign({},opts.body||{}, {start_date:start,end_date:end});opts=Object.assign({},opts,{body})}return original(name,opts)};build();refresh()}},100);
})();
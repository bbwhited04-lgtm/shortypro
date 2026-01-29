(function(){
  const cfg = window.SHORTYPRO || {};
  const $ = (s,r=document)=>r.querySelector(s);

  const input = $("#spUploadInput");
  const bar = $("#spUploadBar");
  const pct = $("#spUploadPct");
  const fileName = $("#spUploadName");

  const pillUpload=document.getElementById("spStageUpload");
  const pillAuto=document.getElementById("spStageAuto");
  const pillCaptions=document.getElementById("spStageCaptions");
  const pillExport=document.getElementById("spStageExport");

  function setProgress(v){
    if(bar) bar.style.width=`${v}%`;
    if(pct) pct.textContent=`${v}%`;
  }
  function setPill(el,state){
    if(!el) return;
    const m={queued:["Queued","bg-slate-100 text-slate-700"],processing:["Processing","bg-amber-50 text-amber-700"],done:["Done","bg-emerald-50 text-emerald-700"]}[state];
    if(!m) return;
    el.textContent=m[0];
    el.className=`rounded-full px-2.5 py-1 text-xs font-semibold ${m[1]}`;
  }
  function updatePipeline(d){
    setPill(pillUpload,"done");
    setPill(pillAuto,"queued"); setPill(pillCaptions,"queued"); setPill(pillExport,"queued");
    if(d.status==="complete"){ setPill(pillAuto,"done"); setPill(pillCaptions,"done"); setPill(pillExport,"done"); return; }
    if(d.stage==="auto_clips") setPill(pillAuto,"processing");
    if(d.stage==="captions"){ setPill(pillAuto,"done"); setPill(pillCaptions,"processing"); }
    if(d.stage==="export"){ setPill(pillAuto,"done"); setPill(pillCaptions,"done"); setPill(pillExport,"processing"); }
  }
  async function pollStatus(id){
    let last=0;
    while(true){
      const r=await fetch(`${cfg.apiBase}/uploads/${encodeURIComponent(id)}`);
      const d=await r.json().catch(()=>null);
      if(!r.ok||!d){ window.ShortyProToast?.("Status error","danger"); return; }
      if(typeof d.progress==="number"){ last=Math.max(last,Math.min(100,d.progress)); setProgress(last); }
      updatePipeline(d);
      if(d.status==="complete"){ setProgress(100); window.ShortyProToast?.("Upload processed!","success"); return; }
      if(d.status==="error"){ window.ShortyProToast?.(d.message||"Processing error","danger"); return; }
      await new Promise(r=>setTimeout(r,1500));
    }
  }
  input?.addEventListener("change",async()=>{
    const f=input.files?.[0]; if(!f) return;
    fileName.textContent=f.name; setProgress(2);
    try{
      const fd=new FormData(); fd.append("file",f);
      const r=await fetch(`${cfg.apiBase}/uploads`,{method:"POST",body:fd});
      const d=await r.json().catch(()=>null);
      if(!r.ok||!d?.upload_id){ window.ShortyProToast?.("Upload failed","danger"); setProgress(0); return; }
      await pollStatus(d.upload_id);
    }catch(e){ console.error(e); window.ShortyProToast?.("Network error","danger"); setProgress(0); }
  });
})();
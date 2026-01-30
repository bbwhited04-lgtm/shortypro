// Dashboard page behavior (vanilla JS, no dependencies).
(function(){
  const cfg = window.SHORTYPRO || {};
  const $ = (s,r=document)=>r.querySelector(s);

  const toast = (msg, type="info") => {
    if (window.ShortyProToast) window.ShortyProToast(msg, type);
    else alert(msg);
  };

  // Upload UI (works with backend if /api/uploads exists; otherwise stays demo-friendly)
  const input = $("#spUploadInput");
  const bar = $("#spUploadBar");
  const pct = $("#spUploadPct");
  const fileName = $("#spUploadName");

  // pipeline pills (optional; if present in HTML)
  const pillUpload   = document.getElementById("spStageUpload");
  const pillAuto     = document.getElementById("spStageAuto");
  const pillCaptions = document.getElementById("spStageCaptions");
  const pillExport   = document.getElementById("spStageExport");

  function setProgress(v){
    if(bar) bar.style.width = `${v}%`;
    if(pct) pct.textContent = `${v}%`;
  }

  function setPill(el, state){
    if(!el) return;
    const m = {
      queued:     ["Queued",     "bg-slate-100 text-slate-700"],
      processing: ["Processing", "bg-amber-50 text-amber-700"],
      done:       ["Done",       "bg-emerald-50 text-emerald-700"],
    }[state];
    if(!m) return;
    el.textContent = m[0];
    el.className = `rounded-full px-2.5 py-1 text-xs font-semibold ${m[1]}`;
  }

  function updatePipeline(d){
    if(!pillUpload && !pillAuto && !pillCaptions && !pillExport) return;

    setPill(pillUpload, "done");
    setPill(pillAuto, "queued");
    setPill(pillCaptions, "queued");
    setPill(pillExport, "queued");

    if(d?.status === "complete"){
      setPill(pillAuto, "done");
      setPill(pillCaptions, "done");
      setPill(pillExport, "done");
      return;
    }
    if(d?.stage === "auto_clips") setPill(pillAuto, "processing");
    if(d?.stage === "captions"){
      setPill(pillAuto, "done");
      setPill(pillCaptions, "processing");
    }
    if(d?.stage === "export"){
      setPill(pillAuto, "done");
      setPill(pillCaptions, "done");
      setPill(pillExport, "processing");
    }
  }

  async function pollStatus(uploadId){
    while(true){
      const r = await fetch(`${cfg.apiBase || ""}/uploads/${encodeURIComponent(uploadId)}`);
      const d = await r.json().catch(()=>null);

      if(!r.ok || !d){
        toast(d?.error || d?.message || `Status error (${r.status})`, "danger");
        return;
      }

      if(typeof d.progress === "number") setProgress(Math.min(100, d.progress));
      updatePipeline(d);

      if(d.status === "complete"){
        setProgress(100);
        toast("Upload processed!", "success");
        return;
      }
      if(d.status === "error"){
        toast(d.message || "Processing error", "danger");
        return;
      }

      await new Promise(res=>setTimeout(res, 1500));
    }
  }

  input?.addEventListener("change", async ()=>{
    const f = input.files?.[0];
    if(!f) return;

    if(fileName) fileName.textContent = f.name;
    setProgress(2);

    try{
      const fd = new FormData();
      fd.append("file", f);

      toast("Uploading…", "info");

      const r = await fetch(`${cfg.apiBase || ""}/uploads`, { method: "POST", body: fd });
      const d = await r.json().catch(()=>null);

      if(!r.ok || !d?.upload_id){
        toast(d?.error || d?.message || `Upload failed (${r.status})`, "danger");
        setProgress(0);
        return;
      }

      await pollStatus(d.upload_id);
    }catch(e){
      console.error(e);
      toast("Network error during upload.", "danger");
      setProgress(0);
    }
  });

  // Demo-only: add a row to schedule
  $("#spQuickSchedule")?.addEventListener("click", ()=>{
    const scheduleList = $("#spScheduleList");
    const now = new Date();
    const when = new Date(now.getTime()+ 2*60*60*1000);
    const label = when.toLocaleString([], {weekday:"short", month:"short", day:"numeric", hour:"numeric", minute:"2-digit"});
    const li = document.createElement("li");
    li.className = "flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-3 py-2";
    li.innerHTML = `<div class="min-w-0">
      <div class="truncate text-sm font-semibold">New post</div>
      <div class="text-xs text-slate-500">${label} · TikTok + IG Reels</div>
    </div>
    <button class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-slate-50">Edit</button>`;
    scheduleList?.prepend(li);
    toast("Added a scheduled item (demo). Wire this to your backend schedule endpoint.", "info");
  });

  $("#spRefresh")?.addEventListener("click", ()=>{
    toast("Refreshed (demo). Next step: load shorts from your backend.", "info");
  });

  // --- Billing: Stripe Customer Portal ---
  async function spOpenBillingPortal(){
    const email = prompt("Enter the billing email you used at checkout:");
    if(!email) return;

    const r = await fetch("/api/billing/portal", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ email })
    });
    const d = await r.json().catch(()=>null);

    if(!r.ok || !d?.ok || !d?.url){
      toast(d?.error || `Could not open billing portal (${r.status})`, "danger");
      return;
    }
    window.location.href = d.url;
  }

  // --- Billing: Stripe Checkout ---
  async function spCheckout(plan){
    const email = prompt("Enter the billing email you want to use:");
    if(!email) return;

    const r = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify({ plan, email })
    });
    const d = await r.json().catch(()=>null);

    if(!r.ok || !d?.ok || !d?.url){
      toast(d?.error || `Checkout failed (${r.status})`, "danger");
      return;
    }
    window.location.href = d.url;
  }

  // Expose for onclick buttons
  window.spOpenBillingPortal = spOpenBillingPortal;
  window.spCheckout = spCheckout;
})();
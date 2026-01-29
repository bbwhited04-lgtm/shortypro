// Dashboard page behavior (vanilla JS, no dependencies).
(function(){
  const cfg = window.SHORTYPRO || {};
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>Array.from(r.querySelectorAll(s));

  // Demo-only: fake upload progress
  const input = $("#spUploadInput");
  const bar = $("#spUploadBar");
  const pct = $("#spUploadPct");
  const fileName = $("#spUploadName");

  function setProgress(v){
    if(!bar || !pct) return;
    bar.style.width = `${v}%`;
    pct.textContent = `${v}%`;
  }

  input?.addEventListener("change", ()=>{
    const f = input.files?.[0];
    if(!f) return;
    fileName.textContent = f.name;
    setProgress(0);
    window.ShortyProToast?.("Upload queued (demo UI). Connect backend to enable real uploads.", "info");
    let v = 0;
    const t = setInterval(()=>{
      v += Math.floor(Math.random()*10)+6;
      if(v>=100){ v=100; clearInterval(t); window.ShortyProToast?.("Upload complete (demo). Now generate shorts.", "success"); }
      setProgress(v);
    }, 220);
  });

  // Demo-only: add a row to schedule
  const addBtn = $("#spQuickSchedule");
  const scheduleList = $("#spScheduleList");
  addBtn?.addEventListener("click", ()=>{
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
    window.ShortyProToast?.("Added a scheduled item (demo). Wire this to your backend schedule endpoint.", "info");
  });

  // Demo-only: refresh
  $("#spRefresh")?.addEventListener("click", ()=>{
    window.ShortyProToast?.("Refreshed (demo). Next step: load shorts from your backend.", "info");
  });
})();
(function(){
  const cfg = window.SHORTYPRO || {};
  const $ = (s,r=document)=>r.querySelector(s);

  const input = $("#spUploadInput");
  const bar = $("#spUploadBar");
  const pct = $("#spUploadPct");
  const fileName = $("#spUploadName");

  function setProgress(v){
    if(bar) bar.style.width = `${v}%`;
    if(pct) pct.textContent = `${v}%`;
  }

  // OPTIONAL: map backend stage -> UI labels if you want to update badges later
  const stageWeight = { upload: 10, auto_clips: 40, captions: 70, export: 90 };

  async function pollStatus(uploadId){
    let lastProgress = 0;

    while(true){
      const res = await fetch(`${cfg.apiBase}/uploads/${encodeURIComponent(uploadId)}`, {
        method: "GET",
        headers: { "Accept": "application/json" },
        credentials: "include",
      });

      if(!res.ok){
        window.ShortyProToast?.(`Status check failed (${res.status}).`, "danger");
        return;
      }

      const data = await res.json();

      if(typeof data.progress === "number"){
        lastProgress = Math.max(lastProgress, Math.min(100, data.progress));
        setProgress(lastProgress);
      } else if (data.stage && stageWeight[data.stage] != null) {
        // if backend doesn't send progress, approximate by stage
        setProgress(Math.max(lastProgress, stageWeight[data.stage]));
      }

      if(data.status === "complete"){
        setProgress(100);
        window.ShortyProToast?.("Upload processed! Shorts are ready to load.", "success");
        return;
      }

      if(data.status === "error"){
        window.ShortyProToast?.(data.message || "Processing error.", "danger");
        return;
      }

      // keep polling
      await new Promise(r => setTimeout(r, 1500));
    }
  }

  input?.addEventListener("change", async ()=>{
    const f = input.files?.[0];
    if(!f) return;

    fileName.textContent = f.name;
    setProgress(1);

    try{
      const fd = new FormData();
      fd.append("file", f);

      window.ShortyProToast?.("Uploading…", "info");

      const res = await fetch(`${cfg.apiBase}/uploads`, {
        method: "POST",
        body: fd,
        credentials: "include",
      });

      if(!res.ok){
        window.ShortyProToast?.(`Upload failed (${res.status}).`, "danger");
        setProgress(0);
        return;
      }

      const data = await res.json();
      if(!data.upload_id){
        window.ShortyProToast?.("Upload response missing upload_id.", "danger");
        setProgress(0);
        return;
      }

      window.ShortyProToast?.(`Uploaded. Processing started (ID: ${data.upload_id}).`, "success");
      await pollStatus(data.upload_id);

    } catch(err){
      console.error(err);
      window.ShortyProToast?.("Network error during upload.", "danger");
      setProgress(0);
    }
  });
})();
(function(){
  const cfg = window.SHORTYPRO || {};
  const $ = (s,r=document)=>r.querySelector(s);

  const input = $("#spUploadInput");
  const bar = $("#spUploadBar");
  const pct = $("#spUploadPct");
  const fileName = $("#spUploadName");

  function setProgress(v){
    if(bar) bar.style.width = `${v}%`;
    if(pct) pct.textContent = `${v}%`;
  }

  async function pollStatus(uploadId){
    while(true){
      const res = await fetch(`${cfg.apiBase}/uploads/${encodeURIComponent(uploadId)}`, {
        method: "GET",
        headers: { "Accept": "application/json" }
      });

      const data = await res.json().catch(()=>null);
      if(!res.ok || !data){
        window.ShortyProToast?.(`Status error (${res.status}).`, "danger");
        return;
      }

      if(typeof data.progress === "number") setProgress(Math.min(100, data.progress));

      if(data.status === "complete"){
        setProgress(100);
        window.ShortyProToast?.("Upload processed! Shorts will appear next.", "success");
        return;
      }

      if(data.status === "error"){
        window.ShortyProToast?.(data.message || "Processing error.", "danger");
        return;
      }

      await new Promise(r => setTimeout(r, 1500));
    }
  }

  input?.addEventListener("change", async ()=>{
    const f = input.files?.[0];
    if(!f) return;

    fileName.textContent = f.name;
    setProgress(2);

    try{
      const fd = new FormData();
      fd.append("file", f);

      window.ShortyProToast?.("Uploading…", "info");

      const res = await fetch(`${cfg.apiBase}/uploads`, {
        method: "POST",
        body: fd
      });

      const data = await res.json().catch(()=>null);
      if(!res.ok || !data?.upload_id){
        window.ShortyProToast?.(`Upload failed (${res.status}).`, "danger");
        setProgress(0);
        return;
      }

      window.ShortyProToast?.(`Uploaded. Processing started.`, "success");
      await pollStatus(data.upload_id);

    } catch(e){
      console.error(e);
      window.ShortyProToast?.("Network error during upload.", "danger");
      setProgress(0);
    }
  });
})();

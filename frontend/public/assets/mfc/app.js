// Lightweight UX helpers + form submit (no deps)
(function(){
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));

  function toast(title, detail){
    let t = $("#toast");
    if(!t){
      t = document.createElement("div");
      t.id = "toast";
      t.className = "toast";
      document.body.appendChild(t);
    }
    t.innerHTML = `<div><b>${escapeHtml(title)}</b></div>${detail?`<div class="muted">${escapeHtml(detail)}</div>`:""}`;
    t.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(()=>t.classList.remove("show"), 2600);
  }

  function escapeHtml(str){
    return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  async function postJSON(url, data){
    const res = await fetch(url, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(data)
    });
    let out = null;
    try { out = await res.json(); } catch {}
    if(!res.ok){
      const msg = out?.error || `Request failed (${res.status})`;
      throw new Error(msg);
    }
    return out;
  }

  // Generic form handler: looks for data-submit-endpoint
  $$(".js-lead-form").forEach(form=>{
    form.addEventListener("submit", async (e)=>{
      e.preventDefault();
      const endpoint = form.getAttribute("data-submit-endpoint") || "";
      const fd = new FormData(form);
      const payload = Object.fromEntries(fd.entries());

      // Always store locally (so user never loses progress)
      const key = form.getAttribute("data-storage-key") || "lead";
      try { localStorage.setItem(key, JSON.stringify({ ...payload, ts: Date.now() })); } catch {}

      // If no endpoint configured, just show success
      if(!endpoint || endpoint === "CHANGE_ME"){
        toast("Saved!", "Wire an endpoint later (README shows how).");
        form.reset();
        return;
      }

      try{
        await postJSON(endpoint, payload);
        toast("Submitted!", "We’ll reach out shortly.");
        form.reset();
      }catch(err){
        toast("Couldn’t submit", err.message || "Try again.");
      }
    });
  });

  // Quiz engine: expects #quiz with data-storage-key and optional data-submit-endpoint
  const quizEl = $("#quiz");
  if(quizEl){
    const storageKey = quizEl.getAttribute("data-storage-key") || "mfc_quiz";
    const endpoint = quizEl.getAttribute("data-submit-endpoint") || "CHANGE_ME";
    const state = { step: 0, answers: {}, startedAt: Date.now() };
    const steps = JSON.parse(quizEl.getAttribute("data-steps") || "[]");

    // Load prior progress if any
    try{
      const saved = localStorage.getItem(storageKey);
      if(saved){
        const parsed = JSON.parse(saved);
        if(parsed && parsed.answers) Object.assign(state, parsed);
      }
    }catch{}

    const progressFill = $("#progressFill");
    const qNum = $("#qNum");
    const qTitle = $("#qTitle");
    const choices = $("#choices");
    const backBtn = $("#backBtn");
    const skipBtn = $("#skipBtn");

    function save(){
      try{ localStorage.setItem(storageKey, JSON.stringify(state)); }catch{}
    }

    function render(){
      const total = steps.length;
      const idx = Math.max(0, Math.min(state.step, total-1));
      const s = steps[idx];
      const pct = Math.round(((idx) / total) * 100);
      if(progressFill) progressFill.style.width = `${pct}%`;
      if(qNum) qNum.textContent = `Question ${idx+1} of ${total}`;
      if(qTitle) qTitle.textContent = s.q || "Question";
      if(choices){
        choices.innerHTML = "";
        (s.choices || []).forEach(ch=>{
          const div = document.createElement("div");
          div.className = "choice";
          div.innerHTML = `
            <div class="left">
              <div class="emoji">${ch.emoji || "✨"}</div>
              <div>
                <div><b>${escapeHtml(ch.label || "")}</b></div>
                ${ch.hint ? `<div class="small">${escapeHtml(ch.hint)}</div>` : ""}
              </div>
            </div>
            <div class="tag">${escapeHtml(ch.tag || "Select")}</div>
          `;
          div.addEventListener("click", ()=> selectChoice(ch.value ?? ch.label));
          choices.appendChild(div);
        });
      }
      if(backBtn) backBtn.disabled = idx === 0;
      save();
    }

    async function finish(){
      // ensure 100%
      if(progressFill) progressFill.style.width = "100%";
      save();

      const payload = {
        ...state.answers,
        meta: {
          startedAt: state.startedAt,
          finishedAt: Date.now(),
          userAgent: navigator.userAgent
        }
      };

      // Show capture form
      $("#quizStage").style.display = "none";
      $("#captureStage").style.display = "block";
      // attach answers preview
      const pre = $("#answerPreview");
      if(pre){
        pre.textContent = JSON.stringify(state.answers, null, 2);
      }

      // If endpoint wired, we will submit after email capture (in form handler)
      // But we store payload for easy access
      try{ localStorage.setItem(storageKey + "_payload", JSON.stringify(payload)); }catch{}
      toast("Almost done", "Enter your email to get your build plan.");
    }

    function selectChoice(val){
      const s = steps[state.step];
      state.answers[s.key || `q${state.step+1}`] = val;
      state.step += 1;
      if(state.step >= steps.length){
        finish();
      }else{
        render();
      }
    }

    if(backBtn){
      backBtn.addEventListener("click", ()=>{
        state.step = Math.max(0, state.step - 1);
        render();
      });
    }
    if(skipBtn){
      skipBtn.addEventListener("click", ()=>{
        const s = steps[state.step];
        state.answers[s.key || `q${state.step+1}`] = state.answers[s.key || `q${state.step+1}`] ?? "Skipped";
        state.step += 1;
        if(state.step >= steps.length) finish();
        else render();
      });
    }

    // When capture form submits, merge quiz payload into submission
    const captureForm = $("#captureForm");
    if(captureForm){
      captureForm.addEventListener("submit", async (e)=>{
        e.preventDefault();
        const endpoint2 = captureForm.getAttribute("data-submit-endpoint") || endpoint;
        const fd = new FormData(captureForm);
        const email = String(fd.get("email") || "").trim();
        const name = String(fd.get("name") || "").trim();

        let payload = {};
        try{ payload = JSON.parse(localStorage.getItem(storageKey + "_payload") || "{}"); }catch{}
        payload.email = email;
        payload.name = name;

        // Always store locally
        try{ localStorage.setItem(storageKey + "_final", JSON.stringify(payload)); }catch{}

        if(!endpoint2 || endpoint2 === "CHANGE_ME"){
          toast("Saved!", "Wire an endpoint later (README).");
          $("#captureStage").style.display = "none";
          $("#doneStage").style.display = "block";
          return;
        }

        try{
          await postJSON(endpoint2, payload);
          toast("Submitted!", "We’ll email you shortly.");
          $("#captureStage").style.display = "none";
          $("#doneStage").style.display = "block";
        }catch(err){
          toast("Couldn’t submit", err.message || "Try again.");
        }
      });
    }

    render();
  }
})();
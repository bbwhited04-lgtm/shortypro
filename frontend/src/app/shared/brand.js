/* ShortyPro shared brand behavior (vanilla JS).
   - Sidebar toggle
   - Active nav highlighting
   - Toast helper
*/
(function(){
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  // Sidebar toggle (mobile)
  const sidebar = $("#spSidebar");
  const overlay = $("#spOverlay");
  const openBtn = $("#spOpenSidebar");
  const closeBtn = $("#spCloseSidebar");

  function openSidebar(){
    if(!sidebar) return;
    sidebar.classList.remove("-translate-x-full");
    overlay?.classList.remove("hidden");
    document.body.classList.add("overflow-hidden");
  }
  function closeSidebar(){
    if(!sidebar) return;
    sidebar.classList.add("-translate-x-full");
    overlay?.classList.add("hidden");
    document.body.classList.remove("overflow-hidden");
  }
  openBtn?.addEventListener("click", openSidebar);
  closeBtn?.addEventListener("click", closeSidebar);
  overlay?.addEventListener("click", closeSidebar);

  // Active nav highlighting (hash + path)
  const navLinks = $$("[data-sp-nav]");
  function setActive(){
    const hash = location.hash || "#overview";
    navLinks.forEach(a=>{
      const target = a.getAttribute("href") || "";
      const isHash = target.startsWith("#") && target === hash;
      const isPath = !target.startsWith("#") && location.pathname.endsWith(target);
      const isActive = isHash || isPath;
      a.classList.toggle("bg-slate-900", isActive);
      a.classList.toggle("text-white", isActive);
      a.classList.toggle("hover:bg-slate-50", !isActive);
      a.classList.toggle("text-slate-700", !isActive);
    });
  }
  window.addEventListener("hashchange", setActive);
  setActive();

  // Simple toast
  window.ShortyProToast = function(message, kind="info"){
    const host = $("#spToasts");
    if(!host) return alert(message);
    const el = document.createElement("div");
    const tone = {
      info: "border-slate-200 bg-white",
      success: "border-emerald-200 bg-emerald-50",
      warning: "border-amber-200 bg-amber-50",
      danger: "border-rose-200 bg-rose-50",
    }[kind] || "border-slate-200 bg-white";
    el.className = `pointer-events-auto sp-card border ${tone} px-4 py-3 text-sm shadow-sm`;
    el.innerHTML = `<div class="flex items-start gap-3">
      <div class="mt-0.5 h-2.5 w-2.5 rounded-full bg-slate-900"></div>
      <div class="flex-1">${String(message)}</div>
      <button class="text-slate-500 hover:text-slate-900" aria-label="Dismiss">✕</button>
    </div>`;
    el.querySelector("button")?.addEventListener("click", ()=>el.remove());
    host.appendChild(el);
    setTimeout(()=>{ el.classList.add("opacity-0"); setTimeout(()=>el.remove(), 250); }, 3800);
  };
})();
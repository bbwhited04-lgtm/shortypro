
/**
 * ShortyPro Backend (static demo)
 * - No proprietary assets
 * - Feature gating via plan in localStorage (demo only).
 * Replace getUserPlan() + setUserPlan() to call your real backend.
 */
(function(){
  const PLAN_FEATURES = {
    free: ["dashboard"],
    creator: ["dashboard","video_creation"],
    growth: ["dashboard","video_creation","calendar","integrations","funnels"],
    pro: ["dashboard","video_creation","calendar","integrations","funnels","analytics","listening","cases","team"]
  };

  function getUserPlan(){
    return (localStorage.getItem("sp_plan") || "free").toLowerCase();
  }
  function setUserPlan(plan){
    localStorage.setItem("sp_plan", plan);
  }
  function featureAllowed(feature){
    const plan=getUserPlan();
    const allow = PLAN_FEATURES[plan] || PLAN_FEATURES.free;
    return allow.includes(feature);
  }
  function pageFeature(){
    const el=document.querySelector("[data-feature]");
    return el ? el.getAttribute("data-feature") : "dashboard";
  }

  // wire plan pill
  function updatePlanPill(){
    const plan=getUserPlan();
    document.querySelectorAll("[data-plan-pill]").forEach(n=>{
      n.textContent = plan.toUpperCase();
    });
  }

  // paywall modal
  function showPaywall(feature){
    const overlay=document.getElementById("paywallOverlay");
    if(!overlay) return;
    overlay.style.display="flex";
    overlay.querySelector("[data-locked-feature]").textContent = feature.replaceAll("_"," ");
  }
  function hidePaywall(){
    const overlay=document.getElementById("paywallOverlay");
    if(!overlay) return;
    overlay.style.display="none";
  }

  // attach handlers
  window.ShortyProAdmin = { getUserPlan, setUserPlan, featureAllowed, showPaywall, hidePaywall };

  document.addEventListener("click", (e)=>{
    const btn = e.target.closest("[data-set-plan]");
    if(btn){
      setUserPlan(btn.getAttribute("data-set-plan"));
      updatePlanPill();
      hidePaywall();
    }
    const close = e.target.closest("[data-close-paywall]");
    if(close) hidePaywall();
  });

  // gate current page
  document.addEventListener("DOMContentLoaded", ()=>{
    updatePlanPill();
    const feature = pageFeature();
    if(!featureAllowed(feature)){
      showPaywall(feature);
    }
    // highlight active nav
    const path = (location.pathname.split("/").pop() || "dashboard.html").toLowerCase();
    document.querySelectorAll(".nav a").forEach(a=>{
      const href=(a.getAttribute("href")||"").toLowerCase();
      if(href.endsWith(path)) a.classList.add("active");
    });
  });
})();

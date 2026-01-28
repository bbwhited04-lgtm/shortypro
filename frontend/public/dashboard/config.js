// ShortyPro dashboard config (edit me)
// Open-source, no proprietary dependencies.
window.SHORTYPRO_CONFIG = {
  company: { name: "ShortyPro", corp: "DEAD APP CORP", supportEmail: "billy@deadapp.info" },
  pricing: {
    starter: { label: "Starter", price: "$19/mo", stripePaymentLink: "PASTE_STRIPE_PAYMENT_LINK_STARTER" },
    pro:     { label: "Pro",     price: "$49/mo", stripePaymentLink: "PASTE_STRIPE_PAYMENT_LINK_PRO" },
    business:{ label: "Business",price: "$99/mo", stripePaymentLink: "PASTE_STRIPE_PAYMENT_LINK_BUSINESS" }
  },
  // Optional backend endpoints (if you have them). If not set, buttons fall back to Stripe payment links above.
  api: {
    createCheckoutSession: "/api/stripe/create-checkout-session",  // expects POST { plan: "starter|pro|business" } -> { url }
    customerPortal: "/api/stripe/create-portal-session"            // expects POST {} -> { url }
  }
};

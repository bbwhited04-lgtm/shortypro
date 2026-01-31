export type ProviderId =
  | "facebook"
  | "instagram"
  | "facebook_pages"
  | "facebook_groups"
  | "threads"
  | "x"
  | "linkedin"
  | "tiktok"
  | "google_analytics"
  | "bing_webmaster"
  | "google_business"
  | "canva"
  | "bynder"
  | "bitly"
  | "slack"
  | "google_drive"
  | "dropbox"
  | "tableau"
  | "marketo"
  | "woocommerce"
  | "shopify"
  | "facebook_shop"
  | "salesforce"
  | "hubspot"
  | "zendesk"
  | "alignable";

export type ProviderCategory =
  | "Social"
  | "Analytics"
  | "Storage"
  | "Commerce"
  | "CRM"
  | "Support"
  | "Marketing"
  | "Utilities"
  | "Design";

export type Provider = {
  id: ProviderId;
  name: string;
  category: ProviderCategory;
  description: string;
  // set to true when we’ve implemented real OAuth start/callback for that provider
  oauthReady: boolean;
  // UI-only: optional icon path you put under /public/integrations/*
  icon?: string;
};

export const PROVIDERS: Provider[] = [
  // SOCIAL
  { id: "facebook", name: "Facebook", category: "Social", oauthReady: false, icon: "/integrations/facebook.svg",
    description: "Connect Facebook profiles for publishing and insights." },
  { id: "instagram", name: "Instagram", category: "Social", oauthReady: false, icon: "/integrations/instagram.svg",
    description: "Publish and measure Instagram performance." },
  { id: "facebook_pages", name: "Facebook Pages", category: "Social", oauthReady: false, icon: "/integrations/facebook.svg",
    description: "Connect managed Pages for scheduling and posting." },
  { id: "facebook_groups", name: "Facebook Groups", category: "Social", oauthReady: false, icon: "/integrations/facebook.svg",
    description: "Connect Groups for posting workflows (where allowed)." },
  { id: "threads", name: "Threads", category: "Social", oauthReady: false, icon: "/integrations/threads.svg",
    description: "Connect Threads for publishing and engagement workflows." },
  { id: "x", name: "X", category: "Social", oauthReady: false, icon: "/integrations/x.svg",
    description: "Connect X for posting and analytics (OAuth-based)." },
  { id: "linkedin", name: "LinkedIn", category: "Social", oauthReady: false, icon: "/integrations/linkedin.svg",
    description: "Connect LinkedIn profiles/orgs for publishing and insights." },
  { id: "tiktok", name: "TikTok", category: "Social", oauthReady: false, icon: "/integrations/tiktok.svg",
    description: "Connect TikTok for publishing and performance tracking." },
  { id: "alignable", name: "Alignable", category: "Social", oauthReady: false, icon: "/integrations/alignable.svg",
    description: "Connect Alignable (availability depends on API access)." },

  // ANALYTICS
  { id: "google_analytics", name: "Google Analytics", category: "Analytics", oauthReady: false, icon: "/integrations/google-analytics.svg",
    description: "Bring traffic & conversion metrics into ShortyPro." },
  { id: "bing_webmaster", name: "Bing Webmaster Tools", category: "Analytics", oauthReady: false, icon: "/integrations/bing.svg",
    description: "Pull site search performance metrics." },
  { id: "google_business", name: "Google Business Profile", category: "Analytics", oauthReady: false, icon: "/integrations/google-business.svg",
    description: "Manage listings & pull insights (where available)." },

  // DESIGN / UTILITIES
  { id: "canva", name: "Canva", category: "Design", oauthReady: false, icon: "/integrations/canva.svg",
    description: "Import designs/assets into your content library." },
  { id: "bynder", name: "Bynder", category: "Storage", oauthReady: false, icon: "/integrations/bynder.svg",
    description: "Import brand assets from Bynder DAM." },
  { id: "bitly", name: "Bitly", category: "Utilities", oauthReady: false, icon: "/integrations/bitly.svg",
    description: "Shorten links and apply branded domains." },
  { id: "slack", name: "Slack", category: "Utilities", oauthReady: false, icon: "/integrations/slack.svg",
    description: "Send notifications for approvals, posts, and leads." },

  // STORAGE
  { id: "google_drive", name: "Google Drive", category: "Storage", oauthReady: false, icon: "/integrations/google-drive.svg",
    description: "Import content from Google Drive into ShortyPro." },
  { id: "dropbox", name: "Dropbox", category: "Storage", oauthReady: false, icon: "/integrations/dropbox.svg",
    description: "Import content from Dropbox into ShortyPro." },

  // REPORTING
  { id: "tableau", name: "Tableau", category: "Analytics", oauthReady: false, icon: "/integrations/tableau.svg",
    description: "Export data for BI dashboards and reporting." },

  // MARKETING / CRM / SUPPORT
  { id: "marketo", name: "Marketo", category: "Marketing", oauthReady: false, icon: "/integrations/marketo.svg",
    description: "Pass leads into marketing automation workflows." },
  { id: "hubspot", name: "HubSpot", category: "CRM", oauthReady: false, icon: "/integrations/hubspot.svg",
    description: "Sync contacts/leads and track customer journeys." },
  { id: "salesforce", name: "Salesforce", category: "CRM", oauthReady: false, icon: "/integrations/salesforce.svg",
    description: "Sync leads/contacts and connect social data to CRM." },
  { id: "zendesk", name: "Zendesk", category: "Support", oauthReady: false, icon: "/integrations/zendesk.svg",
    description: "Create/link tickets and route customer interactions." },

  // COMMERCE
  { id: "woocommerce", name: "WooCommerce", category: "Commerce", oauthReady: false, icon: "/integrations/woocommerce.svg",
    description: "Connect store products for posts and reporting." },
  { id: "shopify", name: "Shopify", category: "Commerce", oauthReady: false, icon: "/integrations/shopify.svg",
    description: "Connect products and catalog links for posts." },
  { id: "facebook_shop", name: "Facebook Shops", category: "Commerce", oauthReady: false, icon: "/integrations/facebook-shop.svg",
    description: "Share product info by linking directly to catalog items." },
];

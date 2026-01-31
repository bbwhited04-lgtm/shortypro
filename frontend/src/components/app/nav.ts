export type NavItem = {
  label: string;
  href: string;
  group?: string;
};

export const NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },

  { label: "Content", href: "/content" },
  { label: "AI Writer (Chatterly)", href: "/content/chatterly" },
  { label: "Videos", href: "/content/videos" },

  { label: "Funnels (Magna Hive)", href: "/funnels" },
  { label: "Leads", href: "/funnels/leads" },

  { label: "Calendar", href: "/calendar" },
  { label: "Engagement", href: "/engagement" },
  { label: "Analytics", href: "/analytics" },

  { label: "Integrations", href: "/integrations" },
  { label: "Settings", href: "/settings" },
];

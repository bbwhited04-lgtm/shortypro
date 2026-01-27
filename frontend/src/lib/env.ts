export const ENV = {
  APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "ShortyPro",
  API_BASE: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000",
  CROSSLINKS: [
    process.env.NEXT_PUBLIC_CROSSLINK_1,
    process.env.NEXT_PUBLIC_CROSSLINK_2,
    process.env.NEXT_PUBLIC_CROSSLINK_3
  ].filter(Boolean) as string[],
  SOCIAL: {
    youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE,
    facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK,
    instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM,
    tiktok: process.env.NEXT_PUBLIC_SOCIAL_TIKTOK,
    threads: process.env.NEXT_PUBLIC_SOCIAL_THREADS,
    x: process.env.NEXT_PUBLIC_SOCIAL_X,
    linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN,
  },
  AUTH_COOKIE_NAME: process.env.AUTH_COOKIE_NAME || "sp_at",
};

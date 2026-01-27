import "./globals.css";
import SiteShell from "@/components/SiteShell";
import { ENV } from "@/lib/env";

export const metadata = {
  title: ENV.APP_NAME,
  description: "ShortyPro — front + backend, clean & modern.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}

"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    window.location.replace("/index.html");
  }, []);

  return (
    <main style={{ padding: 24, fontFamily: "system-ui" }}>
      Redirecting…
    </main>
  );
}

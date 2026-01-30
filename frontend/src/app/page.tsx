import { redirect } from "next/navigation";

export default function Home() {
  // Public marketing page lives in /public/index.html
  redirect("/index.html");
}

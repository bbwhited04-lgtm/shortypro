"use client";
import { useState } from "react";

export default function ChatUI() {
  const [msg, setMsg] = useState("");
  const [log, setLog] = useState<string[]>([]);

  async function send() {
    const res = await fetch(
      process.env.NEXT_PUBLIC_CHATTERLY_API!,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg })
      }
    );
    const data = await res.json();
    setLog([...log, data.reply]);
    setMsg("");
  }

  return (
    <div>
      <input
        value={msg}
        onChange={e => setMsg(e.target.value)}
        className="border p-2"
      />
      <button onClick={send} className="ml-2 border p-2">
        Send
      </button>
      <pre>{log.join("\n")}</pre>
    </div>
  );
}

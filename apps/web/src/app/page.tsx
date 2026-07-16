"use client";

import { useState } from "react";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function send() {
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: prompt,
      }),
    });

    const data = await res.json();

    setAnswer(data.message);
    setLoading(false);
  }

  return (
    <main
      style={{
        maxWidth: 900,
        margin: "50px auto",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <h1>DeepSeek V4 Pro</h1>
      <h1>DeepSeek V4 Pro</h1>

      <textarea
        rows={8}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button onClick={send} disabled={loading}>
        {loading ? "Loading..." : "Send"}
      </button>

      <pre>{answer}</pre>
    </main>
  );
}

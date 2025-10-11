// src/components/AITest.jsx
import { useState } from "react";
import { generateFromAI } from "../lib/ai";

export default function AITest() {
  const [prompt, setPrompt] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onAsk() {
    setLoading(true);
    setError(null);
    setAnswer("");
    try {
      const text = await generateFromAI(prompt || "Say hello in one line");
      setAnswer(text);
    } catch (e) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
      <h3>AI Test</h3>
      <input
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Type a prompt…"
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
      />
      <button onClick={onAsk} disabled={loading} style={{ padding: "8px 12px" }}>
        {loading ? "Thinking…" : "Ask AI"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {answer && (
        <pre style={{ whiteSpace: "pre-wrap", marginTop: 8 }}>{answer}</pre>
      )}
    </div>
  );
}

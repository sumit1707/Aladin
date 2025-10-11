// src/lib/ai.js
export async function generateFromAI(prompt) {
  const res = await fetch("/api/generate?q=" + encodeURIComponent(prompt));
  if (!res.ok) throw new Error("AI request failed");
  const data = await res.json();
  if (!data.ok) throw new Error(data.message || "AI service error");
  return data.text;
}

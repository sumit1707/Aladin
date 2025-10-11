// api/generate.js
import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  try {
    // Read prompt from query string: /api/generate?q=your+text
    const url = new URL(req.url, `http://${req.headers.host}`);
    const prompt = url.searchParams.get("q") || "Say hello in one short line.";

    const resp = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    // Try to return plain text if available
    const text =
      resp.output_text ||
      resp.choices?.[0]?.message?.content?.[0]?.text ||
      JSON.stringify(resp);

    res.status(200).json({ ok: true, text });
  } catch (err) {
    console.error("OPENAI ERROR:", err?.message || err);
    res.status(500).json({ ok: false, error: "OPENAI_FAILED", message: String(err?.message || err) });
  }
}

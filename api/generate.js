// api/generate.js
import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "METHOD_NOT_ALLOWED" });
  }

  try {
    // Read JSON body safely
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = JSON.parse(Buffer.concat(chunks).toString() || "{}");
    const prompt = body.prompt || "Say hello in one short line.";

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const apiKey =
    process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) throw new Error("Gemini API key missing");

     const genAI = new GoogleGenerativeAI(apiKey);

    const text =
      completion.output_text ||
      completion?.choices?.[0]?.message?.content?.[0]?.text ||
      JSON.stringify(completion);

    return res.status(200).json({ ok: true, text });
  } catch (error) {
    console.error("OPENAI ERROR:", error);
    return res
      .status(500)
      .json({ ok: false, error: "OPENAI_FAILED", message: String(error?.message || error) });
  }
}

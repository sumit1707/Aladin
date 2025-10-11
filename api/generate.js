import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Extract a test query: /api/generate?q=hello
    const url = new URL(req.url, `http://${req.headers.host}`);
    const prompt = url.searchParams.get("q") || "Say hello in one short line.";

    const completion = await client.responses.create({
      model: "gpt-4o-mini",
      input: prompt,
    });

    const text =
      completion.output_text ||
      completion.choices?.[0]?.message?.content?.[0]?.text ||
      JSON.stringify(completion);

    res.status(200).json({ ok: true, text });
  } catch (error) {
    console.error("OPENAI ERROR:", error);
    res
      .status(500)
      .json({ ok: false, error: error.message || "Internal Server Error" });
  }
}

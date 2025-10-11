export default function handler(_req, res) {
  res.status(200).json({
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    vercelEnv: process.env.VERCEL_ENV || "unknown",
  });
}

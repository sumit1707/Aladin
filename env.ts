// api/env.ts
export default async function handler(_req: any, res: any) {
  res.status(200).json({
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    vercelEnv: process.env.VERCEL_ENV || "unknown",
  });
}

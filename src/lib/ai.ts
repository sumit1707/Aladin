// src/lib/ai.ts
export async function generateFromAI(prompt) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });
  if (!res.ok) throw new Error("AI request failed");
  const data = await res.json();
  if (!data.ok) throw new Error(data.message || "AI service error");
  return data.text;
}
// Turn form data into a structured destinations response from the AI
export async function generateDestinationsFromForm(data: any) {
  const prompt = `
You are a travel planner. Based on the user's preferences below, return ONLY a compact JSON object with this exact shape:

{
  "destinations": [
    {
      "title": "string",
      "description": "string",
      "image": "string (URL or empty)",
      "estimated_cost_per_person": number
    }
  ]
}

User preferences:
- Month: ${data.month}
- Travelers: ${data.travelers}
- Group Type: ${data.groupType}
- Domestic/Intl: ${data.domesticOrIntl}
- Theme: ${Array.isArray(data.theme) ? data.theme.join(", ") : data.theme}
- Mood: ${data.mood}
- Budget: ${data.budget}
- Travel Mode: ${data.travelMode}
- Days: ${data.days || "N/A"}

Constraints:
- Return ONLY JSON, no extra text.
- 3 to 6 destinations max.
- Costs must be numbers (no currency symbols).
`;

  const text = await generateFromAI(prompt);
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("AI did not return valid JSON");
  }
  if (!parsed || !Array.isArray(parsed.destinations)) {
    throw new Error("Destinations not found in AI response");
  }
  return parsed; // { destinations: [...] }
}

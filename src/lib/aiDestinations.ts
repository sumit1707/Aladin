export interface TripFormData {
  month: string;
  travelers: number;
  groupType: string;
  domesticOrIntl: string;
  theme: string[];
  mood: string;
  budget: string;
  flexibleDates: boolean;
  travelMode: string;
  startLocation: string;
  days: number;
}

export interface DestinationOption {
  id: string;
  title: string;
  country?: string;
  short_description: string;
  weather: {
    temperature_range: string;
    condition: string;
  };
  must_sees: Array<{
    name: string;
    reason: string;
    video_link?: string;
  }>;
  approx_budget: {
    total_per_person: number;
    breakdown: {
      stay: number;
      food: number;
      transport: number;
      activities: number;
    };
  };
  pros: string[];
  con: string;
  best_months: string;
  accessibility_note: string;
  travel_time_from_origin: string;
  estimated_time_to_cover: string;
  hidden_gem?: boolean;
}

export interface AIDestinationResponse {
  destinations: DestinationOption[];
}

const AI_TRAVEL_CONCIERGE_SYSTEM_PROMPT = `ROLE:
You are an intelligent AI Travel Concierge that curates top travel destinations customized to each user's needs.
You recommend either national or international destinations depending on user choice, ensuring travelers spend more time enjoying and less time travelling.`;

const generateDestinationPrompt = (formData: TripFormData): string => {
  const travelScope = formData.domesticOrIntl === 'Within India' ? 'National' : 'International';

  const durationLogic = formData.days <= 3
    ? 'choose nearby destinations (≤5-6 hrs) from origin city'
    : 'you may include longer-distance or international destinations if travel time leaves enough time for sightseeing';

  const nationalInternationalLogic = travelScope === 'National'
    ? 'pick only destinations within India'
    : 'pick foreign destinations reachable from India via direct or short flight routes (≤6-8 hrs preferred). Prefer countries with visa-on-arrival or easy tourist visa for Indians (e.g., Thailand, Dubai, Bali, Sri Lanka, Maldives)';

  const moodLogic = {
    'Party': 'prioritize beach or city nightlife (e.g., Goa, Bangkok)',
    'Relaxing': 'peaceful retreats, nature, lakes, or spa towns',
    'Exploring': 'culturally and naturally diverse destinations',
    'Cultural': 'heritage, temples, old cities, rituals, traditions'
  };

  const typeLogic = {
    'Family': 'safe, clean, kids-friendly destinations with convenient stays',
    'Couple': 'romantic, scenic, calm destinations',
    'Group': 'adventure or mixed-activity locations',
    'Bachelors': 'adventure, party, or backpacking spots',
    'Solo': 'adventure, party, or backpacking spots'
  };

  const budgetRange = formData.budget === 'Budget-friendly (Under ₹20k)'
    ? { max: 20000, label: 'Under ₹20,000' }
    : formData.budget === 'Mid-range (₹20k-₹50k)'
    ? { max: 50000, label: '₹20,000 to ₹50,000' }
    : { max: 250000, label: '₹50,000 to ₹2,50,000' };

  return `🧩 INPUTS:
- origin_city: ${formData.startLocation}
- travel_month: ${formData.month}
- duration_days: ${formData.days}
- travel_type: ${formData.groupType}
- preferred_destination_type: ${formData.theme.join(', ')}
- mood: ${formData.mood}
- travel_scope: ${travelScope}
- budget_per_person: ${formData.budget} (MAXIMUM: ₹${budgetRange.max} per person)

🎯 OBJECTIVE:
Generate travel destinations that STRICTLY MATCH the given budget constraint.
CRITICAL: Only suggest destinations where the TOTAL cost per person is LESS THAN OR EQUAL TO ₹${budgetRange.max}.
- If you can find 5 destinations within budget, return 5
- If only 3 destinations fit the budget, return only those 3
- If only 1 destination fits, return only 1
- If NO destinations fit within the budget, return an empty array with a message explaining no destinations are available

For each destination, include detailed yet concise travel info — budget, weather, ideal duration, travel time, and video exploration links.

⚙️ DESTINATION SELECTION RULES:

🕒 Duration Logic:
${durationLogic}

🌐 National vs International Logic:
${nationalInternationalLogic}

😎 Mood Logic:
${moodLogic[formData.mood] || 'mixed experiences'}

👨‍👩‍👧 Type Logic:
${typeLogic[formData.groupType] || 'varied activities'}

🌤️ Weather Logic:
Always include weather for ${formData.month} with temperature range (°C) and general condition (sunny/cloudy/rainy/snow).
Avoid suggesting destinations with unsafe/extreme weather for that month.
If exact data unavailable, mention "typical for ${formData.month} based on climate trends".

💰 Budget Logic (CRITICAL - MUST FOLLOW):
User's maximum budget per person: ₹${budgetRange.max}
STRICT RULE: The "total_per_person" in your response MUST be ≤ ₹${budgetRange.max}

DO NOT suggest destinations that exceed this budget.
Calculate realistic total cost including:
- Stay cost (hotels/accommodation for ${formData.days} days)
- Food cost (meals for ${formData.days} days)
- Transport cost (based on ${formData.travelMode} from ${formData.startLocation})
- Activities cost (entry fees, tours)

If a destination's TOTAL cost exceeds ₹${budgetRange.max}, DO NOT include it in your response.
If you cannot find enough destinations within budget, return fewer than 5 destinations.
Quality over quantity - only suggest destinations that truly fit within the budget.

💎 Hidden Gem Logic:
Include at least one underrated or lesser-known gem among the 5.

For EACH destination, provide:
1. Destination name and country
2. Short description (2-3 lines) highlighting what makes it perfect
3. Weather information for ${formData.month} (temperature range in °C and condition)
4. THREE must-see attractions with reasons AND YouTube video links
5. Realistic budget breakdown in INR for ${formData.days} days:
   - Stay cost
   - Food cost
   - Transport cost (based on travel mode: ${formData.travelMode})
   - Activities cost
   - Total per person
6. TWO specific pros and ONE realistic con
7. Best months to visit
8. Travel time from ${formData.startLocation} (specific hours/mode)
9. Accessibility details (how to reach)
10. Estimated time to cover all major attractions
11. Mark if it's a hidden gem (hidden_gem: true/false)

RETURN ONLY VALID JSON in this exact format:
{
  "destinations": [
    {
      "id": "unique-id",
      "title": "Destination Name",
      "country": "Country Name",
      "short_description": "Why this destination is perfect for this traveler",
      "weather": {
        "temperature_range": "15-25°C",
        "condition": "sunny/cloudy/rainy/snow"
      },
      "must_sees": [
        {"name": "Attraction 1", "reason": "Why visit", "video_link": "https://youtube.com/watch?v=example1"},
        {"name": "Attraction 2", "reason": "Why visit", "video_link": "https://youtube.com/watch?v=example2"},
        {"name": "Attraction 3", "reason": "Why visit", "video_link": "https://youtube.com/watch?v=example3"}
      ],
      "approx_budget": {
        "total_per_person": 35000,
        "breakdown": {
          "stay": 12000,
          "food": 8000,
          "transport": 10000,
          "activities": 5000
        }
      },
      "pros": ["Specific advantage 1", "Specific advantage 2"],
      "con": "One realistic drawback",
      "best_months": "Month range",
      "travel_time_from_origin": "6-7 hours by flight",
      "accessibility_note": "How to reach from ${formData.startLocation}",
      "estimated_time_to_cover": "3-4 days recommended",
      "hidden_gem": false
    }
  ]
}

⚠️ FINAL REMINDER:
Before returning your response, VERIFY that EVERY destination's "total_per_person" is ≤ ₹${budgetRange.max}.
If you cannot find 5 destinations within this budget, return fewer destinations (4, 3, 2, or even 1).
If NO destinations fit within ₹${budgetRange.max}, return {"destinations": [], "message": "No destinations found within the specified budget of ${formData.budget}"}.
DO NOT compromise on budget accuracy - it is better to return fewer destinations than to exceed the user's budget.`;
};

export const generateDestinations = async (formData: TripFormData): Promise<AIDestinationResponse> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  try {
    const userPrompt = generateDestinationPrompt(formData);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: AI_TRAVEL_CONCIERGE_SYSTEM_PROMPT },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const result = JSON.parse(content);

    const budgetMax = formData.budget === 'Budget-friendly (Under ₹20k)'
      ? 20000
      : formData.budget === 'Mid-range (₹20k-₹50k)'
      ? 50000
      : 250000;

    if (result.destinations && Array.isArray(result.destinations)) {
      result.destinations = result.destinations.filter(
        (dest: DestinationOption) => dest.approx_budget.total_per_person <= budgetMax
      );

      console.log(`Budget filter applied: Max budget ₹${budgetMax}, Destinations matching: ${result.destinations.length}`);
    }

    return result;
  } catch (error) {
    console.error('Failed to generate destinations:', error);
    throw error;
  }
};

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
You are an AI Travel Concierge for India-based travelers. Recommend destinations users can actually enjoy (not just travel to).
Obey all rules strictly. Do not invent hard facts (hotel names, exact fares).
Use safe, generic descriptors and verifiable YouTube search links for videos.

CRITICAL RULES:
1. Budget is PRIMARY constraint - never exceed it
2. Respect travel_scope (National/International) strictly
3. Match hotel tier to budget band and scope
4. If fewer than 5 destinations fit budget, return only those that fit
5. If NONE fit, return empty array with explanation
6. Use YouTube search URLs only: https://www.youtube.com/results?search_query={destination}+{spot}
7. Rank by fit_score (0-100) considering all factors
8. Include at least one hidden gem if it fits constraints`;

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
    ? { max: 20000, label: 'Under ₹20,000', hotelIndia: '₹1,000-₹3,000/night', hotelIntl: '₹3,000-₹6,000/night' }
    : formData.budget === 'Mid-range (₹20k-₹50k)'
    ? { max: 50000, label: '₹20,000 to ₹50,000', hotelIndia: '₹3,000-₹8,000/night', hotelIntl: '₹6,000-₹12,000/night' }
    : { max: 250000, label: '₹50,000 to ₹2,50,000', hotelIndia: '₹8,000-₹18,000+/night', hotelIntl: '₹12,000-₹25,000+/night' };

  const transitPercentage = formData.mood === 'Relaxing'
    ? '≤15% of daytime (cluster sights nearby, include downtime)'
    : formData.mood === 'Exploring'
    ? '≤35% of daytime (day trips allowed, higher movement OK)'
    : formData.mood === 'Party'
    ? 'minimal (prioritize nightlife districts, short internal transfers)'
    : '≤25% of daytime (moderate transit for heritage/cultural sites)';

  return `🧩 RUNTIME INPUTS:
- origin_city: ${formData.startLocation}
- travel_month: ${formData.month}
- duration_days: ${formData.days}
- travel_type: ${formData.groupType}
- preferred_destination_type: ${formData.theme.join(', ')}
- mood: ${formData.mood}
- travel_scope: ${travelScope}
- budget_in_inr_max: ₹${budgetRange.max} per person (ABSOLUTE MAXIMUM)

🎯 OBJECTIVE:
Return the Top 5 destinations (or fewer if budget constraints limit options) that best fit inputs.
Prioritize: BUDGET and TRAVEL_SCOPE first (especially for hotel tier selection), then mood, duration, origin distance, and destination type.

CRITICAL BUDGET RULES:
- Total trip budget must be ≤ ₹${budgetRange.max} per person
- If you can find 5 destinations within budget, return 5
- If only 3 destinations fit, return only those 3
- If only 1 destination fits, return only 1
- If NONE fit, return {"destinations": [], "note": "No destinations found within budget. Suggestions: increase budget, reduce duration, or switch to domestic travel."}
- NEVER exceed budget in main list (no over-budget items)

⚙️ SELECTION & PLANNING RULES:

1) 💰 BUDGET-FIRST & SCOPE-FIRST (HIGHEST PRIORITY):
   Primary constraint: total trip budget ≤ ₹${budgetRange.max} per person

   Hotel tier selection (based on scope and budget):
   ${travelScope === 'National' ? `India hotels: ${budgetRange.hotelIndia}` : `International hotels: ${budgetRange.hotelIntl}`}

   Calculate realistic costs:
   - Stay: ${budgetRange.hotelIndia} × ${formData.days} nights
   - Food: realistic meals for ${formData.days} days
   - Transport: ${formData.travelMode} from ${formData.startLocation}
   - Activities: entry fees, tours

   If destination exceeds ₹${budgetRange.max}, DO NOT include it.

2) 🌐 NATIONAL vs INTERNATIONAL:
   travel_scope = ${travelScope}
   ${travelScope === 'National'
     ? 'ONLY India destinations allowed'
     : 'Non-India destinations with practical connections for Indians (visa-easy preferred: Thailand, Dubai, Bali, Sri Lanka, Maldives, Nepal, Bhutan)'}

3) 🕒 DURATION & DISTANCE (minimize transit for short trips):
   duration_days = ${formData.days}
   ${formData.days <= 3
     ? 'CRITICAL: Select NEARBY destinations only (≤5-6 hours door-to-door) to maximize on-ground time'
     : 'Longer distances allowed IF transit still leaves ample time for enjoyment (at least 60% of trip)'}

4) 😎 MOOD → TRANSIT AMOUNT:
   mood = ${formData.mood}
   Daily transit target: ${transitPercentage}
   ${formData.mood === 'Relaxing' ? 'Focus on clustering sights, minimal movement, include spa/downtime' : ''}
   ${formData.mood === 'Exploring' ? 'Higher movement OK, include day trips and diverse experiences' : ''}
   ${formData.mood === 'Cultural' ? 'Focus on heritage sites, temples, local arts/food walks, moderate transit' : ''}
   ${formData.mood === 'Party' ? 'Prioritize nightlife districts, beach clubs, city hubs with short transfers' : ''}

5) 👨‍👩‍👧 TRAVEL TYPE:
   travel_type = ${formData.groupType}
   ${typeLogic[formData.groupType]}
   ${formData.groupType === 'Family' ? 'Ensure safe areas, kid-friendly timings, easy logistics' : ''}
   ${formData.groupType === 'Couple' ? 'Focus on romantic viewpoints, scenic stays' : ''}
   ${formData.groupType === 'Group' ? 'Multi-activity options, social fun spots' : ''}
   ${formData.groupType === 'Bachelors' || formData.groupType === 'Solo' ? 'Adventure or nightlife-friendly destinations' : ''}

6) 🏔️ DESTINATION TYPE FIT:
   preferred_type = ${formData.theme.join(', ')}
   Match destination's dominant character to user preference (Mountain/Beach/Adventure/Temple/City/Nature)

7) 🌤️ WEATHER IN TRAVEL MONTH:
   travel_month = ${formData.month}
   Provide: avg_temp_c_min, avg_temp_c_max, conditions (Sunny/Cloudy/Rainy/Snowy/Mixed)
   Label as "typical for ${formData.month}" if using climatology
   AVOID destinations with unsafe/extreme weather for this month

8) 📍 SPOTS & VIDEOS (NO HALLUCINATION):
   Exactly 3 must-visit spots per destination with 1-line reason
   Use YouTube SEARCH URLs only (not specific videos):
   Format: https://www.youtube.com/results?search_query={destination}+{spot}
   Example: https://www.youtube.com/results?search_query=Manali+Rohtang+Pass
   NEVER use made-up video IDs or dead links

9) 🏆 RANKING & HIDDEN GEM:
   Rank by fit_score (0-100) considering:
   - Budget fit (40 points)
   - Scope match (15 points)
   - Duration-distance match (15 points)
   - Mood/type alignment (15 points)
   - Weather suitability (10 points)
   - Theme match (5 points)

   Include at least ONE nearby underrated option marked "is_hidden_gem": true IF it fits budget and scope

OUTPUT FORMAT:
Return ONLY valid JSON. Each destination must include:
1. Unique ID
2. Destination name & country
3. Short description (2-3 lines) - why perfect for this traveler
4. Weather for ${formData.month}: temp range (°C) + condition
5. THREE must-see spots with YouTube SEARCH URLs
6. Budget breakdown (stay, food, transport, activities) → total_per_person ≤ ₹${budgetRange.max}
7. TWO pros, ONE con
8. Best months to visit
9. Travel time from ${formData.startLocation}
10. Accessibility note
11. Estimated time to cover attractions
12. hidden_gem flag (true/false)

RETURN ONLY VALID JSON:
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
        {"name": "Attraction 1", "reason": "Why visit (1-line)", "video_link": "https://www.youtube.com/results?search_query=DestinationName+Attraction1"},
        {"name": "Attraction 2", "reason": "Why visit (1-line)", "video_link": "https://www.youtube.com/results?search_query=DestinationName+Attraction2"},
        {"name": "Attraction 3", "reason": "Why visit (1-line)", "video_link": "https://www.youtube.com/results?search_query=DestinationName+Attraction3"}
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

⚠️ CRITICAL FINAL CHECKS:
Before returning, VERIFY:
1. ✓ EVERY "total_per_person" ≤ ₹${budgetRange.max} (NO EXCEPTIONS)
2. ✓ All video_link URLs use YouTube SEARCH format (not specific video IDs)
3. ✓ Travel scope matches (${travelScope} only)
4. ✓ Duration appropriate for distance (${formData.days} days from ${formData.startLocation})
5. ✓ Weather safe for ${formData.month}
6. ✓ At least one hidden gem if possible

If fewer than 5 fit budget: return only those (4, 3, 2, or 1)
If NONE fit budget: return {"destinations": [], "note": "No destinations within ₹${budgetRange.max}. Try: increase budget to ₹${Math.ceil(budgetRange.max * 1.5)}, reduce to ${Math.max(2, formData.days - 1)} days, or switch to ${travelScope === 'National' ? 'nearby India destinations' : 'domestic travel'}."}

Quality > Quantity. Accuracy > Completeness.`;
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

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
You are an AI Travel Concierge for India-based travelers. Recommend realistic destinations within their budget.

CRITICAL RULES:
1. Budget is PRIMARY - calculate ALL costs realistically (flights/trains, hotels, food, activities)
2. Return 1-5 destinations that ACTUALLY FIT within budget
3. Be practical and realistic with cost estimates
4. Use YouTube search URLs: https://www.youtube.com/results?search_query={destination}+{spot}
5. If budget is too tight, return fewer destinations or empty array with helpful suggestions`;

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

  return `USER REQUIREMENTS:
- Starting from: ${formData.startLocation}
- Travel month: ${formData.month}
- Duration: ${formData.days} days
- Travel mode: ${formData.travelMode}
- Group type: ${formData.groupType}
- Preferences: ${formData.theme.join(', ')} - ${formData.mood} mood
- Scope: ${travelScope === 'National' ? 'Within India only' : 'International destinations'}
- MAXIMUM BUDGET: ₹${budgetRange.max} per person (ALL COSTS INCLUDED)

YOUR TASK:
Recommend realistic destinations where the TOTAL COST (transport + stay + food + activities) is ≤ ₹${budgetRange.max} per person.

IMPORTANT:
- Return 1-5 destinations that genuinely fit the budget
- If budget is tight, return fewer destinations (quality > quantity)
- If no destinations fit, return empty array with suggestions
- Be realistic with costs - don't underestimate to fit budget`;

⚙️ SELECTION & PLANNING RULES:

1) 💰 BUDGET-FIRST & SCOPE-FIRST (ABSOLUTE HIGHEST PRIORITY):
   ⚠️ CRITICAL: total trip budget MUST be ≤ ₹${budgetRange.max} per person
   ⚠️ NO EXCEPTIONS - If any destination exceeds this, DO NOT INCLUDE IT

   Hotel tier selection (based on scope and budget):
   ${travelScope === 'National' ? `India hotels: ${budgetRange.hotelIndia}` : `International hotels: ${budgetRange.hotelIntl}`}

   MANDATORY COST CALCULATIONS (ALL INCLUSIVE):
   You MUST include ALL these costs in your calculation:

   A) TRAVEL/TRANSPORT TO DESTINATION (${formData.travelMode} from ${formData.startLocation}):
      ${formData.travelMode === 'Flight' ? `
      - Flight: Round-trip airfare (economy class)
        * Domestic India: ₹3,000-₹15,000 depending on distance
        * International: ₹15,000-₹50,000 depending on destination
        * Calculate based on actual distance from ${formData.startLocation}` : ''}
      ${formData.travelMode === 'Train' ? `
      - Train: Round-trip train fare (2AC/3AC class)
        * Short distance (<500km): ₹1,000-₹2,500
        * Medium distance (500-1500km): ₹2,500-₹5,000
        * Long distance (>1500km): ₹5,000-₹8,000
        * Calculate based on actual distance from ${formData.startLocation}` : ''}
      ${formData.travelMode === 'Bus' ? `
      - Bus: Round-trip bus fare (sleeper/semi-sleeper)
        * Short distance (<300km): ₹500-₹1,500
        * Medium distance (300-800km): ₹1,500-₹3,000
        * Long distance (>800km): ₹3,000-₹5,000
        * Calculate based on actual distance from ${formData.startLocation}` : ''}

   B) ACCOMMODATION (${formData.days} nights):
      - Hotel: ${travelScope === 'National' ? budgetRange.hotelIndia : budgetRange.hotelIntl} × ${formData.days} nights
      - CALCULATE: [hotel_rate_per_night] × ${formData.days}

   C) FOOD (${formData.days} days):
      - Budget tier: ₹800-₹1,200 per day
      - Mid-range tier: ₹1,500-₹2,500 per day
      - Premium tier: ₹2,500-₹4,000 per day
      - CALCULATE: [daily_food_cost] × ${formData.days}

   D) LOCAL TRANSPORT (within destination):
      - Taxis/Autos/Local buses: ₹500-₹1,500 per day
      - CALCULATE: [local_transport] × ${formData.days}

   E) ACTIVITIES & ENTRY FEES:
      - Entry tickets, tours, experiences
      - Typical: ₹2,000-₹8,000 for entire trip

   TOTAL PER PERSON = A + B + C + D + E

   ⚠️ VERIFICATION RULE:
   IF (TOTAL PER PERSON > ₹${budgetRange.max}) {
      DO NOT INCLUDE THIS DESTINATION
      FIND ANOTHER OPTION
   }

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
          "travel_to_destination": 10000,
          "stay": 12000,
          "food": 8000,
          "local_transport": 3000,
          "activities": 2000
        },
        "calculation_note": "travel_to_destination + stay + food + local_transport + activities = total_per_person"
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

⚠️ MANDATORY 4-PASS VERIFICATION SYSTEM:
YOU MUST CHECK EACH DESTINATION 4 TIMES BEFORE INCLUDING IT:

🔍 PASS 1 - BUDGET CALCULATION CHECK:
   For EACH destination, manually calculate:
   - ${formData.travelMode} cost from ${formData.startLocation}: ₹____
   - Hotel (${formData.days} nights): ₹____
   - Food (${formData.days} days): ₹____
   - Local transport (${formData.days} days): ₹____
   - Activities: ₹____
   - TOTAL: ₹____

   Is TOTAL ≤ ₹${budgetRange.max}? YES/NO
   If NO → REJECT THIS DESTINATION

🔍 PASS 2 - SCOPE & DISTANCE CHECK:
   - Is destination in ${travelScope === 'National' ? 'India' : 'international (non-India)'}? YES/NO
   - For ${formData.days} days, is travel time reasonable from ${formData.startLocation}? YES/NO
   - ${formData.days <= 3 ? 'Is it within 5-6 hours travel time? YES/NO' : 'Does trip leave 60%+ time for enjoyment? YES/NO'}

   If any NO → REJECT THIS DESTINATION

🔍 PASS 3 - ALIGNMENT CHECK:
   - Weather safe for ${formData.month}? YES/NO
   - Matches mood: ${formData.mood}? YES/NO
   - Matches theme: ${formData.theme.join(', ')}? YES/NO
   - Matches travel type: ${formData.groupType}? YES/NO

   If major misalignment → REJECT THIS DESTINATION

🔍 PASS 4 - FINAL ACCURACY CHECK:
   - All YouTube links use search format (not video IDs)? YES/NO
   - No invented hotel names or exact fares? YES/NO
   - Weather data labeled "typical for ${formData.month}"? YES/NO
   - Budget breakdown adds up correctly? YES/NO

   If any NO → REJECT THIS DESTINATION

📊 FINAL DECISION:
   - Count destinations that passed all 4 checks: ____
   - If 5+ passed: return top 5 by fit_score
   - If 4 passed: return all 4
   - If 3 passed: return all 3
   - If 2 passed: return all 2
   - If 1 passed: return only 1
   - If 0 passed: return {"destinations": [], "note": "No destinations found within ₹${budgetRange.max} budget for ${formData.days} days from ${formData.startLocation} via ${formData.travelMode}. Suggestions: (1) Increase budget to ₹${Math.ceil(budgetRange.max * 1.5)}, (2) Reduce to ${Math.max(2, formData.days - 1)} days, (3) Choose ${travelScope === 'National' ? 'closer destinations' : 'domestic travel'}, (4) Switch to ${formData.travelMode === 'Flight' ? 'train/bus for lower costs' : 'flight for distant destinations'}."}

🚫 ABSOLUTE RULES - NO COMPROMISE:
   1. NEVER return a destination with total_per_person > ₹${budgetRange.max}
   2. NEVER skip the 4-pass verification
   3. NEVER fabricate costs to fit budget
   4. NEVER include destinations with unsafe weather
   5. If budget is too tight, return EMPTY ARRAY with helpful note

Quality > Quantity. Accuracy is NON-NEGOTIABLE.`;
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

    // CRITICAL POST-PROCESSING VALIDATION WITH 4-STEP CHECK
    console.log('🔍 Starting strict 4-step budget validation...');
    console.log(`📊 Budget constraint: ₹${budgetMax} per person for ${formData.days} days via ${formData.travelMode} from ${formData.startLocation}`);

    if (result.destinations && Array.isArray(result.destinations)) {
      const validatedDestinations = result.destinations.filter((dest: DestinationOption) => {
        const total = dest.approx_budget?.total_per_person || 0;
        const breakdown = dest.approx_budget?.breakdown;

        console.log(`\n🔍 Validating: ${dest.title}`);

        // STEP 1: Verify breakdown exists and has all components
        if (!breakdown) {
          console.warn(`❌ REJECTED ${dest.title}: Missing budget breakdown`);
          return false;
        }

        // STEP 2: Verify breakdown includes travel costs
        const travelCost = breakdown.travel_to_destination || breakdown.transport || 0;
        if (travelCost === 0) {
          console.warn(`❌ REJECTED ${dest.title}: Missing travel/transport cost to destination`);
          return false;
        }

        // STEP 3: Verify budget math is correct
        const calculatedTotal =
          travelCost +
          (breakdown.stay || 0) +
          (breakdown.food || 0) +
          (breakdown.local_transport || 0) +
          (breakdown.activities || 0);

        console.log(`   Travel to destination: ₹${travelCost}`);
        console.log(`   Stay (${formData.days} nights): ₹${breakdown.stay || 0}`);
        console.log(`   Food (${formData.days} days): ₹${breakdown.food || 0}`);
        console.log(`   Local transport: ₹${breakdown.local_transport || 0}`);
        console.log(`   Activities: ₹${breakdown.activities || 0}`);
        console.log(`   Calculated total: ₹${calculatedTotal}`);
        console.log(`   Stated total: ₹${total}`);

        if (Math.abs(calculatedTotal - total) > 500) {
          console.warn(`⚠️ Budget mismatch for ${dest.title}: fixing from ₹${total} to ₹${calculatedTotal}`);
          dest.approx_budget.total_per_person = calculatedTotal;
        }

        const finalTotal = dest.approx_budget.total_per_person;

        // STEP 4: Final budget check
        if (finalTotal > budgetMax) {
          console.warn(`❌ REJECTED ${dest.title}: ₹${finalTotal} exceeds budget limit ₹${budgetMax}`);
          return false;
        }

        console.log(`✅ APPROVED ${dest.title}: ₹${finalTotal} within budget ₹${budgetMax}`);
        return true;
      });

      result.destinations = validatedDestinations;

      console.log(`\n📊 FINAL RESULT: ${validatedDestinations.length} destinations passed strict validation`);

      if (validatedDestinations.length === 0) {
        console.warn('⚠️ NO DESTINATIONS within budget after validation');
        return {
          destinations: [],
          note: `No destinations found within ₹${budgetMax} budget for ${formData.days} days from ${formData.startLocation} via ${formData.travelMode}. This budget may be too tight for the selected parameters. Suggestions: (1) Increase budget to ₹${Math.ceil(budgetMax * 1.5)}, (2) Reduce trip duration to ${Math.max(2, formData.days - 1)} days, (3) Choose closer destinations to reduce ${formData.travelMode.toLowerCase()} costs, (4) Switch travel mode to ${formData.travelMode === 'Flight' ? 'train/bus for lower costs' : 'flight if available'}.`
        };
      }
    }

    return result;
  } catch (error) {
    console.error('Failed to generate destinations:', error);
    throw error;
  }
};

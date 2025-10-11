export interface ItineraryDay {
  day: number;
  title: string;
  items: Array<{
    time: string;
    activity: string;
    duration: string;
    transit: boolean;
  }>;
  total_transit_hours: number;
  estimated_cost_per_person: number;
}

export interface AIItineraryResponse {
  itinerary: ItineraryDay[];
  total_estimated_cost_per_person: number;
  summary_message: string;
}

const AI_TRAVEL_PLANNER_SYSTEM_PROMPT = `You are a professional AI Travel Planner that creates personalized, realistic itineraries for travelers in India and abroad.
Your goal is to maximize the user's enjoyment while balancing their budget, mood, travel duration, and mode of transport.

Always generate a step-by-step itinerary (hourly or by activity block) for each day of travel.
The plan should consider time of travel, budget, travel type, mood, and preferred destination type.
At the end, display:

"✨ This is the best itinerary curated for your preferences and current travel conditions."`;

const generateItineraryPrompt = (
  destinationFrom: string,
  destinationTo: string,
  monthOfTravel: string,
  budgetInINR: string,
  typeOfTravel: string,
  preferredDestinationType: string[],
  mood: string,
  howToTravel: string,
  durationDays: number
): string => {
  return `🧩 USER INPUT VARIABLES:
- month_of_travel: ${monthOfTravel}
- destination_from: ${destinationFrom}
- destination_to: ${destinationTo}
- budget_in_inr: ${budgetInINR}
- type_of_travel: ${typeOfTravel}
- preferred_destination_type: ${preferredDestinationType.join(', ')}
- mood: ${mood}
- how_to_travel: ${howToTravel}
- duration_days: ${durationDays}

⚙️ LOGIC RULES:

1️⃣ Mood & Travel Time Logic:
${mood === 'Relaxing' ? '- RELAXING MODE: Reduce travel hours; prefer short commutes, scenic stays, and downtime\n- Maximum 2-3 hours of travel per day within destination\n- Include spa time, leisure activities, peaceful locations' : ''}${mood === 'Exploring' ? '- EXPLORING MODE: Allow more travel within the destination (sightseeing, day trips)\n- Pack in diverse experiences across the day\n- Include 5-7 activities per day with variety' : ''}${mood === 'Cultural' ? '- CULTURAL MODE: Focus on temples, museums, old towns, local cuisine\n- Include local interactions, traditional experiences\n- Immersive activities like cooking classes, workshops' : ''}${mood === 'Party' ? '- PARTY MODE: Include nightlife zones, beach clubs, or happening markets\n- Late starts (11 AM-12 PM), active evenings and nights\n- End days late (past midnight)' : ''}

2️⃣ Budget Logic:
${budgetInINR.includes('15,000') || budgetInINR.includes('< ₹15') ? '- LOW BUDGET (< ₹20k): Homestays/budget hotels, public transport, 1-2 paid activities\n- Daily cost: ₹1,500-2,500 per person\n- Focus on affordable guesthouses, street food, free/low-cost activities' : ''}${budgetInINR.includes('15,000-₹40,000') || budgetInINR.includes('₹40,000') ? '- MEDIUM BUDGET (₹20k-₹60k): Boutique stays/trains/economy flights, guided tours, 2-3 key experiences\n- Daily cost: ₹2,500-4,500 per person\n- Comfortable 3-star hotels, mix of local and good dining options' : ''}${budgetInINR.includes('₹80,000') || budgetInINR.includes('80,000+') ? '- HIGH BUDGET (> ₹60k): Premium resorts, private cabs, adventure or luxury experiences\n- Daily cost: ₹4,500-8,000+ per person\n- Premium 4-5 star hotels, fine dining, private transport' : ''}

3️⃣ Stay Selection (based on mood + budget):
${mood === 'Relaxing' ? '- Lakeview resort / mountain retreat / spa hotel' : ''}${mood === 'Exploring' ? '- Centrally located stay near attractions' : ''}${mood === 'Cultural' ? '- Heritage homestay / old city lodging' : ''}${mood === 'Party' ? '- Beach resort / city nightlife district' : ''}

4️⃣ Mode of Travel Logic:
${howToTravel === 'Car' ? '- CAR: Ideal for short-distance / flexible scenic drives\n- Include fuel stops, scenic viewpoints along the way\n- Flexible timing for stops and detours' : ''}${howToTravel === 'Train 3A' || howToTravel === 'Train 2A' ? '- TRAIN: Suitable for mid-range intercity travel\n- Adjust timing for overnight journeys if applicable\n- Include station transfer times and meal stops' : ''}${howToTravel === 'Flight' ? '- FLIGHT: Use for long distances to save time\n- Integrate arrival/departure buffer times (2-3 hours)\n- Include airport transfers and check-in time' : ''}

5️⃣ Season & Month Logic:
Include relevant activities depending on ${monthOfTravel} (e.g., snowfall, beaches, festivals).
Skip any activity that's off-season or weather-restricted.

6️⃣ Type of Travel Logic:
${typeOfTravel === 'Family' ? '- FAMILY: Easy sightseeing + comfort stays + child-safe options\n- Kid-friendly activities, comfortable pace' : ''}${typeOfTravel === 'Couple' ? '- COUPLE: Romantic dining, sunsets, scenic drives\n- Intimate experiences, couple-friendly activities' : ''}${typeOfTravel === 'Bachelors' || typeOfTravel === 'Solo' ? '- BACHELOR/SOLO: Adventure sports, nightlife, social activities\n- Backpacking spots, group activities, party scenes' : ''}${typeOfTravel === 'Group' ? '- GROUP: Shared adventures, bonfires, team activities\n- Mixed-activity locations, group-friendly venues' : ''}

📋 ITINERARY REQUIREMENTS:

Day 1:
- MUST include journey from ${destinationFrom} to ${destinationTo}
- Include realistic travel time based on ${howToTravel}
- Arrival activities should be light but meaningful
- Check-in at hotel/accommodation
- Evening activities if time permits

Days 2 to ${durationDays - 1}:
- Full day of activities at ${destinationTo}
- Morning, afternoon, and evening activities
- Include meal times and breaks
- Balance sightseeing with ${mood} preference
- Each activity should have specific timing, duration, and cost
- Mark transit activities clearly

Day ${durationDays}:
- Morning activities or leisure time
- Hotel checkout
- Return journey from ${destinationTo} to ${destinationFrom}
- Include realistic travel time

For EACH day, provide:
1. Day number
2. Day title (descriptive, reflecting the activities)
3. Detailed hourly/block schedule with:
   - Exact time (e.g., "09:00", "14:30")
   - Activity description (specific and detailed)
   - Duration (e.g., "2h", "30min")
   - Transit flag (true for travel/commute, false for activities)
4. Total transit hours for the day
5. Estimated cost per person for that day (in INR)

At the end, include:
- Total estimated cost per person for entire trip
- Summary message: "✨ This is the best itinerary curated for your preferences and current travel conditions."

RETURN ONLY VALID JSON in this exact format:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Journey to ${destinationTo} & Evening Exploration",
      "items": [
        {"time": "08:00", "activity": "Depart from ${destinationFrom} via ${howToTravel}", "duration": "4h", "transit": true},
        {"time": "12:00", "activity": "Arrive at ${destinationTo}, check-in at hotel", "duration": "1h", "transit": false},
        {"time": "14:00", "activity": "Lunch at local restaurant", "duration": "1h", "transit": false},
        {"time": "16:00", "activity": "Visit main attraction", "duration": "2h", "transit": false},
        {"time": "19:00", "activity": "Dinner and evening stroll", "duration": "2h", "transit": false}
      ],
      "total_transit_hours": 4,
      "estimated_cost_per_person": 3500
    }
  ],
  "total_estimated_cost_per_person": 25000,
  "summary_message": "✨ This is the best itinerary curated for your preferences and current travel conditions."
}`;
};

export const generateAIItinerary = async (
  destinationFrom: string,
  destinationTo: string,
  monthOfTravel: string,
  budgetInINR: string,
  typeOfTravel: string,
  preferredDestinationType: string[],
  mood: string,
  howToTravel: string,
  durationDays: number
): Promise<AIItineraryResponse> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.');
  }

  try {
    const userPrompt = generateItineraryPrompt(
      destinationFrom,
      destinationTo,
      monthOfTravel,
      budgetInINR,
      typeOfTravel,
      preferredDestinationType,
      mood,
      howToTravel,
      durationDays
    );

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: AI_TRAVEL_PLANNER_SYSTEM_PROMPT },
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
    return result;
  } catch (error) {
    console.error('Failed to generate itinerary:', error);
    throw error;
  }
};

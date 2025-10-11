import { TripFormData } from '../components/TripForm';

export interface MustSee {
  name: string;
  reason: string;
  video_link: string;
}

export interface DestinationBudget {
  total_per_person: number;
  breakdown: {
    travel_to_destination?: number;
    transport?: number;
    stay: number;
    food: number;
    local_transport: number;
    activities: number;
  };
}

export interface DestinationOption {
  id: string;
  title: string;
  country: string;
  short_description: string;
  weather: {
    temperature_range: string;
    condition: string;
  };
  must_sees: MustSee[];
  approx_budget: DestinationBudget;
  pros: string[];
  con: string;
  best_months: string;
  travel_time_from_origin: string;
  accessibility_note: string;
  estimated_time_to_cover: string;
  hidden_gem: boolean;
}

export interface AIDestinationResponse {
  destinations: DestinationOption[];
}

const AI_SYSTEM_PROMPT = `You are a travel advisor for India-based travelers.

CRITICAL MATH RULE:
total_per_person = travel_to_destination + stay + food + local_transport + activities

EXAMPLE:
If breakdown is {travel: 6000, stay: 9000, food: 8000, local: 4000, activities: 3000}
Then total_per_person = 6000 + 9000 + 8000 + 4000 + 3000 = 30000

DO NOT include destinations where total > user's budget.`;

const generatePrompt = (formData: TripFormData): string => {
  const scope = formData.domesticOrIntl === 'Within India' ? 'National' : 'International';

  const budgetMax = formData.budget === 'Budget-friendly (Under ₹20k)' ? 20000
    : formData.budget === 'Mid-range (₹20k-₹50k)' ? 50000
    : 250000;

  return `Find ${scope === 'National' ? 'India' : 'international'} destinations for:

TRIP DETAILS:
- From: ${formData.startLocation}
- Duration: ${formData.days} days (${formData.days - 1} nights)
- Month: ${formData.month}
- Travel by: ${formData.travelMode}
- Type: ${formData.groupType} - ${formData.mood} mood
- Interests: ${formData.theme.join(', ')}
- BUDGET LIMIT: ₹${budgetMax} per person (TOTAL FOR EVERYTHING)

STEP-BY-STEP BUDGET CALCULATION:

For EACH destination, calculate these 5 costs:

1. travel_to_destination (${formData.travelMode} from ${formData.startLocation}):
   ${formData.travelMode === 'Flight' ? `Domestic: ₹6,000-10,000 | International: ₹25,000-40,000` : ''}
   ${formData.travelMode === 'Train' ? `₹2,000-5,000 depending on distance` : ''}
   ${formData.travelMode === 'Bus' ? `₹1,000-3,000 depending on distance` : ''}

2. stay (${formData.days - 1} nights × cost per night):
   Budget tier: ₹2,500/night × ${formData.days - 1} = ₹${(formData.days - 1) * 2500}
   Mid tier: ₹5,000/night × ${formData.days - 1} = ₹${(formData.days - 1) * 5000}

3. food (${formData.days} days × cost per day):
   ₹2,000/day × ${formData.days} = ₹${formData.days * 2000}

4. local_transport (within destination):
   ₹1,000/day × ${formData.days} = ₹${formData.days * 1000}

5. activities (tours, entry fees):
   ₹2,000-4,000 for entire trip

total_per_person = (1) + (2) + (3) + (4) + (5)

VERIFY: If total_per_person > ₹${budgetMax}, REJECT this destination

REQUIREMENTS:
- ${scope === 'National' ? 'Only destinations within India' : 'International destinations with easy visa access'}
- ${formData.days <= 3 ? 'Must be reachable within 5-6 hours' : 'Any reasonable travel time'}
- Good weather in ${formData.month}
- Matches ${formData.mood} mood

Return JSON:
{
  "destinations": [
    {
      "id": "unique-id",
      "title": "City, State/Country",
      "country": "Country",
      "short_description": "Why it's perfect for them",
      "weather": {
        "temperature_range": "20-30°C",
        "condition": "sunny/cloudy/rainy"
      },
      "must_sees": [
        {"name": "Place", "reason": "Why visit", "video_link": "https://www.youtube.com/results?search_query=City+Place"}
      ],
      "approx_budget": {
        "breakdown": {
          "travel_to_destination": 8000,
          "stay": ${(formData.days - 1) * 5000},
          "food": ${formData.days * 2000},
          "local_transport": ${formData.days * 1000},
          "activities": 3000
        },
        "total_per_person": ${8000 + ((formData.days - 1) * 5000) + (formData.days * 2000) + (formData.days * 1000) + 3000}
      },
      "_calculation_note": "total = 8000 + ${(formData.days - 1) * 5000} + ${formData.days * 2000} + ${formData.days * 1000} + 3000 = ${8000 + ((formData.days - 1) * 5000) + (formData.days * 2000) + (formData.days * 1000) + 3000}",
      "pros": ["Benefit 1", "Benefit 2"],
      "con": "One realistic drawback",
      "best_months": "Oct-Mar",
      "travel_time_from_origin": "6 hours by flight",
      "accessibility_note": "How to reach",
      "estimated_time_to_cover": "3-4 days ideal",
      "hidden_gem": false
    }
  ]
}

CRITICAL RULES:
1. Calculate total_per_person correctly: ADD all 5 breakdown values
2. Verify: total must equal sum of breakdown (travel + stay + food + local + activities)
3. If total > ₹${budgetMax}, do NOT include that destination
4. Return 1-5 destinations that fit budget, or empty array if none fit`;
};

export const generateDestinations = async (formData: TripFormData): Promise<AIDestinationResponse> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const prompt = generatePrompt(formData);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: AI_SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
        response_format: { type: 'json_object' }
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from AI');
    }

    const result = JSON.parse(content);

    const budgetMax = formData.budget === 'Budget-friendly (Under ₹20k)' ? 20000
      : formData.budget === 'Mid-range (₹20k-₹50k)' ? 50000
      : 250000;

    // Validate destinations
    console.log('🔍 Validating destinations against budget ₹' + budgetMax);

    if (result.destinations && Array.isArray(result.destinations)) {
      result.destinations = result.destinations.filter((dest: DestinationOption) => {
        const total = dest.approx_budget?.total_per_person || 0;

        if (total > budgetMax) {
          console.log(`❌ Rejected ${dest.title}: ₹${total} > ₹${budgetMax}`);
          return false;
        }

        console.log(`✅ Approved ${dest.title}: ₹${total}`);
        return true;
      });

      console.log(`📊 Final: ${result.destinations.length} destinations`);
    }

    return result;
  } catch (error) {
    console.error('Error generating destinations:', error);
    throw error;
  }
};

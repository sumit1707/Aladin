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
  error?: string;
  message?: string;
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
  const hasVisualInspiration = !!(formData.inspirationImage || formData.inspirationVideoLink);

  // Match the actual form values: '< ₹15,000', '₹15,000-₹40,000', '₹40,000-₹80,000', '₹80,000+'
  const budgetMax = formData.budget === '< ₹15,000' ? 15000
    : formData.budget === '₹15,000-₹40,000' ? 40000
    : formData.budget === '₹40,000-₹80,000' ? 80000
    : formData.budget === '₹80,000+' ? 150000
    : 15000; // default to lowest if no match

  if (hasVisualInspiration) {
    return `VISUAL INSPIRATION SEARCH - Analyze the provided ${formData.inspirationImage ? 'image' : 'video'} to understand what the customer wants.

${formData.inspirationVideoLink ? `VIDEO LINK: ${formData.inspirationVideoLink}

FIRST: Verify this is a travel/location video showing:
- Landscapes, scenery, or destinations
- Cities, towns, or tourist attractions
- Natural environments or outdoor settings

If the video is NOT about a place/location (e.g., it's about people, products, animals, food close-ups, etc.), you MUST return:
{
  "error": "invalid_content",
  "message": "The video you provided does not appear to show a travel destination or location. Please upload a video link featuring landscapes, cities, tourist attractions, or scenic places to help us find your perfect destination.",
  "destinations": []
}

If valid, analyze the video to understand:
- The landscape, scenery, and environment shown
- The atmosphere, vibe, and mood
- Activities and experiences featured
- Architecture or cultural elements
- Natural features (mountains, beaches, forests, etc.)
` : ''}

${formData.inspirationImage ? `IMAGE PROVIDED: Customer has uploaded an inspiration image (base64 encoded).

FIRST: Verify this is a travel/location image showing:
- Landscapes, scenery, or destinations
- Cities, towns, or tourist attractions
- Natural environments or outdoor settings
- Architecture or landmarks

If the image does NOT show a place/location (e.g., it's a selfie, food, products, animals, people portraits, abstract art, etc.), you MUST return:
{
  "error": "invalid_content",
  "message": "The image you uploaded does not appear to show a travel destination or location. Please upload an image featuring landscapes, cityscapes, beaches, mountains, or other scenic places to help us find destinations that match your vision.",
  "destinations": []
}

If valid, carefully analyze the image to understand:
- Type of landscape (mountains, beach, desert, city, forest, etc.)
- Visual characteristics (colors, architecture, natural features)
- Atmosphere and mood conveyed
- Cultural or architectural style
- Weather conditions visible
- Activities or scenes depicted
` : ''}

YOUR TASK (ONLY if content is valid):
Find destinations BOTH within India AND outside India that have similar views, vibes, and characteristics to what's shown in the ${formData.inspirationImage ? 'image' : 'video'}.

TRIP CONSTRAINTS:
- From: ${formData.startLocation}
- Duration: ${formData.days} days (${formData.days - 1} nights)
- Month: ${formData.month}
- Travel by: ${formData.travelMode}
- Type: ${formData.groupType} - ${formData.mood} mood
- BUDGET LIMIT: ₹${budgetMax} per person (TOTAL FOR EVERYTHING)
- Destination preference: ${formData.domesticOrIntl}

SEARCH STRATEGY:
1. First, understand the visual characteristics from the ${formData.inspirationImage ? 'image' : 'video'}
2. Find destinations that match those visual characteristics
3. Filter by budget (₹${budgetMax}) and duration (${formData.days} days)
4. Prioritize destinations based on preference: ${formData.domesticOrIntl}
5. If NO destinations match the visual inspiration within budget/duration constraints, return EMPTY destinations array

IMPORTANT:
- ONLY return destinations that truly match the visual style shown
- If the ${formData.inspirationImage ? 'image shows beaches' : 'video shows beaches'}, suggest beach destinations
- If the ${formData.inspirationImage ? 'image shows mountains' : 'video shows mountains'}, suggest mountain destinations
- If the ${formData.inspirationImage ? 'image shows cities' : 'video shows cities'}, suggest urban destinations
- Match the VIBE and ATMOSPHERE, not just the category
- If budget is too low for the type of destination shown, return empty array

STEP-BY-STEP BUDGET CALCULATION:

For EACH destination, calculate these 5 costs:

1. travel_to_destination (${formData.travelMode} from ${formData.startLocation}):
   ${formData.travelMode === 'Flight' ? `Domestic India: ₹6,000-10,000 round-trip | International: ₹25,000-40,000 round-trip (minimum)` : ''}
   ${formData.travelMode === 'Train 3A' ? `Domestic India only: ₹2,000-5,000 depending on distance` : ''}
   ${formData.travelMode === 'Train 2A' ? `Domestic India only: ₹3,000-7,000 depending on distance` : ''}
   ${formData.travelMode === 'Car' ? `Domestic India only: ₹3,000-8,000 (fuel + tolls)` : ''}

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

Return JSON:
{
  "destinations": [
    {
      "id": "unique-id",
      "title": "City, State/Country",
      "country": "Country",
      "short_description": "Why it matches the visual inspiration",
      "weather": {
        "temperature_range": "20-30°C",
        "condition": "sunny/cloudy/rainy"
      },
      "must_sees": [
        {"name": "Attraction 1", "reason": "Why this is must-see", "video_link": "https://www.youtube.com/results?search_query=City+Attraction1"},
        {"name": "Attraction 2", "reason": "Why this is must-see", "video_link": "https://www.youtube.com/results?search_query=City+Attraction2"},
        {"name": "Attraction 3", "reason": "Why this is must-see", "video_link": "https://www.youtube.com/results?search_query=City+Attraction3"}
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
4. Return 1-5 destinations that match the visual inspiration and fit budget, or empty array if none fit
5. MUST provide exactly 3 must-see attractions for EACH destination with video_link for each`
  }

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
   ${formData.travelMode === 'Flight' ? `Domestic India: ₹6,000-10,000 round-trip | International: ₹25,000-40,000 round-trip (minimum)` : ''}
   ${formData.travelMode === 'Train' ? `Domestic India only: ₹2,000-5,000 depending on distance` : ''}
   ${formData.travelMode === 'Bus' ? `Domestic India only: ₹1,000-3,000 depending on distance` : ''}
   ${formData.travelMode === 'Car' ? `Domestic India only: ₹3,000-8,000 (fuel + tolls)` : ''}

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

${scope === 'International' && budgetMax < 30000 ? `
⚠️ CRITICAL WARNING: Budget is ₹${budgetMax} but international flights alone cost ₹25,000-40,000.
International trips are IMPOSSIBLE with this budget. Return empty destinations array.
` : ''}

REQUIREMENTS:
- ${scope === 'National' ? 'Only destinations within India' : 'International destinations (Nepal, Bhutan, Sri Lanka, Thailand, Dubai, Bali)'}
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
        {"name": "Attraction 1", "reason": "Why this is must-see", "video_link": "https://www.youtube.com/results?search_query=City+Attraction1"},
        {"name": "Attraction 2", "reason": "Why this is must-see", "video_link": "https://www.youtube.com/results?search_query=City+Attraction2"},
        {"name": "Attraction 3", "reason": "Why this is must-see", "video_link": "https://www.youtube.com/results?search_query=City+Attraction3"}
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
4. Return 1-5 destinations that fit budget, or empty array if none fit
5. MUST provide exactly 3 must-see attractions for EACH destination with video_link for each`;
};

export const generateDestinations = async (formData: TripFormData): Promise<AIDestinationResponse> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const prompt = generatePrompt(formData);
    const hasVisualInspiration = !!(formData.inspirationImage || formData.inspirationVideoLink);

    // If image is provided, use vision model with image content
    const userMessage = formData.inspirationImage
      ? {
          role: 'user' as const,
          content: [
            {
              type: 'text' as const,
              text: prompt
            },
            {
              type: 'image_url' as const,
              image_url: {
                url: formData.inspirationImage
              }
            }
          ]
        }
      : {
          role: 'user' as const,
          content: prompt
        };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: hasVisualInspiration && formData.inspirationImage ? 'gpt-4o' : 'gpt-4o-mini',
        messages: [
          { role: 'system', content: AI_SYSTEM_PROMPT },
          userMessage
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

    // Check for validation error (invalid image/video content)
    if (result.error === 'invalid_content') {
      console.log('❌ Invalid content detected:', result.message);
      return {
        destinations: [],
        error: result.error,
        message: result.message
      };
    }

    // Match the actual form values
    const budgetMax = formData.budget === '< ₹15,000' ? 15000
      : formData.budget === '₹15,000-₹40,000' ? 40000
      : formData.budget === '₹40,000-₹80,000' ? 80000
      : formData.budget === '₹80,000+' ? 150000
      : 15000;

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

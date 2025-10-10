export const SYSTEM_PROMPT = `You are an expert travel planner assistant with extensive knowledge of destinations across India and the world. Your expertise includes:
- Hidden gems and unexplored destinations beyond typical tourist spots
- Local insights from traveler reviews and authentic experiences
- Comprehensive knowledge of diverse destinations matching specific themes (mountain, beach, temple, city, adventure, nature)
- Budget-conscious recommendations for Indian travelers

IMPORTANT: Search your knowledge broadly across:
- All Indian states and union territories (not just popular destinations)
- International destinations suitable for the budget and preferences
- Lesser-known, unexplored places that match the user's interests
- Destinations with authentic cultural experiences and natural beauty

Provide 5 DIVERSE destination suggestions ranked by best match to user preferences. Each destination should be UNIQUE and cater specifically to their themes, mood, group type, budget, AND trip duration. Include:
- Short description (1–2 lines) highlighting what makes it special
- 3 must-see spots (name + 1-sentence reason)
- Approximate cost in Indian Rupees (₹) per person for the trip duration (breakdown: stay, food, transport)
  CRITICAL: Travel time must be appropriate for trip duration (short trips = nearby destinations only)
  IMPORTANT: The transport cost MUST be adjusted based on the user's preferred travel mode (Car/Train 3A/Train 2A/Flight)
  - For Car: Calculate based on fuel, tolls, and driver costs if applicable
  - For Train 3A: Use 3AC class ticket prices
  - For Train 2A: Use 2AC class ticket prices
  - For Flight: Use economy flight ticket prices
- 2 pros and 1 con (short)
- Best months to visit
- Accessibility notes (CRITICAL: Include realistic travel time from starting location - ensure it matches trip duration)

For itineraries:
- List activities with estimated durations and travel times
- Daily travel time should not exceed 3–4 hours for "Relaxing" mood
- Optimize for minimal transit for "Relaxing" and more exploration for "Exploring"
- Use realistic transport times
- Keep output user-friendly for UI display

Always provide VARIED and INTERESTING destinations based on the exact user input. Never repeat the same destinations. Consider seasonal factors, current trends, and authentic experiences.`;

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
  must_sees: Array<{ name: string; reason: string; video_link?: string }>;
  approx_budget_for_3_to_5_days: {
    total_per_person: number;
    breakdown: {
      stay: number;
      food: number;
      transport: number;
    };
  };
  pros: string[];
  con: string;
  best_months: string;
  accessibility_note: string;
  estimated_time_to_cover: string;
}

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

export interface ItineraryResponse {
  itinerary: ItineraryDay[];
  total_estimated_cost_per_person: number;
}

export const generateDestinationPrompt = (formData: TripFormData): string => {
  return `CRITICAL: Provide 5 DIVERSE, UNIQUE destinations that match these EXACT requirements. DO NOT suggest generic or commonly suggested places. Think creatively about unexplored gems.

User Requirements:
- Starting Location: ${formData.startLocation} (CRITICAL: All travel times and costs should be calculated from this city)
- Travel Month: ${formData.month}
- Trip Duration: ${formData.days} days
- Number of Travelers: ${formData.travelers}
- Group Type: ${formData.groupType}
- Location Preference: ${formData.domesticOrIntl}
- Preferred Themes: ${formData.theme.join(', ')} (MUST align with these themes)
- Trip Mood: ${formData.mood}
- Budget Range: ${formData.budget} (in Indian Rupees ₹)
- Flexible Dates: ${formData.flexibleDates ? 'Yes' : 'No'}
- Travel Mode: ${formData.travelMode} (Consider this when suggesting destinations and calculating costs FROM ${formData.startLocation})

Your Task:
Search broadly across ${formData.domesticOrIntl === 'Within India' ? 'all Indian states including lesser-known regions' : 'international destinations within the budget'}. Find destinations that:
1. Perfectly match the themes: ${formData.theme.join(', ')}
2. Suit the group type: ${formData.groupType}
3. Fit the mood: ${formData.mood}
4. Are ideal for visiting in ${formData.month}
5. Stay within budget: ${formData.budget}
6. CRITICAL: Match the trip duration (${formData.days} days):
   ${formData.days <= 3 ? '- Short trip (1-3 days): Suggest destinations within 2-4 hours travel time from ' + formData.startLocation + '\n   - Avoid long-distance destinations that waste travel time\n   - Focus on nearby weekend getaways and quick escapes\n   - Prioritize destinations where you can maximize time at location vs. in transit' : formData.days <= 5 ? '- Medium trip (4-5 days): Suggest destinations within 4-8 hours travel time from ' + formData.startLocation + '\n   - Balance between travel time and destination variety\n   - Consider moderate-distance locations worth the journey\n   - Ensure at least 3 full days at destination' : '- Long trip (6+ days): Can suggest destinations up to 10-12 hours travel time from ' + formData.startLocation + '\n   - Longer travel times are acceptable for extended stays\n   - Can include far-flung or remote destinations\n   - Justify longer journeys with unique experiences'}

For EACH of the 5 destinations provide:
- Destination name and country (if outside India)
- Compelling 1-2 line description explaining why it's perfect for this user
- THREE must-see attractions with specific reasons AND YouTube video links for each attraction (search for popular travel videos)
- Realistic budget breakdown in Indian Rupees (₹) for ${formData.days} days covering stay, food, and transport
  CRITICAL: Adjust transport costs based on travel mode "${formData.travelMode}":
  * Car: Include fuel costs, tolls, parking (₹8-12 per km for round trip)
  * Train 3A: Use 3AC class ticket prices (moderate pricing)
  * Train 2A: Use 2AC class ticket prices (higher than 3AC)
  * Flight: Use economy flight ticket prices (highest cost)
- TWO specific pros and ONE realistic con
- Best months to visit this destination
- Accessibility details (CRITICAL: how to reach from ${formData.startLocation} specifically, including travel time and distance)
  IMPORTANT: Travel time appropriateness for ${formData.days}-day trip:
  ${formData.days <= 3 ? '* For 1-3 day trips: ONLY suggest destinations within 2-4 hours one-way travel\n  * Travel taking more than 4 hours wastes precious time on short trips' : formData.days <= 5 ? '* For 4-5 day trips: Suggest destinations within 4-8 hours one-way travel\n  * Avoid destinations requiring more than 8 hours travel' : '* For 6+ day trips: Can suggest destinations up to 10-12 hours travel\n  * Longer journeys justified by extended stays'}
- Estimated time to cover all major attractions (e.g., "2-3 days to see all main spots", "4-5 days for complete exploration")

RETURN ONLY VALID JSON in this exact format:
{
  "options": [
    {
      "id": "unique-id",
      "title": "Destination Name",
      "country": "Country Name or India",
      "short_description": "Why this destination is perfect",
      "must_sees": [
        {"name": "Attraction 1", "reason": "Why visit", "video_link": "https://youtube.com/watch?v=example1"},
        {"name": "Attraction 2", "reason": "Why visit", "video_link": "https://youtube.com/watch?v=example2"},
        {"name": "Attraction 3", "reason": "Why visit", "video_link": "https://youtube.com/watch?v=example3"}
      ],
      "approx_budget_for_3_to_5_days": {
        "total_per_person": 25000,
        "breakdown": {"stay": 10000, "food": 8000, "transport": 7000}
      },
      "pros": ["Specific advantage 1", "Specific advantage 2"],
      "con": "One realistic drawback",
      "best_months": "Month range",
      "accessibility_note": "How to reach from major Indian cities",
      "estimated_time_to_cover": "2-3 days (recommended duration to see all major attractions)"
    }
  ],
  "next": "Which destination interests you most?"
}`;
};

export const generateItineraryPrompt = (
  destination: DestinationOption,
  days: number,
  mood: string,
  budget: string,
  startLocation: string
): string => {
  const transitLimit = mood === 'Relaxing' ? 4 : 6;

  return `Create a detailed ${days}-day itinerary for ${destination.title}.
Starting Location: ${startLocation}
Trip Mood: ${mood}
Budget Category: ${budget}

CRITICAL REQUIREMENTS:
- Day 1 MUST include travel from ${startLocation} to ${destination.title} with realistic travel times
- Last day (Day ${days}) MUST include return journey from ${destination.title} to ${startLocation}
- ${days <= 3 ? 'SHORT TRIP ALERT: Maximize time at destination. Keep Day 1 arrival activities light but meaningful. Day ' + days + ' should have morning activities before departure.' : days <= 5 ? 'MEDIUM TRIP: Balance exploration with relaxation. Ensure full days of activities on days 2-' + (days - 1) + '.' : 'LONG TRIP: Can include day trips and varied experiences. Pace activities across all days with rest periods.'}
- Daily transit time MUST NOT exceed ${transitLimit} hours (excluding arrival/departure days)
- Activities and accommodations MUST align with the ${budget} budget category
- Cost estimates in Indian Rupees (₹) per day per person
- Include authentic local experiences matching the budget level
- Realistic activity timing with buffer time
- Include travel times between locations
- Mix popular attractions with off-beat experiences based on budget
- Consider the destination's best features and local culture

Budget Guidelines for ${budget}:
${budget === 'Budget (<₹20k)' ? '- Focus on affordable guesthouses, street food, and free/low-cost activities\n- Public transport and shared cabs\n- Local eateries and budget restaurants\n- Daily cost: ₹1,500-2,500 per person' : budget === 'Mid-range (₹20k-₹50k)' ? '- Comfortable 3-star hotels or good homestays\n- Mix of local restaurants and good dining options\n- Some paid activities and guided tours\n- Mix of public and private transport\n- Daily cost: ₹2,500-4,500 per person' : '- Premium 4-5 star hotels or luxury resorts\n- Fine dining and premium restaurants\n- Private transport, guided tours, premium activities\n- Spa treatments and exclusive experiences\n- Daily cost: ₹4,500-8,000+ per person'}

Mood-Based Planning for ${mood}:
${mood === 'Relaxing' ? '- Prioritize leisure, spa, beaches, minimal movement\n- Long breaks between activities (2-3 hour gaps)\n- Comfortable pace with optional activities\n- Focus on rejuvenation and peace' : mood === 'Exploring' ? '- Pack in diverse experiences across the day\n- Mix of culture, nature, adventure, and food\n- Moderate pace with variety (5-7 activities per day)\n- Balance indoor and outdoor experiences' : mood === 'Party' ? '- Nightlife, beach clubs, bars, social events\n- Late starts (11 AM-12 PM), active evenings and nights\n- Vibrant atmosphere with music and entertainment\n- End days late (past midnight)' : '- Cultural sites, museums, temples, heritage\n- Local interactions, traditional experiences\n- Immersive activities like cooking classes, workshops\n- Focus on learning and authentic experiences'}

RETURN ONLY VALID JSON:
{
  "itinerary": [
    {
      "day": 1,
      "title": "Descriptive day title reflecting mood",
      "items": [
        {"time": "09:00", "activity": "Specific budget-appropriate activity with details", "duration": "2h", "transit": false},
        {"time": "11:30", "activity": "Travel to location", "duration": "30min", "transit": true}
      ],
      "total_transit_hours": 1.5,
      "estimated_cost_per_person": 3500
    }
  ],
  "total_estimated_cost_per_person": 28000
}`;
};

const callOpenAI = async (prompt: string, systemPrompt: string): Promise<any> => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
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

    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI API call failed:', error);
    throw error;
  }
};

// Calculate transport cost based on travel mode and destination distance
const calculateTransportCost = (travelMode: string, destinationType: 'nearby' | 'moderate' | 'far'): number => {
  const distanceMultipliers = {
    nearby: 1,      // ~300-500km
    moderate: 1.5,  // ~500-1000km
    far: 2.5        // ~1000-2000km
  };

  const baseCosts = {
    'Car': 2500,        // Base cost for car travel (fuel, tolls, parking)
    'Train 3A': 1800,   // 3AC train tickets
    'Train 2A': 2800,   // 2AC train tickets
    'Flight': 6000      // Economy flight tickets
  };

  const multiplier = distanceMultipliers[destinationType];
  return Math.round((baseCosts[travelMode] || baseCosts['Train 3A']) * multiplier);
};

export interface HotelOption {
  id: string;
  name: string;
  category: string;
  image_url: string;
  description: string;
  amenities: string[];
  price_per_night: number;
  rating: number;
  location: string;
  booking_link: string;
  highlights: string[];
}

export interface HotelRecommendationResponse {
  hotels: HotelOption[];
  message: string;
}

export const generateHotelPrompt = (
  destinationName: string,
  roomType: string,
  adults: number,
  children: number,
  seniors: number,
  specialRequests: string,
  budget?: string
): string => {
  const totalGuests = adults + children + seniors;
  const starCategory = roomType.replace('-star', '');

  const budgetGuidelines = budget === 'Budget (<₹20k)'
    ? '- STRICT BUDGET: Focus on budget-friendly, value-for-money accommodations\n- Prefer guesthouses, homestays, and budget hotels\n- Prioritize clean, safe properties with basic amenities\n- Price range MUST be: ₹1,200-2,500 per night\n- NO luxury properties or high-end amenities'
    : budget === 'Mid-range (₹20k-₹50k)'
    ? '- MODERATE BUDGET: Balance comfort with value\n- Focus on comfortable 3-4 star hotels with good amenities\n- Standard amenities expected: WiFi, AC, restaurant, room service\n- Price range MUST be: ₹2,500-6,000 per night\n- Avoid ultra-luxury properties'
    : '- LUXURY BUDGET: Premium experiences and top-tier accommodations\n- Focus on 4-5 star luxury hotels and resorts\n- Premium amenities: spa, fine dining, concierge, exclusive experiences\n- Price range: ₹6,000-20,000+ per night\n- Emphasize luxury, comfort, and exceptional service';

  return `Recommend 3 hotels in ${destinationName} for the following requirements:
- Category: ${starCategory}-star hotels
- Trip Budget: ${budget || 'Not specified'}
- Guests: ${adults} adults${children > 0 ? `, ${children} children` : ''}${seniors > 0 ? `, ${seniors} seniors` : ''} (Total: ${totalGuests} people)
- Special Requests: ${specialRequests || 'None'}

CRITICAL BUDGET ALIGNMENT:
${budgetGuidelines}

IMPORTANT: Hotels and amenities MUST strictly match the trip budget category. Do not recommend lavish 5-star properties for budget trips or basic guesthouses for luxury trips.

MATCHING CRITERIA:
${roomType === '3-star' && budget === 'Budget (<₹20k)' ? '- Focus on clean, safe budget hotels\n- Basic amenities: WiFi, AC, clean rooms\n- Price: ₹1,500-3,000 per night\n- Good reviews for value and cleanliness' : ''}${roomType === '4-star' && budget === 'Mid-range (₹20k-₹50k)' ? '- Focus on comfortable upscale hotels\n- Standard amenities: Pool, gym, restaurant, room service\n- Price: ₹4,000-7,000 per night\n- Balance of comfort and value' : ''}${roomType === '5-star' && budget === 'Luxury (>₹50k)' ? '- Focus on luxury hotels and resorts\n- Premium amenities: Spa, fine dining, concierge, exclusive experiences\n- Price: ₹8,000-20,000+ per night\n- Exceptional service and lavish accommodations' : ''}

For each hotel include:
- Real hotel name (existing property in ${destinationName})
- Accurate ${starCategory}-star category description
- Valid Pexels image URL (use actual Pexels URLs for hotels/resorts)
- 4-5 key amenities matching the star category
- Price per night in ₹ (realistic for ${starCategory}-star)
- Rating out of 5
- Specific location in ${destinationName}
- Booking link
- 3-4 highlights that make it special

RETURN ONLY VALID JSON:
{
  "hotels": [
    {
      "id": "hotel-1",
      "name": "Actual Hotel Name",
      "category": "${starCategory}-Star",
      "image_url": "https://images.pexels.com/photos/[VALID-ID]/pexels-photo-[VALID-ID].jpeg",
      "description": "Detailed description highlighting ${starCategory}-star features",
      "amenities": ["Free WiFi", "Swimming Pool", "Restaurant", "Room Service", "Parking"],
      "price_per_night": 5000,
      "rating": 4.5,
      "location": "Specific area in ${destinationName}",
      "booking_link": "https://www.booking.com/search?ss=${encodeURIComponent(destinationName)}",
      "highlights": ["Highlight 1", "Highlight 2", "Highlight 3"]
    }
  ],
  "message": "Found 3 excellent ${starCategory}-star hotels in ${destinationName}"
}`;
};

export const mockLLMCall = async (prompt: string, isItinerary: boolean = false, travelMode: string = 'Train 3A'): Promise<any> => {
  // Use OpenAI API for real recommendations
  try {
    const result = await callOpenAI(prompt, SYSTEM_PROMPT);
    return result;
  } catch (error) {
    console.error('Failed to get AI recommendations, using fallback:', error);
    // Fallback to mock data if API fails
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (isItinerary) {
      return {
        itinerary: [
          {
            day: 1,
            title: "Arrival & Beach Relaxation",
            items: [
              { time: "10:00", activity: "Arrive at destination airport", duration: "~4h", transit: true },
              { time: "14:00", activity: "Check-in at beachfront resort", duration: "1h", transit: false },
              { time: "16:00", activity: "Relax at the beach and watch sunset", duration: "3h", transit: false },
              { time: "19:30", activity: "Dinner at local seafood restaurant", duration: "1.5h", transit: false }
            ],
            total_transit_hours: 4,
            estimated_cost_per_person: 2800
          },
          {
            day: 2,
            title: "Local Exploration",
            items: [
              { time: "09:00", activity: "Breakfast at hotel", duration: "1h", transit: false },
              { time: "10:30", activity: "Visit famous temple (30 min drive)", duration: "2h", transit: true },
              { time: "13:00", activity: "Lunch at local restaurant", duration: "1h", transit: false },
              { time: "15:00", activity: "Beach water sports activities", duration: "3h", transit: false },
              { time: "19:00", activity: "Evening market walk and dinner", duration: "2h", transit: false }
            ],
            total_transit_hours: 0.5,
            estimated_cost_per_person: 3200
          },
          {
            day: 3,
            title: "Return Journey & Departure",
            items: [
              { time: "08:00", activity: "Breakfast and hotel checkout", duration: "1h", transit: false },
              { time: "09:30", activity: "Last minute shopping and local market visit", duration: "1.5h", transit: false },
              { time: "11:30", activity: "Transfer to airport/station for return journey", duration: "1h", transit: true },
              { time: "13:00", activity: "Depart to starting location", duration: "3-4h", transit: true },
              { time: "17:00", activity: "Arrive back home", duration: "~", transit: true }
            ],
            total_transit_hours: 5,
            estimated_cost_per_person: 2500
          }
        ],
        total_estimated_cost_per_person: 8500
      };
    }

    const goaTransport = calculateTransportCost(travelMode, 'moderate');
    const manaliTransport = calculateTransportCost(travelMode, 'moderate');
    const keralaTransport = calculateTransportCost(travelMode, 'far');
    const rishikeshTransport = calculateTransportCost(travelMode, 'nearby');
    const coorgTransport = calculateTransportCost(travelMode, 'moderate');

    return {
      options: [
        {
          id: "goa",
          title: "Goa",
          country: "India",
          short_description: "India's beach paradise with Portuguese heritage, stunning coastlines, vibrant nightlife, and a perfect blend of relaxation and adventure.",
          must_sees: [
            { name: "Baga Beach", reason: "Famous for water sports, beach shacks, and stunning sunsets", video_link: "https://www.youtube.com/watch?v=kXJRzXU7OVE" },
            { name: "Old Goa Churches", reason: "UNESCO World Heritage Sites showcasing Portuguese architecture", video_link: "https://www.youtube.com/watch?v=DQw4w9WgXcQ" },
            { name: "Dudhsagar Waterfalls", reason: "Majestic four-tiered waterfall surrounded by lush forests", video_link: "https://www.youtube.com/watch?v=ZVijr-ys6bQ" }
          ],
          approx_budget_for_3_to_5_days: {
            total_per_person: 150 + 120 + goaTransport,
            breakdown: { stay: 150, food: 120, transport: goaTransport }
          },
          pros: ["Beautiful beaches with water sports", "Great food and nightlife scene"],
          con: "Can be crowded during peak season",
          best_months: "Nov-Feb",
          accessibility_note: "2-3h flight from Delhi/Mumbai; well-connected by road and rail",
          estimated_time_to_cover: "3-4 days to explore beaches, churches, and waterfalls"
        },
        {
          id: "manali",
          title: "Manali",
          country: "India",
          short_description: "Himalayan hill station offering snow-capped mountains, adventure sports, ancient temples, and serene valleys perfect for nature lovers.",
          must_sees: [
            { name: "Solang Valley", reason: "Adventure hub for paragliding, zorbing, and skiing in winter", video_link: "https://www.youtube.com/watch?v=iFKJmrfMhcg" },
            { name: "Rohtang Pass", reason: "High-altitude pass with breathtaking snow views and landscapes", video_link: "https://www.youtube.com/watch?v=BfYR0ymhEFs" },
            { name: "Hidimba Temple", reason: "Ancient wooden temple surrounded by cedar forests", video_link: "https://www.youtube.com/watch?v=Jx3sSx0UB3Q" }
          ],
          approx_budget_for_3_to_5_days: {
            total_per_person: 180 + 120 + manaliTransport,
            breakdown: { stay: 180, food: 120, transport: manaliTransport }
          },
          pros: ["Stunning mountain scenery", "Perfect for adventure activities"],
          con: "Road journey can be long and tiring",
          best_months: "Oct-Feb (snow), Apr-Jun (summer)",
          accessibility_note: "14h drive from Delhi or 1h flight to Kullu + 2h drive",
          estimated_time_to_cover: "4-5 days to see valley, passes, and adventure activities"
        },
        {
          id: "kerala",
          title: "Kerala Backwaters",
          country: "India",
          short_description: "God's Own Country offering tranquil backwaters, lush greenery, ayurvedic treatments, and rich cultural experiences in a tropical paradise.",
          must_sees: [
            { name: "Alleppey Houseboat", reason: "Cruise through serene backwaters in traditional kettuvallam", video_link: "https://www.youtube.com/watch?v=3G7KQJCZFt8" },
            { name: "Munnar Tea Plantations", reason: "Rolling hills covered in tea gardens with cool climate", video_link: "https://www.youtube.com/watch?v=b8HO6hba9ZE" },
            { name: "Periyar Wildlife Sanctuary", reason: "Spot elephants and diverse wildlife in natural habitat", video_link: "https://www.youtube.com/watch?v=LDU_Txk06tM" }
          ],
          approx_budget_for_3_to_5_days: {
            total_per_person: 200 + 130 + keralaTransport,
            breakdown: { stay: 200, food: 130, transport: keralaTransport }
          },
          pros: ["Unique houseboat experience", "Peaceful and rejuvenating"],
          con: "Can be humid during summer months",
          best_months: "Sep-Mar",
          accessibility_note: "2-3h flight to Kochi from major cities; well-connected",
          estimated_time_to_cover: "4-5 days to cover backwaters, tea gardens, and wildlife"
        },
        {
          id: "rishikesh",
          title: "Rishikesh",
          country: "India",
          short_description: "Yoga capital of the world nestled in the Himalayan foothills, offering spiritual experiences, adventure sports, and the sacred Ganges River.",
          must_sees: [
            { name: "Laxman Jhula", reason: "Iconic suspension bridge with stunning river and mountain views", video_link: "https://www.youtube.com/watch?v=YwUb91fBXIQ" },
            { name: "River Rafting", reason: "Thrilling white water rafting experience on the Ganges", video_link: "https://www.youtube.com/watch?v=pP3TJxjb5fE" },
            { name: "Beatles Ashram", reason: "Historic meditation center with vibrant graffiti art", video_link: "https://www.youtube.com/watch?v=7BL2eka_qfA" }
          ],
          approx_budget_for_3_to_5_days: {
            total_per_person: 130 + 100 + rishikeshTransport,
            breakdown: { stay: 130, food: 100, transport: rishikeshTransport }
          },
          pros: ["Perfect for adventure and spirituality", "Budget-friendly destination"],
          con: "Can get very crowded during festivals",
          best_months: "Sep-Nov, Feb-May",
          accessibility_note: "6-7h drive from Delhi or train to Haridwar + 1h taxi",
          estimated_time_to_cover: "2-3 days for main attractions and activities"
        },
        {
          id: "coorg",
          title: "Coorg",
          country: "India",
          short_description: "Scotland of India featuring misty coffee plantations, cascading waterfalls, and lush green landscapes perfect for nature enthusiasts.",
          must_sees: [
            { name: "Abbey Falls", reason: "Picturesque waterfall surrounded by coffee and spice plantations", video_link: "https://www.youtube.com/watch?v=3KQ4xLkqpxI" },
            { name: "Raja's Seat", reason: "Beautiful sunset viewpoint with panoramic valley views", video_link: "https://www.youtube.com/watch?v=QqHr4gV4Jqk" },
            { name: "Dubare Elephant Camp", reason: "Interactive elephant experiences and river activities", video_link: "https://www.youtube.com/watch?v=PX3f8N0cjhU" }
          ],
          approx_budget_for_3_to_5_days: {
            total_per_person: 160 + 110 + coorgTransport,
            breakdown: { stay: 160, food: 110, transport: coorgTransport }
          },
          pros: ["Pleasant weather year-round", "Rich coffee culture and cuisine"],
          con: "Limited nightlife and entertainment options",
          best_months: "Oct-Mar",
          accessibility_note: "5-6h drive from Bangalore or train to Mysore + 3h drive",
          estimated_time_to_cover: "3-4 days to explore plantations, waterfalls, and nature"
        }
      ],
      next: "Which option would you like to finalize?"
    };
  }
};

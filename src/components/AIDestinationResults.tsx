import { useState } from 'react';
import { DestinationOption } from '../lib/aiDestinations';
import { MapPin, Calendar, DollarSign, ThermometerSun, Star, TrendingUp, Youtube } from 'lucide-react';

interface AIDestinationResultsProps {
  destinations: DestinationOption[];
  onSelectDestination: (destination: DestinationOption) => void;
  onBack: () => void;
}

export default function AIDestinationResults({ destinations, onSelectDestination, onBack }: AIDestinationResultsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSelect = (destination: DestinationOption) => {
    setSelectedId(destination.id);
    setTimeout(() => {
      onSelectDestination(destination);
    }, 300);
  };

  if (!destinations || destinations.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-br from-emerald-900/50 to-black/50 backdrop-blur-xl border-2 border-emerald-500/50 rounded-2xl shadow-2xl p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 bg-emerald-500/20 rounded-full flex items-center justify-center">
              <DollarSign className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-bold text-emerald-400 mb-3">
              No Destinations Found
            </h2>
            <p className="text-emerald-300/80 text-lg mb-6">
              Unfortunately, we couldn't find any destinations that match your preferences within your specified budget.
            </p>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6">
              <p className="text-emerald-300 text-sm">
                Try adjusting your search criteria:
              </p>
              <ul className="text-emerald-300/70 text-sm mt-2 space-y-1">
                <li>• Increase your budget range</li>
                <li>• Choose a shorter trip duration</li>
                <li>• Select domestic destinations instead of international</li>
                <li>• Consider traveling during off-peak season</li>
              </ul>
            </div>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/30"
            >
              Modify Search Criteria
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 bg-clip-text text-transparent mb-3 drop-shadow-lg">
          Your Perfect Destinations
        </h1>
        <p className="text-emerald-300/80 text-lg">
          {destinations.length === 1
            ? 'Found 1 destination matching your criteria'
            : `AI-curated ${destinations.length} destinations tailored just for you`}
        </p>
        {destinations.length < 5 && (
          <p className="text-emerald-400/70 text-sm mt-2">
            Only {destinations.length} destination{destinations.length > 1 ? 's' : ''} found within your budget
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        {destinations.map((destination, index) => (
          <div
            key={destination.id}
            className={`bg-gradient-to-br from-black/60 via-emerald-950/40 to-black/60 backdrop-blur-xl border-2 ${
              selectedId === destination.id ? 'border-emerald-400' : 'border-emerald-400/50'
            } rounded-2xl shadow-2xl shadow-emerald-500/40 p-6 transition-all hover:scale-[1.02] hover:shadow-emerald-500/60 cursor-pointer relative overflow-hidden`}
            onClick={() => handleSelect(destination)}
          >
            {destination.hidden_gem && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-white" />
                Hidden Gem
              </div>
            )}

            <div className="flex items-start gap-4 mb-4">
              <div className="bg-emerald-500/20 rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl font-bold text-emerald-300">{index + 1}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-emerald-300 mb-1">
                  {destination.title}
                  {destination.country && destination.country !== 'India' && (
                    <span className="text-sm font-normal text-emerald-400/70 ml-2">({destination.country})</span>
                  )}
                </h2>
                <p className="text-emerald-200/80 text-sm leading-relaxed">{destination.short_description}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="bg-black/30 rounded-lg p-3 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <ThermometerSun className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400/70 font-semibold">Weather</span>
                </div>
                <p className="text-emerald-300 text-sm font-medium">{destination.weather.temperature_range}</p>
                <p className="text-emerald-300/70 text-xs capitalize">{destination.weather.condition}</p>
              </div>

              <div className="bg-black/30 rounded-lg p-3 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400/70 font-semibold">Budget</span>
                </div>
                <p className="text-emerald-300 text-sm font-medium">
                  ₹{destination.approx_budget.total_per_person.toLocaleString()}
                </p>
                <p className="text-emerald-300/70 text-xs">per person</p>
              </div>

              <div className="bg-black/30 rounded-lg p-3 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400/70 font-semibold">Travel Time</span>
                </div>
                <p className="text-emerald-300 text-sm font-medium">{destination.travel_time_from_origin}</p>
              </div>

              <div className="bg-black/30 rounded-lg p-3 border border-emerald-500/30">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs text-emerald-400/70 font-semibold">Best Time</span>
                </div>
                <p className="text-emerald-300 text-sm font-medium">{destination.best_months}</p>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-emerald-300 mb-3 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Must-See Attractions
              </h3>
              <div className="space-y-2">
                {destination.must_sees.map((attraction, idx) => (
                  <div key={idx} className="bg-black/20 rounded-lg p-3 border border-emerald-500/20">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <p className="text-emerald-300 font-medium text-sm mb-1">{attraction.name}</p>
                        <p className="text-emerald-200/70 text-xs">{attraction.reason}</p>
                      </div>
                      {attraction.video_link && (
                        <a
                          href={attraction.video_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-shrink-0 bg-red-600 hover:bg-red-700 rounded-full p-2 transition-colors"
                        >
                          <Youtube className="w-4 h-4 text-white" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-xs font-semibold text-emerald-400/70 mb-2 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  Pros
                </h3>
                <ul className="space-y-1">
                  {destination.pros.map((pro, idx) => (
                    <li key={idx} className="text-emerald-300/90 text-xs flex items-start gap-1">
                      <span className="text-emerald-400 mt-0.5">✓</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-emerald-400/70 mb-2">Con</h3>
                <p className="text-emerald-300/70 text-xs flex items-start gap-1">
                  <span className="text-amber-400 mt-0.5">⚠</span>
                  {destination.con}
                </p>
              </div>
            </div>

            <div className="bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/20 mb-4">
              <p className="text-emerald-300/80 text-xs">
                <span className="font-semibold text-emerald-300">Budget Breakdown:</span> Stay ₹
                {destination.approx_budget.breakdown.stay.toLocaleString()} • Food ₹
                {destination.approx_budget.breakdown.food.toLocaleString()} • Transport ₹
                {destination.approx_budget.breakdown.transport.toLocaleString()} • Activities ₹
                {destination.approx_budget.breakdown.activities.toLocaleString()}
              </p>
            </div>

            <div className="bg-black/30 rounded-lg p-3 border border-emerald-500/20 text-xs text-emerald-300/70 space-y-1">
              <p>
                <span className="font-semibold text-emerald-300">Accessibility:</span> {destination.accessibility_note}
              </p>
              <p>
                <span className="font-semibold text-emerald-300">Recommended Duration:</span>{' '}
                {destination.estimated_time_to_cover}
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-emerald-500/20 text-center">
              <button className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-2 rounded-lg font-semibold text-sm transition-all">
                Select This Destination
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={onBack}
          className="bg-black/50 border border-emerald-500/50 text-emerald-300 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-500/20 transition-all"
        >
          ← Back to Search
        </button>
      </div>
    </div>
  );
}

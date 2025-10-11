import { DestinationOption } from '../lib/aiDestinations';
import { MapPin, DollarSign, Calendar, Plane, ThumbsUp, ThumbsDown, ArrowLeft, Video, Clock } from 'lucide-react';

interface DestinationCardsProps {
  options: DestinationOption[];
  onSelect: (option: DestinationOption) => void;
  onBack?: () => void;
}

export default function DestinationCards({ options, onSelect, onBack }: DestinationCardsProps) {
  return (
    <div className="w-full max-w-6xl max-h-[95vh] overflow-y-auto px-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-emerald-400">Recommended Destinations</h2>
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-900/30 border border-emerald-500/40 text-emerald-300 rounded-lg hover:bg-emerald-900/50 hover:border-emerald-500/60 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {options.map((option, index) => (
          <div key={option.id} className="bg-black/40 backdrop-blur-md border-2 border-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20 overflow-hidden hover:shadow-xl hover:shadow-emerald-500/30 transition-all">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold">{option.title}</h3>
                  {option.country && <p className="text-emerald-100 text-sm">{option.country}</p>}
                </div>
                <div className="bg-white text-emerald-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
              </div>
            </div>

            <div className="p-5">
              <p className="text-emerald-300 text-sm mb-4">{option.short_description}</p>

              <div className="mb-4">
                <h4 className="font-semibold text-emerald-400 mb-2 flex items-center text-sm">
                  <MapPin className="w-4 h-4 mr-1" /> Must-See Spots
                </h4>
                <ul className="space-y-2">
                  {option.must_sees.map((spot, i) => (
                    <li key={i} className="text-xs">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <span className="font-medium text-emerald-300">{spot.name}:</span>
                          <span className="text-emerald-400/70"> {spot.reason}</span>
                        </div>
                        {spot.video_link && (
                          <a
                            href={spot.video_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 flex-shrink-0 text-red-500 hover:text-red-400 transition-colors"
                            title="Watch video"
                          >
                            <Video className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-emerald-900/30 rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-emerald-300 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" /> Budget
                  </span>
                  <span className="text-lg font-bold text-emerald-400">
                    ₹{option.approx_budget.total_per_person.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="text-xs text-emerald-400/70 space-y-1">
                  <div className="flex justify-between">
                    <span>Stay:</span>
                    <span>₹{option.approx_budget.breakdown.stay.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Food:</span>
                    <span>₹{option.approx_budget.breakdown.food.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport:</span>
                    <span>₹{option.approx_budget.breakdown.transport.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4 space-y-2">
                <div className="flex items-start text-xs">
                  <ThumbsUp className="w-4 h-4 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    {option.pros.map((pro, i) => (
                      <p key={i} className="text-emerald-300">{pro}</p>
                    ))}
                  </div>
                </div>
                <div className="flex items-start text-xs">
                  <ThumbsDown className="w-4 h-4 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-emerald-300">{option.con}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4 text-xs">
                <div className="flex items-center text-emerald-300">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="font-medium">Best months:</span>
                  <span className="ml-1">{option.best_months}</span>
                </div>
                <div className="flex items-start text-emerald-300">
                  <Plane className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                  <span className="text-xs">{option.accessibility_note}</span>
                </div>
                {option.estimated_time_to_cover && (
                  <div className="flex items-start text-emerald-300">
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-xs">{option.estimated_time_to_cover}</span>
                  </div>
                )}
              </div>

              <button
                onClick={() => onSelect(option)}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-2 rounded-lg font-semibold transition-all transform hover:scale-[1.02] shadow-lg shadow-emerald-500/30 text-sm"
              >
                Select This Destination
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

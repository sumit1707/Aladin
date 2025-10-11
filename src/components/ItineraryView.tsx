import { useState } from 'react';
import { HotelOption } from '../lib/llm';
import { ItineraryDay } from '../lib/aiItinerary';
import { Clock, DollarSign, Car, MapPin, Download, Save, ArrowLeft, X } from 'lucide-react';
import BookingForm, { BookingFormData } from './BookingForm';
import HotelOptions from './HotelOptions';

interface ItineraryViewProps {
  itinerary: ItineraryDay[];
  totalCost: number;
  destinationName: string;
  tripBudget?: string;
  summaryMessage?: string;
  onSave: () => void;
  onExport: () => void;
  onBack: () => void;
  onBackToDestinations?: () => void;
  onBookingSubmit?: (bookingData: BookingFormData, customerDetails: { name: string; email: string; phone: string }) => Promise<void>;
  saving: boolean;
}

export default function ItineraryView({
  itinerary,
  totalCost,
  destinationName,
  tripBudget,
  summaryMessage,
  onSave,
  onExport,
  onBack,
  onBackToDestinations,
  onBookingSubmit,
  saving
}: ItineraryViewProps) {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showHotelOptions, setShowHotelOptions] = useState(false);
  const [hotelOptions, setHotelOptions] = useState<HotelOption[]>([]);
  const [loadingHotels, setLoadingHotels] = useState(false);
  const [bookingData, setBookingData] = useState<BookingFormData | null>(null);

  const handleBookingFormSubmit = async (data: BookingFormData) => {
    setBookingData(data);

    if (onBookingSubmit) {
      await onBookingSubmit(data, {
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone
      });
    }

    setShowBookingForm(false);
  };

  return (
    <div className="w-full max-w-5xl max-h-[95vh] overflow-y-auto">
      <div className="bg-black/40 backdrop-blur-md border-2 border-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20 p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-2xl font-bold text-emerald-400">{destinationName} Itinerary</h2>
            <p className="text-emerald-300 text-sm mt-1">{itinerary.length} days of adventure</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-emerald-300">Total Estimated Cost</p>
            <p className="text-2xl font-bold text-emerald-400">₹{totalCost.toLocaleString('en-IN')}</p>
            <p className="text-xs text-emerald-400/70">per person</p>
          </div>
        </div>

        <div className="flex gap-3 flex-wrap">
          {onBackToDestinations && (
            <button
              onClick={onBackToDestinations}
              className="flex items-center gap-2 px-4 py-2 border border-emerald-500/50 text-emerald-300 rounded-lg hover:bg-emerald-900/30 transition-colors font-semibold"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Destinations
            </button>
          )}
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-colors disabled:opacity-50 shadow-lg shadow-green-500/30 font-semibold"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Trip'}
          </button>
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/30 font-semibold"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
          <button
            onClick={() => setShowBookingModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg transition-colors shadow-lg shadow-amber-500/30 font-semibold"
          >
            Need Help Booking?
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 border border-emerald-500/50 text-emerald-300 rounded-lg hover:bg-emerald-900/30 transition-colors ml-auto font-semibold"
          >
            Start New Trip
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {itinerary.map((day) => (
          <div key={day.day} className="bg-black/40 backdrop-blur-md border-2 border-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold">Day {day.day}</h3>
                  <p className="text-emerald-100 text-sm">{day.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-emerald-100">Daily Cost</p>
                  <p className="text-xl font-bold">₹{day.estimated_cost_per_person.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="space-y-4">
                {day.items.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b border-emerald-500/20 last:border-0">
                    <div className="flex-shrink-0 w-16 text-center">
                      <div className="bg-emerald-900/30 text-emerald-400 rounded-lg px-2 py-1 text-sm font-semibold">
                        {item.time}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        {item.transit ? (
                          <Car className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        ) : (
                          <MapPin className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-emerald-300 font-medium">{item.activity}</p>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-emerald-400/70 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {item.duration}
                            </span>
                            {item.transit && (
                              <span className="text-xs text-orange-400 font-medium">Transit time</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-emerald-500/30">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-emerald-300 flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Total transit time:
                  </span>
                  <span className="font-semibold text-emerald-400">
                    {day.total_transit_hours} hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-black/40 backdrop-blur-md border-2 border-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20 p-6 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-emerald-500" />
            <div>
              <p className="text-sm text-emerald-300">Total Trip Cost</p>
              <p className="text-2xl font-bold text-emerald-400">₹{totalCost} per person</p>
            </div>
          </div>
          <p className="text-xs text-emerald-400/70 max-w-xs text-right">
            All costs are approximate. Please verify with live sources for exact pricing.
          </p>
        </div>
        {summaryMessage && (
          <div className="mt-4 pt-4 border-t border-emerald-500/30 text-center">
            <p className="text-emerald-300 text-lg font-medium">{summaryMessage}</p>
          </div>
        )}
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-emerald-900/95 to-black/95 border-2 border-emerald-500 rounded-xl shadow-2xl shadow-emerald-500/30 max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 text-emerald-300 hover:text-emerald-100 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-bold text-emerald-400 mb-4">Need Help Planning & Booking?</h3>
            <p className="text-emerald-300 mb-6">
              Would you like our travel experts to help you plan and book this trip? We'll handle all the reservations,
              bookings, and logistics to make your journey seamless.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setShowBookingForm(true);
                }}
                className="w-full py-3 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-emerald-500/30"
              >
                Yes, I Need Help
              </button>
              <button
                onClick={() => setShowBookingModal(false)}
                className="w-full py-3 px-4 border border-emerald-500/50 text-emerald-300 rounded-lg hover:bg-emerald-900/30 transition-colors font-semibold"
              >
                No, I'll Book Myself
              </button>
            </div>
          </div>
        </div>
      )}

      {showBookingForm && (
        <BookingForm
          destinationName={destinationName}
          tripBudget={tripBudget}
          onClose={() => setShowBookingForm(false)}
          onSubmit={handleBookingFormSubmit}
        />
      )}
    </div>
  );
}

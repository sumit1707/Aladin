import { X, User, Users, Bed, Car, MessageSquare, PawPrint, MapPin, Calendar, DollarSign, ArrowLeft, CheckCircle } from 'lucide-react';
import { BookingFormData } from './BookingForm';

interface BookingConfirmationProps {
  bookingData: BookingFormData;
  destinationName: string;
  tripBudget?: string;
  startDate: string;
  endDate: string;
  days: number;
  travelMode: string;
  onConfirm: () => void;
  onBack: () => void;
  onClose: () => void;
}

export default function BookingConfirmation({
  bookingData,
  destinationName,
  tripBudget,
  startDate,
  endDate,
  days,
  travelMode,
  onConfirm,
  onBack,
  onClose
}: BookingConfirmationProps) {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 overflow-y-auto">
      <div className="bg-gradient-to-br from-emerald-900/95 to-black/95 border-2 border-emerald-500 rounded-xl shadow-2xl shadow-emerald-500/30 max-w-2xl w-full p-4 relative my-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-emerald-300 hover:text-emerald-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <h3 className="text-2xl font-bold text-emerald-400 mb-1 flex items-center gap-2">
            <CheckCircle className="w-6 h-6" />
            Confirm Your Booking Details
          </h3>
          <p className="text-emerald-300 text-sm">
            Please review all details carefully before confirming
          </p>
        </div>

        <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
          <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-3">
            <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2 text-base">
              <MapPin className="w-4 h-4" />
              Trip Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-emerald-300/70 text-xs mb-1">Destination</div>
                <div className="text-emerald-300 font-semibold text-sm">{destinationName}</div>
              </div>
              <div>
                <div className="text-emerald-300/70 text-xs mb-1">Travel Mode</div>
                <div className="text-emerald-300 font-semibold text-sm">{travelMode}</div>
              </div>
              <div>
                <div className="text-emerald-300/70 text-xs mb-1">Trip Dates</div>
                <div className="text-emerald-300 font-semibold text-sm">
                  {startDate} to {endDate}
                </div>
              </div>
              <div>
                <div className="text-emerald-300/70 text-xs mb-1">Duration</div>
                <div className="text-emerald-300 font-semibold text-sm">{days} days</div>
              </div>
              {tripBudget && (
                <div>
                  <div className="text-emerald-300/70 text-xs mb-1">Budget</div>
                  <div className="text-emerald-300 font-semibold text-sm">{tripBudget}</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-3">
            <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2 text-base">
              <User className="w-4 h-4" />
              Contact Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <div className="text-emerald-300/70 text-xs mb-1">Name</div>
                <div className="text-emerald-300 font-semibold text-sm">{bookingData.customerName}</div>
              </div>
              <div>
                <div className="text-emerald-300/70 text-xs mb-1">Email</div>
                <div className="text-emerald-300 font-semibold text-sm break-all">{bookingData.customerEmail}</div>
              </div>
              <div>
                <div className="text-emerald-300/70 text-xs mb-1">Phone</div>
                <div className="text-emerald-300 font-semibold text-sm">{bookingData.customerPhone}</div>
              </div>
            </div>
          </div>

          <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-3">
            <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2 text-base">
              <Users className="w-4 h-4" />
              Travelers
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <div className="text-emerald-300/70 text-xs mb-1">Adults</div>
                <div className="text-emerald-300 font-semibold text-sm">{bookingData.adults}</div>
              </div>
              <div>
                <div className="text-emerald-300/70 text-xs mb-1">Children</div>
                <div className="text-emerald-300 font-semibold text-sm">{bookingData.children}</div>
              </div>
              <div>
                <div className="text-emerald-300/70 text-xs mb-1">Seniors</div>
                <div className="text-emerald-300 font-semibold text-sm">{bookingData.seniors}</div>
              </div>
              <div>
                <div className="text-emerald-300/70 text-xs mb-1">Total</div>
                <div className="text-emerald-300 font-semibold text-sm">
                  {bookingData.adults + bookingData.children + bookingData.seniors} people
                </div>
              </div>
            </div>
          </div>

          <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-3">
            <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2 text-base">
              <PawPrint className="w-4 h-4" />
              Pets
            </h4>
            <div>
              <div className="text-emerald-300/70 text-xs mb-1">Traveling with Pets</div>
              <div className={`text-sm font-semibold ${bookingData.hasPets ? 'text-emerald-400' : 'text-emerald-300'}`}>
                {bookingData.hasPets ? 'Yes - Pet-friendly accommodations required' : 'No'}
              </div>
            </div>
          </div>

          <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-3">
            <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2 text-base">
              <Bed className="w-4 h-4" />
              Accommodation Preferences
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-emerald-300/70 text-xs mb-1">Hotel Type</div>
                <div className="text-emerald-300 font-semibold text-sm">{bookingData.roomType}</div>
              </div>
              <div>
                <div className="text-emerald-300/70 text-xs mb-1">Number of Rooms</div>
                <div className="text-emerald-300 font-semibold text-sm">{bookingData.numberOfRooms}</div>
              </div>
            </div>
          </div>

          <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-3">
            <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2 text-base">
              <Car className="w-4 h-4" />
              Vehicle Preferences
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-emerald-300/70 text-xs mb-1">Vehicle Type</div>
                <div className="text-emerald-300 font-semibold text-sm">{bookingData.vehicleType}</div>
              </div>
              <div>
                <div className="text-emerald-300/70 text-xs mb-1">Number of Cars</div>
                <div className="text-emerald-300 font-semibold text-sm">{bookingData.numberOfCars}</div>
              </div>
            </div>
          </div>

          {bookingData.specialRequests && (
            <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-3">
              <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2 text-base">
                <MessageSquare className="w-4 h-4" />
                Special Requests
              </h4>
              <div className="text-emerald-300 text-sm bg-emerald-500/10 p-2 rounded border border-emerald-500/30">
                {bookingData.specialRequests}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-emerald-500/30">
          <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-lg p-3 mb-3">
            <p className="text-emerald-300 text-xs text-center">
              By confirming, you agree that all information provided is accurate. Our team will process your booking request and contact you shortly with hotel options and further details.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onBack}
              className="px-4 py-2 border border-emerald-500/50 text-emerald-300 rounded hover:bg-emerald-900/30 transition-colors font-semibold text-sm flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Edit
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded font-semibold text-sm transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Confirm and Proceed
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

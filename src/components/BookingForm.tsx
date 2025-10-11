import { useState } from 'react';
import { X, Users, Bed, Car, MessageSquare, User as UserIcon, Mail, Phone, PawPrint, CheckCircle, MapPin, Calendar, DollarSign, Plane } from 'lucide-react';

interface BookingFormProps {
  onClose: () => void;
  onSubmit: (data: BookingFormData) => Promise<void>;
  destinationName: string;
  tripBudget?: string;
  startDate?: string;
  endDate?: string;
  days?: number;
  travelMode?: string;
  startLocation?: string;
  month?: string;
  groupType?: string;
  theme?: string[];
  mood?: string;
}

export interface BookingFormData {
  adults: number;
  children: number;
  seniors: number;
  numberOfHotels: number;
  numberOfRooms: number;
  numberOfCars: number;
  roomType: '3-star' | '4-star' | '5-star';
  vehicleType: 'small-car' | 'big-car' | 'tempo';
  specialRequests: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  hasPets: boolean;
}


export default function BookingForm({
  onClose,
  onSubmit,
  destinationName,
  tripBudget,
  startDate,
  endDate,
  days,
  travelMode,
  startLocation,
  month,
  groupType,
  theme,
  mood
}: BookingFormProps) {
  const getDefaultRoomType = (): '3-star' | '4-star' | '5-star' => {
    if (tripBudget === 'Budget-friendly (Under ₹20k)') return '3-star';
    if (tripBudget === 'Luxury (₹50k and above)') return '5-star';
    return '4-star';
  };

  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingFormData>({
    adults: 1,
    children: 0,
    seniors: 0,
    numberOfHotels: 1,
    numberOfRooms: 1,
    numberOfCars: 1,
    roomType: getDefaultRoomType(),
    vehicleType: 'small-car',
    specialRequests: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    hasPets: false
  });

  const [hasConfirmed, setHasConfirmed] = useState(false);


  const handleConfirmAndSubmit = async () => {
    if (!hasConfirmed) {
      alert('Please confirm your inputs by checking the checkbox');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('Failed to submit booking. Please try again.');
      setSubmitting(false);
    }
  };

  const updateNumber = (field: 'adults' | 'children' | 'seniors' | 'numberOfHotels' | 'numberOfRooms' | 'numberOfCars', delta: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: Math.max(field === 'numberOfHotels' || field === 'numberOfRooms' || field === 'numberOfCars' ? 1 : 0, prev[field] + delta)
    }));
  };

  const formatVehicleType = (type: string) => {
    if (type === 'small-car') return 'Small Car (4-5 seat)';
    if (type === 'big-car') return 'Big Car (6-7 seat)';
    return 'Tempo (10-12 seat)';
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 overflow-y-auto">
      <div className="bg-gradient-to-br from-emerald-900/95 to-black/95 border-2 border-emerald-500 rounded-xl shadow-2xl shadow-emerald-500/30 max-w-2xl w-full p-4 relative my-6">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-emerald-300 hover:text-emerald-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-xl font-bold text-emerald-400 mb-1">Hotel Recommendations & Booking Details</h3>
        <p className="text-emerald-300 text-sm mb-4">
          Trip to <span className="font-semibold text-emerald-400">{destinationName}</span>
        </p>

        {/* Form Content - Confirm Your Input */}
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-lg p-3 mb-3">
              <p className="text-emerald-300 text-xs text-center">
                Please review all your inputs carefully before confirming. Once confirmed, your booking request will be processed.
              </p>
            </div>

            {/* Trip Information */}
            {(startLocation || destinationName || startDate || endDate || days || travelMode || tripBudget) && (
              <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-3">
                <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" />
                  Trip Information
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {startLocation && (
                    <div>
                      <div className="text-emerald-300/70">From</div>
                      <div className="text-emerald-300 font-semibold">{startLocation}</div>
                    </div>
                  )}
                  {destinationName && (
                    <div>
                      <div className="text-emerald-300/70">To</div>
                      <div className="text-emerald-300 font-semibold">{destinationName}</div>
                    </div>
                  )}
                  {startDate && endDate && (
                    <div className="col-span-2">
                      <div className="text-emerald-300/70">Travel Dates</div>
                      <div className="text-emerald-300 font-semibold">{startDate} to {endDate}</div>
                    </div>
                  )}
                  {days && (
                    <div>
                      <div className="text-emerald-300/70">Duration</div>
                      <div className="text-emerald-300 font-semibold">{days} days</div>
                    </div>
                  )}
                  {travelMode && (
                    <div>
                      <div className="text-emerald-300/70">Travel Mode</div>
                      <div className="text-emerald-300 font-semibold">{travelMode}</div>
                    </div>
                  )}
                  {tripBudget && (
                    <div className="col-span-2">
                      <div className="text-emerald-300/70">Budget</div>
                      <div className="text-emerald-300 font-semibold">{tripBudget}</div>
                    </div>
                  )}
                  {month && (
                    <div>
                      <div className="text-emerald-300/70">Travel Month</div>
                      <div className="text-emerald-300 font-semibold">{month}</div>
                    </div>
                  )}
                  {groupType && (
                    <div>
                      <div className="text-emerald-300/70">Group Type</div>
                      <div className="text-emerald-300 font-semibold">{groupType}</div>
                    </div>
                  )}
                  {mood && (
                    <div>
                      <div className="text-emerald-300/70">Mood</div>
                      <div className="text-emerald-300 font-semibold">{mood}</div>
                    </div>
                  )}
                  {theme && theme.length > 0 && (
                    <div className="col-span-2">
                      <div className="text-emerald-300/70">Themes</div>
                      <div className="text-emerald-300 font-semibold">{theme.join(', ')}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Customer Information */}
            <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-3">
              <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2 text-sm">
                <UserIcon className="w-4 h-4" />
                Customer Information
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-emerald-300/70">Full Name</div>
                  <div className="text-emerald-300 font-semibold">{formData.customerName}</div>
                </div>
                <div>
                  <div className="text-emerald-300/70">Phone Number</div>
                  <div className="text-emerald-300 font-semibold">{formData.customerPhone}</div>
                </div>
                <div className="col-span-2">
                  <div className="text-emerald-300/70">Email Address</div>
                  <div className="text-emerald-300 font-semibold break-all">{formData.customerEmail}</div>
                </div>
              </div>
            </div>

            {/* Booking Preferences */}
            <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-3">
              <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                Booking Preferences
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-emerald-300/70">Guests</div>
                  <div className="text-emerald-300 font-semibold">
                    {formData.adults} Adult{formData.adults > 1 ? 's' : ''}, {formData.children} Child{formData.children !== 1 ? 'ren' : ''}, {formData.seniors} Senior{formData.seniors > 1 ? 's' : ''}
                  </div>
                </div>
                <div>
                  <div className="text-emerald-300/70">Total</div>
                  <div className="text-emerald-300 font-semibold">
                    {formData.adults + formData.children + formData.seniors} people
                  </div>
                </div>
                <div>
                  <div className="text-emerald-300/70">Room Type</div>
                  <div className="text-emerald-300 font-semibold">{formData.roomType}</div>
                </div>
                <div>
                  <div className="text-emerald-300/70">Number of Rooms</div>
                  <div className="text-emerald-300 font-semibold">{formData.numberOfRooms}</div>
                </div>
                <div>
                  <div className="text-emerald-300/70">Number of Hotels</div>
                  <div className="text-emerald-300 font-semibold">{formData.numberOfHotels}</div>
                </div>
                <div>
                  <div className="text-emerald-300/70">Pets</div>
                  <div className={`font-semibold ${formData.hasPets ? 'text-emerald-400' : 'text-emerald-300'}`}>
                    {formData.hasPets ? 'Yes - Pet-friendly required' : 'No'}
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Preferences */}
            <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-3">
              <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2 text-sm">
                <Car className="w-4 h-4" />
                Vehicle Preferences
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <div className="text-emerald-300/70">Vehicle Type</div>
                  <div className="text-emerald-300 font-semibold">{formatVehicleType(formData.vehicleType)}</div>
                </div>
                <div>
                  <div className="text-emerald-300/70">Number of Cars</div>
                  <div className="text-emerald-300 font-semibold">{formData.numberOfCars}</div>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {formData.specialRequests && (
              <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-3">
                <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2 text-sm">
                  <MessageSquare className="w-4 h-4" />
                  Special Requests
                </h4>
                <div className="text-emerald-300 text-xs bg-emerald-500/10 p-2 rounded border border-emerald-500/30">
                  {formData.specialRequests}
                </div>
              </div>
            )}

            {/* Confirmation Checkbox */}
            <div className="bg-emerald-500/10 border border-emerald-500/40 rounded-lg p-3">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasConfirmed}
                  onChange={(e) => setHasConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-emerald-500"
                />
                <span className="text-emerald-300 text-xs">
                  I confirm that all the information provided above is accurate and I have reviewed all details carefully. I understand that this booking request will be processed based on these inputs.
                </span>
              </label>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-emerald-500/50 text-emerald-300 rounded hover:bg-emerald-900/30 transition-colors font-semibold text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAndSubmit}
                disabled={!hasConfirmed || submitting}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded font-semibold text-sm transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                {submitting ? 'Processing...' : 'Confirm and Submit'}
              </button>
            </div>
          </div>
      </div>
    </div>
  );
}

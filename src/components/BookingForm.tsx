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

type TabType = 'details' | 'confirm';

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

  const [activeTab, setActiveTab] = useState<TabType>('details');
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

  const handleContinueToConfirm = () => {
    if (!formData.customerName.trim() || !formData.customerEmail.trim() || !formData.customerPhone.trim()) {
      alert('Please fill in all customer details');
      return;
    }

    if (formData.adults === 0) {
      alert('At least one adult is required');
      return;
    }

    setActiveTab('confirm');
  };

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

        {/* Tabs */}
        <div className="flex gap-2 mb-4 border-b border-emerald-500/30">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'details'
                ? 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-emerald-300/60 hover:text-emerald-300'
            }`}
          >
            Hotel Recommended
          </button>
          <button
            type="button"
            onClick={() => {
              if (!formData.customerName.trim() || !formData.customerEmail.trim() || !formData.customerPhone.trim()) {
                alert('Please fill in all required fields first');
                return;
              }
              setActiveTab('confirm');
            }}
            className={`px-4 py-2 text-sm font-semibold transition-all ${
              activeTab === 'confirm'
                ? 'text-emerald-400 border-b-2 border-emerald-500'
                : 'text-emerald-300/60 hover:text-emerald-300'
            }`}
          >
            Confirm Your Input
          </button>
        </div>

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
            <div className="bg-black/40 border border-emerald-500/30 rounded-lg p-3">
              <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2 text-sm">
                <UserIcon className="w-4 h-4" />
                Contact Details
              </h4>
              <div className="space-y-2">
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  placeholder="Full Name *"
                  className="w-full bg-black/60 border border-emerald-500/30 rounded px-3 py-2 text-sm text-emerald-300 placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="email"
                  required
                  value={formData.customerEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                  placeholder="Email Address *"
                  className="w-full bg-black/60 border border-emerald-500/30 rounded px-3 py-2 text-sm text-emerald-300 placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="tel"
                  required
                  value={formData.customerPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                  placeholder="Phone Number *"
                  className="w-full bg-black/60 border border-emerald-500/30 rounded px-3 py-2 text-sm text-emerald-300 placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="bg-black/40 border border-emerald-500/30 rounded-lg p-3">
              <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2 text-sm">
                <Users className="w-4 h-4" />
                Travelers
              </h4>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-emerald-300 text-sm">Adults</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateNumber('adults', -1)}
                      className="w-8 h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-sm font-semibold"
                    >
                      -
                    </button>
                    <span className="text-emerald-400 font-semibold w-8 text-center text-sm">{formData.adults}</span>
                    <button
                      type="button"
                      onClick={() => updateNumber('adults', 1)}
                      className="w-8 h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-sm font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-emerald-300 text-sm">Children (under 5 yrs)</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateNumber('children', -1)}
                      className="w-8 h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-sm font-semibold"
                    >
                      -
                    </button>
                    <span className="text-emerald-400 font-semibold w-8 text-center text-sm">{formData.children}</span>
                    <button
                      type="button"
                      onClick={() => updateNumber('children', 1)}
                      className="w-8 h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-sm font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-emerald-300 text-sm">Sr citizen (above 60 yrs) or physically challenged</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateNumber('seniors', -1)}
                      className="w-8 h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-sm font-semibold"
                    >
                      -
                    </button>
                    <span className="text-emerald-400 font-semibold w-8 text-center text-sm">{formData.seniors}</span>
                    <button
                      type="button"
                      onClick={() => updateNumber('seniors', 1)}
                      className="w-8 h-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-sm font-semibold"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/40 border border-emerald-500/30 rounded-lg p-3">
              <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2 text-sm">
                <PawPrint className="w-4 h-4" />
                Pets (if any)
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, hasPets: true }))}
                  className={`py-2 px-4 rounded border-2 transition-all text-sm font-semibold ${
                    formData.hasPets
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, hasPets: false }))}
                  className={`py-2 px-4 rounded border-2 transition-all text-sm font-semibold ${
                    !formData.hasPets
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            <div className="bg-black/40 border border-emerald-500/30 rounded-lg p-3">
              <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2 text-sm">
                <Bed className="w-4 h-4" />
                Room Type
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, roomType: '3-star' }))}
                  className={`py-2 px-3 rounded border-2 transition-all ${
                    formData.roomType === '3-star'
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
                  }`}
                >
                  <div className="font-semibold text-sm">3-Star</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, roomType: '4-star' }))}
                  className={`py-2 px-3 rounded border-2 transition-all ${
                    formData.roomType === '4-star'
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
                  }`}
                >
                  <div className="font-semibold text-sm">4-Star</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, roomType: '5-star' }))}
                  className={`py-2 px-3 rounded border-2 transition-all ${
                    formData.roomType === '5-star'
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
                  }`}
                >
                  <div className="font-semibold text-sm">5-Star</div>
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="flex items-center justify-between bg-black/40 rounded p-2">
                  <span className="text-emerald-300 text-xs">Number of Hotels</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateNumber('numberOfHotels', -1)}
                      className="w-6 h-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-xs"
                    >
                      -
                    </button>
                    <span className="text-emerald-400 font-semibold w-6 text-center text-xs">{formData.numberOfHotels}</span>
                    <button
                      type="button"
                      onClick={() => updateNumber('numberOfHotels', 1)}
                      className="w-6 h-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-black/40 rounded p-2">
                  <span className="text-emerald-300 text-xs">Number of Rooms</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateNumber('numberOfRooms', -1)}
                      className="w-6 h-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-xs"
                    >
                      -
                    </button>
                    <span className="text-emerald-400 font-semibold w-6 text-center text-xs">{formData.numberOfRooms}</span>
                    <button
                      type="button"
                      onClick={() => updateNumber('numberOfRooms', 1)}
                      className="w-6 h-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/40 border border-emerald-500/30 rounded-lg p-3">
              <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2 text-sm">
                <Car className="w-4 h-4" />
                Vehicle Type
              </h4>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, vehicleType: 'small-car' }))}
                  className={`py-2 px-2 rounded border-2 transition-all ${
                    formData.vehicleType === 'small-car'
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
                  }`}
                >
                  <div className="font-semibold text-xs">Small</div>
                  <div className="text-[10px] text-emerald-300/70">4-5 seat</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, vehicleType: 'big-car' }))}
                  className={`py-2 px-2 rounded border-2 transition-all ${
                    formData.vehicleType === 'big-car'
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
                  }`}
                >
                  <div className="font-semibold text-xs">Big</div>
                  <div className="text-[10px] text-emerald-300/70">6-7 seat</div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, vehicleType: 'tempo' }))}
                  className={`py-2 px-2 rounded border-2 transition-all ${
                    formData.vehicleType === 'tempo'
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
                  }`}
                >
                  <div className="font-semibold text-xs">Tempo</div>
                  <div className="text-[10px] text-emerald-300/70">10-12 seat</div>
                </button>
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between bg-black/40 rounded p-2">
                  <span className="text-emerald-300 text-xs">Number of Cars</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateNumber('numberOfCars', -1)}
                      className="w-6 h-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-xs"
                    >
                      -
                    </button>
                    <span className="text-emerald-400 font-semibold w-6 text-center text-xs">{formData.numberOfCars}</span>
                    <button
                      type="button"
                      onClick={() => updateNumber('numberOfCars', 1)}
                      className="w-6 h-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-black/40 border border-emerald-500/30 rounded-lg p-3">
              <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-2 text-sm">
                <MessageSquare className="w-4 h-4" />
                Special Requests
              </h4>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
                placeholder="Any special requests or changes..."
                rows={3}
                className="w-full bg-black/60 border border-emerald-500/30 rounded px-3 py-2 text-sm text-emerald-300 placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleContinueToConfirm}
                className="flex-1 py-2 px-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded font-semibold text-sm transition-all shadow-lg shadow-emerald-500/30"
              >
                Continue to Confirm
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-emerald-500/50 text-emerald-300 rounded hover:bg-emerald-900/30 transition-colors font-semibold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Confirm Tab */}
        {activeTab === 'confirm' && (
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
                onClick={() => {
                  setActiveTab('details');
                  setHasConfirmed(false);
                }}
                className="px-4 py-2 border border-emerald-500/50 text-emerald-300 rounded hover:bg-emerald-900/30 transition-colors font-semibold text-sm"
              >
                Back to Edit
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
        )}
      </div>
    </div>
  );
}

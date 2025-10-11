import { useState } from 'react';
import { X, Users, Bed, Car, MessageSquare, User as UserIcon, Mail, Phone } from 'lucide-react';

interface BookingFormProps {
  onClose: () => void;
  onSubmit: (data: BookingFormData) => Promise<void>;
  destinationName: string;
  tripBudget?: string;
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
}

export default function BookingForm({ onClose, onSubmit, destinationName, tripBudget }: BookingFormProps) {
  const getDefaultRoomType = (): '3-star' | '4-star' | '5-star' => {
    if (tripBudget === 'Budget (<₹20k)') return '3-star';
    if (tripBudget === 'Luxury (>₹50k)') return '5-star';
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
    customerPhone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName.trim() || !formData.customerEmail.trim() || !formData.customerPhone.trim()) {
      alert('Please fill in all customer details');
      return;
    }

    if (formData.adults === 0) {
      alert('At least one adult is required');
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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 overflow-y-auto">
      <div className="bg-gradient-to-br from-emerald-900/95 to-black/95 border-2 border-emerald-500 rounded-xl shadow-2xl shadow-emerald-500/30 max-w-md w-full p-3 relative my-6">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-emerald-300 hover:text-emerald-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-emerald-400 mb-1">Booking Details</h3>
        <p className="text-emerald-300 text-xs mb-3">
          Trip to <span className="font-semibold text-emerald-400">{destinationName}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Customer Details */}
          <div className="bg-black/40 border border-emerald-500/30 rounded-lg p-2">
            <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-1.5 text-xs">
              <UserIcon className="w-3.5 h-3.5" />
              Contact Details
            </h4>
            <div className="space-y-2">
              <input
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                placeholder="Full Name *"
                className="w-full bg-black/60 border border-emerald-500/30 rounded px-2 py-1 text-xs text-emerald-300 placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="email"
                required
                value={formData.customerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                placeholder="Email Address *"
                className="w-full bg-black/60 border border-emerald-500/30 rounded px-2 py-1 text-xs text-emerald-300 placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500"
              />
              <input
                type="tel"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                placeholder="Phone Number *"
                className="w-full bg-black/60 border border-emerald-500/30 rounded px-2 py-1 text-xs text-emerald-300 placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Travelers Count */}
          <div className="bg-black/40 border border-emerald-500/30 rounded-lg p-2">
            <h4 className="text-emerald-400 font-semibold mb-2 flex items-center gap-1.5 text-xs">
              <Users className="w-3.5 h-3.5" />
              Travelers
            </h4>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-emerald-300 text-xs">Adults</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateNumber('adults', -1)}
                    className="w-6 h-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-xs"
                  >
                    -
                  </button>
                  <span className="text-emerald-400 font-semibold w-5 text-center text-xs">{formData.adults}</span>
                  <button
                    type="button"
                    onClick={() => updateNumber('adults', 1)}
                    className="w-6 h-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-emerald-300 text-xs">Children</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateNumber('children', -1)}
                    className="w-6 h-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-xs"
                  >
                    -
                  </button>
                  <span className="text-emerald-400 font-semibold w-5 text-center text-xs">{formData.children}</span>
                  <button
                    type="button"
                    onClick={() => updateNumber('children', 1)}
                    className="w-6 h-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-emerald-300 text-xs">Seniors</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateNumber('seniors', -1)}
                    className="w-6 h-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-xs"
                  >
                    -
                  </button>
                  <span className="text-emerald-400 font-semibold w-5 text-center text-xs">{formData.seniors}</span>
                  <button
                    type="button"
                    onClick={() => updateNumber('seniors', 1)}
                    className="w-6 h-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>


          {/* Room Type */}
          <div className="bg-black/40 border border-emerald-500/30 rounded-lg p-2">
            <h4 className="text-emerald-400 font-semibold mb-1.5 flex items-center gap-1.5 text-xs">
              <Bed className="w-3.5 h-3.5" />
              Hotel Type
            </h4>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, roomType: '3-star' }))}
                className={`py-1.5 px-1 rounded border-2 transition-all ${
                  formData.roomType === '3-star'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
                }`}
              >
                <div className="font-semibold text-[10px]">3-Star</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, roomType: '4-star' }))}
                className={`py-1.5 px-1 rounded border-2 transition-all ${
                  formData.roomType === '4-star'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
                }`}
              >
                <div className="font-semibold text-[10px]">4-Star</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, roomType: '5-star' }))}
                className={`py-1.5 px-1 rounded border-2 transition-all ${
                  formData.roomType === '5-star'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
                }`}
              >
                <div className="font-semibold text-[10px]">5-Star</div>
              </button>
            </div>
          </div>

          {/* Vehicle Type */}
          <div className="bg-black/40 border border-emerald-500/30 rounded-lg p-2">
            <h4 className="text-emerald-400 font-semibold mb-1.5 flex items-center gap-1.5 text-xs">
              <Car className="w-3.5 h-3.5" />
              Car Type
            </h4>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, vehicleType: 'small-car' }))}
                className={`py-1.5 px-1 rounded border-2 transition-all ${
                  formData.vehicleType === 'small-car'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
                }`}
              >
                <div className="font-semibold text-[10px]">Small</div>
                <div className="text-[9px] text-emerald-300/70">4-5 seat</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, vehicleType: 'big-car' }))}
                className={`py-1.5 px-1 rounded border-2 transition-all ${
                  formData.vehicleType === 'big-car'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
                }`}
              >
                <div className="font-semibold text-[10px]">Big</div>
                <div className="text-[9px] text-emerald-300/70">6-7 seat</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, vehicleType: 'tempo' }))}
                className={`py-1.5 px-1 rounded border-2 transition-all ${
                  formData.vehicleType === 'tempo'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-emerald-500/30 text-emerald-400 hover:border-emerald-500/60'
                }`}
              >
                <div className="font-semibold text-[10px]">Tempo</div>
                <div className="text-[9px] text-emerald-300/70">10-12 seat</div>
              </button>
            </div>
          </div>

          {/* Special Requests */}
          <div className="bg-black/40 border border-emerald-500/30 rounded-lg p-2">
            <h4 className="text-emerald-400 font-semibold mb-1.5 flex items-center gap-1.5 text-xs">
              <MessageSquare className="w-3.5 h-3.5" />
              Special Requests
            </h4>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => setFormData(prev => ({ ...prev, specialRequests: e.target.value }))}
              placeholder="Any special requests or changes..."
              rows={2}
              className="w-full bg-black/60 border border-emerald-500/30 rounded px-2 py-1 text-xs text-emerald-300 placeholder-emerald-500/50 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-1.5">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-1.5 px-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded font-semibold text-xs transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Processing...' : 'Submit Request'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-3 py-1.5 border border-emerald-500/50 text-emerald-300 rounded hover:bg-emerald-900/30 transition-colors font-semibold text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

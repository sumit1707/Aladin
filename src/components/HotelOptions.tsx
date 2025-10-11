import { useState } from 'react';
import { HotelOption, ItineraryDay } from '../lib/llm';
import { Star, MapPin, User, Mail, Phone, X, Hotel, Car, Calculator, CheckCircle, Headset, ArrowLeft } from 'lucide-react';

interface HotelOptionsProps {
  hotels: HotelOption[];
  customerDetails: {
    name: string;
    email: string;
    phone: string;
  };
  bookingDetails: {
    adults: number;
    children: number;
    seniors: number;
    roomType: string;
    vehicleType: string;
    specialRequests: string;
    numberOfHotels: number;
    numberOfCars: number;
  };
  itinerary: ItineraryDay[];
  travelMode: string;
  destinationName: string;
  onClose: () => void;
  onLogout: () => Promise<void>;
}

export default function HotelOptions({
  hotels,
  customerDetails,
  bookingDetails,
  itinerary,
  travelMode,
  destinationName,
  onClose,
  onLogout
}: HotelOptionsProps) {
  const [activeTab, setActiveTab] = useState<'hotels' | 'details' | 'hotel-count' | 'hotel-preferences' | 'car-count' | 'car-preferences'>('hotels');
  const [selectedHotels, setSelectedHotels] = useState(bookingDetails.numberOfHotels);
  const [selectedCars, setSelectedCars] = useState(bookingDetails.numberOfCars);
  const [hotelPreferences, setHotelPreferences] = useState('');
  const [carPreferences, setCarPreferences] = useState('');
  const [showCostBreakdown, setShowCostBreakdown] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'}`}
      />
    ));
  };

  const calculateTotalCost = () => {
    const numberOfDays = itinerary.length;
    const totalGuests = bookingDetails.adults + bookingDetails.children + bookingDetails.seniors;

    const avgHotelPrice = hotels.length > 0
      ? hotels.reduce((sum, hotel) => sum + hotel.price_per_night, 0) / hotels.length
      : 3000;

    let hotelCostMultiplier = 1;
    if (bookingDetails.roomType === '4-star') hotelCostMultiplier = 1.5;
    if (bookingDetails.roomType === '5-star') hotelCostMultiplier = 2;

    const hotelCost = avgHotelPrice * hotelCostMultiplier * selectedHotels * numberOfDays;

    let carCostPerDay = 2000;
    if (bookingDetails.vehicleType === 'big-car') carCostPerDay = 3500;
    if (bookingDetails.vehicleType === 'tempo') carCostPerDay = 5000;

    const carCost = carCostPerDay * selectedCars * numberOfDays;

    let travelCost = 0;
    if (travelMode === 'flight') {
      travelCost = 8000 * totalGuests;
    } else if (travelMode === 'train-3a') {
      travelCost = 2500 * totalGuests;
    } else if (travelMode === 'train-2a') {
      travelCost = 3500 * totalGuests;
    } else if (travelMode === 'car') {
      travelCost = 5000;
    }

    const foodCostPerPersonPerDay = 800;
    const foodCost = foodCostPerPersonPerDay * totalGuests * numberOfDays;

    const activitiesCost = itinerary.reduce((sum, day) => sum + day.estimated_cost_per_person, 0) * totalGuests;

    const subtotal = hotelCost + carCost + travelCost + foodCost + activitiesCost;
    const markup = subtotal * 0.15;
    const total = subtotal + markup;

    return {
      hotelCost,
      carCost,
      travelCost,
      foodCost,
      activitiesCost,
      subtotal,
      markup,
      total,
      numberOfDays,
      totalGuests
    };
  };

  const handleSubmit = () => {
    setShowCostBreakdown(true);
  };

  const handleConfirm = () => {
    setShowConfirmationModal(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmationModal(false);
    onClose();
  };

  const handleContactAgent = () => {
    alert('Connecting you with a customer agent...');
  };

  if (showCostBreakdown) {
    const costs = calculateTotalCost();

    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-900/95 to-black/95 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/30 w-full h-full relative flex flex-col">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-emerald-300 hover:text-emerald-100 transition-colors z-10 bg-black/60 p-2 rounded-full hover:bg-black/80"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="p-6 pb-0">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-8 h-8 text-emerald-500" />
              <h2 className="text-2xl font-bold text-emerald-400">Total Cost Breakdown</h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-6">
                <h3 className="text-xl font-bold text-emerald-400 mb-4">Trip Summary</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
                  <div>
                    <div className="text-emerald-300/70 text-sm mb-1">Destination</div>
                    <div className="text-emerald-300 font-semibold">{destinationName}</div>
                  </div>
                  <div>
                    <div className="text-emerald-300/70 text-sm mb-1">Duration</div>
                    <div className="text-emerald-300 font-semibold">{costs.numberOfDays} Days</div>
                  </div>
                  <div>
                    <div className="text-emerald-300/70 text-sm mb-1">Guests</div>
                    <div className="text-emerald-300 font-semibold">{costs.totalGuests} People</div>
                  </div>
                  <div>
                    <div className="text-emerald-300/70 text-sm mb-1">Travel Mode</div>
                    <div className="text-emerald-300 font-semibold capitalize">{travelMode.replace('-', ' ')}</div>
                  </div>
                </div>
                {bookingDetails.specialRequests && (
                  <div className="border-t border-emerald-500/30 pt-4">
                    <div className="text-emerald-300/70 text-sm mb-2">Special Requests</div>
                    <div className="text-emerald-300 bg-emerald-500/10 rounded-lg p-3 border border-emerald-500/30">
                      {bookingDetails.specialRequests}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-6">
                <h3 className="text-xl font-bold text-emerald-400 mb-4">Cost Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg">
                    <div>
                      <div className="text-emerald-300 font-semibold">Hotel Accommodation</div>
                      <div className="text-emerald-300/70 text-sm">
                        {selectedHotels} {bookingDetails.roomType} hotels × {costs.numberOfDays} days
                      </div>
                    </div>
                    <div className="text-emerald-400 font-bold text-lg">₹{costs.hotelCost.toLocaleString('en-IN')}</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg">
                    <div>
                      <div className="text-emerald-300 font-semibold">Car Rental</div>
                      <div className="text-emerald-300/70 text-sm">
                        {selectedCars} {bookingDetails.vehicleType} × {costs.numberOfDays} days
                      </div>
                    </div>
                    <div className="text-emerald-400 font-bold text-lg">₹{costs.carCost.toLocaleString('en-IN')}</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg">
                    <div>
                      <div className="text-emerald-300 font-semibold">Travel to Destination</div>
                      <div className="text-emerald-300/70 text-sm">
                        {travelMode === 'flight' && `Flight tickets for ${costs.totalGuests} guests`}
                        {travelMode === 'train-3a' && `3AC Train tickets for ${costs.totalGuests} guests`}
                        {travelMode === 'train-2a' && `2AC Train tickets for ${costs.totalGuests} guests`}
                        {travelMode === 'car' && `Car travel (fuel + tolls)`}
                      </div>
                    </div>
                    <div className="text-emerald-400 font-bold text-lg">₹{costs.travelCost.toLocaleString('en-IN')}</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg">
                    <div>
                      <div className="text-emerald-300 font-semibold">Food & Dining</div>
                      <div className="text-emerald-300/70 text-sm">
                        ₹800 per person per day × {costs.totalGuests} guests × {costs.numberOfDays} days
                      </div>
                    </div>
                    <div className="text-emerald-400 font-bold text-lg">₹{costs.foodCost.toLocaleString('en-IN')}</div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg">
                    <div>
                      <div className="text-emerald-300 font-semibold">Activities & Sightseeing</div>
                      <div className="text-emerald-300/70 text-sm">
                        Entry fees, guides, and activities for {costs.totalGuests} guests
                      </div>
                    </div>
                    <div className="text-emerald-400 font-bold text-lg">₹{costs.activitiesCost.toLocaleString('en-IN')}</div>
                  </div>

                  <div className="border-t border-emerald-500/30 pt-3 mt-3">
                    <div className="flex items-center justify-between p-3 bg-emerald-500/20 rounded-lg mb-2">
                      <div className="text-emerald-300 font-semibold text-lg">Subtotal</div>
                      <div className="text-emerald-400 font-bold text-xl">₹{costs.subtotal.toLocaleString('en-IN')}</div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-emerald-500/20 rounded-lg mb-3">
                      <div>
                        <div className="text-emerald-300 font-semibold">Service Charge (15%)</div>
                        <div className="text-emerald-300/70 text-sm">Planning, booking, and support</div>
                      </div>
                      <div className="text-emerald-400 font-bold text-lg">₹{costs.markup.toLocaleString('en-IN')}</div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-lg">
                      <div className="text-white font-bold text-xl">Total Approximate Cost</div>
                      <div className="text-white font-bold text-3xl">₹{costs.total.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={handleConfirm}
                  className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-bold text-lg transition-all shadow-lg shadow-green-500/30"
                >
                  <CheckCircle className="w-6 h-6" />
                  Confirm Booking
                </button>

                <button
                  onClick={handleContactAgent}
                  className="flex items-center justify-center gap-3 p-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white rounded-lg font-bold text-lg transition-all shadow-lg shadow-amber-500/30"
                >
                  <Headset className="w-6 h-6" />
                  Contact Customer Agent
                </button>
              </div>

              <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-4">
                <p className="text-emerald-300/70 text-sm text-center">
                  * The above cost is approximate and may vary based on actual booking rates, seasonal pricing, and availability.
                  Final cost will be confirmed by our team after reviewing all requirements.
                </p>
              </div>
            </div>
          </div>
        </div>

        {showConfirmationModal && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-emerald-900/95 to-black/95 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/50 rounded-2xl p-8 max-w-2xl w-full mx-4 relative">
              <button
                onClick={handleCloseConfirmation}
                className="absolute top-4 right-4 text-emerald-300 hover:text-emerald-100 transition-colors bg-black/60 p-2 rounded-full hover:bg-black/80"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-64 h-64 flex items-center justify-center">
                  <img
                    src="/AdobeStock_1654155584 copy.jpeg"
                    alt="Genie"
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-3">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                    <h2 className="text-3xl font-bold text-emerald-400">Booking Confirmed!</h2>
                  </div>

                  <p className="text-emerald-300 text-lg max-w-md">
                    Your booking has been confirmed. Someone from our team will contact you shortly to finalize the details.
                  </p>

                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mt-6">
                    <p className="text-emerald-300/90 text-sm">
                      We'll reach out to you at <span className="font-semibold text-emerald-400">{customerDetails.email}</span> and <span className="font-semibold text-emerald-400">{customerDetails.phone}</span>
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleCloseConfirmation}
                  className="mt-6 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-bold text-lg transition-all shadow-lg shadow-green-500/30"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-0 overflow-hidden">
      <div className="bg-gradient-to-br from-emerald-900/95 to-black/95 border-2 border-emerald-500 shadow-2xl shadow-emerald-500/30 w-full h-full relative flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-emerald-300 hover:text-emerald-100 transition-colors z-10 bg-black/60 p-2 rounded-full hover:bg-black/80"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-emerald-400">Hotel Recommendations & Booking Details</h2>
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-bold transition-all shadow-lg shadow-green-500/30"
            >
              <Calculator className="w-5 h-5" />
              Calculate Total Cost
            </button>
          </div>

          <div className="flex gap-2 mb-0 border-b border-emerald-500/30">
            <button
              onClick={() => setActiveTab('hotels')}
              className={`px-6 py-3 font-semibold text-sm transition-colors ${
                activeTab === 'hotels'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-emerald-300/70 hover:text-emerald-300'
              }`}
            >
              Hotels
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-3 font-semibold text-sm transition-colors ${
                activeTab === 'details'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-emerald-300/70 hover:text-emerald-300'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('hotel-count')}
              className={`px-6 py-3 font-semibold text-sm transition-colors ${
                activeTab === 'hotel-count' || activeTab === 'hotel-preferences'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-emerald-300/70 hover:text-emerald-300'
              }`}
            >
              Hotels
            </button>
            <button
              onClick={() => setActiveTab('car-count')}
              className={`px-6 py-3 font-semibold text-sm transition-colors ${
                activeTab === 'car-count' || activeTab === 'car-preferences'
                  ? 'text-emerald-400 border-b-2 border-emerald-400'
                  : 'text-emerald-300/70 hover:text-emerald-300'
              }`}
            >
              Cars
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'hotels' ? (
            <div className="space-y-4 max-w-7xl mx-auto">
              {hotels.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-black/40 border border-emerald-500/40 rounded-lg overflow-hidden hover:border-emerald-500 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row">
                    <img
                      src={hotel.image_url}
                      alt={hotel.name}
                      className="w-full lg:w-1/3 h-64 lg:h-auto object-cover"
                    />
                    <div className="flex-1 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-emerald-400 mb-1">{hotel.name}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-emerald-300/80 text-sm">{hotel.category}</span>
                            <span className="text-emerald-500/50">•</span>
                            <div className="flex items-center gap-1">{renderStars(hotel.rating)}</div>
                            <span className="text-emerald-300 text-sm font-semibold">({hotel.rating})</span>
                          </div>
                          <div className="flex items-center gap-2 text-emerald-300/70 text-sm">
                            <MapPin className="w-4 h-4" />
                            <span>{hotel.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-emerald-400">
                            ₹{hotel.price_per_night.toLocaleString('en-IN')}
                          </div>
                          <div className="text-emerald-300/70 text-sm">per night</div>
                        </div>
                      </div>

                      <p className="text-emerald-300/80 text-sm mb-3">{hotel.description}</p>

                      <div className="mb-3">
                        <h4 className="text-emerald-400 font-semibold mb-2 text-sm">Amenities</h4>
                        <div className="flex flex-wrap gap-2">
                          {hotel.amenities.slice(0, 8).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-300 text-xs"
                            >
                              {amenity}
                            </span>
                          ))}
                          {hotel.amenities.length > 8 && (
                            <span className="px-3 py-1 text-emerald-400 text-xs">+{hotel.amenities.length - 8} more</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-emerald-400 font-semibold mb-2 text-sm">Highlights</h4>
                        <ul className="space-y-1 grid grid-cols-1 md:grid-cols-2">
                          {hotel.highlights.map((highlight, idx) => (
                            <li key={idx} className="text-emerald-300/80 text-sm flex items-start gap-2">
                              <span className="text-emerald-500 mt-1">•</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : activeTab === 'details' ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-4">
                <h3 className="text-xl font-bold text-emerald-400 mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-emerald-500" />
                    <div>
                      <div className="text-emerald-300/70 text-sm">Full Name</div>
                      <div className="text-emerald-300 font-semibold text-base">{customerDetails.name}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-emerald-500" />
                    <div>
                      <div className="text-emerald-300/70 text-sm">Email Address</div>
                      <div className="text-emerald-300 font-semibold text-base">{customerDetails.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-emerald-500" />
                    <div>
                      <div className="text-emerald-300/70 text-sm">Phone Number</div>
                      <div className="text-emerald-300 font-semibold text-base">{customerDetails.phone}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-4">
                <h3 className="text-xl font-bold text-emerald-400 mb-4">Booking Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-emerald-300/70 text-sm mb-1">Guests</div>
                    <div className="text-emerald-300 font-semibold text-base">
                      {bookingDetails.adults} Adults
                      {bookingDetails.children > 0 && `, ${bookingDetails.children} Children`}
                      {bookingDetails.seniors > 0 && `, ${bookingDetails.seniors} Seniors`}
                    </div>
                  </div>
                  <div>
                    <div className="text-emerald-300/70 text-sm mb-1">Room Type</div>
                    <div className="text-emerald-300 font-semibold text-base">{bookingDetails.roomType}</div>
                  </div>
                  <div>
                    <div className="text-emerald-300/70 text-sm mb-1">Vehicle Type</div>
                    <div className="text-emerald-300 font-semibold text-base">{bookingDetails.vehicleType}</div>
                  </div>
                  <div>
                    <div className="text-emerald-300/70 text-sm mb-1">Number of Hotels</div>
                    <div className="text-emerald-300 font-semibold text-base">{selectedHotels}</div>
                  </div>
                  <div>
                    <div className="text-emerald-300/70 text-sm mb-1">Number of Cars</div>
                    <div className="text-emerald-300 font-semibold text-base">{selectedCars}</div>
                  </div>
                  {bookingDetails.specialRequests && (
                    <div className="md:col-span-2">
                      <div className="text-emerald-300/70 text-sm mb-1">Special Requests</div>
                      <div className="text-emerald-300 text-base">{bookingDetails.specialRequests}</div>
                    </div>
                  )}
                  {hotelPreferences && (
                    <div className="md:col-span-2">
                      <div className="text-emerald-300/70 text-sm mb-1">Hotel Preferences</div>
                      <div className="text-emerald-300 text-base whitespace-pre-wrap bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30">{hotelPreferences}</div>
                    </div>
                  )}
                  {carPreferences && (
                    <div className="md:col-span-2">
                      <div className="text-emerald-300/70 text-sm mb-1">Car Preferences</div>
                      <div className="text-emerald-300 text-base whitespace-pre-wrap bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30">{carPreferences}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'hotel-count' ? (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Hotel className="w-8 h-8 text-emerald-500" />
                  <h3 className="text-2xl font-bold text-emerald-400">Select Number of Hotels</h3>
                </div>

                <p className="text-emerald-300/80 text-center mb-8">
                  How many hotels would you like to book for your trip?
                </p>

                <div className="flex items-center justify-center gap-6 mb-8">
                  <button
                    onClick={() => setSelectedHotels(Math.max(1, selectedHotels - 1))}
                    className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors text-2xl font-bold shadow-lg"
                  >
                    -
                  </button>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-emerald-400 mb-2">{selectedHotels}</div>
                    <div className="text-emerald-300 text-lg">
                      {selectedHotels === 1 ? 'Hotel' : 'Hotels'}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedHotels(selectedHotels + 1)}
                    className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors text-2xl font-bold shadow-lg"
                  >
                    +
                  </button>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                  <div className="text-emerald-300/70 text-sm mb-2">Current Selection</div>
                  <div className="text-emerald-300 text-lg font-semibold">
                    {selectedHotels} {selectedHotels === 1 ? 'Hotel' : 'Hotels'} for your {bookingDetails.adults + bookingDetails.children + bookingDetails.seniors} guests
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setActiveTab('hotel-preferences')}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Add Hotel Preferences
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'hotel-preferences' ? (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Hotel className="w-8 h-8 text-emerald-500" />
                  <h3 className="text-2xl font-bold text-emerald-400">Hotel Preferences</h3>
                </div>

                <p className="text-emerald-300/80 text-center mb-8">
                  Let us know your specific hotel preferences, requirements, or any special requests
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-emerald-300 font-semibold mb-3 text-lg">
                      Your Preferences (Optional)
                    </label>
                    <textarea
                      value={hotelPreferences}
                      onChange={(e) => setHotelPreferences(e.target.value)}
                      placeholder="Example: Pool view rooms, ground floor, near city center, specific hotel chain preference, etc."
                      className="w-full h-48 px-4 py-3 bg-black/60 border border-emerald-500/40 rounded-lg text-emerald-300 placeholder-emerald-300/40 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  {hotelPreferences && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                      <div className="text-emerald-300/70 text-sm mb-2">Your Hotel Preferences</div>
                      <div className="text-emerald-300 whitespace-pre-wrap">{hotelPreferences}</div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={() => setActiveTab('hotel-count')}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Back to Hotel Count
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'car-count' ? (
            <div className="max-w-2xl mx-auto">
              <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Car className="w-8 h-8 text-emerald-500" />
                  <h3 className="text-2xl font-bold text-emerald-400">Select Number of Cars</h3>
                </div>

                <p className="text-emerald-300/80 text-center mb-8">
                  How many cars would you like to rent for your trip?
                </p>

                <div className="flex items-center justify-center gap-6 mb-8">
                  <button
                    onClick={() => setSelectedCars(Math.max(1, selectedCars - 1))}
                    className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors text-2xl font-bold shadow-lg"
                  >
                    -
                  </button>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-emerald-400 mb-2">{selectedCars}</div>
                    <div className="text-emerald-300 text-lg">
                      {selectedCars === 1 ? 'Car' : 'Cars'}
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCars(selectedCars + 1)}
                    className="w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full transition-colors text-2xl font-bold shadow-lg"
                  >
                    +
                  </button>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 mb-6">
                  <div className="text-emerald-300/70 text-sm mb-2">Current Selection</div>
                  <div className="text-emerald-300 text-lg font-semibold">
                    {selectedCars} {selectedCars === 1 ? 'Car' : 'Cars'} ({bookingDetails.vehicleType})
                  </div>
                </div>

                <div className="bg-black/60 border border-emerald-500/20 rounded-lg p-4">
                  <h4 className="text-emerald-400 font-semibold mb-3 text-sm">Vehicle Type Selected</h4>
                  <div className="text-emerald-300">
                    {bookingDetails.vehicleType === 'small-car' && (
                      <div>
                        <div className="font-semibold mb-1">Small Car</div>
                        <div className="text-sm text-emerald-300/70">Ideal for 4-5 passengers</div>
                      </div>
                    )}
                    {bookingDetails.vehicleType === 'big-car' && (
                      <div>
                        <div className="font-semibold mb-1">Big Car</div>
                        <div className="text-sm text-emerald-300/70">Ideal for 6-7 passengers</div>
                      </div>
                    )}
                    {bookingDetails.vehicleType === 'tempo' && (
                      <div>
                        <div className="font-semibold mb-1">Tempo Traveller</div>
                        <div className="text-sm text-emerald-300/70">Ideal for 10-12 passengers</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={() => setActiveTab('car-preferences')}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Add Car Preferences
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === 'car-preferences' ? (
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="bg-black/40 border border-emerald-500/40 rounded-lg p-8">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Car className="w-8 h-8 text-emerald-500" />
                  <h3 className="text-2xl font-bold text-emerald-400">Car Preferences</h3>
                </div>

                <p className="text-emerald-300/80 text-center mb-8">
                  Let us know your specific car preferences, requirements, or any special requests
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-emerald-300 font-semibold mb-3 text-lg">
                      Your Preferences (Optional)
                    </label>
                    <textarea
                      value={carPreferences}
                      onChange={(e) => setCarPreferences(e.target.value)}
                      placeholder="Example: Driver with local knowledge, AC required, luggage space, child seats, specific pickup location, etc."
                      className="w-full h-48 px-4 py-3 bg-black/60 border border-emerald-500/40 rounded-lg text-emerald-300 placeholder-emerald-300/40 focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>

                  {carPreferences && (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4">
                      <div className="text-emerald-300/70 text-sm mb-2">Your Car Preferences</div>
                      <div className="text-emerald-300 whitespace-pre-wrap">{carPreferences}</div>
                    </div>
                  )}
                </div>

                <div className="flex justify-center gap-4 mt-6">
                  <button
                    onClick={() => setActiveTab('car-count')}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Back to Car Count
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

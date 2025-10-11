import { useState } from 'react';
import TripForm from './components/TripForm';
import DestinationCards from './components/DestinationCards';
import ItineraryView from './components/ItineraryView';
import SavedTrips from './components/SavedTrips';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import HotelOptions from './components/HotelOptions';
import { BookingFormData } from './components/BookingForm';
import { useAuth } from './contexts/AuthContext';
import { supabase } from './lib/supabase';
import {
  TripFormData,
  HotelOption,
  generateHotelPrompt,
  mockLLMCall
} from './lib/llm';
import { generateDestinations, DestinationOption } from './lib/aiDestinations';
import { generateAIItinerary, ItineraryDay } from './lib/aiItinerary';
import AIDestinationResults from './components/AIDestinationResults';
import { exportItineraryToPDF } from './lib/pdfExport';
import { Plane, LogOut, BookmarkCheck } from 'lucide-react';

type AppStep = 'form' | 'ai-destinations' | 'destinations' | 'itinerary' | 'saved-trips';
type AuthView = 'login' | 'signup';

function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [authView, setAuthView] = useState<AuthView>('login');
  const [step, setStep] = useState<AppStep>('form');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<TripFormData | null>(null);
  const [destinations, setDestinations] = useState<DestinationOption[]>([]);
  const [selectedDestination, setSelectedDestination] = useState<DestinationOption | null>(null);
  const [itinerary, setItinerary] = useState<{ itinerary: ItineraryDay[], total_estimated_cost_per_person: number, summary_message?: string } | null>(null);
  const [currentTripId, setCurrentTripId] = useState<string | null>(null);
  const [showHotelOptions, setShowHotelOptions] = useState(false);
  const [hotelOptions, setHotelOptions] = useState<HotelOption[]>([]);
  const [currentBookingData, setCurrentBookingData] = useState<BookingFormData | null>(null);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 relative z-10"></div>
      </div>
    );
  }

  if (!user) {
    if (authView === 'signup') {
      return <SignupPage onSwitchToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onSwitchToSignup={() => setAuthView('signup')} />;
  }

  const handleFormSubmit = async (data: TripFormData) => {
    setFormData(data);
    setLoading(true);

    try {
      const response = await generateDestinations(data);

      const { data: trip, error } = await supabase
        .from('trips')
        .insert({
          user_id: user?.id,
          user_session_id: user?.id || 'anonymous',
          month: data.month,
          travelers: data.travelers,
          group_type: data.groupType,
          domestic_or_intl: data.domesticOrIntl,
          theme: data.theme,
          mood: data.mood,
          budget: data.budget,
          flexible_dates: data.flexibleDates,
          travel_mode: data.travelMode,
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      if (trip) {
        setCurrentTripId(trip.id);
      }

      await supabase.from('itineraries').insert({
        trip_id: trip?.id,
        destination_options: response.destinations,
      });

      setDestinations(response.destinations);
      setStep('ai-destinations');
    } catch (error) {
      console.error('Error generating destinations:', error);
      alert('Failed to generate destinations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationSelect = async (destination: DestinationOption) => {
    if (!formData || !currentTripId) return;

    setSelectedDestination(destination);
    setLoading(true);

    try {
      await supabase
        .from('trips')
        .update({
          selected_destination: destination,
          days: formData.days,
        })
        .eq('id', currentTripId);

      const response = await generateAIItinerary(
        formData.startLocation,
        destination.title,
        formData.month,
        formData.budget,
        formData.groupType,
        formData.theme,
        formData.mood,
        formData.travelMode,
        formData.days
      );

      await supabase
        .from('itineraries')
        .update({
          daily_plan: response.itinerary,
          total_cost_per_person: response.total_estimated_cost_per_person,
        })
        .eq('trip_id', currentTripId);

      setItinerary(response);
      setStep('itinerary');
    } catch (error) {
      console.error('Error generating itinerary:', error);
      alert('Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!currentTripId || !itinerary || !selectedDestination || !user) {
      alert('Unable to save trip. Please try again.');
      return;
    }

    setSaving(true);
    try {
      const { error: tripError } = await supabase
        .from('trips')
        .update({
          selected_destination: selectedDestination,
          days: itinerary.itinerary.length,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentTripId)
        .eq('user_id', user.id);

      if (tripError) throw tripError;

      const { error: itineraryError } = await supabase
        .from('itineraries')
        .upsert({
          trip_id: currentTripId,
          destination_options: destinations,
          daily_plan: itinerary.itinerary,
          total_cost_per_person: itinerary.total_estimated_cost_per_person
        }, {
          onConflict: 'trip_id'
        });

      if (itineraryError) throw itineraryError;

      alert('Trip saved successfully! You can access it anytime from your saved trips.');
    } catch (error) {
      console.error('Error saving trip:', error);
      alert('Failed to save trip. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = () => {
    console.log('Export PDF called');
    console.log('Itinerary:', itinerary);
    console.log('Selected destination:', selectedDestination);

    if (!itinerary || !selectedDestination) {
      alert('No itinerary to export.');
      return;
    }

    try {
      console.log('Starting PDF export...');
      exportItineraryToPDF(
        selectedDestination.title,
        itinerary.itinerary,
        itinerary.total_estimated_cost_per_person
      );
      console.log('PDF export completed successfully');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export PDF: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleStartNew = () => {
    setStep('form');
    setFormData(null);
    setDestinations([]);
    setSelectedDestination(null);
    setItinerary(null);
    setCurrentTripId(null);
  };

  const handleBackToDestinations = () => {
    setStep('destinations');
    setSelectedDestination(null);
    setItinerary(null);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setStep('form');
      setFormData(null);
      setDestinations([]);
      setSelectedDestination(null);
      setItinerary(null);
      setCurrentTripId(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleViewSavedTrip = (trip: any) => {
    setFormData({
      month: trip.month,
      travelers: trip.travelers,
      groupType: trip.group_type,
      domesticOrIntl: trip.domestic_or_intl,
      theme: [],
      mood: trip.mood || '',
      budget: trip.budget,
      flexibleDates: false
    });
    setSelectedDestination(trip.selected_destination);
    setCurrentTripId(trip.id);

    if (trip.itinerary) {
      setItinerary({
        itinerary: trip.itinerary.daily_plan,
        total_estimated_cost_per_person: trip.itinerary.total_cost_per_person
      });
      setStep('itinerary');
    } else {
      setStep('destinations');
    }
  };

  const handleBookingSubmit = async (
    bookingData: BookingFormData,
    customerDetails: { name: string; email: string; phone: string }
  ) => {
    if (!user || !selectedDestination || !currentTripId || !formData) {
      console.error('Missing required data:', { user: !!user, selectedDestination: !!selectedDestination, currentTripId, formData: !!formData });
      alert('Unable to process booking. Please try again or refresh the page.');
      return;
    }

    console.log('Starting booking submission...', { destination: selectedDestination.title, customerName: customerDetails.name });

    try {
      console.log('Generating hotel options...');
      const hotelPrompt = generateHotelPrompt(
        selectedDestination.title,
        bookingData.roomType,
        bookingData.adults,
        bookingData.children,
        bookingData.seniors,
        bookingData.specialRequests,
        formData.budget
      );

      const hotelResponse = await mockLLMCall(hotelPrompt);
      console.log('Hotel options generated:', hotelResponse.hotels?.length || 0);

      console.log('Saving booking to database...');
      const { error: bookingError } = await supabase
        .from('booking_requests')
        .insert({
          user_id: user.id,
          trip_id: currentTripId,
          destination_name: selectedDestination.title,
          adults: bookingData.adults,
          children: bookingData.children,
          seniors: bookingData.seniors,
          number_of_hotels: bookingData.numberOfHotels,
          number_of_rooms: bookingData.numberOfRooms,
          number_of_cars: bookingData.numberOfCars,
          room_type: bookingData.roomType,
          vehicle_type: bookingData.vehicleType,
          special_requests: bookingData.specialRequests,
          customer_name: customerDetails.name,
          customer_email: customerDetails.email,
          customer_phone: customerDetails.phone,
          hotel_options: hotelResponse.hotels,
          status: 'pending'
        });

      if (bookingError) {
        console.error('Database error:', bookingError);
        throw bookingError;
      }
      console.log('Booking saved to database successfully');

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const { data: { session } } = await supabase.auth.getSession();

      console.log('Sending email notification...');
      if (session?.access_token) {
        try {
          const emailResponse = await fetch(
            `${supabaseUrl}/functions/v1/send-booking-email`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`,
                'apikey': supabaseAnonKey,
              },
              body: JSON.stringify({
                customerName: customerDetails.name,
                customerEmail: customerDetails.email,
                customerPhone: customerDetails.phone,
                destinationName: selectedDestination.title,
                adults: bookingData.adults,
                children: bookingData.children,
                seniors: bookingData.seniors,
                numberOfHotels: bookingData.numberOfHotels,
                numberOfRooms: bookingData.numberOfRooms,
                numberOfCars: bookingData.numberOfCars,
                roomType: bookingData.roomType,
                vehicleType: bookingData.vehicleType,
                specialRequests: bookingData.specialRequests,
                tripBudget: formData.budget,
              }),
            }
          );

          if (!emailResponse.ok) {
            const errorText = await emailResponse.text();
            console.error('Failed to send email notification:', errorText);
          } else {
            const result = await emailResponse.json();
            console.log('Booking confirmation email sent successfully:', result);
          }
        } catch (emailError) {
          console.error('Error sending email notification:', emailError);
        }
      } else {
        console.log('No active session, skipping email notification');
      }

      console.log('Displaying hotel options...');
      setCurrentBookingData(bookingData);
      setHotelOptions(hotelResponse.hotels || []);
      setShowHotelOptions(true);
    } catch (error) {
      console.error('Error processing booking:', error);
      alert('Failed to process booking request: ' + (error instanceof Error ? error.message : 'Unknown error') + '. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Plane className="w-10 h-10 mr-3" style={{ color: '#D4AF37' }} />
            <h1 className="text-4xl font-bold" style={{ color: '#D4AF37' }}>Travel Planner</h1>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep('saved-trips')}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <BookmarkCheck className="w-4 h-4" />
              My Trips
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          {step === 'form' && (
            <TripForm onSubmit={handleFormSubmit} loading={loading} />
          )}

          {step === 'ai-destinations' && !loading && (
            <AIDestinationResults
              destinations={destinations}
              onSelectDestination={handleDestinationSelect}
              onBack={handleStartNew}
            />
          )}

          {step === 'destinations' && !loading && (
            <DestinationCards
              options={destinations}
              onSelect={handleDestinationSelect}
              onBack={handleStartNew}
            />
          )}

          {step === 'itinerary' && itinerary && selectedDestination && (
            <ItineraryView
              itinerary={itinerary.itinerary}
              totalCost={itinerary.total_estimated_cost_per_person}
              destinationName={selectedDestination.title}
              tripBudget={formData?.budget}
              summaryMessage={itinerary.summary_message}
              onSave={handleSaveTrip}
              onExport={handleExportPDF}
              onBack={handleStartNew}
              onBackToDestinations={handleBackToDestinations}
              onBookingSubmit={handleBookingSubmit}
              saving={saving}
            />
          )}

          {step === 'saved-trips' && (
            <SavedTrips
              onBack={handleStartNew}
              onViewTrip={handleViewSavedTrip}
            />
          )}

          {loading && (
            <div className="bg-emerald-900/30 backdrop-blur-md border-2 border-emerald-500/40 rounded-xl shadow-lg p-12 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto mb-4"></div>
              <p className="text-emerald-300 text-lg">
                {step === 'ai-destinations' || step === 'destinations' ? 'AI is curating your perfect destinations...' : 'Creating your personalized itinerary...'}
              </p>
            </div>
          )}
        </div>
      </div>

      {showHotelOptions && currentBookingData && itinerary && selectedDestination && formData && (
        <HotelOptions
          hotels={hotelOptions}
          customerDetails={{
            name: currentBookingData.customerName,
            email: currentBookingData.customerEmail,
            phone: currentBookingData.customerPhone
          }}
          bookingDetails={{
            adults: currentBookingData.adults,
            children: currentBookingData.children,
            seniors: currentBookingData.seniors,
            roomType: currentBookingData.roomType,
            vehicleType: currentBookingData.vehicleType,
            specialRequests: currentBookingData.specialRequests,
            numberOfHotels: currentBookingData.numberOfHotels,
            numberOfCars: currentBookingData.numberOfCars
          }}
          itinerary={itinerary.itinerary}
          travelMode={formData.travelMode}
          destinationName={selectedDestination.name}
          onClose={() => setShowHotelOptions(false)}
          onLogout={signOut}
        />
      )}
    </div>
  );
}

export default App;

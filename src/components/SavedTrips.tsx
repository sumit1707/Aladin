import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { MapPin, Calendar, Users, DollarSign, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { DestinationOption, ItineraryDay } from '../lib/llm';

interface SavedTrip {
  id: string;
  month: string;
  travelers: number;
  group_type: string;
  budget: string;
  selected_destination: DestinationOption;
  days: number;
  created_at: string;
  itinerary?: {
    daily_plan: ItineraryDay[];
    total_cost_per_person: number;
  };
}

interface SavedTripsProps {
  onBack: () => void;
  onViewTrip: (trip: SavedTrip) => void;
}

export default function SavedTrips({ onBack, onViewTrip }: SavedTripsProps) {
  const { user } = useAuth();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedTrips();
  }, [user]);

  const loadSavedTrips = async () => {
    if (!user) return;

    try {
      const { data: tripsData, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', user.id)
        .not('selected_destination', 'is', null)
        .order('created_at', { ascending: false });

      if (tripsError) throw tripsError;

      const tripsWithItineraries = await Promise.all(
        (tripsData || []).map(async (trip) => {
          const { data: itineraryData } = await supabase
            .from('itineraries')
            .select('daily_plan, total_cost_per_person')
            .eq('trip_id', trip.id)
            .single();

          return {
            ...trip,
            itinerary: itineraryData || undefined
          };
        })
      );

      setTrips(tripsWithItineraries);
    } catch (error) {
      console.error('Error loading saved trips:', error);
      alert('Failed to load saved trips.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this trip?')) return;

    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setTrips(trips.filter(trip => trip.id !== tripId));
      alert('Trip deleted successfully.');
    } catch (error) {
      console.error('Error deleting trip:', error);
      alert('Failed to delete trip.');
    }
  };

  if (loading) {
    return (
      <div className="w-full max-w-5xl">
        <div className="bg-black/40 backdrop-blur-md border-2 border-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20 p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-emerald-300 text-lg">Loading your saved trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="bg-black/40 backdrop-blur-md border-2 border-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-bold text-emerald-400">My Saved Trips</h2>
            <p className="text-emerald-300 mt-1">{trips.length} saved {trips.length === 1 ? 'trip' : 'trips'}</p>
          </div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 border border-emerald-500/50 text-emerald-300 rounded-lg hover:bg-emerald-900/30 transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Planning
          </button>
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="bg-black/40 backdrop-blur-md border-2 border-emerald-500/40 rounded-xl shadow-lg p-12 text-center">
          <MapPin className="w-16 h-16 text-emerald-500/50 mx-auto mb-4" />
          <p className="text-emerald-300 text-lg">No saved trips yet</p>
          <p className="text-emerald-400/70 mt-2">Start planning your next adventure!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-black/40 backdrop-blur-md border-2 border-emerald-500 rounded-xl shadow-lg shadow-emerald-500/20 overflow-hidden hover:border-emerald-400 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-emerald-400 mb-2">
                      {trip.selected_destination.title}
                    </h3>
                    <p className="text-emerald-300/80 text-sm mb-3">
                      {trip.selected_destination.description}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2 text-emerald-300">
                        <Calendar className="w-4 h-4" />
                        <span>{trip.month} ({trip.days} days)</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-300">
                        <Users className="w-4 h-4" />
                        <span>{trip.travelers} travelers | {trip.group_type}</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-300">
                        <DollarSign className="w-4 h-4" />
                        <span>{trip.budget}</span>
                      </div>
                    </div>
                    {trip.itinerary && (
                      <div className="mt-3 inline-block bg-emerald-500/20 border border-emerald-500/40 rounded-lg px-3 py-1">
                        <span className="text-emerald-300 text-sm font-semibold">
                          ₹{trip.itinerary.total_cost_per_person.toLocaleString('en-IN')} per person
                        </span>
                      </div>
                    )}
                  </div>
                  <img
                    src={trip.selected_destination.image_url}
                    alt={trip.selected_destination.title}
                    className="w-32 h-32 object-cover rounded-lg ml-4"
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-emerald-500/30">
                  <button
                    onClick={() => onViewTrip(trip)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-colors shadow-lg shadow-emerald-500/30 font-semibold"
                  >
                    <Eye className="w-4 h-4" />
                    View Itinerary
                  </button>
                  <button
                    onClick={() => handleDeleteTrip(trip.id)}
                    className="flex items-center gap-2 px-4 py-2 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-900/30 transition-colors font-semibold"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

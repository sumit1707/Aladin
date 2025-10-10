import { useState } from 'react';
import { TripFormData } from '../lib/llm';

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  loading: boolean;
}

export default function TripForm({ onSubmit, loading }: TripFormProps) {
  const [formData, setFormData] = useState<TripFormData>({
    month: '',
    travelers: 1,
    groupType: '',
    domesticOrIntl: '',
    theme: [],
    mood: '',
    budget: '',
    flexibleDates: false,
    travelMode: '',
    startLocation: '',
    days: 3,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TripFormData, string>>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof TripFormData, string>> = {};

    if (!formData.month) newErrors.month = 'Please select a month';
    if (formData.travelers < 1) newErrors.travelers = 'At least 1 traveler required';
    if (!formData.groupType) newErrors.groupType = 'Please select group type';
    if (!formData.domesticOrIntl) newErrors.domesticOrIntl = 'Please select destination preference';
    if (formData.theme.length === 0) newErrors.theme = 'Please select at least one theme';
    if (!formData.mood) newErrors.mood = 'Please select a mood';
    if (!formData.budget) newErrors.budget = 'Please select a budget';
    if (!formData.travelMode) newErrors.travelMode = 'Please select travel mode';
    if (!formData.startLocation) newErrors.startLocation = 'Please enter your starting location';
    if (formData.days < 1 || formData.days > 30) newErrors.days = 'Days must be between 1 and 30';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(formData);
  };

  const handleThemeChange = (theme: string) => {
    setFormData(prev => ({
      ...prev,
      theme: prev.theme.includes(theme)
        ? prev.theme.filter(t => t !== theme)
        : [...prev.theme, theme]
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gradient-to-br from-black/60 via-emerald-950/40 to-black/60 backdrop-blur-xl border-2 border-emerald-400/50 rounded-3xl shadow-2xl shadow-emerald-500/40 p-6 max-w-4xl w-full relative overflow-y-auto max-h-[95vh]">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-emerald-500/5 pointer-events-none"></div>
      <div className="relative z-10">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-emerald-300 to-emerald-400 bg-clip-text text-transparent mb-2 drop-shadow-lg animate-pulse">Plan Your Perfect Trip</h1>
        <p className="text-emerald-300/80 text-xs font-light tracking-wide">Let AI craft your dream vacation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-2">
            Starting from (City) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Delhi, Mumbai, Bangalore"
            value={formData.startLocation}
            onChange={(e) => setFormData({ ...formData, startLocation: e.target.value })}
            className="w-full px-4 py-2 bg-black/50 border border-emerald-500/50 rounded-lg text-emerald-300 placeholder-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
          {errors.startLocation && <p className="text-red-500 text-xs mt-1">{errors.startLocation}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-2">
            Month of travel <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.month}
            onChange={(e) => setFormData({ ...formData, month: e.target.value })}
            className="w-full px-4 py-2 bg-black/50 border border-emerald-500/50 rounded-lg text-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          >
            <option value="">Select month</option>
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {errors.month && <p className="text-red-500 text-xs mt-1">{errors.month}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-2">
            Number of travellers <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            value={formData.travelers}
            onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-2 bg-black/50 border border-emerald-500/50 rounded-lg text-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
          {errors.travelers && <p className="text-red-500 text-xs mt-1">{errors.travelers}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-2">
            Number of days <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="30"
            placeholder="e.g., 3, 5, 7"
            value={formData.days}
            onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) || 1 })}
            className="w-full px-4 py-2 bg-black/50 border border-emerald-500/50 rounded-lg text-emerald-300 placeholder-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
          {errors.days && <p className="text-red-500 text-xs mt-1">{errors.days}</p>}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-emerald-300 mb-3">
          Group type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Family', 'Couple', 'Bachelors', 'Solo'].map(type => (
            <label key={type} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="groupType"
                value={type}
                checked={formData.groupType === type}
                onChange={(e) => setFormData({ ...formData, groupType: e.target.value })}
                className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 accent-emerald-500"
              />
              <span className="text-sm text-emerald-300">{type}</span>
            </label>
          ))}
        </div>
        {errors.groupType && <p className="text-red-500 text-xs mt-1">{errors.groupType}</p>}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-emerald-300 mb-3">
          Destination preference <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {['Within India', 'Outside India'].map(pref => (
            <label key={pref} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="domesticOrIntl"
                value={pref}
                checked={formData.domesticOrIntl === pref}
                onChange={(e) => setFormData({ ...formData, domesticOrIntl: e.target.value })}
                className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 accent-emerald-500"
              />
              <span className="text-sm text-emerald-300">{pref}</span>
            </label>
          ))}
        </div>
        {errors.domesticOrIntl && <p className="text-red-500 text-xs mt-1">{errors.domesticOrIntl}</p>}
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-emerald-300 mb-3">
          Preferred type <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {['Mountain', 'Beach', 'Temple', 'City', 'Adventure', 'Nature'].map(theme => (
            <label key={theme} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.theme.includes(theme)}
                onChange={() => handleThemeChange(theme)}
                className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 accent-emerald-500"
              />
              <span className="text-sm text-emerald-300">{theme}</span>
            </label>
          ))}
        </div>
        {errors.theme && <p className="text-red-500 text-xs mt-1">{errors.theme}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-2">
            Mood <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.mood}
            onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
            className="w-full px-4 py-2 bg-black/50 border border-emerald-500/50 rounded-lg text-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          >
            <option value="">Select mood</option>
            {['Exploring', 'Relaxing', 'Party', 'Cultural'].map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          {errors.mood && <p className="text-red-500 text-xs mt-1">{errors.mood}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-emerald-300 mb-2">
            Budget per person (approx) <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="w-full px-4 py-2 bg-black/50 border border-emerald-500/50 rounded-lg text-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          >
            <option value="">Select budget</option>
            {['< ₹15,000', '₹15,000-₹40,000', '₹40,000-₹80,000', '₹80,000+'].map(b => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget}</p>}
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-emerald-300 mb-3">
          How do you want to travel? <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['Car', 'Train 3A', 'Train 2A', 'Flight'].map(mode => (
            <label key={mode} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="travelMode"
                value={mode}
                checked={formData.travelMode === mode}
                onChange={(e) => setFormData({ ...formData, travelMode: e.target.value })}
                className="w-4 h-4 text-emerald-500 focus:ring-emerald-500 accent-emerald-500"
              />
              <span className="text-sm text-emerald-300">{mode}</span>
            </label>
          ))}
        </div>
        {errors.travelMode && <p className="text-red-500 text-xs mt-1">{errors.travelMode}</p>}
      </div>

      <div className="mt-4">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.flexibleDates}
            onChange={(e) => setFormData({ ...formData, flexibleDates: e.target.checked })}
            className="w-4 h-4 text-emerald-500 rounded focus:ring-emerald-500 accent-emerald-500"
          />
          <span className="text-sm text-emerald-300">Are your dates flexible?</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-6 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 hover:from-emerald-500 hover:via-emerald-600 hover:to-emerald-700 text-white py-3 px-6 rounded-2xl font-bold text-base tracking-wide transition-all transform hover:scale-[1.05] hover:shadow-2xl hover:shadow-emerald-500/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-xl shadow-emerald-500/50 relative overflow-hidden group"
      >
        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
        <span className="relative z-10 flex items-center justify-center gap-3">
          {loading ? (
            <>
              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Finding Your Perfect Destinations...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span>Discover Amazing Destinations</span>
            </>
          )}
        </span>
      </button>
      </div>
    </form>
  );
}

import { useState } from 'react';
import { X } from 'lucide-react';

interface DaysModalProps {
  destinationName: string;
  onConfirm: (days: number) => void;
  onClose: () => void;
}

export default function DaysModal({ destinationName, onConfirm, onClose }: DaysModalProps) {
  const [days, setDays] = useState<number>(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (days >= 1 && days <= 30) {
      onConfirm(days);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-black/60 backdrop-blur-md border-2 border-emerald-500 rounded-xl shadow-2xl shadow-emerald-500/30 max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-emerald-400">Plan Your Trip</h3>
          <button
            onClick={onClose}
            className="text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <p className="text-emerald-300 mb-6">
          You've selected <span className="font-semibold text-emerald-400">{destinationName}</span>.
          How many days do you plan to stay?
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-emerald-300 mb-2">
              Number of days
            </label>
            <input
              type="number"
              min="1"
              max="30"
              value={days}
              onChange={(e) => setDays(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 bg-black/50 border border-emerald-500/50 rounded-lg text-emerald-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all text-lg"
              autoFocus
            />
            <p className="text-xs text-emerald-400/60 mt-2">Choose between 1 and 30 days</p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-emerald-500/50 text-emerald-300 rounded-lg hover:bg-emerald-900/30 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-colors font-semibold shadow-lg shadow-emerald-500/30"
            >
              Generate Itinerary
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

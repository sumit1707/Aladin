import { useState } from 'react';
import { Mail, Lock, LogIn, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
  onSwitchToSignup: () => void;
}

export default function LoginPage({ onSwitchToSignup }: LoginPageProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fromDestination, setFromDestination] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-400/15 via-green-500/5 to-transparent"></div>

      <div className="w-full flex items-center justify-center relative z-10">
        <div className="flex-1 flex items-center justify-start p-8 pl-16 bg-gradient-to-br from-black/30 via-green-950/20 to-transparent">
          <div className="relative max-w-xl">
            <img
              src="/image copy.png"
              alt="Genie"
              className="w-full h-auto object-contain animate-float drop-shadow-2xl"
            />
            <div className="text-center mt-8">
              <h2 className="text-2xl font-bold mb-2 tracking-wide text-emerald-400">
                Welcome to Genie House
              </h2>
              <p className="text-sm text-emerald-300">Plan your trip in a snap</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-start p-8 pl-24">
          <div className="w-full max-w-md -mt-16">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#D4AF37' }}>Travel Planner</h1>
              <p className="text-emerald-300">AI-Powered Trip Planning</p>
            </div>

            <div className="bg-emerald-900/30 backdrop-blur-md border-2 border-emerald-500/40 rounded-2xl p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-emerald-400/60" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-emerald-800/30 border border-emerald-600/40 rounded-lg text-emerald-300 placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-emerald-400/60" />
                    </div>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      required
                      className="w-full pl-12 pr-4 py-3 bg-emerald-800/30 border border-emerald-600/40 rounded-lg text-emerald-300 placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-emerald-400/60" />
                    </div>
                    <input
                      type="text"
                      value={fromDestination}
                      onChange={(e) => setFromDestination(e.target.value)}
                      placeholder="From Destination (City)"
                      className="w-full pl-12 pr-4 py-3 bg-emerald-800/30 border border-emerald-600/40 rounded-lg text-emerald-300 placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-emerald-500/30"
                >
                  <LogIn className="w-5 h-5" />
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={onSwitchToSignup}
                  className="text-emerald-300 hover:text-emerald-200 text-sm transition-colors underline decoration-emerald-400/40 hover:decoration-emerald-400"
                >
                  Don't have an account? Create one
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

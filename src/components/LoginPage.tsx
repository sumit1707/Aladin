import { useState, useEffect } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
  onSwitchToSignup: () => void;
}

export default function LoginPage({ onSwitchToSignup }: LoginPageProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState(() => {
    return localStorage.getItem('loginEmail') || '';
  });
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (email) {
      localStorage.setItem('loginEmail', email);
    }
  }, [email]);

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
        <div className="flex flex-row items-center justify-center gap-56 p-8 max-w-7xl mx-auto">
          <div className="relative max-w-sm flex-shrink-0">
            <img
              src="/image copy.png"
              alt="Genie"
              className="w-full h-auto object-contain animate-float drop-shadow-2xl scale-115"
            />
            <div className="text-center mt-4">
              <h2 className="text-lg font-bold mb-1 tracking-wide text-emerald-400">
                Welcome to Genie House
              </h2>
              <p className="text-xs text-emerald-300">Plan your trip in a snap</p>
            </div>
          </div>

          <div className="w-full max-w-lg scale-115 -translate-y-12">
            <div className="text-center mb-6 scale-125">
              <h1 className="text-3xl font-bold mb-2" style={{ color: '#D4AF37' }}>Travel Planner</h1>
              <p className="text-emerald-300 text-sm">AI-Powered Trip Planning</p>
            </div>

            <div className="bg-emerald-900/30 backdrop-blur-md border-2 border-emerald-500/40 rounded-2xl p-8 shadow-2xl scale-125">
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

      <div className="absolute bottom-0 left-0 right-0 py-4 z-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="feature-item">
              <div className="text-emerald-300 font-semibold text-base">Customized Itinerary</div>
              <div className="text-emerald-400/80 text-sm mt-1">Tailored to your preferences</div>
            </div>
            <div className="feature-item">
              <div className="text-emerald-300 font-semibold text-base">Budget-Friendly Plans</div>
              <div className="text-emerald-400/80 text-sm mt-1">Plans that fit your budget</div>
            </div>
            <div className="feature-item">
              <div className="text-emerald-300 font-semibold text-base">Time-Optimized</div>
              <div className="text-emerald-400/80 text-sm mt-1">Perfect for your schedule</div>
            </div>
            <div className="feature-item">
              <div className="text-emerald-300 font-semibold text-base">Your Recommendations</div>
              <div className="text-emerald-400/80 text-sm mt-1">We value your input</div>
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
        @keyframes shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        .feature-item {
          position: relative;
          animation: shimmer 3s infinite linear;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(16, 185, 129, 0.1) 50%,
            transparent 100%
          );
          background-size: 1000px 100%;
          padding: 8px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
}

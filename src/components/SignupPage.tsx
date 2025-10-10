import { useState } from 'react';
import { Mail, Lock, User, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import GenieIllustration from './GenieIllustration';

interface SignupPageProps {
  onSwitchToLogin: () => void;
}

export default function SignupPage({ onSwitchToLogin }: SignupPageProps) {
  const { signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      await signUp(email, password, fullName);
      setSuccess(true);
      setEmail('');
      setPassword('');
      setFullName('');
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-400/15 via-green-500/5 to-transparent"></div>

      <div className="w-full max-w-7xl mx-auto flex items-center justify-between relative z-10">
        <div className="flex-1 flex items-center justify-center">
          <div className="relative animate-float">
            <GenieIllustration />

            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-center">
              <h2 className="text-3xl font-bold text-emerald-400 mb-2 animate-pulse">
                Join Us!
              </h2>
              <p className="text-emerald-300 text-lg">Start Planning Today</p>
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2" style={{ color: '#D4AF37' }}>Create Account</h1>
              <p className="text-emerald-300">Join our travel community</p>
            </div>

            <div className="bg-emerald-900/30 backdrop-blur-md border-2 border-emerald-500/40 rounded-2xl p-8 shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-emerald-400/60" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Full Name"
                      className="w-full pl-12 pr-4 py-3 bg-emerald-800/30 border border-emerald-600/40 rounded-lg text-emerald-300 placeholder-emerald-400/50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

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
                      placeholder="Password (min. 6 characters)"
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

                {success && (
                  <div className="bg-emerald-500/20 border border-emerald-500/50 rounded-lg p-3">
                    <p className="text-emerald-200 text-sm">
                      Account created successfully! Redirecting to login...
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg shadow-emerald-500/30"
                >
                  <LogIn className="w-5 h-5" />
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={onSwitchToLogin}
                  className="text-emerald-300 hover:text-emerald-200 text-sm transition-colors underline decoration-emerald-400/40 hover:decoration-emerald-400"
                >
                  Already have an account? Sign in
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

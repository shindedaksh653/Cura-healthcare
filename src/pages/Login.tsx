import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useApp } from '../context/AppContext';

export default function Login() {
  const [role, setRole] = useState<'patient' | 'doctor' | 'kiosk'>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useApp();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if email is verified
      if (!user.emailVerified) {
        await signOut(auth);
        setError('Please verify your email address before logging in. Check your inbox for the confirmation link.');
        setLoading(false);
        return;
      }

      // Extract name from Firebase auth or fallback to email prefix capitalized
      const displayName = user.displayName || email.split('@')[0].replace('.', ' ');
      const capitalizedName = displayName.replace(/\b\w/g, (l) => l.toUpperCase());

      // Save user profile details for dynamic initials and views
      const userProfile = {
        name: capitalizedName,
        email: user.email,
        phone: user.phoneNumber || '+91 98765 43210',
        location: 'Nagpur, India',
      };
      localStorage.setItem('cura_user', JSON.stringify(userProfile));

      // Redirect based on selected role
      if (role === 'doctor') {
        navigate('/doctor-dashboard');
      } else if (role === 'kiosk') {
        navigate('/kiosk-dashboard');
      } else {
        navigate('/patient-dashboard');
      }
    } catch (err: any) {
      setError('Invalid email or password. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-0 sm:rounded-3xl shadow-xl p-6 flex flex-col justify-between">
        <div>
          {/* Header */}
          <div className="mt-6 mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('welcomeBack')}</h1>
            <p className="text-gray-400 text-sm">{t('loginSubtitle')}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Role Toggle Switch */}
          <div className="bg-gray-100 p-1 rounded-full flex mb-6">
            <button 
              type="button"
              onClick={() => setRole('patient')}
              className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                role === 'patient' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('patientRole')}
            </button>
            <button 
              type="button"
              onClick={() => setRole('doctor')}
              className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                role === 'doctor' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('doctorRole')}
            </button>
            <button 
              type="button"
              onClick={() => setRole('kiosk')}
              className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                role === 'kiosk' ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Kiosk
            </button>
          </div>

          {/* Inputs */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('emailAddress')}</label>
              <input 
                type="email" 
                placeholder={t('enterEmailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500 focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{t('passwordLabel')}</label>
              <input 
                type="password" 
                placeholder={t('enterPasswordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500 focus:bg-white transition-all"
              />
            </div>
            <div className="text-right">
              <button type="button" className="text-teal-600 text-xs font-medium hover:underline">{t('forgotPassword')}</button>
            </div>

            {/* Submit Button */}
            <div className="w-full mt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-teal-600 text-white font-semibold py-3.5 rounded-full hover:bg-teal-700 transition-all shadow-md shadow-teal-500/20 text-sm disabled:opacity-50"
              >
                {loading ? t('loggingIn') : t('login')}
              </button>
            </div>
          </form>

          {/* Social Icons */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-xs mb-4">{t('orContinueWith')}</p>
            <div className="flex justify-center gap-4">
              <button type="button" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 text-sm">G</button>
              <button type="button" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 text-sm">🍎</button>
              <button type="button" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-50 text-sm">f</button>
            </div>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-gray-500 my-4">
          {t('dontHaveAccount')} <Link to="/register" className="text-teal-600 font-semibold hover:underline">{t('register')}</Link>
        </p>
      </div>
    </div>
  );
}
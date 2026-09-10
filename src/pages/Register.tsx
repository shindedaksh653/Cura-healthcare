import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, PlusCircle, Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import { useApp } from '../context/AppContext';

export default function Register() {
  const navigate = useNavigate();
  const { t } = useApp();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      // 2. Update Firebase Auth profile with full name
      await updateProfile(user, {
        displayName: formData.fullName,
      });

      // 3. Save user profile info in localStorage for instant retrieval across views
      const userProfile = {
        name: formData.fullName,
        email: formData.email,
        phone: '+91 98765 43210',
        location: 'Nagpur, India',
      };
      localStorage.setItem('cura_user', JSON.stringify(userProfile));

      // 4. Send email verification
      await sendEmailVerification(user);

      alert("Registration successful! Please check your email inbox to verify your account before logging in.");
      await auth.signOut();
      
      navigate('/patient-dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    const googleUser = { name: 'Shinde Daksh', email: 'shinde.daksh@gmail.com', phone: '+91 98765 43210', location: 'Nagpur, India' };
    localStorage.setItem('authToken', 'google-oauth-token-12345');
    localStorage.setItem('cura_user', JSON.stringify(googleUser));
    navigate('/patient-dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[844px] sm:rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col justify-between p-6 sm:p-8">
        
        {/* Top Brand Logo */}
        <div className="flex items-center justify-center gap-2.5 pt-4">
          <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/30 relative">
            <HeartPulse size={22} className="absolute" />
            <div className="absolute inset-0 bg-teal-600/10 flex items-center justify-center">
              <PlusCircle size={14} className="text-white stroke-[3]" />
            </div>
          </div>
          <div>
            <span className="text-base font-black tracking-tight text-slate-900 block leading-none">CURA</span>
            <span className="text-[9px] font-bold text-teal-600 tracking-widest uppercase">Health Vault</span>
          </div>
        </div>

        {/* Header Title */}
        <div className="space-y-1 text-center my-6">
          <h1 className="text-xl font-bold text-slate-900">{t('createAccountTitle')}</h1>
          <p className="text-xs text-slate-500">{t('createAccountSubtitle')}</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-2xl">
            {error}
          </div>
        )}

        {/* Form Section */}
        <div className="space-y-4 flex-1">
          
          <button
            onClick={handleGoogleSignup}
            type="button"
            className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center gap-2.5 transition-all active:scale-95"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.95H1.2v3.15C3.18 21.32 7.23 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.25c-.25-.72-.38-1.49-.38-2.25s.13-1.53.38-2.25V6.6H1.2C.44 8.13 0 9.87 0 12s.44 3.87 1.2 5.4l4.08-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.18 2.68 1.2 6.6l4.08 3.15c.95-2.84 3.6-4.95 6.72-4.95z" />
            </svg>
            <span>{t('continueWithGoogle')}</span>
          </button>

          <div className="flex items-center my-3">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="px-3 text-[10px] font-bold text-slate-400 uppercase">{t('orWithEmail')}</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 block">{t('fullNameLabel')}</label>
              <div className="relative flex items-center">
                <User size={16} className="absolute left-3 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="Shinde Daksh"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-teal-600 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 block">{t('emailAddress')}</label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-teal-600 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-600 block">{t('passwordLabel')}</label>
              <div className="relative flex items-center">
                <Lock size={16} className="absolute left-3 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-9 pr-3 text-xs text-slate-800 outline-none focus:border-teal-600 shadow-sm"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <span>{loading ? t('creatingAccount') : t('createAccount')}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center pt-4">
          <p className="text-xs text-slate-500">
            {t('alreadyHaveAccount')}{' '}
            <Link to="/login" className="text-teal-600 font-bold hover:underline">
              {t('signIn')}
            </Link>
          </p>
          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1 mt-3">
            <ShieldCheck size={12} className="text-teal-600" />
            {t('encryptedPlatform')}
          </p>
        </div>

      </div>
    </div>
  );
}
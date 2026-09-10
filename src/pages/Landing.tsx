import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HeartPulse, Menu, X, Bot, UserSearch, ShieldCheck, PhoneCall, Star, Users, ArrowRight, Activity, CalendarCheck, PlusCircle } from 'lucide-react';

export default function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Auto-redirect if already logged in via localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('cura_user');
    if (savedUser) {
      navigate('/patient-dashboard', { replace: true });
    }
  }, [navigate]);

  // Helper function to check auth or force registration prompt
  const handleProtectedNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault();
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; 
    if (!isLoggedIn) {
      navigate('/register');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between selection:bg-teal-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-500/20 relative overflow-hidden">
            <HeartPulse size={24} className="absolute" />
            <div className="absolute inset-0 bg-teal-600/10 flex items-center justify-center">
              <PlusCircle size={16} className="text-white/90 stroke-[3]" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-900 block leading-none">CURA</span>
            <span className="text-[9px] font-bold text-teal-600 tracking-widest uppercase">Healthcare AI</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <Link to="/" className="text-teal-600 hover:text-teal-700 transition-colors">Home</Link>
          <a href="/doctors" onClick={(e) => handleProtectedNav(e, '/doctors')} className="hover:text-teal-600 transition-colors cursor-pointer">Find Doctors</a>
          <a href="/patient-dashboard" onClick={(e) => handleProtectedNav(e, '/patient-dashboard')} className="hover:text-teal-600 transition-colors cursor-pointer">Patient Portal</a>
          <a href="/doctor-dashboard" onClick={(e) => handleProtectedNav(e, '/doctor-dashboard')} className="hover:text-teal-600 transition-colors cursor-pointer">Doctor Portal</a>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-teal-600 transition-colors">
            Login
          </Link>
          <Link to="/register" className="px-4 py-2 text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md shadow-teal-600/20 transition-all">
            Get Started
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 px-6 py-4 flex flex-col gap-3 shadow-lg">
          <Link to="/login" className="py-2 text-slate-600 font-medium hover:text-teal-600 text-sm">Login</Link>
          <Link to="/register" className="py-2 text-slate-600 font-medium hover:text-teal-600 text-sm">Register</Link>
          <a href="/doctors" onClick={(e) => handleProtectedNav(e, '/doctors')} className="py-2 text-slate-600 font-medium hover:text-teal-600 text-sm cursor-pointer">Find Doctors</a>
          <a href="/patient-dashboard" onClick={(e) => handleProtectedNav(e, '/patient-dashboard')} className="py-2 text-slate-600 font-medium hover:text-teal-600 text-sm cursor-pointer">Patient Portal</a>
          <a href="/doctor-dashboard" onClick={(e) => handleProtectedNav(e, '/doctor-dashboard')} className="py-2 text-slate-600 font-medium hover:text-teal-600 text-sm cursor-pointer">Doctor Portal</a>
        </div>
      )}

      {/* Main Responsive Grid Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-16 flex-1 flex flex-col justify-center space-y-12 sm:space-y-16">
        
        {/* Responsive Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center sm:text-left">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              AI-Powered Healthcare Platform
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Your Health, Intelligently <br />
              <span className="text-teal-600">Looked After.</span>
            </h1>

            <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto sm:mx-0 leading-relaxed">
              Experience the future of healthcare with instant AI triage, secure encrypted health records, and top specialist doctors right at your fingertips.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3.5 pt-2 justify-center sm:justify-start">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3.5 px-7 rounded-2xl shadow-lg shadow-teal-600/25 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 text-sm"
              >
                <span>Get Started</span>
                <ArrowRight size={18} />
              </Link>
              <a
                href="/patient-dashboard"
                onClick={(e) => handleProtectedNav(e, '/patient-dashboard')}
                className="w-full sm:w-auto bg-white hover:bg-slate-100 text-slate-700 font-semibold py-3.5 px-7 rounded-2xl border border-slate-200 flex items-center justify-center gap-2 transition-all text-sm shadow-sm cursor-pointer"
              >
                <span>Explore Cura AI</span>
              </a>
            </div>

            {/* Stats Badge */}
            <div className="grid grid-cols-2 max-w-md mx-auto sm:mx-0 gap-4 p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm mt-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <Users size={20} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-medium">Trusted By</p>
                  <p className="text-sm font-bold text-slate-900">50K+ Users</p>
                </div>
              </div>
              <div className="flex items-center gap-3 border-l border-slate-100 pl-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center font-bold">
                  <Star size={20} className="fill-amber-400" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-500 font-medium">Rating</p>
                  <p className="text-sm font-bold text-slate-900">4.8 / 5.0</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Desktop Interactive Card */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -top-6 -left-6 w-72 h-72 bg-teal-300/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-6 -right-6 w-72 h-72 bg-amber-200/40 rounded-full blur-3xl pointer-events-none" />
              
              <div className="relative bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                      <Bot size={22} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Cura Assistant</h4>
                      <p className="text-[11px] text-teal-600 font-medium">Online • Active Triage</p>
                    </div>
                  </div>
                  <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-full text-slate-600 font-medium">Live</span>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs text-slate-700 space-y-1">
                  <p className="font-semibold text-slate-900">AI Triage Summary: Mild headache & fatigue detected.</p>
                  <p className="text-slate-600">Recommended: Hydration & virtual consultation with a General Physician.</p>
                </div>

                <div className="space-y-2">
                  <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <CalendarCheck size={18} className="text-teal-600" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Dr. Rahul Sharma</p>
                        <p className="text-[10px] text-slate-500">Cardiologist • Today, 10:30 AM</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-teal-600 bg-white px-2.5 py-1 rounded-lg border border-teal-200">Confirmed</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Activity size={18} className="text-slate-500" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">Vitals Monitor</p>
                        <p className="text-[10px] text-slate-500">Heart Rate: 72 BPM (Normal)</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Features Responsive Grid */}
        <div className="space-y-6">
          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Platform Features</h2>
            <p className="text-sm text-slate-500">Comprehensive tools designed for your wellness journey.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <a href="/patient-dashboard" onClick={(e) => handleProtectedNav(e, '/patient-dashboard')} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <Bot size={24} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Cura AI Assistant</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Real-time intelligent symptom analysis and medical triage assistance.</p>
            </a>

            <a href="/doctors" onClick={(e) => handleProtectedNav(e, '/doctors')} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <UserSearch size={24} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Find Specialist Doctors</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Browse top-rated physicians, cardiologists, and pediatricians near you.</p>
            </a>

            <div onClick={(e) => handleProtectedNav(e, '/health-vault')} className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md hover:border-teal-300 transition-all group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">Encrypted Health Vault</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">Store your medical prescriptions and lab reports securely with AES-256 encryption.</p>
            </div>

            <div className="p-5 bg-rose-50/80 border border-rose-100 rounded-2xl shadow-sm hover:shadow-md hover:border-rose-300 transition-all group cursor-pointer">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                <PhoneCall size={24} />
              </div>
              <h3 className="font-bold text-sm text-rose-950">SOS Emergency</h3>
              <p className="text-xs text-rose-600 font-medium mt-1 leading-relaxed">Instant ambulance dispatch and emergency helpline integration.</p>
            </div>

          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs text-slate-500">
        <p>© 2026 CURA Healthcare AI. All rights reserved.</p>
      </footer>
    </div>
  );
}
import { useState } from 'react';
import { Search, Sparkles, Upload, AlertTriangle, Heart, Activity, ChevronRight, Check, PlusCircle, HeartPulse, Watch } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import { useApp } from '../context/AppContext';
import { useHardware } from '../context/HardwareContext';

export default function PatientDashboard() {
  const [medicineTaken, setMedicineTaken] = useState(false);
  const { currentUser, getInitials } = useApp();
  const { isConnected, isConnecting, vitals, connectToBand, disconnect } = useHardware();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-gray-50 min-h-screen sm:min-h-[844px] sm:rounded-[36px] shadow-2xl relative overflow-hidden pb-24">
        
        {/* Cura Brand Header Bar */}
        <div className="bg-white px-5 py-3 border-b border-gray-100 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-sm shadow-teal-500/30 relative">
              <HeartPulse size={18} className="absolute" />
              <div className="absolute inset-0 bg-teal-600/10 flex items-center justify-center">
                <PlusCircle size={12} className="text-white stroke-[3]" />
              </div>
            </div>
            <div>
              <span className="text-sm font-black tracking-tight text-slate-900 block leading-none">CURA</span>
              <span className="text-[8px] font-bold text-teal-600 tracking-widest uppercase">Made for safety</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={isConnected ? disconnect : connectToBand}
              disabled={isConnecting}
              className={`p-1.5 rounded-full border shadow-sm transition-all ${
                isConnected 
                  ? 'bg-teal-50 border-teal-200 text-teal-600' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Watch size={16} className={isConnecting ? 'animate-pulse' : ''} />
            </button>
            <span className="text-[10px] font-semibold bg-teal-50 text-teal-700 px-2.5 py-1 rounded-full border border-teal-100">
              Secure Portal
            </span>
          </div>
        </div>

        {/* User Greeting Header Section */}
        <div className="bg-white p-5 pt-4 pb-4 rounded-b-3xl shadow-sm flex justify-between items-center">
          <div>
            <p className="text-gray-400 text-xs font-medium">Welcome Back 👋</p>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-1 truncate max-w-[200px]">
              {currentUser.name} <span className="text-base">👋</span>
            </h1>
          </div>
          <Link to="/profile" className="w-10 h-10 rounded-full bg-teal-600 border-2 border-teal-500 overflow-hidden flex items-center justify-center text-white font-bold text-xs shadow-sm hover:opacity-95 transition-opacity">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              getInitials(currentUser.name)
            )}
          </Link>
        </div>

        <div className="p-5 space-y-5">
          {/* Upcoming Appointment Card */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold text-gray-800">Upcoming Appointment</h2>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80"
                  alt="Doctor"
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-xs font-bold text-gray-900">Dr. Rahul Sharma</h3>
                  <p className="text-[11px] text-gray-400">Cardiologist</p>
                  <p className="text-[10px] text-teal-600 font-medium mt-1">🗓️ Tomorrow, 10:30 AM</p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/consultation')}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-medium px-4 py-2 rounded-full shadow-sm transition-all active:scale-95"
              >
                Join
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h2 className="text-sm font-semibold text-gray-800 mb-2">Quick Actions</h2>
            <div className="grid grid-cols-4 gap-3">
              <Link to="/doctors" className="bg-white p-3 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-1.5 shadow-sm hover:shadow transition-shadow">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                  <Search size={18} />
                </div>
                <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">Find Doctors</span>
              </Link>
              <Link to="/cura-ai" className="bg-white p-3 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-1.5 shadow-sm hover:shadow transition-shadow">
                <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">Cura AI</span>
              </Link>
              <Link to="/upload-report" className="bg-white p-3 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-1.5 shadow-sm hover:shadow transition-shadow">
                <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <Upload size={18} />
                </div>
                <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">Upload Report</span>
              </Link>
              <Link to="/sos" className="bg-white p-3 rounded-2xl border border-gray-100 flex flex-col items-center justify-center gap-1.5 shadow-sm hover:shadow transition-shadow">
                <div className="w-10 h-10 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                  <AlertTriangle size={18} />
                </div>
                <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">SOS</span>
              </Link>
            </div>
          </div>

          {/* Today's Medicines */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold text-gray-800">Today's Medicines</h2>
            </div>
            <div className="space-y-2">
              <div className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-xs">
                    💊
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-800">Vitamin D</h3>
                    <p className="text-[10px] text-gray-400">08:00 AM</p>
                  </div>
                </div>
                <span className="bg-teal-50 text-teal-600 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-teal-100">
                  <Check size={12} /> Taken
                </span>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center font-bold text-xs">
                    💊
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-gray-800">Medicine X</h3>
                    <p className="text-[10px] text-gray-400">01:00 PM</p>
                  </div>
                </div>
                {medicineTaken ? (
                  <span className="bg-teal-50 text-teal-600 text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 border border-teal-100">
                    <Check size={12} /> Taken
                  </span>
                ) : (
                  <button 
                    onClick={() => setMedicineTaken(true)}
                    className="bg-rose-50 text-rose-600 hover:bg-rose-100 text-[10px] font-semibold px-3 py-1.5 rounded-full flex items-center gap-1 border border-rose-100 transition-all active:scale-95"
                  >
                    Take <ChevronRight size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Health Overview */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-sm font-semibold text-gray-800">Health Overview</h2>
              {isConnected && (
                <span className="text-[9px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span> Live Sync
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Heart Rate</p>
                  <p className="text-base font-bold text-gray-900 mt-0.5">
                    {vitals.heartRate ?? 72} <span className="text-[10px] font-normal text-gray-400">bpm</span>
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
                  <Heart size={16} className={`fill-red-500 ${isConnected && vitals.heartRate ? 'animate-pulse' : ''}`} />
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">Steps</p>
                  <p className="text-base font-bold text-gray-900 mt-0.5">4,350 <span className="text-[10px] font-normal text-gray-400">steps</span></p>
                </div>
                <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Activity size={16} />
                </div>
              </div>
            </div>
          </div>

        </div>

        <BottomNav />
      </div>
    </div>
  );
}
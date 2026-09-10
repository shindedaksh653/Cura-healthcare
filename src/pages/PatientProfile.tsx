import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Activity, Thermometer, Droplet, ShieldAlert, Edit2, Save, Check, LogOut, Mail, ShieldCheck, Calculator, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Vitals {
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  bloodSugar: number;
}

export default function PatientProfile() {
  const navigate = useNavigate();
  const { currentUser, getInitials, logout, language, setLanguage } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [profile, setProfile] = useState({
    age: 28,
    gender: 'Male',
    bloodGroup: 'O+',
    height: '178 cm',
    weight: '72 kg',
    allergies: 'Penicillin, Peanuts',
    emergencyContact: '+91 98765 43210 (Sister)',
  });

  const [vitals] = useState<Vitals>({
    bloodPressure: '120/80',
    heartRate: 72,
    temperature: 98.6,
    bloodSugar: 95,
  });

  const handleSave = () => {
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };

  // --- New Added Feature Helper: Calculate BMI dynamically from height and weight ---
  const calculateBMI = () => {
    const hMeters = parseFloat(profile.height) / 100;
    const wKg = parseFloat(profile.weight);
    if (!hMeters || !wKg || hMeters === 0) return { value: 'N/A', status: 'Unknown', color: 'text-slate-500 bg-slate-50' };
    const bmi = wKg / (hMeters * hMeters);
    let status = 'Normal';
    let color = 'text-emerald-700 bg-emerald-50 border-emerald-100';
    if (bmi < 18.5) {
      status = 'Underweight';
      color = 'text-amber-700 bg-amber-50 border-amber-100';
    } else if (bmi >= 25 && bmi < 30) {
      status = 'Overweight';
      color = 'text-orange-700 bg-orange-50 border-orange-100';
    } else if (bmi >= 30) {
      status = 'Obese';
      color = 'text-rose-700 bg-rose-50 border-rose-100';
    }
    return { value: bmi.toFixed(1), status, color };
  };

  const bmiData = calculateBMI();

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[844px] sm:rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Header */}
        <div>
          <div className="p-5 pt-7 pb-4 flex justify-between items-center border-b border-slate-100">
            <Link to="/patient-dashboard" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-sm font-bold text-slate-900">Health Profile & Vitals</h1>
            <button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-100"
            >
              {isEditing ? <Save size={16} /> : <Edit2 size={16} />}
            </button>
          </div>

          <div className="p-5 space-y-5">
            {savedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <Check size={16} className="text-emerald-600" />
                <span>Profile updated successfully!</span>
              </div>
            )}

            {/* Dynamic Account Card (Supports PFP or Dynamic Initials + Logged-in Email) */}
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 relative">
              <div className="relative shrink-0">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-teal-500 shadow-md" />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center border-2 border-teal-500 shadow-md">
                    {getInitials(currentUser.name)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-teal-600 text-white p-0.5 rounded-full text-[10px]" title="Verified Profile">
                  <ShieldCheck size={12} />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</h2>
                <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5 truncate">
                  <Mail size={11} className="text-teal-600 shrink-0" /> {currentUser.email}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-0.5 bg-rose-50 border border-rose-100 text-rose-600 font-extrabold text-[9px] rounded-md">
                    Blood: {profile.bloodGroup}
                  </span>
                  <span className="px-2 py-0.5 bg-teal-50 border border-teal-100 text-teal-700 font-bold text-[9px] rounded-md">
                    {profile.age} yrs • {profile.gender}
                  </span>
                </div>
              </div>
            </div>

            {/* Daily Vitals Grid */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-900">Live Health Vitals</h3>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-rose-600">
                    <Heart size={16} />
                    <span className="text-[9px] font-extrabold bg-rose-100 px-1.5 py-0.5 rounded">BPM</span>
                  </div>
                  <p className="text-base font-black text-slate-900">{vitals.heartRate} <span className="text-[10px] font-normal text-slate-500">bpm</span></p>
                  <p className="text-[9px] text-slate-500">Heart Rate</p>
                </div>

                <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-blue-600">
                    <Activity size={16} />
                    <span className="text-[9px] font-extrabold bg-blue-100 px-1.5 py-0.5 rounded">mmHg</span>
                  </div>
                  <p className="text-base font-black text-slate-900">{vitals.bloodPressure}</p>
                  <p className="text-[9px] text-slate-500">Blood Pressure</p>
                </div>

                <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-amber-600">
                    <Thermometer size={16} />
                    <span className="text-[9px] font-extrabold bg-amber-100 px-1.5 py-0.5 rounded">°F</span>
                  </div>
                  <p className="text-base font-black text-slate-900">{vitals.temperature}°</p>
                  <p className="text-[9px] text-slate-500">Body Temp</p>
                </div>

                <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl space-y-1">
                  <div className="flex items-center justify-between text-emerald-600">
                    <Droplet size={16} />
                    <span className="text-[9px] font-extrabold bg-emerald-100 px-1.5 py-0.5 rounded">mg/dL</span>
                  </div>
                  <p className="text-base font-black text-slate-900">{vitals.bloodSugar}</p>
                  <p className="text-[9px] text-slate-500">Blood Glucose</p>
                </div>
              </div>
            </div>

            {/* --- NEW ADDED FEATURE: Interactive BMI Summary Card --- */}
            <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                  <Calculator size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Body Mass Index (BMI)</h4>
                  <p className="text-[10px] text-slate-500">Calculated from height & weight</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${bmiData.color}`}>
                  {bmiData.value} ({bmiData.status})
                </span>
              </div>
            </div>

            {/* Editable Information Fields */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900">Personal Details</h3>

              <div className="space-y-2 text-xs">
                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Known Allergies</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.allergies}
                      onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-teal-500"
                    />
                  ) : (
                    <p className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 font-semibold text-slate-800 flex items-center gap-1.5">
                      <ShieldAlert size={14} className="text-amber-500 shrink-0" />
                      <span>{profile.allergies}</span>
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Height</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.height}
                        onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-teal-500"
                      />
                    ) : (
                      <p className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 font-semibold text-slate-800">{profile.height}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Weight</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={profile.weight}
                        onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                        className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-teal-500"
                      />
                    ) : (
                      <p className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 font-semibold text-slate-800">{profile.weight}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 font-semibold block mb-0.5">Emergency Contact</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.emergencyContact}
                      onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-teal-500"
                    />
                  ) : (
                    <p className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 font-semibold text-slate-800">{profile.emergencyContact}</p>
                  )}
                </div>
              </div>
            </div>

          </div>
          {/* Settings Section (Language) */}
          <div className="space-y-3 mt-4">
            <h3 className="text-xs font-bold text-slate-900">App Settings</h3>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Globe size={16} />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Language</p>
                  <p className="text-[10px] text-slate-500">Choose your preferred language</p>
                </div>
              </div>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="bg-white border border-slate-200 text-xs font-bold rounded-xl px-2 py-1 outline-none text-slate-700"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-2">
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
          >
            {isEditing ? 'Save Health Profile' : 'Edit Profile Information'}
          </button>
          
          <button
            onClick={handleLogoutClick}
            className="w-full py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs border border-rose-100 flex items-center justify-center gap-1.5 transition-colors"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>

      </div>
    </div>
  );
}
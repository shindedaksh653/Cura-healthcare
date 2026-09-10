import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Video, MapPin, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface Appointment {
  id: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: 'Online Video' | 'In-Clinic';
  status: 'Upcoming' | 'Completed' | 'Cancelled';
  image: string;
}

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 1,
    doctorName: 'Dr. Rahul Sharma',
    specialty: 'Cardiologist',
    date: 'Today, 28 Aug 2026',
    time: '10:30 AM',
    type: 'Online Video',
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 2,
    doctorName: 'Dr. Priya Nair',
    specialty: 'Dermatologist',
    date: '30 Aug 2026',
    time: '03:00 PM',
    type: 'In-Clinic',
    status: 'Upcoming',
    image: 'https://images.unsplash.com/photo-1594824813589-623e1b73815e?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 3,
    doctorName: 'Dr. Amit Patel',
    specialty: 'General Physician',
    date: '15 Aug 2026',
    time: '11:00 AM',
    type: 'Online Video',
    status: 'Completed',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
  },
];

export default function Appointments() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const [showBookModal, setShowBookModal] = useState(false);

  // New appointment form state
  const [newApp, setNewApp] = useState({
    doctorName: 'Dr. Neha Gupta',
    specialty: 'Pediatrician',
    date: 'Tomorrow',
    time: '04:00 PM',
    type: 'Online Video' as 'Online Video' | 'In-Clinic',
  });

  const handleBookNew = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Appointment = {
      id: Date.now(),
      doctorName: newApp.doctorName,
      specialty: newApp.specialty,
      date: newApp.date,
      time: newApp.time,
      type: newApp.type,
      status: 'Upcoming',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    };
    setAppointments([created, ...appointments]);
    setShowBookModal(false);
  };

  const filtered = appointments.filter(a => 
    tab === 'upcoming' ? a.status === 'Upcoming' : a.status !== 'Upcoming'
  );

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[844px] sm:rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Header */}
        <div>
          <div className="p-5 pt-7 pb-4 flex justify-between items-center border-b border-slate-100">
            <Link to="/patient-dashboard" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-sm font-bold text-slate-900">{t('appointments')}</h1>
            <button
              onClick={() => setShowBookModal(true)}
              className="w-9 h-9 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-100"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="p-4 pb-0">
            <div className="grid grid-cols-2 bg-slate-100 p-1 rounded-2xl">
              <button
                onClick={() => setTab('upcoming')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${tab === 'upcoming' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                Upcoming
              </button>
              <button
                onClick={() => setTab('past')}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${tab === 'past' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}
              >
                Past & History
              </button>
            </div>
          </div>

          {/* Appointments List */}
          <div className="p-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-20 space-y-2">
                <Calendar size={32} className="text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No {tab} appointments found</p>
              </div>
            ) : (
              filtered.map((item) => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.doctorName} className="w-12 h-12 rounded-2xl object-cover border border-slate-200" />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{item.doctorName}</p>
                        <p className="text-[10px] text-teal-600 font-semibold">{item.specialty}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      item.type === 'Online Video' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {item.type}
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded-xl border border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-slate-400" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-900">
                      <Clock size={13} className="text-teal-600" />
                      {item.time}
                    </span>
                  </div>

                  {item.status === 'Upcoming' && item.type === 'Online Video' && (
                    <button
                      onClick={() => navigate('/consultation', {
                        state: {
                          doctorName: item.doctorName,
                          specialty: item.specialty,
                          image: item.image
                        }
                      })}
                      className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-teal-600/20 transition-all active:scale-95"
                    >
                      <Video size={14} />
                      <span>Join Video Consultation Room</span>
                    </button>
                  )}

                  {item.status === 'Upcoming' && item.type === 'In-Clinic' && (
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 bg-amber-50/50 p-2 rounded-xl border border-amber-100">
                      <MapPin size={12} className="text-amber-600 shrink-0" />
                      <span>Please arrive 15 mins prior at Cura Clinic Branch, Nagpur.</span>
                    </div>
                  )}

                  {item.status === 'Completed' && (
                    <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle size={12} />
                      <span>Consultation successfully completed</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Modal for Booking New Appointment */}
        {showBookModal && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-30 flex flex-col justify-end">
            <form onSubmit={handleBookNew} className="bg-white rounded-t-[32px] p-5 space-y-4 animate-slide-up">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold text-slate-900">Book New Appointment</h3>
                <button type="button" onClick={() => setShowBookModal(false)} className="text-xs text-slate-400 font-bold">Cancel</button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Consultation Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setNewApp({ ...newApp, type: 'Online Video' })}
                      className={`py-2.5 rounded-xl font-bold border transition-all ${newApp.type === 'Online Video' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                    >
                      Online Video
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewApp({ ...newApp, type: 'In-Clinic' })}
                      className={`py-2.5 rounded-xl font-bold border transition-all ${newApp.type === 'In-Clinic' ? 'bg-teal-600 text-white border-teal-600' : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                    >
                      In-Clinic Visit
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-500 block mb-1">Select Doctor / Specialty</label>
                  <select
                    value={newApp.doctorName}
                    onChange={(e) => {
                      const selectedName = e.target.value;
                      let specialty = 'General Physician';
                      if (selectedName.includes('Rahul')) specialty = 'Cardiologist';
                      else if (selectedName.includes('Priya')) specialty = 'Dermatologist';
                      else if (selectedName.includes('Neha')) specialty = 'Pediatrician';
                      setNewApp({ ...newApp, doctorName: selectedName, specialty });
                    }}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none font-semibold text-slate-800"
                  >
                    <option value="Dr. Rahul Sharma">Dr. Rahul Sharma (Cardiologist)</option>
                    <option value="Dr. Priya Nair">Dr. Priya Nair (Dermatologist)</option>
                    <option value="Dr. Amit Patel">Dr. Amit Patel (General Physician)</option>
                    <option value="Dr. Neha Gupta">Dr. Neha Gupta (Pediatrician)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Date</label>
                    <input
                      type="text"
                      value={newApp.date}
                      onChange={(e) => setNewApp({ ...newApp, date: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 block mb-1">Time Slot</label>
                    <input
                      type="text"
                      value={newApp.time}
                      onChange={(e) => setNewApp({ ...newApp, time: e.target.value })}
                      className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 outline-none"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-2xl shadow-lg shadow-teal-600/20"
              >
                Confirm Appointment
              </button>
            </form>
          </div>
        )}

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 bg-white text-center">
          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <AlertCircle size={12} className="text-teal-600" />
            Free cancellation up to 2 hours before slot
          </p>
        </div>

      </div>
    </div>
  );
}
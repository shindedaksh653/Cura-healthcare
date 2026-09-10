import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Video, UserCheck, CheckCircle2 } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';

export default function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState('2026-08-28');
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [consultType, setConsultType] = useState<'video' | 'in-person'>('video');
  const [isBooked, setIsBooked] = useState(false);

  const DATES = [
    { day: 'Fri', date: '28', full: '2026-08-28' },
    { day: 'Sat', date: '29', full: '2026-08-29' },
    { day: 'Sun', date: '30', full: '2026-08-30' },
    { day: 'Mon', date: '31', full: '2026-08-31' },
  ];

  const TIME_SLOTS = ['09:00 AM', '10:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'];

  if (isBooked) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 rounded-3xl border border-slate-100 shadow-xl text-center space-y-5">
          <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Appointment Confirmed!</h2>
            <p className="text-xs text-slate-500 mt-1">Your appointment with Dr. Rahul Sharma has been scheduled.</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Type:</span>
              <span className="font-semibold text-slate-800 capitalize">{consultType} Consultation</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Date & Time:</span>
              <span className="font-semibold text-slate-800">{selectedDate} at {selectedTime}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Fee:</span>
              <span className="font-bold text-teal-600">₹500</span>
            </div>
          </div>
          <button
            onClick={() => navigate('/patient-dashboard')}
            className="w-full bg-teal-600 text-white font-semibold py-3.5 rounded-full hover:bg-teal-700 transition-all text-xs"
          >
            Go to Patient Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[844px] sm:rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Top Bar */}
        <div>
          <div className="p-5 pt-7 pb-4 flex justify-between items-center border-b border-slate-100">
            <Link to={`/doctor/${id || 1}`} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-sm font-bold text-slate-900">Book Appointment</h1>
            <div className="w-9" />
          </div>

          <div className="p-5 space-y-6">
            {/* Consultation Type Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900">Select Consultation Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setConsultType('video')}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                    consultType === 'video'
                      ? 'border-teal-600 bg-teal-50/60 text-teal-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <Video size={18} className={consultType === 'video' ? 'text-teal-600' : 'text-slate-400'} />
                  <div className="text-left">
                    <p className="text-xs font-bold">Video Call</p>
                    <p className="text-[10px] text-slate-500">Online Triage</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setConsultType('in-person')}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
                    consultType === 'in-person'
                      ? 'border-teal-600 bg-teal-50/60 text-teal-700'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <UserCheck size={18} className={consultType === 'in-person' ? 'text-teal-600' : 'text-slate-400'} />
                  <div className="text-left">
                    <p className="text-xs font-bold">In-Person</p>
                    <p className="text-[10px] text-slate-500">Clinic Visit</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Date Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar size={14} className="text-teal-600" />
                <span>Select Date</span>
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DATES.map((item) => (
                  <button
                    key={item.full}
                    onClick={() => setSelectedDate(item.full)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      selectedDate === item.full
                        ? 'bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-600/20'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    <p className="text-[10px] uppercase font-medium">{item.day}</p>
                    <p className="text-base font-bold">{item.date}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Clock size={14} className="text-teal-600" />
                <span>Available Time Slots</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TIME_SLOTS.map((time) => (
                  <button
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all ${
                      selectedTime === time
                        ? 'bg-teal-50 border-teal-600 text-teal-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Payment Footer */}
        <div className="p-5 border-t border-slate-100 bg-white space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500">Total Consultation Fee</span>
            <span className="text-base font-bold text-slate-900">₹500</span>
          </div>
          <button
            onClick={() => setIsBooked(true)}
            className="w-full bg-teal-600 text-white font-semibold py-3.5 rounded-full hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 text-xs"
          >
            Confirm & Pay ₹500
          </button>
        </div>

      </div>
    </div>
  );
}
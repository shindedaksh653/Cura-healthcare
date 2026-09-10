import { ArrowLeft, Star, Award, Calendar, Clock, MoreVertical } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

export default function DoctorProfile() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-gray-50 min-h-screen sm:min-h-[844px] sm:rounded-[36px] shadow-2xl relative overflow-hidden pb-20">
        
        {/* Header */}
        <div className="bg-white p-5 pt-7 pb-4 flex justify-between items-center border-b border-gray-100">
          <Link to="/doctors" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-sm font-bold text-gray-900">Doctor Profile</h1>
          <button className="text-gray-400 hover:text-gray-600">
            <MoreVertical size={20} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Main Card */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 text-center shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80"
              alt="Doctor"
              className="w-24 h-24 rounded-full object-cover mx-auto mb-3 border-4 border-teal-50"
            />
            <h2 className="text-base font-bold text-gray-900">Dr. Rahul Sharma</h2>
            <p className="text-xs text-gray-400 font-medium">Cardiologist</p>
            
            <div className="flex justify-center items-center gap-4 mt-3 pt-3 border-t border-gray-50 text-xs">
              <div className="flex items-center gap-1">
                <Star size={14} className="text-amber-400 fill-amber-400" />
                <span className="font-bold text-gray-900">4.9</span>
                <span className="text-gray-400 text-[10px]">(256 reviews)</span>
              </div>
              <div className="text-gray-300">|</div>
              <div className="flex items-center gap-1 text-gray-500 font-medium">
                <Award size={14} className="text-teal-600" />
                <span>8+ Years Exp.</span>
              </div>
            </div>
          </div>

          {/* Fee and Next Available */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm text-center">
              <p className="text-base font-bold text-gray-900">₹500</p>
              <p className="text-[10px] text-gray-400 font-medium">Consultation Fee</p>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-gray-100 shadow-sm text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-600 text-xs font-semibold">
                <Clock size={14} />
                <span>Available Today</span>
              </div>
              <p className="text-[10px] text-gray-400 font-medium mt-0.5">Next: 10:30 AM</p>
            </div>
          </div>

          {/* About Section */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-gray-900">About</h3>
            <p className="text-[11px] text-gray-500 leading-relaxed">
              Dr. Rahul Sharma is a renowned Cardiologist with more than 8 years of experience in cardiac care, heart rhythm management, and preventative cardiology.
            </p>
          </div>

          {/* Specialization Tags */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-gray-900">Specialization</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-teal-50 text-teal-600 text-[10px] font-medium px-3 py-1 rounded-full border border-teal-100">Cardiology</span>
              <span className="bg-teal-50 text-teal-600 text-[10px] font-medium px-3 py-1 rounded-full border border-teal-100">Heart Failure</span>
              <span className="bg-teal-50 text-teal-600 text-[10px] font-medium px-3 py-1 rounded-full border border-teal-100">ECG</span>
            </div>
          </div>

          {/* Education */}
          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
            <h3 className="text-xs font-bold text-gray-900">Education</h3>
            <p className="text-[11px] font-semibold text-gray-800">MBBS, MD (Cardiology)</p>
            <p className="text-[10px] text-gray-400">AIIMS, New Delhi</p>
          </div>
        </div>

        {/* Fixed Bottom Booking Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white p-4 border-t border-gray-100">
          <Link to={`/book-appointment/${id || 1}`}>
            <button className="w-full bg-teal-600 text-white font-semibold py-3.5 rounded-full hover:bg-teal-700 transition-all shadow-lg shadow-teal-500/20 text-xs flex items-center justify-center gap-2">
              <Calendar size={16} />
              <span>Book Appointment</span>
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
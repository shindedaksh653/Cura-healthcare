import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Star, MapPin, Clock, Stethoscope, Home, Calendar, Bot, Pill, User } from 'lucide-react';

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviews: number;
  fee: number;
  hospital: string;
  location: string;
  availableToday: boolean;
  image: string;
}

const DOCTORS: Doctor[] = [
  { id: 1, name: 'Dr. Rahul Sharma', specialty: 'Cardiology', experience: 14, rating: 4.9, reviews: 182, fee: 500, hospital: 'Metro Heart Care', location: 'Central Avenue', availableToday: true, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Dr. Priya Patel', specialty: 'Dermatology', experience: 9, rating: 4.8, reviews: 144, fee: 600, hospital: 'Skin & Aesthetics Center', location: 'Civil Lines', availableToday: true, image: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?w=150&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Dr. Ananya Rao', specialty: 'Neurology', experience: 16, rating: 4.9, reviews: 210, fee: 800, hospital: 'Brain & Spine Institute', location: 'Dharampeth', availableToday: false, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Dr. Vikram Malhotra', specialty: 'Pediatrics', experience: 11, rating: 4.7, reviews: 98, fee: 450, hospital: 'Little Angels Hospital', location: 'Ramdaspeth', availableToday: true, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Dr. Sneha Kulkarni', specialty: 'Orthopedics', experience: 12, rating: 4.8, reviews: 115, fee: 550, hospital: 'Joint & Bone Clinic', location: 'Sadar', availableToday: true, image: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?w=150&auto=format&fit=crop&q=80' },
  { id: 6, name: 'Dr. Amitav Ghosh', specialty: 'General Medicine', experience: 15, rating: 4.6, reviews: 160, fee: 400, hospital: 'City Care Hospital', location: 'Manewada', availableToday: true, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80' },
  { id: 7, name: 'Dr. Meera Nambiar', specialty: 'Psychiatry', experience: 10, rating: 4.9, reviews: 88, fee: 700, hospital: 'Mind Well Clinic', location: 'Wardha Road', availableToday: false, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80' },
  { id: 8, name: 'Dr. Rajesh Gupta', specialty: 'Gynecology', experience: 18, rating: 4.8, reviews: 230, fee: 650, hospital: 'Matritva Women Center', location: 'Sitabuldi', availableToday: true, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' },
  { id: 9, name: 'Dr. Kavita Reddy', specialty: 'Dermatology', experience: 7, rating: 4.7, reviews: 75, fee: 500, hospital: 'Glow Derm Clinic', location: 'Pratap Nagar', availableToday: true, image: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?w=150&auto=format&fit=crop&q=80' },
  { id: 10, name: 'Dr. Rohan Mehta', specialty: 'Cardiology', experience: 13, rating: 4.9, reviews: 155, fee: 750, hospital: 'Apex Heart Hospital', location: 'Bajaj Nagar', availableToday: true, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80' },
  { id: 11, name: 'Dr. Sunita Kapoor', specialty: 'Pediatrics', experience: 20, rating: 5.0, reviews: 340, fee: 600, hospital: 'Child Health Foundation', location: 'Dhantoli', availableToday: true, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80' },
  { id: 12, name: 'Dr. Arjun Verma', specialty: 'Orthopedics', experience: 8, rating: 4.6, reviews: 62, fee: 500, hospital: 'Spine & Motion Clinic', location: 'Manewada', availableToday: false, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80' },
  { id: 13, name: 'Dr. Pooja Deshmukh', specialty: 'General Medicine', experience: 6, rating: 4.7, reviews: 50, fee: 350, hospital: 'Sanjeevani Care', location: 'Khamla', availableToday: true, image: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?w=150&auto=format&fit=crop&q=80' },
  { id: 14, name: 'Dr. Siddharth Nair', specialty: 'Neurology', experience: 12, rating: 4.9, reviews: 130, fee: 850, hospital: 'Neuro Care Specialty', location: 'Civil Lines', availableToday: true, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' },
  { id: 15, name: 'Dr. Neha Saxena', specialty: 'Psychiatry', experience: 11, rating: 4.8, reviews: 95, fee: 750, hospital: 'Serene Mind Clinic', location: 'Dharampeth', availableToday: true, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80' },
  { id: 16, name: 'Dr. Suresh Menon', specialty: 'Cardiology', experience: 22, rating: 5.0, reviews: 450, fee: 1000, hospital: 'National Cardiac Institute', location: 'Wardha Road', availableToday: true, image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80' },
  { id: 17, name: 'Dr. Divya Joshi', specialty: 'Gynecology', experience: 10, rating: 4.7, reviews: 92, fee: 550, hospital: 'Bloom Women Health', location: 'Ramdaspeth', availableToday: false, image: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?w=150&auto=format&fit=crop&q=80' },
  { id: 18, name: 'Dr. Farhan Ali', specialty: 'ENT Specialist', experience: 11, rating: 4.8, reviews: 108, fee: 500, hospital: 'Ear Nose Throat Hospital', location: 'Sadar', availableToday: true, image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80' },
  { id: 19, name: 'Dr. Ritu Sharma', specialty: 'Ophthalmology', experience: 13, rating: 4.9, reviews: 140, fee: 600, hospital: 'Vision Care Eye Center', location: 'Dharampeth', availableToday: true, image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80' },
  { id: 20, name: 'Dr. Alok Chatterjee', specialty: 'Gastroenterology', experience: 17, rating: 4.9, reviews: 220, fee: 900, hospital: 'Digestive Health Institute', location: 'Central Avenue', availableToday: true, image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80' },
];

const CATEGORIES = ['All', 'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Orthopedics', 'General Medicine', 'Psychiatry'];

export default function DoctorSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Helper function to remove dots, punctuation, and extra spaces for smart matching
  const clean = (text: string) => text.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ').trim();

  const filteredDoctors = DOCTORS.filter((doc) => {
    const query = clean(searchQuery);
    
    // Check Category Match
    const matchesCategory = selectedCategory === 'All' || clean(doc.specialty) === clean(selectedCategory);

    // If query is empty, match everything in selected category
    if (!query) return matchesCategory;

    // Smart string matching (strips periods like "Dr." -> "dr")
    const docName = clean(doc.name);
    const docSpecialty = clean(doc.specialty);
    const docHospital = clean(doc.hospital);
    const docLocation = clean(doc.location);

    const matchesSearch =
      docName.includes(query) ||
      docSpecialty.includes(query) ||
      docHospital.includes(query) ||
      docLocation.includes(query);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white h-screen sm:h-[844px] sm:rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Top Header & Search Input */}
        <div className="bg-white sticky top-0 z-20 border-b border-slate-100 shadow-sm shrink-0">
          <div className="p-4 pt-6 flex justify-between items-center">
            <Link to="/patient-dashboard" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-base font-bold text-slate-900">Find Doctors</h1>
            <div className="w-9" />
          </div>

          {/* Dynamic Search Field */}
          <div className="px-4 pb-3">
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search doctor name, specialty, or clinic..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none focus:border-teal-500 focus:bg-white transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex gap-2 px-4 pb-3 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[11px] font-semibold transition-all whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-teal-600 text-white shadow-sm shadow-teal-600/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Doctor List Results - Scrollable Area Only */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-slate-50/60 min-h-0">
          <div className="flex justify-between items-center text-xs text-slate-500 px-1">
            <span>Showing {filteredDoctors.length} Doctors</span>
            <span className="font-semibold text-slate-700">{selectedCategory}</span>
          </div>

          {filteredDoctors.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                <Stethoscope size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">No Doctors Found</p>
                <p className="text-[11px] text-slate-500 mt-0.5">Try searching "Priya", "Rahul", or "Cardiology"</p>
              </div>
            </div>
          ) : (
            filteredDoctors.map((doc) => (
              <div key={doc.id} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-3 hover:border-teal-300 transition-all">
                <div className="flex items-start gap-3">
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-14 h-14 rounded-2xl object-cover bg-slate-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-slate-900 truncate">{doc.name}</h3>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full text-amber-700 text-[10px] font-bold shrink-0">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span>{doc.rating}</span>
                      </div>
                    </div>
                    <p className="text-[11px] font-semibold text-teal-600 mt-0.5">{doc.specialty} • {doc.experience} yrs exp</p>
                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 truncate">
                      <MapPin size={11} className="shrink-0 text-slate-400" />
                      <span>{doc.hospital}, {doc.location}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Consultation Fee</span>
                    <span className="text-xs font-bold text-slate-900">₹{doc.fee}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {doc.availableToday && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                        <Clock size={10} />
                        Today
                      </span>
                    )}
                    <Link
                      to={`/book-appointment/${doc.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold transition-colors shadow-sm shadow-teal-600/20"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="bg-white border-t border-slate-100 py-2.5 px-6 flex justify-between items-center z-10 shrink-0">
          <Link to="/patient-dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-teal-600">
            <Home size={18} />
            <span className="text-[9px] font-medium">Home</span>
          </Link>
          <Link to="/patient-dashboard" className="flex flex-col items-center gap-1 text-slate-400 hover:text-teal-600">
            <Calendar size={18} />
            <span className="text-[9px] font-medium">Appointments</span>
          </Link>
          <Link to="/cura-ai" className="flex flex-col items-center gap-1 text-teal-600 font-bold -mt-4">
            <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/30">
              <Bot size={20} />
            </div>
            <span className="text-[9px]">Cura AI</span>
          </Link>
          <Link to="/health-vault" className="flex flex-col items-center gap-1 text-slate-400 hover:text-teal-600">
            <Pill size={18} />
            <span className="text-[9px] font-medium">Vault</span>
          </Link>
          <Link to="/doctors" className="flex flex-col items-center gap-1 text-teal-600 font-bold">
            <User size={18} />
            <span className="text-[9px]">Doctors</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
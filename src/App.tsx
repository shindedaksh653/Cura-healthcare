import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from './firebase';
import { AppProvider } from './context/AppContext';
import { LanguageProvider } from './context/LanguageContext';
import { HardwareProvider } from './context/HardwareContext'; // Added Hardware Provider
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import DoctorSearch from './pages/DoctorSearch';
import DoctorProfile from './pages/DoctorProfile';
import BookAppointment from './pages/BookAppointment';
import CuraAI from './pages/CuraAI';
import HealthVault from './pages/HealthVault';
import SOS from './pages/SOS';
import Medicines from './pages/Medicines';
import PatientProfile from './pages/PatientProfile';
import ConsultationRoom from './pages/ConsultationRoom';
import Notifications from './pages/Notifications';
import UploadReport from './pages/UploadReport';
import Appointments from './pages/Appointments';
import KioskDashboard from './pages/KioskDashboard';

function AuthWatcher() {

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.emailVerified) {
        const savedUser = localStorage.getItem('cura_user');
        if (!savedUser) {
          const displayName = user.displayName || user.email?.split('@')[0].replace('.', ' ') || 'User';
          const capitalizedName = displayName.replace(/\b\w/g, (l) => l.toUpperCase());
          const userProfile = {
            name: capitalizedName,
            email: user.email,
            phone: user.phoneNumber || '+91 98765 43210',
            location: 'Nagpur, India',
          };
          localStorage.setItem('cura_user', JSON.stringify(userProfile));
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return null;
}

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setInitializing(false);
    });
    return () => unsubscribe();
  }, []);

  if (initializing) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-teal-600 font-bold text-sm">Loading Cura...</div>
      </div>
    );
  }

  return (
    <AppProvider>
      <LanguageProvider>
        <HardwareProvider>
          <Router>
            <AuthWatcher />
            <Routes>
              {/* If a user session is active, landing and login pages redirect straight to dashboard */}
              <Route 
                path="/" 
                element={user ? <Navigate to="/patient-dashboard" replace /> : <Landing />} 
              />
              <Route 
                path="/login" 
                element={user ? <Navigate to="/patient-dashboard" replace /> : <Login />} 
              />
              <Route 
                path="/register" 
                element={user ? <Navigate to="/patient-dashboard" replace /> : <Register />} 
              />
              
              <Route path="/patient-dashboard" element={<PatientDashboard />} />
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route path="/doctors" element={<DoctorSearch />} />
              <Route path="/doctor/:id" element={<DoctorProfile />} />
              <Route path="/book-appointment/:id" element={<BookAppointment />} />
              <Route path="/cura-ai" element={<CuraAI />} />
              <Route path="/health-vault" element={<HealthVault />} />
              <Route path="/sos" element={<SOS />} />
              <Route path="/medicines" element={<Medicines />} />
              <Route path="/profile" element={<PatientProfile />} />
              <Route path="/consultation" element={<ConsultationRoom />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/upload-report" element={<UploadReport />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/records" element={<HealthVault />} />
              <Route path="/kiosk-dashboard" element={<KioskDashboard />} />
            </Routes>
          </Router>
        </HardwareProvider>
      </LanguageProvider>
    </AppProvider>
  );
}
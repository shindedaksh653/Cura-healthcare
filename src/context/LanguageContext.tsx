import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Language = 'en' | 'hi' | 'mr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    welcome: 'Welcome Back 👋',
    login: 'Login',
    register: 'Register',
    getStarted: 'Get Started',
    findDoctors: 'Find Doctors',
    patientPortal: 'Patient Portal',
    doctorPortal: 'Doctor Portal',
    healthVault: 'Health Vault',
    sosEmergency: 'SOS Emergency',
    curaAi: 'Cura AI',
    home: 'Home',
    appointments: 'Appointments',
    medicines: 'Medicines',
    profile: 'Profile',
    language: 'Language',
    upcomingAppointment: 'Upcoming Appointment',
    quickActions: 'Quick Actions',
    uploadReport: 'Upload Report',
    sos: 'SOS',
    todaysMedicines: "Today's Medicines",
    healthOverview: 'Health Overview',
    heartRate: 'Heart Rate',
    steps: 'Steps',
    taken: 'Taken',
    take: 'Take',
    upcoming: 'Upcoming',
    pastHistory: 'Past & History',
    bookNewAppointment: 'Book New Appointment',
    onlineVideo: 'Online Video',
    inClinic: 'In-Clinic',
    confirmAppointment: 'Confirm Appointment',
    cancel: 'Cancel',
    freeCancellation: 'Free cancellation up to 2 hours before slot',
  },
  hi: {
    welcome: 'वापसी पर स्वागत है 👋',
    login: 'लॉग इन करें',
    register: 'पंजीकरण करें',
    getStarted: 'शुरू करें',
    findDoctors: 'डॉक्टर खोजें',
    patientPortal: 'रोगी पोर्टल',
    doctorPortal: 'डॉक्टर पोर्टल',
    healthVault: 'स्वास्थ्य तिजोरी',
    sosEmergency: 'एसओएस आपातकाल',
    curaAi: 'क्यूरा एआई',
    home: 'मुख्यपृष्ठ',
    appointments: 'अपॉइंटमेंट्स',
    medicines: 'औषधोपचार',
    profile: 'प्रोफाइल',
    language: 'भाषा',
    upcomingAppointment: 'आगामी नियुक्ति',
    quickActions: 'त्वरित कार्रवाई',
    uploadReport: 'रिपोर्ट अपलोड करें',
    sos: 'एसओएस',
    todaysMedicines: 'आज की दवाइयां',
    healthOverview: 'स्वास्थ्य विवरण',
    heartRate: 'हार्ट रेट',
    steps: 'कदम',
    taken: 'ली गई',
    take: 'लें',
    upcoming: 'आगामी',
    pastHistory: 'पिछला और इतिहास',
    bookNewAppointment: 'नई अपॉइंटमेंट बुक करें',
    onlineVideo: 'ऑनलाइन वीडियो',
    inClinic: 'क्लिनिक में',
    confirmAppointment: 'अपॉइंटमेंट की पुष्टि करें',
    cancel: 'रद्द करें',
    freeCancellation: 'स्लॉट से 2 घंटे पहले तक निःशुल्क रद्दीकरण',
  },
  mr: {
    welcome: 'परत स्वागत आहे 👋',
    login: 'लॉग इन करा',
    register: 'नोंदणी करा',
    getStarted: 'सुरुवात करा',
    findDoctors: 'डॉक्टर शोधा',
    patientPortal: 'रुग्ण पोर्टल',
    doctorPortal: 'डॉक्टर पोर्टल',
    healthVault: 'आरोग्य तिजोरी',
    sosEmergency: 'आपत्कालीन SOS',
    curaAi: 'क्यूरा एआई',
    home: 'मुख्यपृष्ठ',
    appointments: 'अपॉइंटमेंट्स',
    medicines: 'औषधोपचार',
    profile: 'प्रोफाइल',
    language: 'भाषा',
    upcomingAppointment: 'आगामी भेट',
    quickActions: 'जलद कृती',
    uploadReport: 'अहवाल अपलोड करा',
    sos: 'एसओएस',
    todaysMedicines: 'आजची औषधे',
    healthOverview: 'आरोग्य माहिती',
    heartRate: 'हार्ट रेट',
    steps: 'पावले',
    taken: 'घेतले',
    take: 'घ्या',
    upcoming: 'आगामी',
    pastHistory: 'मागील आणि इतिहास',
    bookNewAppointment: 'नवीन भेट बुक करा',
    onlineVideo: 'ऑनलाइन व्हिडिओ',
    inClinic: 'क्लिनिक भेट',
    confirmAppointment: 'भेटीची पुष्टी करा',
    cancel: 'रद्द करा',
    freeCancellation: 'वेळेच्या २ तास आधीपर्यंत विनामूल्य रद्द करणे',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('cura_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cura_lang', lang);
  };

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Theme = 'light' | 'dark';
type Language = 'en' | 'hi' | 'mr';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
}

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  getInitials: (name: string) => string;
  logout: () => void;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    healthVault: 'Encrypted Health Vault',
    uploadRecord: 'Upload New Medical Record',
    supportsFormat: 'Supports PDF, PNG, JPG up to 15MB',
    searchRecords: 'Search records or doctors...',
    medicines: 'Medicines & Prescriptions',
    settings: 'Settings & Preferences',
    darkMode: 'Dark Mode',
    language: 'Language',
    patientDashboard: 'Patient Dashboard',
    doctorDashboard: 'Doctor Dashboard',
    findDoctors: 'Find Doctors',
    curaAi: 'Cura AI Assistant',
    sosEmergency: 'SOS Emergency',
    appointments: 'Appointments',
    notifications: 'Notifications',
    profile: 'Profile',
    logout: 'Log out',
    welcomeBack: 'Welcome Back',
    bookAppointment: 'Book Appointment',
    consultationRoom: 'Consultation Room',
    home: 'Home',
    patientPortal: 'Patient Portal',
    doctorPortal: 'Doctor Portal',
    login: 'Log in',
    register: 'Register',
    getStarted: 'Get Started',
    exploreCuraAi: 'Explore Cura AI',
    aiHealthcarePlatform: 'AI-Powered Healthcare Platform',
    yourHealthTitle: 'Your health,',
    lookedAfter: 'looked after.',
    heroSubtitle: 'Complete healthcare management for you and your family. Analyze symptoms with Cura AI, book verified specialists, and secure your medical history.',
    trustedBy: 'Trusted by',
    ratingLabel: 'Rating',
    triageSummary: 'Triage Summary',
    triageDesc: 'Based on your input, we suggest booking a consultation with a General Physician today.',
    confirmed: 'Confirmed',
    vitalsMonitor: 'Vitals Monitor',
    platformFeatures: 'Our Platform Features',
    platformFeaturesSub: 'Comprehensive services built for mobile and desktop screens',
    curaAiTitle: 'Cura AI',
    curaAiDesc: 'Instant AI symptom assessment and intelligent triage recommendations.',
    findDoctorsTitle: 'Find Doctors',
    findDoctorsDesc: 'Search top-rated specialists, compare fees, and reserve time slots instantly.',
    healthVaultTitle: 'Health Vault',
    healthVaultDesc: 'Store prescriptions, lab results, and patient history with encrypted security.',
    sosEmergencyTitle: 'SOS Emergency',
    sosEmergencyDesc: 'Immediate contact links to emergency lines and primary contacts.',
    footerRights: '© 2026 CURA Healthcare AI. All rights reserved.',
    loginSubtitle: 'Login to continue to CURA',
    patientRole: 'Patient',
    doctorRole: 'Doctor',
    emailAddress: 'Email Address',
    enterEmailPlaceholder: 'Enter your email',
    passwordLabel: 'Password',
    enterPasswordPlaceholder: 'Enter your password',
    forgotPassword: 'Forgot Password?',
    loggingIn: 'Logging in...',
    orContinueWith: 'or continue with',
    dontHaveAccount: "Don't have an account?",
    createAccountTitle: 'Create Account',
    createAccountSubtitle: 'Sign up to securely manage your health records and appointments',
    continueWithGoogle: 'Continue with Google',
    orWithEmail: 'Or with email',
    fullNameLabel: 'Full Name',
    creatingAccount: 'Creating Account...',
    createAccount: 'Create Account',
    alreadyHaveAccount: 'Already have an account?',
    signIn: 'Sign In',
    encryptedPlatform: 'End-to-end encrypted medical platform',
  },
  hi: {
    healthVault: 'एन्क्रिप्टेड स्वास्थ्य वॉल्ट',
    uploadRecord: 'नया मेडिकल रिकॉर्ड अपलोड करें',
    supportsFormat: 'PDF, PNG, JPG 15MB तक समर्थित',
    searchRecords: 'रिकॉर्ड या डॉक्टर खोजें...',
    medicines: 'दवाइयां और नुस्खे',
    settings: 'सेटिंग्स और प्राथमिकताएं',
    darkMode: 'डार्क मोड',
    language: 'भाषा',
    patientDashboard: 'रोगी डैशबोर्ड',
    doctorDashboard: 'डॉक्टर डैशबोर्ड',
    findDoctors: 'डॉक्टर खोजें',
    curaAi: 'क्यूरा एआई सहायक',
    sosEmergency: 'एसओएस आपातकाल',
    appointments: 'अपॉइंटमेंट्स',
    notifications: 'सूचनाएं',
    profile: 'प्रोफ़ाइल',
    logout: 'लॉग आउट',
    welcomeBack: 'वापसी पर स्वागत है',
    bookAppointment: 'अपॉइंटमेंट बुक करें',
    consultationRoom: 'परामर्श कक्ष',
    home: 'होम',
    patientPortal: 'रोगी पोर्टल',
    doctorPortal: 'डॉक्टर पोर्टल',
    login: 'लॉग इन करें',
    register: 'पंजीकरण करें',
    getStarted: 'शुरू करें',
    exploreCuraAi: 'क्यूरा एआई देखें',
    aiHealthcarePlatform: 'एआई-संचालित स्वास्थ्य सेवा मंच',
    yourHealthTitle: 'आपका स्वास्थ्य,',
    lookedAfter: 'पूरी तरह सुरक्षित।',
    heroSubtitle: 'आपके और आपके परिवार के लिए संपूर्ण स्वास्थ्य प्रबंधन। क्यूरा एआई के साथ लक्षणों का विश्लेषण करें, सत्यापित विशेषज्ञों को बुक करें और अपना चिकित्सा इतिहास सुरक्षित रखें।',
    trustedBy: 'भरोसा करते हैं',
    ratingLabel: 'रेटिंग',
    triageSummary: 'ट्राइएज सारांश',
    triageDesc: 'आपके इनपुट के आधार पर, हम आज एक सामान्य चिकित्सक के साथ परामर्श बुक करने का सुझाव देते हैं।',
    confirmed: 'पुष्टि की गई',
    vitalsMonitor: 'वाइटल्स मॉनिटर',
    platformFeatures: 'हमारे प्लेटफ़ॉर्म की विशेषताएं',
    platformFeaturesSub: 'मोबाइल और डेस्कटॉप स्क्रीन के लिए बनाई गई व्यापक सेवाएं',
    curaAiTitle: 'क्यूरा एआई',
    curaAiDesc: 'तत्काल एआई लक्षण मूल्यांकन और बुद्धिमान ट्राइएज सिफारिशें।',
    findDoctorsTitle: 'डॉक्टर खोजें',
    findDoctorsDesc: 'शीर्ष-रेटेड विशेषज्ञों की खोज करें, फीस की तुलना करें और तुरंत स्लॉट आरक्षित करें।',
    healthVaultTitle: 'हेल्थ वॉल्ट',
    healthVaultDesc: 'एन्क्रिप्टेड सुरक्षा के साथ नुस्खे, लैब परिणाम और रोगी इतिहास संग्रहीत करें।',
    sosEmergencyTitle: 'एसओएस आपातकाल',
    sosEmergencyDesc: 'आपातकालीन लाइनों और प्राथमिक संपर्कों के लिए त्वरित संपर्क लिंक।',
    footerRights: '© 2026 CURA Healthcare AI. सर्वाधिकार सुरक्षित।',
    loginSubtitle: 'क्यूरा जारी रखने के लिए लॉगिन करें',
    patientRole: 'रोगी',
    doctorRole: 'डॉक्टर',
    emailAddress: 'ईमेल पता',
    enterEmailPlaceholder: 'अपना ईमेल दर्ज करें',
    passwordLabel: 'पासवर्ड',
    enterPasswordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    forgotPassword: 'पासवर्ड भूल गए?',
    loggingIn: 'लॉगिन हो रहा है...',
    orContinueWith: 'या इसके साथ जारी रखें',
    dontHaveAccount: 'खाता नहीं है?',
    createAccountTitle: 'खाता बनाएं',
    createAccountSubtitle: 'अपने स्वास्थ्य रिकॉर्ड और नियुक्तियों को सुरक्षित रूप से प्रबंधित करने के लिए साइन अप करें',
    continueWithGoogle: 'गूगल के साथ जारी रखें',
    orWithEmail: 'या ईमेल के साथ',
    fullNameLabel: 'पूरा नाम',
    creatingAccount: 'खाता बनाया जा रहा है...',
    createAccount: 'खाता बनाएं',
    alreadyHaveAccount: 'पहले से ही खाता है?',
    signIn: 'साइन इन करें',
    encryptedPlatform: 'एंड-टू-एंड एन्क्रिप्टेड मेडिकल प्लेटफॉर्म',
  },
  mr: {
    healthVault: 'एनक्रिप्टेड आरोग्य तिजोरी',
    uploadRecord: 'नवीन वैद्यकीय रेकॉर्ड अपलोड करा',
    supportsFormat: 'PDF, PNG, JPG 15MB पर्यंत समर्थित',
    searchRecords: 'रेकॉर्ड किंवा डॉक्टर शोधा...',
    medicines: 'औषधोपचार आणि प्रिस्क्रिप्शन',
    settings: 'सेटिंग्स आणि प्राधान्ये',
    darkMode: 'डार्क मोड',
    language: 'भाषा',
    patientDashboard: 'रुग्ण डॅशबोर्ड',
    doctorDashboard: 'डॉक्टर डॅशबोर्ड',
    findDoctors: 'डॉक्टर शोधा',
    curaAi: 'क्यूरा एआय सहाय्यक',
    sosEmergency: 'आपत्कालीन SOS',
    appointments: 'अपॉइंटमेंट्स',
    notifications: 'सूचना',
    profile: 'प्रोफाइल',
    logout: 'लॉग आउट',
    welcomeBack: 'पुन्हा स्वागत आहे',
    bookAppointment: 'अपॉइंटमेंट बुक करा',
    consultationRoom: 'कन्सल्टेशन रूम',
    home: 'मुख्यपृष्ठ',
    patientPortal: 'रुग्ण पोर्टल',
    doctorPortal: 'डॉक्टर पोर्टल',
    login: 'लॉग इन करा',
    register: 'नोंदणी करा',
    getStarted: 'सुरुवात करा',
    exploreCuraAi: 'क्यूरा एआय तपासा',
    aiHealthcarePlatform: 'एआय-संचालित आरोग्य सेवा प्लॅटफॉर्म',
    yourHealthTitle: 'तुमचे आरोग्य,',
    lookedAfter: 'पूर्ण काळजीसह.',
    heroSubtitle: 'तुमच्या आणि तुमच्या कुटुंबासाठी संपूर्ण आरोग्य व्यवस्थापन. क्यूरा एआय सह लक्षणांचे विश्लेषण करा, तज्ञांची अपॉइंटमेंट बुक करा आणि वैद्यकीय इतिहास सुरक्षित ठेवा.',
    trustedBy: 'विश्वासू',
    ratingLabel: 'रेटिंग',
    triageSummary: 'ट्रायज सारांश',
    triageDesc: 'तुमच्या माहितीनुसार, आजच जनरल फिजिशियनचा सल्ला घेण्याची आम्ही शिफारस करतो.',
    confirmed: 'पुष्टी झाली',
    vitalsMonitor: 'व्हाइटल्स मॉनिटर',
    platformFeatures: 'आमची प्लॅटफॉर्म वैशिष्ट्ये',
    platformFeaturesSub: 'मोबाईल आणि डेस्कटॉप स्क्रीनसाठी तयार केलेल्या सर्वसमावेशक सेवा',
    curaAiTitle: 'क्यूरा एआय',
    curaAiDesc: 'त्वरित एआय लक्षण मूल्यमापन आणि बुद्धिमान ट्रायज शिफारसी.',
    findDoctorsTitle: 'डॉक्टर शोधा',
    findDoctorsDesc: 'सर्वोत्कृष्ट तज्ञांचा शोध घ्या, शुल्कांची तुलना करा आणि स्लॉट आरक्षित करा.',
    healthVaultTitle: 'हेल्थ वॉल्ट',
    healthVaultDesc: 'एनक्रिप्टेड सुरक्षिततेसह प्रिस्क्रिप्शन, लॅब अहवाल आणि वैद्यकीय इतिहास जतन करा.',
    sosEmergencyTitle: 'आपत्कालीन SOS',
    sosEmergencyDesc: 'आपत्कालीन हेल्पलाइन आणि प्राथमिक संपर्कांसाठी त्वरित दुवे.',
    footerRights: '© 2026 CURA Healthcare AI. सर्व हक्क राखीव.',
    loginSubtitle: 'CURA मध्ये सुरू ठेवण्यासाठी लॉग इन करा',
    patientRole: 'रुग्ण',
    doctorRole: 'डॉक्टर',
    emailAddress: 'ईमेल पत्ता',
    enterEmailPlaceholder: 'तुमचा ईमेल टाका',
    passwordLabel: 'पासवर्ड',
    enterPasswordPlaceholder: 'तुमचा पासवर्ड टाका',
    forgotPassword: 'पासवर्ड विसरलात?',
    loggingIn: 'लॉगिन होत आहे...',
    orContinueWith: 'किंवा याने सुरू ठेवा',
    dontHaveAccount: 'खाते नाही का?',
    createAccountTitle: 'खाते तयार करा',
    createAccountSubtitle: 'तुमचे आरोग्य रेकॉर्ड आणि अपॉइंटमेंट्स सुरक्षितपणे व्यवस्थापित करण्यासाठी साइन अप करा',
    continueWithGoogle: 'Google सह सुरू ठेवा',
    orWithEmail: 'किंवा ईमेलसह',
    fullNameLabel: 'पूर्ण नाव',
    creatingAccount: 'खाते तयार करत आहे...',
    createAccount: 'खाते तयार करा',
    alreadyHaveAccount: 'आधीपासून खाते आहे?',
    signIn: 'साइन इन करा',
    encryptedPlatform: 'एंड-टू-एंड एन्क्रिप्टेड वैद्यकीय प्लॅटफॉर्म',
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('app_theme') as Theme) || 'light';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('app_lang') as Language) || 'en';
  });

  // User Profile Session State (Fixes fallback to prevent showing generic 'user@gmail.com')
  const [currentUser, setCurrentUserState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cura_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback if JSON is malformed
      }
    }
    return { name: 'User', email: 'user@gmail.com', avatar: '' };
  });

  const setCurrentUser = (user: UserProfile) => {
    setCurrentUserState(user);
    localStorage.setItem('cura_user', JSON.stringify(user));
  };

  const getInitials = (fullName: string) => {
    if (!fullName || fullName === 'User') return 'U';
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const logout = () => {
    localStorage.removeItem('cura_user');
    localStorage.removeItem('authToken');
    setCurrentUserState({ name: 'User', email: 'user@gmail.com', avatar: '' });
  };

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <AppContext.Provider value={{ 
      theme, 
      toggleTheme, 
      language, 
      setLanguage, 
      t, 
      currentUser, 
      setCurrentUser, 
      getInitials, 
      logout 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
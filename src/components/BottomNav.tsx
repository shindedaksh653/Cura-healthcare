import { Home, Calendar, Bot, Pill, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

export default function BottomNav() {
  const location = useLocation();
  const { t } = useLanguage();

  const navItems = [
    { label: t('home'), icon: Home, path: '/patient-dashboard' },
    { label: t('appointments'), icon: Calendar, path: '/appointments' },
    { label: t('curaAi'), icon: Bot, path: '/cura-ai', isAi: true },
    { label: t('medicines'), icon: Pill, path: '/medicines' },
    { label: t('profile'), icon: User, path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-100 px-4 py-2 flex justify-around items-center z-50 rounded-t-2xl shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;

        if (item.isAi) {
          return (
            <Link key={item.path} to={item.path} className="flex flex-col items-center -mt-5">
              <div className="w-12 h-12 rounded-full bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-500/40 hover:bg-teal-700 transition-transform active:scale-95">
                <Icon size={22} />
              </div>
              <span className="text-[10px] font-medium text-teal-600 mt-1">{item.label}</span>
            </Link>
          );
        }

        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center py-1 px-2 transition-colors ${
              isActive ? 'text-teal-600 font-semibold' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon size={20} />
            <span className="text-[10px] mt-1">{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
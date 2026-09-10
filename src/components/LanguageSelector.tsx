import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1.5 rounded-xl border border-slate-200">
      <Globe size={14} className="text-teal-600" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'hi' | 'mr')}
        className="bg-transparent text-xs font-semibold text-slate-700 outline-none cursor-pointer"
      >
        <option value="en">English</option>
        <option value="hi">हिंदी</option>
        <option value="mr">मराठी</option>
      </select>
    </div>
  );
}
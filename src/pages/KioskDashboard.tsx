import { useState } from 'react';
import { Users, QrCode, Search, ShieldCheck, UserPlus, LogOut } from 'lucide-react';

export default function KioskDashboard() {
  const [operatorInfo] = useState({
    name: 'Arogya Mitra',
    region: 'Vidarbha District',
    id: 'K-8902'
  });

  const [villagers] = useState([
    { id: 'V-101', name: 'Ramesh Patil', age: 45, lastVisit: '10 days ago', status: 'Stable' },
    { id: 'V-102', name: 'Sita Bai', age: 62, lastVisit: '1 month ago', status: 'Follow-up Needed' },
    { id: 'V-103', name: 'Ganesh Kumar', age: 28, lastVisit: '2 days ago', status: 'Prescribed' }
  ]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-0 sm:p-4 text-slate-100">
      <div className="w-full max-w-md bg-slate-800 min-h-screen sm:min-h-[844px] sm:rounded-[36px] shadow-2xl relative flex flex-col">
        
        {/* Header */}
        <div className="p-5 flex justify-between items-center border-b border-slate-700 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/50">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white">{operatorInfo.name}</h1>
              <p className="text-[10px] text-emerald-400">Operator ID: {operatorInfo.id} • {operatorInfo.region}</p>
            </div>
          </div>
          <button className="p-2 text-slate-400 hover:text-white transition-colors">
            <LogOut size={18} />
          </button>
        </div>

        {/* Action Panel */}
        <div className="p-5 pb-0 grid grid-cols-2 gap-3">
          <button className="bg-emerald-600 hover:bg-emerald-500 p-4 rounded-2xl flex flex-col items-center gap-2 shadow-lg transition-colors">
            <QrCode size={28} className="text-white" />
            <span className="text-xs font-bold text-white text-center">Scan Villager QR</span>
          </button>
          
          <button className="bg-slate-700 hover:bg-slate-600 p-4 rounded-2xl flex flex-col items-center gap-2 border border-slate-600 transition-colors">
            <UserPlus size={28} className="text-slate-300" />
            <span className="text-xs font-bold text-slate-200 text-center">Register New</span>
          </button>
        </div>

        {/* Search */}
        <div className="p-5 pb-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search villager by name or ID..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Sub-Profiles List */}
        <div className="p-5 flex-1 overflow-y-auto">
          <h2 className="text-xs font-bold text-slate-400 mb-3 flex items-center gap-2">
            <Users size={14} /> Assigned Villager Profiles
          </h2>
          
          <div className="space-y-3">
            {villagers.map(villager => (
              <div key={villager.id} className="bg-slate-700/50 p-3 rounded-2xl border border-slate-600 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {villager.name} <span className="text-[10px] text-slate-400 font-normal">{villager.id}</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Age: {villager.age} • Last Visit: {villager.lastVisit}</p>
                </div>
                <span className={`text-[9px] px-2 py-1 rounded-md font-bold uppercase ${
                  villager.status === 'Stable' ? 'bg-emerald-500/20 text-emerald-400' :
                  villager.status === 'Follow-up Needed' ? 'bg-rose-500/20 text-rose-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>
                  {villager.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

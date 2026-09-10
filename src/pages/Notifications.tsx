import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Bell, Calendar, Pill, FileText, CheckCircle2 } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'appointment' | 'medicine' | 'report';
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    title: 'Upcoming Appointment',
    description: 'Consultation with Dr. Rahul Sharma scheduled for today at 10:30 AM.',
    time: '2 hours ago',
    type: 'appointment',
    read: false,
  },
  {
    id: 2,
    title: 'Medicine Refill Reminder',
    description: 'Time to take your scheduled dose of Amoxicillin 500mg.',
    time: '5 hours ago',
    type: 'medicine',
    read: false,
  },
  {
    id: 3,
    title: 'Lab Report Ready',
    description: 'Your complete blood count (CBC) report has been verified and added to your Health Vault.',
    time: 'Yesterday',
    type: 'report',
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'appointment': return <Calendar size={18} className="text-teal-600" />;
      case 'medicine': return <Pill size={18} className="text-blue-600" />;
      case 'report': return <FileText size={18} className="text-amber-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[844px] sm:rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Header */}
        <div>
          <div className="p-5 pt-7 pb-4 flex justify-between items-center border-b border-slate-100">
            <Link to="/patient-dashboard" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-sm font-bold text-slate-900">Notifications & Alerts</h1>
            <button onClick={markAllAsRead} className="text-[11px] font-semibold text-teal-600 hover:underline">
              Mark all read
            </button>
          </div>

          {/* Notification List */}
          <div className="p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-20 space-y-2">
                <Bell size={32} className="text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No new notifications</p>
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                    item.read ? 'bg-white border-slate-100' : 'bg-teal-50/40 border-teal-100 shadow-sm'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-slate-900">{item.title}</p>
                      <span className="text-[9px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-teal-600 shrink-0 self-center" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white text-center">
          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <CheckCircle2 size={12} className="text-teal-600" />
            All alert channels active and updated
          </p>
        </div>

      </div>
    </div>
  );
}
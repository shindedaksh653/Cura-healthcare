import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PhoneCall, MapPin, AlertTriangle, ShieldAlert, Check } from 'lucide-react';
import { Geolocation } from '@capacitor/geolocation';

export default function SOS() {
  const [locationShared, setLocationShared] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [location, setLocation] = useState<{lat: number, lng: number} | null>(null);

  const EMERGENCY_CONTACTS = [
    { name: 'National Emergency Hotline', number: '112', type: 'Ambulance & Medical' },
    { name: 'Dr. Rahul Sharma (Primary Physician)', number: '+91 98765 43210', type: 'Doctor' },
    { name: 'Sarah (Emergency Contact / Sister)', number: '+91 91234 56789', type: 'Family' },
  ];

  const shareLocation = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      setLocation({ lat: coordinates.coords.latitude, lng: coordinates.coords.longitude });
      setLocationShared(true);
    } catch(err) {
      console.error('Error getting location', err);
      alert('Unable to retrieve location. Please ensure location services are enabled.');
    }
  };

  const handleTriggerSOS = async () => {
    setSosTriggered(true);
    await shareLocation();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[844px] sm:rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Header */}
        <div>
          <div className="p-5 pt-7 pb-4 flex justify-between items-center border-b border-rose-100 bg-rose-50/50">
            <Link to="/patient-dashboard" className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-600 hover:bg-slate-100 border border-slate-200">
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-1.5 text-rose-600">
              <ShieldAlert size={18} />
              <h1 className="text-sm font-bold tracking-tight">Cura Emergency SOS</h1>
            </div>
            <div className="w-9" />
          </div>

          <div className="p-5 space-y-6">
            
            {/* Big SOS Trigger Button */}
            <div className="text-center py-4 space-y-4">
              <div className="relative inline-block">
                {sosTriggered && (
                  <span className="absolute -inset-3 rounded-full bg-rose-500/20 animate-ping" />
                )}
                <button
                  onClick={handleTriggerSOS}
                  className={`w-36 h-36 rounded-full flex flex-col items-center justify-center text-white shadow-2xl transition-all transform active:scale-95 ${
                    sosTriggered
                      ? 'bg-rose-700 shadow-rose-600/50'
                      : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/40'
                  }`}
                >
                  <PhoneCall size={40} className="animate-bounce" />
                  <span className="text-lg font-black tracking-wider mt-1">SOS</span>
                </button>
              </div>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                {sosTriggered
                  ? 'Emergency broadcast active! Dispatched location to nearby responders.'
                  : 'Tap the red button to immediately request emergency assistance.'}
              </p>
            </div>

            {/* Quick GPS Location Status */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
              locationShared ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  locationShared ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  {locationShared ? <Check size={18} /> : <MapPin size={18} />}
                </div>
                <div>
                  <p className="text-xs font-bold">
                    {locationShared ? 'Live Location Broadcasted' : 'GPS Location Ready'}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {locationShared && location ? `Lat: ${location.lat.toFixed(4)}, Lng: ${location.lng.toFixed(4)}` : 'Accurate within 5 meters'}
                  </p>
                </div>
              </div>
              {!locationShared && (
                <button
                  onClick={shareLocation}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-semibold hover:bg-slate-800 transition-colors"
                >
                  Share Now
                </button>
              )}
            </div>

            {/* Emergency Contacts List */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-rose-500" />
                <span>Priority Emergency Hotline</span>
              </h2>
              <div className="space-y-2">
                {EMERGENCY_CONTACTS.map((contact, i) => (
                  <a
                    key={i}
                    href={`tel:${contact.number}`}
                    className="p-3.5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-rose-300 transition-all group"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-900">{contact.name}</p>
                      <p className="text-[10px] text-slate-500">{contact.type} • {contact.number}</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                      <PhoneCall size={16} />
                    </div>
                  </a>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Emergency Callout Warning */}
        <div className="p-4 border-t border-slate-100 bg-rose-50/60 text-center">
          <p className="text-[10px] text-rose-800 font-medium">
            For critical life-threatening emergencies, call National Dispatch (112) directly.
          </p>
        </div>
      </div>
    </div>
  );
}
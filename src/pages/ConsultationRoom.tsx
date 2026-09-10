import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, PhoneOff, FileText, Download } from 'lucide-react';
import { JitsiMeeting } from '@jitsi/react-sdk';

export default function ConsultationRoom() {
  const location = useLocation();
  
  // Grab the specific doctor data passed via navigation state, with a safe fallback
  const doctorInfo = location.state || {
    doctorName: 'Dr. Rahul Sharma',
    specialty: 'Cardiologist'
  };

  const [notesOpen, setNotesOpen] = useState(false);
  const [roomName] = useState(`CURA_Appointment_${doctorInfo.doctorName.replace(/\s+/g, '')}_${Math.floor(Math.random() * 1000)}`);

  const [doctorNotes] = useState([
    `Diagnosis: Routine Health Check with ${doctorInfo.doctorName}.`,
    'Advice: Continue regular exercise, stay hydrated, and take prescribed vitamins.'
  ]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 min-h-screen sm:min-h-[844px] sm:rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col justify-between text-white">
        
        {/* Top Bar */}
        <div className="p-5 pt-7 flex justify-between items-center z-10 bg-gradient-to-b from-slate-950/80 to-transparent absolute top-0 left-0 right-0 pointer-events-auto">
          <Link to="/patient-dashboard" className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25">
            <ArrowLeft size={18} />
          </Link>
          <div className="text-center">
            <h1 className="text-xs font-bold">{doctorInfo.doctorName}</h1>
            <p className="text-[9px] text-emerald-400 font-semibold flex items-center justify-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Live Secured Call (Jitsi)
            </p>
          </div>
          <button 
            onClick={() => setNotesOpen(!notesOpen)}
            className="w-9 h-9 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center hover:bg-teal-500/30"
          >
            <FileText size={18} />
          </button>
        </div>

        {/* Video Stage Area (Jitsi Meet Wrapper) */}
        <div className="flex-1 relative bg-slate-800 w-full h-full pt-20 pb-20">
          <JitsiMeeting
            domain="meet.jit.si"
            roomName={roomName}
            configOverwrite={{
              startWithAudioMuted: false,
              startWithVideoMuted: false,
              disableModeratorIndicator: true
            }}
            interfaceConfigOverwrite={{
              DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
              TOOLBAR_BUTTONS: [
                'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
              ]
            }}
            userInfo={{
              displayName: 'Patient'
            }}
            getIFrameRef={(iframeRef) => {
              iframeRef.style.height = '100%';
              iframeRef.style.width = '100%';
            }}
          />
        </div>

        {/* Notes Overlay */}
        {notesOpen && (
          <div className="absolute inset-x-4 top-24 bottom-24 bg-slate-900/95 backdrop-blur-lg rounded-2xl p-4 border border-teal-500/30 flex flex-col justify-between z-30">
            <div className="flex justify-between items-center border-b border-white/10 pb-2">
              <h3 className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                <FileText size={14} /> Live Prescription & Notes
              </h3>
              <button onClick={() => setNotesOpen(false)} className="text-xs text-slate-400 hover:text-white">Close</button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 py-3 text-xs">
              {doctorNotes.map((note, i) => (
                <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-200">
                  {note}
                </div>
              ))}
            </div>
            <button 
              onClick={() => alert('Prescription downloaded to Health Vault!')}
              className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg"
            >
              <Download size={14} /> Save Prescription to Vault
            </button>
          </div>
        )}

        {/* Custom Disconnect Button (Overlayed on bottom) */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10 pointer-events-none">
          <Link
            to="/patient-dashboard"
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition-all pointer-events-auto"
          >
            <PhoneOff size={22} />
          </Link>
        </div>

      </div>
    </div>
  );
}
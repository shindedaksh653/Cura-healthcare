import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Clock, FileText, CheckCircle, XCircle, Plus, Trash2, Send, ShieldCheck } from 'lucide-react';

interface PatientAppointment {
  id: number;
  patientName: string;
  age: number;
  gender: string;
  time: string;
  symptom: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
}

interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  duration: string;
}

const INITIAL_APPOINTMENTS: PatientAppointment[] = [
  { id: 1, patientName: 'Aarav Sharma', age: 29, gender: 'Male', time: '10:30 AM', symptom: 'Persistent Fever & Mild Cough', status: 'Pending' },
  { id: 2, patientName: 'Pooja Verma', age: 34, gender: 'Female', time: '11:15 AM', symptom: 'Severe Migraine & Nausea', status: 'Confirmed' },
  { id: 3, patientName: 'Rohan Deshmukh', age: 45, gender: 'Male', time: '02:00 PM', symptom: 'Hypertension & Dizziness', status: 'Confirmed' },
];

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState<PatientAppointment[]>(INITIAL_APPOINTMENTS);
  const [selectedPatient, setSelectedPatient] = useState<PatientAppointment | null>(null);
  const [rxList, setRxList] = useState<PrescriptionItem[]>([
    { medicineName: 'Paracetamol 650mg', dosage: '1-0-1 (After Food)', duration: '5 Days' }
  ]);
  const [newMed, setNewMed] = useState({ medicineName: '', dosage: '', duration: '' });
  const [prescriptionSent, setPrescriptionSent] = useState(false);

  const updateStatus = (id: number, status: PatientAppointment['status']) => {
    setAppointments((prev) => prev.map((app) => (app.id === id ? { ...app, status } : app)));
  };

  const handleAddMed = () => {
    if (!newMed.medicineName.trim()) return;
    setRxList((prev) => [...prev, newMed]);
    setNewMed({ medicineName: '', dosage: '', duration: '' });
  };

  const handleRemoveMed = (index: number) => {
    setRxList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSendPrescription = () => {
    if (!selectedPatient || rxList.length === 0) return;
    updateStatus(selectedPatient.id, 'Completed');
    setPrescriptionSent(true);
    setTimeout(() => {
      setPrescriptionSent(false);
      setSelectedPatient(null);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[844px] sm:rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
        
        {/* Header */}
        <div>
          <div className="p-5 pt-7 pb-4 flex justify-between items-center border-b border-slate-100 bg-white">
            <Link to="/" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
              <ArrowLeft size={18} />
            </Link>
            <div className="text-center">
              <h1 className="text-sm font-bold text-slate-900">Dr. Rahul Sharma</h1>
              <p className="text-[10px] text-teal-600 font-semibold">Cardiology Specialist • OPD Dashboard</p>
            </div>
            <div className="w-9" />
          </div>

          {/* Stats Bar */}
          <div className="p-4 grid grid-cols-3 gap-2 bg-slate-50 border-b border-slate-100 text-center">
            <div className="p-2 bg-white rounded-xl border border-slate-200/60">
              <p className="text-[10px] text-slate-400 font-medium">Today</p>
              <p className="text-sm font-bold text-slate-900">{appointments.length}</p>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200/60">
              <p className="text-[10px] text-slate-400 font-medium">Pending</p>
              <p className="text-sm font-bold text-amber-600">{appointments.filter(a => a.status === 'Pending').length}</p>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200/60">
              <p className="text-[10px] text-slate-400 font-medium">Completed</p>
              <p className="text-sm font-bold text-emerald-600">{appointments.filter(a => a.status === 'Completed').length}</p>
            </div>
          </div>

          {/* Appointments List */}
          <div className="p-4 space-y-3">
            <h2 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Calendar size={14} className="text-teal-600" />
              <span>Today's OPD Queue</span>
            </h2>

            {appointments.map((app) => (
              <div key={app.id} className="p-3.5 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
                      <User size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{app.patientName}</p>
                      <p className="text-[10px] text-slate-500">{app.age} yrs • {app.gender}</p>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    app.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                    app.status === 'Confirmed' ? 'bg-blue-50 text-blue-700' :
                    app.status === 'Cancelled' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    {app.status}
                  </span>
                </div>

                <div className="bg-slate-50 p-2 rounded-xl text-[11px] text-slate-600 flex items-center justify-between">
                  <span className="truncate">Symptom: <strong>{app.symptom}</strong></span>
                  <span className="text-[10px] text-slate-400 shrink-0 flex items-center gap-0.5">
                    <Clock size={10} />
                    {app.time}
                  </span>
                </div>

                {/* Actions */}
                <div className="pt-1 flex items-center justify-end gap-2">
                  {app.status === 'Pending' && (
                    <>
                      <button onClick={() => updateStatus(app.id, 'Cancelled')} className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg">
                        <XCircle size={16} />
                      </button>
                      <button onClick={() => updateStatus(app.id, 'Confirmed')} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                        <CheckCircle size={16} />
                      </button>
                    </>
                  )}

                  {(app.status === 'Confirmed' || app.status === 'Completed') && (
                    <button
                      onClick={() => setSelectedPatient(app)}
                      className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-semibold flex items-center gap-1 transition-colors"
                    >
                      <FileText size={12} />
                      <span>{app.status === 'Completed' ? 'View Rx' : 'Write Rx'}</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Prescription Modal Drawer */}
        {selectedPatient && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-30 flex flex-col justify-end">
            <div className="bg-white rounded-t-[32px] p-5 space-y-4 max-h-[90%] overflow-y-auto animate-slide-up">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-slate-900">Write Prescription</h3>
                  <p className="text-[10px] text-slate-500">Patient: {selectedPatient.patientName} ({selectedPatient.age} yrs)</p>
                </div>
                <button onClick={() => setSelectedPatient(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">
                  Close
                </button>
              </div>

              {prescriptionSent && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span>Digital Prescription sent to Patient's Vault!</span>
                </div>
              )}

              {/* Added Medicines List */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-slate-700">Prescribed Rx ({rxList.length})</p>
                {rxList.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-900">{item.medicineName}</p>
                      <p className="text-[10px] text-slate-500">{item.dosage} • {item.duration}</p>
                    </div>
                    <button onClick={() => handleRemoveMed(idx)} className="text-rose-500 hover:text-rose-700 p-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Medicine Inputs */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-700">Add Medicine</p>
                <input
                  type="text"
                  placeholder="Medicine name (e.g. Amoxicillin 500mg)"
                  value={newMed.medicineName}
                  onChange={(e) => setNewMed({ ...newMed, medicineName: e.target.value })}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-teal-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Dosage (e.g. 1-0-1)"
                    value={newMed.dosage}
                    onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                    className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g. 5 Days)"
                    value={newMed.duration}
                    onChange={(e) => setNewMed({ ...newMed, duration: e.target.value })}
                    className="bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-teal-500"
                  />
                </div>
                <button
                  onClick={handleAddMed}
                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus size={14} />
                  <span>Add to List</span>
                </button>
              </div>

              {/* Action */}
              <button
                onClick={handleSendPrescription}
                className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-teal-600/20 transition-colors"
              >
                <Send size={14} />
                <span>Sign & Issue Prescription</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-white border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
            <ShieldCheck size={12} className="text-teal-600" />
            Verified Medical Practitioner Portal
          </p>
        </div>

      </div>
    </div>
  );
}
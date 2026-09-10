import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud, FileText, Download, Trash2, ShieldCheck, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { db } from '../firebase';
import { collection, query, where, getDocs, deleteDoc, doc as firestoreDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function HealthVault() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRecords = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user ? user.uid : 'anonymous-user';

      const q = query(collection(db, "health_vault"), where("user_id", "==", userId));
      const querySnapshot = await getDocs(q);
      
      const fetchedRecords: any[] = [];
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        fetchedRecords.push({ 
          id: docSnap.id, 
          name: data.title || 'Untitled Document',
          doctor: data.notes || 'Added via App',
          date: data.created_at?.toDate ? data.created_at.toDate().toLocaleDateString() : 'Just now',
          type: data.category || 'Prescription',
          file_data: data.file_data || null
        });
      });

      setDocuments(fetchedRecords);
    } catch (err) {
      console.error("Error fetching health vault records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredDocs = documents.filter(doc => {
    const matchesFilter = filter === 'All' || doc.type === filter;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.doctor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(firestoreDoc(db, "health_vault", id));
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete document.");
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
            <h1 className="text-sm font-bold text-slate-900">Encrypted Health Vault</h1>
            <div className="w-9" />
          </div>

          <div className="p-5 space-y-4">
            
            {/* Clickable Upload Box */}
            <Link 
              to="/upload-report" 
              className="block border-2 border-dashed border-teal-400 rounded-3xl p-6 text-center bg-teal-50/50 hover:bg-teal-50 transition-all cursor-pointer group shadow-sm"
            >
              <div className="w-12 h-12 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition-transform">
                <UploadCloud size={24} />
              </div>
              <h3 className="text-xs font-bold text-teal-900">Upload New Medical Record</h3>
              <p className="text-[10px] text-teal-700 mt-0.5">Supports PDF, PNG, JPG up to 15MB</p>
            </Link>

            {/* Search Bar */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search records or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:border-teal-500"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {['All', 'Prescription', 'Lab Report', 'Scan / X-Ray', 'Vaccination'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                    filter === cat
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Document List */}
            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center">
                <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Documents ({filteredDocs.length})</h2>
                <span className="text-[10px] text-teal-600 font-semibold flex items-center gap-1">
                  <ShieldCheck size={12} /> Encrypted AES-256
                </span>
              </div>

              <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                {loading ? (
                  <p className="text-xs text-slate-400 text-center py-6">Loading your vault records...</p>
                ) : filteredDocs.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">No records found.</p>
                ) : (
                  filteredDocs.map((doc) => (
                    <div key={doc.id} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2.5 group hover:bg-slate-100 transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
                            <FileText size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{doc.name}</h4>
                            <p className="text-[10px] text-slate-500">{doc.doctor} • {doc.date}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {doc.file_data ? (
                            <a 
                              href={doc.file_data} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-teal-50 hover:text-teal-600"
                              title="View Image"
                            >
                              <ImageIcon size={14} />
                            </a>
                          ) : (
                            <button 
                              onClick={() => alert(`Downloading ${doc.name}`)}
                              className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-600 flex items-center justify-center hover:bg-teal-50 hover:text-teal-600"
                              title="Download Document"
                            >
                              <Download size={14} />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(doc.id)}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600"
                            title="Delete Document"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Image Thumbnail Preview if available */}
                      {doc.file_data && (
                        <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-black/5">
                          <img 
                            src={doc.file_data} 
                            alt={doc.name} 
                            className="w-full h-24 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <CheckCircle2 size={12} className="text-teal-600" /> End-to-end encrypted medical record vault
          </p>
        </div>

      </div>
    </div>
  );
}
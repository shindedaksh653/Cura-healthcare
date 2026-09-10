import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, UploadCloud, Camera, RefreshCw, CheckCircle2, ShieldCheck, FileCheck, X, Pill, Sparkles } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

export default function UploadReport() {
  const [reportType, setReportType] = useState('Prescription');
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState<{ medicines: string[]; notes: string } | null>(null);
  
  // Camera scanner states
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async (front: boolean) => {
    try {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      
      const constraints = {
        video: { 
          facingMode: front ? 'user' : { exact: 'environment' } 
        }
      };

      let newStream;
      try {
        newStream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch {
        try {
          newStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: front ? 'user' : 'environment' }
          });
        } catch {
          newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        }
      }

      setStream(newStream);
      setIsCameraActive(true);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch {
      alert('Could not open camera. Please check if another app is using it or allow permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const toggleCameraFlip = () => {
    const nextState = !useFrontCamera;
    setUseFrontCamera(nextState);
    startCamera(nextState);
  };

  const capturePhoto = async () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setFileBase64(dataUrl);
      setFileName(`Scanned_Document_${Date.now()}.jpg`);
      stopCamera();
      
      setLoading(true);
      try {
        const response = await fetch('/api/extract-report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: dataUrl, reportType })
        });
        const data = await response.json();
        setExtractedData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);

      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        setFileBase64(base64);
        
        setLoading(true);
        try {
          const response = await fetch('/api/extract-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64: base64, reportType })
          });
          const data = await response.json();
          setExtractedData(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!fileBase64) return;

    setLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const userId = user ? user.uid : 'anonymous-user';

      await addDoc(collection(db, "health_vault"), {
        user_id: userId,
        title: fileName,
        category: reportType,
        file_data: fileBase64,
        medicines: extractedData?.medicines || [],
        notes: extractedData?.notes || '',
        created_at: serverTimestamp()
      });

      setUploadSuccess(true);
      setFileBase64(null);
      setFileName(null);
      setExtractedData(null);

      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white min-h-screen sm:min-h-[844px] sm:rounded-[36px] shadow-2xl relative overflow-hidden flex flex-col justify-between">
        
        <div>
          <div className="p-5 pt-7 pb-4 flex justify-between items-center border-b border-slate-100">
            <Link to="/health-vault" className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="text-sm font-bold text-slate-900">Upload Report & Prescription</h1>
            <div className="w-9" />
          </div>

          <form onSubmit={handleUpload} className="p-5 space-y-4">
            {uploadSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Document saved directly to Firestore database!</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">Document Category</label>
              <div className="grid grid-cols-3 gap-2">
                {['Prescription', 'Lab Report', 'Scan / X-Ray'].map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => setReportType(type)}
                    className={`py-2 px-2 text-[11px] font-semibold rounded-xl border transition-all ${
                      reportType === type
                        ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => startCamera(useFrontCamera)}
                className="p-4 bg-teal-50 border border-teal-200 rounded-2xl flex flex-col items-center justify-center text-teal-700 hover:bg-teal-100 transition-all shadow-sm"
              >
                <Camera size={24} className="mb-1 text-teal-600" />
                <span className="text-xs font-bold">Open Camera</span>
                <span className="text-[9px] text-teal-600">Scan via Cam</span>
              </button>

              <label className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-700 hover:bg-slate-100 cursor-pointer transition-all">
                <UploadCloud size={24} className="mb-1 text-slate-500" />
                <span className="text-xs font-bold">Local Storage</span>
                <span className="text-[9px] text-slate-400">Browse Files</span>
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="hidden" 
                  accept=".pdf,.jpg,.png,.jpeg" 
                />
              </label>
            </div>

            {fileName && (
              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-800 truncate">{fileName}</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Ready</span>
                </div>

                {extractedData && (
                  <div className="p-3.5 bg-teal-50/60 border border-teal-200/80 rounded-2xl space-y-2">
                    <h4 className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-teal-600" /> Extracted Medicines & Info
                    </h4>
                    <div className="space-y-1">
                      {extractedData.medicines.map((med, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-700 bg-white p-2 rounded-xl border border-teal-100">
                          <Pill size={14} className="text-teal-600 shrink-0" />
                          <span className="font-semibold">{med}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-[10px] text-teal-800 italic">{extractedData.notes}</p>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={!fileBase64 || loading}
              className={`w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                fileBase64 && !loading
                  ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              <FileCheck size={16} />
              <span>{loading ? 'Saving to Database...' : 'Confirm & Save Document'}</span>
            </button>
          </form>
        </div>

        {isCameraActive && (
          <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col justify-between p-4">
            <div className="flex justify-between items-center text-white p-2">
              <span className="text-xs font-bold">
                Camera Active ({useFrontCamera ? 'Front Cam' : 'Rear / Back Cam'})
              </span>
              <button onClick={stopCamera} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <X size={18} />
              </button>
            </div>

            <div className="relative flex-1 rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/20">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="absolute inset-8 border-2 border-dashed border-teal-400/80 rounded-xl pointer-events-none flex items-center justify-center">
                <span className="bg-black/60 text-teal-300 text-[10px] px-3 py-1 rounded-full backdrop-blur-sm">Align document inside frame</span>
              </div>
            </div>

            <div className="p-4 flex items-center justify-around">
              <button
                type="button"
                onClick={toggleCameraFlip}
                className="px-4 py-2.5 rounded-xl bg-white/20 text-white flex items-center gap-2 text-xs font-bold hover:bg-white/30 backdrop-blur-md"
              >
                <RefreshCw size={16} />
                <span>Flip Camera</span>
              </button>

              <button
                type="button"
                onClick={capturePhoto}
                className="w-16 h-16 rounded-full bg-teal-500 border-4 border-white flex items-center justify-center shadow-lg shadow-teal-500/50 hover:bg-teal-600"
                title="Capture Photo"
              >
                <div className="w-12 h-12 rounded-full border-2 border-teal-800" />
              </button>
            </div>
          </div>
        )}

        <div className="p-4 border-t border-slate-100 bg-white text-center">
          <p className="text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck size={12} className="text-teal-600" />
            100% Free Firestore Database Storage
          </p>
        </div>

      </div>
    </div>
  );
}
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, Pill, ShoppingBag, Plus, Minus, CheckCircle, ShieldCheck } from 'lucide-react';

interface Medicine {
  id: number;
  name: string;
  dosage: string;
  category: string;
  price: number;
  prescriptionRequired: boolean;
  image: string;
}

const MEDICINES: Medicine[] = [
  { id: 1, name: 'Amoxicillin 500mg', dosage: '10 Capsules', category: 'Antibiotic', price: 120, prescriptionRequired: true, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Paracetamol 650mg', dosage: '15 Tablets', category: 'Fever & Pain Relief', price: 45, prescriptionRequired: false, image: 'https://images.unsplash.com/photo-1550572017-edf7e1ed467c?w=150&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Cetirizine 10mg', dosage: '10 Tablets', category: 'Allergy Relief', price: 35, prescriptionRequired: false, image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=150&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Pantoprazole 40mg', dosage: '10 Tablets', category: 'Antacid', price: 90, prescriptionRequired: true, image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=150&auto=format&fit=crop&q=80' },
  { id: 5, name: 'Vitamin C 500mg Chewable', dosage: '30 Tablets', category: 'Supplements', price: 150, prescriptionRequired: false, image: 'https://images.unsplash.com/photo-1550572017-edf7e1ed467c?w=150&auto=format&fit=crop&q=80' },
];

export default function Medicines() {
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [orderSuccess, setOrderSuccess] = useState(false);

  const clean = (str: string) => str.toLowerCase().trim();

  const filteredMedicines = MEDICINES.filter((item) =>
    clean(item.name).includes(clean(search)) || clean(item.category).includes(clean(search))
  );

  const addToCart = (id: number) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => {
      const updated = { ...prev };
      if (updated[id] > 1) updated[id] -= 1;
      else delete updated[id];
      return updated;
    });
  };

  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  const totalPrice = Object.entries(cart).reduce((sum, [id, qty]) => {
    const med = MEDICINES.find((m) => m.id === Number(id));
    return sum + (med ? med.price * qty : 0);
  }, 0);

  const handleCheckout = () => {
    if (totalItems === 0) return;
    setOrderSuccess(true);
    setTimeout(() => {
      setCart({});
      setOrderSuccess(false);
    }, 2500);
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
            <h1 className="text-sm font-bold text-slate-900">Cura Pharmacy</h1>
            <div className="relative">
              <ShoppingBag size={20} className="text-slate-700" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-teal-600 text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
          </div>

          <div className="p-5 space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search medicines or health products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-100 border border-slate-200 rounded-full pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none focus:border-teal-500 focus:bg-white transition-all"
              />
            </div>

            {/* Success Overlay Banner */}
            {orderSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
                <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                <span>Order Placed! Delivery scheduled within 2 hours.</span>
              </div>
            )}

            {/* Medicine Inventory List */}
            <div className="space-y-3">
              <h2 className="text-xs font-bold text-slate-900">Available Medicines</h2>

              {filteredMedicines.map((med) => {
                const qty = cart[med.id] || 0;
                return (
                  <div key={med.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-slate-200 transition-all">
                    <div className="flex items-center gap-3">
                      <img src={med.image} alt={med.name} className="w-12 h-12 rounded-xl object-cover bg-white border border-slate-200 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-slate-900 line-clamp-1">{med.name}</p>
                        <p className="text-[10px] text-slate-500">{med.dosage} • {med.category}</p>
                        <p className="text-xs font-extrabold text-teal-600 mt-0.5">₹{med.price}</p>
                      </div>
                    </div>

                    {qty === 0 ? (
                      <button
                        onClick={() => addToCart(med.id)}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-semibold transition-colors shadow-sm"
                      >
                        Add
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1">
                        <button onClick={() => removeFromCart(med.id)} className="p-1 text-slate-600 hover:text-rose-600">
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{qty}</span>
                        <button onClick={() => addToCart(med.id)} className="p-1 text-slate-600 hover:text-teal-600">
                          <Plus size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Checkout Drawer */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-3">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-500 font-medium">Subtotal ({totalItems} items)</span>
            <span className="font-bold text-slate-900">₹{totalPrice}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={totalItems === 0}
            className={`w-full py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              totalItems > 0
                ? 'bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            <Pill size={16} />
            <span>{totalItems > 0 ? `Place Delivery Order (₹${totalPrice})` : 'Cart is Empty'}</span>
          </button>
          
          <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck size={12} className="text-teal-600" />
            Licensed Pharmacy • Express Home Delivery
          </p>
        </div>

      </div>
    </div>
  );
}
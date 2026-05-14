import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { APP_CONFIG } from "../config/appconfig";
import { BRANCHES } from "../data/branches";
import { useUI } from "../context/UIContext";
import { buildOrderMessage, buildWhatsAppUrl } from "../utils/orderMessage";

function normalizeDigits(value) {
  return String(value || "").replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴五六七八九".indexOf(d));
}

/* 
    Full edited function including:
    1. Responsive Layout: Bottom-drawer for mobile, centered modal for desktop
    2. iOS Safe Area & Keyboard-aware scrolling
    3. Enhanced 'Thumb-Zone' ergonomics
    4. Hardware-accelerated animations
*/
export default function OrderModal({ product, isOpen, onClose }) {
  const { language, t } = useUI();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [branchId, setBranchId] = useState(BRANCHES[0]?.id || "");

  const selectedBranch = useMemo(() => {
    return BRANCHES.find((b) => b.id === branchId) || BRANCHES[0];
  }, [branchId]);

  if (!isOpen || !product) return null;
  const isArabic = language === "ar";

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanName = customerName.trim();
    const cleanPhone = normalizeDigits(customerPhone).trim();

    if (!cleanName) {
      toast.error(isArabic ? "من فضلك أدخل اسم العميل" : "Please enter customer name");
      return;
    }
    if (!cleanPhone || cleanPhone.length < 10) {
      toast.error(isArabic ? "من فضلك أدخل رقم هاتف صحيح" : "Please enter a valid phone number");
      return;
    }

    const message = buildOrderMessage({
      product,
      customerName: cleanName,
      customerPhone: cleanPhone,
      branch: selectedBranch,
      language,
    });

    const url = buildWhatsAppUrl(APP_CONFIG.WHATSAPP_PHONE, message);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/80 backdrop-blur-md p-0 md:p-4"
      onClick={onClose} 
    >
      <div 
        className="relative w-full max-w-lg bg-zinc-950 flex flex-col 
                   /* Animation & Shape */
                   rounded-t-[2.5rem] md:rounded-3xl border-t md:border border-white/10
                   h-[92vh] md:h-auto md:max-h-[85vh] 
                   animate-in slide-in-from-bottom duration-500 cubic-bezier(0.32, 0.72, 0, 1)"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Handle Bar */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
            <div className="w-12 h-1.5 rounded-full bg-white/10" />
        </div>

        {/* Header - Fixed Height */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
            <h2 className="font-mono text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">
              {t.actions.order} 
            </h2>
          </div>
          
          <button 
            onClick={onClose} 
            className="h-10 w-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-zinc-400 active:scale-90 transition-all"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 custom-scrollbar">
          {/* Product Info Card */}
          <div className="mb-8 p-4 rounded-2xl bg-gradient-to-br from-zinc-900 to-black border border-white/5 shadow-inner">
            <p className="font-mono text-[9px] uppercase tracking-widest text-blue-500 mb-2">Request_Payload</p>
            <h3 className="text-lg font-bold text-white line-clamp-2 leading-tight">{product.name}</h3>
            <div className="mt-4 flex items-baseline gap-2">
               <span className="text-2xl font-black text-white">
                 {Number(product.price || 0).toLocaleString(isArabic ? "ar-EG" : "en-US")}
               </span>
               <span className="text-xs font-mono text-zinc-500 uppercase">{isArabic ? "ج.م" : "EGP"}</span>
            </div>
          </div>

          <form id="drawer-form" onSubmit={handleSubmit} className="space-y-6">
            {[
              { label: isArabic ? "اسم العميل" : "Customer Name", val: customerName, set: setCustomerName, type: "text", ph: isArabic ? "اكتب الاسم الكامل" : "ENTER FULL NAME" },
              { label: isArabic ? "رقم الهاتف" : "Phone Number", val: customerPhone, set: setCustomerPhone, type: "tel", ph: "01XXXXXXXXX" }
            ].map((input, i) => (
              <div key={i}>
                <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                  {input.label}
                </label>
                <input
                  type={input.type}
                  value={input.val}
                  onChange={(e) => input.type === "tel" ? input.set(normalizeDigits(e.target.value)) : input.set(e.target.value)}
                  className="w-full h-14 rounded-2xl border border-zinc-800 bg-zinc-900/30 px-5 text-base text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                  placeholder={input.ph}
                />
              </div>
            ))}

            <div>
              <label className="mb-2 block font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1">
                {t.actions.nearestBranch}
              </label>
              <div className="relative">
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full h-14 appearance-none rounded-2xl border border-zinc-800 bg-zinc-900/30 px-5 text-base text-white focus:border-blue-500 outline-none"
                >
                  {BRANCHES.map((b) => (
                    <option key={b.id} value={b.id} className="bg-zinc-950">
                      {isArabic ? b.nameAr : b.nameEn}
                    </option>
                  ))}
                </select>
                <div className={`absolute inset-y-0 ${isArabic ? 'left-4' : 'right-4'} flex items-center pointer-events-none text-zinc-600`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              {selectedBranch && (
                <div className="mt-3 px-1 flex gap-2">
                  <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <p className="text-[11px] text-zinc-500 leading-relaxed italic">
                    {isArabic ? selectedBranch.workingHoursAr : selectedBranch.workingHoursEn}
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Action Footer - Fixed at Bottom */}
        <div className="shrink-0 p-6 border-t border-white/5 bg-zinc-900/50 backdrop-blur-xl rounded-t-3xl
                        pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <div className="flex flex-col gap-3">
            <button
              form="drawer-form"
              type="submit"
              className="w-full h-14 flex items-center justify-center gap-3 rounded-2xl bg-blue-600 text-sm font-black uppercase tracking-widest text-white active:scale-[0.97] transition-all shadow-xl shadow-blue-900/20"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412 0 6.556-5.338 11.891-11.893 11.891-2.01 0-3.991-.511-5.753-1.48l-6.244 1.689zm5.889-4.707c1.569.932 3.12 1.396 4.67 1.397 5.011 0 9.088-4.077 9.091-9.088.001-2.427-.944-4.709-2.661-6.427-1.717-1.718-3.998-2.665-6.425-2.665-5.013 0-9.091 4.078-9.093 9.091 0 1.654.457 3.267 1.321 4.685l-1.012 3.693 3.799-1.006z"/></svg>
              {t.actions.sendWhatsApp}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full h-12 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {t.actions.terminateSession}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { APP_CONFIG } from "../config/appConfig";
import { BRANCHES } from "../data/branches";
import { useUI } from "../context/UIContext";
import { buildOrderMessage, buildWhatsAppUrl } from "../utils/orderMessage";

function normalizeDigits(value) {
  return String(value || "").replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵六七八九".indexOf(d));
}

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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm p-3 sm:items-center">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_0_50px_rgba(0,0,0,1)] animate-in fade-in slide-in-from-bottom-4 duration-300">
        
        {/* Header: Tech Terminal Style */}
        <div className="flex items-center justify-between border-b border-white/5 bg-zinc-900/50 p-4">
          <div className="flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,1)]" />
            <h2 className="font-mono text-xs font-black uppercase tracking-[0.2em] text-zinc-100">
              {t.actions.order} 
            </h2>
          </div>
          <button onClick={onClose} className="group p-1 text-zinc-500 hover:text-white transition-colors">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5">
          {/* Product Summary Block */}
          <div className="mb-6 rounded-lg border border-zinc-800 bg-black/40 p-4 ring-1 ring-white/5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Target_Component</p>
            <p className="text-sm font-bold text-white line-clamp-1">{product.name}</p>
            <div className="mt-3 flex items-center justify-between">
               <span className="font-mono text-lg font-black text-blue-400">
                 {Number(product.price || 0).toLocaleString(isArabic ? "ar-EG" : "en-US")} <small className="text-[10px] opacity-50 uppercase">{isArabic ? "ج.م" : "EGP"}</small>
               </span>
               <span className="text-[9px] font-mono text-zinc-600">ID: {product.id}</span>
            </div>
          </div>

          <div className="space-y-4">
            {/* Input Groups */}
            {[
              { label: isArabic ? "اسم العميل" : "Customer Name", val: customerName, set: setCustomerName, type: "text", ph: isArabic ? "اكتب الاسم الكامل" : "ENTER FULL NAME" },
              { label: isArabic ? "رقم الهاتف" : "Phone Number", val: customerPhone, set: setCustomerPhone, type: "tel", ph: "01XXXXXXXXX" }
            ].map((input, i) => (
              <div key={i}>
                <label className="mb-1.5 block font-mono text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  {input.label}
                </label>
                <input
                  type={input.type}
                  value={input.val}
                  onChange={(e) => input.type === "tel" ? input.set(normalizeDigits(e.target.value)) : input.set(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-white placeholder:text-zinc-700 focus:border-blue-500 focus:bg-black focus:outline-none transition-all"
                  placeholder={input.ph}
                />
              </div>
            ))}

            {/* Branch Selection */}
            <div>
              <label className="mb-1.5 block font-mono text-[10px] font-black uppercase tracking-widest text-zinc-500">
                {t.actions.nearestBranch}
              </label>
              <div className="relative">
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-3 font-mono text-sm text-white focus:border-blue-500 focus:bg-black focus:outline-none"
                >
                  {BRANCHES.map((b) => (
                    <option key={b.id} value={b.id} className="bg-zinc-900 text-white">
                      {isArabic ? b.nameAr : b.nameEn}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-600">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
              {selectedBranch && (
                <div className="mt-2 flex items-start gap-2 text-[10px] text-zinc-500">
                  <span className="mt-1 h-1 w-1 rounded-full bg-zinc-700 shrink-0" />
                  <p className="leading-relaxed">{isArabic ? selectedBranch.workingHoursAr : selectedBranch.workingHoursEn}</p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 text-[11px] font-black uppercase tracking-widest text-white transition-all hover:bg-blue-500 active:scale-95 shadow-[0_10px_20px_rgba(59,130,246,0.3)]"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.484 8.412 0 6.556-5.338 11.891-11.893 11.891-2.01 0-3.991-.511-5.753-1.48l-6.244 1.689zm5.889-4.707c1.569.932 3.12 1.396 4.67 1.397 5.011 0 9.088-4.077 9.091-9.088.001-2.427-.944-4.709-2.661-6.427-1.717-1.718-3.998-2.665-6.425-2.665-5.013 0-9.091 4.078-9.093 9.091 0 1.654.457 3.267 1.321 4.685l-1.012 3.693 3.799-1.006z"/></svg>
              {isArabic ? "إرسال الطلب" : "SEND_ON_WHATSAPP"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-800 bg-transparent py-4 text-[11px] font-black uppercase tracking-widest text-zinc-500 transition-all hover:border-zinc-700 hover:text-white"
            >
              {isArabic ? "إلغاء" : "TERMINATE_SESSION"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
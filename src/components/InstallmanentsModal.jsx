import { useEffect, useState } from "react";
import { useUI } from "../context/UIContext";
import { getInstallmentPartners } from "../services/productsApi";

export default function PaymentMethodsModal({ isOpen, onClose }) {
  const { language, t } = useUI();
  const [installments, setInstallments] = useState({ companies: [], banks: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [copiedText, setCopiedText] = useState("");

  const isArabic = language === "ar";

  useEffect(() => {
    if (isOpen) {
      getInstallmentPartners()
        .then((res) => {
          setInstallments(res);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [isOpen]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(""), 2000);
  };

  if (!isOpen) return null;

  const InstallmentGrid = ({ title, items, accentColor }) => (
    <div className="space-y-3">
      <h3 className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 px-1">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg border border-white/5 bg-zinc-900/50 p-3 transition-colors hover:border-zinc-700">
            <div className={`h-1 w-1 rounded-full ${accentColor}`} />
            <span className="text-[11px] font-bold text-zinc-300">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm p-3 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-2xl flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_0_50px_rgba(0,0,0,1)] animate-in fade-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/5 bg-zinc-900/40 p-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              <h2 className="font-mono text-xs font-black uppercase tracking-[0.3em] text-white">
                {t.payment.title}
              </h2>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{t.payment.subtitle}</p>
          </div>
          <button onClick={onClose} className="group flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 transition-all hover:border-red-500/50 hover:bg-red-500/10">
            <svg className="h-4 w-4 text-zinc-500 group-hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto p-5 space-y-8 custom-scrollbar">
          
          {/* SECTION 1: Installment Partners */}
          <div className="space-y-6">
            {isLoading ? (
              <div className="py-10 text-center font-mono text-[10px] text-zinc-700 animate-pulse uppercase tracking-widest">Initializing_Finance_Modules...</div>
            ) : (
              <>
                <InstallmentGrid 
                  title={t.payment.companies_title} 
                  items={installments.companies} 
                  accentColor="bg-blue-500" 
                />
                <InstallmentGrid 
                  title={t.payment.banks_title} 
                  items={installments.banks} 
                  accentColor="bg-emerald-500" 
                />
              </>
            )}
          </div>

          {/* SECTION 2: Bank Transfer (Click to Copy) */}
          <div className="rounded-xl border border-blue-500/10 bg-blue-500/5 p-4">
            <h3 className="mb-3 font-mono text-[10px] font-black uppercase tracking-widest text-blue-400">
              {t.payment.bank_accounts_title}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {/* NBE Account */}
              <button 
                onClick={() => handleCopy("4483172189609200018")}
                className="flex flex-col text-left rtl:text-right gap-1 rounded-lg bg-black/40 p-3 border border-white/5 hover:bg-black/60 transition-colors group relative"
              >
                <span className="font-mono text-[12px] font-bold text-zinc-200 tracking-wider">
                    {copiedText === "4483172189609200018" ? (isArabic ? "تم النسخ" : "COPIED") : "4483172189609200018"}
                </span>
                <span className="text-[10px] text-zinc-500 uppercase">{isArabic ? "البنك الاهلى - فرع شكرى القوتلى" : "NBE - Shoukry Branch"}</span>
              </button>

              {/* InstaPay */}
              <button 
                onClick={() => handleCopy("01098036014")}
                className="flex items-center justify-between rounded-lg bg-black/40 p-3 border border-white/5 hover:bg-black/60 transition-colors group relative"
              >
                <div className="flex flex-col text-left rtl:text-right">
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-tighter">{t.payment.instapay_title}</span>
                  <span className="font-mono text-[11px] text-zinc-200">
                    {copiedText === "01098036014" ? (isArabic ? "تم النسخ" : "COPIED") : "01098036014 - 01004369876"}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* SECTION 3: Payment Conditions */}
          <div className="pt-6 border-t border-white/5">
            <h3 className="mb-4 font-mono text-[10px] font-black uppercase tracking-widest text-zinc-600">
              {t.payment.conditions_title}
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { title: t.payment.cash_title, desc: t.payment.cash_desc },
                { title: t.payment.visa_title, desc: t.payment.visa_desc },
                { title: t.payment.delivery_title, desc: t.payment.delivery_desc },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tight">{item.title}</span>
                  <p className="text-[10px] leading-relaxed text-zinc-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
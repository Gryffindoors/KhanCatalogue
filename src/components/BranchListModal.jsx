import { BRANCHES } from "../data/branches";
import { useUI } from "../context/UIContext";

export default function BranchListModal({ isOpen, onClose }) {
  const { language, t } = useUI();

  if (!isOpen) return null;
  const isArabic = language === "ar";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm p-3 sm:items-center">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-[0_0_50px_rgba(0,0,0,1)] animate-in fade-in zoom-in-95 duration-300">
        
        {/* Modal Header: Network Status Style */}
        <div className="flex items-start justify-between gap-4 border-b border-white/5 bg-zinc-900/40 p-5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
              </span>
              <h2 className="font-mono text-xs font-black uppercase tracking-[0.3em] text-white">
                {t.branches.title}
              </h2>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              {t.branches.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="group flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 transition-all hover:border-red-500/50 hover:bg-red-500/10"
          >
            <svg className="h-4 w-4 text-zinc-500 group-hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable Network Nodes */}
        <div className="max-h-[70vh] space-y-4 overflow-y-auto p-5 custom-scrollbar">
          {BRANCHES.map((branch, index) => (
            <article
              key={branch.id}
              className="group relative rounded-xl border border-zinc-900 bg-zinc-900/30 p-5 transition-all hover:border-blue-500/30 hover:bg-zinc-900/50"
            >
              {/* Decorative ID corner */}
              {/* <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-30 transition-opacity">
                <span className="font-mono text-[10px] font-black text-white">
                  #{String(index + 1).padStart(2, '0')}
                </span>
              </div> */}

              <div className="flex items-start gap-4">
                {/* Branch Location Icon */}
                <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-900 ring-1 ring-white/5 group-hover:ring-blue-500/40">
                  <svg className="h-5 w-5 text-blue-500/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>

                <div className="flex-1">
                  <h3 className="font-mono text-[13px] font-black uppercase tracking-wider text-zinc-100 group-hover:text-blue-400 transition-colors">
                    {isArabic ? branch.nameAr : branch.nameEn}
                  </h3>

                  <div className="mt-3 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                       <span className="h-1 w-1 rounded-full bg-blue-500" />
                       <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                         {isArabic ? "ساعات العمل" : "Operation   Hours"}
                       </p>
                    </div>
                    <p className="text-xs leading-relaxed text-zinc-400 rtl:text-right">
                      {isArabic ? branch.workingHoursAr : branch.workingHoursEn}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
        
        {/* Modal Footer: System Footer
        <div className="border-t border-white/5 bg-zinc-950 p-4 text-center">
           <p className="font-mono text-[8px] uppercase tracking-[0.5em] text-zinc-700">
             End_Of_Transmission 
           </p>
        </div> */}
      </div>
    </div>
  );
}
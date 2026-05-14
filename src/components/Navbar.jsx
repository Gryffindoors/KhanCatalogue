import { Link } from "react-router";
import { useState } from "react";
import { APP_CONFIG } from "../config/appconfig";
import { useUI } from "../context/UIContext";
import BranchListModal from "./BranchListModal";
import PaymentMethodsModal from "./InstallmanentsModal"; // New Import
import logo from "../images/3-01-01.jpg";

export default function Navbar() {
  const { t, language, toggleLanguage } = useUI();
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false); // New State

  const isArabic = language === "ar";
  const whatsappUrl = `https://wa.me/${APP_CONFIG.WHATSAPP_PHONE}`;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 h-16">

          {/* Logo & Brand Section */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-white/10 group-hover:ring-blue-500/50 transition-all duration-300">
              <img
                src={logo}
                alt={APP_CONFIG.COMPANY_NAME}
                className="h-full w-full object-cover mix-blend-lighten opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-transform"
              />
              <div className="absolute inset-0 bg-linear-to-tr from-blue-500/10 to-transparent pointer-events-none" />
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-[15px] font-bold tracking-tight text-zinc-100 group-hover:text-white transition-colors uppercase font-mono">
                {APP_CONFIG.COMPANY_NAME}
              </span>
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                {t.catalogue.title}
              </span>
            </div>
          </Link>

          {/* Navigation Section */}
          <nav className="flex items-center gap-1.5 sm:gap-3">
            <Link
              to="/"
              className="hidden rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 transition hover:bg-white/5 hover:text-blue-400 sm:inline-flex"
            >
              {t.nav.catalogue}
            </Link>

            {/* Payment Methods Button */}
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(true)}
              className="rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 transition hover:bg-white/5 hover:text-blue-400"
            >
              {t.nav.payment}
            </button>

            <button
              type="button"
              onClick={() => setIsBranchModalOpen(true)}
              className="rounded-md px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-400 transition hover:bg-white/5 hover:text-blue-400"
            >
              {t.nav.branches}
            </button>

            {/* WhatsApp Contact Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              // Modified classes: Added 'relative', changed bg to solid emerald-600, added ring pulse
              className="relative flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-emerald-500 active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              {/* The Replacement: This span creates a pulse that radiates from the whole button */}
              <span className="absolute inset-0 rounded-md bg-emerald-500 opacity-40 animate-ping"></span>

              {/* Icon (Optional: Add a WhatsApp icon here for better recognition) */}
              {/* WhatsApp Contact Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                // Increased px for better balance with the icon
                className="relative flex items-center gap-2 rounded-md bg-emerald-600 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-emerald-500 active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                {/* The Replacement: Full-button Pulse */}
                <span className="absolute inset-0 rounded-md bg-emerald-500 opacity-40 animate-ping"></span>

                {/* WhatsApp Icon */}
                <span className="relative z-10">
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </span>

                {/* Button Text */}
                <span className="relative z-10 hidden xs:inline">{t.nav.contact}</span>
              </a>            </a>

            {/* Language Switcher */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="relative flex items-center gap-2 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-[11px] font-black tracking-widest text-zinc-200 transition-all hover:border-blue-500/50 hover:bg-zinc-800 active:scale-95"
            >
              <span className={!isArabic ? "text-blue-400" : "opacity-40"}>EN</span>
              <span className="h-2 w-px bg-zinc-700" />
              <span className={isArabic ? "text-blue-400" : "opacity-40"}>AR</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Modals */}
      <BranchListModal
        isOpen={isBranchModalOpen}
        onClose={() => setIsBranchModalOpen(false)}
      />

      <PaymentMethodsModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </>
  );
}
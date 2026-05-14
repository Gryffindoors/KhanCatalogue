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
              className="flex items-center gap-2 rounded-md border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 active:scale-95"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="hidden xs:inline">{t.nav.contact}</span>
            </a>

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
import { useEffect, useMemo, useState } from "react";
import { useUI } from "../context/UIContext";

const PRICE_MIN_TOLERANCE = 0.95;
const PRICE_MAX_TOLERANCE = 1.05;

/**
 * Standardizes Arabic/Persian digits to Western (0-9)
 */
function normalizeDigits(value) {
  if (value === null || value === undefined) return "";
  return String(value)
    .replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    .replace(/[۰-۹]/g, (digit) => "۰۱۲۳۴٥٦٧٨٩".indexOf(digit));
}

/**
 * Prepares text for comparison: lowcase, trimmed, and normalized digits
 */
function normalizeText(value) {
  return normalizeDigits(value)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Robust Egyptian price parser: handles thousands separators (dots/commas) 
 */
function parsePriceInput(value) {
  const normalized = normalizeDigits(value).trim().replace(/,/g, "");
  if (!normalized) return null;

  const thousandsDotPattern = /^\d{1,3}(\.\d{3})+$/;
  const cleaned = thousandsDotPattern.test(normalized)
    ? normalized.replace(/\./g, "")
    : normalized;

  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

/**
 * ProductFilters: Optimized for performance with large datasets
 * Includes debouncing and multi-language support (AR/EN)
 */
export default function ProductFilters({ products = [], onResultsChange }) {
  const { t, language } = useUI();
  const [isExpanded, setIsExpanded] = useState(false);

  // Core Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const isArabic = language === "ar";

  // Debounce search term to prevent re-calculating on every single keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Extract unique options for dropdowns
  const categoryOptions = useMemo(() => 
    Array.from(new Set(products.map((p) => p.category).filter(Boolean))).sort(),
    [products]
  );

  const brandOptions = useMemo(() => 
    Array.from(new Set(products.map((p) => p.brand).filter(Boolean))).sort(),
    [products]
  );

  // Optimized Filter logic: Exit early on fast checks before doing expensive string searching
  const filteredProducts = useMemo(() => {
    const searchWords = normalizeText(debouncedSearch).split(" ").filter(Boolean);
    const parsedMin = parsePriceInput(minPrice);
    const parsedMax = parsePriceInput(maxPrice);
    
    const effMin = parsedMin === null ? null : parsedMin * PRICE_MIN_TOLERANCE;
    const effMax = parsedMax === null ? null : parsedMax * PRICE_MAX_TOLERANCE;

    return products.filter((product) => {
      // 1. Category/Brand checks (Fastest)
      if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
      if (selectedBrand !== "all" && product.brand !== selectedBrand) return false;

      // 2. Price Boundary checks
      const pPrice = Number(product.price || 0);
      if (effMin !== null && pPrice < effMin) return false;
      if (effMax !== null && pPrice > effMax) return false;

      // 3. Search Matching (Expensive String Ops)
      if (searchWords.length > 0) {
        const searchableText = normalizeText(
          `${product.id || ""} ${product.name || ""} ${product.brand || ""} ${product.category || ""}`
        );
        if (!searchWords.every((word) => searchableText.includes(word))) return false;
      }

      return true;
    });
  }, [products, debouncedSearch, selectedCategory, selectedBrand, minPrice, maxPrice]);

  // Update parent only when the calculated result changes
  useEffect(() => {
    onResultsChange(filteredProducts);
  }, [filteredProducts, onResultsChange]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedBrand("all");
    setMinPrice("");
    setMaxPrice("");
  };

  const filterFields = [
    { 
      label: t.categories.all, 
      val: selectedCategory, 
      set: setSelectedCategory, 
      opt: categoryOptions, 
      def: t.categories.all 
    },
    { 
      label: t.filters.brand, 
      val: selectedBrand, 
      set: setSelectedBrand, 
      opt: brandOptions, 
      def: isArabic ? "كل الشركات" : "All Brands" 
    }
  ];

  const priceFields = [
    { label: isArabic ? "أقل سعر" : "Min", val: minPrice, set: setMinPrice },
    { label: isArabic ? "أعلى سعر" : "Max", val: maxPrice, set: setMaxPrice }
  ];

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_50px_-12px_rgba(59,130,246,0.15)] transition-all duration-500">
      <div className="absolute top-0 left-0 h-0.5 w-full bg-linear-to-r from-transparent via-blue-600 to-transparent opacity-50" />

      {/* Mobile Toggle Bar */}
      <div className="flex items-center justify-between p-4 lg:hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex flex-1 items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-left outline-none transition-all active:scale-95"
        >
          <div className={`h-2 w-2 rounded-full ${isExpanded ? 'bg-blue-500 animate-pulse' : 'bg-zinc-600'}`} />
          <span className="font-mono text-xs font-black uppercase tracking-widest text-zinc-400">
            {isExpanded ? (isArabic ? "إغلاق التصفية" : "Close Filters") : (isArabic ? "بدء البحث والتصفية" : "Initialize Search")}
          </span>
          <svg
            className={`ml-auto h-4 w-4 text-zinc-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-250 opacity-100' : 'max-h-0 opacity-0 lg:max-h-250 lg:opacity-100'} overflow-hidden`}>
        <div className="p-6 pt-0 lg:pt-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
            
            {/* Unified Search Field */}
            <div className="md:col-span-2 lg:col-span-2">
              <label className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-500/80">
                <span className="h-1 w-3 rounded-full bg-blue-600 animate-pulse" />
                {t.placeholders.search}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t.placeholders.search}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500 focus:bg-black focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
              />
            </div>

            {/* Dropdowns */}
            {filterFields.map((item, idx) => (
              <div key={idx}>
                <label className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  {item.label}
                </label>
                <div className="relative">
                  <select
                    value={item.val}
                    onChange={(e) => item.set(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white focus:border-blue-500 focus:bg-black outline-none cursor-pointer transition-all"
                  >
                    <option value="all">{item.def}</option>
                    {item.opt.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-zinc-600">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>
            ))}

            {/* Numeric Price Range */}
            <div className="grid grid-cols-2 gap-3 lg:col-span-2">
              {priceFields.map((price, idx) => (
                <div key={idx}>
                  <label className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 block">
                    {price.label}
                  </label>
                  <div className="group relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={price.val}
                      onChange={(e) => price.set(e.target.value)}
                      placeholder="0.00"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 font-mono text-sm text-blue-400 placeholder:text-zinc-800 focus:border-blue-500 focus:bg-black outline-none transition-all"
                    />
                    <span className="absolute right-3 top-3 text-[10px] font-mono text-zinc-700">EGP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Controls */}
          <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-5">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Inventory Sync</span>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                <p className="text-xs font-mono font-bold text-zinc-200 uppercase">
                  {isArabic ? "نتائج:" : "Items Found:"} <span className="text-blue-500">{filteredProducts.length}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="group relative flex items-center gap-2 overflow-hidden rounded-lg bg-white px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] text-black transition-all hover:bg-zinc-200 active:scale-95"
            >
              <span className="relative z-10">{t.filters.reset}</span>
              <span className="relative z-10 transition-transform duration-500 group-hover:rotate-180">↺</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
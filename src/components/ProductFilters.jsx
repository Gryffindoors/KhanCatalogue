import { useEffect, useMemo, useState } from "react";
import { useUI } from "../context/UIContext";

const PRICE_MIN_TOLERANCE = 0.95;
const PRICE_MAX_TOLERANCE = 1.05;

function normalizeDigits(value) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replace(/[٠-٩]/g, (digit) => "٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    .replace(/[۰-۹]/g, (digit) => "۰۱۲۳۴۵۶۷۸۹".indexOf(digit));
}

function normalizeText(value) {
  return normalizeDigits(value)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

function parsePriceInput(value) {
  const normalized = normalizeDigits(value)
    .trim()
    .replace(/,/g, "");

  if (!normalized) return null;

  /*
    Handles common Egyptian price writing:
    9999
    9,999
    9.999  => treated as 9999
    10000
  */
  const thousandsDotPattern = /^\d{1,3}(\.\d{3})+$/;

  const cleaned = thousandsDotPattern.test(normalized)
    ? normalized.replace(/\./g, "")
    : normalized;

  const number = Number(cleaned);

  return Number.isFinite(number) ? number : null;
}

function matchesSearch(product, searchTerm) {
  const normalizedSearch = normalizeText(searchTerm);

  if (!normalizedSearch) return true;

  const searchWords = normalizedSearch.split(" ").filter(Boolean);

  const searchableText = normalizeText(
    [
      product.id,
      product.name,
      product.brand,
      product.category,
      product.price,
    ].join(" ")
  );

  return searchWords.every((word) => searchableText.includes(word));
}

function getUniqueOptions(products, key) {
  return Array.from(
    new Set(
      products
        .map((product) => product[key])
        .filter(Boolean)
        .map((value) => String(value).trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b));
}

export default function ProductFilters({ products = [], onResultsChange }) {
  const { t, language } = useUI();
  const [isExpanded, setIsExpanded] = useState(false); // Collapsible State

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const categoryOptions = useMemo(() => getUniqueOptions(products, "category"), [products]);
  const brandOptions = useMemo(() => getUniqueOptions(products, "brand"), [products]);

  const filteredProducts = useMemo(() => {
    const parsedMinPrice = parsePriceInput(minPrice);
    const parsedMaxPrice = parsePriceInput(maxPrice);
    const effectiveMinPrice = parsedMinPrice === null ? null : parsedMinPrice * PRICE_MIN_TOLERANCE;
    const effectiveMaxPrice = parsedMaxPrice === null ? null : parsedMaxPrice * PRICE_MAX_TOLERANCE;

    return products.filter((product) => {
      const productPrice = Number(product.price || 0);
      return (
        matchesSearch(product, searchTerm) &&
        (selectedCategory === "all" || product.category === selectedCategory) &&
        (selectedBrand === "all" || product.brand === selectedBrand) &&
        (effectiveMinPrice === null || productPrice >= effectiveMinPrice) &&
        (effectiveMaxPrice === null || productPrice <= effectiveMaxPrice)
      );
    });
  }, [products, searchTerm, selectedCategory, selectedBrand, minPrice, maxPrice]);

  useEffect(() => { onResultsChange(filteredProducts); }, [filteredProducts, onResultsChange]);

  const resetFilters = () => {
    setSearchTerm(""); setSelectedCategory("all"); setSelectedBrand("all"); setMinPrice(""); setMaxPrice("");
  };

  const isArabic = language === "ar";

  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_50px_-12px_rgba(59,130,246,0.15)] transition-all duration-500">
      <div className="absolute top-0 left-0 h-0.5 w-full bg-linear-to-r from-transparent via-blue-600 to-transparent opacity-50" />

      {/* MOBILE TRIGGER BAR: Always visible on mobile, hidden on lg desktop if you prefer */}
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

      {/* COLLAPSIBLE CONTENT */}
      <div
        className={`transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-250 opacity-100' : 'max-h-0 opacity-0 lg:max-h-250 lg:opacity-100'} overflow-hidden`}
      >
        <div className="p-6 pt-0 lg:pt-6">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-6">
            {/* Search Field */}
            <div className="md:col-span-2 lg:col-span-2">
              <label className="mb-2 flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.2em] text-blue-500/80">
                <span className="h-1 w-3 rounded-full bg-blue-600 animate-pulse" />
                {t.placeholders.search}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(normalizeDigits(e.target.value))}
                placeholder={t.placeholders.search}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-blue-500 focus:bg-black focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
              />
            </div>

            {/* Dropdowns */}
            {[
              { label: t.categories.all, val: selectedCategory, set: setSelectedCategory, opt: categoryOptions, def: t.categories.all },
              { label: t.filters.brand, val: selectedBrand, set: setSelectedBrand, opt: brandOptions, def: isArabic ? "كل الشركات" : "All Brands" }
            ].map((item, idx) => (
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

            {/* Price Inputs */}
            <div className="grid grid-cols-2 gap-3 lg:col-span-2">
              {[
                { label: isArabic ? "أقل سعر" : "Min", val: minPrice, set: setMinPrice },
                { label: isArabic ? "أعلى سعر" : "Max", val: maxPrice, set: setMaxPrice }
              ].map((price, idx) => (
                <div key={idx}>
                  <label className="mb-2 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500 block">
                    {price.label}
                  </label>
                  <div className="group relative">
                    <input
                      type="text"
                      inputMode="numeric"
                      value={price.val}
                      onChange={(e) => price.set(normalizeDigits(e.target.value))}
                      placeholder="0.00"
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-3 font-mono text-sm text-blue-400 placeholder:text-zinc-800 focus:border-blue-500 focus:bg-black outline-none transition-all"
                    />
                    <span className="absolute right-3 top-3 text-[10px] font-mono text-zinc-700">EGP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Details */}
          <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-5">
            <div className="flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">System Status</span>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  <p className="text-xs font-mono font-bold text-zinc-200">
                    {isArabic ? "نتائج:" : "ITEMS FOUND:"} <span className="text-blue-500">{filteredProducts.length}</span>
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="group relative flex items-center gap-2 overflow-hidden rounded-lg bg-white px-5 py-2.5 text-[11px] font-black uppercase tracking-[0.15em] text-black transition-all hover:ring-2 hover:ring-white/20 active:scale-95"
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
import { useCallback, useMemo, useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useUI } from "../context/UIContext";
import ProductFilters from "../components/ProductFilters";
import ProductCard from "../components/ProductCard";
import ScrollContainer from "../hooks/scrollContainer";

const PRODUCTS_PER_PAGE = 24;

export default function CataloguePage() {
  const { t, language } = useUI();
  const { products, loading, error } = useProducts();
  const [visibleProducts, setVisibleProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const isArabic = language === "ar";

  const totalPages = Math.max(1, Math.ceil(visibleProducts.length / PRODUCTS_PER_PAGE));

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return visibleProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [visibleProducts, currentPage]);

  const handleResultsChange = useCallback((results) => {
    setVisibleProducts(results);
    setCurrentPage(1);
  }, []);

  const goToPage = (page) => {
    const safePage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(safePage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-zinc-500 animate-pulse">
            {isArabic ? "جاري مزامنة البيانات..." : "Syncing System Data..."}
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-black p-6">
        <div className="mx-auto max-w-7xl rounded-xl border border-red-500/20 bg-red-500/5 p-8 text-center">
          <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500 text-xl font-bold">!</div>
          <p className="font-mono text-sm text-red-400 uppercase tracking-widest">{error}</p>
        </div>
      </main>
    );
  }

  return (
      <main className="min-h-screen bg-black px-4 py-8 md:px-8 custom-scrollbar">
        <div className="mx-auto max-w-7xl">

          {/* Header Section: Minimal & Technical */}
          <header className="mb-8 border-l-2 border-blue-600 pl-4 rtl:border-l-0 rtl:border-r-2 rtl:pr-4">
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white sm:text-4xl">
              {t.catalogue.title}
            </h1>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              {t.catalogue.subtitle}
            </p>
          </header>
          {/* Filter Toolbar Component */}
          <ProductFilters products={products} onResultsChange={handleResultsChange} />

          {/* Results Counter / Secondary Status Bar */}
          <div className="mt-8 mb-4 flex items-center justify-between border-b border-zinc-900 pb-2">
            {/* <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Active Listing</span>
            <span className="h-1 w-1 rounded-full bg-zinc-800" />
            <span className="font-mono text-xs text-blue-400">{visibleProducts.length}</span>
          </div> */}
            <div className="font-mono text-[10px] text-zinc-600 uppercase">
              {isArabic ? "الصفحة" : "Page"} {currentPage} / {totalPages}
            </div>
          </div>

          {/* Product Grid */}
          {paginatedProducts.length > 0 ? (
            <>
              <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </section>

              {/* Pagination: Technical Command Center Style */}
              {totalPages > 1 && (
                <footer className="mt-16 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-10 rounded-lg border border-zinc-800 bg-zinc-950 px-4 text-[11px] font-black uppercase tracking-widest text-zinc-400 transition hover:border-blue-500 hover:text-white disabled:opacity-20"
                  >
                    {isArabic ? "« السابق" : "« Prev"}
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                      .map((page, idx, pages) => (
                        <div key={page} className="flex items-center gap-2">
                          {idx > 0 && page - pages[idx - 1] > 1 && <span className="text-zinc-700">/</span>}
                          <button
                            onClick={() => goToPage(page)}
                            className={`h-10 w-10 rounded-lg border text-[11px] font-black transition-all ${page === currentPage
                              ? "border-blue-500 bg-blue-500/10 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]"
                              : "border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-600"
                              }`}
                          >
                            {String(page).padStart(2, '0')}
                          </button>
                        </div>
                      ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-10 rounded-lg border border-zinc-800 bg-zinc-950 px-4 text-[11px] font-black uppercase tracking-widest text-zinc-400 transition hover:border-blue-500 hover:text-white disabled:opacity-20"
                  >
                    {isArabic ? "التالي »" : "Next »"}
                  </button>
                </footer>
              )}
            </>
          ) : (
            <section className="mt-20 py-20 text-center border-2 border-dashed border-zinc-900 rounded-3xl">
              <div className="mb-4 inline-block text-zinc-800">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <p className="font-mono text-sm uppercase tracking-[0.3em] text-zinc-600">
                {t.placeholders.noResults}
              </p>
            </section>
          )}
        </div>
      </main >
  );
}
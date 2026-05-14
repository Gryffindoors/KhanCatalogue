import { useState, useMemo, useEffect } from "react";
import { Link, useParams } from "react-router";
import { useProductDetails } from "../hooks/useProductDetails";
import { useUI } from "../context/UIContext";
import OrderModal from "../components/OrderModal";

function formatPrice(price, language) {
  return Number(price || 0).toLocaleString(language === "ar" ? "ar-EG" : "en-US");
}

// Sub-component for loading state to improve scannability
const SkeletonLoader = () => (
  <div className="mx-auto max-w-7xl animate-pulse p-8">
    <div className="grid gap-10 lg:grid-cols-[1fr_450px]">
      <div className="aspect-video rounded-2xl bg-zinc-900" />
      <div className="space-y-4">
        <div className="h-4 w-1/4 bg-zinc-900" />
        <div className="h-8 w-3/4 bg-zinc-900" />
        <div className="h-12 w-1/2 bg-zinc-900" />
      </div>
    </div>
  </div>
);

export default function ProductDetailsPage() {
  const { id } = useParams();
  const { t, language } = useUI();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const { product, loading, error } = useProductDetails(id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const isArabic = language === "ar";

  const images = useMemo(() => {
    if (!product) return [];
    if (Array.isArray(product.images) && product.images.length > 0) return product.images;
    return product.thumbnail ? [product.thumbnail] : [];
  }, [product]);

  // Background preload for other images once the main one is likely handled
  useEffect(() => {
    if (images.length > 1) {
      images.forEach((src, idx) => {
        if (idx !== activeImageIndex) {
          const img = new Image();
          img.src = src;
        }
      });
    }
  }, [images]);

  if (loading) return <main className="min-h-screen bg-black"><SkeletonLoader /></main>;
  if (error) return <div className="min-h-screen bg-black text-red-500 p-10">{error}</div>;
  if (!product) return <div className="min-h-screen bg-black text-white p-10">Product not found</div>;

  const description = product.description?.[language] || product.description?.en || "";
  const specs = product.specs?.[language] || product.specs?.en || [];

  return (
    <main className="min-h-screen bg-black px-4 py-6 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6">
          <Link to="/" className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 hover:text-blue-500 transition-colors">
            {isArabic ? `الرئيسية` : `Home Page`}
          </Link>
        </div>

        <section className="grid gap-10 lg:grid-cols-[1fr_450px] xl:grid-cols-[1fr_500px]">
          {/* Visualizer Block */}
          <div className="space-y-6">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/5 bg-[#050505] flex items-center justify-center p-8 md:p-12">
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

              {images.length > 0 ? (
                <img
                  src={images[activeImageIndex]}
                  alt={product.name}
                  // Performance: High priority for the main LCP image
                  fetchpriority="high"
                  loading="eager"
                  className="relative z-10 max-h-full max-w-full object-contain transition-opacity duration-300"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 opacity-20">
                  <div className="h-20 w-20 rounded-full border border-dashed border-blue-500 animate-spin" style={{ animationDuration: '20s' }} />
                  <span className="font-mono text-[9px] uppercase tracking-widest text-blue-500">{t.product.noImage}</span>
                </div>
              )}
            </div>

            {/* Carousel: Optimized with lazy loading */}
            {images.length > 1 && (
              <div className="flex flex-wrap gap-3 justify-center">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative h-16 w-16 overflow-hidden rounded-lg border transition-all ${
                      activeImageIndex === idx ? "border-blue-500 ring-2 ring-blue-500/20" : "border-zinc-800 bg-zinc-950 opacity-40 hover:opacity-100"
                    }`}
                  >
                    <img 
                        src={img} 
                        loading="lazy" 
                        className="h-full w-full object-cover" 
                        alt={`Thumbnail ${idx}`} 
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Hidden on mobile, secondary content below images */}
            {description && (
              <div className="hidden lg:block mt-12 border-t border-white/5 pt-8">
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">{t.product.description}</h2>
                <p className="text-sm leading-relaxed text-zinc-400 font-medium max-w-2xl">{description}</p>
              </div>
            )}
          </div>

          {/* Info Block */}
          <div className="flex flex-col">
            <header className="mb-6">
              <div className="mb-2 inline-flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">
                  {product.brand}
                </span>
                <span className="h-1 w-1 rounded-full bg-zinc-800" />
                <span className="font-mono text-[9px] text-zinc-600 uppercase">REF_ID: {product.id}</span>
              </div>

              <h1 className="text-lg font-bold leading-tight text-white md:text-xl uppercase tracking-tight">
                {product.name}
              </h1>

              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-mono text-3xl font-black tracking-tighter text-white">
                  {formatPrice(product.price, language)}
                </span>
                <span className="text-xs font-bold text-zinc-500 uppercase">{isArabic ? "ج.م" : "EGP"}</span>
              </div>
            </header>

            <div className="space-y-1.5 border-t border-white/5 pt-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600 mb-4">{t.product.specs}</h3>
              {specs.map((spec, i) => (
                <div key={i} className="flex items-start gap-3 py-1">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue-600" />
                  <span className="text-sm font-medium text-zinc-200 leading-tight tracking-tight">{spec}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 space-y-4">
              <button
                onClick={() => setIsOrderModalOpen(true)}
                className="w-full rounded-xl bg-blue-600 py-4 text-xs font-black uppercase tracking-[0.2em] text-white active:scale-95 shadow-[0_20px_40px_-12px_rgba(59,130,246,0.4)]"
              >
                {t.actions.order}
              </button>

              <div className="rounded-xl border border-zinc-900 bg-zinc-950/50 p-5">
                <ul className="space-y-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 leading-relaxed italic">
                  <li>• {t.notes.newWarranty}</li>
                  <li>• {t.notes.priceValidity}</li>
                  <li>• {t.notes.cashPolicy}</li>
                </ul>
              </div>
            </div>

            {description && (
              <div className="mt-10 block lg:hidden border-t border-white/5 pt-8">
                <h2 className="text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">{t.product.description}</h2>
                <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <OrderModal product={product} isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} />
    </main>
  );
}
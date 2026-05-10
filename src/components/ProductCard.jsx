// Updated ProductCard with Schematic Placeholder
import { useState } from "react";
import { Link } from "react-router";
import { useUI } from "../context/UIContext";

export default function ProductCard({ product }) {
  const { t, language } = useUI();
  const isArabic = language === "ar";

  const [imageError, setImageError] = useState(false);

  const hasValidImage = product.thumbnail && !imageError;

  const formattedPrice = Number(product.price || 0).toLocaleString(
    isArabic ? "ar-EG" : "en-US"
  );

  return (
    <article className="group relative overflow-hidden rounded-xl border border-white/5 bg-zinc-950 transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]">
      <div className="absolute left-0 top-0 h-px w-0 bg-blue-500 transition-all duration-500 group-hover:w-full" />

      <Link to={`/product/${product.id}`} className="block">
        <div className="relative flex h-52 items-center justify-center overflow-hidden bg-[#050505] p-6">
          {/* Carbon Fiber Overlay */}
          <div className="pointer-events-none absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />

          {/* Product Image */}
          {hasValidImage ? (
            <img
              src={product.thumbnail}
              alt={product.name || "Product image"}
              className="relative z-10 max-h-full max-w-full object-contain"
              onError={() => setImageError(true)}
            />
          ) : (
            /* Schematic Placeholder */
            <div className="flex animate-pulse flex-col items-center justify-center">
              <div className="relative mb-2 h-16 w-16">
                {/* Schematic Rings */}
                <div className="absolute inset-0 rounded-full border border-blue-500/30" />
                <div className="absolute inset-2 scale-110 rounded-full border border-blue-500/10" />

                {/* CPU Icon */}
                <svg
                  className="absolute inset-0 m-auto h-8 w-8 text-blue-500/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                  />
                </svg>
              </div>

              <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-white">
                Thumbanail_Missing
              </span>
            </div>
          )}

          {/* ID Badge */}
          <div className="absolute bottom-2 right-2 rounded border border-white/5 bg-black/60 px-1.5 py-0.5 font-mono text-[9px] text-zinc-500 backdrop-blur-md">
            ID: {String(product.id || "").slice(-6).toUpperCase()}
          </div>
        </div>

        <div className="p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="border border-blue-500/30 bg-blue-500/5 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-blue-400">
              {product.brand}
            </span>

            <span className="border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider text-zinc-500">
              {product.category}
            </span>
          </div>

          <h2 className="line-clamp-2 min-h-5 text-[13px] font-bold leading-tight text-zinc-100 transition-colors group-hover:text-white">
            {product.name}
          </h2>

          <div className="mt-4 flex items-end justify-between border-t border-white/5 pt-4">
            <div>
              <p className="mb-1 text-[10px] font-black uppercase leading-none tracking-widest text-zinc-600">
                {t.product.price}
              </p>

              <p className="font-mono text-lg font-black tracking-tighter text-blue-400">
                {formattedPrice}{" "}
                <span className="text-[10px] font-normal opacity-60">
                  {isArabic ? "ج.م" : "EGP"}
                </span>
              </p>
            </div>

            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 transition-all group-hover:border-blue-500 group-hover:bg-blue-500/10 group-hover:text-blue-400">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isArabic ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
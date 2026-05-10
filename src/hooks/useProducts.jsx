import { useCallback, useEffect, useState } from "react";
import { getCatalogueProducts } from "../services/productsApi";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [version, setVersion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCatalogueProducts();

      setProducts(data.items);
      setVersion(data.version);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return {
    products,
    version,
    loading,
    error,
    refreshProducts: loadProducts,
  };
}
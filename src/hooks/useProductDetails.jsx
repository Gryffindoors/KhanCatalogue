import { useCallback, useEffect, useState } from "react";
import { getProductById } from "../services/productsApi";

export function useProductDetails(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");

  const loadProduct = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError("");

      const data = await getProductById(id);

      setProduct(data);
    } catch (err) {
      setProduct(null);
      setError(err.message || "Failed to load product details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  return {
    product,
    loading,
    error,
    refreshProduct: loadProduct,
  };
}
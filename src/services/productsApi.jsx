import { API_CONFIG } from "../config/apiConfig";
import { checkAppVersions } from "../utils/versionControl";
import {
  normalizeCatalogueProduct,
  normalizeProductDetails,
} from "../utils/normalizeProduct";
import { prioritizeProductsWithThumbnails } from "../utils/productPriority";

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`);
  }

  return response.json();
}

export async function getCatalogueProducts() {
  const data = await fetchJson(API_CONFIG.CATALOGUE_BASE_URL);

  checkAppVersions(data?.version);

  const rawItems = Array.isArray(data?.items) ? data.items : [];

  const normalizedItems = rawItems.map(normalizeCatalogueProduct);

  return {
    version: data?.version ?? null,
    items: prioritizeProductsWithThumbnails(normalizedItems),
  };
}

export async function getProductById(id) {
  if (!id) {
    throw new Error("Product ID is required");
  }

  const url = `${API_CONFIG.CATALOGUE_BASE_URL}?id=${encodeURIComponent(id)}`;

  const data = await fetchJson(url);

  return normalizeProductDetails(data);
}

// Add to your API file
export async function getInstallmentPartners() {
  const url = `${API_CONFIG.CATALOGUE_BASE_URL}?type=installments`;
  return await fetchJson(url);
}
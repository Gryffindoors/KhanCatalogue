function toStringValue(value) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function toNumberValue(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function toArrayValue(value) {
  return Array.isArray(value) ? value.filter(Boolean) : [];
}

function normalizeBrand(value) {
  const brand = toStringValue(value);

  if (!brand) return "Unknown";

  return brand;
}

function normalizeCategory(value) {
  const category = toStringValue(value);

  if (!category) return "Other";

  return category;
}

function normalizeThumbnail(value) {
  const thumbnail = toStringValue(value);

  return {
    thumbnail,
    hasThumbnail: thumbnail !== "",
  };
}

export function normalizeCatalogueProduct(product) {
  const { thumbnail, hasThumbnail } = normalizeThumbnail(product?.thumbnail);

  return {
    id: toStringValue(product?.id),
    name: toStringValue(product?.name),
    price: toNumberValue(product?.price),
    category: normalizeCategory(product?.category),
    brand: normalizeBrand(product?.brand),
    thumbnail,
    hasThumbnail,
  };
}

export function normalizeProductDetails(product) {
  const { thumbnail, hasThumbnail } = normalizeThumbnail(product?.thumbnail);

  return {
    id: toStringValue(product?.id),
    name: toStringValue(product?.name),
    price: toNumberValue(product?.price),
    brand: normalizeBrand(product?.brand),

    thumbnail,
    hasThumbnail,
    images: toArrayValue(product?.images),

    description: {
      en: toStringValue(product?.desc_en),
      ar: toStringValue(product?.desc_ar),
    },

    specs: {
      en: toArrayValue(product?.specs_en),
      ar: toArrayValue(product?.specs_ar),
    },

    link: toStringValue(product?.link),
  };
}
export function prioritizeProductsWithThumbnails(products) {
  if (!Array.isArray(products)) return [];

  return products
    .map((product) => {
      const thumbnail = String(
        product.thumbnail ||
          product.Thumbnail ||
          product.thumbnailUrl ||
          product.image ||
          product.imageUrl ||
          product.mainImage ||
          ""
      ).trim();

      return {
        ...product,
        thumbnail,
        hasThumbnail: Boolean(thumbnail),
      };
    })
    .sort((a, b) => {
      if (a.hasThumbnail && !b.hasThumbnail) return -1;
      if (!a.hasThumbnail && b.hasThumbnail) return 1;

      return 0;
    });
}
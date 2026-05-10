function formatPrice(price) {
  return Number(price || 0).toLocaleString("en-US");
}

function getTodayDate() {
  return new Date().toLocaleDateString("en-GB");
}

export function buildOrderMessage({ product, customerName, customerPhone, branch, language }) {
  const branchName = language === "ar" ? branch.nameAr : branch.nameEn;
  const branchHours = language === "ar" ? branch.workingHoursAr : branch.workingHoursEn;

  if (language === "ar") {
    return [
      "طلب / استفسار عن منتج",
      "",
      `اسم العميل: ${customerName}`,
      `رقم الهاتف: ${customerPhone}`,
      `أقرب فرع: ${branchName}`,
      `مواعيد الفرع: ${branchHours}`,
      "",
      `كود المنتج: ${product.id}`,
      `اسم المنتج: ${product.name}`,
      `السعر: ${formatPrice(product.price)} ج.م`,
      "",
      `تاريخ الطلب: ${getTodayDate()}`,
    ].join("\n");
  }

  return [
    "Product Order / Enquiry",
    "",
    `Customer Name: ${customerName}`,
    `Customer Phone: ${customerPhone}`,
    `Nearest Branch: ${branchName}`,
    `Branch Hours: ${branchHours}`,
    "",
    `Product ID: ${product.id}`,
    `Product Name: ${product.name}`,
    `Price: ${formatPrice(product.price)} EGP`,
    "",
    `Order Date: ${getTodayDate()}`,
  ].join("\n");
}

export function buildWhatsAppUrl(phone, message) {
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
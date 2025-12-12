// app/services/inventoryService.ts
import { CLOTHING_CATALOG } from "../try-on/page";

export function getAllProducts() {
  return CLOTHING_CATALOG;
}

export function getByCategory(category: string) {
  return CLOTHING_CATALOG.filter(item => item.category === category);
}

export function getProductById(id: string) {
  return CLOTHING_CATALOG.find(item => item.id === id) ?? null;
}

export function getLowStockProducts(minStock = 5) {
  // For now, fake stock number; later you can connect to DB.
  return CLOTHING_CATALOG.filter(item => (item as any).stock ?? 10 <= minStock);
}

export function searchProducts(query: string) {
  const q = query.toLowerCase();
  return CLOTHING_CATALOG.filter(
    item =>
      item.name.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
  );
}

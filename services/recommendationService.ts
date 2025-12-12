// app/services/recommendationService.ts
import { CLOTHING_CATALOG } from "../src/app/try-on/page";

export function getRecommendationsForItem(itemId: string, limit = 4) {
  const base = CLOTHING_CATALOG.find(item => item.id === itemId);
  if (!base) return [];

  const sameCategory = CLOTHING_CATALOG.filter(
    item =>
      item.id !== base.id &&
      item.category === base.category &&
      Math.abs(item.price - base.price) <= base.price * 0.4
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  // fill with others if not enough
  const others = CLOTHING_CATALOG.filter(
    item => item.id !== base.id && !sameCategory.includes(item)
  );

  return [...sameCategory, ...others].slice(0, limit);
}

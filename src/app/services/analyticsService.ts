// app/services/analyticsService.ts
import { CLOTHING_CATALOG } from "../try-on/page";
import { getOrders, Order } from "./orderService";

export function getCategoryCounts() {
  const map: Record<string, number> = {};
  CLOTHING_CATALOG.forEach(item => {
    map[item.category] = (map[item.category] ?? 0) + 1;
  });

  return Object.entries(map).map(([category, count]) => ({
    category,
    count,
  }));
}

export function getAveragePriceByCategory() {
  const map: Record<string, { total: number; count: number }> = {};

  CLOTHING_CATALOG.forEach(item => {
    const key = item.category;
    if (!map[key]) map[key] = { total: 0, count: 0 };
    map[key].total += item.price;
    map[key].count += 1;
  });

  return Object.entries(map).map(([category, data]) => ({
    category,
    avgPrice: +(data.total / data.count).toFixed(2),
  }));
}

export function getDailyRevenue() {
  const orders = getOrders();
  const daily: Record<string, number> = {};

  orders.forEach((order: Order) => {
    const day = order.createdAt.slice(0, 10); // YYYY-MM-DD
    daily[day] = (daily[day] ?? 0) + order.total;
  });

  return Object.entries(daily)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([date, total]) => ({
      date,
      total,
    }));
}

// app/services/orderService.ts

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  status: "pending" | "completed" | "cancelled";
}

const STORAGE_KEY = "vogue_orders";

export function getOrders(): Order[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Order[];
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
}

export function createOrder(items: OrderItem[]): Order {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const newOrder: Order = {
    id: "ORD-" + Math.random().toString(36).substring(2, 9).toUpperCase(),
    items,
    total,
    createdAt: new Date().toISOString(),
    status: "completed",
  };

  const existing = getOrders();
  existing.unshift(newOrder);
  saveOrders(existing);

  return newOrder;
}

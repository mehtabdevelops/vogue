// app/orders/page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { getOrders, Order } from "../../../services/orderService";

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        setOrders(getOrders());
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#120916] via-[#1a0b2a] to-[#270f32] text-white p-10">
            <h1 className="text-4xl font-bold mb-6">Your Orders</h1>
            {orders.length === 0 ? (
                <p className="text-gray-300">No orders placed yet.</p>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <div
                            key={order.id}
                            className="bg-white/10 border border-white/10 rounded-2xl p-6 shadow-lg"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <p className="text-sm text-gray-300">Order ID</p>
                                    <p className="font-semibold">{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-300">Date</p>
                                    <p className="font-semibold">
                                        {new Date(order.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-300">Total</p>
                                    <p className="font-semibold">${order.total.toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                {order.items.map(item => (
                                    <div
                                        key={item.id}
                                        className="flex justify-between text-sm text-gray-200"
                                    >
                                        <span>{item.name}</span>
                                        <span>
                                            {item.quantity} × ${item.price.toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

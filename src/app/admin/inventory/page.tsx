// app/admin/inventory/page.tsx
"use client";

import React, { useMemo, useState } from "react";
import { getAllProducts, searchProducts, getByCategory } from "../../../../services/inevntoryService";

const categories = ["all", "tops", "bottoms", "dresses", "outerwear", "accessories"];

export default function AdminInventoryPage() {
    const [activeCategory, setActiveCategory] = useState("all");
    const [query, setQuery] = useState("");

    const products = useMemo(() => {
        if (query.trim()) {
            return searchProducts(query);
        }
        if (activeCategory === "all") return getAllProducts();
        return getByCategory(activeCategory);
    }, [activeCategory, query]);

    return (
        <div className="min-h-screen bg-[#070410] text-white p-10">
            <h1 className="text-4xl font-bold mb-6">Inventory Dashboard</h1>

            <div className="flex flex-wrap gap-4 mb-6">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-4 py-2 rounded-full text-sm border ${activeCategory === cat
                                ? "bg-pink-500 border-pink-400"
                                : "border-white/20 bg-white/5"
                            }`}
                    >
                        {cat.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="mb-6">
                <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search by name, brand, category..."
                    className="w-full max-w-md px-4 py-2 rounded-lg bg-white/5 border border-white/20 outline-none"
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {products.map(product => (
                    <div
                        key={product.id}
                        className="bg-white/10 border border-white/10 rounded-xl p-4"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div
                                className="w-12 h-12 rounded-lg"
                                style={{ backgroundColor: product.thumbnailColor }}
                            />
                            <div>
                                <p className="font-semibold">{product.name}</p>
                                <p className="text-xs text-gray-300">{product.brand}</p>
                                <p className="text-xs text-gray-400">{product.category}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-300 mb-2">{product.description}</p>
                        <p className="text-sm">
                            <span className="font-semibold">${product.price.toFixed(2)}</span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

// app/analytics/page.tsx
"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  getCategoryCounts,
  getAveragePriceByCategory,
  getDailyRevenue,
} from "../services/analyticsService";

export default function AnalyticsPage() {
  const categoryData = getCategoryCounts();
  const priceData = getAveragePriceByCategory();
  const revenueData = getDailyRevenue();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#11071F] via-[#170B2B] to-[#210B38] text-white p-10 space-y-10">
      <h1 className="text-4xl font-bold">Vogue Analytics</h1>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl mb-4">Items per Category</h2>
        <div className="w-full h-72">
          <ResponsiveContainer>
            <BarChart data={categoryData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#FF4D9D" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl mb-4">Average Price by Category</h2>
        <div className="w-full h-72">
          <ResponsiveContainer>
            <BarChart data={priceData}>
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgPrice" fill="#4DD9FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-2xl mb-4">Daily Revenue (Local Only)</h2>
        <div className="w-full h-72">
          <ResponsiveContainer>
            <LineChart data={revenueData}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#A855F7" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

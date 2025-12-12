"use client";

import { useRouter } from "next/navigation";

export default function PaymentSuccess() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#1a0b15] to-[#54162b] text-white">
      <h1 className="text-5xl font-bold mb-4">🎉 Payment Successful</h1>
      <p className="text-gray-300 mb-6">
        Your order has been placed successfully.
      </p>

      <button
        onClick={() => router.push("/")}
        className="px-6 py-3 bg-white text-[#54162b] rounded-xl font-bold hover:bg-gray-100"
      >
        Back to Home
      </button>
    </div>
  );
}

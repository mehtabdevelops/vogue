"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function luhnCheck(num: string) {
  let sum = 0;
  let shouldDouble = false;

  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num[i]);
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  return sum % 10 === 0;
}

export default function PaymentPage() {
  const router = useRouter();
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handlePay = () => {
    if (!card || !expiry || !cvv || !name) {
      setError("All fields are required");
      return;
    }

    if (!luhnCheck(card.replace(/\s/g, ""))) {
      setError("Invalid card number");
      return;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry)) {
      setError("Expiry must be MM/YY");
      return;
    }

    if (!/^\d{3,4}$/.test(cvv)) {
      setError("Invalid CVV");
      return;
    }

    // ✅ Fake success
    setTimeout(() => {
      localStorage.removeItem("vogueCart");
      router.push("/payment-success");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0b15] to-[#54162b] text-white">
      <div className="w-full max-w-md bg-white/10 p-6 rounded-2xl border border-white/20">
        <h1 className="text-3xl font-bold mb-4">Secure Payment</h1>

        {error && <p className="text-red-400 mb-3">{error}</p>}

        <input
          placeholder="Cardholder Name"
          className="w-full p-3 mb-3 rounded bg-white/10"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          placeholder="Card Number"
          className="w-full p-3 mb-3 rounded bg-white/10"
          maxLength={19}
          onChange={(e) => setCard(e.target.value)}
        />
        <div className="flex gap-3">
          <input
            placeholder="MM/YY"
            className="w-1/2 p-3 rounded bg-white/10"
            onChange={(e) => setExpiry(e.target.value)}
          />
          <input
            placeholder="CVV"
            className="w-1/2 p-3 rounded bg-white/10"
            maxLength={4}
            onChange={(e) => setCvv(e.target.value)}
          />
        </div>

        <button
          onClick={handlePay}
          className="mt-6 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-bold hover:scale-105 transition"
        >
          Pay Now
        </button>

        <p className="text-xs text-gray-300 mt-4 text-center">
          Demo payment — no real charge will be made
        </p>
      </div>
    </div>
  );
}

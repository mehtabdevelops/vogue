'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type MeasureForm = {
  height: string;
  weight: string;
  chest: string;
  waist: string;
  hips: string;
  fitPreference: 'slim' | 'regular' | 'oversized' | '';
};

const MeasurePage = () => {
  const router = useRouter();
  const [form, setForm] = useState<MeasureForm>({
    height: '',
    weight: '',
    chest: '',
    waist: '',
    hips: '',
    fitPreference: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // super simple validation
    if (!form.height || !form.weight || !form.chest || !form.waist || !form.hips) {
      alert('Please fill in all measurements');
      return;
    }
    if (!form.fitPreference) {
      alert('Please choose a fit preference');
      return;
    }

    // later: save to backend / context / localStorage
    console.log('Measurements saved:', form);

    // go to avatar creation
    router.push('/avatar');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b15] via-[#2d1123] to-[#54162b] flex items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Body Measurements
          </h1>
          <p className="text-gray-300 text-sm">
            This helps Vogue suggest sizes and fits that actually match your body.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Height (cm)
            </label>
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="e.g. 178"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="e.g. 72"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Chest (cm)
            </label>
            <input
              type="number"
              name="chest"
              value={form.chest}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="e.g. 96"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Waist (cm)
            </label>
            <input
              type="number"
              name="waist"
              value={form.waist}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="e.g. 80"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Hips (cm)
            </label>
            <input
              type="number"
              name="hips"
              value={form.hips}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
              placeholder="e.g. 96"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Fit Preference
            </label>
            <select
              name="fitPreference"
              value={form.fitPreference}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/30"
            >
              <option value="">Choose one…</option>
              <option value="slim">Slim / Fitted</option>
              <option value="regular">Regular</option>
              <option value="oversized">Oversized / Relaxed</option>
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col md:flex-row justify-between items-center gap-3 mt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 rounded-lg border border-white/30 text-white text-sm hover:bg-white/10"
            >
              Back
            </button>

            <button
              type="submit"
              className="px-6 py-3 rounded-lg bg-white text-[#54162b] font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all text-sm"
            >
              Save & Continue to Avatar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MeasurePage;

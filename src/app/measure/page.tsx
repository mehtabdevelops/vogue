'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const MeasurePage = () => {
  const router = useRouter();
  const [measurements, setMeasurements] = useState({
    upperBody: '',
    waist: '',
    bottomLength: ''
  });

  const upperBodySizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const waistSizes = ['24', '26', '28', '30', '32', '34', '36', '38', '40', '42', '46'];
  const bottomLengths = ['Short (25-27")', 'Regular (28-30")', 'Long (31-33")', 'Extra Long (34+")'];

  const handleSizeChange = (category: string, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!measurements.upperBody || !measurements.waist || !measurements.bottomLength) {
      alert('Please select all measurements');
      return;
    }
    
    console.log('Measurements submitted:', measurements);
    alert('Your avatar measurements have been saved!');
    router.push('/avatar');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b15] via-[#2d1123] to-[#54162b] py-12 px-4">
      {/* Logo at Top Center */}
      <div className="flex justify-center mb-12">
        <img 
          src="/images/3.png" 
          alt="Vogue Logo" 
          className="h-40 w-auto object-contain" // Bigger logo
        />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Left Side - Avatar */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-8">
            <img 
              src="/images/m1.png" 
              alt="Your Avatar" 
              className="h-[500px] w-auto object-contain mx-auto rounded-lg"
            />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">
            Perfect Fit Avatar
          </h1>
          <p className="text-gray-300 text-lg">
            Select your measurements to create a perfectly fitted digital avatar
          </p>
        </div>

        {/* Right Side - Measurement Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Your Measurements</h2>
            <p className="text-gray-300">Choose your sizes for the perfect fit</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Upper Body Size */}
            <div>
              <label className="block text-xl font-semibold text-white mb-4">
                Upper Body Size
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {upperBodySizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeChange('upperBody', size)}
                    className={`py-3 px-4 rounded-lg border-2 transition-all font-semibold ${
                      measurements.upperBody === size
                        ? 'bg-white text-[#54162b] border-white'
                        : 'bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/40'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Waist Size */}
            <div>
              <label className="block text-xl font-semibold text-white mb-4">
                Waist Size (inches)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {waistSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeChange('waist', size)}
                    className={`py-3 px-4 rounded-lg border-2 transition-all font-semibold ${
                      measurements.waist === size
                        ? 'bg-white text-[#54162b] border-white'
                        : 'bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/40'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Length */}
            <div>
              <label className="block text-xl font-semibold text-white mb-4">
                Bottom Length
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {bottomLengths.map((length) => (
                  <button
                    key={length}
                    type="button"
                    onClick={() => handleSizeChange('bottomLength', length)}
                    className={`py-4 px-4 rounded-lg border-2 transition-all font-semibold text-left ${
                      measurements.bottomLength === length
                        ? 'bg-white text-[#54162b] border-white'
                        : 'bg-white/5 text-white border-white/20 hover:bg-white/10 hover:border-white/40'
                    }`}
                  >
                    {length}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Measurements Summary */}
            {measurements.upperBody && measurements.waist && measurements.bottomLength && (
              <div className="bg-white/5 rounded-lg p-4 border border-white/20">
                <h3 className="text-lg font-semibold text-white mb-2">Your Selected Measurements:</h3>
                <div className="text-gray-300 space-y-1">
                  <p>Upper Body: <span className="text-white font-semibold">{measurements.upperBody}</span></p>
                  <p>Waist: <span className="text-white font-semibold">{measurements.waist}"</span></p>
                  <p>Bottom Length: <span className="text-white font-semibold">{measurements.bottomLength}</span></p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-white text-[#54162b] py-4 px-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
            >
              Create My Perfect Fit Avatar
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full bg-transparent text-white py-3 px-4 rounded-lg font-semibold border-2 border-white/20 hover:bg-white/10 transition-all"
            >
              Back to Previous
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MeasurePage;
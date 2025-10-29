'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Avatar3DRenderer from '../components/Avatar3DRenderer'; // Temporarily commented out until component is created

// Types for avatar features
interface DetectedFeatures {
  faceShape: string;
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  hairLength: string;
  eyeColor: string;
  eyeShape: string;
  eyebrowShape: string;
  eyebrowThickness: string;
  noseShape: string;
  lipShape: string;
  lipColor: string;
  facialHair?: string;
  glasses?: boolean;
  age: string;
  gender: string;
}

interface AvatarData extends DetectedFeatures {
  bodyType: string;
  height: string;
  outfit: string;
  accessories: string[];
  expression: string;
}

const AvatarPage = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [avatarData, setAvatarData] = useState<AvatarData>({
    faceShape: 'oval',
    skinTone: 'medium',
    hairColor: 'brown',
    hairStyle: 'wavy',
    hairLength: 'medium',
    eyeColor: 'brown',
    eyeShape: 'almond',
    eyebrowShape: 'arched',
    eyebrowThickness: 'medium',
    noseShape: 'straight',
    lipShape: 'full',
    lipColor: 'natural',
    facialHair: '',
    glasses: false,
    age: 'adult',
    gender: 'neutral',
    bodyType: 'average',
    height: 'average',
    outfit: 'casual',
    accessories: [],
    expression: 'neutral'
  });
  const [detectionProgress, setDetectionProgress] = useState(0);

  // Feature options
  const faceShapes = ['oval', 'round', 'square', 'heart', 'diamond', 'oblong'];
  
  const skinTones = [
    { value: 'porcelain', label: 'Porcelain', hex: '#FDE7D9' },
    { value: 'fair', label: 'Fair', hex: '#F3D2C1' },
    { value: 'light', label: 'Light', hex: '#E6BCA7' },
    { value: 'medium', label: 'Medium', hex: '#C88F6B' },
    { value: 'olive', label: 'Olive', hex: '#B07D5E' },
    { value: 'tan', label: 'Tan', hex: '#8D5524' },
    { value: 'brown', label: 'Brown', hex: '#734639' },
    { value: 'dark', label: 'Dark', hex: '#5D4037' },
    { value: 'deep', label: 'Deep', hex: '#3A2A1F' }
  ];

  const hairStyles = [
    'straight', 'wavy', 'curly', 'coily', 'kinky', 
    'buzz', 'crew', 'pompadour', 'undercut', 'mohawk',
    'pixie', 'bob', 'lob', 'layers', 'bangs'
  ];

  // Camera functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
      setIsCapturing(true);
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setIsCapturing(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && capturedPhotos.length < 6) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedPhotos(prev => [...prev, imageData]);
        
        if (capturedPhotos.length < 5) {
          const angles = ['front', 'left profile', 'right profile', 'three-quarter left', 'three-quarter right'];
          setTimeout(() => {
            alert(`Please turn your face to show ${angles[capturedPhotos.length]}`);
          }, 500);
        }
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        if (capturedPhotos.length < 6) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              setCapturedPhotos(prev => [...prev, event.target!.result as string]);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const processPhotosWithAI = async () => {
    setIsProcessing(true);
    setDetectionProgress(0);
    
    // Simulate AI processing
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setDetectionProgress(i);
    }
    
    // Set default detected features
    const detectedFeatures: Partial<AvatarData> = {
      faceShape: 'oval',
      skinTone: 'medium',
      hairColor: 'brown',
      hairStyle: 'wavy',
      hairLength: 'medium',
      eyeColor: 'brown',
      eyeShape: 'almond',
      eyebrowShape: 'arched',
      eyebrowThickness: 'medium',
      noseShape: 'straight',
      lipShape: 'full',
      lipColor: 'natural',
      age: 'adult',
      gender: 'neutral',
      glasses: false
    };
    
    setAvatarData(prev => ({ ...prev, ...detectedFeatures }));
    setIsProcessing(false);
    setCurrentStep(3);
  };

  const handleExport = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-avatar.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const renderStep = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Capture Your Features
              </h2>
              <p className="text-gray-300 mb-8">
                Take 5-6 photos from different angles or upload existing photos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={startCamera}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border-2 border-white/20 hover:bg-white/20 transition-all"
              >
                <div className="text-6xl mb-4">📷</div>
                <h3 className="text-xl font-semibold text-white mb-2">Use Camera</h3>
                <p className="text-gray-300 text-sm">Take photos now</p>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl border-2 border-white/20 hover:bg-white/20 transition-all"
              >
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-xl font-semibold text-white mb-2">Upload Photos</h3>
                <p className="text-gray-300 text-sm">Choose from gallery</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </button>
            </div>

            {isCapturing && (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-full rounded-2xl"
                />
                <canvas ref={canvasRef} className="hidden" />
                
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-64 h-80 border-4 border-white/50 rounded-full border-dashed">
                    <p className="text-white text-center mt-8">Align face here</p>
                  </div>
                </div>

                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <button
                    onClick={capturePhoto}
                    disabled={capturedPhotos.length >= 6}
                    className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-gray-200 disabled:opacity-50"
                  >
                    Capture ({capturedPhotos.length}/6)
                  </button>
                  <button
                    onClick={stopCamera}
                    className="bg-red-500 text-white px-8 py-3 rounded-full font-semibold hover:bg-red-600"
                  >
                    Stop Camera
                  </button>
                </div>
              </div>
            )}

            {capturedPhotos.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-white mb-4">
                  Captured Photos ({capturedPhotos.length}/6)
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {capturedPhotos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Capture ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        onClick={() => setCapturedPhotos(prev => prev.filter((_, i) => i !== index))}
                        className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {capturedPhotos.length >= 3 && (
              <button
                onClick={() => setCurrentStep(2)}
                className="w-full bg-white text-black py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all"
              >
                Process Photos with AI
              </button>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                AI Feature Detection
              </h2>
              <p className="text-gray-300 mb-8">
                Our AI is analyzing your facial features to create your avatar
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl">
              <div className="space-y-6">
                {['Face Shape', 'Skin Tone', 'Hair Analysis', 'Eye Detection', 'Feature Mapping'].map((step, index) => (
                  <div key={step} className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      detectionProgress > index * 20 ? 'bg-green-500' : 'bg-white/20'
                    }`}>
                      {detectionProgress > index * 20 ? '✓' : (index + 1)}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{step}</p>
                      <div className="w-full bg-white/20 rounded-full h-2 mt-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(100, Math.max(0, detectionProgress - index * 20) * 5)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-8">
                <p className="text-4xl font-bold text-white">{detectionProgress}%</p>
                <p className="text-gray-300 mt-2">Processing your unique features...</p>
              </div>
            </div>

            {!isProcessing && (
              <button
                onClick={processPhotosWithAI}
                className="w-full bg-white text-black py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all"
              >
                Start AI Analysis
              </button>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Customize Your Avatar
              </h2>
              <p className="text-gray-300 mb-8">
                Fine-tune the AI-detected features to perfection
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">AI-Detected Features</h3>
              
              <div>
                <label className="text-white text-sm font-medium mb-2 block">Face Shape</label>
                <div className="grid grid-cols-3 gap-2">
                  {faceShapes.map(shape => (
                    <button
                      key={shape}
                      onClick={() => setAvatarData(prev => ({ ...prev, faceShape: shape }))}
                      className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        avatarData.faceShape === shape
                          ? 'bg-white text-black'
                          : 'bg-white/20 text-white hover:bg-white/30'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Skin Tone</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {skinTones.map(tone => (
                    <button
                      key={tone.value}
                      onClick={() => setAvatarData(prev => ({ ...prev, skinTone: tone.value }))}
                      className={`flex-shrink-0 p-2 rounded-lg border-2 transition-all ${
                        avatarData.skinTone === tone.value
                          ? 'border-white'
                          : 'border-white/20 hover:border-white/50'
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-full"
                        style={{ backgroundColor: tone.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Hair Style</label>
                <select
                  value={avatarData.hairStyle}
                  onChange={(e) => setAvatarData(prev => ({ ...prev, hairStyle: e.target.value }))}
                  className="w-full bg-white/20 text-white border border-white/20 rounded-lg px-4 py-2"
                >
                  <option value="">Select style</option>
                  {hairStyles.map(style => (
                    <option key={style} value={style}>{style}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white text-sm font-medium mb-2 block">Accessories</label>
                <div className="grid grid-cols-2 gap-2">
                  {['glasses', 'earrings', 'necklace', 'hat', 'watch', 'piercing'].map(accessory => (
                    <label key={accessory} className="flex items-center gap-2 text-white">
                      <input
                        type="checkbox"
                        checked={avatarData.accessories.includes(accessory)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setAvatarData(prev => ({
                              ...prev,
                              accessories: [...prev.accessories, accessory]
                            }));
                          } else {
                            setAvatarData(prev => ({
                              ...prev,
                              accessories: prev.accessories.filter(a => a !== accessory)
                            }));
                          }
                        }}
                        className="w-4 h-4 rounded"
                      />
                      <span className="capitalize">{accessory}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(4)}
              className="w-full bg-white text-black py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all"
            >
              Generate 3D Avatar
            </button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Your 3D Avatar
              </h2>
              <p className="text-gray-300 mb-8">
                Here's your personalized avatar ready for AR experiences
              </p>
            </div>

            <div className="h-96 bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🧑‍💼</div>
                <p className="text-lg">3D Avatar Preview</p>
                <p className="text-sm text-gray-300 mt-2">Avatar3DRenderer component will be rendered here</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => router.push('/')}
                className="bg-purple-600 text-white py-4 rounded-lg font-semibold hover:bg-purple-700 transition-all"
              >
                Save & Use Avatar
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="bg-white/20 text-white py-4 rounded-lg font-semibold border-2 border-white/20 hover:bg-white/30 transition-all"
              >
                Edit Features
              </button>
            </div>

            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-all">
              Try in AR Now
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b15] via-[#2d1123] to-[#54162b] py-12 px-4">
      <div className="flex justify-center mb-8">
        <img 
          src="/images/3.png" 
          alt="Vogue Logo" 
          className="h-24 w-auto object-contain"
        />
      </div>

      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-white/10 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {['Capture', 'Analyze', 'Customize', 'Preview'].map((label, index) => (
            <span
              key={label}
              className={`text-sm ${
                currentStep > index ? 'text-white' : 'text-gray-400'
              }`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {renderStep()}
      </div>
    </div>
  );
};

// ✅ FIX: Make sure to export as default
export default AvatarPage;
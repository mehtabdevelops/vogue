'use client'
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VogueWebsite() {
  const colors = ['#54162b', '#B4183d', '#fd4810', '#37415c', '#242e49', '#181a2f'];
  const router = useRouter();
  
  const [currentColorIndex, setCurrentColorIndex] = useState(0);
  const [currentAvatarIndex, setCurrentAvatarIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Navbar hover sound effect
  const playHoverSound = () => {
    const context = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, context.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.2);
    
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.2);
    
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 200);
  };

  // Handle personalised avatar button click
  const handlePersonalisedAvatarClick = () => {
    router.push('/signup');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex((prev) => (prev + 1) % colors.length);
      setCurrentAvatarIndex((prev) => (prev + 1) % 5);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentColor = colors[currentColorIndex];
  const currentAvatar = `/images/e${currentAvatarIndex + 1}.png`;

  const navItems = [
    { label: 'Collection', href: '/#collection' },
    { label: 'Fashion', href: '/#fashion' },
    { label: 'Beauty', href: '/#beauty' },
    { label: 'Culture', href: '/#culture' },
    { label: 'Runway', href: '/#runway' },
    { label: 'VOGUE', href: '/vouge' }
  ];

  return (
    <div 
      className="min-h-screen transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: currentColor }}
    >
      {/* Navbar */}
      <div className="navbar-container">
        <nav className="navbar">
          {/* Left - Language/Logo */}
          <div className="logo">
            /EN
          </div>

          {/* Center - Navigation Items */}
          <div className="nav-items">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="nav-link"
                onMouseEnter={playHoverSound}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right - Sound Indicator */}
          <div className="sound-indicator">
            <div className={`sound-dot ${isPlaying ? 'playing' : ''}`} />
            <span>SOUND ON</span>
          </div>
        </nav>
      </div>

      {/* Hero Section with Logo */}
      <section className="container mx-auto px-4 py-16 mt-24">
        <div className="text-center">
          <div className="flex justify-center mb-8">
            <img 
              src="/images/3.png" 
              alt="Vogue Logo" 
              className="h-40 w-auto object-contain"
            />
          </div>
          <button className="bg-white text-gray-900 px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all transform hover:scale-105">
            Explore Collection
          </button>
        </div>
      </section>

      {/* Featured Avatar Section - Full Visible */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <img 
              src={currentAvatar}
              alt="Featured Model" 
              className="w-full h-auto max-h-[70vh] object-contain transition-all duration-1000 ease-in-out transform hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* Brand Logos Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Our Brands</h2>
        <div className="flex justify-center items-center space-x-12">
          <img 
            src="/images/1.png" 
            alt="Brand 1" 
            className="h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
          />
          <img 
            src="/images/2.png" 
            alt="Brand 2" 
            className="h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
          />
          <img 
            src="/images/3.png" 
            alt="Brand 3" 
            className="h-20 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity cursor-pointer"
          />
        </div>
      </section>

      {/* All Avatars Showcase - Full Visible */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-white text-center mb-8">Style Icons</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3, 4, 5].map((index) => (
            <div 
              key={index}
              className={`flex justify-center transition-all duration-1000 ${
                index === currentAvatarIndex + 1 ? 'scale-105 opacity-100' : 'opacity-70'
              }`}
            >
              <div className="w-full aspect-[3/4] flex items-center justify-center">
                <img 
                  src={`/images/e${index}.png`}
                  alt={`Avatar ${index}`}
                  className="w-full h-full object-contain transition-all cursor-pointer hover:scale-110"
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Create Your Personalised Avatar Button */}
        <div className="flex justify-center mt-12">
          <button 
            className="personalised-avatar-btn"
            onClick={handlePersonalisedAvatarClick}
          >
            Create Your Personalised Avatar
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black bg-opacity-30 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; 2025 Vogue. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="#" className="hover:opacity-80 transition-opacity">Instagram</a>
            <a href="#" className="hover:opacity-80 transition-opacity">Facebook</a>
            <a href="#" className="hover:opacity-80 transition-opacity">Twitter</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* Navbar Styles */
        .navbar-container {
          margin-top: 5vh;
          padding: 0 1rem;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 800px; /* 60% smaller width */
          margin: 0 auto;
          padding: 0.8rem 1.5rem; /* Smaller padding */
          background: rgba(255, 255, 255, 0.1); /* Light transparent background */
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .navbar::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: left 0.6s ease;
        }

        .navbar:hover::before {
          left: 100%;
        }

        .logo {
          font-size: 0.9rem; /* Smaller font */
          font-weight: 600;
          color: #ffffff;
          letter-spacing: 1px;
          text-transform: uppercase;
          opacity: 0.9;
          transition: all 0.3s ease;
        }

        .nav-items {
          display: flex;
          gap: 2.5rem; /* Increased spacing */
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }

        .nav-link {
          color: #ffffff;
          text-decoration: none;
          font-size: 0.85rem; /* Smaller font */
          font-weight: 500;
          letter-spacing: 0.5px;
          padding: 0.5rem 0;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0.8;
          white-space: nowrap;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, #ffffff, #cccccc, #999999);
          transition: width 0.3s ease;
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(90deg, #ffffff, #cccccc, #999999);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .nav-link:hover {
          opacity: 1;
          transform: translateY(-1px);
        }

        .nav-link:hover::before {
          width: 100%;
        }

        .nav-link:hover::after {
          opacity: 0.3;
        }

        .sound-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #ffffff;
          font-size: 0.7rem; /* Smaller font */
          opacity: 0.6;
          transition: all 0.3s ease;
        }

        .sound-indicator:hover {
          opacity: 1;
        }

        .sound-dot {
          width: 5px; /* Smaller dot */
          height: 5px;
          border-radius: 50%;
          background: #ffffff;
          transition: all 0.3s ease;
        }

        .sound-dot.playing {
          animation: pulse 0.2s ease-in-out;
          background: #cccccc;
        }

        /* Personalised Avatar Button */
        .personalised-avatar-btn {
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50px;
          color: #ffffff;
          font-weight: 500;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          cursor: pointer;
          font-size: 0.9rem;
          white-space: nowrap;
        }

        .personalised-avatar-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
          transition: left 0.6s ease;
        }

        .personalised-avatar-btn:hover::before {
          left: 100%;
        }

        .personalised-avatar-btn:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateY(-2px);
          box-shadow: 
            0 8px 32px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .navbar {
            padding: 0.6rem 1rem;
            flex-direction: column;
            gap: 0.8rem;
            max-width: 90%;
          }

          .nav-items {
            gap: 1.5rem;
          }

          .logo {
            font-size: 0.8rem;
          }

          .nav-link {
            font-size: 0.75rem;
          }

          .sound-indicator {
            font-size: 0.65rem;
          }

          .personalised-avatar-btn {
            padding: 0.8rem 1.5rem;
            font-size: 0.8rem;
          }

          /* Mobile avatar adjustments */
          .grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
        }

        @media (max-width: 480px) {
          .grid {
            grid-template-columns: 1fr;
          }
          
          .personalised-avatar-btn {
            padding: 0.7rem 1.2rem;
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
}
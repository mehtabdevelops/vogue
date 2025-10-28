'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const VoguePage = () => {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<any>(null);
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

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const initLenis = async () => {
      const Lenis = (await import('lenis')).default;
      
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      function raf(time: number) {
        lenisRef.current?.raf(time);
        requestAnimationFrame(raf);
      }

      requestAnimationFrame(raf);
    };

    initLenis();

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, []);

  // GSAP animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Title animation
    if (titleRef.current) {
      gsap.fromTo(titleRef.current,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, delay: 0.3, ease: "power3.out" }
      );
    }

    // Avatar animation
    if (avatarRef.current) {
      gsap.fromTo(avatarRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 1.5, delay: 0.6, ease: "power2.out" }
      );

      // Floating animation
      gsap.to(avatarRef.current, {
        y: -20,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    // Text reveal animations
    gsap.utils.toArray('.reveal-text').forEach((element: any) => {
      gsap.fromTo(element,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: element,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    });

    // Section animations
    gsap.utils.toArray('.section-reveal').forEach((section: any) => {
      gsap.fromTo(section,
        { opacity: 0, y: 80 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          }
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const navItems = [
    { label: 'AR Collection', href: '/#ar-collection' },
    { label: 'Virtual Runway', href: '/#runway' },
    { label: 'Digital Fashion', href: '/#digital' },
    { label: 'Technology', href: '/#tech' },
    { label: 'VOGUE AR', href: '/#vogue-ar' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b15] via-[#2d1123] to-[#54162b] overflow-x-hidden">
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

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container mx-auto px-4 py-32">
          {/* Main Title */}
          <div className="text-center">
            <h1 ref={titleRef} className="main-title">
              VOGUE AR
            </h1>
            <p className="subtitle reveal-text">
              Redefining Fashion Through Augmented Reality
            </p>
          </div>

          {/* Single Avatar */}
          <div ref={avatarRef} className="avatar-container">
            <img 
              src="/images/e4.png" 
              alt="Augmented Reality Model" 
              className="avatar-image"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section section-reveal">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="section-title reveal-text">THE FUTURE OF FASHION IS HERE</h2>
            <div className="content-grid">
              <div className="text-content">
                <p className="reveal-text">
                  At <strong>VOGUE AR</strong>, we are pioneering the fusion of fashion and technology, 
                  creating immersive augmented reality experiences that transform how the world 
                  interacts with style. We believe that fashion should be accessible, interactive, 
                  and boundary-pushing.
                </p>
                <p className="reveal-text">
                  Our cutting-edge AR technology allows you to try on collections from top designers, 
                  experience virtual runway shows in your own space, and explore digital fashion 
                  that transcends physical limitations. We're not just showcasing clothes—we're 
                  creating experiences that redefine self-expression.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="tech-section section-reveal">
        <div className="container mx-auto px-4 py-20">
          <h2 className="section-title reveal-text">OUR AR TECHNOLOGY</h2>
          <div className="features-grid">
            <div className="feature-card reveal-text">
              <h3>Virtual Try-On</h3>
              <p>Experience perfect-fit visualization with our advanced body mapping technology. Try any outfit from our collections in real-time through your device's camera.</p>
            </div>
            <div className="feature-card reveal-text">
              <h3>Interactive Runways</h3>
              <p>Step into virtual fashion shows where you control the perspective. Walk around models, zoom in on details, and experience collections in 360 degrees.</p>
            </div>
            <div className="feature-card reveal-text">
              <h3>Digital Garments</h3>
              <p>Own exclusive digital fashion pieces that exist only in augmented reality. Express yourself without physical constraints or environmental impact.</p>
            </div>
            <div className="feature-card reveal-text">
              <h3>Real-Time Customization</h3>
              <p>Change colors, patterns, and styles instantly. See how different combinations work together before making any decisions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section section-reveal">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title reveal-text">OUR VISION</h2>
            <p className="mission-text reveal-text">
              To democratize high fashion through technology, making exclusive collections 
              accessible to everyone while pushing the boundaries of what's possible in 
              digital self-expression. We're building a future where fashion is limitless, 
              sustainable, and deeply personal.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section section-reveal">
        <div className="container mx-auto px-4 py-20 text-center">
          <h2 className="section-title reveal-text">READY TO EXPERIENCE FASHION IN AR?</h2>
          <p className="cta-subtitle reveal-text">
            Download our app and step into the future of fashion today.
          </p>
          <div className="cta-buttons">
            <button className="cta-button primary">
              DOWNLOAD APP
            </button>
            <button className="cta-button secondary">
              VIEW COLLECTION
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="footer-text">&copy; 2025 VOGUE AR. Redefining Fashion Reality.</p>
        </div>
      </footer>

      <style jsx>{`
        /* Import Abril Fatface */
        @import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap');

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
          max-width: 800px;
          margin: 0 auto;
          padding: 0.8rem 1.5rem;
          background: rgba(255, 255, 255, 0.1);
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
          font-size: 0.9rem;
          font-weight: 600;
          color: #ffffff;
          letter-spacing: 1px;
          text-transform: uppercase;
          opacity: 0.9;
          transition: all 0.3s ease;
        }

        .nav-items {
          display: flex;
          gap: 2.5rem;
          align-items: center;
          flex-wrap: wrap;
          justify-content: center;
        }

        .nav-link {
          color: #ffffff;
          text-decoration: none;
          font-size: 0.85rem;
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
          font-size: 0.7rem;
          opacity: 0.6;
          transition: all 0.3s ease;
        }

        .sound-indicator:hover {
          opacity: 1;
        }

        .sound-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #ffffff;
          transition: all 0.3s ease;
        }

        .sound-dot.playing {
          animation: pulse 0.2s ease-in-out;
          background: #cccccc;
        }

        /* Hero Section */
        .hero-section {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .main-title {
          font-family: 'Abril Fatface', serif;
          font-size: 6rem;
          font-weight: 400;
          color: #ffffff;
          letter-spacing: 0.02em;
          margin-bottom: 1rem;
          text-align: center;
        }

        .subtitle {
          font-family: 'Georgia', serif;
          font-size: 1.5rem;
          color: #ffffff;
          opacity: 0.8;
          font-style: italic;
          text-align: center;
        }

        .avatar-container {
          display: flex;
          justify-content: center;
          margin-top: 4rem;
        }

        .avatar-image {
          height: 500px;
          width: auto;
          object-fit: contain;
          border-radius: 12px;
        }

        /* About Section */
        .about-section {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .section-title {
          font-family: 'Abril Fatface', serif;
          font-size: 3.5rem;
          font-weight: 400;
          color: #ffffff;
          text-align: center;
          margin-bottom: 3rem;
          letter-spacing: 0.02em;
        }

        .text-content {
          font-family: 'Georgia', serif;
          font-size: 1.3rem;
          line-height: 1.8;
          color: #ffffff;
          opacity: 0.9;
        }

        .text-content p {
          margin-bottom: 2rem;
        }

        .text-content strong {
          color: #ffffff;
          opacity: 1;
        }

        /* Technology Section */
        .tech-section {
          padding: 6rem 0;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          padding: 2.5rem 2rem;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          transition: all 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.15);
        }

        .feature-card h3 {
          font-family: 'Abril Fatface', serif;
          font-size: 1.8rem;
          color: #ffffff;
          margin-bottom: 1rem;
        }

        .feature-card p {
          font-family: 'Georgia', serif;
          font-size: 1.1rem;
          line-height: 1.6;
          color: #ffffff;
          opacity: 0.8;
        }

        /* Mission Section */
        .mission-section {
          background: rgba(255, 255, 255, 0.03);
        }

        .mission-text {
          font-family: 'Georgia', serif;
          font-size: 1.4rem;
          line-height: 1.8;
          color: #ffffff;
          opacity: 0.9;
          text-align: center;
        }

        /* CTA Section */
        .cta-section {
          background: linear-gradient(135deg, rgba(84, 22, 43, 0.8), rgba(180, 24, 61, 0.8));
        }

        .cta-subtitle {
          font-family: 'Georgia', serif;
          font-size: 1.3rem;
          color: #ffffff;
          opacity: 0.8;
          margin-bottom: 3rem;
          text-align: center;
        }

        .cta-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .cta-button {
          padding: 1.2rem 2.5rem;
          border-radius: 50px;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          border: 2px solid #ffffff;
          font-family: 'Georgia', serif;
          font-size: 1.1rem;
          cursor: pointer;
        }

        .cta-button.primary {
          background: #ffffff;
          color: #54162b;
        }

        .cta-button.primary:hover {
          background: transparent;
          color: #ffffff;
          transform: translateY(-2px);
        }

        .cta-button.secondary {
          background: transparent;
          color: #ffffff;
        }

        .cta-button.secondary:hover {
          background: #ffffff;
          color: #54162b;
          transform: translateY(-2px);
        }

        /* Footer */
        .footer {
          background: rgba(0, 0, 0, 0.3);
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .footer-text {
          font-family: 'Georgia', serif;
          font-size: 1rem;
          color: #ffffff;
          opacity: 0.6;
        }

        /* Animations */
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

          .main-title {
            font-size: 3.5rem;
          }

          .subtitle {
            font-size: 1.2rem;
          }

          .avatar-image {
            height: 300px;
          }

          .section-title {
            font-size: 2.5rem;
          }

          .text-content {
            font-size: 1.1rem;
          }

          .feature-card {
            padding: 2rem 1.5rem;
          }

          .cta-buttons {
            flex-direction: column;
            align-items: center;
          }

          .cta-button {
            width: 100%;
            max-width: 300px;
          }
        }

        @media (max-width: 480px) {
          .main-title {
            font-size: 2.5rem;
          }

          .section-title {
            font-size: 2rem;
          }

          .avatar-image {
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
};

export default VoguePage;
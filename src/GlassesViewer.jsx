import React, { Suspense, useEffect, useRef, useState } from "react";
import "./App.css";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Html, useProgress } from "@react-three/drei";

// keep the small Drei loader for the GLTF but we'll also show a custom loader UI
function DreiLoader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-center">
        <div className="w-36 h-2 bg-gray-300 rounded overflow-hidden mb-2">
          <div className="h-full bg-primary" style={{ width: `${progress}%`, transition: "width 0.2s" }} />
        </div>
        <p className="text-sm text-gray-300 font-bold">{progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}

function GlassesModel() {
  const { scene } = useGLTF("/models/glasses.glb");
  return <primitive object={scene} scale={[2, 2.2, 2]} position={[0, -0.5, 0]} />;
}

export default function GlassesViewer() {
  const [env, setEnv] = useState("studio");
  const cursorDotRef = useRef(null);
  const cursorOutlineRef = useRef(null);
  const parallaxRef = useRef(null);

  // Setup mouse cursor and parallax
  useEffect(() => {
    const cursorDot = cursorDotRef.current;
    const cursorOutline = cursorOutlineRef.current;
    const bg = parallaxRef.current;

    if (!cursorDot || !cursorOutline || !bg) return;

    function onMove(e) {
      const posX = e.clientX;
      const posY = e.clientY;
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;
      // smooth outline
      cursorOutline.animate({ left: `${posX}px`, top: `${posY}px` }, { duration: 400, fill: "forwards" });

      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      bg.style.setProperty("--x", `${x}%`);
      bg.style.setProperty("--y", `${y}%`);

      const particles = bg.querySelectorAll('.particle');
      particles.forEach(particle => {
        const speed = 0.01;
        const xOffset = (e.clientX - window.innerWidth / 2) * speed;
        const yOffset = (e.clientY - window.innerHeight / 2) * speed;
        const currentTransform = getComputedStyle(particle).transform;
        if (!currentTransform.includes('translate')) {
          particle.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        }
      });
    }

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // handle hover interactions to change cursor style
  useEffect(() => {
    const outline = cursorOutlineRef.current;
    const interactive = document.querySelectorAll('.interactive-element, .interactive-panel, .interactive-panel-alt');
    if (!outline) return;

    function enterHandler(e) {
      const el = e.currentTarget;
      if (el.classList.contains('interactive-panel') || el.classList.contains('interactive-element')) {
        outline.classList.add('cursor-interact');
      } else if (el.classList.contains('interactive-panel-alt') || el.classList.contains('interactive-element-alt')) {
        outline.classList.add('cursor-interact-alt');
      } else {
        outline.classList.add('cursor-interact');
      }
    }
    function leaveHandler() {
      outline.classList.remove('cursor-interact', 'cursor-interact-alt');
    }

    interactive.forEach(el => {
      el.addEventListener('mouseenter', enterHandler);
      el.addEventListener('mouseleave', leaveHandler);
    });
    return () => {
      interactive.forEach(el => {
        el.removeEventListener('mouseenter', enterHandler);
        el.removeEventListener('mouseleave', leaveHandler);
      });
    };
  }, []);

  return (
  <div className="font-display text-white" style={{ backgroundColor: '#0f0c29', minHeight: '100vh', cursor: 'none' , padding:'20px'}}>
      <div ref={cursorDotRef} id="cursor-dot" className="cursor" style={{ width: 8, height: 8, backgroundColor: 'white' }} />
      <div ref={cursorOutlineRef} id="cursor-outline" className="cursor" style={{ width: 40, height: 40, border: '2px solid rgba(255,255,255,0.5)' }} />

      <div id="parallax-bg" ref={parallaxRef} style={{ '--x': '50%', '--y': '50%', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1, background: 'radial-gradient(600px at var(--x) var(--y), rgba(48, 43, 99, 0.8), transparent 80%), radial-gradient(400px at calc(100% - var(--x)) calc(100% - var(--y)), rgba(36, 36, 62, 0.7), transparent 80%)', backgroundColor: '#0f0c29', transition: 'background 0.1s ease-out' }}>
        <div className="particle" style={{ width: 150, height: 150, top: '10%', left: '15%', animation: 'particleFloat 18s ease-in-out infinite', position: 'absolute', borderRadius: '50%', background: 'rgba(0,255,255,0.1)', filter: 'blur(5px)' }} />
        <div className="particle" style={{ width: 200, height: 200, top: '70%', left: '80%', animation: 'particleFloat 22s ease-in-out infinite reverse', position: 'absolute', borderRadius: '50%', background: 'rgba(123,47,247,0.08)', filter: 'blur(5px)' }} />
        <div className="particle" style={{ width: 100, height: 100, top: '50%', left: '50%', animation: 'particleFloat 16s ease-in-out infinite', position: 'absolute', borderRadius: '50%', background: 'rgba(0,255,255,0.1)', filter: 'blur(5px)' }} />
        <div className="particle" style={{ width: 80, height: 80, top: '25%', left: '75%', animation: 'particleFloat 20s ease-in-out infinite reverse', position: 'absolute', borderRadius: '50%', background: 'rgba(0,255,255,0.1)', filter: 'blur(5px)' }} />
        <div className="particle" style={{ width: 120, height: 120, top: '85%', left: '20%', animation: 'particleFloat 19s ease-in-out infinite', position: 'absolute', borderRadius: '50%', background: 'rgba(123,47,247,0.05)', filter: 'blur(5px)' }} />
      </div>

      <div className="min-h-screen p-4 sm:p-6 md:p-8 relative z-10 flex items-center justify-center">
        <div className="w-full max-w-7xl">
          {/* Bento Layout - Two Column Structure */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
            
            {/* Left Column - Main Content (60-65% width) */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              
              {/* Hero Section - 3D Model Viewer */}
              <div className="rounded-xl glassmorphism p-8 flex flex-col items-center justify-center relative interactive-panel" style={{ minHeight: '80vh' }}>
                {/* Centered Loading Text and Icon */}
                {/* <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'radial-gradient(closest-side, rgba(123,47,247,0.08), rgba(0,0,0,0))' }}>
                    <span className="material-symbols-outlined text-secondary text-4xl">eyeglasses</span>
                  </div>
                  <p className="text-lg text-gray-300">Loading 3D Model...</p>
                </div> */}
                
                {/* 3D Model Viewer - Optimized dimensions */}
                <div className="w-full rounded-lg overflow-hidden bg-transparent" style={{ height: '50vh', aspectRatio: '16/9' }}>
                  <Canvas className="w-full h-full" camera={{ position: [0, 0, 7], fov: 50 }}>
                  <ambientLight intensity={0.8} />
                  <directionalLight position={[3, 3, 3]} intensity={1.2} />
                  <pointLight position={[-2, -2, 2]} intensity={0.5} />
                  <Suspense fallback={<DreiLoader />}>
                    <GlassesModel />
                    <Environment preset={env} background />
                  </Suspense>
                  <OrbitControls enableZoom={true} enablePan={false} minDistance={2} maxDistance={6} />
                  </Canvas>
                </div>
              </div>

            </div>

            {/* Right Column - Sidebar Content (35-40% width) */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Nazario Branding */}
              <div className="rounded-xl glassmorphism p-4 flex flex-col justify-center items-center text-center interactive-panel-alt">
                <h2 className="text-4xl font-bold mb-2 text-white">Nazario</h2>
                <p className="text-gray-300 mb-4">Experience the Future of Vision</p>
                <button className="w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-violet-500 text-white font-bold rounded-lg neon-glow hover:opacity-95 transition-all duration-300 interactive-element-alt">Shop Now</button>
              </div>

              {/* Our Story */}
              <div className="rounded-xl glassmorphism p-6 flex flex-col justify-center interactive-panel-alt">
                <h3 className="text-xl font-bold mb-4 text-white">Our Story</h3>
                <p className="text-gray-300 text-sm">Nazario was born from a passion for immersive technology. We believe in pushing the boundaries of what's possible, creating products that seamlessly blend the digital and physical worlds.</p>
              </div>

              {/* Get in Touch */}
              <div className="rounded-xl glassmorphism p-6 flex flex-col justify-center items-center interactive-panel-alt">
                <h3 className="text-xl font-bold mb-6 text-white">Get in Touch</h3>
                <div className="flex space-x-6">
                  <a className="text-secondary hover:text-white transition-colors interactive-element" href="#"><span className="material-symbols-outlined text-3xl">email</span></a>
                  <a className="text-secondary hover:text-white transition-colors interactive-element" href="#"><span className="material-symbols-outlined text-3xl">sms</span></a>
                  <a className="text-secondary hover:text-white transition-colors interactive-element" href="#"><span className="material-symbols-outlined text-3xl">phone</span></a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>{`
        /* fallback utility colors in case Tailwind custom colors are not present */
        .bg-primary { background-color: #7b2ff7 !important; }
        .text-secondary { color: #00ffff !important; }
        .from-purple-600 { --tw-gradient-from: #7b2ff7; }
        .to-violet-500 { --tw-gradient-to: #6b21a8; }
        .cursor { position: fixed; top: 0; left: 0; border-radius: 50%; z-index: 9999; pointer-events: none; transition: transform 0.1s ease-out, background-color 0.3s ease, border-color 0.3s ease; mix-blend-mode: difference; }
        .cursor-interact { background-color: #00ffff !important; border-color: #00ffff !important; transform: scale(1.5); }
        .cursor-interact-alt { background-color: #7b2ff7 !important; border-color: #7b2ff7 !important; transform: scale(1.5); }
        #parallax-bg { --x: 50%; --y: 50%; }
        .particle { will-change: transform; }
        .glassmorphism { background: rgba(20,16,30,0.55); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 8px 32px rgba(2,2,8,0.7), inset 0 1px 0 rgba(255,255,255,0.1); transition: all 0.3s ease-in-out; }
        .glassmorphism:hover { background: rgba(20,16,30,0.65); border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 12px 40px rgba(2,2,8,0.8), inset 0 1px 0 rgba(255,255,255,0.15); }
        .glassmorphism h3, .glassmorphism h2 { color: rgba(255,255,255,0.95); }
        .neon-glow:hover { box-shadow: 0 0 5px #00ffff, 0 0 15px #00ffff, 0 0 30px #7b2ff7, 0 0 60px #7b2ff7; }
        /* Override any conflicting styles */
        .max-w-7xl { max-width: 80rem !important; }
        .grid { display: grid !important; }
        .lg\\:grid-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)) !important; }
        .lg\\:col-span-3 { grid-column: span 3 / span 3 !important; }
        .lg\\:col-span-2 { grid-column: span 2 / span 2 !important; }
        .flex { display: flex !important; }
        .flex-col { flex-direction: column !important; }
        .gap-6 { gap: 1.5rem !important; }
        /* Ensure proper centering */
        .items-center { align-items: center !important; }
        .justify-center { justify-content: center !important; }
        .text-center { text-align: center !important; }
        .loader-container { display: flex; }
        .model-viewer:not([loaded]) ~ .loader-container { display: flex; }
        @keyframes pulseGlow { 0%,100% { box-shadow: 0 0 10px rgba(0,255,255,0.12), 0 0 20px rgba(123,47,247,0.12); transform: scale(1); } 50% { box-shadow: 0 0 25px rgba(0,255,255,0.28), 0 0 50px rgba(123,47,247,0.28); transform: scale(1.03); } }
        @keyframes particleFloat { 0%,100% { transform: translateY(0) translateX(0);} 25% { transform: translateY(-20px) translateX(10px);} 50% { transform: translateY(0) translateX(-10px);} 75% { transform: translateY(20px) translateX(10px);} }
        .animate-pulseGlow { animation: pulseGlow 3s ease-in-out infinite; }
        .particleFloat { animation: particleFloat 15s ease-in-out infinite; }
      `}</style>
    </div>
  );
}

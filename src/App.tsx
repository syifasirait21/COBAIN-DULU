/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows, useGLTF, Html } from '@react-three/drei';
import * as THREE from 'three';
import { 
  Heart, 
  Lightbulb, 
  Gamepad2, 
  ShieldAlert, 
  Play, 
  Info,
  ChevronRight,
  RefreshCcw,
  CheckCircle2,
  XCircle,
  Volume2,
  LayoutGrid,
  Zap,
  ShieldCheck,
  Building2,
  Waves,
  AlertTriangle,
  Rotate3d,
  Box,
  RotateCcw,
  VolumeX,
  Table,
  DoorOpen,
  EyeOff,
  Home,
  Grab,
  MousePointer2,
  Lightbulb as LightbulbIcon
} from 'lucide-react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- Nias Atmosphere Decor ---

function NiasAtmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.04]">
        {/* Animated Spirals (Ni'o Goli) */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: 0 
            }}
            animate={{ 
              y: ["0%", "100%"],
              opacity: [0, 1, 0],
              rotate: [0, 360]
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear"
            }}
            className="absolute"
          >
            <svg width="120" height="120" viewBox="0 0 100 100" className="text-stone-900 fill-none stroke-current stroke-3">
              <path d="M50 50 C 50 20, 80 20, 80 50 C 80 80, 20 80, 20 50 C 20 20, 60 20, 60 50 C 60 70, 40 70, 40 50" />
            </svg>
          </motion.div>
        ))}
        
        {/* Floating Geometric Shapes */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`geo-${i}`}
            animate={{ 
              x: ["-10%", "110%"],
              rotate: [0, 45, 0]
            }}
            transition={{
              duration: 20 + Math.random() * 15,
              repeat: Infinity,
              delay: i * 3,
              ease: "easeInOut"
            }}
            className="absolute top-1/4 opacity-30"
            style={{ top: (i * 12) + "%" }}
          >
            <div className="w-8 h-8 border-2 border-stone-800 rotate-45" />
          </motion.div>
        ))}
      </div>
      
      {/* Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.15] mix-blend-multiply" 
           style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/natural-paper.png")` }} />
    </div>
  );
}

// --- Error Boundary for 3D ---

class ErrorBoundary extends React.Component<{ children: React.ReactNode, onFatalError?: () => void }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("3D Canvas Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-900/90 backdrop-blur-sm p-6 text-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <AlertTriangle size={48} className="text-nias-gold mb-4" />
          </motion.div>
          <p className="text-white font-black text-xs uppercase tracking-widest leading-relaxed mb-6">
            Maaf, Model 3D gagal dimuat.<br/>
            <span className="opacity-50 font-bold text-[10px]">Perangkat Anda mungkin tidak mendukung WebGL.</span>
          </p>
          <div className="flex flex-col gap-3 w-full max-w-[200px]">
            <button 
              onClick={() => {
                this.setState({ hasError: false });
              }}
              className="w-full py-4 bg-nias-gold text-stone-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-transform"
            >
              MUAT ULANG MODEL
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// --- 3D Components ---

function OmoHadaModel({ isShaking, simulationResult }: { isShaking?: boolean, simulationResult?: 'steady' | 'collapsed' | null }) {
  const meshRef = useRef<THREE.Group>(null);
  
  // Try to load the GLTF model with absolute path.
  const { scene } = useGLTF('/Copilot3D-6a753cf7-a08a-4c62-92e0-84fac9ae7946.glb');

  useFrame((state) => {
    if (!meshRef.current) return;

    if (isShaking) {
      // Intense vibration
      meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 50) * 0.15;
      meshRef.current.position.y = Math.cos(state.clock.elapsedTime * 60) * 0.05;
      meshRef.current.position.z = Math.sin(state.clock.elapsedTime * 40) * 0.1;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 30) * 0.02;
    } else if (simulationResult === 'collapsed') {
      // Tilt and sink for failure
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -0.3, 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, -3.8, 0.05);
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, -0.5, 0.05);
    } else {
      // Return to normal
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, 0, 0.1);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, -2.8, 0.1);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, 0, 0.1);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, 0, 0.1);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.1);
    }
  });

  return (
    <primitive 
      ref={meshRef} 
      object={scene} 
      scale={5.5} 
      position={[0, -2.8, 0]} 
    />
  );
}

// Preload for better experience
useGLTF.preload('/Copilot3D-6a753cf7-a08a-4c62-92e0-84fac9ae7946.glb');

function House3DViewer({ isShaking, simulationResult }: { isShaking?: boolean, simulationResult?: 'steady' | 'collapsed' | null }) {
  return (
    <div className="w-full h-full bg-stone-100 rounded-3xl overflow-hidden relative shadow-inner">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-stone-200 text-stone-500 shadow-sm">
        <Rotate3d size={16} />
        <span className="text-[10px] font-bold uppercase tracking-wider">Model 3D Interaktif</span>
      </div>
      
      <ErrorBoundary>
        <Canvas 
          shadows 
          dpr={[1, 1.5]}
          gl={{ 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
          }}
          className="touch-none"
        >
          <PerspectiveCamera makeDefault position={[7, 4, 7]} fov={40} />
          <ambientLight intensity={2.5} />
          <pointLight position={[10, 10, 10]} intensity={3} />
          <pointLight position={[-10, 5, -10]} intensity={1.5} />
          
          <Suspense fallback={
            <Html center>
              <div className="flex flex-col items-center justify-center">
                <div className="w-6 h-6 border-2 border-nias-gold border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-stone-900 font-black text-[7px] uppercase tracking-[0.2em] whitespace-nowrap">
                  Loading...
                </p>
              </div>
            </Html>
          }>
            <OmoHadaModel isShaking={isShaking} simulationResult={simulationResult} />
            <Environment preset="city" />
            <ContactShadows position={[0, -2, 0]} opacity={0.6} scale={15} blur={2.5} far={4} />
          </Suspense>
  
          <OrbitControls 
            enablePan={false} 
            enableZoom={true}
            minDistance={4} 
            maxDistance={12}
            enableDamping={true}
            dampingFactor={0.1}
          />
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}

// --- Main Application ---

type Page = 'dashboard' | 'mindful' | 'meaningful' | 'joyful' | 'mitigasi';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [isShaking, setIsShaking] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Beranda', icon: LayoutGrid },
    { id: 'mindful', label: 'Mindful', icon: Heart },
    { id: 'meaningful', label: 'Meaningful', icon: Lightbulb },
    { id: 'joyful', label: 'Joyful', icon: Gamepad2 },
    { id: 'mitigasi', label: 'Mitigasi', icon: ShieldAlert },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-cream-bg overflow-hidden border-x border-stone-200">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 relative z-10">
        <NiasAtmosphere />
        <AnimatePresence mode="wait">
          {currentPage === 'dashboard' && <DashboardPage key="dashboard" onSelect={(p) => setCurrentPage(p)} />}
          {currentPage === 'mindful' && <MindfulPage key="mindful" onNext={() => setCurrentPage('meaningful')} />}
          {currentPage === 'meaningful' && <MeaningfulPage key="meaningful" />}
          {currentPage === 'joyful' && <JoyfulPage key="joyful" isShaking={isShaking} setIsShaking={setIsShaking} />}
          {currentPage === 'mitigasi' && <MitigasiPage key="mitigasi" />}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-cream-bg/95 backdrop-blur-md border-t border-stone-200 h-16 flex items-center justify-around fixed bottom-0 w-full max-w-md z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as Page)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
                isActive ? 'text-brick-red' : 'text-stone-400'
              }`}
            >
              <Icon size={20} className={isActive ? 'fill-brick-red/10' : ''} />
              <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute bottom-0 w-8 h-1 bg-brick-red rounded-t-full"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

function DashboardPage({ onSelect }: { onSelect: (p: Page) => void }) {
  interface ModuleItem {
    id: Page;
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    des: string;
    iconColor?: string;
  }

  const modules: ModuleItem[] = [
    { id: 'mindful', title: 'Mindful', subtitle: 'Sejarah & Tragedi', icon: Heart, color: 'bg-brick-red', des: 'Pahami luka masa lalu & kearifan lokal.' },
    { id: 'meaningful', title: 'Meaningful', subtitle: 'Anatomi Etnosains', icon: Lightbulb, color: 'bg-nias-gold', des: 'Rahasia struktur tahan gempa Omo Hada.' },
    { id: 'joyful', title: 'Joyful', subtitle: 'Simulasi Gempa', icon: Gamepad2, color: 'bg-wood-dark', des: 'Uji ketahanan desainmu secara interaktif.' },
    { id: 'mitigasi', title: 'Mitigasi', subtitle: 'Aksi Penyelamatan', icon: ShieldAlert, color: 'bg-stone-600', des: 'Pelajari langkah siaga saat darurat.' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-8"
    >
      <header className="space-y-2 mt-4">
        <h1 className="text-4xl font-black text-wood-dark tracking-tighter leading-none">
          Ya'ahowu, <br/>
          <span className="text-brick-red">Nono Niha!</span>
        </h1>
        <p className="text-stone-600 text-sm font-bold leading-tight">
          Mari belajar ketangguhan dari leluhur Nias melalui 4 fase penting.
        </p>
      </header>

      <div className="grid gap-4">
        {modules.map((m, idx) => {
          const Icon = m.icon;
          return (
            <motion.button
              key={m.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => onSelect(m.id as Page)}
              className="group flex flex-col items-start p-6 bg-white rounded-[32px] shadow-sm hover:shadow-xl transition-all border border-stone-100 text-left relative overflow-hidden"
            >
              <div className={`${m.color} p-3 rounded-2xl ${m.id === 'meaningful' ? 'text-stone-900' : 'text-white'} mb-4 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-black tracking-widest text-stone-400">{m.subtitle}</span>
                <h3 className="text-xl font-black text-stone-800">{m.title}</h3>
                <p className="text-xs text-stone-500 font-bold leading-relaxed">{m.des}</p>
              </div>
              <div className="absolute top-6 right-6 text-stone-200 group-hover:text-brick-red/20 transition-colors">
                <ChevronRight size={32} />
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="bg-brick-red/5 p-6 rounded-[32px] border-2 border-brick-red/10 border-dashed text-center">
        <p className="text-xs font-bold text-brick-red/60 uppercase tracking-tighter">
          "Kearifan lokal adalah tameng kita di masa depan."
        </p>
      </div>
    </motion.div>
  );
}

function MindfulPage({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-6"
    >
      <header className="space-y-2">
        <div className="flex border-b-2 border-dashed border-stone-200 pb-2 mb-4">
          <span className="text-brick-red font-black text-[10px] uppercase tracking-[0.2em] italic">Sejarah & Tragedi</span>
        </div>
        <h1 className="text-3xl font-black text-stone-900 tracking-tighter leading-none uppercase italic">Maret 2005,<br />Nias Berguncang</h1>
      </header>

      <div className="relative aspect-video bg-stone-900 rounded-[32px] overflow-hidden group shadow-2xl border-4 border-white">
        <div className="absolute inset-0 flex items-center justify-center bg-brick-red/20 group-hover:bg-brick-red/30 transition-colors z-10">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-brick-red shadow-2xl transform group-hover:scale-110 transition-transform">
            <Play fill="currentColor" className="ml-1" />
          </div>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1547841022-b558accc7ef8?q=80&w=1000&auto=format&fit=crop" 
          alt="History of Nias" 
          className="w-full h-full object-cover opacity-50 contrast-125 grayscale"
        />
        <div className="absolute bottom-4 left-4 right-4 text-white text-[10px] font-black uppercase tracking-widest bg-black/40 p-2 rounded-xl backdrop-blur-sm z-20">
          Dokumentasi Gempa Nias 2005
        </div>
      </div>

      <div className="space-y-4 text-stone-800 leading-relaxed text-sm font-medium">
        <p>
          Bumi berguncang hebat di tengah malam. Di pusat kota, bangunan beton tinggi runtuh menjadi puing dalam sekejap. Isak tangis terdengar di mana-mana.
        </p>
        <div className="bg-brick-red/5 p-5 rounded-[24px] border-2 border-brick-red/10 border-dashed">
          <p className="italic font-black text-brick-red uppercase tracking-tight text-xs">
            "Namun di pelosok desa, rumah-rumah panggung tua dari kayu justru tetap berdiri tegak, seolah menari mengikuti irama gempa."
          </p>
        </div>
        <p>
          Rumah itu adalah <strong>Omo Hada</strong>. Bagaimana mungkin bangunan kayu tanpa paku bisa lebih kuat dari beton bertulang?
        </p>
      </div>

      <button 
        onClick={onNext}
        className="w-full bg-brick-red text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-2xl shadow-brick-red/30 active:scale-95 transition-transform uppercase tracking-widest text-xs border-b-4 border-red-900"
      >
        Selidiki Rahasianya
        <ChevronRight size={18} />
      </button>
    </motion.div>
  );
}

function MeaningfulPage() {
  const anatomyDetails = {
    ehomo: {
      title: "Ehomo (Pondasi Batu)",
      desc: "Tiang kayu tidak ditanam di tanah, tapi diletakkan di atas batu datar."
    },
    diwa: {
      title: "Diwa (Tiang Menyilang)",
      desc: "Kayu dipasang menyilang membentuk huruf 'X'."
    },
    paku: {
      title: "Tanpa Paku",
      desc: "Seluruh sambungan menggunakan sistem pasak kayu (lubang dan pengunci)."
    }
  };

  const [activeModal, setActiveModal] = useState<keyof typeof anatomyDetails | null>('ehomo');

  const playKnock = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.volume = 0.4;
      audio.play().catch(() => {});
    } catch (e) {
      console.warn("Audio play failed", e);
    }
  };

  return (
    <div className="flex flex-col h-full bg-cream-bg min-h-[600px] font-sans">
      <header className="p-6 text-center relative border-b border-stone-200/50">
        <h2 className="text-xl font-black text-stone-900 tracking-tighter uppercase italic">
          Anatomi Etnosains<br/>
          <span className="text-xs font-bold block text-brick-red tracking-widest">(Rahasia Struktur)</span>
        </h2>
        <div className="absolute top-6 right-6">
          <button onClick={playKnock} className="bg-white p-3 rounded-full shadow-lg text-brick-red active:scale-95 transition-transform border border-stone-100">
            <Volume2 size={24} />
          </button>
        </div>
      </header>

      <div className="flex-1 relative flex flex-col items-center pb-8 px-6 pt-6 overflow-y-auto">
        <div className="w-full max-w-md flex flex-col gap-6">
          {/* Main 3D Viewer Area */}
          <div className="relative w-full aspect-[4/3] bg-stone-900 rounded-[40px] overflow-hidden border-2 border-white shadow-2xl group ring-1 ring-stone-200">
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center text-white font-black text-xs uppercase tracking-widest animate-pulse">
                Memuat Model 3D...
              </div>
            }>
              <House3DViewer />
            </Suspense>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full border border-stone-200 text-[10px] font-black text-stone-500 uppercase tracking-widest pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              Slide putar • Zoom detail
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'ehomo', label: 'Ehomo', point: 'Poin 1' },
              { id: 'diwa', label: 'Diwa', point: 'Poin 2' },
              { id: 'paku', label: 'Tanpa Paku', point: 'Poin 3' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => { playKnock(); setActiveModal(item.id as any); }}
                className={`py-4 px-2 rounded-[24px] flex flex-col items-center transition-all border-2 ${
                  activeModal === item.id 
                    ? 'bg-brick-red border-brick-red text-white shadow-xl scale-105 ring-4 ring-brick-red/20' 
                    : 'bg-white border-stone-100 text-stone-400 hover:border-stone-200 active:scale-95'
                }`}
              >
                <span className="text-[10px] font-black uppercase mb-1 opacity-60 tracking-wider">{item.point}</span>
                <span className="text-xs font-black tracking-tight leading-tight text-center">{item.label}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeModal && (
              <motion.div 
                key={activeModal}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[40px] p-8 shadow-2xl relative border-2 border-stone-100 mb-8"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[20px] border-b-white" />
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full bg-nias-gold shadow-sm" />
                    <h3 className="text-2xl font-black text-stone-900 tracking-tighter italic uppercase">
                      {anatomyDetails[activeModal].title}
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-brick-red font-black text-[10px] uppercase tracking-[0.2em] opacity-50">Mengapa Ini Penting?</p>
                    <p className="text-stone-800 text-lg leading-snug font-bold">
                      {anatomyDetails[activeModal].desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function HouseSVGViewer({ isShaking, simulationResult }: { isShaking?: boolean, simulationResult?: 'steady' | 'collapsed' | null }) {
  return (
    <div className="w-full h-64 relative flex items-center justify-center overflow-hidden bg-stone-50/50 rounded-3xl border-2 border-dashed border-stone-200 shadow-inner">
      <motion.svg 
        viewBox="0 0 400 300" 
        className="w-full h-full drop-shadow-2xl"
        initial={false}
        animate={isShaking ? { 
          x: [0, -8, 8, -8, 0],
          y: [0, -2, 2, -2, 0],
          rotate: [0, -1, 1, -1, 0]
        } : (simulationResult === 'collapsed' ? {
          rotate: -15,
          y: 40,
          opacity: 0.8
        } : { rotate: 0, y: 0, opacity: 1 })}
        transition={isShaking ? { repeat: Infinity, duration: 0.1 } : { type: 'spring', damping: 10 }}
      >
        {/* Ground */}
        <line x1="50" y1="260" x2="350" y2="260" stroke="#78716c" strokeWidth="4" strokeLinecap="round" />
        
        {/* Foundation Pillars */}
        <g stroke="#57534e" strokeWidth="8" strokeLinecap="round">
          <line x1="120" y1="260" x2="140" y2="200" />
          <line x1="280" y1="260" x2="260" y2="200" />
          <line x1="200" y1="260" x2="200" y2="200" />
          
          {/* Diwa (X-Pillars) */}
          <line x1="140" y1="260" x2="260" y2="200" opacity="0.4" />
          <line x1="260" y1="260" x2="140" y2="200" opacity="0.4" />
        </g>

        {/* Main Structure Base */}
        <motion.rect 
          x="100" y="140" width="200" height="60" rx="8" 
          fill="#a8a29e" 
          stroke="#57534e" strokeWidth="4"
        />

        {/* Roof */}
        <motion.path 
          d="M80 150 L200 40 L320 150 Z" 
          fill="#7c2d12" 
          stroke="#451a03" strokeWidth="4" strokeLinejoin="round" 
        />
        
        {/* Windows */}
        <rect x="130" y="160" width="30" height="30" rx="4" fill="#e7e5e4" stroke="#57534e" strokeWidth="2" />
        <rect x="240" y="160" width="30" height="30" rx="4" fill="#e7e5e4" stroke="#57534e" strokeWidth="2" />

        {/* Dynamic Cracks or Effects */}
        {simulationResult === 'collapsed' && !isShaking && (
          <g stroke="#ef4444" strokeWidth="3" opacity="0.6">
            <path d="M150 140 L160 170 L145 190" fill="none" />
            <path d="M250 145 L240 175 L255 200" fill="none" />
          </g>
        )}
      </motion.svg>

      {/* Decorative environment elements */}
      {!isShaking && (
        <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full border border-stone-200 text-[10px] font-black text-stone-400 uppercase tracking-widest">
          Simulasi Visual Dasar
        </div>
      )}
    </div>
  );
}

function JoyfulPage({ isShaking, setIsShaking }: { isShaking: boolean, setIsShaking: (v: boolean) => void }) {
  const [pondasi, setPondasi] = useState<string>('');
  const [sambungan, setSambungan] = useState<string>('');
  const [simulationResult, setSimulationResult] = useState<'steady' | 'collapsed' | null>(null);

  const handleSimulate = () => {
    if (!pondasi || !sambungan) return;

    // Sound effects
    const earthquakeSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3');
    const successSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    const failureSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    
    earthquakeSound.volume = 0.5;
    earthquakeSound.play().catch(() => {});

    setSimulationResult(null);
    setIsShaking(true);
    setTimeout(() => {
      setIsShaking(false);
      earthquakeSound.pause();
      earthquakeSound.currentTime = 0;

      if (pondasi === 'umpak' && sambungan === 'pasak') {
        setSimulationResult('steady');
        successSound.play().catch(() => {});
      } else {
        setSimulationResult('collapsed');
        failureSound.play().catch(() => {});
      }
    }, 3000);
  };

  const getOptionStyle = (type: 'pondasi' | 'sambungan', value: string) => {
    const isSelected = type === 'pondasi' ? pondasi === value : sambungan === value;
    if (!isSelected) return 'border-white bg-white/50 text-stone-400';
    
    // Heritage gold for selection
    return 'border-nias-gold bg-nias-gold text-stone-900 shadow-xl scale-[1.05] ring-4 ring-nias-gold/20';
  };

  return (
    <div className={`p-6 space-y-8 flex flex-col items-center min-h-[600px] bg-cream-bg ${isShaking ? 'animate-earthquake' : ''}`}>
      <div className="text-center space-y-2">
        <h2 className="text-4xl font-black text-brick-red tracking-tighter uppercase italic drop-shadow-sm">Guncang Nias!</h2>
        <p className="text-brick-red/60 text-[10px] font-black uppercase tracking-[0.2em]">Uji rahasia bangunan anti-gempa.</p>
      </div>

      <div className="w-full space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-brick-red/40 tracking-wider px-2">A. Pilih Jenis Pondasi</label>
          <div className="flex gap-2">
            <button 
              onClick={() => { if(!isShaking) { setPondasi('semen'); setSimulationResult(null); }}}
              className={`flex-1 p-4 rounded-3xl border-4 transition-all ${getOptionStyle('pondasi', 'semen')}`}
            >
              <div className="text-xs font-black uppercase mb-1">Semen Tanam</div>
              <div className="text-[10px] opacity-60 font-bold">Kaku & Statis</div>
            </button>
            <button 
              onClick={() => { if(!isShaking) { setPondasi('umpak'); setSimulationResult(null); }}}
              className={`flex-1 p-4 rounded-3xl border-4 transition-all ${getOptionStyle('pondasi', 'umpak')}`}
            >
              <div className="text-xs font-black uppercase mb-1">Umpak Batu</div>
              <div className="text-[10px] opacity-60 font-bold">Lentur & Bebas</div>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black uppercase text-brick-red/50 tracking-wider px-2">B. Pilih Teknik Sambungan</label>
          <div className="flex gap-2">
            <button 
              onClick={() => { if(!isShaking) { setSambungan('paku'); setSimulationResult(null); }}}
              className={`flex-1 p-4 rounded-3xl border-4 transition-all ${getOptionStyle('sambungan', 'paku')}`}
            >
              <div className="text-xs font-black uppercase mb-1">Paku Besi</div>
              <div className="text-[10px] opacity-60 font-bold">Resiko Rapuh</div>
            </button>
            <button 
              onClick={() => { if(!isShaking) { setSambungan('pasak'); setSimulationResult(null); }}}
              className={`flex-1 p-4 rounded-3xl border-4 transition-all ${getOptionStyle('sambungan', 'pasak')}`}
            >
              <div className="text-xs font-black uppercase mb-1">Pasak Kayu</div>
              <div className="text-[10px] opacity-60 font-bold">Kunci Alami</div>
            </button>
          </div>
        </div>
      </div>

      <div className="relative w-full flex flex-col items-center">
        <HouseSVGViewer isShaking={isShaking} simulationResult={simulationResult} />
        <div className="w-[85%] h-6 bg-stone-200 rounded-full mt-4 shadow-inner overflow-hidden relative border-4 border-white">
          <div className="absolute inset-0 bg-stone-400/20" />
        </div>
      </div>

      <button 
        onClick={handleSimulate}
        disabled={isShaking || !pondasi || !sambungan}
        className={`w-full py-5 rounded-[32px] font-black text-xl shadow-2xl transition-all active:scale-95 flex items-center justify-center gap-4 ${
          isShaking || !pondasi || !sambungan
            ? 'bg-stone-200 text-stone-400 cursor-not-allowed opacity-50' 
            : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-orange-500/30'
        }`}
      >
        {isShaking ? <RefreshCcw size={28} className="animate-spin" /> : (
          <>
            <Zap size={24} className="fill-white" />
            GUNCANG SEKARANG!
          </>
        )}
      </button>

      <AnimatePresence>
        {simulationResult && !isShaking && (
          <div className="fixed inset-x-0 top-16 z-[100] flex items-start justify-center p-6 pointer-events-none">
            <motion.div 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className={`w-full max-w-sm p-6 bg-white/90 backdrop-blur-xl rounded-[32px] shadow-2xl text-center border-[4px] pointer-events-auto flex flex-col items-center ${
                simulationResult === 'steady' ? 'border-green-500 shadow-green-500/20' : 'border-red-500 shadow-red-500/20'
              }`}
            >
              <div className="flex items-center gap-4 w-full mb-3">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 shadow-inner ${
                  simulationResult === 'steady' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {simulationResult === 'steady' ? <CheckCircle2 size={32} strokeWidth={3} /> : <XCircle size={32} strokeWidth={3} />}
                </div>
                <div className="text-left">
                  <h3 className={`text-2xl font-black italic tracking-tighter uppercase leading-none ${simulationResult === 'steady' ? 'text-green-700' : 'text-red-700'}`}>
                    {simulationResult === 'steady' ? 'AMAN!' : 'RUNTUH!'}
                  </h3>
                  <p className="text-stone-600 font-bold text-[10px] uppercase tracking-wider mt-1 opacity-60">Resultat Simulasi Berakhir</p>
                </div>
              </div>
              
              <p className="text-stone-600 font-bold text-xs leading-relaxed text-left border-y border-stone-100 py-3 mb-4">
                {simulationResult === 'steady' 
                  ? 'Kombinasi Etnosainsmu terbukti tangguh melindungi dari ancaman gempa.' 
                  : 'Struktur runtuh. Kaku & rapuh menjadi penyebab utama kegagalan.'}
              </p>

              <button 
                onClick={() => setSimulationResult(null)}
                className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-transform active:scale-95 ${
                  simulationResult === 'steady' ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {simulationResult === 'steady' ? 'COBA LAGI' : 'PERBAIKI DESAIN'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Mitigation Components ---

interface MitigationItem {
  id: string;
  text: string;
  isCorrect: boolean;
  detail: string;
}

function DraggableItem({ item, disabled }: { item: MitigationItem, disabled?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id, disabled });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 100 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`p-3 bg-white rounded-2xl border-2 border-stone-100 shadow-sm flex items-center gap-3 transition-all hover:border-blue-200 active:scale-105 ${disabled ? 'cursor-default opacity-50' : 'cursor-grab active:cursor-grabbing'}`}
    >
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${disabled ? 'bg-stone-100 text-stone-300' : 'bg-blue-50 text-blue-500'}`}>
        <Grab size={14} />
      </div>
      <span className="text-[10px] font-black text-stone-700 leading-tight">{item.text}</span>
    </div>
  );
}

function DropZone({ id, items, title, icon, color, showFeedback }: { 
  id: string, 
  items: MitigationItem[], 
  title: string, 
  icon: any, 
  color: string,
  showFeedback: boolean
}) {
  const { setNodeRef, isOver } = useSortable({ id });

  return (
    <div className="flex-1 flex flex-col gap-3">
      <div className={`p-4 rounded-[28px] border-4 flex items-center justify-center gap-2 shadow-sm ${color} transition-transform duration-300 ${isOver ? 'scale-105' : ''}`}>
        {icon}
        <span className="font-black italic uppercase tracking-tighter text-[10px]">{title}</span>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`flex-1 min-h-[320px] p-2 rounded-[32px] border-4 border-dashed transition-all duration-300 flex flex-col gap-2 ${
          isOver ? 'bg-blue-50 border-blue-400 scale-[1.02] shadow-xl' : 'bg-stone-50/50 border-stone-200'
        } ${items.length === 0 ? 'items-center justify-center' : ''}`}
      >
        {items.length === 0 ? (
          <div className="text-center space-y-1 opacity-20 pointer-events-none">
            <Grab size={24} className="mx-auto mb-2" />
            <p className="text-[8px] font-black uppercase tracking-[0.2em]">Tarik Ke Sini</p>
          </div>
        ) : (
          items.map(item => (
            <motion.div 
              key={item.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`p-3 rounded-2xl border-2 shadow-sm text-center relative overflow-hidden transition-all ${
                showFeedback 
                  ? (id === 'benar' && item.isCorrect) || (id === 'salah' && !item.isCorrect)
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-red-500 bg-red-50 text-red-700'
                  : 'border-white bg-white text-stone-800'
              }`}
            >
              <p className="text-[10px] font-black leading-tight">{item.text}</p>
              {showFeedback && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-1 pt-1 border-t border-current/10 text-[8px] font-bold opacity-80"
                >
                  {item.detail}
                </motion.div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function MitigasiPage() {
  const [initialItems] = useState<MitigationItem[]>([
    { id: '1', text: "Berlindung di bawah meja", isCorrect: true, detail: "Melindungi kepala dari reruntuhan." },
    { id: '2', text: "Lari ke arah lift & tangga", isCorrect: false, detail: "Bahaya terjebak jika listrik mati." },
    { id: '3', text: "Jauhi kaca & lemari besar", isCorrect: true, detail: "Menghindari pecahan kaca tajam." },
    { id: '4', text: "Tetap di gedung beton retak", isCorrect: false, detail: "Resiko runtuh saat gempa susulan." },
    { id: '5', text: "Gunakan tangga darurat", isCorrect: true, detail: "Akses aman saat evakuasi." },
    { id: '6', text: "Gunakan lift saat gempa", isCorrect: false, detail: "Rawan terjebak macet/rusak." },
  ]);

  const [pool, setPool] = useState<MitigationItem[]>(initialItems);
  const [benar, setBenar] = useState<MitigationItem[]>([]);
  const [salah, setSalah] = useState<MitigationItem[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveItemId(null);

    if (!over) return;

    const itemId = active.id;
    const overId = over.id;

    // Find the item in pool
    const item = pool.find(i => i.id === itemId);
    if (!item) return;

    if (overId === 'benar') {
      setBenar(prev => [...prev, item]);
      setPool(prev => prev.filter(i => i.id !== itemId));
    } else if (overId === 'salah') {
      setSalah(prev => [...prev, item]);
      setPool(prev => prev.filter(i => i.id !== itemId));
    }
  };

  const resetGame = () => {
    setPool(initialItems);
    setBenar([]);
    setSalah([]);
    setShowFeedback(false);
    setIsFinished(false);
  };

  const activeItemData = initialItems.find(i => i.id === activeItemId);

  return (
    <div className="p-6 space-y-6 bg-cream-bg min-h-[700px] flex flex-col items-center pb-40">
      <div className="text-center space-y-2 w-full">
        <div className="flex justify-center gap-2 mb-2">
          <span className="px-3 py-1 bg-brick-red text-white text-[10px] font-black rounded-full uppercase tracking-tighter shadow-sm">Fase Mitigasi</span>
        </div>
        <h2 className="text-3xl font-black text-stone-900 tracking-tighter uppercase leading-none italic drop-shadow-sm">Siaga Gempa</h2>
        <p className="text-brick-red/60 text-[10px] font-black uppercase tracking-widest leading-relaxed px-4">Tarik aksi ke kolom yang tepat!</p>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={({active}) => setActiveItemId(active.id as string)}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-3 w-full">
          <DropZone 
            id="benar" 
            title="Benar (✓)" 
            items={benar} 
            icon={<CheckCircle2 size={18} strokeWidth={3} />} 
            color="border-green-500 bg-green-500 text-white" 
            showFeedback={showFeedback}
          />
          <DropZone 
            id="salah" 
            title="Salah (×)" 
            items={salah} 
            icon={<XCircle size={18} strokeWidth={3} />} 
            color="border-red-500 bg-red-500 text-white" 
            showFeedback={showFeedback}
          />
        </div>

        <div className="w-full space-y-4 pt-4 border-t-2 border-stone-200/50 mt-2">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2">
              <MousePointer2 size={12} /> Daftar Aksi
            </h3>
            {pool.length > 0 && (
              <span className="text-[10px] font-black text-brick-red bg-brick-red/5 px-2 py-0.5 rounded-full animate-pulse">{pool.length} Tersisa</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <SortableContext items={pool.map(i => i.id)} strategy={verticalListSortingStrategy}>
              {pool.map((item) => (
                <DraggableItem key={item.id} item={item} disabled={showFeedback} />
              ))}
            </SortableContext>
          </div>
          
          {pool.length === 0 && !showFeedback && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-6 bg-brick-red/5 rounded-[32px] border-2 border-brick-red/20 border-dashed text-center shadow-inner"
            >
              <p className="text-xs font-black text-brick-red uppercase italic">Semua aksi sudah dipilah!</p>
              <p className="text-[10px] font-bold text-brick-red/50 mt-1 uppercase tracking-widest">Silahkan cek jawabanmu.</p>
            </motion.div>
          )}
        </div>

        <DragOverlay zIndex={1000}>
          {activeItemData ? (
            <div className="p-3 bg-white rounded-2xl border-4 border-brick-red shadow-2xl flex items-center gap-3 cursor-grabbing scale-110 rotate-3 ring-4 ring-brick-red/20">
              <div className="w-8 h-8 rounded-lg bg-brick-red text-white flex items-center justify-center shrink-0">
                <Grab size={14} />
              </div>
              <span className="text-[10px] font-black text-stone-900 leading-tight">{activeItemData.text}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <div className="flex gap-3 w-full pt-4">
        <button 
          onClick={resetGame}
          className="flex-1 py-4 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-[24px] font-black text-xs transition-all flex items-center justify-center gap-2 active:scale-95 border-b-4 border-stone-200"
        >
          <RefreshCcw size={16} /> ULANGI
        </button>
        <button 
          onClick={() => {
            setShowFeedback(true);
            const isAllCorrect = benar.every(i => i.isCorrect) && salah.every(i => !i.isCorrect) && benar.length + salah.length === initialItems.length;
            if (isAllCorrect) setIsFinished(true);
          }}
          disabled={pool.length > 0 || showFeedback}
          className={`flex-[2] py-4 rounded-[24px] font-black text-xs shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 ${
            pool.length > 0 || showFeedback
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed opacity-50' 
              : 'bg-brick-red text-white hover:bg-red-700 shadow-red-200 border-b-4 border-red-900'
          }`}
        >
          {showFeedback ? <LightbulbIcon size={16} /> : <Zap size={16} />} 
          {showFeedback ? 'HASIL SIMULASI' : 'CEK JAWABAN'}
        </button>
      </div>

      <AnimatePresence>
        {isFinished && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full p-8 bg-nias-gold rounded-[40px] border-4 border-white text-center space-y-4 shadow-2xl shadow-nias-gold/30 mt-4"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto shadow-inner">
              <ShieldAlert size={40} className="text-stone-900" />
            </div>
            <h3 className="text-2xl font-black text-stone-900 uppercase italic tracking-tighter">Ahli Mitigasi!</h3>
            <p className="text-stone-900 font-bold text-xs leading-relaxed uppercase tracking-widest opacity-90">Kamu layak mendapatkan lencana kesiapsiagaan.</p>
            <button 
              onClick={() => alert("Lencana Kesiapsiagaan Nias Berhasil Diklaim! 🏅")}
              className="w-full py-4 bg-brick-red text-white rounded-2xl font-black text-sm shadow-lg active:scale-95 transition-transform border-b-4 border-red-900"
            >
              KLAIM LENCANA SAYA
            </button>
          </motion.div>
        )}
      </AnimatePresence>


    </div>
  );
}

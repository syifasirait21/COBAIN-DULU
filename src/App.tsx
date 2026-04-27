/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
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
  Rotate3d
} from 'lucide-react';

// --- 3D Components ---

function OmoHadaModel() {
  const meshRef = useRef<THREE.Group>(null);

  return (
    <group ref={meshRef}>
      {/* Foundation Stones (Umpak) */}
      <mesh position={[-1.5, -1.8, -1]}>
        <boxGeometry args={[0.8, 0.4, 0.8]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      <mesh position={[1.5, -1.8, -1]}>
        <boxGeometry args={[0.8, 0.4, 0.8]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      <mesh position={[-1.5, -1.8, 1]}>
        <boxGeometry args={[0.8, 0.4, 0.8]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      <mesh position={[1.5, -1.8, 1]}>
        <boxGeometry args={[0.8, 0.4, 0.8]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>

      {/* Main Pillars (Ehomo) */}
      <mesh position={[-1.5, -0.8, -1]}>
        <cylinderGeometry args={[0.15, 0.15, 2]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      <mesh position={[1.5, -0.8, -1]}>
        <cylinderGeometry args={[0.15, 0.15, 2]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      <mesh position={[-1.5, -0.8, 1]}>
        <cylinderGeometry args={[0.15, 0.15, 2]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>
      <mesh position={[1.5, -0.8, 1]}>
        <cylinderGeometry args={[0.15, 0.15, 2]} />
        <meshStandardMaterial color="#5D4037" />
      </mesh>

      {/* Diagonal Supports (Diwa) */}
      <mesh position={[0, -0.8, -1]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[2.5, 0.1, 0.1]} />
        <meshStandardMaterial color="#4E342E" />
      </mesh>
      <mesh position={[0, -0.8, 1]} rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[2.5, 0.1, 0.1]} />
        <meshStandardMaterial color="#4E342E" />
      </mesh>

      {/* House Body (Floor) */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[4, 0.2, 3]} />
        <meshStandardMaterial color="#795548" />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 1.3, -1.4]}>
        <boxGeometry args={[3.8, 2, 0.1]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      <mesh position={[0, 1.3, 1.4]}>
        <boxGeometry args={[3.8, 2, 0.1]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      <mesh position={[-1.9, 1.3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[2.8, 2, 0.1]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
      <mesh position={[1.9, 1.3, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[2.8, 2, 0.1]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>

      {/* Iconic High Roof */}
      <mesh position={[0, 3.3, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[3, 3, 4]} />
        <meshStandardMaterial color="#3E2723" />
      </mesh>
    </group>
  );
}

function House3DViewer() {
  return (
    <div className="w-full h-[320px] bg-stone-100 rounded-3xl overflow-hidden relative border-2 border-stone-200 shadow-inner">
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-stone-200 text-stone-500 shadow-sm">
        <Rotate3d size={16} />
        <span className="text-[10px] font-bold uppercase tracking-wider">Model 3D Interaktif</span>
      </div>
      
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[8, 5, 10]} fov={35} />
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Suspense fallback={null}>
          <OmoHadaModel />
          <ContactShadows position={[0, -2, 0]} opacity={0.4} scale={15} blur={2.5} far={4} />
          <Environment preset="city" />
        </Suspense>

        <OrbitControls 
          enablePan={false} 
          minDistance={8} 
          maxDistance={15}
          autoRotate={false}
        />
      </Canvas>
    </div>
  );
}

// --- Main Application ---

type Page = 'mindful' | 'meaningful' | 'joyful' | 'mitigasi';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('mindful');
  const [isShaking, setIsShaking] = useState(false);

  const navItems = [
    { id: 'mindful', label: 'Mindful', icon: Heart },
    { id: 'meaningful', label: 'Meaningful', icon: Lightbulb },
    { id: 'joyful', label: 'Joyful', icon: Gamepad2 },
    { id: 'mitigasi', label: 'Mitigasi', icon: ShieldAlert },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-earth-bg overflow-hidden border-x border-stone-200">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 relative">
        <AnimatePresence mode="wait">
          {currentPage === 'mindful' && <MindfulPage key="mindful" onNext={() => setCurrentPage('meaningful')} />}
          {currentPage === 'meaningful' && <MeaningfulPage key="meaningful" />}
          {currentPage === 'joyful' && <JoyfulPage key="joyful" isShaking={isShaking} setIsShaking={setIsShaking} />}
          {currentPage === 'mitigasi' && <MitigasiPage key="mitigasi" />}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t border-stone-200 h-16 flex items-center justify-around fixed bottom-0 w-full max-w-md">
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

function MindfulPage({ onNext }: { onNext: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 space-y-6"
    >
      <header className="space-y-2">
        <span className="text-brick-red font-bold text-xs uppercase tracking-widest">Sejarah & Tragedi</span>
        <h1 className="text-3xl font-bold text-wood-dark leading-tight">Maret 2005,<br />Nias Berguncang</h1>
      </header>

      <div className="relative aspect-video bg-stone-200 rounded-2xl overflow-hidden group">
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center text-brick-red shadow-lg transform group-hover:scale-110 transition-transform">
            <Play fill="currentColor" className="ml-1" />
          </div>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1547841022-b558accc7ef8?q=80&w=1000&auto=format&fit=crop" 
          alt="History of Nias" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute bottom-4 left-4 right-4 text-white text-xs bg-black/40 p-2 rounded backdrop-blur-sm">
          Placeholder Video: Dokumentasi Gempa Nias 2005
        </div>
      </div>

      <div className="space-y-4 text-stone-700 leading-relaxed text-sm">
        <p>
          Bumi berguncang hebat di tengah malam. Di pusat kota, bangunan beton tinggi runtuh menjadi puing dalam sekejap. Isak tangis terdengar di mana-mana.
        </p>
        <div className="bg-wood-light/30 p-4 rounded-xl border border-wood-light/50 border-l-4 border-l-wood-dark">
          <p className="italic font-medium text-wood-dark">
            "Namun di pelosok desa, rumah-rumah panggung tua dari kayu justru tetap berdiri tegak, seolah menari mengikuti irama gempa."
          </p>
        </div>
        <p>
          Rumah itu adalah <strong>Omo Hada</strong>. Bagaimana mungkin bangunan kayu tanpa paku bisa lebih kuat dari beton bertulang?
        </p>
      </div>

      <button 
        onClick={onNext}
        className="w-full bg-brick-red text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brick-red/20 active:scale-95 transition-transform"
      >
        Selidiki Rahasianya
        <ChevronRight size={18} />
      </button>
    </motion.div>
  );
}

function MeaningfulPage() {
  const [activeTab, setActiveTab] = useState<'anatomy' | 'science'>('anatomy');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const anatomyDetails = {
    ehomo: {
      title: "Titik 1: Ehomo (Pondasi Batu)",
      desc: "Tiang kayu tidak ditanam di tanah, tapi diletakkan di atas batu datar. Ini membuat rumah bisa bergeser saat gempa tanpa patah."
    },
    diwa: {
      title: "Titik 2: Diwa (Tiang Menyilang)",
      desc: "Kayu dipasang menyilang membentuk huruf 'X'. Struktur ini sangat stabil namun fleksibel mengikuti guncangan."
    },
    paku: {
      title: "Titik 3: Tanpa Paku",
      desc: "Seluruh sambungan menggunakan sistem pasak kayu (lubang dan pengunci), bukan paku besi. Ini mencegah retakan pada sambungan."
    }
  };

  const playKnock = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      <div className="flex bg-stone-100 p-1 rounded-xl mb-6">
        <button 
          onClick={() => setActiveTab('anatomy')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'anatomy' ? 'bg-white shadow-sm text-wood-dark' : 'text-stone-400'}`}
        >
          Anatomi
        </button>
        <button 
          onClick={() => setActiveTab('science')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'science' ? 'bg-white shadow-sm text-wood-dark' : 'text-stone-400'}`}
        >
          Sains
        </button>
      </div>

      {activeTab === 'anatomy' ? (
        <div className="space-y-6">
          <div className="relative">
            <House3DViewer />
            
            {/* Hotspots Overlay */}
            <div className="absolute inset-0 pointer-events-none">
              <button 
                onClick={() => { playKnock(); setActiveModal('ehomo'); }}
                className="absolute bottom-1/4 left-1/3 pointer-events-auto p-2 group"
              >
                <div className="w-8 h-8 bg-brick-red text-white rounded-full flex items-center justify-center animate-pulse border-4 border-white/30 shadow-lg font-bold text-xs ring-4 ring-brick-red/20">1</div>
              </button>
              
              <button 
                onClick={() => { playKnock(); setActiveModal('diwa'); }}
                className="absolute top-1/2 right-1/2 translate-x-4 pointer-events-auto p-2 group"
              >
                <div className="w-8 h-8 bg-brick-red text-white rounded-full flex items-center justify-center animate-pulse border-4 border-white/30 shadow-lg font-bold text-xs ring-4 ring-brick-red/20" style={{ animationDelay: '0.5s' }}>2</div>
              </button>
              
              <button 
                onClick={() => { playKnock(); setActiveModal('paku'); }}
                className="absolute top-1/3 right-1/3 pointer-events-auto p-2 group"
              >
                <div className="w-8 h-8 bg-brick-red text-white rounded-full flex items-center justify-center animate-pulse border-4 border-white/30 shadow-lg font-bold text-xs ring-4 ring-brick-red/20" style={{ animationDelay: '1s' }}>3</div>
              </button>
            </div>
          </div>

          <div className="bg-wood-light/20 p-5 rounded-3xl border-2 border-wood-light/50 border-dashed">
            <p className="text-xs text-wood-dark leading-relaxed font-bold flex items-center gap-2">
              <Info size={14} />
              Klik angka di atas untuk pelajari rahasia konstruksinya!
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-3 text-brick-red">
              <RefreshCcw size={24} />
              <h3 className="font-bold text-lg">Konsep Inersia</h3>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              Inersia adalah sifat benda untuk mempertahankan keadaannya. Saat tanah bergerak mendadak, beban berat rumah Omo Hada cenderung tetap diam, membuat getaran tanah tidak langsung merambat naik ke seluruh bangunan.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
             <div className="flex items-center gap-3 text-brick-red">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
                <CheckCircle2 size={24} />
              </motion.div>
              <h3 className="font-bold text-lg">Konsep Elastisitas</h3>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              Bahan kayu memiliki elastisitas yang lebih baik dibanding beton. Kayu bisa melengkung dan kembali ke bentuk semula tanpa pecah, menyerap energi gempa seperti pegas raksasa.
            </p>
          </div>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 shadow-2xl max-w-xs w-full space-y-4 border-2 border-wood-dark"
            >
              <h3 className="text-xl font-bold text-wood-dark border-b pb-2">
                {anatomyDetails[activeModal as keyof typeof anatomyDetails].title}
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                {anatomyDetails[activeModal as keyof typeof anatomyDetails].desc}
              </p>
              <button 
                onClick={() => setActiveModal(null)}
                className="w-full bg-wood-dark text-white font-bold py-3 rounded-xl active:scale-95 transition-transform"
              >
                Mengerti!
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
function JoyfulPage({ isShaking, setIsShaking }: { isShaking: boolean, setIsShaking: (v: boolean) => void }) {
  const [pondasi, setPondasi] = useState<string>('');
  const [sambungan, setSambungan] = useState<string>('');
  const [simulationResult, setSimulationResult] = useState<'steady' | 'collapsed' | null>(null);

  const handleSimulate = () => {
    if (!pondasi || !sambungan) {
      return;
    }

    // Sound effects
    const earthquakeSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3');
    const successSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
    const failureSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    
    earthquakeSound.volume = 0.5;
    earthquakeSound.play().catch(() => {}); // Catch browser auto-play restrictions

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
    }, 2000);
  };

  // Reset result when changing selection
  useEffect(() => {
    setSimulationResult(null);
  }, [pondasi, sambungan]);

  return (
    <div className={`p-6 space-y-8 flex flex-col items-center ${isShaking ? 'animate-earthquake' : ''}`}>
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-black text-brick-red uppercase italic">Guncang Nias!</h2>
        <p className="text-stone-500 text-sm">Uji desain rumahmu melawan gempa.</p>
      </div>

      <div className="w-full space-y-6">
        <div className="space-y-3">
          <label className="text-sm font-bold text-wood-dark block px-2">Pilih Pondasi:</label>
          <div className="flex gap-2">
            <button 
              onClick={() => setPondasi('semen')}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all ${pondasi === 'semen' ? 'border-red-500 bg-red-50 text-red-600' : 'border-stone-200 text-stone-400'}`}
            >
              <div className="text-xs font-bold uppercase mb-1">Semen Tanam</div>
              <div className="text-[10px] opacity-60 font-medium">Beresiko Tinggi</div>
            </button>
            <button 
              onClick={() => setPondasi('umpak')}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all ${pondasi === 'umpak' ? 'border-green-500 bg-green-50 text-green-600' : 'border-stone-200 text-stone-400'}`}
            >
              <div className="text-xs font-bold uppercase mb-1">Umpak Batu</div>
              <div className="text-[10px] opacity-60 font-medium">Sangat Aman</div>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-bold text-wood-dark block px-2">Pilih Sambungan:</label>
          <div className="flex gap-2">
            <button 
              onClick={() => setSambungan('paku')}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all ${sambungan === 'paku' ? 'border-red-500 bg-red-50 text-red-600' : 'border-stone-200 text-stone-400'}`}
            >
              <div className="text-xs font-bold uppercase mb-1">Paku Besi</div>
              <div className="text-[10px] opacity-60 font-medium">Mudah Patah</div>
            </button>
            <button 
              onClick={() => setSambungan('pasak')}
              className={`flex-1 p-4 rounded-2xl border-2 transition-all ${sambungan === 'pasak' ? 'border-green-500 bg-green-50 text-green-600' : 'border-stone-200 text-stone-400'}`}
            >
              <div className="text-xs font-bold uppercase mb-1">Pasak Kayu</div>
              <div className="text-[10px] opacity-60 font-medium">Sangat Fleksibel</div>
            </button>
          </div>
        </div>

        <button 
          onClick={handleSimulate}
          disabled={isShaking || !pondasi || !sambungan}
          className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all ${
            isShaking 
              ? 'bg-stone-300' 
              : (!pondasi || !sambungan) 
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-brick-red text-white hover:brightness-110 active:scale-95'
          }`}
        >
          {isShaking ? 'SEDANG GEMPA...' : 'SIMULASIKAN GEMPA'}
        </button>
      </div>

      <div className="mt-4 flex flex-col items-center w-full">
        <div className="w-64 h-48 bg-stone-100 rounded-2xl relative overflow-hidden flex items-end justify-center border border-stone-200">
          <svg viewBox="0 0 200 120" className="w-full h-full">
            <motion.g 
              animate={simulationResult === 'collapsed' ? { rotate: -10, y: 15 } : { rotate: 0, y: 0 }}
              transition={{ type: 'spring', stiffness: 50 }}
              style={{ transformOrigin: 'center 100px' }}
            >
              {/* Foundation */}
              <rect x="50" y="80" width="100" height="40" rx="4" fill={pondasi ? (pondasi === 'umpak' ? '#D7CCC8' : '#90A4AE') : '#E0E0E0'} />
              
              {/* Main Structure Group */}
              <motion.g animate={simulationResult === 'collapsed' ? { x: [0, -2, 2, 0] } : {}}>
                <path d="M40 80 L100 20 L160 80 Z" fill="#5D4037" />
                <rect x="70" y="80" width="8" height="40" fill="#3E2723" />
                <rect x="122" y="80" width="8" height="40" fill="#3E2723" />
                
                {/* Visual Cracks for Collapsed state */}
                {simulationResult === 'collapsed' && (
                  <g stroke="#B71C1C" strokeWidth="2">
                    <line x1="90" y1="90" x2="110" y2="105" />
                    <line x1="80" y1="40" x2="95" y2="55" />
                  </g>
                )}
              </motion.g>
            </motion.g>

            {/* Shaking indicators */}
            {isShaking && (
              <motion.path 
                animate={{ opacity: [0, 1, 0], x: [-5, 5, -5] }}
                transition={{ repeat: Infinity, duration: 0.2 }}
                d="M20 110 L180 110" stroke="#B71C1C" strokeWidth="2" strokeDasharray="8 4" 
              />
            )}
          </svg>
        </div>
        <div className="w-72 h-4 bg-stone-300 rounded-full mt-[-8px] shadow-sm" />
      </div>

      <AnimatePresence>
        {simulationResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`w-full max-w-xs p-8 bg-white rounded-[40px] border-4 shadow-2xl text-center space-y-6 ${
                simulationResult === 'steady' ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <div className={`text-5xl mx-auto w-24 h-24 rounded-full flex items-center justify-center shadow-inner ${
                simulationResult === 'steady' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {simulationResult === 'steady' ? <CheckCircle2 size={48} strokeWidth={3} /> : <XCircle size={48} strokeWidth={3} />}
              </div>
              
              <div className="space-y-2">
                <h3 className={`text-2xl font-black uppercase tracking-tight ${simulationResult === 'steady' ? 'text-green-700' : 'text-red-700'}`}>
                  {simulationResult === 'steady' ? 'Tangguh!' : 'Runtuh!'}
                </h3>
                <p className="text-sm text-stone-600 font-medium leading-relaxed">
                  {simulationResult === 'steady' 
                    ? 'Luar biasa! Rumah Omo Hada-mu selamat. Fleksibilitas adalah kunci kekuatan sejati.' 
                    : 'Aduh! Rumahmu berantakan. Bangunan yang terlalu kaku akan hancur saat diguncang gempa.'}
                </p>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => setSimulationResult(null)}
                  className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-transform active:scale-95 ${
                    simulationResult === 'steady' ? 'bg-green-500 shadow-green-200' : 'bg-red-500 shadow-red-200'
                  }`}
                >
                  {simulationResult === 'steady' ? 'Coba Kombinasi Lain' : 'Perbaiki Strategi'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MitigasiPage() {
  const [selectedActions, setSelectedActions] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [showResult, setShowResult] = useState<'correct' | 'wrong' | null>(null);

  const actions = [
    { id: 1, text: "Berlindung di bawah meja", isCorrect: true, detail: "Melindungi kepala dari reruntuhan." },
    { id: 2, text: "Lari ke arah lift", isCorrect: false, detail: "Bahaya terjebak jika listrik mati." },
    { id: 3, text: "Jauhi kaca & lemari besar", isCorrect: true, detail: "Menghindari pecahan kaca & benda jatuh." },
    { id: 4, text: "Tetap di dalam rumah beton retak", isCorrect: false, detail: "Resiko runtuh saat gempa susulan." },
  ];

  const handleToggle = (id: number) => {
    if (isFinished || showResult === 'correct') return;
    if (selectedActions.includes(id)) {
      setSelectedActions(selectedActions.filter(aid => aid !== id));
    } else {
      setSelectedActions([...selectedActions, id]);
    }
  };

  const checkResult = () => {
    const correctIds = actions.filter(a => a.isCorrect).map(a => a.id);
    const isCorrect = selectedActions.length === correctIds.length && 
                      selectedActions.every(id => correctIds.includes(id));
    
    if (isCorrect) {
      setShowResult('correct');
    } else {
      setShowResult('wrong');
    }
  };

  return (
    <div className="p-6 space-y-8 pb-32">
      <header className="space-y-2">
        <span className="text-brick-red font-bold text-xs uppercase tracking-widest italic">Uji Pengetahuan</span>
        <h2 className="text-3xl font-black text-wood-dark tracking-tight">Zona Mitigasi</h2>
        <p className="text-sm text-stone-500 font-medium">Mana aksi yang benar saat gempa? Pilih semua yang tepat:</p>
      </header>

      <div className="grid gap-3">
        {actions.map((action) => {
          const isSelected = selectedActions.includes(action.id);
          const isCorrect = action.isCorrect;
          const showFeedback = showResult !== null;

          return (
            <motion.button
              key={action.id}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleToggle(action.id)}
              className={`p-5 rounded-3xl text-left border-2 transition-all relative overflow-hidden ${
                showFeedback
                  ? (isSelected === isCorrect && isCorrect)
                    ? 'border-green-500 bg-green-50/50'
                    : (isSelected && !isCorrect)
                      ? 'border-red-500 bg-red-50/50'
                      : 'border-stone-100 bg-stone-50'
                  : isSelected 
                    ? 'border-brick-red bg-brick-red/5' 
                    : 'border-stone-200 bg-white'
              }`}
            >
              <div className="flex items-center justify-between relative z-10">
                <span className={`font-bold transition-colors ${
                  showFeedback 
                    ? (isCorrect ? 'text-green-700' : 'text-stone-400')
                    : isSelected ? 'text-brick-red' : 'text-stone-700'
                }`}>
                  {action.text}
                </span>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  showFeedback
                    ? (isCorrect ? 'bg-green-500 border-green-500 text-white' : 'border-stone-300')
                    : isSelected ? 'bg-brick-red border-brick-red text-white' : 'border-stone-300'
                }`}>
                  {(isSelected || (showFeedback && isCorrect)) && <CheckCircle2 size={14} strokeWidth={3} />}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <div className="space-y-4">
        {!isFinished && (
          <button 
            onClick={checkResult}
            disabled={selectedActions.length === 0}
            className={`w-full py-5 rounded-2xl font-black text-xl shadow-xl transition-all ${
              selectedActions.length === 0
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                : 'bg-wood-dark text-white hover:brightness-110 active:scale-95'
            }`}
          >
            KIRIM JAWABAN
          </button>
        )}

        {isFinished && (
          <div className="text-center p-6 bg-yellow-50 rounded-3xl border-2 border-yellow-200 border-dashed">
            <p className="text-sm font-bold text-yellow-700 mb-4 animate-bounce">Lencana Siaga Tersedia! 🏅</p>
            <button 
              className="w-full bg-yellow-500 text-white font-black py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
              onClick={() => alert("Membuka Portal Lencana...")}
            >
              LIHAT LENCANA SAYA
            </button>
          </div>
        )}
      </div>

      {/* Result Modals */}
      <AnimatePresence>
        {showResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`w-full max-w-xs p-8 bg-white rounded-[40px] border-4 shadow-2xl text-center space-y-6 ${
                showResult === 'correct' ? 'border-green-500' : 'border-red-500'
              }`}
            >
              <div className={`text-5xl mx-auto w-24 h-24 rounded-full flex items-center justify-center shadow-inner ${
                showResult === 'correct' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {showResult === 'correct' ? <CheckCircle2 size={48} strokeWidth={3} /> : <XCircle size={48} strokeWidth={3} />}
              </div>
              
              <div className="space-y-2">
                <h3 className={`text-2xl font-black uppercase tracking-tight ${showResult === 'correct' ? 'text-green-700' : 'text-red-700'}`}>
                  {showResult === 'correct' ? 'Luar Biasa!' : 'Belum Tepat'}
                </h3>
                <p className="text-sm text-stone-600 font-medium leading-relaxed">
                  {showResult === 'correct' 
                    ? 'Kamu paham betul cara menyelamatkan diri. Sekarang kamu layak mendapatkan lencana!' 
                    : 'Ada beberapa aksi yang membahayakan diri. Yuk, pelajari lagi mitigasi yang aman.'}
                </p>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => {
                    if (showResult === 'correct') {
                      setIsFinished(true);
                    }
                    setShowResult(null);
                  }}
                  className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-transform active:scale-95 ${
                    showResult === 'correct' ? 'bg-green-500 shadow-green-200' : 'bg-red-500 shadow-red-200'
                  }`}
                >
                  {showResult === 'correct' ? 'Klaim Lencana' : 'Coba Lagi'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Badge View (if isFinished) */}
      <AnimatePresence>
        {isFinished && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed inset-0 z-[60] bg-wood-dark flex flex-col items-center justify-center p-8 text-center"
          >
            <motion.div 
              animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-48 h-48 bg-yellow-400 rounded-full flex items-center justify-center border-[12px] border-yellow-200 shadow-[0_0_50px_rgba(250,204,21,0.5)] mb-8"
            >
              <ShieldAlert size={100} className="text-white" />
            </motion.div>
            
            <h1 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">Siaga Gempa!</h1>
            <p className="text-yellow-400 font-bold mb-12">Lencana Ahli Mitigasi Nias</p>

            <div className="w-full space-y-3">
              <button 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: 'Lencana Siaga Gempa Nias',
                      text: 'Saya sudah belajar mitigasi gempa melalui Nias Quake-Wise App!',
                      url: window.location.href,
                    });
                  } else {
                    alert('Lencana disimpan!');
                  }
                }}
                className="w-full bg-white text-wood-dark font-black py-5 rounded-2xl shadow-xl active:scale-95 transition-transform"
              >
                BAGIKAN KE TEMAN
              </button>
              <button 
                onClick={() => setIsFinished(false)}
                className="text-white/40 font-bold text-sm"
              >
                Tutup Galeri
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-stone-100 p-6 rounded-3xl border border-stone-200 flex gap-4 items-center">
        <div className="bg-wood-dark p-3 rounded-2xl text-white">
          <Info size={24} />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-wood-dark text-sm">Metode 20-20-20</h4>
          <p className="text-[10px] leading-relaxed text-stone-500 font-medium">
            Gempa {">"} 20 detik? Lari ke tempat setinggi 20m dalam 20 menit!
          </p>
        </div>
      </div>
    </div>
  );
}

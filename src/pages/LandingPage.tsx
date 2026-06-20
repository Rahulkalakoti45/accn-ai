import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  ChevronDown, 
  AlertTriangle, 
  Cpu, 
  ShieldCheck, 
  Coins, 
  Globe, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { Earth3D } from '../components/Earth3D';
import { useStore } from '../store/useStore';

// Helper component for counting up numbers using requestAnimationFrame
const Counter: React.FC<{ value: number; decimals?: number; suffix?: string; prefix?: string; duration?: number }> = ({ 
  value, decimals = 0, suffix = '', prefix = '', duration = 1.5 
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let rAFId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(progress * value);
      if (progress < 1) {
        rAFId = window.requestAnimationFrame(step);
      }
    };
    rAFId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rAFId);
  }, [value, duration]);

  return (
    <span className="font-heading font-extrabold text-3xl md:text-4xl tracking-tight text-white">
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
};

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { liveFeed } = useStore();
  const [activeStep, setActiveStep] = useState(1);
  const [problemStep, setProblemStep] = useState(1);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Auto-cycle the greenwashing problem animation
  useEffect(() => {
    const timer = setInterval(() => {
      setProblemStep((prev) => (prev % 5) + 1);
    }, 2200);
    return () => clearInterval(timer);
  }, []);

  // Marketplace preview sellers
  const [previewListings, setPreviewListings] = useState([
    { id: 1, seller: 'Rahul K.', trust: 98, credits: 5, price: 120, type: 'Solar' },
    { id: 2, seller: 'Priya M.', trust: 95, credits: 12, price: 115, type: 'Wind' },
    { id: 3, seller: 'Arun S.', trust: 92, credits: 3, price: 110, type: 'Home Solar' },
  ]);

  // Insert a mock new seller listing every 4 seconds
  useEffect(() => {
    const names = ['Kishore J.', 'Nisha G.', 'Dheeraj P.', 'Aditi V.', 'Vikram S.'];
    const types = ['Solar', 'Wind', 'Home Solar'];
    
    const interval = setInterval(() => {
      const newListing = {
        id: Date.now(),
        seller: names[Math.floor(Math.random() * names.length)],
        trust: Math.floor(Math.random() * 10) + 90,
        credits: Math.floor(Math.random() * 20) + 1,
        price: Math.floor(Math.random() * 20) + 110,
        type: types[Math.floor(Math.random() * types.length)]
      };
      
      setPreviewListings((prev) => [newListing, prev[0], prev[1]]);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const timelineSteps = [
    { 
      step: 1, 
      title: 'Upload Bill', 
      icon: '📄', 
      desc: 'Users connect their smart meters or upload utility billing records through our secure dashboard panel.' 
    },
    { 
      step: 2, 
      title: 'AI Scans', 
      icon: '🤖', 
      desc: 'Our neural networks scan consumption signatures, detecting exact offsets and excluding non-green patterns.' 
    },
    { 
      step: 3, 
      title: 'Trust Score', 
      icon: '⭐', 
      desc: 'An automated compliance score is calculated, showing grid health, history completeness, and anomaly vectors.' 
    },
    { 
      step: 4, 
      title: 'Mint Credits', 
      icon: '🪙', 
      desc: 'Carbon credits are tokenized on chain (ERC-20 standard). Each represents verified CO₂ metrics offset.' 
    },
    { 
      step: 5, 
      title: 'Sell Credit', 
      icon: '🏭', 
      desc: 'Credits are automatically listed on our global marketplace where industrial buyers purchase certified ESG metrics.' 
    },
  ];

  return (
    <div className="w-full flex flex-col relative">
      {/* Landing Header */}
      <header className="absolute top-0 left-0 right-0 h-20 z-50 flex items-center justify-between px-6 md:px-12">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <span className="text-2xl font-bold tracking-wider font-heading text-gradient-green-cyan uppercase">
            ACCN
          </span>
          <div className="w-2 h-2 rounded-full bg-accentGreen" />
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2.5 rounded-xl border border-accentGreen/30 bg-accentGreen/10 text-accentGreen hover:bg-accentGreen hover:text-bgSpace transition-all hover:scale-105 shadow-neon-green/10 hover:shadow-neon-green"
        >
          Enter Console &rarr;
        </button>
      </header>

      {/* 1.1 Hero Section */}
      <section className="min-h-screen relative flex items-center pt-20">
        {/* Three.js Canvas Container (50% right on large displays) */}
        <div className="absolute top-0 right-0 w-full lg:w-[50%] h-full z-0 opacity-40 lg:opacity-100 pointer-events-none">
          <Earth3D />
        </div>

        <div className="container mx-auto px-6 md:px-12 z-10 flex flex-col gap-6 w-full lg:max-w-[50%] lg:mx-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="self-start flex items-center gap-2 px-3 py-1.5 rounded-full border border-accentGreen/30 bg-accentGreen/5 text-xs text-accentGreen font-semibold uppercase tracking-wider"
          >
            <span>🌿</span>
            <span>AI-Powered Energy Intelligence</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-5xl md:text-7xl font-extrabold font-heading leading-tight tracking-tight text-white"
          >
            Your Energy. <br />
            Your Carbon. <br />
            <span className="text-gradient-green-cyan">Your Future.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-base md:text-lg text-textSecondary max-w-lg leading-relaxed font-sans"
          >
            Track consumption. Build trust. Trade carbon credits. Verify your green credentials in real-time.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap items-center gap-4 mt-2"
          >
            <button
              onClick={() => navigate('/auth')}
              className="btn-primary shadow-neon-green/20"
            >
              Get Started Free
            </button>
            <button 
              onClick={() => {
                const howItWorks = document.getElementById('how-it-works-timeline');
                if (howItWorks) howItWorks.scrollIntoView({ behavior: 'smooth' });
              }}
              className="btn-ghost"
            >
              See How It Works
            </button>
          </motion.div>

          {/* Counters Row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-wrap items-center gap-6 pt-10 border-t border-cardBorder max-w-xl w-full text-center sm:text-left"
          >
            <div className="flex-grow flex flex-col">
              <Counter value={2.4} decimals={1} suffix="M+ kWh" />
              <span className="text-xs text-textSecondary mt-1 font-sans select-none">Tracked</span>
            </div>
            <div className="w-px h-12 bg-cardBorder flex-shrink-0" />
            <div className="flex-grow flex flex-col">
              <Counter value={12400} suffix="+" />
              <span className="text-xs text-textSecondary mt-1 font-sans select-none">Credits Traded</span>
            </div>
            <div className="w-px h-12 bg-cardBorder flex-shrink-0" />
            <div className="flex-grow flex flex-col">
              <Counter value={98} suffix="%" />
              <span className="text-xs text-textSecondary mt-1 font-sans select-none">Trust Accuracy</span>
            </div>
          </motion.div>
        </div>

        {/* Bouncing Chevron Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-10 select-none">
          <span className="text-[10px] text-textMuted font-mono tracking-widest uppercase">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 text-accentGreen animate-bounce" />
        </div>
      </section>

      {/* 1.2 Problem Section */}
      <section className="min-h-screen py-24 bg-bgSpace flex flex-col justify-center border-t border-cardBorder relative">
        <div className="container mx-auto px-6 md:px-12 flex flex-col gap-12 items-center">
          <div className="text-center max-w-xl flex flex-col gap-2">
            <span className="text-xs font-bold font-mono text-danger uppercase tracking-widest">Market Vulnerability</span>
            <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-white">The Greenwashing Problem</h2>
            <p className="text-sm text-textSecondary mt-2">
              Carbon trading markets are currently plagued by unverified emission claims, double-counting, and a total lack of traceability.
            </p>
          </div>

          {/* Interactive Screen Animation Sequence */}
          <div className="w-full max-w-2xl h-80 rounded-2xl border border-cardBorder bg-cardSurface/40 flex items-center justify-center p-6 relative overflow-hidden glass-panel">
            {/* grid lines */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />
            
            <AnimatePresence mode="wait">
              {problemStep === 1 && (
                <motion.div
                  key="p1"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-3xl shadow-lg">
                    🏢
                  </div>
                  <h3 className="text-xl font-bold font-heading text-white">Traditional Energy Claims</h3>
                  <p className="text-xs text-textSecondary max-w-md">
                    "We have offset our energy footprint entirely and are certified 100% Carbon Neutral!"
                  </p>
                </motion.div>
              )}

              {problemStep === 2 && (
                <motion.div
                  key="p2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center text-3xl shadow-lg">
                    ⚠️
                  </div>
                  <h3 className="text-xl font-bold font-heading text-danger">Validation Failure</h3>
                  <p className="text-xs text-textSecondary max-w-md">
                    No physical smart meter syncing. No real-time energy export check. No verified compliance reports.
                  </p>
                </motion.div>
              )}

              {problemStep === 3 && (
                <motion.div
                  key="p3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center flex flex-col items-center gap-4"
                >
                  <div className="w-20 h-20 rounded-full bg-danger/20 border border-danger flex items-center justify-center text-4xl shadow-lg font-black text-danger animate-pulse">
                    X
                  </div>
                  <h3 className="text-xl font-bold font-heading text-danger">No Verification</h3>
                  <p className="text-xs text-textSecondary max-w-md">
                    Claims are self-reported. Highly suspect audits. Double-counted assets.
                  </p>
                </motion.div>
              )}

              {problemStep === 4 && (
                <motion.div
                  key="p4"
                  initial={{ opacity: 0, scale: 1 }}
                  animate={{ 
                    opacity: 1, 
                    x: [0, -10, 10, -10, 10, 0],
                    rotate: [0, -1, 1, -1, 1, 0]
                  }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.5 }}
                  className="text-center flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/30 flex items-center justify-center text-3xl">
                    ⚡
                  </div>
                  <h3 className="text-xl font-bold font-heading text-danger uppercase tracking-wider">Audit Collapse</h3>
                  <p className="text-xs text-textSecondary max-w-md">
                    Regulators reject double-counted offset assets. Trust values shivered.
                  </p>
                </motion.div>
              )}

              {problemStep === 5 && (
                <motion.div
                  key="p5"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center flex flex-col items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-accentGreen/10 border border-accentGreen/30 flex items-center justify-center text-3xl text-accentGreen shadow-neon-green">
                    🌿
                  </div>
                  <h3 className="text-xl font-bold font-heading text-gradient-green-cyan">ACCN Trust Network</h3>
                  <p className="text-xs text-accentGreen font-semibold">
                    Real-time AI Verification. Blockchain Authenticity. Zero greenwashing.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Stepper progress line */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`w-8 h-1 rounded-full transition-colors duration-300 ${
                    problemStep === step ? 'bg-accentGreen shadow-neon-green' : 'bg-cardBorder'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Red/Orange glass stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <div className="p-6 rounded-2xl border border-danger/20 bg-danger/5 backdrop-blur-md flex flex-col gap-2">
              <span className="font-mono text-3xl font-bold text-danger">$40 Billion</span>
              <span className="text-sm font-semibold text-textPrimary">Lost to Greenwashing</span>
              <p className="text-xs text-textSecondary">Unverified and double-counted carbon projects sold annually globally.</p>
            </div>
            <div className="p-6 rounded-2xl border border-warning/20 bg-warning/5 backdrop-blur-md flex flex-col gap-2">
              <span className="font-mono text-3xl font-bold text-warning">92%</span>
              <span className="text-sm font-semibold text-textPrimary">Claims Unverified</span>
              <p className="text-xs text-textSecondary">Total volume of consumer-facing carbon neutrality certificates lack physical verification.</p>
            </div>
            <div className="p-6 rounded-2xl border border-danger/20 bg-danger/5 backdrop-blur-md flex flex-col gap-2">
              <span className="font-mono text-3xl font-bold text-danger">0 Standards</span>
              <span className="text-sm font-semibold text-textPrimary">Global Trust Metrics</span>
              <p className="text-xs text-textSecondary">No singular dynamic auditing benchmark to authenticate energy production source compliance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 1.3 Solution / Architecture Section */}
      <section className="min-h-screen py-24 bg-bgMidnight flex flex-col justify-center border-t border-cardBorder relative">
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Interactive Architecture SVG Diagram */}
          <div className="flex justify-center relative order-2 lg:order-1">
            <div className="w-[450px] h-[400px] border border-cardBorder rounded-2xl bg-cardSurface/40 flex items-center justify-center p-6 relative overflow-hidden glass-panel">
              <svg viewBox="0 0 400 360" className="w-full h-full">
                {/* Node connection path lines with pulsing dots */}
                <path d="M 70,80 L 200,80 L 200,160 L 200,240 L 70,240" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 200,80 L 330,80 L 330,240 L 200,240" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="2" strokeDasharray="4 4" />
                
                {/* Flowing particle animation on path */}
                <motion.circle
                  r="4"
                  fill="#00FF88"
                  filter="drop-shadow(0 0 3px #00FF88)"
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                  style={{
                    motionPath: "path('M 70,80 L 200,80 L 200,160 L 200,240 L 70,240')",
                  }}
                />
                
                <motion.circle
                  r="4"
                  fill="#00D4FF"
                  filter="drop-shadow(0 0 3px #00D4FF)"
                  initial={{ offsetDistance: "0%" }}
                  animate={{ offsetDistance: "100%" }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: 2.5 }}
                  style={{
                    motionPath: "path('M 200,80 L 330,80 L 330,240 L 200,240')",
                  }}
                />

                {/* Nodes */}
                {/* 1. Smart Meter */}
                <g 
                  className="cursor-pointer" 
                  onMouseEnter={() => setHoveredNode('smart_meter')} 
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => navigate('/settings')}
                >
                  <rect x="20" y="50" width="100" height="60" rx="8" fill="#111827" stroke={hoveredNode === 'smart_meter' ? '#00FF88' : '#1E2D45'} strokeWidth="1.5" />
                  <text x="70" y="80" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">SMART METER</text>
                  <text x="70" y="95" textAnchor="middle" fill="#F1F5F9" fontSize="11" fontWeight="bold">Grid Sync</text>
                </g>

                {/* 2. AI Scanner */}
                <g 
                  className="cursor-pointer" 
                  onMouseEnter={() => setHoveredNode('ai_scanner')} 
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => navigate('/analytics')}
                >
                  <rect x="150" y="50" width="100" height="60" rx="8" fill="#111827" stroke={hoveredNode === 'ai_scanner' ? '#00D4FF' : '#1E2D45'} strokeWidth="1.5" />
                  <text x="200" y="80" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">AI DATA SCAN</text>
                  <text x="200" y="95" textAnchor="middle" fill="#F1F5F9" fontSize="11" fontWeight="bold">Verification</text>
                </g>

                {/* 3. Trust Engine */}
                <g 
                  className="cursor-pointer" 
                  onMouseEnter={() => setHoveredNode('trust_engine')} 
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => navigate('/trust-score')}
                >
                  <rect x="150" y="130" width="100" height="60" rx="8" fill="#111827" stroke={hoveredNode === 'trust_engine' ? '#7C3AED' : '#1E2D45'} strokeWidth="1.5" />
                  <text x="200" y="160" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">TRUST ENGINE</text>
                  <text x="200" y="175" textAnchor="middle" fill="#F1F5F9" fontSize="11" fontWeight="bold">Score: 96%</text>
                </g>

                {/* 4. Minting */}
                <g 
                  className="cursor-pointer" 
                  onMouseEnter={() => setHoveredNode('minting')} 
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => navigate('/wallet')}
                >
                  <rect x="150" y="210" width="100" height="60" rx="8" fill="#111827" stroke={hoveredNode === 'minting' ? '#F59E0B' : '#1E2D45'} strokeWidth="1.5" />
                  <text x="200" y="240" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">TOKEN MINT</text>
                  <text x="200" y="255" textAnchor="middle" fill="#F1F5F9" fontSize="11" fontWeight="bold">ERC-20 Mint</text>
                </g>

                {/* 5. Marketplace */}
                <g 
                  className="cursor-pointer" 
                  onMouseEnter={() => setHoveredNode('marketplace')} 
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => navigate('/marketplace')}
                >
                  <rect x="280" y="50" width="100" height="60" rx="8" fill="#111827" stroke={hoveredNode === 'marketplace' ? '#00FF88' : '#1E2D45'} strokeWidth="1.5" />
                  <text x="330" y="80" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">MARKETPLACE</text>
                  <text x="330" y="95" textAnchor="middle" fill="#F1F5F9" fontSize="11" fontWeight="bold">Trade Desk</text>
                </g>

                {/* 6. Industry Buyer */}
                <g 
                  className="cursor-pointer" 
                  onMouseEnter={() => setHoveredNode('buyer')} 
                  onMouseLeave={() => setHoveredNode(null)}
                  onClick={() => navigate('/esg-reports')}
                >
                  <rect x="280" y="210" width="100" height="60" rx="8" fill="#111827" stroke={hoveredNode === 'buyer' ? '#00D4FF' : '#1E2D45'} strokeWidth="1.5" />
                  <text x="330" y="240" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="monospace">INDUSTRY BUYER</text>
                  <text x="330" y="255" textAnchor="middle" fill="#F1F5F9" fontSize="11" fontWeight="bold">ESG Offsets</text>
                </g>
              </svg>

              {/* Tooltip Overlay */}
              <div className="absolute bottom-3 left-4 right-4 bg-bgSpace/90 border border-cardBorder rounded-lg p-2 text-center text-xs">
                {hoveredNode === 'smart_meter' && 'Smart Meter: Syncs live generation metrics with cryptographic signatures.'}
                {hoveredNode === 'ai_scanner' && 'AI Scanner: Excludes duplicate claims & extracts exact offset kWh data.'}
                {hoveredNode === 'trust_engine' && 'Trust Engine: Generates dynamic scores (96% avg) based on consistency & meter status.'}
                {hoveredNode === 'minting' && 'Token Mint: Generates certified ERC-20 carbon tokens representing verified kg offsets.'}
                {hoveredNode === 'marketplace' && 'Marketplace: Liquid trading hub matching verified sellers with ESG compliance buyers.'}
                {hoveredNode === 'buyer' && 'Industry Buyer: Purchases credits to fulfill ESG corporate mandates securely.'}
                {!hoveredNode && 'Hover nodes to trace carbon network compliance path.'}
              </div>
            </div>
          </div>

          {/* Right Panel Feature Pills */}
          <div className="flex flex-col gap-6 order-1 lg:order-2">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold font-mono text-accentGreen uppercase tracking-widest">Technological Core</span>
              <h2 className="text-4xl font-extrabold font-heading text-white">How ACCN Solves This</h2>
              <p className="text-sm text-textSecondary mt-1 leading-relaxed">
                By tying carbon creation directly to physical hardware IoT data and validating it through AI confidence indexes, ACCN creates the ultimate trustworthy carbon offset asset.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-4 p-4 rounded-xl border border-cardBorder bg-cardSurface/30 hover:bg-cardSurface/50 transition-colors">
                <div className="p-2 rounded-lg bg-accentGreen/15 border border-accentGreen/30 text-accentGreen mt-0.5">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">AI-Verified Energy Data</h4>
                  <p className="text-xs text-textSecondary mt-1">Real IoT grid metrics + utility uploads, processed by deep scanning engines to exclude anomalies.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-cardBorder bg-cardSurface/30 hover:bg-cardSurface/50 transition-colors">
                <div className="p-2 rounded-lg bg-accentCyan/15 border border-accentCyan/30 text-accentCyan mt-0.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Dynamic Trust Scores</h4>
                  <p className="text-xs text-textSecondary mt-1">Sellers are scored dynamically on telemetry stability, account KYC, and data history duration.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl border border-cardBorder bg-cardSurface/30 hover:bg-cardSurface/50 transition-colors">
                <div className="p-2 rounded-lg bg-accentPurple/15 border border-accentPurple/30 text-accentPurple mt-0.5">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Blockchain-Ready Credits</h4>
                  <p className="text-xs text-textSecondary mt-1">Legally traceable ERC-20 compatible assets representing verified metric offsets, instantly tradeable.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.4 How It Works Accordion Timeline */}
      <section id="how-it-works-timeline" className="py-24 bg-bgSpace border-t border-cardBorder">
        <div className="container mx-auto px-6 md:px-12 flex flex-col gap-12 items-center">
          <div className="text-center max-w-xl">
            <span className="text-xs font-bold font-mono text-accentGreen uppercase tracking-widest">Workflow Pipeline</span>
            <h2 className="text-4xl font-extrabold font-heading text-white mt-1">5 Steps to Carbon Credits</h2>
          </div>

          {/* Stepper horizontal cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full max-w-5xl">
            {timelineSteps.map((item) => (
              <div
                key={item.step}
                onClick={() => setActiveStep(item.step)}
                className={`p-6 rounded-2xl border transition-all cursor-pointer flex flex-col gap-4 hover-lift ${
                  activeStep === item.step
                    ? 'border-accentGreen bg-accentGreen/5 shadow-neon-green/10'
                    : 'border-cardBorder bg-cardSurface/20 opacity-60'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="font-mono text-xs text-textMuted font-bold">STEP 0{item.step}</span>
                </div>
                <h4 className="text-sm font-bold text-white leading-none">{item.title}</h4>
              </div>
            ))}
          </div>

          {/* Expanded Step Info */}
          <div className="w-full max-w-3xl p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 glass-panel flex flex-col gap-2">
            <span className="font-mono text-xs text-accentGreen font-bold tracking-widest uppercase">
              STEP 0{activeStep} DETAILED PROTOCOL
            </span>
            <h3 className="text-xl font-bold font-heading text-white">
              {timelineSteps[activeStep - 1].title} Process
            </h3>
            <p className="text-xs text-textSecondary mt-2 leading-relaxed">
              {timelineSteps[activeStep - 1].desc} ACCN uses secure sockets to fetch telemetry data from smart grids, verifying authenticity with zero user friction.
            </p>
          </div>
        </div>
      </section>

      {/* 1.5 Marketplace Preview */}
      <section className="py-24 bg-bgMidnight border-t border-cardBorder">
        <div className="container mx-auto px-6 md:px-12 flex flex-col gap-12">
          
          <div className="flex flex-col items-center text-center gap-2 max-w-2xl mx-auto">
            <span className="text-xs font-bold font-mono text-accentGreen uppercase tracking-widest">Carbon Exchange</span>
            <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-white">Live Carbon Marketplace</h2>
            <p className="text-xs text-textSecondary leading-normal">
              Sign in to access real-time listings, view individual credit balances, user wallets, and transaction histories.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left panel: Blurred listings preview card */}
            <div className="relative rounded-2xl border border-cardBorder bg-cardSurface/40 p-6 overflow-hidden glass-panel">
              {/* Overlay with lock icon */}
              <div className="absolute inset-0 bg-bgMidnight/60 backdrop-blur-[4px] z-10 flex flex-col items-center justify-center gap-4 p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-accentGreen/10 border border-accentGreen/30 flex items-center justify-center text-accentGreen text-lg">
                  🔒
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Marketplace Locked</h3>
                  <p className="text-[11px] text-textSecondary mt-1 max-w-xs">
                    Please authenticate to view user identities, live balances, and trade books.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/auth')}
                  className="btn-primary shadow-neon-green/20"
                >
                  Unlock Marketplace
                </button>
              </div>

              {/* Blurred preview content */}
              <div className="flex flex-col gap-3 filter blur-md select-none pointer-events-none">
                <div className="p-4 rounded-xl border border-cardBorder bg-cardSurface/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cardBorder flex items-center justify-center font-bold text-xs text-textSecondary">RK</div>
                    <div>
                      <span className="text-xs font-bold text-white">Rahul K.</span>
                      <span className="text-[9px] font-mono text-accentGreen block mt-0.5">98% Trust</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-white block">₹120/cr</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-cardBorder bg-cardSurface/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cardBorder flex items-center justify-center font-bold text-xs text-textSecondary">PM</div>
                    <div>
                      <span className="text-xs font-bold text-white">Priya M.</span>
                      <span className="text-[9px] font-mono text-accentGreen block mt-0.5">95% Trust</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-white block">₹115/cr</span>
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-cardBorder bg-cardSurface/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cardBorder flex items-center justify-center font-bold text-xs text-textSecondary">AS</div>
                    <div>
                      <span className="text-xs font-bold text-white">Arun S.</span>
                      <span className="text-[9px] font-mono text-accentGreen block mt-0.5">92% Trust</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-xs font-bold text-white block">₹110/cr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right panel: Marketplace features list & Stats strip */}
            <div className="flex flex-col gap-6 justify-center">
              <div className="flex flex-col gap-4">
                <h3 className="text-lg font-bold text-white font-heading">Secure Energy Trading</h3>
                <p className="text-xs text-textSecondary leading-relaxed">
                  The AI Carbon Credit Network provides a decentralized exchange interface where smart meter offsets are directly tokenized and traded. Once authenticated, users can:
                </p>
                <ul className="text-xs text-textSecondary flex flex-col gap-2.5 font-sans list-disc list-inside pl-1">
                  <li>List excess solar or wind offsets at custom index rates.</li>
                  <li>Perform secure in-app payments and credit settlement.</li>
                  <li>Establish and verify cryptographically signed compliance statements.</li>
                  <li>Increase trading liquidity limits by raising energy Trust Scores.</li>
                </ul>
              </div>

              {/* Stats Strip */}
              <div className="grid grid-cols-3 gap-4 border-t border-cardBorder pt-6 font-mono">
                <div className="flex flex-col">
                  <span className="text-[10px] text-textSecondary uppercase tracking-wider">listings</span>
                  <span className="text-lg font-bold text-white mt-1">340+ Active</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-textSecondary uppercase tracking-wider">avg price</span>
                  <span className="text-lg font-bold text-white mt-1">₹120.40</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-textSecondary uppercase tracking-wider">network</span>
                  <span className="text-lg font-bold text-accentGreen mt-1 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accentGreen animate-pulse inline-block" />
                    LIVE
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1.6 Footer */}
      <footer className="bg-bgSpace border-t border-cardBorder py-16">
        <div className="container mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-wider font-heading text-gradient-green-cyan uppercase">
                ACCN
              </span>
            </div>
            <p className="text-xs text-textSecondary max-w-xs leading-relaxed">
              Tokenizing carbon offset generation directly from smart grid telemetry. Machine learning validated compliance.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase font-mono">Product</h4>
            <span className="text-xs text-textSecondary hover:text-accentGreen cursor-pointer transition-colors" onClick={() => navigate('/dashboard')}>Console</span>
            <span className="text-xs text-textSecondary hover:text-accentGreen cursor-pointer transition-colors" onClick={() => navigate('/marketplace')}>Marketplace</span>
            <span className="text-xs text-textSecondary hover:text-accentGreen cursor-pointer transition-colors" onClick={() => navigate('/ai-assistant')}>AI ARIA Assistant</span>
            <span className="text-xs text-textSecondary hover:text-accentGreen cursor-pointer transition-colors" onClick={() => navigate('/esg-reports')}>Compliance Reports</span>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase font-mono">Company</h4>
            <span className="text-xs text-textSecondary hover:text-accentGreen cursor-pointer transition-colors">About Us</span>
            <span className="text-xs text-textSecondary hover:text-accentGreen cursor-pointer transition-colors">CleanEnergy Tech</span>
            <span className="text-xs text-textSecondary hover:text-accentGreen cursor-pointer transition-colors">Press Inquiries</span>
            <span className="text-xs text-textSecondary hover:text-accentGreen cursor-pointer transition-colors">Careers</span>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-white tracking-widest uppercase font-mono">Roadmap</h4>
            <span className="text-xs text-textSecondary flex items-center gap-1.5"><span className="text-accentGreen font-bold select-none">&bull;</span> Q1 2025: IoT Verification &bull; Completed</span>
            <span className="text-xs text-textSecondary flex items-center gap-1.5"><span className="text-accentGreen font-bold select-none">&bull;</span> Q2 2025: Live Trading Desk &bull; Completed</span>
            <span className="text-xs text-textSecondary flex items-center gap-1.5"><span className="text-accentCyan font-bold select-none">&bull;</span> Q3 2025: Chain Settlement &bull; Ongoing</span>
            <span className="text-xs text-textSecondary flex items-center gap-1.5"><span className="text-textMuted font-bold select-none">&bull;</span> Q4 2025: Smart Meter Sync &bull; Upcoming</span>
          </div>
        </div>

        {/* Partners row */}
        <div className="container mx-auto px-6 md:px-12 border-t border-cardBorder mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-wrap items-center gap-6 text-textMuted text-xs font-mono select-none">
            <span>TATA ENERGY</span>
            <span>RELIANCE GREENS</span>
            <span>NTPC GRID</span>
            <span>ADANI HYBRIDS</span>
            <span>MINISTRY OF POWER</span>
          </div>
          <span className="text-[10px] text-textMuted font-mono">
            &copy; 2026 ACCN &bull; AI Carbon Credit Network. Legally Verified. Carbon Neutral Hosting.
          </span>
        </div>
      </footer>
    </div>
  );
};

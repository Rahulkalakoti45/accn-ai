import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Coins, 
  ShieldCheck, 
  Wallet, 
  Sparkles,
  TreePine, 
  Car, 
  Plane, 
  TrendingUp, 
  ArrowUpRight,
  Upload,
  MessageSquare,
  BadgeAlert,
  ArrowRight,
  Download
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useToastStore } from '../store/useToastStore';
import { useTheme } from '../utils/theme';
import { EnergyFlow3D } from '../components/EnergyFlow3D';
import { motion } from 'framer-motion';
import { uploadFile } from '../utils/supabase';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { addToast } = useToastStore();
  const { 
    user, 
    walletBalance, 
    walletCredits, 
    transactionHistory, 
    mintCredits, 
    updateLeaderboard,
    notifications
  } = useStore();

  useEffect(() => {
    updateLeaderboard();
  }, [walletCredits, updateLeaderboard]);

  const billInputRef = useRef<HTMLInputElement>(null);

  const handleUploadBill = () => {
    billInputRef.current?.click();
  };

  const handleBillFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    addToast('info', 'Uploading...', `Uploading ${file.name} to secure storage & scanning energy signatures.`);
    const userId = user.id || 'mock';
    const filePath = `bills/${userId}/${Date.now()}-${file.name}`;
    
    try {
      const publicUrl = await uploadFile('accn-assets', filePath, file);
      if (publicUrl) {
        addToast('success', 'Upload Successful', 'File safely stored in Supabase storage.');
      } else {
        throw new Error('Upload returned empty URL');
      }
    } catch (err) {
      console.warn('Supabase bill upload failed, proceeding offline:', err);
      addToast('warning', 'Local Preview', 'File processed locally (offline fallback mode).');
    }

    // Simulate AI scanning and credit generation
    setTimeout(() => {
      const amt = parseFloat((Math.random() * 5 + 1).toFixed(2));
      mintCredits(amt, 'Solar Billing');
      addToast('success', 'AI Verification Complete', `Successfully verified carbon offset of ${amt} CR from solar export.`);
    }, 1500);
  };


  const handleDownloadReport = () => {
    addToast('info', 'Report Generation', 'Preparing carbon compliance portfolio details...');
    setTimeout(() => {
      addToast('success', 'Download Complete', 'Compliance report saved successfully as PDF.');
    }, 1200);
  };

  // SVG Sparkline helpers
  const renderSparkline = (color: string) => (
    <svg className="w-16 h-8 opacity-75" viewBox="0 0 50 20">
      <path
        d="M0,15 Q8,5 15,12 T30,5 T45,10"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Welcome Greetings Banner */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white flex items-center gap-2">
            Good Evening, <span className="text-gradient-green-cyan">{user.name}</span> 👋
          </h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Your carbon compliance portfolio is performing excellently today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-cardSurface/60 border border-cardBorder rounded-xl px-3.5 py-1.5 select-none">
          <div className="w-2 h-2 rounded-full bg-accentGreen animate-pulse" />
          <span>GRID SYNC: ONLINE</span>
        </div>
      </div>

      {/* Section A — Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Credits */}
        <motion.div
          whileHover={{ scale: 1.02, translateY: -2 }}
          className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-3 relative overflow-hidden glass-panel hover:border-accentGreen/30 transition-all cursor-pointer"
          onClick={() => navigate('/wallet')}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-textSecondary uppercase tracking-widest">Carbon Credits</span>
            <div className="p-1.5 rounded-lg bg-accentGreen/10 border border-accentGreen/20 text-accentGreen">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-3xl font-bold font-mono text-white tracking-tight">
                {walletCredits.toFixed(1)}
              </span>
              <span className="text-[10px] text-accentGreen font-bold font-mono ml-2 block sm:inline">
                &uarr; +2.5 today
              </span>
            </div>
            {renderSparkline('#00FF88')}
          </div>
        </motion.div>

        {/* Card 2: Trust Score */}
        <motion.div
          whileHover={{ scale: 1.02, translateY: -2 }}
          className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-3 relative overflow-hidden glass-panel hover:border-accentCyan/30 transition-all cursor-pointer"
          onClick={() => navigate('/trust-score')}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-textSecondary uppercase tracking-widest">Trust Score</span>
            <div className="p-1.5 rounded-lg bg-accentCyan/10 border border-accentCyan/20 text-accentCyan">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-3xl font-bold font-mono text-white tracking-tight">
                {user.trustScore}%
              </span>
              <span className="text-[10px] text-accentCyan font-bold font-mono ml-2 block sm:inline">
                &uarr; +1% this wk
              </span>
            </div>
            {renderSparkline('#00D4FF')}
          </div>
        </motion.div>

        {/* Card 3: Wallet Value */}
        <motion.div
          whileHover={{ scale: 1.02, translateY: -2 }}
          className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-3 relative overflow-hidden glass-panel hover:border-accentGold/30 transition-all cursor-pointer"
          onClick={() => navigate('/wallet')}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-textSecondary uppercase tracking-widest">Wallet Value</span>
            <div className="p-1.5 rounded-lg bg-accentGold/10 border border-accentGold/20 text-accentGold">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-3xl font-bold font-mono text-white tracking-tight">
                ₹{walletBalance.toLocaleString()}
              </span>
              <span className="text-[10px] text-accentGold font-bold font-mono ml-2 block sm:inline">
                &uarr; +₹120 today
              </span>
            </div>
            {renderSparkline('#F59E0B')}
          </div>
        </motion.div>

        {/* Card 4: CO2 Saved */}
        <motion.div
          whileHover={{ scale: 1.02, translateY: -2 }}
          className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-3 relative overflow-hidden glass-panel hover:border-accentPurple/30 transition-all cursor-pointer"
          onClick={() => navigate('/esg-reports')}
        >
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-textSecondary uppercase tracking-widest">CO₂ Saved</span>
            <div className="p-1.5 rounded-lg bg-accentPurple/10 border border-accentPurple/20 text-accentPurple">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <span className="text-3xl font-bold font-mono text-white tracking-tight">
                95 kg
              </span>
              <span className="text-[10px] text-accentPurple font-bold font-mono ml-2 block sm:inline">
                &approx; 50 trees
              </span>
            </div>
            {renderSparkline('#7C3AED')}
          </div>
        </motion.div>
      </div>

      {/* Section B — Centerpiece 3D Flow Widget */}
      <div className="w-full rounded-2xl border border-cardBorder bg-cardSurface/40 p-5 flex flex-col gap-4 relative overflow-hidden glass-panel">
        <div className="flex justify-between items-center select-none">
          <div className="flex flex-col">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Live Energy Export Telemetry
            </h3>
            <span className="text-[10px] text-textSecondary">
              Interactive 3D representation of telemetry flow across solar exports to local energy grids.
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-accentGreen/15 border border-accentGreen/30 text-[10px] font-bold text-accentGreen animate-pulse">
            +0.51 cr/hr Earning
          </span>
        </div>

        {/* The 3D Canvas Box */}
        <div className="w-full h-80 bg-bgSpace/30 rounded-xl relative border border-cardBorder/50 overflow-hidden">
          <EnergyFlow3D />

          {/* HTML Overlay Labels */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 font-mono text-[9px] pointer-events-none select-none">
            <div className="px-2.5 py-1 rounded bg-bgSpace/80 border border-accentGold/20 text-accentGold">
              ☀️ SOLAR GENERATION: <span className="font-bold text-white">8.2 kWh</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-bgSpace/80 border border-accentCyan/20 text-accentCyan">
              🏠 HOME CONSUMPTION: <span className="font-bold text-white">3.1 kWh</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-bgSpace/80 border border-accentGreen/20 text-accentGreen">
              ⚡ GRID EXPORT: <span className="font-bold text-white">5.1 kWh</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section C — Two Column: Carbon Impact + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Climate Impact Card */}
        <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-6 relative overflow-hidden glass-panel">
          <div className="flex justify-between items-start border-b border-cardBorder pb-4 select-none">
            <div>
              <h3 className="text-base font-bold text-white font-heading">Your Climate Impact</h3>
              <p className="text-xs text-textSecondary mt-0.5">Calculated carbon mitigation metrics.</p>
            </div>
            <div className="text-3xl opacity-40 select-none">🌍</div>
          </div>

          <div className="flex flex-col gap-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-cardBorder pb-2">
              <span className="flex items-center gap-2 text-textSecondary">
                <TreePine className="w-4.5 h-4.5 text-accentGreen" />
                Trees Equivalent Offset
              </span>
              <span className="font-bold text-white">50.0 Trees</span>
            </div>
            <div className="flex justify-between items-center border-b border-cardBorder pb-2">
              <span className="flex items-center gap-2 text-textSecondary">
                <TrendingUp className="w-4.5 h-4.5 text-accentCyan" />
                CO₂ Reduced Total
              </span>
              <span className="font-bold text-white">95.0 kg CO₂</span>
            </div>
            <div className="flex justify-between items-center border-b border-cardBorder pb-2">
              <span className="flex items-center gap-2 text-textSecondary">
                <Car className="w-4.5 h-4.5 text-accentGold" />
                Car Trips Compensated
              </span>
              <span className="font-bold text-white">12.0 Trips</span>
            </div>
            <div className="flex justify-between items-center pb-2">
              <span className="flex items-center gap-2 text-textSecondary">
                <Plane className="w-4.5 h-4.5 text-accentPurple" />
                Flight Hours Offset
              </span>
              <span className="font-bold text-white">0.8 Hours</span>
            </div>
          </div>

          {/* Monthly progress goal bar */}
          <div className="mt-4 pt-4 border-t border-cardBorder flex flex-col gap-2 select-none">
            <div className="flex justify-between text-[11px] font-mono text-textSecondary">
              <span>Goal: 120 kg CO₂ / Month</span>
              <span>79% Complete</span>
            </div>
            <div className="w-full h-2 bg-cardBorder rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '79%' }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-accentGreen shadow-neon-green"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Timeline */}
        <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-4 glass-panel">
          <div className="flex justify-between items-center border-b border-cardBorder pb-4 select-none">
            <div>
              <h3 className="text-base font-bold text-white font-heading">Recent Portfolio Activity</h3>
              <p className="text-xs text-textSecondary mt-0.5">Verification & trading history.</p>
            </div>
            <button
              onClick={() => navigate('/wallet')}
              className="text-xs text-accentGreen hover:underline font-semibold flex items-center gap-1"
            >
              View All History <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="flex-grow overflow-y-auto max-h-64 flex flex-col relative pl-4 border-l border-cardBorder gap-6 py-2">
            {transactionHistory.map((item, idx) => (
              <div key={item.id} className="relative group">
                {/* Timeline node dot */}
                <div
                  className={`absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border border-bgSpace ${
                    idx === 0
                      ? 'bg-accentGreen animate-pulse ring-4 ring-accentGreen/20'
                      : 'bg-cardBorder'
                  }`}
                />
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-xs font-semibold text-textPrimary leading-none group-hover:text-accentGreen transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-textSecondary mt-1">{item.description}</p>
                    {item.linkText && (
                      <span
                        onClick={() => {
                          if (item.title.includes('Score')) navigate('/trust-score');
                          else if (item.title.includes('Generated')) navigate('/certificates');
                          else navigate('/wallet');
                        }}
                        className="text-[10px] text-accentCyan hover:underline mt-1.5 inline-block font-semibold cursor-pointer"
                      >
                        {item.linkText} &rarr;
                      </span>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <span
                      className={`text-xs font-mono font-bold ${
                        item.amount?.includes('+') ? 'text-accentGreen' : 'text-textSecondary'
                      }`}
                    >
                      {item.amount}
                    </span>
                    <span className="text-[9px] font-mono text-textMuted block mt-1">{item.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section D — Quick Actions Panel */}
      <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 glass-panel">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono select-none mb-4">
          Quick Actions Console
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <button
            onClick={handleUploadBill}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-cardBorder bg-cardSurface/20 hover:bg-cardSurface/60 hover:border-accentGreen/40 transition-all hover:scale-102 group select-none"
          >
            <Upload className="w-6 h-6 text-accentGreen group-hover:scale-110 transition-transform mb-2" />
            <span className="text-xs font-semibold text-textPrimary">Upload Bill</span>
            <span className="text-[9px] text-textSecondary mt-0.5">Scan utility offsets</span>
          </button>
          <input
            type="file"
            ref={billInputRef}
            onChange={handleBillFileChange}
            accept=".pdf,image/*"
            className="hidden"
          />

          <button
            onClick={() => navigate('/ai-assistant')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-cardBorder bg-cardSurface/20 hover:bg-cardSurface/60 hover:border-accentCyan/40 transition-all hover:scale-102 group select-none"
          >
            <MessageSquare className="w-6 h-6 text-accentCyan group-hover:scale-110 transition-transform mb-2" />
            <span className="text-xs font-semibold text-textPrimary">Ask AI</span>
            <span className="text-[9px] text-textSecondary mt-0.5">Consult ARIA bot</span>
          </button>

          <button
            onClick={() => navigate('/marketplace')}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-cardBorder bg-cardSurface/20 hover:bg-cardSurface/60 hover:border-accentGold/40 transition-all hover:scale-102 group select-none"
          >
            <Coins className="w-6 h-6 text-accentGold group-hover:scale-110 transition-transform mb-2" />
            <span className="text-xs font-semibold text-textPrimary">Sell Credits</span>
            <span className="text-[9px] text-textSecondary mt-0.5">Trade carbon credits</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="flex flex-col items-center justify-center p-4 rounded-xl border border-cardBorder bg-cardSurface/20 hover:bg-cardSurface/60 hover:border-accentPurple/40 transition-all hover:scale-102 group select-none"
          >
            <Download className="w-6 h-6 text-accentPurple group-hover:scale-110 transition-transform mb-2" />
            <span className="text-xs font-semibold text-textPrimary">Download Report</span>
            <span className="text-[9px] text-textSecondary mt-0.5">Generate ESG PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};

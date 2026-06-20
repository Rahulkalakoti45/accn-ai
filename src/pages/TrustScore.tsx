import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area } from 'recharts';
import { ShieldCheck, Award, Zap, HeartHandshake, HelpCircle, ArrowUpRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useToastStore } from '../store/useToastStore';
import { useTheme } from '../utils/theme';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

export const TrustScore: React.FC = () => {
  const theme = useTheme();
  const { user } = useStore();
  const { addToast } = useToastStore();
  const [gaugeVal, setGaugeVal] = useState(0);

  // Animate circular progress gauge and trigger confetti
  useEffect(() => {
    let start = 0;
    const end = user.trustScore;
    const duration = 2000;
    const stepTime = Math.floor(duration / end);

    const timer = setInterval(() => {
      start += 1;
      if (start >= end) {
        clearInterval(timer);
        setGaugeVal(end);
        
        // Confetti burst for high trust score celebration
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#00FF88', '#00D4FF', '#7C3AED'],
        });
      } else {
        setGaugeVal(start);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [user.trustScore]);

  // Recharts Trust History (12 Months)
  const historyData = [
    { month: 'Jan', Score: 85 },
    { month: 'Feb', Score: 85 },
    { month: 'Mar', Score: 88 },
    { month: 'Apr', Score: 88 },
    { month: 'May', Score: 90 },
    { month: 'Jun', Score: 92 },
    { month: 'Jul', Score: 92 },
    { month: 'Aug', Score: 94 },
    { month: 'Sep', Score: 94 },
    { month: 'Oct', Score: 95 },
    { month: 'Nov', Score: 95 },
    { month: 'Dec', Score: 96 },
  ];

  const handleActionClick = (actionName: string) => {
    addToast('info', 'Verification Hub', `Launching verification checklist for ${actionName}...`);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12">
      {/* Top Header */}
      <div className="flex justify-between items-center select-none border-b border-cardBorder pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white">Trust Score Center</h1>
          <p className="text-xs text-textSecondary mt-0.5">
            AI compliance auditing vectors verifying your energy contributions.
          </p>
        </div>
      </div>

      {/* Centerpiece SVG Holographic Gauge */}
      <div className="w-full flex justify-center py-8 rounded-2xl border border-cardBorder bg-cardSurface/20 relative overflow-hidden glass-panel">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,136,0.03)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative w-80 h-80 flex items-center justify-center">
          
          {/* Rotating Orbits satellites container */}
          <div className="absolute inset-0 animate-[spin_50s_linear_infinite] pointer-events-none">
            {/* Satellite NW: Authenticity */}
            <div className="absolute top-2 left-2 p-2 rounded-xl border border-accentCyan/30 bg-bgSpace/90 backdrop-blur-md flex flex-col items-center gap-0.5 select-none animate-[spin_50s_linear_infinite_reverse]">
              <span className="text-[8px] font-mono text-textMuted uppercase">Authenticity</span>
              <span className="text-xs font-mono font-bold text-accentCyan">98%</span>
            </div>

            {/* Satellite NE: Fraud Risk */}
            <div className="absolute top-2 right-2 p-2 rounded-xl border border-accentGreen/30 bg-bgSpace/90 backdrop-blur-md flex flex-col items-center gap-0.5 select-none animate-[spin_50s_linear_infinite_reverse]">
              <span className="text-[8px] font-mono text-textMuted uppercase">Fraud Risk</span>
              <span className="text-xs font-mono font-bold text-accentGreen">99%</span>
            </div>

            {/* Satellite SW: AI Confidence */}
            <div className="absolute bottom-2 left-2 p-2 rounded-xl border border-accentPurple/30 bg-bgSpace/90 backdrop-blur-md flex flex-col items-center gap-0.5 select-none animate-[spin_50s_linear_infinite_reverse]">
              <span className="text-[8px] font-mono text-textMuted uppercase">AI Confidence</span>
              <span className="text-xs font-mono font-bold text-accentPurple">95%</span>
            </div>

            {/* Satellite SE: Data History */}
            <div className="absolute bottom-2 right-2 p-2 rounded-xl border border-accentGold/30 bg-bgSpace/90 backdrop-blur-md flex flex-col items-center gap-0.5 select-none animate-[spin_50s_linear_infinite_reverse]">
              <span className="text-[8px] font-mono text-textMuted uppercase">Data History</span>
              <span className="text-xs font-mono font-bold text-accentGold">92%</span>
            </div>
          </div>

          {/* Central Progress Ring */}
          <svg className="w-56 h-56 transform -rotate-90">
            {/* Outer support circle */}
            <circle
              cx="112"
              cy="112"
              r="90"
              stroke="#1e2d45"
              strokeWidth="5"
              fill="transparent"
            />
            {/* Active sweep circle */}
            <motion.circle
              cx="112"
              cy="112"
              r="90"
              stroke="#00FF88"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 90}
              strokeDashoffset={(2 * Math.PI * 90) * (1 - gaugeVal / 100)}
              strokeLinecap="round"
              className="transition-all duration-300"
            />
          </svg>

          {/* Core Text Info overlay */}
          <div className="absolute flex flex-col items-center text-center select-none pointer-events-none">
            <span className="text-5xl font-mono font-bold text-accentGreen tracking-tighter">
              {gaugeVal}%
            </span>
            <span className="text-xs text-textSecondary uppercase tracking-widest font-heading font-bold mt-1">
              Trust Score
            </span>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="w-2 h-2 rounded-full bg-accentGreen animate-pulse" />
              <span className="text-[9px] font-mono text-textMuted uppercase">● Live Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2x2 Grid Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Authenticity */}
        <motion.div
          whileHover={{ rotate: 1, scale: 1.01 }}
          className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-3 glass-panel border-l-4 border-l-accentCyan hover:border-accentCyan/30 transition-all select-none"
        >
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">Data Authenticity</h4>
            <span className="text-xs font-mono font-bold text-accentCyan">98%</span>
          </div>
          <p className="text-xs text-textSecondary leading-relaxed">
            Checks consistency profiles of utility databases against paired physical smart meter registers.
          </p>
          <span className="text-[9px] font-mono text-textMuted mt-1">Last audit check: 2 mins ago</span>
        </motion.div>

        {/* Card 2: Fraud Risk */}
        <motion.div
          whileHover={{ rotate: -1, scale: 1.01 }}
          className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-3 glass-panel border-l-4 border-l-accentGreen hover:border-accentGreen/30 transition-all select-none"
        >
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">Anomaly / Fraud Index</h4>
            <span className="text-xs font-mono font-bold text-accentGreen">99% (Very Low Risk)</span>
          </div>
          <p className="text-xs text-textSecondary leading-relaxed">
            Neural networks search for duplicate documents, digital manipulations, or out-of-sync telemetry exports.
          </p>
          <span className="text-[9px] font-mono text-textMuted mt-1">Last audit check: 2 mins ago</span>
        </motion.div>

        {/* Card 3: AI Confidence */}
        <motion.div
          whileHover={{ rotate: 1, scale: 1.01 }}
          className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-3 glass-panel border-l-4 border-l-accentPurple hover:border-accentPurple/30 transition-all select-none"
        >
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">AI Model Confidence</h4>
            <span className="text-xs font-mono font-bold text-accentPurple">95%</span>
          </div>
          <p className="text-xs text-textSecondary leading-relaxed">
            Audit classification models verify weather profiles vs solar export quantities with high confidence metrics.
          </p>
          <span className="text-[9px] font-mono text-textMuted mt-1">Last audit check: 2 mins ago</span>
        </motion.div>

        {/* Card 4: Data History */}
        <motion.div
          whileHover={{ rotate: -1, scale: 1.01 }}
          className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-3 glass-panel border-l-4 border-l-accentGold hover:border-accentGold/30 transition-all select-none"
        >
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-heading">Telemetry History Depth</h4>
            <span className="text-xs font-mono font-bold text-accentGold">92%</span>
          </div>
          <p className="text-xs text-textSecondary leading-relaxed">
            Measures telemetry depth over past year. Longer consecutive history scores yield premium credit certification.
          </p>
          <span className="text-[9px] font-mono text-textMuted mt-1">Last audit check: 2 mins ago</span>
        </motion.div>
      </div>

      {/* Trust Evolution Graph */}
      <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-4 glass-panel select-none">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
          Trust Score Evolution (Past 12 Months)
        </h3>
        <div className="w-full h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="month" stroke="#475569" fontSize={10} fontFamily="monospace" tickLine={false} />
              <YAxis domain={[80, 100]} stroke="#475569" fontSize={10} fontFamily="monospace" tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111827',
                  border: '1px solid #1E2D45',
                  borderRadius: '12px',
                  color: '#F1F5F9',
                  fontSize: '11px',
                  fontFamily: 'monospace'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="Score" 
                stroke="#00FF88" 
                strokeWidth={2}
                dot={{ stroke: '#00FF88', strokeWidth: 2, r: 4, fill: '#0A0F1E' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-4 justify-center text-[10px] font-mono text-textSecondary">
          <span className="flex items-center gap-1.5"><span className="text-accentCyan">&bull;</span> Smart meter connected (Jan: +3%)</span>
          <span className="flex items-center gap-1.5"><span className="text-accentCyan">&bull;</span> 6-month billing history synced (Jun: +2%)</span>
        </div>
      </div>

      {/* Recommendations Checklist */}
      <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-4 glass-panel">
        <h3 className="text-sm font-bold text-white font-heading select-none">
          How to Reach 99% Max Trust
        </h3>

        <div className="flex flex-col gap-3">
          <div className="p-4 rounded-xl border border-cardBorder bg-cardSurface/20 hover:bg-cardSurface/50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Connect Alternate Smart Meter</span>
                <span className="px-1.5 py-0.5 rounded bg-accentGreen/15 border border-accentGreen/20 text-[9px] font-bold text-accentGreen font-mono">
                  +3% Score
                </span>
              </div>
              <p className="text-[11px] text-textSecondary mt-1">Paired industrial sensors verify microgeneration telemetry instantly.</p>
            </div>
            <button
              onClick={() => handleActionClick('Smart Meter Pair')}
              className="px-4 py-2 rounded-lg bg-accentGreen text-bgSpace text-xs font-bold hover:scale-102 transition-transform flex items-center gap-1 self-start sm:self-auto"
            >
              Connect Now <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 rounded-xl border border-cardBorder bg-cardSurface/20 hover:bg-cardSurface/50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Upload 12-Month Utility History</span>
                <span className="px-1.5 py-0.5 rounded bg-accentCyan/15 border border-accentCyan/20 text-[9px] font-bold text-accentCyan font-mono">
                  +1% Score
                </span>
              </div>
              <p className="text-[11px] text-textSecondary mt-1">Submit consecutive billing history records to prove historical efficiency.</p>
            </div>
            <button
              onClick={() => handleActionClick('Utility Upload')}
              className="px-4 py-2 rounded-lg border border-cardBorder bg-cardSurface/30 hover:bg-cardSurface/80 text-xs font-bold text-white flex items-center gap-1 self-start sm:self-auto"
            >
              Upload Bills <ArrowUpRight className="w-3.5 h-3.5 text-accentCyan" />
            </button>
          </div>

          <div className="p-4 rounded-xl border border-cardBorder bg-cardSurface/20 hover:bg-cardSurface/50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Complete Identity Verification</span>
                <span className="px-1.5 py-0.5 rounded bg-accentPurple/15 border border-accentPurple/20 text-[9px] font-bold text-accentPurple font-mono">
                  +1% Score
                </span>
              </div>
              <p className="text-[11px] text-textSecondary mt-1">Verify business compliance documents or personal IDs for maximum transaction limit.</p>
            </div>
            <button
              onClick={() => handleActionClick('KYC Audit')}
              className="px-4 py-2 rounded-lg border border-cardBorder bg-cardSurface/30 hover:bg-cardSurface/80 text-xs font-bold text-white flex items-center gap-1 self-start sm:self-auto"
            >
              Verify KYC <ArrowUpRight className="w-3.5 h-3.5 text-accentPurple" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  TrendingUp, 
  Users, 
  Coins, 
  Scale, 
  CheckCircle2, 
  AlertOctagon, 
  Ban, 
  FileText,
  PieChart as PieIcon,
  X
} from 'lucide-react';
import { useToastStore } from '../store/useToastStore';
import { useTheme } from '../utils/theme';
import { motion, AnimatePresence } from 'framer-motion';

export const AdminPortal: React.FC = () => {
  const theme = useTheme();
  const { addToast } = useToastStore();
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  // Simulated active fraud alert state
  const [alerts, setAlerts] = useState([
    {
      id: 'f-1',
      risk: 'HIGH RISK',
      user: 'usr_8821',
      type: 'Duplicate Energy Data',
      desc: 'Smart billing file uploaded 3 times within 10 minutes with matching hash signatures.',
      time: '10 mins ago',
      confidence: 97
    },
    {
      id: 'f-2',
      risk: 'MEDIUM RISK',
      user: 'usr_4421',
      type: 'Unusual Credit Volume',
      desc: 'Meter SM-HYD-4421 registered a 5x export telemetry spike against historic averages.',
      time: '1 hour ago',
      confidence: 84
    }
  ]);

  const handleAlertResolve = (id: string, action: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
    if (action === 'suspend') {
      addToast('error', 'User Account Suspended', `Node ${id === 'f-1' ? 'usr_8821' : 'usr_4421'} suspended from carbon credit creation.`);
    } else if (action === 'flag') {
      addToast('warning', 'Audit Flag Placed', `Transaction logs flagged for physical audit.`);
    } else {
      addToast('success', 'Alert Dismissed', `Telemetry anomaly dismissed successfully.`);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none">
      
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-cardBorder pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white flex items-center gap-2.5">
            Admin Verification Portal
            <span className="text-xs bg-danger/15 border border-danger/30 text-danger px-2 py-0.5 rounded-full uppercase font-mono tracking-wider font-bold">
              Secure Audit Role
            </span>
          </h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Regulator node auditing carbon mint hashes and fraudulent telemetry anomalies.
          </p>
        </div>
      </div>

      {/* KPI stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-2 glass-panel">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-textMuted uppercase">Total active nodes</span>
            <Users className="w-4 h-4 text-accentCyan" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">12,450 Users</span>
          <span className="text-[10px] text-accentGreen font-bold font-mono">+124 paired today</span>
        </div>

        <div className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-2 glass-panel">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-textMuted uppercase">Credits Certified</span>
            <Coins className="w-4 h-4 text-accentGreen" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">48,200 CR</span>
          <span className="text-[10px] text-accentGreen font-bold font-mono">+340 certified today</span>
        </div>

        <div className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-2 glass-panel">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-textMuted uppercase">Active Fraud Alerts</span>
            <AlertOctagon className="w-4 h-4 text-danger animate-pulse" />
          </div>
          <span className="text-2xl font-bold font-mono text-danger">{alerts.length} Warnings</span>
          <span className="text-[10px] text-textSecondary font-mono">Requires action desk</span>
        </div>

        <div className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-2 glass-panel">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-textMuted uppercase">Registry Revenue</span>
            <Scale className="w-4 h-4 text-accentGold" />
          </div>
          <span className="text-2xl font-bold font-mono text-white">₹58.4L</span>
          <span className="text-[10px] text-accentGreen font-bold font-mono">↑ 12% MoM</span>
        </div>
      </div>

      {/* Map & Fraud logs block */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Left 3/5: SVG India Map Heatmap */}
        <div className="lg:col-span-3 p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-5 glass-panel select-none relative">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              National Generation Heatmap
            </h3>
            <span className="text-[10px] text-textSecondary">
              State-level carbon credits minting index. Hover to scan state data logs.
            </span>
          </div>

          {/* SVG India Map polygonal styling */}
          <div className="h-[350px] flex items-center justify-center relative">
            <svg 
              viewBox="0 0 400 420" 
              className="w-full h-full text-cardBorder stroke-[#0A0F1E] stroke-2"
            >
              {/* Simplified India Outline Polygon states */}
              
              {/* Northwest (Kashmir/Punjab/Rajasthan) */}
              <polygon
                points="80,60 110,30 140,40 130,80 160,110 140,140 100,160 70,120"
                fill="#1E2D45"
                className="hover:fill-accentGreen/20 transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredState('Rajasthan / North: 2,100 CR / ₹2.5L')}
                onMouseLeave={() => setHoveredState(null)}
              />

              {/* Central (Madhya Pradesh) */}
              <polygon
                points="140,140 210,130 250,170 230,220 150,210 120,170"
                fill="rgba(0, 255, 136, 0.2)"
                className="hover:fill-accentGreen/45 transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredState('Madhya Pradesh: 4,200 CR / ₹5.0L')}
                onMouseLeave={() => setHoveredState(null)}
              />

              {/* West (Maharashtra - Mumbai) */}
              <polygon
                points="120,170 150,210 190,220 170,290 100,270 90,210"
                fill="#00FF88"
                className="hover:opacity-90 transition-opacity cursor-pointer filter drop-shadow-[0_0_8px_rgba(0,255,136,0.4)]"
                onMouseEnter={() => setHoveredState('Maharashtra (Mumbai): 8,400 CR / ₹10.1L')}
                onMouseLeave={() => setHoveredState(null)}
              />

              {/* South-Central (Telangana/Andhra - Hyderabad) */}
              <polygon
                points="170,290 220,240 260,280 230,340 160,330"
                fill="rgba(0, 255, 136, 0.5)"
                className="hover:fill-accentGreen/80 transition-colors cursor-pointer filter drop-shadow-[0_0_6px_rgba(0,255,136,0.3)]"
                onMouseEnter={() => setHoveredState('Telangana (Hyderabad): 6,100 CR / ₹7.3L')}
                onMouseLeave={() => setHoveredState(null)}
              />

              {/* South (Karnataka/Tamil Nadu) */}
              <polygon
                points="160,330 230,340 210,400 170,410 140,360"
                fill="rgba(0, 255, 136, 0.2)"
                className="hover:fill-accentGreen/45 transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredState('South India: 3,500 CR / ₹4.2L')}
                onMouseLeave={() => setHoveredState(null)}
              />

              {/* East (Bihar/West Bengal/Orissa) */}
              <polygon
                points="250,170 310,140 330,200 290,240 260,210"
                fill="#1E2D45"
                className="hover:fill-accentGreen/20 transition-colors cursor-pointer"
                onMouseEnter={() => setHoveredState('East India: 1,400 CR / ₹1.7L')}
                onMouseLeave={() => setHoveredState(null)}
              />

              {/* Pulsing City node circles */}
              {/* Mumbai */}
              <circle cx="110" cy="230" r="4" fill="#00FF88" className="animate-ping" />
              <circle cx="110" cy="230" r="3" fill="#00FF88" />

              {/* Hyderabad */}
              <circle cx="195" cy="290" r="4" fill="#00D4FF" className="animate-ping" style={{ animationDelay: '500ms' }} />
              <circle cx="195" cy="290" r="3" fill="#00D4FF" />

              {/* Delhi */}
              <circle cx="150" cy="110" r="4" fill="#F59E0B" className="animate-ping" style={{ animationDelay: '1000ms' }} />
              <circle cx="150" cy="110" r="3" fill="#F59E0B" />
            </svg>

            {/* Live Hover Tooltip overlay */}
            <div className="absolute bottom-4 left-4 right-4 bg-bgSpace/90 border border-cardBorder rounded-xl p-3 text-center text-xs font-mono">
              {hoveredState ? (
                <span className="text-white font-bold">{hoveredState}</span>
              ) : (
                <span className="text-textSecondary select-none">Hover state regions to scan registry metrics.</span>
              )}
            </div>
          </div>
        </div>

        {/* Right 2/5: Fraud Alert Detection Desk */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-4 glass-panel h-full">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono select-none flex items-center gap-1.5">
              <ShieldAlert className="w-4.5 h-4.5 text-danger animate-pulse" />
              AI Anomaly Detection Desk
            </h3>

            <div className="flex-grow flex flex-col gap-3">
              <AnimatePresence>
                {alerts.length > 0 ? (
                  alerts.map((a) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`p-4 rounded-xl border bg-cardSurface/20 flex flex-col gap-2.5 transition-all ${
                        a.risk.includes('HIGH') ? 'border-danger/30 border-l-4 border-l-danger' : 'border-warning/30 border-l-4 border-l-warning'
                      }`}
                    >
                      <div className="flex justify-between items-center select-none">
                        <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded ${
                          a.risk.includes('HIGH') ? 'bg-danger/10 text-danger border border-danger/20' : 'bg-warning/10 text-warning border border-warning/20'
                        }`}>
                          {a.risk}
                        </span>
                        <span className="text-[10px] font-mono text-textMuted">Confidence: {a.confidence}%</span>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white leading-none">{a.type} &middot; <span className="font-mono text-textSecondary">{a.user}</span></h4>
                        <p className="text-[11px] text-textSecondary mt-1.5 leading-normal">{a.desc}</p>
                      </div>

                      <div className="flex gap-2 border-t border-cardBorder/30 pt-3 mt-1">
                        <button
                          onClick={() => handleAlertResolve(a.id, a.risk.includes('HIGH') ? 'suspend' : 'flag')}
                          className={`flex-grow py-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                            a.risk.includes('HIGH') ? 'bg-danger text-bgSpace' : 'bg-warning text-bgSpace'
                          }`}
                        >
                          <Ban className="w-3.5 h-3.5" />
                          {a.risk.includes('HIGH') ? 'Suspend Account' : 'Flag audit'}
                        </button>
                        <button
                          onClick={() => handleAlertResolve(a.id, 'dismiss')}
                          className="px-4 py-2 rounded-lg border border-cardBorder bg-cardSurface/40 hover:bg-cardSurface/80 text-[10px] font-bold text-white"
                        >
                          Dismiss
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-20">
                    <CheckCircle2 className="w-10 h-10 text-accentGreen mb-2 opacity-50" />
                    <p className="text-sm text-textSecondary font-semibold">Zero Anomaly Alerts Pending</p>
                    <p className="text-xs text-textMuted mt-1">All telemetry sync databases are within compliant specs.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>

      {/* Marketplace Monitoring */}
      <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 glass-panel">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono select-none mb-4">
          Marketplace Transaction Audit log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-cardBorder/50 font-mono text-textMuted uppercase select-none">
                <th className="py-2.5 px-4">TX ID</th>
                <th className="py-2.5 px-4">Buyer</th>
                <th className="py-2.5 px-4">Seller</th>
                <th className="py-2.5 px-4">Quantity</th>
                <th className="py-2.5 px-4">UnitPrice</th>
                <th className="py-2.5 px-4">Total</th>
                <th className="py-2.5 px-4 text-right">Ledger Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-cardBorder/30 hover:bg-white/5 transition-colors font-mono">
                <td className="py-3 px-4">#tx-9a2c</td>
                <td className="py-3 px-4 font-sans font-semibold text-white">Tata Steel</td>
                <td className="py-3 px-4 font-sans">Rahul Kumar</td>
                <td className="py-3 px-4 text-white">100 Credits</td>
                <td className="py-3 px-4 text-accentGreen">₹120.00</td>
                <td className="py-3 px-4 text-white">₹12,000</td>
                <td className="py-3 px-4 text-right font-sans font-bold text-accentGreen">✓ CONFIRMED</td>
              </tr>
              <tr className="border-b border-cardBorder/30 hover:bg-white/5 transition-colors font-mono">
                <td className="py-3 px-4">#tx-4b1f</td>
                <td className="py-3 px-4 font-sans font-semibold text-white">Reliance Energy</td>
                <td className="py-3 px-4 font-sans">Priya M.</td>
                <td className="py-3 px-4 text-white">250 Credits</td>
                <td className="py-3 px-4 text-accentGreen">₹122.00</td>
                <td className="py-3 px-4 text-white">₹30,500</td>
                <td className="py-3 px-4 text-right font-sans font-bold text-accentGreen">✓ CONFIRMED</td>
              </tr>
              <tr className="border-b border-cardBorder/30 hover:bg-white/5 transition-colors font-mono">
                <td className="py-3 px-4">#tx-82e1</td>
                <td className="py-3 px-4 font-sans font-semibold text-white">Wipro Compliance</td>
                <td className="py-3 px-4 font-sans">Arun S.</td>
                <td className="py-3 px-4 text-white">50 Credits</td>
                <td className="py-3 px-4 text-accentGreen">₹119.00</td>
                <td className="py-3 px-4 text-white">₹5,950</td>
                <td className="py-3 px-4 text-right font-sans font-bold text-accentGreen">✓ CONFIRMED</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};

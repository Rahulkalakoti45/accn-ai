import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ClipboardList, 
  Award, 
  Calendar, 
  Sparkles, 
  Check, 
  Loader2, 
  FileText, 
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import { useToastStore } from '../store/useToastStore';
import { useTheme } from '../utils/theme';
import { useStore } from '../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

export const ESGReports: React.FC = () => {
  const theme = useTheme();
  const { addToast } = useToastStore();
  const { user } = useStore();
  const [period, setPeriod] = useState('Q3 2024');
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  
  // Checklist states
  const [chk1, setChk1] = useState(true);
  const [chk2, setChk2] = useState(true);
  const [chk3, setChk3] = useState(true);
  const [chk4, setChk4] = useState(true);
  const [chk5, setChk5] = useState(false);

  const complianceData = [
    { month: 'Jan', Target: 30, Actual: 32 },
    { month: 'Feb', Target: 30, Actual: 28 },
    { month: 'Mar', Target: 35, Actual: 38 },
    { month: 'Apr', Target: 35, Actual: 30 },
    { month: 'May', Target: 40, Actual: 45 },
    { month: 'Jun', Target: 40, Actual: 42 },
    { month: 'Jul', Target: 45, Actual: 40 },
    { month: 'Aug', Target: 45, Actual: 46 },
    { month: 'Sep', Target: 50, Actual: 48 },
    { month: 'Oct', Target: 50, Actual: 52 },
    { month: 'Nov', Target: 55, Actual: 50 },
    { month: 'Dec', Target: 55, Actual: 58 },
  ];

  // Dynamic bar coloring function based on compliance performance
  const renderCustomBar = (props: any) => {
    const { x, y, width, height, Target, Actual } = props;
    const ratio = Actual / Target;
    let fill = '#10B981'; // Green (>=100% compliance)
    if (ratio < 0.8) fill = '#EF4444'; // Red (<80% compliance)
    else if (ratio < 1.0) fill = '#F59E0B'; // Amber (80-100% compliance)
    
    return <rect x={x} y={y} width={width} height={height} fill={fill} rx={3} />;
  };

  const downloadESGReportAsPDF = () => {
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!doc) return;

    doc.write(`
      <html>
        <head>
          <title>ESG_Carbon_Report_${period.replace(' ', '_')}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;700&display=swap');
            body {
              font-family: 'DM Sans', sans-serif;
              background-color: #080C14;
              color: #F0F4FF;
              margin: 0;
              padding: 40px;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              box-sizing: border-box;
            }
            .report-card {
              border: 1px solid rgba(255,255,255,0.1);
              padding: 40px;
              width: 100%;
              max-width: 700px;
              background-color: #1A2235;
              border-radius: 16px;
              box-sizing: border-box;
              box-shadow: 0 0 30px rgba(0, 229, 160, 0.1);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px solid rgba(255,255,255,0.1);
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .header-title h1 {
              font-size: 20px;
              font-weight: bold;
              margin: 0;
              color: #ffffff;
            }
            .header-title p {
              font-size: 11px;
              color: #a0aec0;
              margin: 5px 0 0 0;
            }
            .period-badge {
              background-color: rgba(0, 229, 160, 0.15);
              border: 1px solid rgba(0, 229, 160, 0.3);
              color: #00E5A0;
              font-family: 'JetBrains Mono', monospace;
              font-size: 10px;
              padding: 6px 12px;
              border-radius: 20px;
              font-weight: bold;
            }
            
            .meta-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 30px;
              font-size: 12px;
            }
            .meta-item {
              background-color: rgba(255,255,255,0.02);
              border: 1px solid rgba(255,255,255,0.05);
              padding: 12px 15px;
              border-radius: 10px;
            }
            .meta-item span {
              color: #718096;
              font-size: 10px;
              text-transform: uppercase;
              display: block;
              margin-bottom: 4px;
            }
            .meta-item strong {
              color: #ffffff;
              font-size: 13px;
            }
            
            .stats-section {
              margin-bottom: 30px;
            }
            .stats-title {
              font-size: 12px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #00E5A0;
              font-weight: bold;
              margin-bottom: 15px;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 15px;
            }
            .stat-box {
              text-align: center;
              background-color: rgba(255,255,255,0.03);
              border: 1px solid rgba(255,255,255,0.05);
              padding: 20px 15px;
              border-radius: 12px;
            }
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              font-family: 'JetBrains Mono', monospace;
              color: #ffffff;
            }
            .stat-label {
              font-size: 10px;
              color: #a0aec0;
              margin-top: 5px;
              text-transform: uppercase;
            }
            
            .verification-text {
              background-color: rgba(61, 110, 255, 0.05);
              border: 1px solid rgba(61, 110, 255, 0.2);
              padding: 20px;
              border-radius: 12px;
              font-size: 12px;
              line-height: 1.6;
              color: #e2e8f0;
              margin-top: 30px;
            }
            .verification-footer {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 40px;
              padding-top: 20px;
              border-top: 1px solid rgba(255,255,255,0.1);
            }
            .signature {
              font-family: 'JetBrains Mono', monospace;
              font-size: 9px;
              color: #718096;
            }
            .signature strong {
              color: #00E5A0;
              display: block;
              font-size: 11px;
              margin-bottom: 4px;
            }
            
            @media print {
              body { background: #ffffff !important; color: #000000 !important; padding: 0; }
              .report-card { background: #ffffff !important; box-shadow: none !important; border: 1px solid #000000 !important; color: #000000 !important; }
              .header-title h1, .stat-value, .meta-item strong { color: #000000 !important; }
              .period-badge { background: #ffffff !important; border-color: #000000 !important; color: #000000 !important; }
              .verification-text { background: #ffffff !important; border-color: #000000 !important; color: #000000 !important; }
              .signature strong { color: #000000 !important; }
            }
          </style>
        </head>
        <body>
          <div class="report-card">
            <div class="header">
              <div class="header-title">
                <h1>ACCN ESG CARBON COMPLIANCE</h1>
                <p>Generated by ACCN AI Audit Engine</p>
              </div>
              <div class="period-badge">${period} REPORT</div>
            </div>
            
            <div class="meta-grid">
              <div class="meta-item">
                <span>Organization Member</span>
                <strong>${user.name}</strong>
              </div>
              <div class="meta-item">
                <span>Location Jurisdiction</span>
                <strong>${user.location}</strong>
              </div>
              <div class="meta-item">
                <span>Account Email</span>
                <strong>${user.email}</strong>
              </div>
              <div class="meta-item">
                <span>Compliance Verification Status</span>
                <strong>ACTIVE / SIGNED</strong>
              </div>
            </div>
            
            <div class="stats-section">
              <div class="stats-title">Carbon Offset Audit Indicators</div>
              <div class="stats-grid">
                <div class="stat-box">
                  <div class="stat-value">250 Tons</div>
                  <div class="stat-label">CO₂ Offset Saved</div>
                </div>
                <div class="stat-box">
                  <div class="stat-value">500 Tons</div>
                  <div class="stat-label">Quarterly Target</div>
                </div>
                <div class="stat-box">
                  <div class="stat-value">94%</div>
                  <div class="stat-label">Compliance Score</div>
                </div>
              </div>
            </div>
            
            <div class="verification-text">
              <strong>Cryptographic Audit Statement:</strong><br>
              This document serves as verification that the registered smart grids paired to owner 
              <strong>${user.name}</strong> have successfully verified <strong>250 Tons of CO₂</strong> 
              reduction against a target benchmark of <strong>500 Tons</strong>. 
              Telemetry feeds have been verified using ARIA AI audit logs with a reliability match 
              of <strong>${user.trustScore}%</strong>.
            </div>
            
            <div class="verification-footer">
              <div class="signature">
                <strong>✓ VERIFIED BY ARIA AI</strong>
                ACCN Compliance Protocol V3.0
              </div>
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 8px; color: #718096; text-align: right;">
                REPORT ID: ACCN-ESG-${period.replace(' ', '-')}-${Date.now().toString().slice(-5)}<br>
                SHA-256 SIGNATURE: a8b2f9011de54...287c118b
              </div>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.parent.document.body.removeChild(window.frameElement);
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
  };

  const handleGenerateReport = () => {
    setGenerating(true);
    setGenProgress(0);
    addToast('info', 'ESG Engine', 'Compiling and cryptographically signing carbon assets report...');
  };

  useEffect(() => {
    if (!generating) return;

    const timer = setInterval(() => {
      setGenProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setGenerating(false);
            downloadESGReportAsPDF();
            addToast('success', 'Compliance Report Ready', `ESG_Carbon_Report_${period.replace(' ', '_')}.pdf compiled and downloaded.`);
          }, 300);
          return 100;
        }
        return p + 4;
      });
    }, 80);

    return () => clearInterval(timer);
  }, [generating, period, addToast]);

  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-cardBorder pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cardBorder flex items-center justify-center border border-white/5 font-bold text-xs text-textSecondary">
            🏢
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold font-heading text-white">ESG Carbon Compliance</h1>
            <p className="text-xs text-textSecondary mt-0.5">Corporate compliance ratings and carbon targets audit.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl bg-cardSurface/60 border border-cardBorder text-xs text-textPrimary focus:outline-none"
          >
            <option value="Q1 2024">Q1 2024</option>
            <option value="Q2 2024">Q2 2024</option>
            <option value="Q3 2024">Q3 2024</option>
            <option value="Q4 2024">Q4 2024</option>
          </select>

          <button
            onClick={handleGenerateReport}
            className="px-5 py-2.5 rounded-xl bg-accentGreen text-bgSpace text-xs font-bold hover:scale-102 transition-transform shadow-neon-green flex items-center gap-1.5"
          >
            <ClipboardList className="w-4 h-4" />
            Generate PDF
          </button>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-2 glass-panel">
          <span className="text-[10px] font-mono text-textMuted uppercase select-none">Carbon Offset</span>
          <span className="text-2xl font-bold font-mono text-white">250 Tons</span>
          <span className="text-[10px] text-accentGreen font-bold font-mono flex items-center gap-1">
            ✓ On Track
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-2 glass-panel">
          <span className="text-[10px] font-mono text-textMuted uppercase select-none">Credits Purchased</span>
          <span className="text-2xl font-bold font-mono text-white">2,083 Credits</span>
          <span className="text-[10px] text-accentGreen font-bold font-mono flex items-center gap-1">
            &uarr; +120 this month
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-2 glass-panel">
          <span className="text-[10px] font-mono text-textMuted uppercase select-none">ESG Target</span>
          <span className="text-2xl font-bold font-mono text-white">500 Tons</span>
          <span className="text-[10px] text-accentCyan font-bold font-mono flex items-center gap-1">
            50% Achieved
          </span>
        </div>

        <div className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-2 glass-panel">
          <span className="text-[10px] font-mono text-textMuted uppercase select-none">Compliance Score</span>
          <span className="text-2xl font-bold font-mono text-white">94%</span>
          <span className="text-[10px] text-accentPurple font-bold font-mono flex items-center gap-1">
            A+ Rating
          </span>
        </div>
      </div>

      {/* Compliance Chart & Progress Rings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance Bar Chart (Recharts) */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-5 glass-panel">
          <div className="flex justify-between items-center select-none">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                Monthly Offset Mandate
              </h3>
              <span className="text-[9px] text-textSecondary">
                Target vs Actual emissions offset (Red: under compliant, Green: fully compliant)
              </span>
            </div>
            {/* Small animated progress circle */}
            <div className="w-12 h-12 relative flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="18" stroke="#1e2d45" strokeWidth="2.5" fill="none" />
                <circle cx="24" cy="24" r="18" stroke="#7C3AED" strokeWidth="3" strokeDasharray={2*Math.PI*18} strokeDashoffset={(2*Math.PI*18)*0.06} fill="none" strokeLinecap="round" />
              </svg>
              <span className="absolute text-[9px] font-mono font-bold text-accentPurple">94%</span>
            </div>
          </div>

          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={complianceData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#475569" fontSize={9} fontFamily="monospace" tickLine={false} />
                <YAxis stroke="#475569" fontSize={9} fontFamily="monospace" tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111827',
                    border: '1px solid #1E2D45',
                    borderRadius: '12px',
                    color: '#F1F5F9',
                    fontSize: '10px',
                    fontFamily: 'monospace'
                  }}
                />
                {/* Target line bar representing boundary limits */}
                <Bar dataKey="Target" fill="none" stroke="#475569" strokeDasharray="3 3" strokeWidth={1} radius={[3, 3, 0, 0]} />
                {/* Actual carbon offset */}
                <Bar dataKey="Actual" shape={renderCustomBar} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Rings column */}
        <div className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-6 glass-panel justify-center items-center">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono self-start border-b border-cardBorder pb-2 w-full select-none">
            Annual ESG Benchmark Target
          </h3>

          <div className="flex flex-col gap-4 w-full">
            {/* Ring 1: Carbon Offset */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 relative flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="22" stroke="#1e2d45" strokeWidth="3.5" fill="none" />
                  <circle cx="28" cy="28" r="22" stroke="#00FF88" strokeWidth="4.5" strokeDasharray={2*Math.PI*22} strokeDashoffset={(2*Math.PI*22)*0.5} fill="none" strokeLinecap="round" />
                </svg>
                <span className="absolute text-[10px] font-mono font-bold text-accentGreen">50%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-none">Carbon Offset Volume</span>
                <span className="text-[10px] text-textSecondary mt-1 select-none">250 Tons offset of 500 Tons target</span>
              </div>
            </div>

            {/* Ring 2: Credits Purchased */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 relative flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="22" stroke="#1e2d45" strokeWidth="3.5" fill="none" />
                  <circle cx="28" cy="28" r="22" stroke="#00D4FF" strokeWidth="4.5" strokeDasharray={2*Math.PI*22} strokeDashoffset={(2*Math.PI*22)*0.17} fill="none" strokeLinecap="round" />
                </svg>
                <span className="absolute text-[10px] font-mono font-bold text-accentCyan">83%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-none">Credits Acquired Target</span>
                <span className="text-[10px] text-textSecondary mt-1 select-none">2,083 CR purchased of 2,500 target</span>
              </div>
            </div>

            {/* Ring 3: Emissions Reduced */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 relative flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="28" cy="28" r="22" stroke="#1e2d45" strokeWidth="3.5" fill="none" />
                  <circle cx="28" cy="28" r="22" stroke="#7C3AED" strokeWidth="4.5" strokeDasharray={2*Math.PI*22} strokeDashoffset={(2*Math.PI*22)*0.33} fill="none" strokeLinecap="round" />
                </svg>
                <span className="absolute text-[10px] font-mono font-bold text-accentPurple">67%</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-white leading-none">Emissions Reduced Ratio</span>
                <span className="text-[10px] text-textSecondary mt-1 select-none">67% raw carbon offset efficiency achieved</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* PDF Report compiler checklist */}
      <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 glass-panel max-w-xl">
        <h3 className="text-sm font-bold text-white font-heading mb-4 select-none">
          PDF Report Compiler Options
        </h3>

        <div className="flex flex-col gap-3 font-mono text-xs">
          <label className="flex items-center gap-3 text-textSecondary hover:text-textPrimary cursor-pointer">
            <input
              type="checkbox"
              checked={chk1}
              onChange={() => setChk1(!chk1)}
              className="rounded border-cardBorder text-accentGreen focus:ring-accentGreen bg-bgSpace cursor-pointer w-4.5 h-4.5"
            />
            [✓] Executive Carbon Summary Overview
          </label>
          <label className="flex items-center gap-3 text-textSecondary hover:text-textPrimary cursor-pointer">
            <input
              type="checkbox"
              checked={chk2}
              onChange={() => setChk2(!chk2)}
              className="rounded border-cardBorder text-accentGreen focus:ring-accentGreen bg-bgSpace cursor-pointer w-4.5 h-4.5"
            />
            [✓] Carbon Credit Transactions Ledgers
          </label>
          <label className="flex items-center gap-3 text-textSecondary hover:text-textPrimary cursor-pointer">
            <input
              type="checkbox"
              checked={chk3}
              onChange={() => setChk3(!chk3)}
              className="rounded border-cardBorder text-accentGreen focus:ring-accentGreen bg-bgSpace cursor-pointer w-4.5 h-4.5"
            />
            [✓] Monthly Compliance Performance Charts
          </label>
          <label className="flex items-center gap-3 text-textSecondary hover:text-textPrimary cursor-pointer">
            <input
              type="checkbox"
              checked={chk4}
              onChange={() => setChk4(!chk4)}
              className="rounded border-cardBorder text-accentGreen focus:ring-accentGreen bg-bgSpace cursor-pointer w-4.5 h-4.5"
            />
            [✓] Cryptographic AI Verification Signatures
          </label>
          <label className="flex items-center gap-3 text-textSecondary hover:text-textPrimary cursor-pointer">
            <input
              type="checkbox"
              checked={chk5}
              onChange={() => setChk5(!chk5)}
              className="rounded border-cardBorder text-accentGreen focus:ring-accentGreen bg-bgSpace cursor-pointer w-4.5 h-4.5"
            />
            [ ] Raw Energy Telemetry Export Details
          </label>
        </div>

        {/* Generate Report Progress */}
        <AnimatePresence>
          {generating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 flex flex-col gap-2 font-mono text-[10px]"
            >
              <div className="flex justify-between text-accentCyan">
                <span className="flex items-center gap-1.5 font-bold animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Compiling report...
                </span>
                <span>{genProgress}%</span>
              </div>
              <div className="w-full h-1 bg-cardBorder rounded-full overflow-hidden">
                <div className="h-full bg-accentCyan shadow-neon-cyan transition-all" style={{ width: `${genProgress}%` }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="w-full mt-6 py-3 rounded-xl bg-accentGreen text-bgSpace text-xs font-bold hover:scale-102 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-neon-green disabled:opacity-50 disabled:pointer-events-none"
        >
          {generating ? 'Processing PDF Compile...' : 'Download PDF Report'}
        </button>
      </div>

    </div>
  );
};

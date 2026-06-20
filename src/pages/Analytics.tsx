import React, { useState, useEffect } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Calendar, 
  Download, 
  FileText, 
  Sparkles, 
  ArrowDown, 
  Flame, 
  ShieldAlert,
  ArrowRight,
  TrendingDown
} from 'lucide-react';
import { useToastStore } from '../store/useToastStore';
import { useTheme } from '../utils/theme';
import { motion } from 'framer-motion';

import { useNavigate } from 'react-router-dom';

export const Analytics: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { addToast } = useToastStore();
  const [timeframe, setTimeframe] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [aiGenerating, setAiGenerating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAiGenerating(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [timeframe]);

  // Main area chart data (monthly)
  const chartData = [
    { name: 'Jan', Expected: 120, Actual: 110 },
    { name: 'Feb', Expected: 130, Actual: 112 },
    { name: 'Mar', Expected: 125, Actual: 98 },
    { name: 'Apr', Expected: 140, Actual: 115 },
    { name: 'May', Expected: 150, Actual: 120 },
    { name: 'Jun', Expected: 160, Actual: 130 },
    { name: 'Jul', Expected: 155, Actual: 125 },
    { name: 'Aug', Expected: 145, Actual: 112 },
    { name: 'Sep', Expected: 135, Actual: 99 },
    { name: 'Oct', Expected: 130, Actual: 104 },
    { name: 'Nov', Expected: 120, Actual: 98 },
    { name: 'Dec', Expected: 115, Actual: 95 },
  ];

  // Device breakdown data
  const pieData = [
    { name: 'Air Conditioning', value: 42, color: '#00FF88' },
    { name: 'Refrigerator', value: 18, color: '#00D4FF' },
    { name: 'Lighting systems', value: 12, color: '#7C3AED' },
    { name: 'Water Heater', value: 15, color: '#F59E0B' },
    { name: 'Other Appliances', value: 13, color: '#475569' },
  ];

  // Generate GitHub-style heatmap data (52 weeks x 7 days)
  const heatmapData = React.useMemo(() => {
    const data = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Create 364 cells
    for (let i = 0; i < 364; i++) {
      const val = Math.random() > 0.35 ? Math.floor(Math.random() * 16) : 0;
      const monthIdx = Math.floor(i / 30) % 12;
      const day = i % 30 + 1;
      data.push({
        id: i,
        val,
        tooltip: `${months[monthIdx]} ${day}: ${val > 0 ? `${(val * 0.9).toFixed(1)} kWh saved` : '0 kWh saved'}`
      });
    }
    return data;
  }, []);

  const handleExport = (type: 'csv' | 'pdf') => {
    addToast('info', 'Exporting Analytics', `Compiling telemetry reports for download in ${type.toUpperCase()} format...`);
    setTimeout(() => {
      addToast('success', 'Download Ready', `ACCN_${timeframe}_telemetry.${type} downloaded successfully.`);
    }, 1500);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-cardBorder pb-4 select-none">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setTimeframe('daily')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              timeframe === 'daily' ? 'bg-accentGreen/15 text-accentGreen border border-accentGreen/20' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              timeframe === 'weekly' ? 'bg-accentGreen/15 text-accentGreen border border-accentGreen/20' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              timeframe === 'monthly' ? 'bg-accentGreen/15 text-accentGreen border border-accentGreen/20' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeframe('yearly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
              timeframe === 'yearly' ? 'bg-accentGreen/15 text-accentGreen border border-accentGreen/20' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Yearly
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleExport('csv')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-cardBorder bg-cardSurface/30 hover:bg-cardSurface/60 text-xs font-bold text-textPrimary hover:scale-102 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={() => handleExport('pdf')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-cardBorder bg-cardSurface/30 hover:bg-cardSurface/60 text-xs font-bold text-textPrimary hover:scale-102 transition-all"
          >
            <FileText className="w-3.5 h-3.5" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="w-full rounded-2xl border border-cardBorder bg-cardSurface/40 p-5 flex flex-col gap-5 glass-panel">
        <div className="flex justify-between items-start select-none">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
              Expected vs Actual Telemetry
            </h3>
            <span className="text-[10px] text-textSecondary">
              Comparison of scheduled benchmark goals vs monitored telemetry consumption in kWh.
            </span>
          </div>

          {/* KPI Summary pills */}
          <div className="flex gap-2">
            <span className="px-2.5 py-1 rounded bg-accentGreen/15 border border-accentGreen/30 text-[10px] font-bold text-accentGreen flex items-center gap-1">
              <ArrowDown className="w-3 h-3" /> 18% Savings
            </span>
            <span className="px-2.5 py-1 rounded bg-accentCyan/15 border border-accentCyan/30 text-[10px] font-bold text-accentCyan flex items-center gap-1">
              <Flame className="w-3 h-3" /> Peak: 2PM-5PM
            </span>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00FF88" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#00FF88" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="name" 
                stroke="#475569" 
                fontSize={10} 
                fontFamily="monospace"
                tickLine={false}
              />
              <YAxis 
                stroke="#475569" 
                fontSize={10} 
                fontFamily="monospace" 
                tickLine={false}
                axisLine={false}
              />
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
              <Area 
                type="monotone" 
                dataKey="Expected" 
                stroke="#00D4FF" 
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={1} 
                fill="url(#colorExpected)" 
              />
              <Area 
                type="monotone" 
                dataKey="Actual" 
                stroke="#00FF88" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorActual)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout: Insights + Heatmap/Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 1/3: AI Insights Panel */}
        <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-4 glass-panel h-full justify-between">
          <div className="flex items-center justify-between border-b border-cardBorder pb-3 select-none">
            <h3 className="text-sm font-bold text-white font-heading flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-accentCyan" />
              ARIA AI Analytics Insights
            </h3>
          </div>

          <div className="flex-grow flex flex-col gap-3.5 mt-2 justify-center">
            {aiGenerating ? (
              // Shimmer Loading State
              <div className="flex flex-col gap-4 animate-pulse">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-16 rounded-xl bg-white/5 border border-white/5 shimmer-bg" />
                ))}
              </div>
            ) : (
              <>
                <div className="p-3.5 rounded-xl border border-l-4 border-accentGreen/30 border-l-accentGreen bg-cardSurface/20">
                  <h4 className="text-xs font-bold text-white leading-none">18% Energy Efficiency Shift</h4>
                  <p className="text-[11px] text-textSecondary mt-1 leading-normal">
                    Usage is 18% lower compared to your historical 6-month benchmark. Earned an extra 2.5 credits.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-l-4 border-accentCyan/30 border-l-accentCyan bg-cardSurface/20">
                  <h4 className="text-xs font-bold text-white leading-none">Optimal Window: 2PM - 5PM</h4>
                  <p className="text-[11px] text-textSecondary mt-1 leading-normal">
                    Solar production peak offset 40% of home consumption in this window. Schedule appliance loads here.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-l-4 border-accentPurple/30 border-l-accentPurple bg-cardSurface/20">
                  <h4 className="text-xs font-bold text-white leading-none">Next Period Prediction: 82 kWh</h4>
                  <p className="text-[11px] text-textSecondary mt-1 leading-normal">
                    Neural forecasting anticipates savings of 14% next month based on active ambient temperature models.
                  </p>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => navigate('/ai-assistant')}
            className="w-full mt-4 py-2.5 rounded-xl border border-cardBorder bg-cardSurface/20 hover:bg-cardSurface/80 text-[11px] font-bold text-white flex items-center justify-center gap-1.5"
          >
            Consult AI Assistant <ArrowRight className="w-3.5 h-3.5 text-accentGreen" />
          </button>
        </div>

        {/* Right 2/3: Heatmap & Device breakdown */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Heatmap Widget */}
          <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-4 glass-panel">
            <div className="flex justify-between items-center select-none">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Daily Energy Savings Heatmap
              </h3>
              <span className="text-[9px] text-textMuted font-mono">364 Days Monitored</span>
            </div>

            {/* Heatmap Grid Wrapper */}
            <div className="overflow-x-auto pb-2 select-none">
              <div className="grid grid-flow-col grid-rows-7 gap-1 w-max">
                {heatmapData.map((d) => {
                  let cellBg = 'bg-cardBorder';
                  if (d.val > 0 && d.val <= 5) cellBg = 'bg-accentGreen/20 border border-accentGreen/10';
                  if (d.val > 5 && d.val <= 10) cellBg = 'bg-accentGreen/50';
                  if (d.val > 10 && d.val <= 15) cellBg = 'bg-accentGreen/80';
                  if (d.val > 15) cellBg = 'bg-accentGreen';

                  return (
                    <div
                      key={d.id}
                      title={d.tooltip}
                      className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-125 cursor-pointer ${cellBg}`}
                    />
                  );
                })}
              </div>
            </div>

            {/* Heatmap Legend */}
            <div className="flex justify-between items-center text-[10px] text-textSecondary font-mono select-none pt-2 border-t border-cardBorder/30">
              <div className="flex gap-4">
                <span>M</span>
                <span>W</span>
                <span>F</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Low</span>
                <div className="w-2.5 h-2.5 rounded-sm bg-cardBorder" />
                <div className="w-2.5 h-2.5 rounded-sm bg-accentGreen/20" />
                <div className="w-2.5 h-2.5 rounded-sm bg-accentGreen/50" />
                <div className="w-2.5 h-2.5 rounded-sm bg-accentGreen/80" />
                <div className="w-2.5 h-2.5 rounded-sm bg-accentGreen" />
                <span>High</span>
              </div>
            </div>
          </div>

          {/* Device breakdown and Pie chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 glass-panel">
            <div className="flex items-center justify-center h-48 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute flex flex-col items-center justify-center select-none">
                <span className="text-xl font-bold font-mono text-white">8.4 kWh</span>
                <span className="text-[10px] text-textSecondary">Today's Load</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-center font-mono text-xs">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 select-none">
                Device Load Share
              </h4>
              {pieData.map((d) => (
                <div key={d.name} className="flex justify-between items-center border-b border-cardBorder/30 pb-1.5">
                  <span className="flex items-center gap-2 text-textSecondary">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                    {d.name}
                  </span>
                  <span className="font-bold text-white">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

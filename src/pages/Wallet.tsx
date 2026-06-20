import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Coins, 
  Wallet as WalletIcon, 
  Plus, 
  QrCode, 
  Maximize2,
  Calendar,
  Sparkles,
  Info,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useToastStore } from '../store/useToastStore';
import { useTheme } from '../utils/theme';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { addToast } = useToastStore();
  const { 
    walletBalance, 
    walletCredits, 
    walletAddress, 
    transactionHistory, 
    mintCredits, 
    buyCredits 
  } = useStore();

  const [isFlipped, setIsFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [expandedTx, setExpandedTx] = useState<string | null>(null);
  
  // Send Modal state
  const [isSendOpen, setIsSendOpen] = useState(false);
  const [sendAddress, setSendAddress] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [sending, setSending] = useState(false);

  // Mint modal / form
  const [isMintOpen, setIsMintOpen] = useState(false);
  const [mintSource, setMintSource] = useState('Home Solar Rooftop');
  const [mintAmount, setMintAmount] = useState('5.0');

  // Sparkline-data for back of the card
  const cardHistory = [
    { name: '1', val: 10 },
    { name: '2', val: 15 },
    { name: '3', val: 12 },
    { name: '4', val: 20 },
    { name: '5', val: 18 },
    { name: '6', val: 25.5 },
  ];

  // Mouse Parallax for credit card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const rotateX = -(y - yc) / 8;
    const rotateY = (x - xc) / 8;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleSendCredits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendAddress || !sendAmount) return;
    const amt = parseFloat(sendAmount);
    if (amt > walletCredits) {
      addToast('error', 'Insufficient Funds', 'Transfer quantity exceeds active credits balance.');
      return;
    }

    setSending(true);
    setTimeout(() => {
      setSending(false);
      setIsSendOpen(false);
      
      // Simulate deduction
      useStore.setState((state) => ({
        walletCredits: Number((state.walletCredits - amt).toFixed(2)),
        transactionHistory: [
          {
            id: `tx-${Date.now()}`,
            type: 'sell',
            title: 'Credits Transferred',
            description: `Transferred ${amt} CR to ${sendAddress.substring(0, 8)}...`,
            timestamp: 'Just Now',
            amount: `-${amt} CR`,
          },
          ...state.transactionHistory,
        ],
      }));

      addToast('success', 'Transfer Complete', `Successfully dispatched ${amt} carbon credits.`);
      setSendAddress('');
      setSendAmount('');
    }, 1500);
  };

  const handleMintAction = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(mintAmount);
    setIsMintOpen(false);
    mintCredits(amt, mintSource);
    addToast('success', 'Credits Minted', `Generated +${amt} CR from ${mintSource}.`);
  };

  // Wallet Analytics Charts Data
  const sourceBreakdown = [
    { name: 'Solar', value: 60, color: '#00FF88' },
    { name: 'Wind', value: 25, color: '#00D4FF' },
    { name: 'Hydro', value: 15, color: '#7C3AED' },
  ];

  const valueHistory = [
    { name: 'Jul', Value: 1200 },
    { name: 'Aug', Value: 1450 },
    { name: 'Sep', Value: 1800 },
    { name: 'Oct', Value: 1650 },
    { name: 'Nov', Value: 2100 },
    { name: 'Dec', Value: 2450 },
  ];

  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-cardBorder pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white">Carbon Wallet</h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Asset registers, transaction signatures, and credit balances.
          </p>
        </div>
      </div>

      {/* Credit Card & Flip container */}
      <div className="flex flex-col items-center gap-6 py-6">
        <div 
          className="relative w-full max-w-[400px] h-[240px] cursor-pointer"
          style={{ perspective: '1000px' }}
        >
          <motion.div
            className="w-full h-full relative"
            style={{ 
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            }}
            transition={isFlipped ? { duration: 0.6 } : { duration: 0.1 }}
            onMouseMove={!isFlipped ? handleMouseMove : undefined}
            onMouseLeave={handleMouseLeave}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {/* FRONT FACE */}
            <div 
              className="absolute inset-0 w-full h-full rounded-3xl border border-cardBorder p-6 flex flex-col justify-between overflow-hidden shadow-2xl backface-hidden"
              style={{
                background: 'linear-gradient(135deg, #0A1424 0%, #15223A 100%)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              {/* Noise texture overlay */}
              <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />

              <div className="flex justify-between items-start">
                <span className="text-sm font-bold tracking-wider font-heading text-gradient-green-cyan uppercase">
                  ACCN
                </span>
                {/* Gold SVG Chip */}
                <svg className="w-9 h-7 rounded bg-amber-400/80 border border-amber-500 p-1" viewBox="0 0 24 24">
                  <path d="M2,8 H22 M2,16 H22 M8,2 V22 M16,2 V22" stroke="#4a3b00" strokeWidth="1.5" fill="none" />
                </svg>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-mono text-textMuted select-none tracking-widest uppercase">
                  Wallet Address
                </span>
                <span className="text-sm font-mono text-white tracking-widest">
                  &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; {walletAddress.substring(walletAddress.length - 4)}
                </span>
              </div>

              <div className="flex justify-between items-end border-t border-cardBorder/40 pt-4">
                <div>
                  <span className="text-xl font-bold font-mono text-accentGreen block leading-none">
                    {walletCredits.toFixed(1)} Credits
                  </span>
                  <span className="text-[10px] text-textSecondary font-mono block mt-1">
                    Market Value: ₹{walletBalance.toLocaleString()}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-textSecondary uppercase font-mono block select-none">
                    Rahul Kumar
                  </span>
                  <span className="text-[8px] font-mono text-accentCyan font-bold px-1.5 py-0.5 rounded bg-accentCyan/10 border border-accentCyan/20 mt-1 inline-block uppercase">
                    &bull; Verified Node
                  </span>
                </div>
              </div>
            </div>

            {/* BACK FACE */}
            <div 
              className="absolute inset-0 w-full h-full rounded-3xl border border-cardBorder p-6 flex flex-col justify-between overflow-hidden shadow-2xl backface-hidden"
              style={{
                background: 'linear-gradient(135deg, #15223A 0%, #0A1424 100%)',
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" />
              
              {/* Magnetic black strip */}
              <div className="absolute top-5 left-0 right-0 h-9 bg-black/80" />

              <div className="flex justify-between items-center mt-10">
                {/* CVV area */}
                <div className="h-8 w-2/3 bg-cardSurface/60 rounded border border-cardBorder flex items-center px-3 justify-end text-xs font-mono text-textMuted select-none">
                  CVV: <span className="font-bold text-white ml-2">***</span>
                </div>
                {/* mini chart of credits */}
                <svg className="w-20 h-8 opacity-40" viewBox="0 0 50 20">
                  <path d="M0,20 L0,15 L10,12 L20,18 L30,5 L40,10 L50,8 L50,20 Z" fill="#00FF88" fillOpacity="0.2" />
                  <path d="M0,15 L10,12 L20,18 L30,5 L40,10 L50,8" fill="none" stroke="#00FF88" strokeWidth="1.5" />
                </svg>
              </div>

              <div className="flex justify-between items-end border-t border-cardBorder/40 pt-4">
                <div className="flex items-center gap-2">
                  <QrCode className="w-8 h-8 text-white" />
                  <div className="flex flex-col font-mono text-[8px] text-textSecondary">
                    <span>SYS HASH: ACCN-4521</span>
                    <span>CHAIN: ACCN MAINNET</span>
                  </div>
                </div>
                <span className="text-[10px] text-textMuted font-mono">Tap Card to Flip</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Flip Button */}
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="px-4 py-1.5 rounded-lg border border-cardBorder bg-cardSurface/60 hover:bg-cardSurface text-xs text-textSecondary font-semibold"
        >
          {isFlipped ? 'Show Front' : 'Show Back QR'}
        </button>

        {/* Quick actions buttons row */}
        <div className="flex gap-4 max-w-sm w-full">
          <button
            onClick={() => setIsMintOpen(true)}
            className="flex-grow py-3 rounded-xl bg-accentGreen/15 border border-accentGreen/30 hover:bg-accentGreen hover:text-bgSpace text-accentGreen text-xs font-bold transition-all hover:scale-105 flex items-center justify-center gap-1.5 shadow-neon-green/10 hover:shadow-neon-green"
          >
            <Plus className="w-4 h-4" />
            Mint Credits
          </button>
          
          <button
            onClick={() => setIsSendOpen(true)}
            className="flex-grow py-3 rounded-xl bg-accentCyan/15 border border-accentCyan/30 hover:bg-accentCyan hover:text-bgSpace text-accentCyan text-xs font-bold transition-all hover:scale-105 flex items-center justify-center gap-1.5 shadow-neon-cyan/10 hover:shadow-neon-cyan"
          >
            <ArrowUpRight className="w-4 h-4" />
            Send
          </button>

          <button
            onClick={() => navigate('/marketplace')}
            className="flex-grow py-3 rounded-xl bg-cardSurface/60 border border-cardBorder hover:border-accentGold/40 hover:bg-accentGold/10 hover:text-accentGold text-textPrimary text-xs font-bold transition-all hover:scale-105 flex items-center justify-center gap-1.5"
          >
            <ArrowDownLeft className="w-4 h-4" />
            Sell
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-4 glass-panel">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cardBorder pb-4 select-none">
          <h3 className="text-base font-bold text-white font-heading">Ledger Transactions</h3>
          
          {/* Mock filters & search */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <input
                type="text"
                placeholder="Search transactions..."
                className="pl-8 pr-4 py-1.5 rounded-lg bg-bgSpace border border-cardBorder text-xs text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-accentGreen w-full"
              />
              <Search className="w-3.5 h-3.5 text-textMuted absolute left-2.5 top-2.5" />
            </div>
            <button className="p-2 rounded-lg bg-bgSpace border border-cardBorder text-textSecondary hover:text-textPrimary transition-colors">
              <Filter className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* List items */}
        <div className="flex flex-col gap-2">
          {transactionHistory.map((item) => {
            const isExpanded = expandedTx === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setExpandedTx(isExpanded ? null : item.id)}
                className="rounded-xl border border-cardBorder/80 bg-cardSurface/20 overflow-hidden hover:bg-white/5 transition-colors cursor-pointer"
              >
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold border border-white/10 text-textSecondary">
                      {item.type === 'mint' && '🪙'}
                      {item.type === 'sell' && '📤'}
                      {item.type === 'buy' && '📥'}
                      {item.type === 'trust' && '⭐'}
                      {item.type === 'device' && '🔌'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-textPrimary leading-none">{item.title}</h4>
                      <span className="text-[10px] text-textSecondary block mt-1">{item.timestamp}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span 
                      className={`text-xs font-mono font-bold ${
                        item.amount?.includes('-') ? 'text-danger' : 
                        item.amount?.includes('+') ? 'text-accentGreen' : 'text-textPrimary'
                      }`}
                    >
                      {item.amount || '—'}
                    </span>
                    <span className="text-[9px] font-mono text-textMuted block mt-1">Confirmed</span>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="border-t border-cardBorder bg-bgSpace/30 overflow-hidden"
                    >
                      <div className="p-4 font-mono text-[10px] text-textSecondary flex flex-col gap-2">
                        <div className="flex justify-between"><span className="text-textMuted">Transaction ID:</span> <span className="text-textPrimary">{item.id}-settle-active</span></div>
                        <div className="flex justify-between"><span className="text-textMuted">Details:</span> <span className="text-textPrimary">{item.description}</span></div>
                        <div className="flex justify-between"><span className="text-textMuted">Gas fee:</span> <span className="text-accentCyan">0.0004 GWEI (Covered)</span></div>
                        <div className="flex justify-between"><span className="text-textMuted">Status:</span> <span className="text-accentGreen font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-accentGreen animate-pulse"/> verified_on_ledger</span></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wallet Analytics Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 select-none">
        {/* Left: Donut chart */}
        <div className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-4 glass-panel">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Credit Generation Sources
          </h3>
          <div className="flex items-center justify-center h-40 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {sourceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-base font-bold font-mono text-white">3 Sources</span>
            </div>
          </div>
          <div className="flex justify-center gap-6 font-mono text-[10px] text-textSecondary">
            {sourceBreakdown.map((s) => (
              <span key={s.name} className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                {s.name} ({s.value}%)
              </span>
            ))}
          </div>
        </div>

        {/* Right: Area chart value history */}
        <div className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-4 glass-panel">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Wallet Balance History
          </h3>
          <div className="w-full h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={valueHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={9} fontFamily="monospace" tickLine={false} />
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
                <Area type="monotone" dataKey="Value" stroke="#F59E0B" strokeWidth={1.5} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* MODAL: Send credits */}
      <AnimatePresence>
        {isSendOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSendOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-cardBorder bg-bgMidnight p-6 relative overflow-hidden z-10 glass-panel"
            >
              <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider mb-4">
                Disburse Carbon Credits
              </h3>

              <form onSubmit={handleSendCredits} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-textSecondary uppercase tracking-wider">
                    Recipient Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="0x..."
                    value={sendAddress}
                    onChange={(e) => setSendAddress(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono text-textSecondary uppercase tracking-wider">
                      Quantity (Credits)
                    </label>
                    <span className="text-[10px] font-mono text-textMuted">Max: {walletCredits} CR</span>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max={walletCredits}
                    required
                    placeholder="0.0"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsSendOpen(false)}
                    className="flex-grow py-3.5 rounded-xl border border-cardBorder bg-cardSurface/30 text-textSecondary hover:text-textPrimary hover:bg-cardSurface/60 text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sending}
                    className="flex-grow py-3.5 rounded-xl bg-accentCyan text-bgSpace text-xs font-bold hover:scale-102 transition-all shadow-neon-cyan"
                  >
                    {sending ? 'Disbursing...' : 'Confirm Dispatch'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: Mint credits */}
      <AnimatePresence>
        {isMintOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMintOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-cardBorder bg-bgMidnight p-6 relative overflow-hidden z-10 glass-panel"
            >
              <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider mb-4">
                Mint New Carbon Assets
              </h3>

              <form onSubmit={handleMintAction} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-textSecondary uppercase tracking-wider">
                    Generation Source / Node
                  </label>
                  <select
                    value={mintSource}
                    onChange={(e) => setMintSource(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-bgSpace border border-cardBorder text-xs text-textPrimary focus:outline-none"
                  >
                    <option value="Home Solar Rooftop">Home Solar Rooftop</option>
                    <option value="Tata Wind Farm Sync">Tata Wind Farm Sync</option>
                    <option value="Smart Meter SM-HYD-4521">Smart Meter SM-HYD-4521</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-textSecondary uppercase tracking-wider">
                    Quantity to Mint (Verified)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    placeholder="1.0"
                    value={mintAmount}
                    onChange={(e) => setMintAmount(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsMintOpen(false)}
                    className="flex-grow py-3.5 rounded-xl border border-cardBorder bg-cardSurface/30 text-textSecondary hover:text-textPrimary hover:bg-cardSurface/60 text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-grow py-3.5 rounded-xl bg-accentGreen text-bgSpace text-xs font-bold hover:scale-102 transition-all shadow-neon-green"
                  >
                    Mint Assets &rarr;
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

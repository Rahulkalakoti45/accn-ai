import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  MicOff, 
  Trash2, 
  Sparkles, 
  CornerDownLeft, 
  Bot, 
  User as UserIcon,
  X
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useToastStore } from '../store/useToastStore';
import { useTheme } from '../utils/theme';
import { AIOrb3D } from '../components/AIOrb3D';
import { motion, AnimatePresence } from 'framer-motion';

export const AIAssistant: React.FC = () => {
  const theme = useTheme();
  const { addToast } = useToastStore();
  const { chatMessages, addChatMessage, clearChat } = useStore();
  
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  const suggestedQuestions = [
    { text: 'How did I earn credits?', query: 'How did I earn credits?' },
    { text: 'Improve my trust score?', query: 'Improve my trust score?' },
    { text: 'Predict next month savings', query: 'Predict next month savings' },
    { text: 'How to sell my credits?', query: 'How to sell my credits?' },
    { text: 'What is my CO₂ impact?', query: 'What is my CO2 impact?' },
    { text: 'Compare my usage to average', query: 'Compare my usage to average' }
  ];

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Send user message
    addChatMessage('user', textToSend);
    setInputVal('');
    setIsTyping(true);
    setSpeaking(false);

    // AI Simulated response mapping
    setTimeout(() => {
      let reply = "I've analyzed your telemetry files. Please refine your query or ask about your trust score factors, wallets, or marketplace listings.";
      
      const q = textToSend.toLowerCase();
      if (q.includes('earn')) {
        reply = "You earned 25.5 credits primarily from solar rooftop generation synced via meter SM-HYD-4521, which exported excess energy to the state grid.";
      } else if (q.includes('trust') || q.includes('score')) {
        reply = "To raise your trust score to 99%, complete these actions: connect a backup smart meter (+3%), upload missing 12-month logs (+1%), and finalize KYC verification (+1%).";
      } else if (q.includes('predict') || q.includes('next month') || q.includes('saving')) {
        reply = "ARIA forecasting engines anticipate a solar export increase of 14% next month due to dry summer projections, yielding approximately 3.2 carbon credits.";
      } else if (q.includes('sell')) {
        reply = "Go to the Carbon Marketplace tab. You can list your credits at the current index price of ₹120 each, earning a potential balance of ₹3,060.";
      } else if (q.includes('co2') || q.includes('impact') || q.includes('carbon')) {
        reply = "Your mitigation footprint offset equals 95 kg CO₂ this month, which compensates for approximately 50 fully grown pine trees or 12 car trips.";
      } else if (q.includes('average') || q.includes('compare')) {
        reply = "Your solar export is 32% more efficient than suburban averages in Hyderabad. You are currently ranked #1 on state leaderboards.";
      }

      setIsTyping(false);
      addChatMessage('ai', reply);
      setSpeaking(true);

      // Disable speaking state after 3 seconds
      setTimeout(() => setSpeaking(false), 4000);
    }, 1500);
  };

  const handleMicClick = () => {
    setIsVoiceMode(true);
    addToast('info', 'Voice Protocol', 'ARIA voice module activated. Listening...');
    
    // Simulate speaking after 3 seconds of listening
    setTimeout(() => {
      setIsVoiceMode(false);
      handleSendMessage('What is my CO2 impact?');
    }, 3000);
  };

  // Check if chat only contains initial welcome message
  const isChatIdle = chatMessages.length === 1;

  return (
    <div className="flex flex-col gap-6 w-full h-[calc(100vh-8.5rem)] relative overflow-hidden select-none">
      
      {/* Background drifting hexagons styling */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-[0.02] bg-[radial-gradient(ellipse_at_center,rgba(0,255,136,0.15)_0%,transparent_80%)]" />

      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-cardBorder pb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white flex items-center gap-2">
            ARIA AI Assistant <span className="text-xs bg-accentCyan/15 border border-accentCyan/30 text-accentCyan px-2 py-0.5 rounded-full uppercase font-mono tracking-wider font-bold">V2.4</span>
          </h1>
          <p className="text-xs text-textSecondary mt-0.5">
            ACCN compliance expert and predictive energy bot.
          </p>
        </div>
        <button
          onClick={clearChat}
          className="p-2 rounded-xl border border-cardBorder bg-cardSurface/30 hover:bg-cardSurface hover:text-danger text-textSecondary transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <Trash2 className="w-4 h-4" />
          Clear Chat
        </button>
      </div>

      {/* Main Area: Idle Orb or Messages Chat feed */}
      <div className="flex-grow overflow-y-auto px-2 py-4 flex flex-col gap-4 relative">
        {isChatIdle ? (
          /* IDLE COMPONENT */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-grow flex flex-col items-center justify-center text-center max-w-xl mx-auto w-full gap-6 mt-6"
          >
            {/* The 3D spinning orb */}
            <div className="w-56 h-56 relative flex items-center justify-center">
              <AIOrb3D speaking={speaking} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white uppercase tracking-wider font-heading flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-accentGreen" />
                ARIA Carbon Core
              </h2>
              <p className="text-xs text-textSecondary mt-1 leading-normal max-w-sm">
                Ask me about utility bill scans, trust score verification, or wallet asset trades.
              </p>
            </div>

            {/* Suggestions grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
              {suggestedQuestions.map((s) => (
                <button
                  key={s.text}
                  onClick={() => handleSendMessage(s.query)}
                  className="p-3.5 rounded-xl border border-cardBorder bg-cardSurface/20 hover:border-accentGreen/30 hover:bg-cardSurface/60 text-left text-xs text-textSecondary hover:text-textPrimary transition-all hover:scale-[1.01]"
                >
                  {s.text} &rarr;
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* ACTIVE CHAT FEED */
          <div className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
            {chatMessages.map((msg) => {
              const isAi = msg.sender === 'ai';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 max-w-[85%] ${isAi ? 'self-start' : 'self-end flex-row-reverse'}`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border flex-shrink-0 mt-1 select-none ${
                    isAi ? 'bg-accentGreen/15 border-accentGreen/30 text-accentGreen' : 'bg-white/5 border-white/10 text-textSecondary'
                  }`}>
                    {isAi ? <Bot className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                  </div>

                  {/* Bubble */}
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isAi
                      ? 'bg-cardSurface/40 border border-cardBorder text-textPrimary rounded-tl-sm glass-panel'
                      : 'bg-accentGreen/10 border border-accentGreen/30 text-white rounded-tr-sm'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>
                    <span className="text-[9px] font-mono text-textMuted mt-2 block text-right leading-none select-none">
                      {msg.timestamp}
                    </span>
                  </div>
                </motion.div>
              );
            })}

            {/* AI Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 max-w-[85%] self-start"
              >
                <div className="w-8 h-8 rounded-full bg-accentGreen/15 border border-accentGreen/30 text-accentGreen flex items-center justify-center flex-shrink-0 mt-1 select-none">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="p-4 rounded-2xl bg-cardSurface/40 border border-cardBorder text-textPrimary rounded-tl-sm glass-panel flex gap-1.5 items-center h-10 select-none">
                  <span className="w-1.5 h-1.5 bg-accentGreen rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-accentGreen rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-accentGreen rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input panel block */}
      <div className="flex-shrink-0 w-full max-w-2xl mx-auto pt-2 border-t border-cardBorder/30 bg-bgSpace relative">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputVal);
          }}
          className="relative flex items-center"
        >
          <button
            type="button"
            onClick={handleMicClick}
            className="absolute left-3 p-2 rounded-lg hover:bg-white/5 text-textSecondary hover:text-accentCyan transition-colors"
          >
            <Mic className="w-4.5 h-4.5" />
          </button>

          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Ask ARIA about utility scans or carbon portfolio credits..."
            className="w-full pl-12 pr-12 py-3.5 rounded-full border border-cardBorder bg-cardSurface/30 glass-input text-xs"
          />

          <button
            type="submit"
            disabled={!inputVal.trim()}
            className="absolute right-3 p-2 rounded-full bg-accentGreen hover:scale-105 transition-all text-bgSpace disabled:opacity-50 disabled:pointer-events-none disabled:scale-100"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* VOICE MODE DIALOG OVERLAY */}
      <AnimatePresence>
        {isVoiceMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-bgSpace/95 backdrop-blur-md flex flex-col items-center justify-center gap-8"
          >
            <button
              onClick={() => setIsVoiceMode(false)}
              className="absolute right-6 top-6 p-2 rounded-lg hover:bg-white/5 text-textSecondary hover:text-textPrimary"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Rotating mic node */}
            <div className="relative w-32 h-32 flex items-center justify-center select-none">
              <div className="absolute inset-0 border border-accentCyan/20 rounded-full animate-[ping_2s_infinite]" />
              <div className="absolute -inset-3 border border-accentGreen/10 rounded-full animate-[ping_3s_infinite_delay-700]" />
              <div className="w-20 h-20 rounded-full bg-accentCyan/10 border-2 border-accentCyan flex items-center justify-center text-accentCyan shadow-neon-cyan animate-pulse">
                <Mic className="w-8 h-8" />
              </div>
            </div>

            <div className="text-center flex flex-col gap-1 select-none">
              <h3 className="text-base font-bold text-white uppercase tracking-wider font-heading">
                ARIA Listening...
              </h3>
              <p className="text-xs text-textSecondary">State your query aloud now</p>
            </div>

            {/* Formatted animated soundwaves (20 bars) */}
            <div className="flex items-center gap-1.5 h-16">
              {Array.from({ length: 20 }).map((_, i) => {
                const animDelay = `${i * 80}ms`;
                return (
                  <motion.div
                    key={i}
                    animate={{ height: [12, Math.floor(Math.random() * 45) + 15, 12] }}
                    transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ animationDelay: animDelay }}
                    className="w-1 bg-accentCyan rounded-full"
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

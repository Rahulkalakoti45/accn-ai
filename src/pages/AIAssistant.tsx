import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Mic, 
  Trash2, 
  Sparkles, 
  Bot, 
  User as UserIcon,
  X,
  Plus,
  Cpu,
  Menu,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Check,
  RotateCcw
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useToastStore } from '../store/useToastStore';
import { useTheme } from '../utils/theme';
import { AIOrb3D } from '../components/AIOrb3D';
import { motion, AnimatePresence } from 'framer-motion';
import { renderMarkdown } from '../utils/markdown';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  createdAt: string;
}

export const AIAssistant: React.FC = () => {
  const theme = useTheme();
  const { addToast } = useToastStore();
  
  // Extract user metrics from the global store to inject in the system prompt
  const { 
    user, 
    walletBalance, 
    walletCredits, 
    connectedDevices 
  } = useStore();

  // Chat sessions state
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitleVal, setEditTitleVal] = useState('');

  // UI state
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  
  // Typewriter streaming state
  const [streamingText, setStreamingText] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('accn_chat_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ChatSession[];
        if (parsed.length > 0) {
          setSessions(parsed);
          // Set active session to the first one
          setActiveSessionId(parsed[0].id);
          return;
        }
      } catch (e) {
        console.error('Failed to parse chat sessions', e);
      }
    }

    // Initialize with a default session if empty
    const defaultSession: ChatSession = {
      id: 'session-default',
      title: 'ACCN Onboarding Chat',
      model: 'openai',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: 'welcome-msg',
          sender: 'ai',
          text: `Hello ${user.name}! I am ARIA, your AI Carbon Credit and Energy Analytics Assistant.

I can help you monitor your telemetry devices, analyze your CO₂ offset impact, raising your Trust Score, or list credits in the Carbon Marketplace.

Since I am a general-purpose AI, you can also ask me **anything else** — just like ChatGPT. For instance, I can write code, explain math, or solve general-purpose questions.

Select a model from the top dropdown, or pick one of these questions to start:`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    setSessions([defaultSession]);
    setActiveSessionId(defaultSession.id);
    localStorage.setItem('accn_chat_sessions', JSON.stringify([defaultSession]));
  }, []);

  // Save sessions to localStorage whenever they change
  const saveSessions = (updatedSessions: ChatSession[]) => {
    setSessions(updatedSessions);
    localStorage.setItem('accn_chat_sessions', JSON.stringify(updatedSessions));
  };

  // Find the active session object
  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isTyping, isStreaming, streamingText]);

  const suggestedQuestions = [
    { text: 'Analyze my credits generation', query: 'How did I generate my carbon credits?' },
    { text: 'Improve my trust score', query: 'What steps can I take to improve my trust score?' },
    { text: 'Predict next month solar savings', query: 'Can you predict my solar energy export savings for next month?' },
    { text: 'Write a React hook for API fetch', query: 'Write a clean TypeScript React hook for fetching API data with loading and error states.' },
    { text: 'How do I sell credits?', query: 'How do I list and sell credits on the Carbon Marketplace?' },
    { text: 'Calculate carbon footprint', query: 'Explain how carbon footprints are calculated for home electricity consumption.' }
  ];

  // Starts a new chat session
  const handleNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'New Chat',
      model: activeSession?.model || 'openai',
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `welcome-${Date.now()}`,
          sender: 'ai',
          text: `Hello! I am ready to answer any questions. What would you like to ask today?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };
    const updated = [newSession, ...sessions];
    saveSessions(updated);
    setActiveSessionId(newId);
    setInputVal('');
    if (inputRef.current) inputRef.current.focus();
  };

  // Delete session
  const handleDeleteSession = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = sessions.filter(s => s.id !== idToDelete);
    
    if (filtered.length === 0) {
      // Reinitialize default if all deleted
      localStorage.removeItem('accn_chat_sessions');
      const defaultSession: ChatSession = {
        id: 'session-default',
        title: 'ACCN Onboarding Chat',
        model: 'openai',
        createdAt: new Date().toISOString(),
        messages: [
          {
            id: 'welcome-msg',
            sender: 'ai',
            text: `Hello ${user.name}! I am ARIA. How can I help you today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]
      };
      saveSessions([defaultSession]);
      setActiveSessionId(defaultSession.id);
      return;
    }

    saveSessions(filtered);
    if (activeSessionId === idToDelete) {
      setActiveSessionId(filtered[0].id);
    }
  };

  // Start editing session title
  const startEditingSession = (id: string, currentTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSessionId(id);
    setEditTitleVal(currentTitle);
  };

  // Save session title edit
  const saveSessionTitle = (id: string) => {
    if (!editTitleVal.trim()) return;
    const updated = sessions.map(s => {
      if (s.id === id) {
        return { ...s, title: editTitleVal.trim() };
      }
      return s;
    });
    saveSessions(updated);
    setEditingSessionId(null);
  };

  // Change model for current session
  const handleModelChange = (modelKey: string) => {
    const updated = sessions.map(s => {
      if (s.id === activeSessionId) {
        return { ...s, model: modelKey };
      }
      return s;
    });
    saveSessions(updated);
    addToast('success', 'Model Swapped', `Switched active engine to ${modelKey === 'openai' ? 'GPT-4o' : modelKey === 'llama' ? 'Llama 3.1' : modelKey === 'mistral' ? 'Mistral Large' : 'Qwen Coder'}`);
  };

  // Build the system prompt dynamic context
  const buildSystemPrompt = () => {
    const metersText = connectedDevices
      .map(d => `- Meter ID: ${d.id}, Type: ${d.type}, Status: ${d.status}, Last Sync: ${d.lastSync}`)
      .join('\n');

    return `You are ARIA (AI Carbon Credit and Energy Analytics Assistant), an advanced AI carbon mitigation concierge running on the ACCN (AI Carbon Credit Network) SaaS dashboard.

Your persona is crisp, mathematical, futuristic, and highly intelligent. You are expert in clean tech, smart energy networks, solar grids, carbon accounting, and cryptographic tokens.
You are also a fully capable general AI (like ChatGPT), meaning you can answer general questions, draft emails, write code, explain math, and solve logic puzzles.

Use Markdown tags (bold, italic, list items, headers, code blocks with correct language extension, and formatted markdown tables) to structure your responses.

Below is the live context of the authenticated user you are assisting. Reference this context when they ask about their profile, credits, smart meters, or wallet stats:
[USER PROFILE CONTEXT]
- Name: ${user.name}
- Email: ${user.email}
- Location: ${user.location}
- Trust Score: ${user.trustScore}% (KYC: ${user.kycVerified ? 'Verified' : 'Pending'})
- Wallet Balance: ₹${walletBalance.toLocaleString()} INR
- Carbon Wallet Credits: ${walletCredits} CR (Credits Address: ${user.walletAddress})
- Connected Telemetry Hardware:
${metersText || 'No smart meters connected.'}

Provide precise, direct, and elite answers. If they ask something unrelated to ACCN, answer it perfectly with your general knowledge, but maintain a helpful and professional tone.`;
  };

  // Core message sending
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isTyping || isStreaming) return;

    const currentSession = sessions.find(s => s.id === activeSessionId) || sessions[0];

    // 1. Add User Message
    const userMsg: Message = {
      id: `msg-${Date.now()}-user`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Auto update session title if it's currently 'New Chat'
    let updatedTitle = currentSession.title;
    if (currentSession.title === 'New Chat' || currentSession.messages.length <= 1) {
      updatedTitle = textToSend.slice(0, 30) + (textToSend.length > 30 ? '...' : '');
    }

    const sessionWithUserMsg: ChatSession = {
      ...currentSession,
      title: updatedTitle,
      messages: [...currentSession.messages, userMsg]
    };

    const nextSessions = sessions.map(s => s.id === currentSession.id ? sessionWithUserMsg : s);
    saveSessions(nextSessions);
    setInputVal('');
    setIsTyping(true);
    setSpeaking(false);

    try {
      // 2. Build conversation history as text for GET request
      // Limit to last 8 messages for context safety and URL length constraints
      const systemPrompt = buildSystemPrompt();
      const recentMessages = sessionWithUserMsg.messages.slice(-8);
      const conversationContext = recentMessages.map(m => {
        return `${m.sender === 'user' ? 'User' : 'ARIA'}: ${m.text}`;
      }).join('\n');

      const fullPrompt = `${conversationContext}\nARIA:`;

      const encodedPrompt = encodeURIComponent(fullPrompt);
      const encodedSystem = encodeURIComponent(systemPrompt);
      const model = currentSession.model || 'openai';

      const url = `https://text.pollinations.ai/${encodedPrompt}?model=${model}&system=${encodedSystem}`;

      // 3. API Call (GET request to bypass CORS/POST WAF rate limits)
      const response = await fetch(url, {
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }

      const replyText = await response.text();
      setIsTyping(false);

      if (!replyText.trim()) {
        throw new Error('Empty response received from server.');
      }

      // 4. Typewriter text streaming simulation
      setIsStreaming(true);
      setStreamingText('');

      const words = replyText.split(/(\s+)/); // split keep whitespace delimiters
      let wordIndex = 0;
      let accumulatedText = '';
      setSpeaking(true);

      const streamTimer = setInterval(() => {
        if (wordIndex < words.length) {
          accumulatedText += words[wordIndex];
          setStreamingText(accumulatedText);
          wordIndex++;
        } else {
          clearInterval(streamTimer);
          setIsStreaming(false);
          setSpeaking(false);

          // Save final message in the session history
          const aiMsg: Message = {
            id: `msg-${Date.now()}-ai`,
            sender: 'ai',
            text: replyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          const sessionWithAiMsg: ChatSession = {
            ...sessionWithUserMsg,
            messages: [...sessionWithUserMsg.messages, aiMsg]
          };

          const finalSessions = sessions.map(s => s.id === currentSession.id ? sessionWithAiMsg : s);
          saveSessions(finalSessions);
          setStreamingText('');
        }
      }, 15); // Adjust for smooth reading speed

    } catch (error) {
      console.error('Error fetching chat response: ', error);
      setIsTyping(false);
      setIsStreaming(false);

      // Add failure message
      const errorMsg: Message = {
        id: `msg-${Date.now()}-ai-error`,
        sender: 'ai',
        text: `⚠️ **Connection Error**: I was unable to connect to the AI model networks. Please check your internet connection or try again. \n\n*Error details: ${(error as Error).message || 'Server queue full or CORS blocked'}*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const sessionWithError: ChatSession = {
        ...sessionWithUserMsg,
        messages: [...sessionWithUserMsg.messages, errorMsg]
      };
      const finalSessions = sessions.map(s => s.id === currentSession.id ? sessionWithError : s);
      saveSessions(finalSessions);
      addToast('error', 'Response Offline', 'API request failed. Resorting to offline failure node.');
    }
  };

  // Microphone trigger simulation
  const handleMicClick = () => {
    setIsVoiceMode(true);
    addToast('info', 'Voice Protocol', 'ARIA voice module activated. Listening...');
    
    // Simulate speaking after 3 seconds of listening
    setTimeout(() => {
      setIsVoiceMode(false);
      handleSendMessage('What is my CO2 offset impact and my trust score?');
    }, 3000);
  };

  const isChatIdle = activeSession?.messages.length <= 1 && !isTyping && !isStreaming;

  // Clear current active session messages
  const handleClearChat = () => {
    const updated = sessions.map((s): ChatSession => {
      if (s.id === activeSessionId) {
        return {
          ...s,
          messages: [
            {
              id: `welcome-${Date.now()}`,
              sender: 'ai' as const,
              text: `Hello ${user.name}! Let's restart our conversation. How can I help you today?`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
      }
      return s;
    });
    saveSessions(updated);
    addToast('info', 'Chat Cleared', 'Active conversation context has been reset.');
  };

  return (
    <div className="flex w-full h-[calc(100vh-8.5rem)] relative rounded-2xl overflow-hidden border border-cardBorder/40 bg-bgSpace/30 backdrop-blur-md select-none">
      
      {/* 1. CHAT HISTORY SIDEBAR */}
      <div 
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } flex-shrink-0 border-r border-cardBorder/45 bg-void/50 flex flex-col transition-all duration-300 overflow-hidden relative z-20`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-cardBorder/40 flex justify-between items-center gap-2">
          <button
            onClick={handleNewChat}
            className="flex-grow flex items-center justify-center gap-2 p-2.5 rounded-xl border border-accentGreen/30 bg-accentGreen/5 hover:bg-accentGreen hover:text-bgSpace text-accentGreen text-xs font-bold transition-all hover:shadow-[0_0_12px_rgba(0,229,160,0.15)] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Sessions scroll feed */}
        <div className="flex-grow overflow-y-auto p-2 space-y-1">
          {sessions.map((s) => {
            const isActive = s.id === activeSessionId;
            const isEditing = editingSessionId === s.id;

            return (
              <div
                key={s.id}
                onClick={() => {
                  if (!isEditing) {
                    setActiveSessionId(s.id);
                  }
                }}
                className={`group flex items-center justify-between p-3 rounded-xl text-xs transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-cardSurface/60 border border-cardBorder/80 text-white' 
                    : 'text-textSecondary hover:bg-cardSurface/20 hover:text-textPrimary border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 overflow-hidden flex-grow mr-2">
                  <Bot className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-accentGreen' : 'text-textMuted'}`} />
                  
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitleVal}
                      onChange={(e) => setEditTitleVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') saveSessionTitle(s.id);
                        if (e.key === 'Escape') setEditingSessionId(null);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-void border border-cardBorder text-white text-[11px] px-1 py-0.5 rounded outline-none w-full"
                      autoFocus
                    />
                  ) : (
                    <span className="truncate pr-1 font-semibold">{s.title}</span>
                  )}
                </div>

                {/* Session editing icons */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {isEditing ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        saveSessionTitle(s.id);
                      }}
                      className="p-1 hover:text-accentGreen rounded hover:bg-white/5"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={(e) => startEditingSession(s.id, s.title, e)}
                        className="p-1 hover:text-accentCyan rounded hover:bg-white/5"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteSession(s.id, e)}
                        className="p-1 hover:text-danger rounded hover:bg-white/5"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-cardBorder/35 bg-void/30 flex items-center justify-between text-[10px] text-textMuted select-none">
          <span>Active Context Active</span>
          <span className="font-mono text-accentGreen uppercase font-bold">Secure</span>
        </div>
      </div>

      {/* 2. MAIN CHAT AREA */}
      <div className="flex-grow flex flex-col h-full bg-void/10 relative overflow-hidden">
        
        {/* Background gradient ring */}
        <div className="absolute inset-0 -z-10 pointer-events-none opacity-[0.02] bg-[radial-gradient(ellipse_at_center,rgba(0,229,160,0.1)_0%,transparent_75%)]" />

        {/* Top Chat Header Toolbar */}
        <div className="flex justify-between items-center px-4 py-3 border-b border-cardBorder/45 bg-void/25 flex-shrink-0 z-10">
          <div className="flex items-center gap-2">
            {/* Sidebar toggle button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg border border-cardBorder/50 hover:bg-cardSurface/30 text-textSecondary hover:text-white transition-colors cursor-pointer"
              title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm md:text-base font-bold font-heading text-white flex items-center gap-1.5">
                  ARIA AI assistant
                </h1>
                <span className="text-[9px] bg-accentCyan/10 border border-accentCyan/20 text-accentCyan px-1.5 py-0.5 rounded-md uppercase font-mono tracking-wider font-bold">V3.0 Pro</span>
              </div>
              <p className="text-[10px] text-textSecondary hidden md:block">
                Connected to ACCN secure state parameters.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Model Selector Dropdown */}
            <div className="flex items-center gap-1.5 bg-cardSurface/20 border border-cardBorder/50 px-2.5 py-1 rounded-xl">
              <Cpu className="w-3.5 h-3.5 text-accentCyan" />
              <select
                value={activeSession?.model || 'openai'}
                onChange={(e) => handleModelChange(e.target.value)}
                className="bg-transparent text-white text-[11px] font-semibold outline-none cursor-pointer border-none py-0.5 pr-2"
              >
                <option value="openai" className="bg-void text-white">GPT-4o (OpenAI)</option>
                <option value="llama" className="bg-void text-white">Llama 3.1 (Meta)</option>
                <option value="mistral" className="bg-void text-white">Mistral Large</option>
                <option value="qwen-coder" className="bg-void text-white">Qwen Coder (Alibaba)</option>
              </select>
            </div>

            {/* Clear active session chat */}
            <button
              onClick={handleClearChat}
              className="p-2 rounded-xl border border-cardBorder bg-cardSurface/30 hover:bg-cardSurface hover:text-danger text-textSecondary transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
              title="Reset current conversation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Messages Feed Viewport */}
        <div className="flex-grow overflow-y-auto px-4 py-6 flex flex-col gap-6 relative select-text">
          {isChatIdle ? (
            /* IDLE/WELCOME VIEWPORT */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-grow flex flex-col items-center justify-center text-center max-w-xl mx-auto w-full gap-6 my-auto select-none"
            >
              {/* Rotating 3D wireframe core orb */}
              <div className="w-40 h-40 relative flex items-center justify-center">
                <AIOrb3D speaking={speaking} />
              </div>

              <div>
                <h2 className="text-md font-bold text-white uppercase tracking-widest font-heading flex items-center justify-center gap-2">
                  <Sparkles className="w-4.5 h-4.5 text-accentGreen" />
                  ARIA Core Engine
                </h2>
                <p className="text-[11px] md:text-xs text-textSecondary mt-1 leading-normal max-w-sm">
                  Choose a telemetry query or type a coding/general knowledge question below.
                </p>
              </div>

              {/* Dynamic Grid list of suggestion items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full">
                {suggestedQuestions.map((s) => (
                  <button
                    key={s.text}
                    onClick={() => handleSendMessage(s.query)}
                    className="p-3 rounded-xl border border-cardBorder/40 bg-cardSurface/10 hover:border-accentGreen/30 hover:bg-cardSurface/40 text-left text-[11px] text-textSecondary hover:text-textPrimary transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                  >
                    {s.text} &rarr;
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            /* ACTIVE MESSAGES SCROLL */
            <div className="flex flex-col gap-5 w-full max-w-3xl mx-auto">
              {activeSession?.messages.map((msg) => {
                const isAi = msg.sender === 'ai';
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3.5 max-w-[90%] md:max-w-[85%] ${isAi ? 'self-start' : 'self-end'}`}
                  >
                    {/* Message sender Avatar Icon on the left for AI */}
                    {isAi && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center border flex-shrink-0 select-none bg-accentGreen/15 border-accentGreen/35 text-accentGreen mt-1.5">
                        <Bot className="w-4.5 h-4.5" />
                      </div>
                    )}

                    {/* Chat dialog bubble */}
                    <div className={`p-4 rounded-2xl ${
                      isAi
                        ? 'bg-cardSurface/35 border border-cardBorder/80 text-textPrimary rounded-tl-sm glass-panel'
                        : 'bg-accentGreen/10 border border-accentGreen/30 text-white rounded-tr-sm'
                    }`}>
                      {/* Render text using custom markdown engine */}
                      {renderMarkdown(msg.text)}

                      <span className="text-[8px] font-mono text-textMuted mt-3 block text-right leading-none select-none">
                        {msg.timestamp}
                      </span>
                    </div>

                    {/* Message sender Avatar Icon on the right for User */}
                    {!isAi && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center border flex-shrink-0 select-none bg-white/5 border-white/10 text-textSecondary mt-0.5">
                        <UserIcon className="w-4 h-4" />
                      </div>
                    )}
                  </motion.div>
                );
              })}

              {/* Real-time Streaming message container */}
              {isStreaming && streamingText && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3.5 max-w-[90%] md:max-w-[85%] self-start"
                >
                  <div className="w-8 h-8 rounded-full bg-accentGreen/15 border border-accentGreen/35 text-accentGreen flex items-center justify-center flex-shrink-0 mt-1.5 select-none">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                  <div className="p-4 rounded-2xl bg-cardSurface/35 border border-cardBorder/80 text-textPrimary rounded-tl-sm glass-panel">
                    {/* Stream parsed code/tables continuously */}
                    {renderMarkdown(streamingText)}
                    
                    {/* Blinking cursor representing active typing */}
                    <span className="inline-block w-1.5 h-3.5 bg-accentGreen ml-1 animate-[pulse_0.8s_infinite] align-middle" />
                  </div>
                </motion.div>
              )}

              {/* Loading thinking bouncing dots */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3.5 max-w-[85%] self-start"
                >
                  <div className="w-8 h-8 rounded-full bg-accentGreen/15 border border-accentGreen/35 text-accentGreen flex items-center justify-center flex-shrink-0 mt-1.5 select-none">
                    <Bot className="w-4.5 h-4.5" />
                  </div>
                  <div className="p-4 rounded-2xl bg-cardSurface/35 border border-cardBorder/80 text-textPrimary rounded-tl-sm glass-panel flex gap-1.5 items-center h-10 select-none">
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

        {/* Bottom Input block */}
        <div className="flex-shrink-0 w-full max-w-3xl mx-auto px-4 pb-4 pt-2 border-t border-cardBorder/25 bg-void/10 relative">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputVal);
            }}
            className="relative flex items-center"
          >
            {/* Simulated mic voice dictation button */}
            <button
              type="button"
              onClick={handleMicClick}
              disabled={isTyping || isStreaming}
              className="absolute left-3.5 p-2 rounded-lg hover:bg-white/5 text-textSecondary hover:text-accentCyan transition-colors cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
              title="Voice Dictation"
            >
              <Mic className="w-4.5 h-4.5" />
            </button>

            {/* Input field */}
            <input
              type="text"
              ref={inputRef}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder={`Ask ARIA a question in ${activeSession?.model === 'openai' ? 'GPT-4o' : activeSession?.model === 'llama' ? 'Llama 3' : activeSession?.model === 'mistral' ? 'Mistral Large' : 'Qwen Coder'}...`}
              disabled={isTyping || isStreaming}
              className="w-full pl-12 pr-12 py-3.5 rounded-full border border-cardBorder bg-cardSurface/30 glass-input text-xs text-white focus:outline-none focus:border-accentGreen/50 focus:bg-cardSurface/45 transition-all"
            />

            {/* Send trigger */}
            <button
              type="submit"
              disabled={!inputVal.trim() || isTyping || isStreaming}
              className="absolute right-3.5 p-2 rounded-full bg-accentGreen hover:scale-105 transition-all text-bgSpace disabled:opacity-40 disabled:pointer-events-none disabled:scale-100 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Under input warning disclaimer */}
          <div className="text-[10px] text-textMuted text-center mt-2 font-mono select-none">
            ARIA can make errors. Verify smart meter diagnostics or cryptographic contracts.
          </div>
        </div>

        {/* VOICE MODE GLOW OVERLAY */}
        <AnimatePresence>
          {isVoiceMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-bgSpace/95 backdrop-blur-md flex flex-col items-center justify-center gap-8"
            >
              {/* Close voice mode */}
              <button
                onClick={() => setIsVoiceMode(false)}
                className="absolute right-6 top-6 p-2 rounded-lg hover:bg-white/5 text-textSecondary hover:text-textPrimary cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Pulsing visual core */}
              <div className="relative w-32 h-32 flex items-center justify-center select-none">
                <div className="absolute inset-0 border border-accentCyan/20 rounded-full animate-[ping_2s_infinite]" />
                <div className="absolute -inset-3 border border-accentGreen/10 rounded-full animate-[ping_3s_infinite_delay-700]" />
                <div className="w-20 h-20 rounded-full bg-accentCyan/10 border-2 border-accentCyan flex items-center justify-center text-accentCyan shadow-neon-cyan animate-pulse">
                  <Mic className="w-8 h-8" />
                </div>
              </div>

              <div className="text-center flex flex-col gap-1 select-none animate-pulse">
                <h3 className="text-base font-bold text-white uppercase tracking-wider font-heading">
                  ARIA Listening...
                </h3>
                <p className="text-xs text-textSecondary">State your compliance question now</p>
              </div>

              {/* Sound waves amplitude bars */}
              <div className="flex items-center gap-1.5 h-16 select-none">
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
    </div>
  );
};

import { create } from 'zustand';

export interface Activity {
  id: string;
  type: 'mint' | 'sell' | 'trust' | 'device' | 'buy';
  title: string;
  description: string;
  timestamp: string;
  amount?: string;
  linkText?: string;
  linkUrl?: string;
}

export interface Listing {
  id: number;
  seller: string;
  location: string;
  trustScore: number;
  credits: number;
  energyType: 'Solar' | 'Wind' | 'Hydro' | 'Home Solar';
  pricePerCredit: number;
  verified: boolean;
}

export interface NotificationItem {
  id: string;
  category: 'credits' | 'trust' | 'marketplace' | 'system';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface SmartMeter {
  id: string;
  type: string;
  status: 'Active' | 'Inactive';
  lastSync: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  credits: number;
  trustScore: number;
  badges: string[];
  trend: 'up' | 'down' | 'same';
  isCurrentUser?: boolean;
}

interface AppState {
  // Theme
  themeColor: 'green' | 'cyan' | 'purple' | 'gold';
  setThemeColor: (color: 'green' | 'cyan' | 'purple' | 'gold') => void;

  // Auth State
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  user: {
    name: string;
    email: string;
    walletAddress: string;
    trustScore: number;
    kycVerified: boolean;
    location: string;
    avatarUrl?: string;
  };
  updateUser: (fields: Partial<AppState['user']>) => void;

  // Wallet
  walletBalance: number;
  walletCredits: number;
  walletAddress: string;
  transactionHistory: Activity[];
  mintCredits: (amount: number, source: string) => void;
  sellCredits: (amount: number, buyer: string, price: number) => void;
  buyCredits: (amount: number, seller: string, price: number) => void;

  // Marketplace
  marketplaceListings: Listing[];
  addListing: (listing: Omit<Listing, 'id'>) => void;
  removeListing: (id: number) => void;
  liveFeed: { id: string; message: string; timestamp: string }[];
  addLiveFeed: (msg: string) => void;

  // Notifications
  notifications: NotificationItem[];
  addNotification: (category: NotificationItem['category'], title: string, body: string, link?: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: () => number;

  // Devices
  connectedDevices: SmartMeter[];
  connectDevice: (device: Omit<SmartMeter, 'status' | 'lastSync'>) => void;
  disconnectDevice: (id: string) => void;

  // AI Chat
  chatMessages: ChatMessage[];
  addChatMessage: (sender: 'user' | 'ai', text: string) => void;
  clearChat: () => void;

  // Leaderboard
  leaderboard: LeaderboardUser[];
  updateLeaderboard: () => void;

  // ESG Reports
  co2Saved: number; // in kg
  targetCO2: number; // in kg
}

export const useStore = create<AppState>((set, get) => ({
  themeColor: 'green',
  setThemeColor: (themeColor) => set({ themeColor }),

  isAuthenticated: true,
  setIsAuthenticated: (val) => set({ isAuthenticated: val }),
  user: {
    name: 'Rahul Kumar',
    email: 'rahul@example.com',
    walletAddress: '0x7aA2...4521',
    trustScore: 96,
    kycVerified: true,
    location: 'Hyderabad, India',
  },
  updateUser: (fields) => set((state) => ({ user: { ...state.user, ...fields } })),

  walletBalance: 2450,
  walletCredits: 25.5,
  walletAddress: '0x7aA2568F3dE904724521',

  transactionHistory: [
    {
      id: 'tx-1',
      type: 'mint',
      title: 'Credit Generated',
      description: '+2.5 carbon credits from solar export',
      timestamp: 'Today, 3:42 PM',
      amount: '+2.5 CR',
      linkText: 'View Certificate',
      linkUrl: '#',
    },
    {
      id: 'tx-2',
      type: 'trust',
      title: 'Trust Score Updated',
      description: 'Score improved from 94% → 96%',
      timestamp: 'Today, 10:15 AM',
      amount: '+2%',
      linkText: 'View Details',
      linkUrl: '#',
    },
    {
      id: 'tx-3',
      type: 'sell',
      title: 'Credit Sold',
      description: '3 credits sold @ ₹120 each to Tata Steel',
      timestamp: 'Yesterday, 6:00 PM',
      amount: '+₹360',
      linkText: 'View Transaction',
      linkUrl: '#',
    },
    {
      id: 'tx-4',
      type: 'device',
      title: 'New Smart Meter Connected',
      description: 'Meter ID: SM-HYD-4521 verified and active',
      timestamp: 'Mon, Dec 9',
      amount: 'Verified',
    },
  ],

  mintCredits: (amount, source) => {
    const newTx: Activity = {
      id: `tx-${Date.now()}`,
      type: 'mint',
      title: 'Credits Minted',
      description: `+${amount} carbon credits from ${source} verification`,
      timestamp: 'Just Now',
      amount: `+${amount} CR`,
      linkText: 'View Certificate',
      linkUrl: '#',
    };
    set((state) => ({
      walletCredits: Number((state.walletCredits + amount).toFixed(2)),
      co2Saved: Number((state.co2Saved + amount * 3.7).toFixed(1)), // 1 credit = 3.7 kg CO2 offset roughly (custom conversion)
      transactionHistory: [newTx, ...state.transactionHistory],
    }));
    get().addNotification('credits', 'Credits Minted Successfully', `Generated +${amount} CR from ${source}.`);
  },

  sellCredits: (amount, buyer, price) => {
    const value = amount * price;
    const newTx: Activity = {
      id: `tx-${Date.now()}`,
      type: 'sell',
      title: 'Credits Sold',
      description: `${amount} credits sold @ ₹${price} each to ${buyer}`,
      timestamp: 'Just Now',
      amount: `+₹${value}`,
      linkText: 'View Transaction',
      linkUrl: '#',
    };
    set((state) => ({
      walletCredits: Number((state.walletCredits - amount).toFixed(2)),
      walletBalance: state.walletBalance + value,
      transactionHistory: [newTx, ...state.transactionHistory],
    }));
    get().addNotification('marketplace', 'Credits Sold', `Sold ${amount} CR to ${buyer} for ₹${value}.`);
  },

  buyCredits: (amount, seller, price) => {
    const value = amount * price;
    const newTx: Activity = {
      id: `tx-${Date.now()}`,
      type: 'buy',
      title: 'Credits Purchased',
      description: `Bought ${amount} credits @ ₹${price} from ${seller}`,
      timestamp: 'Just Now',
      amount: `-${amount} CR`,
      linkText: 'View Details',
      linkUrl: '#',
    };
    set((state) => ({
      walletCredits: Number((state.walletCredits + amount).toFixed(2)),
      walletBalance: state.walletBalance - value,
      transactionHistory: [newTx, ...state.transactionHistory],
    }));
    get().addNotification('marketplace', 'Purchase Successful', `Purchased ${amount} CR from ${seller} for ₹${value}.`);
  },

  marketplaceListings: [
    { id: 1, seller: 'Rahul K.', location: 'Hyderabad', trustScore: 98, credits: 5, energyType: 'Solar', pricePerCredit: 120, verified: true },
    { id: 2, seller: 'Priya M.', location: 'Chennai', trustScore: 95, credits: 12, energyType: 'Wind', pricePerCredit: 115, verified: true },
    { id: 3, seller: 'Arun S.', location: 'Delhi', trustScore: 92, credits: 3, energyType: 'Home Solar', pricePerCredit: 110, verified: false },
    { id: 4, seller: 'Kishore J.', location: 'Mumbai', trustScore: 97, credits: 50, energyType: 'Solar', pricePerCredit: 118, verified: true },
    { id: 5, seller: 'Nisha G.', location: 'Pune', trustScore: 94, credits: 8, energyType: 'Wind', pricePerCredit: 116, verified: false },
    { id: 6, seller: 'Global Green Corp', location: 'Bangalore', trustScore: 99, credits: 150, energyType: 'Hydro', pricePerCredit: 125, verified: true },
  ],

  addListing: (listing) => set((state) => ({
    marketplaceListings: [
      { id: Date.now(), ...listing },
      ...state.marketplaceListings
    ]
  })),

  removeListing: (id) => set((state) => ({
    marketplaceListings: state.marketplaceListings.filter((l) => l.id !== id)
  })),

  liveFeed: [
    { id: '1', message: 'Tata Steel bought 100 credits @ ₹118', timestamp: '2s ago' },
    { id: '2', message: 'Reliance bought 250 credits @ ₹122', timestamp: '8s ago' },
    { id: '3', message: 'ITC Ltd bought 50 credits @ ₹119', timestamp: '15s ago' },
    { id: '4', message: 'NTPC bought 500 credits @ ₹120', timestamp: '30s ago' },
  ],

  addLiveFeed: (message) => set((state) => ({
    liveFeed: [{ id: Date.now().toString(), message, timestamp: '1s ago' }, ...state.liveFeed.slice(0, 15)]
  })),

  notifications: [
    {
      id: 'n-1',
      category: 'credits',
      title: 'Credit Earned',
      body: 'You earned 2 carbon credits from solar export.',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: 'n-2',
      category: 'trust',
      title: 'Trust Score Update',
      body: 'Your trust score improved from 94% to 96%!',
      timestamp: '4 hours ago',
      read: false,
    },
    {
      id: 'n-3',
      category: 'marketplace',
      title: 'Sale Successful',
      body: '3 credits sold to Tata Steel for ₹360.',
      timestamp: 'Yesterday',
      read: true,
    },
    {
      id: 'n-4',
      category: 'system',
      title: 'Smart Meter Connected',
      body: 'SM-HYD-4521 successfully verified and syncing.',
      timestamp: 'Dec 12',
      read: true,
    },
  ],

  addNotification: (category, title, body, link) => set((state) => ({
    notifications: [
      {
        id: `n-${Date.now()}`,
        category,
        title,
        body,
        timestamp: 'Just Now',
        read: false,
        link,
      },
      ...state.notifications
    ]
  })),

  markAllNotificationsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, read: true }))
  })),

  unreadCount: () => get().notifications.filter((n) => !n.read).length,

  connectedDevices: [
    { id: 'SM-HYD-4521', type: 'Smart Meter', status: 'Active', lastSync: '2 mins ago' },
    { id: 'SP-TATA-8821', type: 'Solar Panel Monitor', status: 'Active', lastSync: '5 mins ago' },
  ],

  connectDevice: (device) => {
    const newDevice: SmartMeter = {
      ...device,
      status: 'Active',
      lastSync: 'Just Now',
    };
    set((state) => ({
      connectedDevices: [...state.connectedDevices, newDevice],
    }));
    get().addNotification('system', 'New Device Paired', `${device.type} (${device.id}) connected.`);
  },

  disconnectDevice: (id) => set((state) => ({
    connectedDevices: state.connectedDevices.filter((d) => d.id !== id)
  })),

  chatMessages: [
    {
      id: 'init',
      sender: 'ai',
      text: 'Hello! I am ARIA, your ACCN AI Assistant. I can help you monitor your energy performance, optimize your carbon portfolio, understand your trust score metrics, or review trading opportunities. How can I help you today?',
      timestamp: 'Just Now'
    }
  ],

  addChatMessage: (sender, text) => set((state) => ({
    chatMessages: [...state.chatMessages, { id: Date.now().toString(), sender, text, timestamp: 'Just Now' }]
  })),

  clearChat: () => set({
    chatMessages: [{
      id: 'init',
      sender: 'ai',
      text: 'Chat cleared. How can I assist you with your carbon portfolio now?',
      timestamp: 'Just Now'
    }]
  }),

  leaderboard: [
    { rank: 1, name: 'Rahul K.', credits: 145, trustScore: 98, badges: ['🏆', '⚡', '🌱'], trend: 'up', isCurrentUser: true },
    { rank: 2, name: 'Vishwanath R.', credits: 132, trustScore: 96, badges: ['⚡', '🌱'], trend: 'up' },
    { rank: 3, name: 'Dheeraj P.', credits: 128, trustScore: 94, badges: ['🌱'], trend: 'down' },
    { rank: 4, name: 'Priya M.', credits: 115, trustScore: 93, badges: ['🌱'], trend: 'same' },
    { rank: 5, name: 'Arun S.', credits: 108, trustScore: 91, badges: ['🌱'], trend: 'up' },
    { rank: 6, name: 'Kishore J.', credits: 98, trustScore: 95, badges: ['🌱'], trend: 'down' },
  ],

  updateLeaderboard: () => {
    // Dynamically adjust user in the list based on state walletCredits
    set((state) => {
      const userCredits = state.walletCredits + 100; // adding baseline to compete with leaderboard
      const updatedList = state.leaderboard.map((item) => {
        if (item.isCurrentUser) {
          return { ...item, credits: Math.round(userCredits), trustScore: state.user.trustScore };
        }
        return item;
      });

      // Sort by credits descending
      const sorted = [...updatedList].sort((a, b) => b.credits - a.credits);
      const ranked = sorted.map((item, index) => ({ ...item, rank: index + 1 }));

      return { leaderboard: ranked };
    });
  },

  co2Saved: 95, // kg
  targetCO2: 120, // kg
}));

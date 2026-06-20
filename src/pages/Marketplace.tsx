import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  X, 
  Check, 
  ShoppingBag,
  Sparkles,
  Plus
} from 'lucide-react';
import { useStore, Listing } from '../store/useStore';
import { useToastStore } from '../store/useToastStore';
import { useTheme } from '../utils/theme';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

export const Marketplace: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { addToast } = useToastStore();
  const { 
    user,
    marketplaceListings, 
    liveFeed, 
    addLiveFeed, 
    buyCredits, 
    removeListing,
    addListing,
    walletBalance,
    walletCredits
  } = useStore();

  // Filters State
  const [minTrust, setMinTrust] = useState<number | null>(null);
  const [energyFilter, setEnergyFilter] = useState({
    Solar: true,
    Wind: true,
    Hydro: true,
    'Home Solar': true
  });
  const [maxPrice, setMaxPrice] = useState(200);

  // Buy Modal State
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  // Sell Modal State
  const [isSellOpen, setIsSellOpen] = useState(false);
  const [sellCreditsQty, setSellCreditsQty] = useState('5');
  const [sellEnergyType, setSellEnergyType] = useState<'Solar' | 'Wind' | 'Hydro' | 'Home Solar'>('Solar');
  const [sellPrice, setSellPrice] = useState('120');
  const [listingInProgress, setListingInProgress] = useState(false);

  // Insert mock ticker updates dynamically
  useEffect(() => {
    const buyers = ['Tata Steel', 'Reliance Industries', 'ITC Ltd', 'NTPC', 'Adani Green', 'Wipro ESG', 'Infosys Eco'];
    const credits = [50, 100, 150, 200, 300, 500];
    const prices = [118, 119, 120, 121, 122];

    const tickerInterval = setInterval(() => {
      const buyer = buyers[Math.floor(Math.random() * buyers.length)];
      const amount = credits[Math.floor(Math.random() * credits.length)];
      const price = prices[Math.floor(Math.random() * prices.length)];
      addLiveFeed(`🟢 ${buyer} bought ${amount} credits @ ₹${price}`);
    }, 4500);

    return () => clearInterval(tickerInterval);
  }, [addLiveFeed]);


  // Apply filters
  const filteredListings = marketplaceListings.filter((l) => {
    if (minTrust && l.trustScore < minTrust) return false;
    if (l.pricePerCredit > maxPrice) return false;
    if (!energyFilter[l.energyType as keyof typeof energyFilter]) return false;
    return true;
  });

  const handleBuyClick = (listing: Listing) => {
    const total = listing.credits * listing.pricePerCredit * 1.02; // with 2% fee
    if (total > walletBalance) {
      addToast('error', 'Insufficient Balance', 'Wallet balance is too low for this credit volume.');
      return;
    }
    setSelectedListing(listing);
    setConfirming(true);
    setPurchaseSuccess(false);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedListing) return;
    setConfirming(true);

    try {
      await buyCredits(selectedListing.credits, selectedListing.seller, selectedListing.pricePerCredit);
      await removeListing(selectedListing.id);

      setConfirming(false);
      setPurchaseSuccess(true);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      addToast('success', 'Purchase Confirmed', `Successfully acquired ${selectedListing.credits} credits.`);
    } catch (e) {
      console.error(e);
      addToast('error', 'Purchase Failed', 'Failed to process purchase transaction.');
      setConfirming(false);
    }
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseFloat(sellCreditsQty);
    const price = parseFloat(sellPrice);

    if (isNaN(qty) || qty <= 0) {
      addToast('error', 'Invalid Input', 'Please enter a valid credit quantity.');
      return;
    }
    if (qty > walletCredits) {
      addToast('error', 'Insufficient Credits', `You only have ${walletCredits} CR available to list.`);
      return;
    }
    if (isNaN(price) || price <= 0) {
      addToast('error', 'Invalid Price', 'Please enter a valid price per credit.');
      return;
    }

    setListingInProgress(true);
    try {
      await addListing({
        seller: user.name || 'Anonymous User',
        location: user.location || 'India',
        trustScore: user.trustScore || 96,
        credits: qty,
        energyType: sellEnergyType,
        pricePerCredit: price,
        verified: user.kycVerified
      });

      useStore.setState((state) => ({
        walletCredits: Number((state.walletCredits - qty).toFixed(2))
      }));

      addLiveFeed(`🌿 ${user.name} listed ${qty} ${sellEnergyType} credits @ ₹${price}`);
      addToast('success', 'Credits Listed', `Successfully listed ${qty} credits on the marketplace.`);
      setIsSellOpen(false);
    } catch (err) {
      console.error(err);
      addToast('error', 'Listing Failed', 'Failed to create marketplace listing.');
    } finally {
      setListingInProgress(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none">
      {/* Top Bar metrics */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-cardBorder pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white">Live Carbon Marketplace</h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Liquid credit exchange backed by physical smart grid energy.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <button
            onClick={() => setIsSellOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-accentGold/30 bg-accentGold/10 text-accentGold hover:bg-accentGold hover:text-bgSpace transition-all font-sans font-bold text-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            List Credits
          </button>
          <div className="h-6 w-px bg-cardBorder" />
          <div className="text-right">
            <span className="text-textSecondary block">Index Price</span>
            <span className="font-bold text-accentGreen">&uarr; ₹120.4 (+3.5%)</span>
          </div>
          <div className="h-6 w-px bg-cardBorder" />
          <div className="text-right">
            <span className="text-textSecondary block">Total Liquidity</span>
            <span className="font-bold text-white">1,240 Credits Available</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* LEFT COLUMN: Filters Panel */}
        <div className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-5 glass-panel h-max">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Search Filters
          </h3>

          {/* Price range */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-xs text-textSecondary">
              <span>Price Range</span>
              <span className="font-bold text-white">Max: ₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="80"
              max="200"
              value={maxPrice}
              onChange={(e) => setMaxPrice(parseInt(e.target.value))}
              className="accent-accentGreen w-full cursor-pointer h-1 rounded-lg bg-cardBorder"
            />
            <div className="flex justify-between text-[9px] font-mono text-textMuted">
              <span>₹80</span>
              <span>₹200</span>
            </div>
          </div>

          {/* Trust Score check */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-textSecondary">Min Trust Score</span>
            <div className="grid grid-cols-3 gap-2">
              {[90, 95, 99].map((val) => (
                <button
                  key={val}
                  onClick={() => setMinTrust(minTrust === val ? null : val)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                    minTrust === val
                      ? 'bg-accentGreen/15 text-accentGreen border border-accentGreen/30'
                      : 'border border-cardBorder text-textSecondary hover:text-textPrimary hover:bg-white/5'
                  }`}
                >
                  {val}%+
                </button>
              ))}
            </div>
          </div>

          {/* Energy type checks */}
          <div className="flex flex-col gap-2">
            <span className="text-xs text-textSecondary">Generation Type</span>
            <div className="flex flex-col gap-2.5">
              {(['Solar', 'Wind', 'Hydro', 'Home Solar'] as const).map((type) => (
                <label key={type} className="flex items-center gap-2 text-xs text-textSecondary hover:text-textPrimary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={energyFilter[type]}
                    onChange={() => setEnergyFilter({ ...energyFilter, [type]: !energyFilter[type] })}
                    className="rounded border-cardBorder text-accentGreen focus:ring-accentGreen bg-bgSpace cursor-pointer w-4 h-4"
                  />
                  {type}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              setMaxPrice(200);
              setMinTrust(null);
              setEnergyFilter({ Solar: true, Wind: true, Hydro: true, 'Home Solar': true });
            }}
            className="w-full py-2.5 rounded-xl border border-cardBorder bg-cardSurface/30 hover:bg-cardSurface/60 text-xs font-bold text-textPrimary transition-all mt-2"
          >
            Clear Filters
          </button>
        </div>

        {/* CENTER COLUMN: Credit Listings Grid */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="flex justify-between items-center text-xs font-mono text-textSecondary select-none">
            <span>Showing {filteredListings.length} active offers</span>
            <span>Sort by: Trust Score</span>
          </div>

          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {filteredListings.length > 0 ? (
                filteredListings.map((listing) => (
                  <motion.div
                    key={listing.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-panel hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-cardBorder flex items-center justify-center border border-white/5 font-bold text-sm text-textSecondary select-none">
                        {listing.seller.substring(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white leading-none">{listing.seller}</span>
                          <span className="flex items-center gap-0.5 text-[9px] font-mono font-bold text-accentGreen px-1.5 py-0.5 rounded bg-accentGreen/10 border border-accentGreen/20">
                            <Award className="w-2.5 h-2.5" />
                            {listing.trustScore}% Trust
                          </span>
                        </div>
                        <span className="text-[10px] text-textSecondary font-mono block mt-1.5 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-textMuted" />
                          {listing.location} &bull; {listing.energyType} Offset
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:border-l sm:border-cardBorder sm:pl-6">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-textMuted font-mono block">QUANTITY</span>
                        <span className="text-sm font-bold text-white font-mono">{listing.credits} CR</span>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-textMuted font-mono block">UNIT PRICE</span>
                        <span className="text-sm font-bold text-accentGreen font-mono">₹{listing.pricePerCredit}/cr</span>
                      </div>
                      <button
                        onClick={() => handleBuyClick(listing)}
                        className="px-4 py-2.5 rounded-xl bg-accentGreen text-bgSpace text-xs font-bold hover:scale-105 transition-transform shadow-neon-green"
                      >
                        Buy Now
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-16 rounded-2xl border border-cardBorder bg-cardSurface/20">
                  <ShoppingBag className="w-8 h-8 text-textMuted mx-auto mb-2 opacity-50" />
                  <p className="text-sm text-textSecondary font-semibold">No active listings match filters</p>
                  <p className="text-xs text-textMuted mt-1">Adjust sliders or checks above</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: Live trade logs + Stats */}
        <div className="flex flex-col gap-6">
          <div className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-4 glass-panel">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-accentGreen animate-pulse" />
              Live Trade Desk
            </h3>

            <div className="h-64 overflow-y-auto pr-1 flex flex-col gap-3 font-mono text-[10px]">
              {liveFeed.map((item) => (
                <div key={item.id} className="flex justify-between items-start border-b border-cardBorder/30 pb-2">
                  <span className="text-textSecondary max-w-[210px]">{item.message}</span>
                  <span className="text-textMuted select-none flex-shrink-0">{item.timestamp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Market Stats */}
          <div className="p-5 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-3 glass-panel font-mono text-xs">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-heading border-b border-cardBorder pb-2 select-none">
              Market Statistics
            </h4>
            <div className="flex justify-between py-1 border-b border-cardBorder/30">
              <span className="text-textSecondary">Volume (24h)</span>
              <span className="text-white">12,450 CR</span>
            </div>
            <div className="flex justify-between py-1 border-b border-cardBorder/30">
              <span className="text-textSecondary">Average price</span>
              <span className="text-white">₹120.40</span>
            </div>
            <div className="flex justify-between py-1 border-b border-cardBorder/30">
              <span className="text-textSecondary">Total transactions</span>
              <span className="text-white">418 trades</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-textSecondary">Premium spread</span>
              <span className="text-accentCyan">+2.4%</span>
            </div>
          </div>
        </div>

      </div>

      {/* CONFIRMATION / PURCHASE MODAL */}
      <AnimatePresence>
        {(confirming || purchaseSuccess) && selectedListing && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setSelectedListing(null); setPurchaseSuccess(false); }}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-cardBorder bg-bgMidnight p-6 relative overflow-hidden z-10 glass-panel"
            >
              {/* Decoration glows */}
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-accentGreen/10 rounded-full blur-2xl pointer-events-none" />

              {!purchaseSuccess ? (
                <>
                  <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider mb-4 border-b border-cardBorder pb-2">
                    Confirm Purchase
                  </h3>

                  <div className="flex flex-col gap-3 text-xs font-mono text-textSecondary mb-6">
                    <div className="flex justify-between"><span className="text-textMuted">Seller Name:</span> <span className="text-white font-bold">{selectedListing.seller}</span></div>
                    <div className="flex justify-between"><span className="text-textMuted">Seller Trust:</span> <span className="text-accentGreen font-bold">{selectedListing.trustScore}%</span></div>
                    <div className="flex justify-between"><span className="text-textMuted">Source Vector:</span> <span className="text-white">{selectedListing.energyType}</span></div>
                    <div className="h-px bg-cardBorder my-2" />
                    <div className="flex justify-between"><span className="text-textMuted">Credits Count:</span> <span className="text-white font-bold">{selectedListing.credits} CR</span></div>
                    <div className="flex justify-between"><span className="text-textMuted">Unit Rate:</span> <span className="text-white">₹{selectedListing.pricePerCredit}</span></div>
                    <div className="flex justify-between"><span className="text-textMuted">Platform fee (2%):</span> <span className="text-white">₹{(selectedListing.credits * selectedListing.pricePerCredit * 0.02).toFixed(1)}</span></div>
                    <div className="h-px bg-cardBorder my-2" />
                    <div className="flex justify-between text-sm"><span className="text-textPrimary font-bold">Total Cost:</span> <span className="text-accentGreen font-bold">₹{Math.round(selectedListing.credits * selectedListing.pricePerCredit * 1.02)}</span></div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedListing(null)}
                      className="flex-grow py-3.5 rounded-xl border border-cardBorder bg-cardSurface/30 text-textSecondary hover:text-textPrimary hover:bg-cardSurface/60 text-xs font-bold transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmPurchase}
                      className="flex-grow py-3.5 rounded-xl bg-accentGreen text-bgSpace text-xs font-bold hover:scale-102 transition-all shadow-neon-green"
                    >
                      Confirm & Buy &rarr;
                    </button>
                  </div>
                </>
              ) : (
                /* SUCCESS STATE */
                <div className="text-center flex flex-col items-center gap-4 py-4">
                  <div className="w-14 h-14 rounded-full bg-accentGreen/15 border border-accentGreen flex items-center justify-center text-accentGreen text-2xl animate-[bounce_1.5s_infinite]">
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-heading">Purchase Successful!</h3>
                    <p className="text-xs text-textSecondary mt-1 max-w-[240px] mx-auto">
                      {selectedListing.credits} credits have been credited to your active wallet ledger.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 w-full mt-4">
                    <button
                      onClick={() => navigate('/wallet')}
                      className="w-full py-3 rounded-xl bg-accentCyan text-bgSpace text-xs font-bold hover:scale-102 transition-transform"
                    >
                      View Wallet Balance
                    </button>
                    <button
                      onClick={() => { setSelectedListing(null); setPurchaseSuccess(false); }}
                      className="w-full py-3 rounded-xl border border-cardBorder bg-cardSurface/40 hover:bg-cardSurface/80 text-xs text-white transition-transform font-bold"
                    >
                      Continue Trading
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Sell Credits Modal */}
        {isSellOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setIsSellOpen(false)}
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-cardBorder bg-bgMidnight p-6 relative overflow-hidden z-10 glass-panel"
            >
              {/* Decoration glows */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-accentGold/10 rounded-full blur-2xl pointer-events-none" />

              <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider mb-4 border-b border-cardBorder pb-2 flex justify-between items-center">
                <span>List Carbon Credits</span>
                <button onClick={() => setIsSellOpen(false)} className="text-textMuted hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </h3>

              <form onSubmit={handleCreateListing} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-textSecondary uppercase tracking-wider">Credits Quantity (CR)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={sellCreditsQty}
                    onChange={(e) => setSellCreditsQty(e.target.value)}
                    className="px-4 py-2.5 rounded-xl glass-input text-xs"
                    required
                  />
                  <span className="text-[9px] text-textMuted font-mono">Available: {walletCredits} CR</span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-textSecondary uppercase tracking-wider">Energy Generation Source</label>
                  <select
                    value={sellEnergyType}
                    onChange={(e) => setSellEnergyType(e.target.value as any)}
                    className="px-4 py-2.5 rounded-xl bg-cardSurface/60 border border-cardBorder text-xs text-white"
                  >
                    <option value="Solar">Solar</option>
                    <option value="Wind">Wind</option>
                    <option value="Hydro">Hydro</option>
                    <option value="Home Solar">Home Solar</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-textSecondary uppercase tracking-wider">Price per Credit (₹)</label>
                  <input
                    type="number"
                    min="1"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    className="px-4 py-2.5 rounded-xl glass-input text-xs"
                    required
                  />
                  <span className="text-[9px] text-textMuted font-mono">Current Index: ₹120.4</span>
                </div>

                <div className="flex gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsSellOpen(false)}
                    className="flex-grow py-3.5 rounded-xl border border-cardBorder bg-cardSurface/30 text-textSecondary hover:text-textPrimary hover:bg-cardSurface/60 text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={listingInProgress}
                    className="flex-grow py-3.5 rounded-xl bg-accentGold text-bgSpace text-xs font-bold hover:scale-102 transition-all shadow-neon-gold"
                  >
                    {listingInProgress ? 'Listing...' : 'List Credits'}
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

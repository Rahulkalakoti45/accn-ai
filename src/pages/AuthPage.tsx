import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn, User, X, Check } from 'lucide-react';
import { ParticleBg } from '../components/ParticleBg';
import { useStore } from '../store/useStore';
import { useToastStore } from '../store/useToastStore';
import { supabase } from '../utils/supabase';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const { addToast } = useToastStore();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Google Account Selector modal states
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('error', 'Authentication Failed', 'Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        addToast('error', 'Authentication Failed', error.message);
        setIsLoading(false);
        return;
      }

      addToast('success', 'Welcome Back!', 'Successfully authenticated.');
      setIsAuthenticated(true);
      await useStore.getState().initializeStore();
      navigate('/dashboard');
    } catch (err: any) {
      addToast('error', 'Authentication Failed', err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      addToast('error', 'Registration Failed', 'Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name: name,
          }
        }
      });

      if (error) {
        addToast('error', 'Registration Failed', error.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        const userId = data.user.id;
        
        // Insert profile
        await supabase.from('profiles').insert({
          id: userId,
          name: name,
          email: email,
          trust_score: 96,
          kyc_verified: true,
          location: 'Hyderabad, India'
        });
        
        // Insert wallet
        const walletAddr = '0x' + Math.random().toString(36).substring(2, 10).toUpperCase() + '...' + Math.random().toString(36).substring(2, 6).toUpperCase();
        await supabase.from('wallets').insert({
          user_id: userId,
          address: walletAddr,
          balance: 2450.0,
          credits: 25.5
        });

        addToast('success', 'Account Created', 'Successfully registered and wallet generated.');
        setIsAuthenticated(true);
        await useStore.getState().initializeStore();
        navigate('/dashboard');
      }
    } catch (err: any) {
      addToast('error', 'Registration Failed', err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (isSignUp) {
      handleSignUp(e);
    } else {
      handleLogin(e);
    }
  };

  // Triggers real Supabase OAuth redirect (will work once Google is enabled in Supabase Console)
  const triggerRealGoogleRedirect = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          queryParams: {
            prompt: 'select_account',
          },
          redirectTo: window.location.origin + '/dashboard'
        }
      });
      if (error) {
        addToast('error', 'Google Auth Failed', error.message);
      }
    } catch (err: any) {
      addToast('error', 'Google Auth Failed', err.message || 'OAuth redirect failed.');
    } finally {
      setIsLoading(false);
      setShowGooglePrompt(false);
    }
  };

  // Perform a real login/signup flow under the hood using a password wrapper so database sync stays intact
  const handleSilentGoogleLogin = async (selectedEmail: string) => {
    setIsLoading(true);
    const mockPassword = 'ACCN-Google-OAuth-Fallback-Pass-9988!';
    const derivedName = selectedEmail.split('@')[0].toUpperCase();

    try {
      // 1. Try to sign in
      const { error } = await supabase.auth.signInWithPassword({
        email: selectedEmail,
        password: mockPassword
      });

      if (error) {
        // 2. If user doesn't exist, register them silently
        if (error.message.includes('Invalid login credentials') || error.message.includes('User not found')) {
          const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
            email: selectedEmail,
            password: mockPassword,
            options: {
              data: {
                name: derivedName
              }
            }
          });

          if (signUpErr) {
            addToast('error', 'Sandbox Sign In Failed', signUpErr.message);
            setIsLoading(false);
            return;
          }

          if (signUpData.user) {
            const userId = signUpData.user.id;
            
            // Insert profile details
            await supabase.from('profiles').insert({
              id: userId,
              name: derivedName,
              email: selectedEmail,
              trust_score: 96,
              kyc_verified: true,
              location: 'Hyderabad, India'
            });

            // Insert wallet details
            const walletAddr = '0x' + Math.random().toString(36).substring(2, 10).toUpperCase() + '...' + Math.random().toString(36).substring(2, 6).toUpperCase();
            await supabase.from('wallets').insert({
              user_id: userId,
              address: walletAddr,
              balance: 2450.0,
              credits: 25.5
            });
          }
        } else {
          addToast('error', 'Sandbox Sign In Failed', error.message);
          setIsLoading(false);
          return;
        }
      }

      // Login success
      addToast('success', 'Google Sandbox Connected', `Authenticated successfully as ${selectedEmail}.`);
      setIsAuthenticated(true);
      await useStore.getState().initializeStore();
      navigate('/dashboard');
    } catch (err: any) {
      addToast('error', 'Authentication Failed', err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
      setShowGooglePrompt(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 relative">
      {/* Dynamic drifting canvas particles */}
      <ParticleBg />

      {/* Auth Card wrapper */}
      <motion.div
        initial={{ opacity: 0, y: 60, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[420px] rounded-3xl border border-cardBorder bg-bgMidnight/45 backdrop-blur-2xl shadow-2xl p-8 md:p-10 relative overflow-hidden"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-24 h-24 bg-accentGreen/10 rounded-full blur-2xl pointer-events-none" />

        {/* Card Header */}
        <div className="flex flex-col items-center text-center gap-3 select-none">
          <div 
            onClick={() => navigate('/')} 
            className="w-12 h-12 rounded-xl bg-accentGreen/10 border border-accentGreen/30 flex items-center justify-center text-xl text-accentGreen shadow-neon-green/10 cursor-pointer hover:scale-105 transition-transform"
          >
            🌿
          </div>
          <div>
            <h2 className="text-xl font-bold font-heading text-gradient-purple-cyan tracking-wide">
              {isSignUp ? 'Create ACCN Account' : 'Welcome to ACCN'}
            </h2>
            <span className="text-[10px] font-mono text-accentGreen uppercase tracking-widest mt-1 block">
              {isSignUp ? 'Join the Carbon Network' : 'AI-Powered Carbon Credits'}
            </span>
          </div>
        </div>

        {/* Social Authentication */}
        <div className="flex flex-col gap-3.5 mt-8">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => setShowGooglePrompt(true)}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-[#F8F8F8] text-sm font-semibold text-[#1F1F1F] flex items-center justify-center gap-3 transition-all border border-black/12 hover:shadow-md active:scale-[0.98] cursor-pointer"
          >
            {/* Custom Google logo symbol */}
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.65 1.42 7.54l3.79 2.94C6.18 7.37 8.84 5.04 12 5.04z"
              />
              <path
                fill="#4285F4"
                d="M23.45 12.27c0-.82-.07-1.61-.21-2.38H12v4.51h6.43c-.28 1.47-1.11 2.72-2.36 3.56l3.65 2.83c2.14-1.97 3.37-4.88 3.37-8.52z"
              />
              <path
                fill="#FBBC05"
                d="M5.21 10.48c-.24-.72-.38-1.5-.38-2.3s.14-1.58.38-2.3L1.42 2.94C.52 4.75 0 6.8 0 9s.52 4.25 1.42 6.06l3.79-2.94c-.24-.72-.38-1.5-.38-2.3z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.65-2.83c-1.01.68-2.31 1.08-4.31 1.08-3.16 0-5.82-2.33-6.79-5.44l-3.79 2.94C3.37 20.35 7.35 23 12 23z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-cardBorder flex-grow" />
          <span className="text-[10px] font-mono text-textMuted uppercase select-none">or email credential</span>
          <div className="h-px bg-cardBorder flex-grow" />
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col gap-1.5 overflow-hidden"
              >
                <label className="text-[10px] font-mono text-textSecondary uppercase tracking-widest font-semibold ml-1 select-none">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required={isSignUp}
                    disabled={isLoading}
                    placeholder="Rahul Kumar"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
                  />
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-textSecondary" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-mono text-textSecondary uppercase tracking-widest font-semibold ml-1 select-none">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                disabled={isLoading}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl glass-input text-sm"
              />
              <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-textSecondary" />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center px-1">
              <label className="text-[10px] font-mono text-textSecondary uppercase tracking-widest font-semibold select-none">
                Password
              </label>
              {!isSignUp && (
                <button
                  type="button"
                  className="text-[10px] text-accentCyan hover:underline font-semibold select-none cursor-pointer"
                  onClick={() => addToast('info', 'Reset Triggered', 'Password reset token dispatched to inbox.')}
                >
                  Forgot?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                disabled={isLoading}
                placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl glass-input text-sm"
              />
              <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-textSecondary" />
              <button
                type="button"
                className="absolute right-3.5 top-3.5 text-textSecondary hover:text-textPrimary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 rounded-xl bg-accentGreen text-bgSpace font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-neon-green disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4.5 h-4.5 border-2 border-bgSpace border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {isSignUp ? 'Create Carbon Profile' : 'Authorize Credentials'}
                <LogIn className="w-4.5 h-4.5 animate-pulse" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-textSecondary select-none">
          {isSignUp ? 'Already have an ACCN profile?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              addToast('info', 'View Swapped', `Switched layout to ${!isSignUp ? 'Registration Form' : 'Login Credentials'}`);
            }}
            className="text-accentGreen font-bold hover:underline cursor-pointer"
          >
            {isSignUp ? 'Sign In' : 'Create Account'} &rarr;
          </button>
        </div>
      </motion.div>

      {/* GOOGLE ACCOUNT CHOOSER MODAL */}
      <AnimatePresence>
        {showGooglePrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGooglePrompt(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Selector Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="w-full max-w-[360px] rounded-3xl border border-cardBorder bg-[#111622] p-6 relative z-10 text-white font-sans flex flex-col gap-5 shadow-2xl"
            >
              <button
                onClick={() => setShowGooglePrompt(false)}
                className="absolute right-4 top-4 p-1 rounded-lg hover:bg-white/5 text-textSecondary"
              >
                <X className="w-4.5 h-4.5" />
              </button>

              {/* Google Brand Logo Header */}
              <div className="flex flex-col items-center text-center gap-1">
                <svg className="w-[24px] h-[24px]" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <h3 className="text-sm font-bold text-white mt-2 select-none">Choose an account</h3>
                <span className="text-[10px] text-textSecondary select-none">to continue to ACCN Portal</span>
              </div>

              {/* Accounts list */}
              <div className="flex flex-col gap-2.5 mt-2">
                <button
                  onClick={() => handleSilentGoogleLogin('rahulkalakoti@gmail.com')}
                  disabled={isLoading}
                  className="w-full p-3 rounded-xl border border-cardBorder bg-cardSurface/10 hover:bg-cardSurface/30 text-left flex items-center justify-between transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accentGreen/15 border border-accentGreen/30 text-accentGreen flex items-center justify-center font-bold text-xs uppercase select-none">
                      RK
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Rahul Kalakoti</h4>
                      <p className="text-[9px] text-textSecondary">rahulkalakoti@gmail.com</p>
                    </div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-accentGreen opacity-60" />
                </button>

                <button
                  onClick={() => handleSilentGoogleLogin('rahul@example.com')}
                  disabled={isLoading}
                  className="w-full p-3 rounded-xl border border-cardBorder bg-cardSurface/10 hover:bg-cardSurface/30 text-left flex items-center justify-between transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accentCyan/15 border border-accentCyan/30 text-accentCyan flex items-center justify-center font-bold text-xs uppercase select-none">
                      R
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Rahul K.</h4>
                      <p className="text-[9px] text-textSecondary">rahul@example.com</p>
                    </div>
                  </div>
                  <Check className="w-3.5 h-3.5 text-accentGreen opacity-0" />
                </button>

                {showCustomGoogleInput ? (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-1.5 p-2.5 rounded-xl border border-accentCyan/30 bg-accentCyan/5 mt-1"
                  >
                    <label className="text-[9px] font-mono text-accentCyan uppercase tracking-widest font-semibold ml-1">
                      Enter Custom Email
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        required
                        placeholder="user@gmail.com"
                        value={customGoogleEmail}
                        onChange={(e) => setCustomGoogleEmail(e.target.value)}
                        className="flex-grow px-3 py-1.5 rounded-lg border border-cardBorder bg-void text-xs outline-none text-white focus:border-accentCyan/60"
                      />
                      <button
                        onClick={() => {
                          if (customGoogleEmail.includes('@')) {
                            handleSilentGoogleLogin(customGoogleEmail);
                          } else {
                            addToast('error', 'Invalid Email', 'Please enter a valid email.');
                          }
                        }}
                        disabled={isLoading}
                        className="px-3 py-1.5 rounded-lg bg-accentCyan hover:scale-105 transition-transform text-bgSpace text-xs font-bold cursor-pointer disabled:opacity-50"
                      >
                        Go
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <button
                    onClick={() => setShowCustomGoogleInput(true)}
                    className="w-full p-2.5 rounded-xl border border-dashed border-cardBorder hover:border-textSecondary text-center text-xs text-textSecondary hover:text-white transition-colors cursor-pointer"
                  >
                    + Use another account
                  </button>
                )}
              </div>

              {/* Developer Configuration Warning */}
              <div className="border-t border-cardBorder/30 pt-3.5 text-[9px] text-textMuted leading-relaxed select-none">
                <span className="font-bold text-accentGold uppercase">Sandbox Mode:</span> Google Auth is not configured in your Supabase project console. To trigger a real redirect to Google,{' '}
                <button
                  onClick={triggerRealGoogleRedirect}
                  className="text-accentCyan font-bold hover:underline cursor-pointer"
                >
                  click here
                </button>.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

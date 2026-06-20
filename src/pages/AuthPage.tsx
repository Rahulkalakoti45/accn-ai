import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { ParticleBg } from '../components/ParticleBg';
import { useStore } from '../store/useStore';
import { useToastStore } from '../store/useToastStore';
import { supabase } from '../utils/supabase';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const { addToast } = useToastStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      addToast('error', 'Authentication Failed', 'Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Try to log in
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        // If login fails because user doesn't exist, auto-register them
        if (error.message.includes('Invalid login credentials')) {
          addToast('info', 'Registering Account', 'Account not found. Creating a new profile...');
          
          const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({ 
            email, 
            password,
            options: {
              data: {
                name: email.split('@')[0],
              }
            }
          });

          if (signUpErr) {
            addToast('error', 'Registration Failed', signUpErr.message);
            setIsLoading(false);
            return;
          }

          // Populate tables
          if (signUpData.user) {
            const userId = signUpData.user.id;
            
            // Insert profile
            await supabase.from('profiles').insert({
              id: userId,
              name: email.split('@')[0],
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

            addToast('success', 'Onboarding Complete', 'Created account and generated new carbon wallet.');
            setIsAuthenticated(true);
            await useStore.getState().initializeStore();
            navigate('/dashboard');
            setIsLoading(false);
            return;
          }
        }

        addToast('error', 'Authentication Failed', error.message);
        setIsLoading(false);
        return;
      }

      // Successful login
      addToast('success', 'Welcome Back!', 'Successfully authenticated via Supabase.');
      setIsAuthenticated(true);
      await useStore.getState().initializeStore();
      navigate('/dashboard');
    } catch (err: any) {
      addToast('error', 'Authentication Failed', err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsAuthenticated(true);
      addToast('success', 'Logged in via OAuth', `Connected successfully using ${provider}.`);
      navigate('/dashboard');
    }, 1000);
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
            <h2 className="text-xl font-bold font-heading text-white">Welcome to ACCN</h2>
            <span className="text-[11px] font-mono text-accentGreen uppercase tracking-widest mt-1 block">
              AI-Powered Carbon Credits
            </span>
          </div>
        </div>

        {/* Social Authentication */}
        <div className="flex flex-col gap-3.5 mt-8">
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleSocialLogin('Google')}
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

        {/* Email Credentials Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
              <button
                type="button"
                className="text-[10px] text-accentCyan hover:underline font-semibold select-none"
                onClick={() => addToast('info', 'Reset Triggered', 'Password reset token dispatched to inbox.')}
              >
                Forgot?
              </button>
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
            className="w-full mt-2 py-3.5 rounded-xl bg-accentGreen text-bgSpace font-bold text-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-neon-green disabled:opacity-50 disabled:pointer-events-none"
          >
            {isLoading ? (
              <>
                <div className="w-4.5 h-4.5 border-2 border-bgSpace border-t-transparent rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Authorize Credentials
                <LogIn className="w-4.5 h-4.5" />
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-textSecondary select-none">
          Don't have an account?{' '}
          <button
            onClick={() => addToast('info', 'Registration', 'Sign up is temporarily invite-only.')}
            className="text-accentGreen font-bold hover:underline"
          >
            Request Access &rarr;
          </button>
        </div>
      </motion.div>
    </div>
  );
};

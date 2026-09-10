import React, { useState } from 'react';
import { motion } from 'motion/react';
import { KeyRound, User, Store, ShieldAlert, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { login } from '../api';

interface LoginProps {
  onLoginSuccess: (username: string) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all credentials.');
      return;
    }

    setIsSubmitting(true);

    // Verify credentials against the backend (/api/login) so the password is
    // never stored or checked in the browser.
    login(username, password)
      .then((user) => {
        if (user) {
          onLoginSuccess(user);
        } else {
          setError('Invalid username or password. Please try again.');
          setIsSubmitting(false);
        }
      })
      .catch(() => {
        setError('Could not reach the server. Please try again.');
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Decorative ambient background elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-600/10 blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-md bg-slate-900/80 backdrop-blur-md border border-slate-800/80 p-8 rounded-3xl shadow-2xl relative z-10"
      >
        {/* Brand / Logo */}
        <div className="text-center space-y-3 mb-8">
          <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Store className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black uppercase tracking-wider text-slate-100 flex items-center justify-center gap-1.5">
              <span>Vibrant Food</span>
            </h1>
            <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mt-1">POS & Kitchen Management Gate</p>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Error Message */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-3.5 bg-rose-500/10 border border-rose-500/25 rounded-2xl flex items-start gap-2.5 text-rose-400 text-xs font-semibold"
            >
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Username Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <User className="h-3 w-3 text-indigo-400" />
              <span>Username</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                autoComplete="username"
                className="w-full px-4 py-3 bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-2xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider flex items-center gap-1">
              <KeyRound className="h-3 w-3 text-indigo-400" />
              <span>Password</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                autoComplete="current-password"
                className="w-full pl-4 pr-12 py-3 bg-slate-950/60 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-2xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none transition-all font-medium font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Information Notice */}
          <div className="p-3 bg-slate-950/40 border border-slate-900 rounded-2xl text-[10px] text-slate-500 flex items-start gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-500/70 mt-0.5 shrink-0" />
            <span>Authorized staff members only. Contact your administrator if you do not have credential permissions.</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 rounded-2xl font-black text-xs tracking-wider uppercase transition-all duration-150 flex items-center justify-center gap-2 ${
              isSubmitting 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white cursor-pointer shadow-lg shadow-indigo-600/15'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 border-2 border-slate-600 border-t-indigo-500 rounded-full animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>Sign In to POS</span>
            )}
          </button>

        </form>
      </motion.div>
    </div>
  );
}

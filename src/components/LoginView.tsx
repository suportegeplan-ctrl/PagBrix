/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Sparkles, ArrowLeft, Lock, Mail, Users, KeyRound, AlertCircle } from 'lucide-react';
import AuroraBg from './AuroraBg';

interface LoginViewProps {
  onNavigate: (view: 'home' | 'admin') => void;
  onLoginSuccess: () => void;
}

export default function LoginView({ onNavigate, onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailInputRef = useRef<HTMLInputElement>(null);
  const senhaInputRef = useRef<HTMLInputElement>(null);
  const enterBtnRef = useRef<HTMLButtonElement>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim() || !senha.trim()) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication processing
    setTimeout(() => {
      setIsLoading(false);
      if (email.trim().toLowerCase() === 'admin@pagbrix.com' && senha === '123456') {
        localStorage.setItem('pagbrix_admin_logged', 'true');
        onLoginSuccess();
      } else {
        setErrorMessage('Credenciais incorretas. Tente novamente ou use o Acesso Rápido abaixo.');
      }
    }, 1000);
  };

  // Quick Access Auto filler trigger
  const handlePromoFiller = () => {
    setEmail('admin@pagbrix.com');
    setSenha('123456');
    setErrorMessage('');
    
    // Focus the login button to provide seamless usability feedback
    setTimeout(() => {
      if (enterBtnRef.current) {
        enterBtnRef.current.focus();
        // Add a temporary subtle flash highlight
        enterBtnRef.current.classList.add('scale-102');
        setTimeout(() => {
          enterBtnRef.current?.classList.remove('scale-102');
        }, 300);
      }
    }, 100);
  };

  return (
    <div id="login-page" className="aurora-container relative min-h-screen text-[#664C43] font-sans flex items-center justify-center p-4">
      <AuroraBg />

      {/* Main Login Card */}
      <div className="w-full max-w-md z-10 relative flex flex-col gap-6">
        
        {/* Back Link */}
        <button
          onClick={() => onNavigate('home')}
          className="self-start inline-flex items-center gap-1.5 text-xs font-bold text-[#873D48] hover:text-[#DC758F] transition-colors cursor-pointer ml-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Landing Page
        </button>

        {/* Central Glassmorphism card */}
        <div className="glass-card p-8 rounded-[32px] border border-white/50 shadow-2xl relative">
          
          {/* Brand header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#DC758F] to-[#873D48] flex items-center justify-center border border-white/30 shadow-lg shadow-[#DC758F]/10">
              <Sparkles className="w-6 h-6 text-[#00FFCD]" />
            </div>
            
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#873D48] mt-3">
              Pag<span className="text-[#DC758F]">Brix</span>
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-[#664C43]/70 font-bold mt-0.5">
              Acesso Administrativo
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Error messaging bar */}
            {errorMessage && (
              <div id="login-error" className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold animate-pulse">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Email field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#873D48] ml-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                E-mail Administrativo
              </label>
              <input
                ref={emailInputRef}
                type="email"
                placeholder="Ex: admin@pagbrix.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="brand-input w-full"
              />
            </div>

            {/* Password field */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-[#873D48] ml-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5" />
                Senha de Acesso
              </label>
              <input
                ref={senhaInputRef}
                type="password"
                placeholder="Prontuário de 6 dígitos"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="brand-input w-full"
              />
            </div>

            {/* Login enter button */}
            <button
              ref={enterBtnRef}
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-[#DC758F] to-[#873D48] text-white font-extrabold shadow-lg shadow-[#DC758F]/15 hover:scale-[1.01] active:scale-99 transition-all cursor-pointer flex items-center justify-center gap-2 uppercase tracking-wider text-xs"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-[#00FFCD]" />
                  <span>Entrar no Sistema</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Shortcuts card: MANDATORY */}
        <div 
          id="quick-access-card"
          className="p-5 bg-white/40 backdrop-blur-md rounded-2xl border border-[#00FFCD]/40 shadow-sm text-center flex flex-col items-center"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-[#873D48]/75 mb-3">
            Acesso Rápido (Demonstração)
          </span>

          <div
            onClick={handlePromoFiller}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/70 border border-[#00FFCD] hover:border-[#DC758F] hover:shadow-[0_0_12px_rgba(0,255,205,0.4)] transition-all duration-300 cursor-pointer text-left select-none group"
            id="quick-access-pill"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#00FFCD]/15 border border-[#00FFCD]/30 flex items-center justify-center text-[#873D48] relative">
                <Users className="w-4 h-4 text-[#873D48]" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white" />
              </div>
              <div>
                <p className="text-xs font-black text-[#873D48] leading-none">Administrador</p>
                <p className="text-[10px] text-[#664C43]/70 font-semibold mt-0.5">admin@pagbrix.com</p>
              </div>
            </div>
            <span className="text-[10px] px-2.5 py-1 font-bold text-emerald-700 bg-emerald-50 rounded-lg group-hover:bg-[#DC758F] group-hover:text-white transition-colors">
              Preencher
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { HOW_IT_WORKS, TESTIMONIALS } from '../data';
import { Flame, Star, Sparkles, ArrowRight, Shield, Award, Users } from 'lucide-react';
import AuroraBg from './AuroraBg';

interface LandingViewProps {
  onNavigate: (view: 'checkout' | 'login' | 'admin') => void;
  isAdminLoggedIn: boolean;
}

export default function LandingView({ onNavigate, isAdminLoggedIn }: LandingViewProps) {
  return (
    <div id="landing-page" className="aurora-container relative min-h-screen text-[#664C43] font-sans pb-16 flex flex-col justify-between">
      <AuroraBg />

      {/* Header */}
      <header className="glass-navbar sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between">
        <div 
          onClick={() => window.location.hash = ''} 
          className="flex items-center gap-3 cursor-pointer select-none"
          id="logo-container"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DC758F] to-[#873D48] flex items-center justify-center shadow-lg shadow-[#DC758F]/20 border border-white/30">
            <Sparkles className="w-5 h-5 text-[#00FFCD]" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-extrabold tracking-tight text-[#873D48]">
              Pag<span className="text-[#DC758F]">Brix</span>
            </h1>
            <p className="text-[9px] uppercase tracking-widest text-[#664C43]/70 font-bold">
              minhafigurinha.com
            </p>
          </div>
        </div>

        <button 
          id="btn-admin-nav"
          onClick={() => onNavigate(isAdminLoggedIn ? 'admin' : 'login')}
          className="px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 glass-card border-brand-wine/10 hover:border-[#00FFCD] hover:text-[#873D48] hover:shadow-[0_0_15px_rgba(0,255,205,0.3)] bg-white/40 cursor-pointer"
        >
          {isAdminLoggedIn ? 'Painel Admin' : 'Acesso Admin'}
        </button>
      </header>

      {/* Hero Section */}
      <main className="flex-grow z-10 px-6 max-w-7xl mx-auto w-full pt-12 md:pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[#873D48]/10 text-[#873D48] border border-[#873D48]/20 shadow-sm animate-pulse">
              <Star className="w-3.5 h-3.5 fill-current text-[#DC758F]" />
              Edição Oficial Copa 2026
            </div>

            <h2 className="font-display text-4.5xl sm:text-6xl font-extrabold tracking-tight text-[#664C43] leading-[1.1]">
              Sua figurinha, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DC758F] via-[#873D48] to-[#DC758F]">
                do seu jeito.
              </span>
            </h2>

            <p className="text-base sm:text-lg text-[#664C43]/85 max-w-xl font-medium leading-relaxed">
              Transforme suas fotos favoritas em figurinhas digitais premium e brilhantes de colecionador. Ideal para dar de presente, imprimir, colecionar com amigos ou usar no seu álbum digital!
            </p>

            {/* Glowing CTA Button */}
            <div className="mt-2 w-full sm:w-auto">
              <button
                id="btn-buy-cta"
                onClick={() => onNavigate('checkout')}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#DC758F] to-[#873D48] text-white font-extrabold rounded-2xl shadow-[0_0_20px_rgba(220,117,143,0.5)] transition-all duration-300 hover:scale-103 active:scale-98 animate-pulse-glow flex items-center justify-center gap-3 text-base tracking-wider uppercase cursor-pointer"
              >
                Quero minha figurinha por R$ 5,00
                <ArrowRight className="w-5 h-5 text-[#00FFCD]" />
              </button>
              <div className="flex items-center gap-5 mt-4 ml-1 text-xs font-bold text-[#664C43]/70">
                <span className="flex items-center gap-1">✔ Entrega imediata</span>
                <span className="flex items-center gap-1">✔ PIX ou Cartão</span>
                <span className="flex items-center gap-1">✔ 100% Segurado</span>
              </div>
            </div>
          </div>

          {/* Right Sticker Mockup Column */}
          <div className="lg:col-span-5 flex justify-center items-center relative py-6">
            {/* Background elements to enhance mockup */}
            <div className="absolute w-72 h-72 rounded-full bg-[#00FFCD]/20 blur-[60px] -z-10 animate-pulse" />
            
            {/* Holographic Trading Card Mockup */}
            <div 
              id="sticker-mockup"
              className="w-72 sm:w-80 h-[430px] rounded-[32px] p-4 bg-gradient-to-b from-white/65 to-white/35 backdrop-blur-xl border-2 border-[#DC758F]/50 shadow-2xl shadow-brand-wine/10 relative overflow-hidden transition-transform duration-500 hover:rotate-2 group"
            >
              {/* Card Brilliant Edge Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#00FFCD]/10 to-transparent pointer-events-none group-hover:translate-x-full transition-transform duration-1000" />
              
              <div className="h-full rounded-[24px] border border-white/60 p-3.5 flex flex-col justify-between bg-gradient-to-br from-[#E3D3E4]/30 to-[#DC758F]/10">
                {/* Card Top */}
                <div className="flex justify-between items-center bg-[#873D48]/15 px-3 py-1.5 rounded-full border border-white/40">
                  <span className="font-display text-xs font-black text-[#873D48] flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-[#DC758F]" /> LEGEND
                  </span>
                  <span className="text-[10px] font-black tracking-widest text-[#873D48]">
                    #001
                  </span>
                </div>

                {/* Card Main Image (Avatar Simulation) */}
                <div className="my-3 flex-grow rounded-2xl border-2 border-dashed border-[#DC758F]/40 bg-gradient-to-b from-[#664C43]/5 to-[#873D48]/10 flex flex-col items-center justify-center text-center p-4 relative overflow-hidden">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#DC758F] to-[#00FFCD] p-0.5 shadow-lg shadow-[#DC758F]/20 relative z-10 flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full rounded-full bg-white flex items-center justify-center font-display text-2xl font-black text-[#873D48]">
                      VOCÊ
                    </div>
                  </div>
                  <div className="mt-3 relative z-10">
                    <p className="font-display text-base font-extrabold tracking-tight text-[#873D48] uppercase">
                      Seu Nome Aqui
                    </p>
                    <p className="text-[10px] font-bold text-[#664C43]/70">
                      Super Craque
                    </p>
                  </div>
                  <Sparkles className="absolute top-2 right-2 w-4 h-4 text-[#00FFCD] opacity-40 animate-spin" style={{ animationDuration: '8s' }} />
                  <Flame className="absolute bottom-2 left-2 w-4 h-4 text-[#DC758F] opacity-40" />
                </div>

                {/* Card Stats */}
                <div className="grid grid-cols-3 gap-1 grid-flow-row text-center mt-1">
                  <div className="bg-white/70 backdrop-blur-md p-1.5 rounded-xl border border-white/60">
                    <p className="text-[9px] font-bold text-[#664C43]/60 uppercase">Chute</p>
                    <p className="font-display text-sm font-black text-[#873D48]">99</p>
                  </div>
                  <div className="bg-white/70 backdrop-blur-md p-1.5 rounded-xl border border-white/60">
                    <p className="text-[9px] font-bold text-[#664C43]/60 uppercase">Passe</p>
                    <p className="font-display text-sm font-black text-[#873D48]">95</p>
                  </div>
                  <div className="bg-white/70 backdrop-blur-md p-1.5 rounded-xl border border-white/60">
                    <p className="text-[9px] font-bold text-[#664C43]/60 uppercase">Ritmo</p>
                    <p className="font-display text-sm font-black text-[#873D48]">98</p>
                  </div>
                </div>

                {/* Card Price Badge */}
                <div className="mt-3 bg-gradient-to-r from-[#DC758F] to-[#873D48] text-center py-2.5 rounded-xl text-white font-extrabold text-sm border border-white/20 shadow-md flex items-center justify-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#00FFCD]" />
                  Apenas R$ 5,00
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* How It Works Section */}
        <section id="how-it-works" className="mt-28 sm:mt-36 text-center">
          <div className="mb-12">
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#873D48]">
              Como funciona o seu pedido?
            </h3>
            <p className="text-sm text-[#664C43]/80 mt-2 font-medium max-w-lg mx-auto">
              Em menos de 5 minutos você realiza o pagamento seguro com PagBrix e tem sua figurinha digital pronta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_IT_WORKS.map((item) => (
              <div 
                key={item.id} 
                className="glass-card hover:bg-white/60 transition-all duration-300 p-8 rounded-[28px] border border-white/40 group flex flex-col items-center text-center shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#DC758F]/15 flex items-center justify-center text-[#DC758F] font-bold font-display text-lg mb-4 border border-[#DC758F]/20 group-hover:bg-[#00FFCD]/20 group-hover:border-[#00FFCD]/40 transition-colors">
                  {item.step}
                </div>
                <h4 className="font-display text-lg font-bold text-[#873D48] mb-2">{item.title}</h4>
                <p className="text-xs text-[#664C43]/75 leading-relaxed font-semibold">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="mt-28 sm:mt-36">
          <div className="text-center mb-12">
            <h3 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#873D48]">
              Quem já comprou, amou!
            </h3>
            <p className="text-sm text-[#664C43]/80 mt-2 font-medium">
              Veja depoimentos de outros colecionadores do minhafigurinha.com.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div 
                key={t.id} 
                className="glass-card p-6.5 rounded-3xl border border-white/40 flex flex-col justify-between shadow-md relative"
              >
                {/* Quote Icon Background */}
                <span className="absolute top-4 right-4 font-serif text-5xl font-black text-[#DC758F]/10 pointer-events-none">“</span>
                
                <p className="text-xs text-[#664C43]/80 leading-relaxed italic z-10 pr-2">
                  "{t.comment}"
                </p>

                <div className="mt-6 flex items-center gap-3.5 pt-4 border-t border-brand-wine/10 z-10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#DC758F]/20 to-[#00FFCD]/50 border border-white flex items-center justify-center font-display text-xs font-extrabold text-[#873D48] shadow-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[#873D48]">{t.name}</h5>
                    <p className="text-[10px] text-[#664C43]/60 font-medium">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="z-10 mt-24 text-center border-t border-brand-wine/10 pt-8 px-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#DC758F] to-[#873D48] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-[#00FFCD]" />
            </div>
            <span className="font-display text-sm font-extrabold text-[#873D48]">
              PagBrix
            </span>
          </div>
          <p className="text-[11px] text-[#664C43]/65 font-semibold">
            &copy; 2026 PagBrix Ltda. Todos os direitos reservados. Parceiro Integrado oficial minhafigurinha.com.
          </p>
          <div className="flex gap-5 text-xs font-bold text-[#664C43]/60">
            <a href="#" className="hover:text-[#DC758F] transition-colors">Termos</a>
            <a href="#" className="hover:text-[#DC758F] transition-colors">Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

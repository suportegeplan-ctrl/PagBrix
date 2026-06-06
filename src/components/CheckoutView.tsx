/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowLeft, CreditCard, QrCode, ClipboardCheck, Clipboard, ShieldCheck, CheckCircle2, Ticket, Activity } from 'lucide-react';
import AuroraBg from './AuroraBg';
import { Transaction } from '../types';

interface CheckoutViewProps {
  onNavigate: (view: 'home' | 'login' | 'admin') => void;
  isAdminLoggedIn: boolean;
  onPaymentSuccess: (newTx: Transaction) => void;
}

export default function CheckoutView({ onNavigate, isAdminLoggedIn, onPaymentSuccess }: CheckoutViewProps) {
  // Form State
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [activeTab, setActiveTab] = useState<'credito' | 'debito' | 'pix'>('credito');

  // Credit/Debit Cards details
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVV, setCardCVV] = useState('');

  // UI state
  const [copiedPix, setCopiedPix] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newTransactionID, setNewTransactionID] = useState('');
  const [countdown, setCountdown] = useState(3);

  // Masks
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const digits = rawValue.replace(/\D/g, '').slice(0, 11);
    if (digits.length === 0) {
      setTelefone('');
      return;
    }
    let formatted = '';
    if (digits.length <= 2) {
      formatted = `(${digits}`;
    } else if (digits.length <= 7) {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else {
      formatted = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    }
    setTelefone(formatted);
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 16);
    const groups = digits.match(/.{1,4}/g);
    setCardNumber(groups ? groups.join(' ') : digits);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (digits.length <= 2) {
      setCardExpiry(digits);
    } else {
      setCardExpiry(`${digits.slice(0, 2)}/${digits.slice(2)}`);
    }
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardCVV(e.target.value.replace(/\D/g, '').slice(0, 4));
  };

  // Copy PIX Action
  const pixKey = "00020126580014br.gov.bcb.pix0136pix.pagbrix.com/minhafigurinha/5reais52040000530398654045.005802BR5910PagBrixLTD6009SAOPAULO62140510Figurinha5";
  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2500);
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!nome.trim()) {
      errors.nome = "Nome completo é obrigatório.";
    } else if (nome.trim().split(' ').length < 2) {
      errors.nome = "Por favor, digite seu nome completo (Nome e Sobrenome).";
    }

    if (!telefone.trim()) {
      errors.telefone = "Telefone é obrigatório.";
    } else if (telefone.replace(/\D/g, '').length < 10) {
      errors.telefone = "Digite um telefone com DDD válido.";
    }

    if (activeTab === 'credito' || activeTab === 'debito') {
      if (!cardNumber.trim() || cardNumber.replace(/\D/g, '').length < 16) {
        errors.cardNumber = "Número de cartão inválido (16 dígitos).";
      }
      if (!cardName.trim()) {
        errors.cardName = "Nome impresso é obrigatório.";
      }
      if (!cardExpiry.trim() || cardExpiry.length < 5) {
        errors.cardExpiry = "Validade (MM/AA) incorreta.";
      } else {
        const [month, year] = cardExpiry.split('/').map(Number);
        if (month < 1 || month > 12) {
          errors.cardExpiry = "Mês inválido.";
        }
      }
      if (!cardCVV.trim() || cardCVV.length < 3) {
        errors.cardCVV = "CVV inválido (mínimo 3 dígitos).";
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      // Scroll to error
      const firstError = Object.keys(errors)[0];
      const element = document.getElementById(`field-${firstError}`);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setFormErrors({});
    setIsProcessing(true);

    // Simulate standard credit network authentication (1.8 seconds processing time)
    setTimeout(() => {
      setIsProcessing(false);
      const generatedID = `TX-${Math.random().toString(36).substring(3, 9).toUpperCase()}`;
      setNewTransactionID(generatedID);

      const newTx: Transaction = {
        id: generatedID,
        nome: nome.trim(),
        telefone: telefone,
        metodo_pagamento: activeTab === 'credito' ? 'Cartão de Crédito' : activeTab === 'debito' ? 'Cartão de Débito' : 'PIX',
        data_hora: new Date().toISOString(),
        valor: 5.00,
        status: 'aprovado',
        cartao_nome: activeTab !== 'pix' ? cardName : undefined
      };

      onPaymentSuccess(newTx);
      setShowSuccessModal(true);
    }, 1800);
  };

  // Auto focus first card input of tab change
  useEffect(() => {
    setFormErrors({});
  }, [activeTab]);

  // Modal redirect Timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccessModal) {
      if (countdown > 0) {
        timer = setTimeout(() => {
          setCountdown(prev => prev - 1);
        }, 1000);
      } else {
        onNavigate('home');
      }
    }
    return () => clearTimeout(timer);
  }, [showSuccessModal, countdown]);

  return (
    <div id="checkout-page" className="aurora-container relative min-h-screen text-[#664C43] font-sans pb-16">
      <AuroraBg />

      {/* Header */}
      <header className="glass-navbar sticky top-0 z-50 w-full px-6 py-4 flex items-center justify-between">
        <div 
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#DC758F] to-[#873D48] flex items-center justify-center border border-white/30">
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
          id="btn-admin-nav-checkout"
          onClick={() => onNavigate(isAdminLoggedIn ? 'admin' : 'login')}
          className="px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 glass-card bg-white/40 cursor-pointer hover:border-[#00FFCD]"
        >
          {isAdminLoggedIn ? 'Painel Admin' : 'Acesso Admin'}
        </button>
      </header>

      {/* Main Container */}
      <main className="z-10 relative px-4 max-w-4xl mx-auto pt-8">
        {/* Back Link */}
        <button
          onClick={() => onNavigate('home')}
          className="inline-flex items-center gap-2 mb-6 text-xs font-bold text-[#873D48] hover:text-[#DC758F] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para a página inicial
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (Glassmorphism card) */}
          <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-[32px] border border-white/50 shadow-2xl relative">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-[#873D48] tracking-tight mb-2">
              Complete seu pedido
            </h2>
            <p className="text-xs text-[#664C43]/80 font-medium mb-6">
              Finalize o seu faturamento de <span className="text-sm font-extrabold text-[#DC758F]">R$ 5,00</span> para liberar imediato o portal de criação da sua figurinha.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Nome Completo */}
              <div className="flex flex-col gap-1.5" id="field-nome">
                <label className="text-xs font-bold uppercase tracking-wider text-[#873D48] ml-1">
                  Nome Completo
                </label>
                <input
                  type="text"
                  placeholder="Ex: João da Silva Santos"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className={`brand-input w-full ${formErrors.nome && 'border-red-500 bg-red-50/20'}`}
                />
                {formErrors.nome && (
                  <p className="text-[10.5px] font-bold text-red-500 ml-1">{formErrors.nome}</p>
                )}
              </div>

              {/* Telefone */}
              <div className="flex flex-col gap-1.5" id="field-telefone">
                <label className="text-xs font-bold uppercase tracking-wider text-[#873D48] ml-1">
                  WhatsApp (Telefone)
                </label>
                <input
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={telefone}
                  onChange={handlePhoneChange}
                  className={`brand-input w-full ${formErrors.telefone && 'border-red-500 bg-red-50/20'}`}
                />
                {formErrors.telefone && (
                  <p className="text-[10.5px] font-bold text-red-500 ml-1">{formErrors.telefone}</p>
                )}
              </div>

              {/* Method Switcher Tabs */}
              <div className="pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#873D48] ml-1 block mb-2">
                  Forma de Pagamento
                </label>
                
                <div className="grid grid-cols-3 gap-2 p-1.5 bg-white/40 rounded-2xl border border-brand-wine/10">
                  <button
                    type="button"
                    onClick={() => setActiveTab('credito')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      activeTab === 'credito' 
                        ? 'bg-gradient-to-r from-[#DC758F] to-[#873D48] text-white shadow-md' 
                        : 'text-[#664C43]/70 hover:text-[#873D48]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Crédito</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('debito')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      activeTab === 'debito' 
                        ? 'bg-gradient-to-r from-[#DC758F] to-[#873D48] text-white shadow-md' 
                        : 'text-[#664C43]/70 hover:text-[#873D48]'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Débito</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('pix')}
                    className={`py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 cursor-pointer ${
                      activeTab === 'pix' 
                        ? 'bg-gradient-to-r from-[#DC758F] to-[#873D48] text-white shadow-md' 
                        : 'text-[#664C43]/70 hover:text-[#873D48]'
                    }`}
                  >
                    <QrCode className="w-4 h-4" />
                    <span>PIX (5% off)</span>
                  </button>
                </div>
              </div>

              {/* Tab: Credit / Debit Form fields */}
              {(activeTab === 'credito' || activeTab === 'debito') && (
                <div className="space-y-4 pt-3 border-t border-brand-wine/10">
                  
                  {/* Card Number */}
                  <div className="flex flex-col gap-1.5" id="field-cardNumber">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#664C43]/85 ml-1">
                      Número do Cartão
                    </label>
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className={`brand-input w-full ${formErrors.cardNumber && 'border-red-500'}`}
                    />
                    {formErrors.cardNumber && (
                      <p className="text-[10.5px] font-bold text-red-500 ml-1">{formErrors.cardNumber}</p>
                    )}
                  </div>

                  {/* Nome no Cartão */}
                  <div className="flex flex-col gap-1.5" id="field-cardName">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#664C43]/85 ml-1">
                      Nome Impresso no Cartão
                    </label>
                    <input
                      type="text"
                      placeholder="Igual como está no cartão"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className={`brand-input w-full ${formErrors.cardName && 'border-red-500'}`}
                    />
                    {formErrors.cardName && (
                      <p className="text-[10.5px] font-bold text-red-500 ml-1">{formErrors.cardName}</p>
                    )}
                  </div>

                  {/* Expiry & CVV Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5" id="field-cardExpiry">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#664C43]/85 ml-1">
                        Validade (MM/AA)
                      </label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        className={`brand-input w-full text-center ${formErrors.cardExpiry && 'border-red-50 border-red-500'}`}
                      />
                      {formErrors.cardExpiry && (
                        <p className="text-[10.5px] font-bold text-red-500 ml-1">{formErrors.cardExpiry}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5" id="field-cardCVV">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#664C43]/85 ml-1">
                        Código CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardCVV}
                        onChange={handleCVVChange}
                        className={`brand-input w-full text-center ${formErrors.cardCVV && 'border-red-500'}`}
                      />
                      {formErrors.cardCVV && (
                        <p className="text-[10.5px] font-bold text-red-500 ml-1">{formErrors.cardCVV}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: PIX Display */}
              {activeTab === 'pix' && (
                <div className="space-y-4 pt-4 border-t border-brand-wine/10 flex flex-col items-center text-center">
                  
                  {/* Styled Fake QR code */}
                  <div className="p-3 bg-white/80 rounded-2xl border-2 border-dashed border-[#00FFCD] shadow-lg relative group">
                    <div className="w-40 h-40 bg-gradient-to-br from-[#E3D3E4] to-white items-center justify-center p-2 rounded-xl flex relative">
                      
                      {/* Fake Qr structure */}
                      <div className="absolute inset-2 border-4 border-[#873D48]/15 rounded-md flex flex-wrap p-1.5 justify-between">
                        <div className="w-8 h-8 border-4 border-[#873D48] rounded bg-transparent" />
                        <div className="w-8 h-8 border-4 border-[#873D48] rounded bg-transparent" />
                        <div className="w-8 h-8 border-4 border-[#873D48] rounded bg-transparent" />
                        <div className="w-full h-8 flex items-center justify-center">
                          <Activity className="w-6 h-6 text-[#DC758F]" />
                        </div>
                      </div>
                      
                      <div className="w-10 h-10 rounded-full bg-[#873D48] flex items-center justify-center shadow-lg border border-white relative z-10">
                        <Sparkles className="w-4 h-4 text-[#00FFCD]" />
                      </div>
                    </div>
                    
                    {/* Corner accents */}
                    <div className="absolute -top-1.5 -left-1.5 w-4 h-4 border-t-2 border-l-2 border-[#00FFCD]" />
                    <div className="absolute -bottom-1.5 -right-1.5 w-4 h-4 border-b-2 border-r-2 border-[#00FFCD]" />
                  </div>

                  <div>
                    <h4 className="font-display text-sm font-bold text-[#873D48]">
                      Escaneie o QR Code ou copie a chave PIX
                    </h4>
                    <p className="text-[10.5px] text-[#664C43]/70 font-semibold px-4 mt-1 leading-relaxed">
                      Chave vinculada instantaneamente no checkout. Use o aplicativo do seu banco para ler o QR Code ou cole o código copia-e-cola.
                    </p>
                  </div>

                  {/* Copy Chave button */}
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold border border-[#00FFCD] bg-white/70 hover:bg-[#00FFCD]/15 text-[#873D48] shadow-sm select-none transition-all duration-300 hover:scale-102 cursor-pointer"
                  >
                    {copiedPix ? (
                      <>
                        <ClipboardCheck className="w-4 h-4 text-[#873D48]" />
                        <span>Chave Copiada com Sucesso!</span>
                      </>
                    ) : (
                      <>
                        <Clipboard className="w-4 h-4 text-[#DC758F]" />
                        <span>Copiar chave PIX</span>
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Total checkout price header */}
              <div className="border-t border-brand-wine/10 pt-4 flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-[#664C43]/70">Subtotal do pedido</span>
                <div className="text-right">
                  <p className="text-xs font-bold text-[#664C43]/50 line-through">De R$ 12,00</p>
                  <p className="font-display text-xl font-black text-[#873D48]">
                    Apenas: <span className="text-2xl text-[#DC758F]">R$ 5,00</span>
                  </p>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#DC758F] to-[#873D48] text-white font-extrabold shadow-lg shadow-[#DC758F]/20 hover:scale-[1.01] active:scale-99 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-75 uppercase tracking-wider text-sm select-none"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processando Pagamento Seguro...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4.5 h-4.5 text-[#00FFCD]" />
                    <span>Finalizar pagamento</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Interactive Digital Credit Card Preview */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Realtime Credit card illustration (Only for desktop and tablet) */}
            {(activeTab === 'credito' || activeTab === 'debito') && (
              <div className="hidden md:block">
                <div className="text-left mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#873D48]">
                    Visualização em Tempo Real
                  </span>
                </div>
                
                {/* Visual card */}
                <div className="w-full h-48 rounded-[24px] bg-gradient-to-tr from-[#664C43] via-[#873D48] to-[#DC758F] p-5 shadow-2xl relative overflow-hidden border border-white/20 select-none flex flex-col justify-between">
                  {/* Cyber element accents */}
                  <div className="absolute right-0 top-0 w-32 h-32 bg-[#00FFCD]/10 rounded-full blur-2xl" />
                  
                  {/* Top card brand indicator */}
                  <div className="flex justify-between items-start z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-white/25 flex items-center justify-center border border-white/20">
                        <Sparkles className="w-4 h-4 text-[#00FFCD]" />
                      </div>
                      <span className="font-display text-sm font-black tracking-normal text-white">
                        PagBrix
                      </span>
                    </div>
                    {/* NFC chip */}
                    <div className="w-9 h-7 rounded-md bg-gradient-to-r from-amber-200 to-yellow-400 opacity-80 border border-amber-300" />
                  </div>

                  {/* Card Number display */}
                  <div className="my-2 z-10">
                    <p className="font-mono text-base tracking-widest text-[#E3D3E4] font-medium">
                      {cardNumber || '•••• •••• •••• ••••'}
                    </p>
                  </div>

                  {/* Card footer details */}
                  <div className="flex justify-between items-end z-10">
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-[#E3D3E4]/60">Nome impresso</p>
                      <p className="font-mono text-xs uppercase text-white font-semibold truncate max-w-[160px]">
                        {cardName || 'NOME COMPLETO'}
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-[#E3D3E4]/60">Validade</p>
                        <p className="font-mono text-xs text-white font-semibold">
                          {cardExpiry || 'MM/AA'}
                        </p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-wider text-[#E3D3E4]/60">CVV</p>
                        <p className="font-mono text-xs text-white font-semibold">
                          {cardCVV || '•••'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Shopping cart summary card */}
            <div className="glass-card p-6 rounded-[28px] border border-white/40 shadow-md">
              <h3 className="font-display text-sm font-black text-[#873D48] tracking-wider uppercase mb-3 flex items-center gap-1.5">
                <Ticket className="w-4.5 h-4.5 text-[#DC758F]" /> Resumo da Compra
              </h3>
              
              <div className="space-y-3.5 divide-y divide-brand-wine/10">
                <div className="flex justify-between text-xs font-bold pt-1">
                  <span className="text-[#664C43]/80">Figurinha Digital Personalizada</span>
                  <span className="text-[#873D48]">1x Unidade</span>
                </div>
                
                <div className="flex justify-between text-xs font-bold pt-3">
                  <span className="text-[#664C43]/80">Portal de Edição (Copa 2026)</span>
                  <span className="text-emerald-600">Incluso</span>
                </div>

                <div className="flex justify-between text-xs font-black pt-3 text-[#873D48]">
                  <span>Total Cobrado:</span>
                  <span>R$ 5,00</span>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-xl bg-[#00FFCD]/10 border border-[#00FFCD]/40 text-center text-[10px] font-bold text-[#873D48] tracking-wide">
                🔐 Conexão SSL Criptografada e Segurada
              </div>
            </div>

            {/* Customer support help */}
            <div className="p-5 text-center text-xs text-[#664C43]/70 font-semibold font-sans bg-white/30 rounded-2xl border border-brand-wine/5">
              Dúvidas com o seu pagamento? <br />
              Contate instantaneamente o suporte pelo e-mail: <b className="text-[#873D48]">suporte.geplan@gmail.com</b>
            </div>
          </div>

        </div>
      </main>

      {/* Success Animated Modal */}
      {showSuccessModal && (
        <div id="payment-success-modal" className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="w-full max-w-md bg-white rounded-[32px] border-4 border-[#00FFCD] p-8 text-center shadow-2xl relative overflow-hidden flex flex-col items-center">
            
            {/* Aurora Background for Modal */}
            <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-br from-[#E3D3E4] to-[#DC758F]/30 -z-10 blur-xl opacity-80" />
            
            {/* Spinning rays */}
            <div className="w-20 h-20 bg-[#00FFCD]/20 rounded-full flex items-center justify-center text-[#873D48] mb-5 border border-[#00FFCD] shadow-[0_0_20px_rgba(0,255,205,0.4)]">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 fill-white" />
            </div>

            <h3 className="font-display text-2xl sm:text-3xl font-black text-[#873D48] tracking-tight">
              Pagamento Aprovado! 🎉
            </h3>
            
            <p className="text-xs text-[#664C43]/85 font-bold mt-2 max-w-xs leading-relaxed">
              Parabéns! Identificamos o seu depósito de <b>R$ 5,00</b>. O acesso para criar sua figurinha foi enviado e liberado!
            </p>

            {/* Simulated Voucher Card */}
            <div className="my-5 w-full bg-gradient-to-br from-[#E3D3E4]/30 to-[#DC758F]/15 rounded-2xl border border-brand-wine/10 p-4.5 text-left relative overflow-hidden">
              <div className="flex justify-between items-start mb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#873D48]">Voucher Cupom</span>
                <span className="text-[9px] font-black tracking-widest text-[#664C43]/70">{newTransactionID}</span>
              </div>
              <h4 className="text-sm font-extrabold text-[#664C43] truncate">{nome}</h4>
              <p className="text-[10.5px] text-[#664C43]/75 font-semibold mt-0.5">Telefone: {telefone}</p>
              <div className="mt-3.5 flex justify-between items-end border-t border-brand-wine/10 pt-2.5 text-xs font-bold text-[#873D48]">
                <span>Status:</span>
                <span className="text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase text-[9px] tracking-wider">Aprovado</span>
              </div>
            </div>

            {/* Countdown redirect bar */}
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-gradient-to-r from-[#DC758F] to-[#873D48] h-full transition-all duration-1000"
                style={{ width: `${(countdown / 3) * 100}%` }}
              />
            </div>

            <p className="text-[10.5px] text-[#664C43]/70 font-semibold mt-3">
              Redirecionando para a página inicial em {countdown} segundos...
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

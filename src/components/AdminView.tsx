/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, LogOut, LayoutDashboard, CircleDollarSign, 
  Trash2, RefreshCw, Smartphone, Calendar, CreditCard, QrCode, 
  Search, Menu, X, ArrowLeftRight, CheckCircle2, AlertCircle, TrendingUp
} from 'lucide-react';
import { Transaction } from '../types';
import { SEED_TRANSACTIONS } from '../data';

interface AdminViewProps {
  onLogout: () => void;
  transactions: Transaction[];
  onClearTransactions: () => void;
  onRestoreSeedTransactions: () => void;
}

export default function AdminView({ 
  onLogout, 
  transactions, 
  onClearTransactions, 
  onRestoreSeedTransactions 
}: AdminViewProps) {
  
  // Tab states: Dashboard vs Payments
  const [activeView, setActiveView] = useState<'dashboard' | 'pagamentos'>('dashboard');
  
  // Mobile drawer state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search filter inside payments list
  const [searchTerm, setSearchTerm] = useState('');

  // Protect route local validation
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('pagbrix_admin_logged');
    if (!isLoggedIn) {
      window.location.hash = '#login';
    }
  }, []);

  // Metricas Calculations
  const totalSales = transactions.reduce((acc, curr) => acc + curr.valor, 0);
  const totalPaymentsCount = transactions.length;

  // Payments today (UTC baseline 2026-06-06)
  const systemToday = '2026-06-06';
  const paymentsToday = transactions.filter(tx => tx.data_hora.startsWith(systemToday)).length;

  // Most used payment method calculation
  const methodCounts = {
    'Cartão de Crédito': 0,
    'Cartão de Débito': 0,
    'PIX': 0
  };

  transactions.forEach(t => {
    // protect against any potential typing inconsistencies
    const key = t.metodo_pagamento as 'Cartão de Crédito' | 'Cartão de Débito' | 'PIX';
    if (methodCounts[key] !== undefined) {
      methodCounts[key]++;
    }
  });

  let mostUsedMethod = 'Nenhum';
  let maxCount = -1;
  Object.entries(methodCounts).forEach(([method, count]) => {
    if (count > maxCount && count > 0) {
      maxCount = count;
      mostUsedMethod = method;
    }
  });

  // Calculate percentages for custom bar graph
  const maxBarVal = Math.max(...Object.values(methodCounts), 1); // prevent divide by 0

  // Filtered transactions for the view table
  const filteredTransactions = transactions.filter(tx => {
    const query = searchTerm.toLowerCase();
    return (
      tx.id.toLowerCase().includes(query) ||
      tx.nome.toLowerCase().includes(query) ||
      tx.telefone.toLowerCase().includes(query) ||
      tx.metodo_pagamento.toLowerCase().includes(query)
    );
  });

  // Handle data clear with simple immediate action confirmation dialog
  const handleClear = () => {
    const ok = window.confirm("Aviso crítico: Tem certeza de que deseja limpar todos os registros de pagamentos do banco de dados simulado? Esta operação não pode ser desfeita.");
    if (ok) {
      onClearTransactions();
    }
  };

  const handleRestore = () => {
    onRestoreSeedTransactions();
  };

  // Helper date formatter
  const formatDateBr = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      // fallback in case of incorrect input
      if (isNaN(d.getTime())) return isoStr;
      
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return isoStr;
    }
  };

  return (
    <div id="admin-panel-page" className="min-h-screen bg-[#F7F3F8] text-[#664C43] font-sans flex flex-col md:flex-row relative">
      
      {/* 1. Sidebar Column (Desktop and Sidebar toggle on mobile) */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen z-40 w-64 p-6 shrink-0
        bg-gradient-to-b from-[#664C43] to-[#873D48] text-white
        transition-transform duration-300 transform md:transform-none
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        flex flex-col justify-between shadow-2xl
      `}>
        <div className="space-y-8">
          {/* Sidebar Top: Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 select-none">
              <div className="w-9 h-9 rounded-xl bg-[#00FFCD]/10 flex items-center justify-center border border-[#00FFCD]/35">
                <Sparkles className="w-5 h-5 text-[#00FFCD]" />
              </div>
              <div>
                <h1 className="font-display text-xl font-extrabold tracking-tight text-white leading-none">
                  Pag<span className="text-[#DC758F]">Brix</span>
                </h1>
                <p className="text-[8px] uppercase tracking-widest text-[#E3D3E4] font-bold mt-0.5">
                  minhafigurinha.com
                </p>
              </div>
            </div>
            
            {/* Close Mobile sidebar */}
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="md:hidden p-1 rounded-lg bg-white/10 text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Label of active user */}
          <div className="p-3 bg-white/10 rounded-xl border border-white/15 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#00FFCD] text-[#873D48] font-bold text-[10px] flex items-center justify-center">
              AD
            </div>
            <div className="truncate">
              <p className="text-xs font-bold leading-none">Administrador Sênior</p>
              <p className="text-[9px] text-[#E3D3E4]/80 mt-0.5">admin@pagbrix.com</p>
            </div>
          </div>

          {/* Menus list */}
          <nav className="space-y-2">
            <button
              onClick={() => { setActiveView('dashboard'); setMobileMenuOpen(false); }}
              className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                activeView === 'dashboard'
                  ? 'bg-[#DC758F] text-white shadow-md shadow-[#DC758F]/20'
                  : 'text-[#E3D3E4] hover:bg-white/10'
              }`}
            >
              <LayoutDashboard className="w-4.5 h-4.5 shrink-0" />
              <span>Dashboard Estatístico</span>
            </button>

            <button
              onClick={() => { setActiveView('pagamentos'); setMobileMenuOpen(false); }}
              className={`w-full px-4 py-3 rounded-xl text-left text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-colors ${
                activeView === 'pagamentos'
                  ? 'bg-[#DC758F] text-white shadow-md shadow-[#DC758F]/20'
                  : 'text-[#E3D3E4] hover:bg-white/10'
              }`}
            >
              <ArrowLeftRight className="w-4.5 h-4.5 shrink-0" />
              <span>Lista de Pagamentos</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer: Sair button */}
        <button
          onClick={onLogout}
          className="w-full px-4 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 text-red-100 hover:text-white hover:bg-red-500/15 border border-red-500/20 transition-all cursor-pointer"
        >
          <LogOut className="w-4.5 h-4.5 shrink-0" />
          <span>Encerrar Sessão</span>
        </button>
      </aside>

      {/* Dimmed Background Overlay on mobile sidebar opened */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)} 
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
        />
      )}

      {/* 2. Main Content Column */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Top Header navbar of Content area */}
        <header className="px-6 py-4 bg-white border-b border-[#E3D3E4] flex items-center justify-between sticky top-0 z-30 shadow-xs">
          
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger toggle */}
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-1.5 rounded-lg bg-[#E3D3E4]/30 hover:bg-[#E3D3E4]/50 text-[#873D48] cursor-pointer"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#873D48] capitalize">
              {activeView === 'dashboard' ? 'Painel de Métricas' : 'Tabela de Transações'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              ● Banco de Dados Conectado
            </span>
            
            <button
              onClick={onLogout}
              className="px-3.5 py-1.5 rounded-lg border border-brand-wine/10 hover:border-red-500 hover:text-red-600 transition-colors text-xs font-bold uppercase"
            >
              Sair
            </button>
          </div>
        </header>

        {/* Inner Content area scrollable */}
        <main className="p-6 flex-grow max-w-7xl w-full mx-auto space-y-6">
          
          {/* VIEW 1: DASHBOARD VIEW */}
          {activeView === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Metric Cards Top Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* 1. Total faturado */}
                <div className="bg-white p-5 rounded-2xl border border-[#E3D3E4] shadow-sm flex items-start gap-3.5 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-[#DC758F]/10 flex items-center justify-center text-[#DC758F] border border-[#DC758F]/15">
                    <CircleDollarSign className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-[#664C43]/60 tracking-wider">Total de Vendas</p>
                    <p className="text-xl font-bold tracking-tight text-[#873D48] mt-1">
                      {totalSales.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                  </div>
                </div>

                {/* 2. Numero de pagamentos */}
                <div className="bg-white p-5 rounded-2xl border border-[#E3D3E4] shadow-sm flex items-start gap-3.5 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-[#873D48]/10 flex items-center justify-center text-[#873D48] border border-[#873D48]/15">
                    <CheckCircle2 className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-[#664C43]/60 tracking-wider">Nº Pagamentos</p>
                    <p className="text-xl font-bold tracking-tight text-[#873D48] mt-1">{totalPaymentsCount}</p>
                  </div>
                </div>

                {/* 3. Pagamentos Hoje */}
                <div className="bg-white p-5 rounded-2xl border border-[#E3D3E4] shadow-sm flex items-start gap-3.5 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-[#00FFCD]/15 flex items-center justify-center text-emerald-700 border border-[#00FFCD]/40">
                    <Calendar className="w-5.5 h-5.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-[#664C43]/60 tracking-wider">Pagamentos Hoje</p>
                    <p className="text-xl font-bold tracking-tight text-[#873D48] mt-1">{paymentsToday}</p>
                  </div>
                </div>

                {/* 4. Método mais usado */}
                <div className="bg-white p-5 rounded-2xl border border-[#E3D3E4] shadow-sm flex items-start gap-3.5 relative overflow-hidden">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 border border-orange-200">
                    <TrendingUp className="w-5.5 h-5.5" />
                  </div>
                  <div className="truncate">
                    <p className="text-[10px] font-black uppercase text-[#664C43]/60 tracking-wider">Método Mais Usado</p>
                    <p className="text-sm font-bold tracking-tight text-[#873D48] mt-1.5 truncate uppercase">
                      {mostUsedMethod}
                    </p>
                  </div>
                </div>
              </div>

              {/* Graphic Chart + Summary list Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 1. Bar Chart Card */}
                <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-[24px] border border-[#E3D3E4] shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="font-display text-base font-extrabold text-[#873D48] tracking-tight">
                      Preferência por Meios de Pagamento
                    </h3>
                    <p className="text-xs text-[#664C43]/75 font-semibold mt-1">
                      Análise volumétrica de conversão fiduciária no checkout da campanha.
                    </p>
                  </div>

                  {/* Horizontal Bar Chart representation */}
                  <div className="space-y-6 my-8">
                    
                    {/* Bar Item: PIX */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="flex items-center gap-1.5"><QrCode className="w-4 h-4 text-[#873D48]" /> PIX</span>
                        <span>{methodCounts['PIX']} Transações</span>
                      </div>
                      <div className="w-full bg-gray-100 h-6.5 rounded-xl overflow-hidden relative border border-gray-200">
                        {/* Dynamic filled bar */}
                        <div 
                          className="bg-gradient-to-r from-[#00FFCD]/60 to-[#DC758F]/70 h-full rounded-xl transition-all duration-1000 flex items-center px-3"
                          style={{ width: `${(methodCounts['PIX'] / maxBarVal) * 100}%` }}
                        >
                          <span className="text-[9.5px] font-extrabold text-[#664C43] z-10">
                            {((methodCounts['PIX']) * 5).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bar Item: Cartão de Crédito */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-[#873D48]" /> Cartão de Crédito</span>
                        <span>{methodCounts['Cartão de Crédito']} Transações</span>
                      </div>
                      <div className="w-full bg-gray-100 h-6.5 rounded-xl overflow-hidden relative border border-gray-200">
                        <div 
                          className="bg-gradient-to-r from-[#DC758F] to-[#873D48] h-full rounded-xl transition-all duration-1000 flex items-center px-3"
                          style={{ width: `${(methodCounts['Cartão de Crédito'] / maxBarVal) * 100}%` }}
                        >
                          <span className="text-[9.5px] font-extrabold text-white z-10">
                            {((methodCounts['Cartão de Crédito']) * 5).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bar Item: Cartão de Débito */}
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold">
                        <span className="flex items-center gap-1.5"><CreditCard className="w-4 h-4 text-[#873D48]" /> Cartão de Débito</span>
                        <span>{methodCounts['Cartão de Débito']} Transações</span>
                      </div>
                      <div className="w-full bg-gray-100 h-6.5 rounded-xl overflow-hidden relative border border-gray-200">
                        <div 
                          className="bg-[#E3D3E4] border border-[#DC758F]/30 h-full rounded-xl transition-all duration-1000 flex items-center px-3"
                          style={{ width: `${(methodCounts['Cartão de Débito'] / maxBarVal) * 100}%` }}
                        >
                          <span className="text-[9.5px] font-extrabold text-[#873D48] z-10">
                            {((methodCounts['Cartão de Débito']) * 5).toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="p-4 bg-[#F7F3F8] rounded-xl border border-[#E3D3E4] text-[10.5px] font-bold text-[#664C43]/80 leading-relaxed">
                    💡 O PIX oferece menor taxa operacional de gateway para a plataforma minhafigurinha.com. Considere destacar promoções de checkout para impulsionar este canal!
                  </div>
                </div>

                {/* 2. Right Action Column / Help info */}
                <div className="lg:col-span-4 space-y-6">
                  
                  {/* Quick Maintenance Controls */}
                  <div className="bg-white p-6 rounded-[24px] border border-[#E3D3E4] shadow-sm space-y-4">
                    <h4 className="font-display text-sm font-black text-[#873D48] uppercase tracking-wider">
                      Gerenciamento de Dados
                    </h4>
                    
                    <div className="space-y-3">
                      
                      {/* Restore Seed */}
                      <button
                        onClick={handleRestore}
                        className="w-full py-3 rounded-xl border border-[#00FFCD] hover:bg-[#00FFCD]/15 text-xs font-extrabold text-[#873D48] flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4 text-[#DC758F]" />
                        Restaurar Dados Originais
                      </button>

                      {/* Clear Data */}
                      <button
                        onClick={handleClear}
                        className="w-full py-3 rounded-xl border border-red-200 hover:bg-red-50 text-xs font-extrabold text-red-600 flex items-center justify-center gap-2 transition-all cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                        Apagar Todas as Transações
                      </button>

                    </div>
                  </div>

                  {/* Campaign summary metadata info */}
                  <div className="p-6 bg-gradient-to-tr from-[#664C43] to-[#873D48] text-white rounded-[24px] shadow-sm relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 w-24 h-24 bg-[#DC758F]/15 rounded-full blur-xl" />
                    
                    <h5 className="font-display text-sm font-extrabold flex items-center gap-2">
                      <Sparkles className="w-4.5 h-4.5 text-[#00FFCD]" /> Campanha Ativa
                    </h5>
                    
                    <div className="mt-4 space-y-3 text-[11px] font-semibold text-[#E3D3E4]">
                      <div className="flex justify-between">
                        <span>Lançamento:</span>
                        <span className="text-white">01 Junho 2026</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Preço Unitário:</span>
                        <span className="text-white">R$ 5,00 fixo</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Domínio Associado:</span>
                        <span className="text-[#00FFCD] underline">minhafigurinha.com</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

          {/* VIEW 2: PAYMENTS GRID LIST */}
          {activeView === 'pagamentos' && (
            <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-[#E3D3E4] shadow-sm space-y-6 animate-fade-in">
              
              {/* Toolbar of table */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Search Bar */}
                <div className="w-full sm:max-w-md relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    placeholder="Filtrar por nome, telefone, método ou código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full py-2.5 pl-10 pr-4 rounded-xl border border-[#E3D3E4] text-xs font-semibold focus:outline-none focus:border-[#DC758F]"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')} 
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-[#873D48]"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Count summary badge */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <span className="text-xs font-bold text-[#664C43]/70">
                    Exibindo <b>{filteredTransactions.length}</b> de <b>{transactions.length}</b> faturamentos
                  </span>
                </div>
              </div>

              {/* Transactions Table responsive box */}
              <div className="border border-[#E3D3E4] rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-left border-collapse" style={{ minWidth: '700px' }}>
                    
                    {/* Table headers */}
                    <thead>
                      <tr className="bg-[#F7F3F8] border-b border-[#E3D3E4] text-[11px] font-black uppercase tracking-wider text-[#873D48]">
                        <th className="py-4.5 px-5">ID</th>
                        <th className="py-4.5 px-5">Cliente</th>
                        <th className="py-4.5 px-5">Telefone / WhatsApp</th>
                        <th className="py-4.5 px-5">Método de Tipo</th>
                        <th className="py-4.5 px-5">Data/Hora</th>
                        <th className="py-4.5 px-5">Valor</th>
                        <th className="py-4.5 px-5 text-center">Status</th>
                      </tr>
                    </thead>

                    {/* Table body rows */}
                    <tbody className="divide-y divide-gray-100 text-xs">
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-[#F7F3F8]/50 transition-colors font-semibold">
                            {/* ID badge */}
                            <td className="py-4 px-5">
                              <span className="font-mono text-[10.5px] font-bold text-gray-500">
                                {tx.id}
                              </span>
                            </td>

                            {/* Cliente details */}
                            <td className="py-4 px-5">
                              <div>
                                <p className="font-bold text-[#873D48] text-xs leading-none">{tx.nome}</p>
                                {tx.cartao_nome && (
                                  <p className="text-[9.5px] text-gray-400 font-medium mt-1 uppercase">
                                    💳 Titular: {tx.cartao_nome}
                                  </p>
                                )}
                              </div>
                            </td>

                            {/* Telefone */}
                            <td className="py-4 px-5 text-gray-600">
                              {tx.telefone}
                            </td>

                            {/* Metodo icon + label */}
                            <td className="py-4 px-5">
                              <span className="inline-flex items-center gap-1.5 uppercase text-[10px] font-bold">
                                {tx.metodo_pagamento === 'PIX' ? (
                                  <>
                                    <QrCode className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span>PIX</span>
                                  </>
                                ) : (
                                  <>
                                    <CreditCard className="w-3.5 h-3.5 text-[#DC758F] shrink-0" />
                                    <span className="truncate">{tx.metodo_pagamento}</span>
                                  </>
                                )}
                              </span>
                            </td>

                            {/* Date time formatted */}
                            <td className="py-4 px-5 text-[11px] text-gray-500 font-medium">
                              {formatDateBr(tx.data_hora)}
                            </td>

                            {/* Money value */}
                            <td className="py-4 px-5 text-sm font-bold text-[#873D48] tabular-nums">
                              {tx.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </td>

                            {/* Approved badge */}
                            <td className="py-4 px-5 text-center">
                              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 border border-emerald-200 text-emerald-700">
                                {tx.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        // Empty State illustration block inside table container
                        <tr>
                          <td colSpan={7} className="py-16 px-6 text-center">
                            <div className="flex flex-col items-center justify-center space-y-4">
                              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mr-1">
                                <AlertCircle className="w-8 h-8 text-gray-400" />
                              </div>
                              
                              <div>
                                <h5 className="font-display text-base font-extrabold text-[#873D48]">
                                  Nenhum pagamento encontrado
                                </h5>
                                <p className="text-xs text-[#664C43]/70 font-semibold max-w-sm mx-auto mt-1 leading-relaxed">
                                  {searchTerm 
                                    ? 'A filtragem não retornou resultados. Experimente utilizar termos genéricos de buscas.' 
                                    : 'A tabela de transações está limpa no banco de dados localStorage da sua máquina.'}
                                </p>
                              </div>

                              {!searchTerm && (
                                <button
                                  onClick={handleRestore}
                                  className="px-5 py-2.5 rounded-xl border border-[#00FFCD] hover:bg-[#00FFCD]/15 text-xs font-bold text-[#873D48] transition-all cursor-pointer"
                                >
                                  Restaurar dados fictícios de demonstração
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>

                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}

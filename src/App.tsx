/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import LandingView from './components/LandingView';
import CheckoutView from './components/CheckoutView';
import LoginView from './components/LoginView';
import AdminView from './components/AdminView';
import { Transaction } from './types';
import { SEED_TRANSACTIONS } from './data';

export default function App() {
  // Sync router view with URL Hash
  const [view, setView] = useState<'home' | 'checkout' | 'login' | 'admin'>('home');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('pagbrix_admin_logged') === 'true';
  });

  // Load persistent transactions list, fallbacks to mock seeds
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('pagbrix_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Local storage transaction parse fail", e);
      }
    }
    // Seed and persist
    localStorage.setItem('pagbrix_transactions', JSON.stringify(SEED_TRANSACTIONS));
    return SEED_TRANSACTIONS;
  });

  // Watch URL Hash Shifts
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const logged = localStorage.getItem('pagbrix_admin_logged') === 'true';
      setIsAdminLoggedIn(logged);

      if (hash === '#checkout') {
        setView('checkout');
      } else if (hash === '#login') {
        if (logged) {
          window.location.hash = '#admin';
        } else {
          setView('login');
        }
      } else if (hash === '#admin') {
        if (!logged) {
          window.location.hash = '#login';
        } else {
          setView('admin');
        }
      } else {
        setView('home');
      }
    };

    // Run initially
    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync logout action
  const handleLogout = () => {
    localStorage.removeItem('pagbrix_admin_logged');
    setIsAdminLoggedIn(false);
    window.location.hash = '#login';
  };

  // Sync login trigger
  const handleLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    window.location.hash = '#admin';
  };

  // Add newly authorized checkout payment
  const handlePaymentSuccess = (newTx: Transaction) => {
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    localStorage.setItem('pagbrix_transactions', JSON.stringify(updated));
  };

  // Purge payments database
  const handlePurge = () => {
    setTransactions([]);
    localStorage.setItem('pagbrix_transactions', JSON.stringify([]));
  };

  // Restore seed datasets
  const handleRestore = () => {
    setTransactions(SEED_TRANSACTIONS);
    localStorage.setItem('pagbrix_transactions', JSON.stringify(SEED_TRANSACTIONS));
  };

  // Navigation programmatic trigger
  const handleCardNavigate = (to: 'checkout' | 'login' | 'admin') => {
    window.location.hash = `#${to}`;
  };

  return (
    <div className="w-full min-h-screen relative overflow-hidden bg-[#F7F3F8]">
      {view === 'home' && (
        <LandingView 
          onNavigate={handleCardNavigate} 
          isAdminLoggedIn={isAdminLoggedIn} 
        />
      )}
      
      {view === 'checkout' && (
        <CheckoutView 
          onNavigate={(target) => window.location.hash = target === 'home' ? '' : `#${target}`} 
          isAdminLoggedIn={isAdminLoggedIn}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      {view === 'login' && (
        <LoginView 
          onNavigate={(target) => window.location.hash = target === 'home' ? '' : `#${target}`} 
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {view === 'admin' && (
        <AdminView 
          onLogout={handleLogout}
          transactions={transactions}
          onClearTransactions={handlePurge}
          onRestoreSeedTransactions={handleRestore}
        />
      )}
    </div>
  );
}

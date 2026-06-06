/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface Transaction {
  id: string;
  nome: string;
  telefone: string;
  metodo_pagamento: 'Cartão de Crédito' | 'Cartão de Débito' | 'PIX';
  data_hora: string;
  valor: number;
  status: 'aprovado';
  cartao_nome?: string;
}

export interface MetricCardProps {
  id: string;
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Transaction } from './types';

export const SEED_TRANSACTIONS: Transaction[] = [
  {
    id: "TX-783A92",
    nome: "Lucas Alencar Azevedo",
    telefone: "(11) 98765-4321",
    metodo_pagamento: "Cartão de Crédito",
    data_hora: "2026-06-05T14:32:00Z",
    valor: 5.00,
    status: "aprovado"
  },
  {
    id: "TX-491C84",
    nome: "Mariana Mendes Souza",
    telefone: "(21) 99123-4567",
    metodo_pagamento: "PIX",
    data_hora: "2026-06-05T18:15:22Z",
    valor: 5.00,
    status: "aprovado"
  },
  {
    id: "TX-205D11",
    nome: "Carlos Eduardo Ribeiro",
    telefone: "(31) 98877-6655",
    metodo_pagamento: "PIX",
    data_hora: "2026-06-06T00:45:10Z",
    valor: 5.00,
    status: "aprovado"
  },
  {
    id: "TX-903F44",
    nome: "Amanda Lima Prado",
    telefone: "(41) 97766-5544",
    metodo_pagamento: "Cartão de Débito",
    data_hora: "2026-06-06T01:05:00Z",
    valor: 5.00,
    status: "aprovado"
  },
  {
    id: "TX-512E99",
    nome: "Bruno Castro Oliveira",
    telefone: "(19) 99345-6789",
    metodo_pagamento: "Cartão de Crédito",
    data_hora: "2026-06-06T01:18:12Z",
    valor: 5.00,
    status: "aprovado"
  }
];

export const TESTIMONIALS = [
  {
    id: "t1",
    name: "Juliana Santos",
    role: "Colecionadora",
    avatar: "JS",
    comment: "Adorei a facilidade! Paguei o PIX e em segundos já tinha meu cupom de resgate da figurinha com minha foto. Ficou incrível no meu álbum físico!"
  },
  {
    id: "t2",
    name: "Roberto Silva",
    role: "Fã de Futebol",
    avatar: "RS",
    comment: "Fiz figurinhas do meu time de várzea inteiro. O PagBrix processou o pagamento super rápido. Atendimento excelente pelo suporte!"
  },
  {
    id: "t3",
    name: "Ana Beatriz",
    role: "Mãe Coruja",
    avatar: "AB",
    comment: "Criei figurinhas do aniversário de 8 anos do meu filho para dar de lembrança. Todos os convidados amaram! Muito simples de comprar por R$ 5,00."
  }
];

export const HOW_IT_WORKS = [
  {
    id: "h1",
    step: "01",
    title: "Pague com PagBrix",
    description: "Insira seus dados básicos e faça o pagamento rápido de apenas R$ 5,00 via PIX ou Cartão."
  },
  {
    id: "h2",
    step: "02",
    title: "Personalize seu Card",
    description: "Suba a foto escolhida, preencha as estatísticas personalizadas e escolha as cores do fundo."
  },
  {
    id: "h3",
    step: "03",
    title: "Receba e Cole",
    description: "Baixe a versão digital de alta resolução imediatamente para imprimir, compartilhar ou colar."
  }
];

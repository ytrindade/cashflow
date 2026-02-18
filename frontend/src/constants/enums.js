export const PaymentTypeEnum = {
  Cash: 0,
  CreditCard: 1,
  DebitCard: 2,
  ElectronicTransfer: 3
};

export const PaymentTypeNames = {
  0: 'Dinheiro',
  1: 'Cartão de Crédito',
  2: 'Cartão de Débito',
  3: 'Transferência Eletrônica'
};

export const TagEnum = {
  Health: 0,
  Essential: 1,
  Variable: 2,
  Fixed: 3,
  Personal: 4,
  Emergency: 5,
  Investment: 6,
  Leisure: 7,
  Education: 8,
  Transportation: 9
};

export const TagNames = {
  0: 'Saúde',
  1: 'Essencial',
  2: 'Variável',
  3: 'Fixa',
  4: 'Pessoal',
  5: 'Emergência',
  6: 'Investimento',
  7: 'Lazer',
  8: 'Educação',
  9: 'Transporte'
};

export const TagColors = {
  0: '#e11d48', // Saúde - vermelho
  1: '#0ea5a4', // Essencial - teal
  2: '#f59e0b', // Variável - âmbar
  3: '#6366f1', // Fixa - roxo
  4: '#ef4444', // Pessoal - vermelho escuro
  5: '#efaa2d', // Emergência - laranja
  6: '#10b981', // Investimento - verde
  7: '#3b82f6', // Lazer - azul
  8: '#8b5cf6', // Educação - violeta
  9: '#64748b'  // Transporte - cinza-azulado
};

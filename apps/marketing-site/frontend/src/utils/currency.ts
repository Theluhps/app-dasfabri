
/**
 * Format currency amount with currency symbol
 * @param amount The amount to be formatted
 * @param currency The currency code (USD, BRL, etc)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: string | number, currency: string) => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  }).format(numAmount);
};

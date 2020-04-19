export function formatCurrency(number) {
  return new Intl.NumberFormat('de-DE', { style: 'currency',  currency: 'IDR' }).format(number)
}
export const currencyFormatter = (value: number) => {
  return value.toLocaleString('en-EN', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });
}
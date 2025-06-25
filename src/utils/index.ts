export function formatCurrency(n: number) {
  return (
    '$' +
    n.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

export function formatDate(date: Date) {
  return date.toLocaleString('en-US', {
    month: 'short',
    day: '2-digit',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
}

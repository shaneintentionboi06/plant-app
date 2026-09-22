// Central INR currency formatter — single source of truth for all price displays.
// All catalog prices are stored in whole Indian Rupees.
const inrFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

const inrDecimals = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format a whole-rupee value, e.g. 3499 -> "₹3,499". */
export function formatINR(value: number): string {
  return inrFormatter.format(Math.round(value));
}

/** Format a value that may carry paise, e.g. GST totals. */
export function formatINRExact(value: number): string {
  return inrDecimals.format(value);
}

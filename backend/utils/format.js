/**
 * Formats prices exactly the way the existing Search Results UI displays them,
 * e.g. 34999 -> "₹34,999".
 */
const inrFormatter = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });

export function formatINR(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) {
    return null;
  }
  return `₹${inrFormatter.format(Number(value))}`;
}
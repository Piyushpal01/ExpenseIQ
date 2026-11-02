//  This file servers as a Utility Function that formats raw numbers into the Indian Rupee (INR) currency format (`₹XX,XX,XXX.XX`) using standard Indian numbering systems.

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

export function formatCurrency(amount) {
    // (amount ?? 0) checks if the amount is null or undefined, and defaults it to 0.
    // Number(...) converts strings or numbers safely into a valid number format.
    // format(...) applies the INR style rules to the final value.
    return currencyFormatter.format(Number(amount ?? 0))
}
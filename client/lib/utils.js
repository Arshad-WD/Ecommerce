// Utility helper functions

/**
 * Combines Tailwind CSS classes dynamically.
 * A lightweight alternative to clsx + tailwind-merge.
 */
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

/**
 * Formats a number as USD currency.
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Returns a slugified version of a string.
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

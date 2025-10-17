// Simple localStorage-backed guest cart helper
const KEY = 'guest_cart_v1';

export function getGuestCart() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to read guest cart', e);
    return [];
  }
}

export function setGuestCart(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to write guest cart', e);
  }
}

export function addGuestCartItem(product) {
  const items = getGuestCart();
  const exists = items.find((p) => String(p._id) === String(product._id));
  if (!exists) {
    items.push({ ...product });
    setGuestCart(items);
    window.dispatchEvent(new Event('cart:changed'));
  }
}

export function removeGuestCartItem(productId) {
  let items = getGuestCart();
  items = items.filter((p) => String(p._id) !== String(productId));
  setGuestCart(items);
  window.dispatchEvent(new Event('cart:changed'));
}

export function guestCartIncludes(productId) {
  const items = getGuestCart();
  return items.some((p) => String(p._id) === String(productId));
}

export default {
  getGuestCart,
  setGuestCart,
  addGuestCartItem,
  removeGuestCartItem,
  guestCartIncludes,
};

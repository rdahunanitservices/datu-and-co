/* ============================================================
   DATU & CO. — Sample store logic
   - Renders products
   - Cart drawer (add / qty / remove)
   - "Place Order via Messenger" → builds a pre-filled message
   - Mobile nav + toast
   ------------------------------------------------------------
   NOTE: Replace MESSENGER_URL with the real page link, and swap
   the product images/prices for Datu & Co.'s actual catalog.
   ============================================================ */

// Facebook page username from the brand's page (m.me deep-link)
const MESSENGER_URL = 'https://m.me/datucobai';

const PRODUCTS = [
  { id: 'p1', name: 'Bagani Heavyweight Tee', desc: 'Box-fit · 240gsm cotton', price: 749, was: null, tag: 'New', sizes: ['S','M','L','XL'],
    img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=70' },
  { id: 'p2', name: 'Mandirigma Hoodie', desc: 'Brushed fleece · oversized', price: 1499, was: 1799, tag: 'Best Seller', sizes: ['M','L','XL'],
    img: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=600&q=70' },
  { id: 'p3', name: 'Lakan Denim Jacket', desc: 'Washed denim · gold stitch', price: 2299, was: null, tag: 'Limited', sizes: ['M','L','XL'],
    img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=70' },
  { id: 'p4', name: 'Tribu Graphic Tee', desc: 'Original crest print', price: 699, was: null, tag: 'New', sizes: ['S','M','L','XL'],
    img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=600&q=70' },
  { id: 'p5', name: 'Datu Crest Pullover', desc: 'Embroidered crest · midweight', price: 1399, was: null, tag: null, sizes: ['M','L','XL'],
    img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=70' },
  { id: 'p6', name: 'Kampilan Cargo Pants', desc: 'Tactical fit · 6 pockets', price: 1599, was: 1899, tag: 'Sale', sizes: ['30','32','34','36'],
    img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=600&q=70' },
  { id: 'p7', name: 'Warrior Box Tee', desc: 'Heavyweight · drop shoulder', price: 799, was: null, tag: null, sizes: ['S','M','L','XL'],
    img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=70' },
  { id: 'p8', name: 'Heritage Zip Jacket', desc: 'Full-zip · gold pull', price: 1899, was: null, tag: 'New', sizes: ['M','L','XL'],
    img: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=70' },
];

const peso = n => '₱' + n.toLocaleString('en-PH');

/* ---------- STATE ---------- */
const cart = []; // { id, size, qty }

/* ---------- RENDER PRODUCTS ---------- */
const productsEl = document.getElementById('products');
productsEl.innerHTML = PRODUCTS.map(p => `
  <article class="product" data-id="${p.id}">
    <div class="product-media">
      ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
      <img src="${p.img}" alt="${p.name}" loading="lazy"
           onerror="this.style.display='none';this.parentElement.style.background='linear-gradient(135deg,#1d1d22,#0c0c0e)'">
    </div>
    <div class="product-body">
      <h3 class="product-name">${p.name}</h3>
      <p class="product-desc">${p.desc}</p>
      <div class="product-sizes" role="group" aria-label="Select size">
        ${p.sizes.map((s,i) => `<span class="size${i===0?' active':''}" data-size="${s}">${s}</span>`).join('')}
      </div>
      <div class="product-foot">
        <span class="product-price">${p.was ? `<span class="was">${peso(p.was)}</span>` : ''}${peso(p.price)}</span>
        <button class="add-btn" data-add="${p.id}">Add</button>
      </div>
    </div>
  </article>
`).join('');

/* size selection */
productsEl.addEventListener('click', e => {
  const size = e.target.closest('.size');
  if (size) {
    size.parentElement.querySelectorAll('.size').forEach(s => s.classList.remove('active'));
    size.classList.add('active');
    return;
  }
  const add = e.target.closest('[data-add]');
  if (add) {
    const card = add.closest('.product');
    const id = add.dataset.add;
    const activeSize = card.querySelector('.size.active');
    addToCart(id, activeSize ? activeSize.dataset.size : 'M');
  }
});

/* ---------- CART LOGIC ---------- */
function addToCart(id, size) {
  const line = cart.find(l => l.id === id && l.size === size);
  if (line) line.qty++;
  else cart.push({ id, size, qty: 1 });
  renderCart();
  showToast(`Added · size ${size}`);
  bumpCount();
}

function changeQty(id, size, delta) {
  const line = cart.find(l => l.id === id && l.size === size);
  if (!line) return;
  line.qty += delta;
  if (line.qty <= 0) cart.splice(cart.indexOf(line), 1);
  renderCart();
}

function removeLine(id, size) {
  const i = cart.findIndex(l => l.id === id && l.size === size);
  if (i > -1) cart.splice(i, 1);
  renderCart();
}

const cartItemsEl = document.getElementById('cart-items');
const cartEmptyEl = document.getElementById('cart-empty');
const cartFooterEl = document.getElementById('cart-footer');
const cartTotalEl = document.getElementById('cart-total');
const cartCountEl = document.getElementById('cart-count');

function cartTotal() {
  return cart.reduce((sum, l) => sum + PRODUCTS.find(p => p.id === l.id).price * l.qty, 0);
}
function cartCount() {
  return cart.reduce((sum, l) => sum + l.qty, 0);
}

function renderCart() {
  const count = cartCount();
  cartCountEl.textContent = count;
  cartCountEl.classList.toggle('show', count > 0);

  if (!cart.length) {
    cartEmptyEl.style.display = '';
    cartFooterEl.hidden = true;
    cartItemsEl.querySelectorAll('.cart-line').forEach(n => n.remove());
    return;
  }
  cartEmptyEl.style.display = 'none';
  cartFooterEl.hidden = false;

  const html = cart.map(l => {
    const p = PRODUCTS.find(p => p.id === l.id);
    return `
      <div class="cart-line">
        <img class="cart-line-img" src="${p.img}" alt="${p.name}"
             onerror="this.style.background='#1d1d22'">
        <div class="cart-line-info">
          <div class="cart-line-name">${p.name}</div>
          <div class="cart-line-meta">Size ${l.size} · ${peso(p.price)} ea</div>
          <div class="cart-line-price">${peso(p.price * l.qty)}</div>
          <div class="qty">
            <button data-q="dec" data-id="${l.id}" data-size="${l.size}" aria-label="Decrease">−</button>
            <span>${l.qty}</span>
            <button data-q="inc" data-id="${l.id}" data-size="${l.size}" aria-label="Increase">+</button>
          </div>
          <button class="cart-line-remove" data-remove data-id="${l.id}" data-size="${l.size}">Remove</button>
        </div>
      </div>`;
  }).join('');

  cartItemsEl.querySelectorAll('.cart-line').forEach(n => n.remove());
  cartEmptyEl.insertAdjacentHTML('afterend', html);
  cartTotalEl.textContent = peso(cartTotal());
}

cartItemsEl.addEventListener('click', e => {
  const q = e.target.closest('[data-q]');
  if (q) { changeQty(q.dataset.id, q.dataset.size, q.dataset.q === 'inc' ? 1 : -1); return; }
  const rm = e.target.closest('[data-remove]');
  if (rm) removeLine(rm.dataset.id, rm.dataset.size);
});

function bumpCount() {
  cartCountEl.style.transform = 'scale(1.35)';
  setTimeout(() => cartCountEl.style.transform = '', 180);
}

/* ---------- CART DRAWER OPEN/CLOSE ---------- */
const drawer = document.getElementById('cart-drawer');
const overlay = document.getElementById('cart-overlay');
const openCart = () => { drawer.classList.add('open'); overlay.classList.add('open'); };
const closeCart = () => { drawer.classList.remove('open'); overlay.classList.remove('open'); };

document.getElementById('cart-btn').addEventListener('click', openCart);
document.getElementById('cart-close').addEventListener('click', closeCart);
overlay.addEventListener('click', closeCart);
document.getElementById('cart-empty-shop').addEventListener('click', closeCart);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

/* ---------- PLACE ORDER VIA MESSENGER ---------- */
function buildOrderMessage() {
  let msg = `Hi Datu & Co.! I'd like to place an order:%0A%0A`;
  cart.forEach(l => {
    const p = PRODUCTS.find(p => p.id === l.id);
    msg += `• ${p.name} (Size ${l.size}) x${l.qty} — ${peso(p.price * l.qty)}%0A`;
  });
  msg += `%0ATotal: ${peso(cartTotal())}%0A%0AName:%0AAddress:%0APayment (GCash / Maya / COD):`;
  return msg;
}

function goToMessenger(prefill) {
  const url = prefill
    ? `${MESSENGER_URL}?text=${buildOrderMessage()}`
    : MESSENGER_URL;
  window.open(url, '_blank', 'noopener');
}

document.getElementById('place-order').addEventListener('click', () => {
  if (!cart.length) return;
  goToMessenger(true);
  showToast('Opening Messenger with your order…');
});

['fab-messenger', 'cta-messenger', 'footer-messenger'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('click', e => { e.preventDefault(); goToMessenger(false); });
});

/* ---------- TOAST ---------- */
const toastEl = document.getElementById('toast');
let toastTimer;
function showToast(text) {
  toastEl.textContent = text;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
}

/* ---------- MOBILE NAV ---------- */
const toggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  toggle.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  toggle.setAttribute('aria-expanded', 'false');
}));

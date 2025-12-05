const CartView = {
  render: async () => {
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Mi Carrito</h1>
      </div>
      <div class="cart-container">
        <div id="cartItems" class="cart-items"></div>
        <div class="cart-summary">
          <h3>Resumen</h3>
          <div class="summary-row summary-total">
            <span>Total:</span>
            <span id="cartTotal">S/ 0,00</span>
          </div>
          <button id="checkoutBtn" class="btn btn-primary btn-block mt-4">Proceder al Pago</button>
        </div>
      </div>
    `;
  },

  afterRender: async () => {
    const renderCart = () => {
      const cart = Storage.getCart();
      const container = document.getElementById('cartItems');
      const checkoutBtn = document.getElementById('checkoutBtn');

      if (!cart || cart.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Tu carrito está vacío</p></div>';
        document.getElementById('cartTotal').textContent = 'S/ 0,00';
        checkoutBtn.disabled = true;
        return;
      }

      checkoutBtn.disabled = false;

      container.innerHTML = cart.map((item, idx) => `
        <div class="cart-item">
          <div class="cart-item-info">
            <h4>${Helpers.escapeHtml(item.title)}</h4>
            <p>${Helpers.formatPrice(item.price)}</p>
          </div>
          <div class="cart-item-actions">
            <div class="quantity-control">
              <button class="btn-qty" data-idx="${idx}" data-delta="-1">-</button>
              <span>${item.quantity}</span>
              <button class="btn-qty" data-idx="${idx}" data-delta="1">+</button>
            </div>
            <button class="btn btn-sm btn-danger btn-remove" data-idx="${idx}"><i class="fas fa-trash"></i></button>
          </div>
        </div>
      `).join('');

      const total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      document.getElementById('cartTotal').textContent = Helpers.formatPrice(total);

      container.querySelectorAll('.btn-qty').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.dataset.idx);
          const delta = parseInt(btn.dataset.delta);
          updateCartQty(idx, delta, renderCart);
        });
      });

      container.querySelectorAll('.btn-remove').forEach(btn => {
        btn.addEventListener('click', () => {
          updateCartQty(parseInt(btn.dataset.idx), -999, renderCart);
        });
      });
    };

    renderCart();

    document.getElementById('checkoutBtn').addEventListener('click', () => {
      const cart = Storage.getCart();
      if (!cart || cart.length === 0) {
        Toast.show('Tu carrito está vacío', 'error');
        return;
      }
      window.location.hash = '#/checkout';
    });
  }
};

function updateCartQty(idx, delta, cb) {
  const cart = Storage.getCart();
  cart[idx].quantity += delta;
  if (cart[idx].quantity <= 0) cart.splice(idx, 1);
  Storage.saveCart(cart);
  Navbar.refreshCartBadge();
  cb();
}

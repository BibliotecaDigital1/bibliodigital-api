const CheckoutView = {
  render: async () => {
    const cart = Storage.getCart();
    const total = cart ? cart.reduce((sum, i) => sum + (i.price * i.quantity), 0) : 0;

    const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const purchaseId = urlParams.get('purchaseId');
    const isPendingPayment = !!purchaseId;

    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">${isPendingPayment ? 'Completar Pago' : 'Finalizar Compra'}</h1>
      </div>
      
      <div class="checkout-container">
        <div class="checkout-form-section">
          <h3><i class="fas fa-credit-card"></i> Método de Pago</h3>
          
          <div class="payment-methods">
            <label class="payment-method-option">
              <input type="radio" name="paymentMethod" value="card" checked>
              <div class="payment-method-card">
                <i class="fas fa-credit-card"></i>
                <span>Tarjeta de Crédito/Débito</span>
              </div>
            </label>
            
            <label class="payment-method-option">
              <input type="radio" name="paymentMethod" value="paypal">
              <div class="payment-method-card">
                <i class="fab fa-paypal"></i>
                <span>PayPal</span>
              </div>
            </label>
            
            <label class="payment-method-option">
              <input type="radio" name="paymentMethod" value="yape">
              <div class="payment-method-card">
                <i class="fas fa-mobile-alt"></i>
                <span>Yape</span>
              </div>
            </label>
            
            <label class="payment-method-option">
              <input type="radio" name="paymentMethod" value="plin">
              <div class="payment-method-card">
                <i class="fas fa-wallet"></i>
                <span>Plin</span>
              </div>
            </label>
          </div>
          
          <!-- Card Form (shown when card is selected) -->
          <div id="cardForm" class="card-form">
            <div class="form-group">
              <label>Número de Tarjeta</label>
              <input type="text" id="cardNumber" class="form-control" placeholder="1234 5678 9012 3456" maxlength="19">
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Fecha de Vencimiento</label>
                <input type="text" id="cardExpiry" class="form-control" placeholder="MM/AA" maxlength="5">
              </div>
              <div class="form-group">
                <label>CVV</label>
                <input type="text" id="cardCvv" class="form-control" placeholder="123" maxlength="4">
              </div>
            </div>
            <div class="form-group">
              <label>Nombre en la Tarjeta</label>
              <input type="text" id="cardName" class="form-control" placeholder="JUAN PEREZ">
            </div>
          </div>
          
          <!-- Digital Wallet Form (shown when yape/plin is selected) -->
          <div id="walletForm" class="wallet-form" style="display: none;">
            <div class="form-group">
              <label>Número de Celular</label>
              <input type="tel" id="phoneNumber" class="form-control" placeholder="999 999 999" maxlength="11">
            </div>
            <p class="text-muted small">
              <i class="fas fa-info-circle"></i> Recibirás una notificación en tu app para confirmar el pago.
            </p>
          </div>
          
          <!-- PayPal Form (shown when paypal is selected) -->
          <div id="paypalForm" class="paypal-form" style="display: none;">
            <div class="form-group">
              <label>Email de PayPal</label>
              <input type="email" id="paypalEmail" class="form-control" placeholder="tu@email.com">
            </div>
            <p class="text-muted small">
              <i class="fab fa-paypal"></i> Serás redirigido a PayPal para completar el pago de forma segura.
            </p>
            <div class="paypal-mock-badge">
              <i class="fas fa-shield-alt"></i> Modo de prueba - Pago simulado
            </div>
          </div>
        </div>
        
        <div class="checkout-summary">
          <h3>Resumen del Pedido</h3>
          <div id="checkoutItems">
            ${isPendingPayment ? '<div class="text-center"><div class="spinner"></div></div>' : ''}
          </div>
          <div class="summary-total">
            <span>Total a Pagar:</span>
            <span id="checkoutTotal">${Helpers.formatPrice(total)}</span>
          </div>
          
          <button id="payNowBtn" class="btn btn-primary btn-block mt-3">
            <i class="fas fa-lock"></i> Pagar Ahora
          </button>
          
          ${!isPendingPayment ? `
            <button id="payLaterBtn" class="btn btn-ghost btn-block mt-2">
              <i class="fas fa-clock"></i> Pagar Después
            </button>
          ` : ''}
          
          <p class="text-muted small text-center mt-3">
            <i class="fas fa-shield-alt"></i> Pago seguro y encriptado
          </p>
        </div>
      </div>
    `;
  },

  afterRender: async () => {
    const urlParams = new URLSearchParams(window.location.hash.split('?')[1] || '');
    const purchaseId = urlParams.get('purchaseId');
    const isPendingPayment = !!purchaseId;

    let cart = Storage.getCart();
    let total = 0;
    let pendingPurchase = null;

    if (isPendingPayment) {
      try {
        const response = await PurchaseService.getById(purchaseId);
        console.log('Pending purchase response:', response);

        pendingPurchase = response;

        if (!pendingPurchase || pendingPurchase.total === undefined) {

          const allPurchases = await PurchaseService.getHistory();
          pendingPurchase = allPurchases.find(p => p.id == purchaseId);
        }

        if (!pendingPurchase) {
          throw new Error('Compra no encontrada');
        }

        total = pendingPurchase.total || 0;
        document.getElementById('checkoutTotal').textContent = Helpers.formatPrice(total);

        const itemsContainer = document.getElementById('checkoutItems');
        if (pendingPurchase.items && pendingPurchase.items.length > 0) {
          itemsContainer.innerHTML = pendingPurchase.items.map(i => `
            <div class="checkout-item">
              <span>${i.quantity}x ${Helpers.escapeHtml(i.title || i.bookTitle || 'Libro')}</span>
              <span>${Helpers.formatPrice((i.price || 0) * (i.quantity || 1))}</span>
            </div>
          `).join('');
        } else {
          itemsContainer.innerHTML = '<p class="text-muted">Compra #' + purchaseId + ' - Total: ' + Helpers.formatPrice(total) + '</p>';
        }
      } catch (error) {
        console.error('Error loading pending purchase:', error);
        Toast.show('Error al cargar la compra', 'error');
        window.location.hash = '#/purchases';
        return;
      }
    } else {

      if (!cart || cart.length === 0) {
        Toast.show('Tu carrito está vacío', 'error');
        window.location.hash = '#/books';
        return;
      }

      total = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const itemsContainer = document.getElementById('checkoutItems');
      itemsContainer.innerHTML = cart.map(i => `
        <div class="checkout-item">
          <span>${i.quantity}x ${Helpers.escapeHtml(i.title)}</span>
          <span>${Helpers.formatPrice(i.price * i.quantity)}</span>
        </div>
      `).join('');
    }

    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const cardForm = document.getElementById('cardForm');
    const walletForm = document.getElementById('walletForm');
    const paypalForm = document.getElementById('paypalForm');

    paymentMethods.forEach(radio => {
      radio.addEventListener('change', (e) => {
        cardForm.style.display = 'none';
        walletForm.style.display = 'none';
        paypalForm.style.display = 'none';

        if (e.target.value === 'card') {
          cardForm.style.display = 'block';
        } else if (e.target.value === 'paypal') {
          paypalForm.style.display = 'block';
        } else {
          walletForm.style.display = 'block';
        }
      });
    });

    document.getElementById('payNowBtn').addEventListener('click', async () => {
      const payBtn = document.getElementById('payNowBtn');
      payBtn.disabled = true;
      payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

      try {

        await new Promise(resolve => setTimeout(resolve, 1500));

        if (isPendingPayment) {

          await PurchaseService.confirm(purchaseId);
        } else {

          const auth = Storage.getAuth();
          const purchaseData = {
            total: total,
            customerId: auth.user.id,
            items: cart.map(item => ({
              bookId: item.bookId,
              quantity: item.quantity,
              price: item.price
            }))
          };

          const newPurchase = await PurchaseService.create(purchaseData);

          await PurchaseService.confirm(newPurchase.id);
          Storage.clearCart();
          Navbar.refreshCartBadge();
        }

        Toast.show('¡Pago realizado con éxito!', 'success');
        window.location.hash = '#/purchases';

      } catch (error) {
        console.error('Error processing payment:', error);
        Toast.show(error.message || 'Error al procesar el pago', 'error');
        payBtn.disabled = false;
        payBtn.innerHTML = '<i class="fas fa-lock"></i> Pagar Ahora';
      }
    });

    const payLaterBtn = document.getElementById('payLaterBtn');
    if (payLaterBtn) {
      payLaterBtn.addEventListener('click', async () => {
        payLaterBtn.disabled = true;
        payLaterBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

        try {
          const auth = Storage.getAuth();
          const purchaseData = {
            total: total,
            customerId: auth.user.id,
            items: cart.map(item => ({
              bookId: item.bookId,
              quantity: item.quantity,
              price: item.price
            }))
          };

          await PurchaseService.create(purchaseData);
          Storage.clearCart();
          Navbar.refreshCartBadge();

          Toast.show('Compra registrada. Recuerda completar el pago.', 'info');
          window.location.hash = '#/purchases';

        } catch (error) {
          console.error('Error creating pending purchase:', error);
          Toast.show(error.message || 'Error al registrar la compra', 'error');
          payLaterBtn.disabled = false;
          payLaterBtn.innerHTML = '<i class="fas fa-clock"></i> Pagar Después';
        }
      });
    }

    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
      cardNumberInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
        value = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = value;
      });
    }

    const expiryInput = document.getElementById('cardExpiry');
    if (expiryInput) {
      expiryInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
          value = value.slice(0, 2) + '/' + value.slice(2);
        }
        e.target.value = value;
      });
    }
  }
};

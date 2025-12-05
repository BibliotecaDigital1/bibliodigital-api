const PurchasesView = {
  render: async () => {
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Mis Compras</h1>
        <button id="exportPdfBtn" class="btn btn-outline">
          <i class="fas fa-file-pdf"></i> Exportar PDF
        </button>
      </div>
      <div id="purchasesList" class="purchases-container"></div>
    `;
  },

  afterRender: async () => {
    const container = document.getElementById('purchasesList');

    if (!document.getElementById('purchases-styles')) {
      const styles = document.createElement('style');
      styles.id = 'purchases-styles';
      styles.textContent = `
        .purchases-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
          max-width: 900px;
        }

        .purchase-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          overflow: hidden;
          transition: all var(--transition-base);
        }

        .purchase-card:hover {
          transform: translateY(-2px);
          border-color: var(--primary);
          box-shadow: var(--shadow-glow);
        }

        .purchase-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: var(--bg-elevated);
          border-bottom: 1px solid var(--border-color);
        }

        .purchase-header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .purchase-icon {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          border-radius: var(--radius-md);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          color: white;
        }

        .purchase-info h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-primary);
        }

        .purchase-date {
          font-size: 13px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        .purchase-status {
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .purchase-status.paid {
          background: rgba(16, 185, 129, 0.15);
          color: var(--success);
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .purchase-status.pending {
          background: rgba(245, 158, 11, 0.15);
          color: var(--warning);
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .purchase-items {
          padding: 20px 24px;
        }

        .purchase-items-title {
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
        }

        .purchase-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .purchase-item:last-child {
          border-bottom: none;
        }

        .item-icon {
          width: 40px;
          height: 40px;
          background: var(--bg-elevated);
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          font-size: 16px;
        }

        .item-details {
          flex: 1;
        }

        .item-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
          margin-bottom: 2px;
        }

        .item-quantity {
          font-size: 12px;
          color: var(--text-muted);
        }

        .item-price {
          font-size: 14px;
          font-weight: 600;
          color: var(--primary-light);
        }

        .purchase-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          background: var(--bg-primary);
          border-top: 1px solid var(--border-color);
        }

        .purchase-total {
          display: flex;
          align-items: baseline;
          gap: 8px;
        }

        .total-label {
          font-size: 14px;
          color: var(--text-muted);
        }

        .total-amount {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .btn-pay {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-base);
          box-shadow: var(--shadow-glow);
        }

        .btn-pay:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(99, 102, 241, 0.4);
        }

        .empty-purchases {
          text-align: center;
          padding: 60px 20px;
          background: var(--bg-secondary);
          border-radius: var(--radius-lg);
          border: 1px dashed var(--border-color);
        }

        .empty-purchases i {
          font-size: 48px;
          color: var(--primary);
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .empty-purchases p {
          color: var(--text-muted);
          font-size: 16px;
          margin: 0;
        }
      `;
      document.head.appendChild(styles);
    }

    try {
      const purchases = await PurchaseService.getHistory();

      if (!purchases || purchases.length === 0) {
        container.innerHTML = `
          <div class="empty-purchases">
            <i class="fas fa-shopping-bag"></i>
            <p>No tienes compras registradas</p>
          </div>
        `;
        return;
      }

      container.innerHTML = purchases.map(p => {
        const isPending = p.paymentStatus !== 'PAID';
        const statusClass = isPending ? 'pending' : 'paid';
        const statusText = isPending ? 'Pendiente' : 'Pagado';
        const statusIcon = isPending ? 'fa-clock' : 'fa-check-circle';

        return `
        <div class="purchase-card">
          <div class="purchase-header">
            <div class="purchase-header-left">
              <div class="purchase-icon">
                <i class="fas fa-receipt"></i>
              </div>
              <div class="purchase-info">
                <h3>Compra #${p.id}</h3>
                <div class="purchase-date">
                  <i class="far fa-calendar-alt"></i> ${Helpers.formatDate(p.createdAt)}
                </div>
              </div>
            </div>
            <div class="purchase-status ${statusClass}">
              <i class="fas ${statusIcon}"></i> ${statusText}
            </div>
          </div>
          
          <div class="purchase-items">
            <div class="purchase-items-title">
              <i class="fas fa-book"></i> Libros comprados
            </div>
            ${p.items ? p.items.map(i => `
              <div class="purchase-item">
                <div class="item-icon">
                  <i class="fas fa-book-open"></i>
                </div>
                <div class="item-details">
                  <div class="item-title">${Helpers.escapeHtml(i.title || i.bookTitle || 'Libro')}</div>
                  <div class="item-quantity">Cantidad: ${i.quantity}</div>
                </div>
                <div class="item-price">${Helpers.formatPrice(i.price)}</div>
              </div>
            `).join('') : '<div class="purchase-item"><span>Sin detalles</span></div>'}
          </div>
          
          <div class="purchase-footer">
            <div class="purchase-total">
              <span class="total-label">Total:</span>
              <span class="total-amount">${Helpers.formatPrice(p.total)}</span>
            </div>
            ${isPending ? `
              <button class="btn-pay btn-pay-purchase" data-purchase-id="${p.id}">
                <i class="fas fa-credit-card"></i> Completar Pago
              </button>
            ` : `
              <span style="color: var(--success); font-size: 14px;">
                <i class="fas fa-check-circle"></i> Pago completado
              </span>
            `}
          </div>
        </div>
      `}).join('');

      container.querySelectorAll('.btn-pay-purchase').forEach(btn => {
        btn.addEventListener('click', () => {
          const purchaseId = btn.dataset.purchaseId;
          window.location.hash = `#/checkout?purchaseId=${purchaseId}`;
        });
      });

      document.getElementById('exportPdfBtn').addEventListener('click', () => {
        PurchasesView.exportToPdf(purchases);
      });

    } catch (error) {
      console.error('Error loading purchases:', error);
      container.innerHTML = `
        <div class="empty-purchases">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Error al cargar las compras. Intenta nuevamente.</p>
        </div>
      `;
    }
  },

  exportToPdf: (purchases) => {
    const auth = Storage.getAuth();
    const userName = auth?.user ? `${auth.user.firstName} ${auth.user.lastName}` : 'Usuario';
    const currentDate = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const totalPurchases = purchases.length;
    const totalPaid = purchases.filter(p => p.paymentStatus === 'PAID').reduce((sum, p) => sum + (p.total || 0), 0);
    const totalPending = purchases.filter(p => p.paymentStatus !== 'PAID').reduce((sum, p) => sum + (p.total || 0), 0);

    const pdfContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Historial de Compras - BiblioDigital</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
          .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #6366f1; padding-bottom: 20px; }
          .header h1 { color: #6366f1; font-size: 28px; margin-bottom: 8px; }
          .header .subtitle { color: #666; font-size: 14px; }
          .user-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
          .user-info p { margin: 5px 0; font-size: 14px; }
          .summary { display: flex; justify-content: space-around; margin-bottom: 30px; }
          .summary-item { text-align: center; padding: 15px 20px; background: #f0f0ff; border-radius: 8px; }
          .summary-item .value { font-size: 24px; font-weight: bold; color: #6366f1; }
          .summary-item .label { font-size: 12px; color: #666; margin-top: 5px; }
          .purchase { border: 1px solid #ddd; border-radius: 8px; margin-bottom: 20px; overflow: hidden; }
          .purchase-header { background: #f8f9fa; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #ddd; }
          .purchase-header h3 { font-size: 16px; color: #333; }
          .status { padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
          .status.paid { background: #d1fae5; color: #059669; }
          .status.pending { background: #fef3c7; color: #d97706; }
          .purchase-items { padding: 15px 20px; }
          .item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .item:last-child { border-bottom: none; }
          .item-title { font-size: 14px; }
          .item-price { font-weight: 600; color: #6366f1; }
          .purchase-footer { background: #f8f9fa; padding: 15px 20px; text-align: right; border-top: 1px solid #ddd; }
          .purchase-footer .total { font-size: 18px; font-weight: bold; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📚 BiblioDigital</h1>
          <p class="subtitle">Historial de Compras</p>
        </div>
        
        <div class="user-info">
          <p><strong>Cliente:</strong> ${Helpers.escapeHtml(userName)}</p>
          <p><strong>Fecha del reporte:</strong> ${currentDate}</p>
          <p><strong>Email:</strong> ${Helpers.escapeHtml(auth?.user?.email || 'N/A')}</p>
        </div>

        <div class="summary">
          <div class="summary-item">
            <div class="value">${totalPurchases}</div>
            <div class="label">Total Compras</div>
          </div>
          <div class="summary-item">
            <div class="value">${Helpers.formatPrice(totalPaid)}</div>
            <div class="label">Pagado</div>
          </div>
          <div class="summary-item">
            <div class="value">${Helpers.formatPrice(totalPending)}</div>
            <div class="label">Pendiente</div>
          </div>
        </div>

        ${purchases.map(p => {
      const statusClass = p.paymentStatus === 'PAID' ? 'paid' : 'pending';
      const statusText = p.paymentStatus === 'PAID' ? 'Pagado' : 'Pendiente';
      return `
            <div class="purchase">
              <div class="purchase-header">
                <h3>Compra #${p.id} - ${Helpers.formatDate(p.createdAt)}</h3>
                <span class="status ${statusClass}">${statusText}</span>
              </div>
              <div class="purchase-items">
                ${p.items ? p.items.map(i => `
                  <div class="item">
                    <span class="item-title">${Helpers.escapeHtml(i.title || i.bookTitle || 'Libro')} (x${i.quantity})</span>
                    <span class="item-price">${Helpers.formatPrice(i.price)}</span>
                  </div>
                `).join('') : '<p>Sin detalles</p>'}
              </div>
              <div class="purchase-footer">
                <span class="total">Total: ${Helpers.formatPrice(p.total)}</span>
              </div>
            </div>
          `;
    }).join('')}

        <div class="footer">
          <p>Reporte generado automáticamente por BiblioDigital</p>
          <p>© ${new Date().getFullYear()} BiblioDigital - Todos los derechos reservados</p>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    printWindow.document.write(pdfContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 250);

    Toast.show('Preparando reporte PDF...', 'info');
  }
};

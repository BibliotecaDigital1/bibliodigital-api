const CollectionsView = {
  render: async () => {
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Mis Colecciones</h1>
        <button class="btn btn-primary" id="createCollectionBtn"><i class="fas fa-plus"></i> Nueva</button>
      </div>
      <div id="collectionsGrid" class="collection-grid"></div>
    `;
  },

  afterRender: async () => {

    CollectionsView.createModalElement();

    const createBtn = document.getElementById('createCollectionBtn');
    if (createBtn) {
      createBtn.addEventListener('click', () => {
        console.log('Create collection button clicked');
        CollectionsView.openModal();
      });
    }

    await CollectionsView.loadCollections();
  },

  loadCollections: async () => {
    const container = document.getElementById('collectionsGrid');

    try {
      container.innerHTML = '<div class="text-center"><div class="spinner"></div></div>';

      const auth = Storage.getAuth();
      const userId = auth.user.id;

      console.log('Loading collections for user:', userId);
      const collections = await CollectionService.getUserCollections(userId);
      console.log('Collections received:', collections);

      if (!collections || collections.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No tienes colecciones. ¡Crea tu primera colección!</p></div>';
      } else {
        container.innerHTML = collections.map(c => `
          <div class="collection-card" onclick="window.location.hash='#/collection-detail?id=${c.id}'">
            <div class="collection-icon"><i class="fas fa-bookmark"></i></div>
            <div class="collection-info">
              <h3 class="collection-name">${Helpers.escapeHtml(c.name)}</h3>
              <p class="collection-meta">${c.bookCount || 0} libros</p>
            </div>
          </div>
        `).join('');
      }
    } catch (error) {
      console.error('Error loading collections:', error);
      container.innerHTML = '<div class="empty-state"><p>Error al cargar colecciones.</p></div>';
    }
  },

  createModalElement: () => {

    const existingModal = document.getElementById('createCollectionModal');
    if (existingModal) {
      existingModal.remove();
    }

    const modalHTML = `
      <div id="createCollectionModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 99999; align-items: center; justify-content: center;">
        <div id="modalBackdrop" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); z-index: 1;"></div>
        <div class="modal-content" style="position: relative; z-index: 2; background: #1e1e2e; border-radius: 12px; width: 90%; max-width: 600px; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column; box-shadow: 0 25px 50px rgba(0,0,0,0.5);">
          <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #444;">
            <h3 style="margin: 0; font-size: 18px; color: #fff;">Crear Nueva Colección</h3>
            <button class="btn-close" id="closeModalBtn" style="background: none; border: none; font-size: 28px; color: #888; cursor: pointer;">&times;</button>
          </div>
          <div class="modal-body" style="padding: 24px; overflow-y: auto; flex: 1;">
            <div class="form-group" style="margin-bottom: 20px;">
              <label for="collectionName" style="display: block; margin-bottom: 8px; color: #ccc;">Nombre de la Colección</label>
              <input type="text" id="collectionName" class="form-control" placeholder="Ej: Mis Favoritos" style="width: 100%; padding: 12px; border: 1px solid #444; border-radius: 8px; background: #2a2a3e; color: #fff; box-sizing: border-box;">
            </div>
            <div class="form-group">
              <label style="display: block; margin-bottom: 8px; color: #ccc;">Selecciona los libros (solo libros comprados y pagados)</label>
              <div id="paidBooksGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; max-height: 250px; overflow-y: auto; padding: 4px;">
                <div class="text-center"><div class="spinner"></div></div>
              </div>
            </div>
          </div>
          <div class="modal-footer" style="display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #444;">
            <button class="btn btn-ghost" id="cancelModalBtn" style="padding: 10px 20px; border: 1px solid #555; background: transparent; color: #ccc; border-radius: 8px; cursor: pointer;">Cancelar</button>
            <button class="btn btn-primary" id="saveCollectionBtn" style="padding: 10px 20px; background: #6366f1; color: #fff; border: none; border-radius: 8px; cursor: pointer;">Crear Colección</button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('closeModalBtn').addEventListener('click', () => CollectionsView.closeModal());
    document.getElementById('cancelModalBtn').addEventListener('click', () => CollectionsView.closeModal());
    document.getElementById('saveCollectionBtn').addEventListener('click', () => CollectionsView.saveCollection());
    document.getElementById('modalBackdrop').addEventListener('click', () => CollectionsView.closeModal());
  },

  openModal: async () => {
    console.log('Opening modal...');
    const modal = document.getElementById('createCollectionModal');
    const booksGrid = document.getElementById('paidBooksGrid');

    if (!modal) {
      console.error('Modal not found');
      return;
    }

    modal.style.display = 'flex';
    document.getElementById('collectionName').value = '';

    const saveBtn = document.getElementById('saveCollectionBtn');
    saveBtn.disabled = false;
    saveBtn.textContent = 'Crear Colección';

    try {
      booksGrid.innerHTML = '<div class="text-center"><div class="spinner"></div></div>';

      const purchases = await PurchaseService.getHistory();
      console.log('Purchases:', purchases);

      const paidPurchases = purchases.filter(p => p.paymentStatus === 'PAID');
      console.log('Paid purchases:', paidPurchases);

      const booksMap = new Map();

      paidPurchases.forEach(p => {
        if (p.items) {
          p.items.forEach(item => {
            const bookId = item.bookId;
            if (bookId && !booksMap.has(bookId)) {
              booksMap.set(bookId, {
                id: bookId,
                title: item.bookTitle || item.title || 'Libro',
                price: item.price
              });
            }
          });
        }
      });

      const paidBooks = Array.from(booksMap.values());
      console.log('Paid books:', paidBooks);

      if (paidBooks.length === 0) {
        booksGrid.innerHTML = '<div style="text-align: center; padding: 20px; color: #888;"><p>No tienes libros comprados y pagados para agregar.</p></div>';
        return;
      }

      booksGrid.innerHTML = paidBooks.map(book => `
        <label style="cursor: pointer;">
          <input type="checkbox" name="selectedBooks" value="${book.id}" style="display: none;">
          <div class="book-select-card" style="display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 16px; border: 2px solid #444; border-radius: 8px; background: #2a2a3e; text-align: center; transition: all 0.2s;">
            <i class="fas fa-book" style="font-size: 28px; color: #6366f1;"></i>
            <span style="font-size: 11px; color: #ccc; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; width: 100%;">${Helpers.escapeHtml(book.title)}</span>
          </div>
        </label>
      `).join('');

      booksGrid.querySelectorAll('label').forEach(label => {
        label.addEventListener('click', () => {
          const checkbox = label.querySelector('input[type="checkbox"]');
          const card = label.querySelector('.book-select-card');
          setTimeout(() => {
            if (checkbox.checked) {
              card.style.borderColor = '#6366f1';
              card.style.background = 'rgba(99, 102, 241, 0.2)';
            } else {
              card.style.borderColor = '#444';
              card.style.background = '#2a2a3e';
            }
          }, 10);
        });
      });

    } catch (error) {
      console.error('Error loading paid books:', error);
      booksGrid.innerHTML = '<div style="text-align: center; padding: 20px; color: #f00;"><p>Error al cargar libros.</p></div>';
    }
  },

  closeModal: () => {
    const modal = document.getElementById('createCollectionModal');
    if (modal) {
      modal.style.display = 'none';
    }
  },

  saveCollection: async () => {
    const saveBtn = document.getElementById('saveCollectionBtn');

    if (saveBtn.disabled) {
      return;
    }

    const name = document.getElementById('collectionName').value.trim();
    const selectedBooks = Array.from(document.querySelectorAll('input[name="selectedBooks"]:checked'))
      .map(cb => parseInt(cb.value));

    if (!name) {
      Toast.show('Ingresa un nombre para la colección', 'error');
      return;
    }

    if (selectedBooks.length === 0) {
      Toast.show('Selecciona al menos un libro', 'error');
      return;
    }

    saveBtn.disabled = true;
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando...';

    try {
      const auth = Storage.getAuth();
      const userId = auth.user.id;

      const collectionData = {
        name: name,
        customer: { id: userId }
      };

      console.log('Creating collection:', collectionData);
      const newCollection = await CollectionService.create(collectionData);
      console.log('Collection created:', newCollection);

      for (const bookId of selectedBooks) {
        console.log('Adding book', bookId, 'to collection', newCollection.id);
        await CollectionService.addBook(newCollection.id, bookId);
      }

      Toast.show('¡Colección creada exitosamente!', 'success');
      CollectionsView.closeModal();

      await CollectionsView.loadCollections();

    } catch (error) {
      console.error('Error creating collection:', error);
      Toast.show(error.message || 'Error al crear la colección', 'error');
      saveBtn.disabled = false;
      saveBtn.innerHTML = 'Crear Colección';
    }
  }
};

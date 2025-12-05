const BooksView = {
  render: async () => {
    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Explorar Catálogo</h1>
        <button class="btn btn-primary" onclick="window.location.hash='#/cart'">
          <i class="fas fa-shopping-cart"></i> Ver Carrito
        </button>
      </div>

      <div class="filters-section">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" id="searchInput" placeholder="Buscar libro o autor..." class="search-input">
        </div>
        <select id="categoryFilter" class="form-control" style="width: 200px;">
          <option value="">Todas las categorías</option>
          <!-- Categories will be loaded dynamically -->
        </select>
      </div>

      <div class="dashboard-section">
        <div id="booksGrid">
          <div class="text-center"><div class="spinner"></div></div>
        </div>
      </div>
    `;
  },

  afterRender: async () => {
    const grid = document.getElementById('booksGrid');
    const searchInput = document.getElementById('searchInput');
    const categoryFilter = document.getElementById('categoryFilter');

    let allBooks = [];
    let allCategories = [];

    try {

      [allBooks, allCategories] = await Promise.all([
        BookService.getAll(),
        CategoryService.getAll()
      ]);

      if (allCategories && allCategories.length > 0) {
        categoryFilter.innerHTML = '<option value="">Todas las categorías</option>' +
          allCategories.map(c => `<option value="${c.id}">${Helpers.escapeHtml(c.name)}</option>`).join('');
      }

    } catch (error) {
      console.error('Error loading books:', error);
      grid.innerHTML = '<div class="error-state"><p>Error al cargar los libros. Por favor intenta más tarde.</p></div>';
      return;
    }

    const renderBooks = () => {
      const search = searchInput.value.toLowerCase();
      const category = categoryFilter.value;

      const filtered = allBooks.filter(b => {
        const title = (b.title || '').toLowerCase();
        const authorName = (b.authorName || '').toLowerCase();
        const matchSearch = title.includes(search) || authorName.includes(search);
        const matchCat = !category || b.categoryId == category;
        return matchSearch && matchCat;
      });

      if (filtered.length === 0) {
        grid.innerHTML = '<div class="empty-state"><p>No se encontraron libros</p></div>';
        return;
      }

      grid.innerHTML = BookCard.renderGrid(filtered, {
        showActions: true,
        showCategory: true,
        actionType: 'cart'
      });

      BookCard.bindEvents(grid, {
        onAddToCart: (bookId) => {
          const book = allBooks.find(b => b.id == bookId);
          if (book) {
            addToCart(book);
          }
        },
        onFavorite: (bookId) => {
          Toast.show('Agregado a favoritos', 'success');
        }
      });
    };

    searchInput.addEventListener('input', renderBooks);
    categoryFilter.addEventListener('change', renderBooks);

    renderBooks();
  }
};

function addToCart(book) {
  const cart = Storage.getCart() || [];

  const existing = cart.find(i => i.bookId == book.id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      bookId: book.id,
      title: book.title,
      price: book.price,
      quantity: 1
    });
  }

  Storage.saveCart(cart);
  Toast.show('Agregado al carrito', 'success');
  if (typeof Navbar !== 'undefined' && Navbar.refreshCartBadge) {
    Navbar.refreshCartBadge();
  }
}

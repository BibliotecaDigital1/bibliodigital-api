const DashboardView = {
  render: async () => {
    const user = Storage.getAuth().user;
    const role = user.role.name;

    return `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Hola, ${user.firstName}</h1>
        <p class="text-muted">Bienvenido a tu panel de control</p>
      </div>
      
      <div id="dashboard-content">
        <!-- Role specific content loaded here -->
      </div>
    `;
  },

  afterRender: async () => {
    const user = Storage.getAuth().user;
    const role = user.role.name;
    const container = document.getElementById('dashboard-content');

    if (role === 'CUSTOMER') {
      renderCustomerStats(container, user.id);
    } else if (role === 'ADMIN') {
      renderAdminStats(container);
    } else if (role === 'AUTHOR') {
      renderAuthorStats(container, user);
    }
  }
};

async function renderCustomerStats(container, userId) {
  try {

    container.innerHTML = '<div class="text-center p-5"><div class="spinner"></div><p>Cargando panel...</p></div>';

    const [purchases, collections, recentBooks] = await Promise.all([
      PurchaseService.getHistory(),
      UserService.getCollections ? UserService.getCollections(userId) : Promise.resolve([]), // Fallback if not implemented
      BookService.getRecent()
    ]);

    container.innerHTML = `
      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon" style="background: #6366f1;"><i class="fas fa-shopping-bag"></i></div>
          <div class="stat-content">
            <div class="stat-value">${purchases ? purchases.length : 0}</div>
            <div class="stat-label">Compras</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon" style="background: #ec4899;"><i class="fas fa-bookmark"></i></div>
          <div class="stat-content">
            <div class="stat-value">${collections ? collections.length : 0}</div>
            <div class="stat-label">Colecciones</div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">Libros Recientes</h2>
          <p class="section-subtitle">Descubre las últimas incorporaciones a nuestra biblioteca digital</p>
        </div>
        ${BookCard.renderGrid(recentBooks, {
      showActions: true,
      showCategory: true,
      actionType: 'cart'
    })}
        <div style="text-align: center; margin-top: 2rem;">
          <a href="#/books" class="btn btn-outline">Ver Todos los Libros</a>
        </div>
      </div>
      
      <div class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">Acceso Rápido</h2>
        </div>
        <div class="quick-actions">
          <div class="action-card" onclick="window.location.hash='#/books'">
            <i class="fas fa-search"></i>
            <h3>Explorar Libros</h3>
          </div>
          <div class="action-card" onclick="window.location.hash='#/collections'">
            <i class="fas fa-layer-group"></i>
            <h3>Mis Colecciones</h3>
          </div>
        </div>
      </div>
    `;

    BookCard.bindEvents(container, {
      onAddToCart: (bookId) => {
        const book = recentBooks.find(b => b.id == bookId);
        if (book) {
          Storage.addToCart(book);
          Toast.show('Libro agregado al carrito', 'success');
        }
      },
      onFavorite: (bookId) => {
        Toast.show('Agregado a favoritos', 'success');
      }
    });

  } catch (error) {
    console.error('Error loading dashboard:', error);
    container.innerHTML = '<div class="error-state"><p>Error al cargar el panel. Por favor intenta más tarde.</p></div>';
  }
}

async function renderAdminStats(container) {
  try {
    container.innerHTML = '<div class="text-center p-5"><div class="spinner"></div><p>Cargando estadísticas...</p></div>';

    const [books, users, authors, sales] = await Promise.all([
      BookService.getAll(),
      HttpClient.get('/admin/users'),
      AuthorService.getAll(),
      HttpClient.get('/admin/reports/sales')
    ]);

    const booksCount = Array.isArray(books) ? books.length : 0;
    const usersCount = Array.isArray(users) ? users.length : 0;
    const authorsCount = Array.isArray(authors) ? authors.length : 0;

    const totalRevenue = Array.isArray(sales)
      ? sales.reduce((sum, sale) => sum + (sale.total || 0), 0)
      : 0;

    const formattedRevenue = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(totalRevenue);

    container.innerHTML = `
      <div class="dashboard-stats" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px;">
        <div class="stat-card">
          <div class="stat-icon" style="background: #6366f1;"><i class="fas fa-book"></i></div>
          <div class="stat-content">
            <div class="stat-value">${booksCount}</div>
            <div class="stat-label">Libros</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon" style="background: #10b981;"><i class="fas fa-users"></i></div>
          <div class="stat-content">
            <div class="stat-value">${usersCount}</div>
            <div class="stat-label">Usuarios</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #f59e0b;"><i class="fas fa-pen-nib"></i></div>
          <div class="stat-content">
            <div class="stat-value">${authorsCount}</div>
            <div class="stat-label">Autores</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon" style="background: #ec4899;"><i class="fas fa-dollar-sign"></i></div>
          <div class="stat-content">
            <div class="stat-value">${formattedRevenue}</div>
            <div class="stat-label">Ventas Totales</div>
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 24px; margin-top: 32px;">
        <div style="background: var(--bg-primary); padding: 24px; border-radius: 16px; border: 1px solid var(--border-color);">
            <h3 style="margin-bottom: 20px; font-size: 18px; font-weight: 600;">Ventas Recientes</h3>
            <canvas id="salesChart" height="300"></canvas>
        </div>
        <div style="background: var(--bg-primary); padding: 24px; border-radius: 16px; border: 1px solid var(--border-color);">
            <h3 style="margin-bottom: 20px; font-size: 18px; font-weight: 600;">Libros por Categoría</h3>
            <div style="height: 300px; display: flex; justify-content: center;">
                <canvas id="booksChart"></canvas>
            </div>
        </div>
      </div>
    `;

    const salesData = processSalesData(sales);
    const categoryData = processCategoryData(books);

    renderCharts(salesData, categoryData);

  } catch (error) {
    console.error('Error loading admin stats:', error);
    container.innerHTML = '<div class="error-state"><p>Error al cargar estadísticas.</p></div>';
  }
}

function processSalesData(sales) {
  if (!Array.isArray(sales)) return { labels: [], data: [] };

  const salesByDate = {};
  sales.forEach(sale => {
    const date = new Date(sale.purchaseDate).toLocaleDateString('es-CO', { month: 'short', day: 'numeric' });
    salesByDate[date] = (salesByDate[date] || 0) + sale.total;
  });

  return {
    labels: Object.keys(salesByDate),
    data: Object.values(salesByDate)
  };
}

function processCategoryData(books) {
  if (!Array.isArray(books)) return { labels: [], data: [] };

  const categories = {};
  books.forEach(book => {
    const cat = book.categoryName || 'Sin Categoría';
    categories[cat] = (categories[cat] || 0) + 1;
  });

  return {
    labels: Object.keys(categories),
    data: Object.values(categories)
  };
}

function renderCharts(salesData, categoryData) {

  const salesCtx = document.getElementById('salesChart').getContext('2d');
  new Chart(salesCtx, {
    type: 'line',
    data: {
      labels: salesData.labels,
      datasets: [{
        label: 'Ventas ($)',
        data: salesData.data,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        x: {
          grid: { display: false }
        }
      }
    }
  });

  const booksCtx = document.getElementById('booksChart').getContext('2d');
  new Chart(booksCtx, {
    type: 'doughnut',
    data: {
      labels: categoryData.labels,
      datasets: [{
        data: categoryData.data,
        backgroundColor: [
          '#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'
        ],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

async function renderAuthorStats(container, user) {
  try {

    container.innerHTML = `
      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon" style="background: #f59e0b;"><i class="fas fa-book-open"></i></div>
          <div class="stat-content">
            <div class="stat-value">-</div>
            <div class="stat-label">Libros Publicados</div>
          </div>
        </div>
      </div>
      <div class="alert alert-info mt-4">
        Funcionalidad de estadísticas de autor en desarrollo.
      </div>
    `;
  } catch (error) {
    console.error(error);
  }
}

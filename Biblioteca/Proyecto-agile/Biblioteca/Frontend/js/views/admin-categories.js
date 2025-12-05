const AdminCategoriesView = {
  render: async () => {
    return `
            <div class="dashboard-header">
                <h1 class="dashboard-title">Gestión de Categorías</h1>
                <button class="btn btn-primary" id="newCategoryBtn">
                    <i class="fas fa-plus"></i> Nueva Categoría
                </button>
            </div>
            
            <!-- Search/Filter Section (HU21) -->
            <div class="admin-filters">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchCategory" class="form-control" placeholder="Buscar categoría...">
                </div>
            </div>
            
            <div id="catTable"></div>
            
            <!-- Category Modal -->
            <div id="categoryModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; justify-content: center; align-items: center;">
                <div style="background: var(--bg-secondary); border-radius: 12px; max-width: 500px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.4);">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--border-color);">
                        <h3 style="margin: 0;" id="modalTitle">Nueva Categoría</h3>
                        <button id="closeModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-muted);">&times;</button>
                    </div>
                    <form id="categoryForm" style="padding: 24px;">
                        <input type="hidden" id="categoryId">
                        <div class="form-group">
                            <label class="form-label">Nombre *</label>
                            <input type="text" id="categoryName" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Descripción</label>
                            <textarea id="categoryDescription" class="form-control" rows="3"></textarea>
                        </div>
                        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
                            <button type="button" class="btn btn-ghost" id="cancelBtn">Cancelar</button>
                            <button type="submit" class="btn btn-primary" id="saveBtn">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
  },

  afterRender: async () => {

    if (!document.getElementById('admin-filters-styles')) {
      const styles = document.createElement('style');
      styles.id = 'admin-filters-styles';
      styles.textContent = `
                .admin-filters {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                }
                .search-box {
                    position: relative;
                    flex: 1;
                    max-width: 400px;
                }
                .search-box i {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-muted);
                }
                .search-box input {
                    padding-left: 40px;
                }
            `;
      document.head.appendChild(styles);
    }

    await AdminCategoriesView.loadCategories();

    AdminCategoriesView.bindEvents();
  },

  loadCategories: async (filter = '') => {
    const container = document.getElementById('catTable');
    try {
      container.innerHTML = '<div class="text-center"><div class="spinner"></div></div>';

      let categories = await CategoryService.getAll();

      if (filter) {
        const filterLower = filter.toLowerCase();
        categories = categories.filter(c =>
          c.name?.toLowerCase().includes(filterLower) ||
          c.description?.toLowerCase().includes(filterLower)
        );
      }

      if (!categories || categories.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No hay categorías</p></div>';
        return;
      }

      container.innerHTML = Table.render({
        columns: [
          { label: 'ID', key: 'id', width: '60px' },
          { label: 'Nombre', key: 'name' },
          { label: 'Descripción', key: 'description' }
        ],
        data: categories,
        actions: [
          { name: 'edit', icon: 'fas fa-edit', label: 'Editar' },
          { name: 'delete', icon: 'fas fa-trash', label: 'Eliminar', class: 'btn-danger' }
        ]
      });

      Table.bindEvents(container, {
        edit: (id) => AdminCategoriesView.openModal(id),
        delete: (id) => AdminCategoriesView.deleteCategory(id)
      });

    } catch (error) {
      console.error('Error loading categories:', error);
      container.innerHTML = '<div class="error-state"><p>Error al cargar categorías</p></div>';
    }
  },

  bindEvents: () => {
    const modal = document.getElementById('categoryModal');
    const form = document.getElementById('categoryForm');
    const searchInput = document.getElementById('searchCategory');

    document.getElementById('newCategoryBtn').addEventListener('click', () => {
      AdminCategoriesView.openModal();
    });

    document.getElementById('closeModal').addEventListener('click', () => {
      modal.style.display = 'none';
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
      modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await AdminCategoriesView.saveCategory();
    });

    let searchTimeout;
    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        AdminCategoriesView.loadCategories(e.target.value);
      }, 300);
    });
  },

  openModal: async (id = null) => {
    const modal = document.getElementById('categoryModal');
    const title = document.getElementById('modalTitle');
    const form = document.getElementById('categoryForm');

    form.reset();
    document.getElementById('categoryId').value = '';

    if (id) {
      title.textContent = 'Editar Categoría';
      try {
        const categories = await CategoryService.getAll();
        const category = categories.find(c => c.id == id);
        if (category) {
          document.getElementById('categoryId').value = category.id;
          document.getElementById('categoryName').value = category.name || '';
          document.getElementById('categoryDescription').value = category.description || '';
        }
      } catch (error) {
        Toast.show('Error al cargar categoría', 'error');
        return;
      }
    } else {
      title.textContent = 'Nueva Categoría';
    }

    modal.style.display = 'flex';
  },

  saveCategory: async () => {
    const id = document.getElementById('categoryId').value;
    const data = {
      name: document.getElementById('categoryName').value,
      description: document.getElementById('categoryDescription').value
    };

    try {
      if (id) {
        await CategoryService.update(id, data);
        Toast.show('Categoría actualizada', 'success');
      } else {
        await CategoryService.create(data);
        Toast.show('Categoría creada', 'success');
      }

      document.getElementById('categoryModal').style.display = 'none';
      await AdminCategoriesView.loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      Toast.show('Error al guardar categoría', 'error');
    }
  },

  deleteCategory: async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta categoría?')) return;

    try {
      await CategoryService.delete(id);
      Toast.show('Categoría eliminada', 'success');
      await AdminCategoriesView.loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      const message = error.message || 'Error al eliminar categoría';
      Toast.show(message, 'error');
    }
  }
};

const AdminAuthorsView = {
  render: async () => {
    return `
            <div class="dashboard-header">
                <h1 class="dashboard-title">Gestión de Autores</h1>
                <button class="btn btn-primary" id="newAuthorBtn">
                    <i class="fas fa-plus"></i> Nuevo Autor
                </button>
            </div>
            
            <!-- Search/Filter Section (HU24) -->
            <div class="admin-filters">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchAuthor" class="form-control" placeholder="Buscar por nombre...">
                </div>
            </div>
            
            <div id="authTable"></div>
            
            <!-- Author Modal -->
            <div id="authorModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; justify-content: center; align-items: center;">
                <div style="background: var(--bg-secondary); border-radius: 12px; max-width: 500px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.4);">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--border-color);">
                        <h3 style="margin: 0;" id="authorModalTitle">Nuevo Autor</h3>
                        <button id="closeAuthorModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-muted);">&times;</button>
                    </div>
                    <form id="authorForm" style="padding: 24px;">
                        <input type="hidden" id="authorId">
                        <div class="form-group">
                            <label class="form-label">Nombre *</label>
                            <input type="text" id="authorFirstName" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Apellido *</label>
                            <input type="text" id="authorLastName" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Biografía</label>
                            <textarea id="authorBio" class="form-control" rows="3"></textarea>
                        </div>
                        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
                            <button type="button" class="btn btn-ghost" id="cancelAuthorBtn">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
  },

  afterRender: async () => {
    await AdminAuthorsView.loadAuthors();
    AdminAuthorsView.bindEvents();
  },

  loadAuthors: async (nameFilter = '', nationalityFilter = '') => {
    const container = document.getElementById('authTable');
    try {
      container.innerHTML = '<div class="text-center"><div class="spinner"></div></div>';

      let authors = await AuthorService.getAll();

      if (nameFilter) {
        const filterLower = nameFilter.toLowerCase();
        authors = authors.filter(a =>
          a.firstName?.toLowerCase().includes(filterLower) ||
          a.lastName?.toLowerCase().includes(filterLower) ||
          a.bio?.toLowerCase().includes(filterLower)
        );
      }

      if (!authors || authors.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>No hay autores</p></div>';
        return;
      }

      container.innerHTML = Table.render({
        columns: [
          { label: 'ID', key: 'id', width: '60px' },
          { label: 'Nombre', key: 'firstName' },
          { label: 'Apellido', key: 'lastName' },
          { label: 'Biografía', key: 'bio' }
        ],
        data: authors,
        actions: [
          { name: 'edit', icon: 'fas fa-edit', label: 'Editar' },
          { name: 'delete', icon: 'fas fa-trash', label: 'Eliminar', class: 'btn-danger' }
        ]
      });

      Table.bindEvents(container, {
        edit: (id) => AdminAuthorsView.openModal(id),
        delete: (id) => AdminAuthorsView.deleteAuthor(id)
      });

    } catch (error) {
      console.error('Error loading authors:', error);
      container.innerHTML = '<div class="error-state"><p>Error al cargar autores</p></div>';
    }
  },

  bindEvents: () => {
    const modal = document.getElementById('authorModal');
    const form = document.getElementById('authorForm');
    const searchInput = document.getElementById('searchAuthor');

    document.getElementById('newAuthorBtn').addEventListener('click', () => {
      AdminAuthorsView.openModal();
    });

    document.getElementById('closeAuthorModal').addEventListener('click', () => {
      modal.style.display = 'none';
    });

    document.getElementById('cancelAuthorBtn').addEventListener('click', () => {
      modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await AdminAuthorsView.saveAuthor();
    });

    let searchTimeout;
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        AdminAuthorsView.loadAuthors(searchInput.value);
      }, 300);
    });
  },

  openModal: async (id = null) => {
    const modal = document.getElementById('authorModal');
    const title = document.getElementById('authorModalTitle');
    const form = document.getElementById('authorForm');

    form.reset();
    document.getElementById('authorId').value = '';

    if (id) {
      title.textContent = 'Editar Autor';
      try {
        const author = await AuthorService.getById(id);
        if (author) {
          document.getElementById('authorId').value = author.id;
          document.getElementById('authorFirstName').value = author.firstName || '';
          document.getElementById('authorLastName').value = author.lastName || '';
          document.getElementById('authorBio').value = author.bio || '';
        }
      } catch (error) {
        Toast.show('Error al cargar autor', 'error');
        return;
      }
    } else {
      title.textContent = 'Nuevo Autor';
    }

    modal.style.display = 'flex';
  },

  saveAuthor: async () => {
    const id = document.getElementById('authorId').value;
    const data = {
      firstName: document.getElementById('authorFirstName').value,
      lastName: document.getElementById('authorLastName').value,
      bio: document.getElementById('authorBio').value
    };

    try {
      if (id) {
        await AuthorService.update(id, data);
        Toast.show('Autor actualizado', 'success');
      } else {
        await AuthorService.create(data);
        Toast.show('Autor creado', 'success');
      }

      document.getElementById('authorModal').style.display = 'none';
      await AdminAuthorsView.loadAuthors();
    } catch (error) {
      console.error('Error saving author:', error);
      Toast.show('Error al guardar autor', 'error');
    }
  },

  deleteAuthor: async (id) => {
    if (!confirm('¿Estás seguro de eliminar este autor?')) return;

    try {
      await AuthorService.delete(id);
      Toast.show('Autor eliminado', 'success');
      await AdminAuthorsView.loadAuthors();
    } catch (error) {
      console.error('Error deleting author:', error);
      const message = error.message || 'Error al eliminar autor';
      Toast.show(message, 'error');
    }
  }
};

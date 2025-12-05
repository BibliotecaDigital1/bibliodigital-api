const AdminBooksView = {
    render: async () => {
        return `
            <div class="dashboard-header">
                <h1 class="dashboard-title">Gestión de Libros</h1>
                <div class="header-actions">
                    <button class="btn btn-outline" id="exportBooksBtn">
                        <i class="fas fa-file-export"></i> Exportar
                    </button>
                    <button class="btn btn-primary" id="newBookBtn">
                        <i class="fas fa-plus"></i> Nuevo Libro
                    </button>
                </div>
            </div>
            
            <!-- Filters Section (HU4) -->
            <div class="admin-filters">
                <div class="search-box">
                    <i class="fas fa-search"></i>
                    <input type="text" id="searchBook" class="form-control" placeholder="Buscar por título...">
                </div>
                <select id="filterCategory" class="form-control" style="max-width: 200px;">
                    <option value="">Todas las categorías</option>
                </select>
                <select id="filterAuthor" class="form-control" style="max-width: 200px;">
                    <option value="">Todos los autores</option>
                </select>
            </div>
            
            <div id="bookTableContainer"></div>
            
            <!-- Book Modal -->
            <div id="bookModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; justify-content: center; align-items: center; overflow-y: auto;">
                <div style="background: var(--bg-secondary); border-radius: 12px; max-width: 600px; width: 90%; margin: 40px auto; box-shadow: 0 20px 60px rgba(0,0,0,0.4);">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--border-color);">
                        <h3 style="margin: 0;" id="bookModalTitle">Nuevo Libro</h3>
                        <button id="closeBookModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-muted);">&times;</button>
                    </div>
                    <form id="bookForm" style="padding: 24px;">
                        <input type="hidden" id="bookId">
                        <div class="form-group">
                            <label class="form-label">Título *</label>
                            <input type="text" id="bookTitle" class="form-control" required>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="form-group">
                                <label class="form-label">Categoría *</label>
                                <select id="bookCategory" class="form-control" required></select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Autor *</label>
                                <select id="bookAuthor" class="form-control" required></select>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div class="form-group">
                                <label class="form-label">Precio *</label>
                                <input type="number" id="bookPrice" class="form-control" step="0.01" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Descripción</label>
                            <textarea id="bookDescription" class="form-control" rows="3"></textarea>
                        </div>
                        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px;">
                            <button type="button" class="btn btn-ghost" id="cancelBookBtn">Cancelar</button>
                            <button type="submit" class="btn btn-primary">Guardar</button>
                        </div>
                    </form>
                </div>
            </div>
            
            <!-- Export Modal -->
            <div id="exportBooksModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; justify-content: center; align-items: center;">
                <div style="background: var(--bg-secondary); border-radius: 12px; max-width: 400px; width: 90%; box-shadow: 0 20px 60px rgba(0,0,0,0.4);">
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--border-color);">
                        <h3 style="margin: 0;"><i class="fas fa-file-export"></i> Exportar Libros</h3>
                        <button id="closeExportBooksModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-muted);">&times;</button>
                    </div>
                    <div style="padding: 24px;">
                        <p style="margin-bottom: 16px; color: var(--text-secondary);">Exportar listado de libros:</p>
                        <button class="btn btn-primary btn-block" id="exportBooksCsvBtn">
                            <i class="fas fa-file-csv"></i> Exportar CSV
                        </button>
                        <button class="btn btn-outline btn-block" id="exportBooksPdfBtn" style="margin-top: 12px;">
                            <i class="fas fa-file-pdf"></i> Exportar PDF
                        </button>
                    </div>
                </div>
            </div>
        `;
    },

    afterRender: async () => {
        await AdminBooksView.loadFilters();
        await AdminBooksView.loadBooks();
        AdminBooksView.bindEvents();
    },

    loadFilters: async () => {
        try {

            const categories = await CategoryService.getAll();
            const catOptions = categories.map(c => `<option value="${c.id}">${Helpers.escapeHtml(c.name)}</option>`).join('');

            document.getElementById('filterCategory').innerHTML = '<option value="">Todas las categorías</option>' + catOptions;
            document.getElementById('bookCategory').innerHTML = '<option value="">Seleccionar...</option>' + catOptions;

            const authors = await AuthorService.getAll();
            const authOptions = authors.map(a => `<option value="${a.id}">${Helpers.escapeHtml(a.firstName + ' ' + a.lastName)}</option>`).join('');

            document.getElementById('filterAuthor').innerHTML = '<option value="">Todos los autores</option>' + authOptions;
            document.getElementById('bookAuthor').innerHTML = '<option value="">Seleccionar...</option>' + authOptions;
        } catch (error) {
            console.error('Error loading filters:', error);
        }
    },

    loadBooks: async () => {
        const container = document.getElementById('bookTableContainer');
        const titleFilter = document.getElementById('searchBook')?.value || '';
        const categoryFilter = document.getElementById('filterCategory')?.value || '';
        const authorFilter = document.getElementById('filterAuthor')?.value || '';

        try {
            container.innerHTML = '<div class="text-center"><div class="spinner"></div></div>';

            let books = await BookService.getAll();

            if (titleFilter) {
                const filterLower = titleFilter.toLowerCase();
                books = books.filter(b => b.title?.toLowerCase().includes(filterLower));
            }
            if (categoryFilter) {
                books = books.filter(b => b.categoryId == categoryFilter || b.categoryName?.toLowerCase().includes(categoryFilter.toLowerCase()));
            }
            if (authorFilter) {

                const selectedAuthorName = document.getElementById('filterAuthor')?.options[document.getElementById('filterAuthor')?.selectedIndex]?.text;
                if (selectedAuthorName && selectedAuthorName !== 'Todos los autores') {
                    books = books.filter(b => b.authorName === selectedAuthorName);
                }
            }

            AdminBooksView.currentBooks = books;

            if (!books || books.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>No hay libros</p></div>';
                return;
            }

            container.innerHTML = Table.render({
                columns: [
                    { label: 'ID', key: 'id', width: '50px' },
                    { label: 'Título', key: 'title' },
                    { label: 'Autor', key: 'authorName' },
                    { label: 'Categoría', key: 'categoryName' },
                    { label: 'Precio', key: 'price', type: 'price' }
                ],
                data: books,
                actions: [
                    { name: 'edit', icon: 'fas fa-edit', label: 'Editar' },
                    { name: 'delete', icon: 'fas fa-trash', label: 'Eliminar', class: 'btn-danger' }
                ]
            });

            Table.bindEvents(container, {
                edit: (id) => AdminBooksView.openModal(id),
                delete: (id) => AdminBooksView.deleteBook(id)
            });

        } catch (error) {
            console.error('Error loading books:', error);
            container.innerHTML = '<div class="error-state"><p>Error al cargar libros</p></div>';
        }
    },

    bindEvents: () => {
        const modal = document.getElementById('bookModal');
        const exportModal = document.getElementById('exportBooksModal');
        const form = document.getElementById('bookForm');

        document.getElementById('newBookBtn').addEventListener('click', () => {
            AdminBooksView.openModal();
        });

        document.getElementById('closeBookModal').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        document.getElementById('cancelBookBtn').addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await AdminBooksView.saveBook();
        });

        document.getElementById('exportBooksBtn').addEventListener('click', () => {
            exportModal.style.display = 'flex';
        });

        document.getElementById('closeExportBooksModal').addEventListener('click', () => {
            exportModal.style.display = 'none';
        });

        exportModal.addEventListener('click', (e) => {
            if (e.target === exportModal) exportModal.style.display = 'none';
        });

        document.getElementById('exportBooksCsvBtn').addEventListener('click', () => {
            AdminBooksView.exportToCsv();
            exportModal.style.display = 'none';
        });

        document.getElementById('exportBooksPdfBtn').addEventListener('click', () => {
            AdminBooksView.exportToPdf();
            exportModal.style.display = 'none';
        });

        let filterTimeout;
        const applyFilters = () => {
            clearTimeout(filterTimeout);
            filterTimeout = setTimeout(() => AdminBooksView.loadBooks(), 300);
        };

        document.getElementById('searchBook').addEventListener('input', applyFilters);
        document.getElementById('filterCategory').addEventListener('change', applyFilters);
        document.getElementById('filterAuthor').addEventListener('change', applyFilters);
    },

    openModal: async (id = null) => {
        const modal = document.getElementById('bookModal');
        const title = document.getElementById('bookModalTitle');
        const form = document.getElementById('bookForm');

        form.reset();
        document.getElementById('bookId').value = '';

        if (id) {
            title.textContent = 'Editar Libro';
            try {
                const book = await BookService.getById(id);
                if (book) {
                    document.getElementById('bookId').value = book.id;
                    document.getElementById('bookTitle').value = book.title || '';
                    document.getElementById('bookCategory').value = book.categoryId || '';
                    document.getElementById('bookAuthor').value = book.authorId || '';
                    document.getElementById('bookPrice').value = book.price || '';
                    document.getElementById('bookDescription').value = book.description || '';
                }
            } catch (error) {
                Toast.show('Error al cargar libro', 'error');
                return;
            }
        } else {
            title.textContent = 'Nuevo Libro';
        }

        modal.style.display = 'flex';
    },

    saveBook: async () => {
        const id = document.getElementById('bookId').value;
        const title = document.getElementById('bookTitle').value;

        const slug = title.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            + '-' + Date.now();

        const data = {
            title: title,
            slug: slug,
            categoryId: parseInt(document.getElementById('bookCategory').value),
            authorId: parseInt(document.getElementById('bookAuthor').value),
            price: parseFloat(document.getElementById('bookPrice').value),
            description: document.getElementById('bookDescription').value || 'Sin descripción'
        };

        try {
            if (id) {
                await BookService.update(id, data);
                Toast.show('Libro actualizado', 'success');
            } else {
                await BookService.create(data);
                Toast.show('Libro creado', 'success');
            }

            document.getElementById('bookModal').style.display = 'none';
            await AdminBooksView.loadBooks();
        } catch (error) {
            console.error('Error saving book:', error);
            Toast.show('Error al guardar libro', 'error');
        }
    },

    deleteBook: async (id) => {
        if (!confirm('¿Estás seguro de eliminar este libro?')) return;

        try {
            await BookService.delete(id);
            Toast.show('Libro eliminado', 'success');
            await AdminBooksView.loadBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
            const message = error.message || 'Error al eliminar libro';
            Toast.show(message, 'error');
        }
    },

    exportToCsv: () => {
        const books = AdminBooksView.currentBooks || [];
        let csv = 'ID,Título,Autor,Categoría,Precio\n';
        books.forEach(b => {
            csv += `${b.id},"${(b.title || '').replace(/"/g, '""')}","${(b.authorName || '').replace(/"/g, '""')}","${(b.categoryName || '').replace(/"/g, '""')}",${b.price || 0}\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'libros_reporte.csv';
        link.click();
        Toast.show('CSV exportado', 'success');
    },

    exportToPdf: () => {
        const books = AdminBooksView.currentBooks || [];
        const categoryFilter = document.getElementById('filterCategory');
        const categoryName = categoryFilter.options[categoryFilter.selectedIndex]?.text || 'Todas';

        const pdfContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Reporte de Libros - BiblioDigital</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #6366f1; padding-bottom: 20px; }
                    .header h1 { color: #6366f1; font-size: 24px; }
                    .info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 25px; }
                    .info p { margin: 4px 0; font-size: 13px; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; font-size: 12px; }
                    th { background: #6366f1; color: white; }
                    tr:nth-child(even) { background: #f9f9f9; }
                    .footer { text-align: center; margin-top: 30px; color: #999; font-size: 11px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>📚 Reporte de Libros</h1>
                    <p>BiblioDigital - Panel de Administración</p>
                </div>
                <div class="info">
                    <p><strong>Categoría:</strong> ${Helpers.escapeHtml(categoryName)}</p>
                    <p><strong>Total libros:</strong> ${books.length}</p>
                    <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
                </div>
                <table>
                    <thead><tr><th>ID</th><th>Título</th><th>Autor</th><th>Categoría</th><th>Precio</th></tr></thead>
                    <tbody>
                        ${books.map(b => `
                            <tr>
                                <td>${b.id}</td>
                                <td>${Helpers.escapeHtml(b.title)}</td>
                                <td>${Helpers.escapeHtml(b.authorName || '-')}</td>
                                <td>${Helpers.escapeHtml(b.categoryName || '-')}</td>
                                <td>${Helpers.formatPrice(b.price)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="footer"><p>Generado por BiblioDigital - ${new Date().getFullYear()}</p></div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(pdfContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 250);
        Toast.show('Preparando PDF...', 'info');
    }
};

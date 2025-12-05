const CollectionDetailView = {
    render: async () => {
        return `
      <div class="dashboard-header">
        <h1 class="dashboard-title" id="colTitle">Detalle</h1>
        <div class="header-actions">
          <button class="btn btn-outline" id="shareCollectionBtn">
            <i class="fas fa-share-alt"></i> Compartir
          </button>
          <button class="btn btn-outline" id="exportCollectionBtn">
            <i class="fas fa-file-export"></i> Exportar
          </button>
          <button class="btn btn-outline" onclick="window.history.back()">Volver</button>
        </div>
      </div>
      
      <!-- Filters Section (HU33) -->
      <div class="collection-filters" id="collectionFilters">
        <div class="filter-group">
          <label><i class="fas fa-filter"></i> Filtrar por:</label>
          <select id="filterCategory" class="form-control form-control-sm">
            <option value="">Todas las categorías</option>
          </select>
          <select id="filterAuthor" class="form-control form-control-sm">
            <option value="">Todos los autores</option>
          </select>
          <button class="btn btn-sm btn-ghost" id="clearFiltersBtn">
            <i class="fas fa-times"></i> Limpiar
          </button>
        </div>
      </div>
      
      <div id="colBooks"></div>
      
      <!-- Export Modal (HU34) -->
      <div id="exportModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; justify-content: center; align-items: center;">
        <div style="background: var(--bg-secondary); border-radius: 12px; max-width: 400px; width: 90%; padding: 0; box-shadow: 0 20px 60px rgba(0,0,0,0.4);">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--border-color);">
            <h3 style="margin: 0; color: var(--text-primary);">Exportar Colección</h3>
            <button id="closeExportModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-muted);">&times;</button>
          </div>
          <div style="padding: 24px;">
            <p style="margin-bottom: 16px; color: var(--text-secondary);">Selecciona el formato de exportación:</p>
            <div>
              <button class="btn btn-primary btn-block" id="exportCsvBtn">
                <i class="fas fa-file-csv"></i> Exportar como CSV
              </button>
              <button class="btn btn-outline btn-block" id="exportPdfColBtn" style="margin-top: 12px;">
                <i class="fas fa-file-pdf"></i> Exportar como PDF
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Share Modal (HU35) -->
      <div id="shareModal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); z-index: 9999; justify-content: center; align-items: center;">
        <div style="background: var(--bg-secondary); border-radius: 12px; max-width: 450px; width: 90%; padding: 0; box-shadow: 0 20px 60px rgba(0,0,0,0.4);">
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid var(--border-color);">
            <h3 style="margin: 0; color: var(--text-primary);"><i class="fas fa-share-alt"></i> Compartir Colección</h3>
            <button id="closeShareModal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: var(--text-muted);">&times;</button>
          </div>
          <div style="padding: 24px;">
            <p style="margin-bottom: 16px; color: var(--text-secondary);">Comparte tu colección con otros usuarios:</p>
            
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; font-weight: 500;">Enlace para compartir:</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="shareLink" class="form-control" readonly style="flex: 1;">
                <button class="btn btn-primary" id="copyLinkBtn">
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
            
            <div style="border-top: 1px solid var(--border-color); padding-top: 16px;">
              <p style="margin-bottom: 12px; font-size: 14px; color: var(--text-muted);">O comparte en redes sociales:</p>
              <div style="display: flex; gap: 12px; justify-content: center;">
                <button class="btn btn-outline" id="shareWhatsapp" style="flex: 1;">
                  <i class="fab fa-whatsapp"></i> WhatsApp
                </button>
                <button class="btn btn-outline" id="shareTwitter" style="flex: 1;">
                  <i class="fab fa-twitter"></i> Twitter
                </button>
                <button class="btn btn-outline" id="shareEmail" style="flex: 1;">
                  <i class="fas fa-envelope"></i> Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    },

    afterRender: async () => {
        const hash = window.location.hash;
        const id = hash.split('=')[1];
        const container = document.getElementById('colBooks');

        CollectionDetailView.allBooks = [];
        CollectionDetailView.collectionId = id;

        if (!id) {
            document.getElementById('colTitle').textContent = 'Error: ID no especificado';
            return;
        }

        if (!document.getElementById('collection-detail-styles')) {
            const styles = document.createElement('style');
            styles.id = 'collection-detail-styles';
            styles.textContent = `
                .collection-book-card {
                    position: relative;
                }
                .collection-book-card .remove-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(239, 68, 68, 0.9);
                    border: none;
                    color: white;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    transition: all 0.2s ease;
                    z-index: 10;
                }
                .collection-book-card:hover .remove-btn {
                    opacity: 1;
                }
                .collection-book-card .remove-btn:hover {
                    background: rgba(239, 68, 68, 1);
                    transform: scale(1.1);
                }
                .collection-filters {
                    background: var(--bg-secondary);
                    padding: 16px 20px;
                    border-radius: var(--radius-md);
                    margin-bottom: 24px;
                    border: 1px solid var(--border-color);
                }
                .filter-group {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    flex-wrap: wrap;
                }
                .filter-group label {
                    font-weight: 500;
                    color: var(--text-muted);
                    font-size: 14px;
                }
                .filter-group select {
                    min-width: 180px;
                }
                .header-actions {
                    display: flex;
                    gap: 10px;
                }
                .export-options {
                    margin-top: 16px;
                }
            `;
            document.head.appendChild(styles);
        }

        try {
            container.innerHTML = '<div class="text-center"><div class="spinner"></div></div>';

            const collection = await CollectionService.getById(id);

            if (!collection) {
                document.getElementById('colTitle').textContent = 'Colección no encontrada';
                container.innerHTML = '<div class="empty-state"><p>No se encontró la colección</p></div>';
                document.getElementById('collectionFilters').style.display = 'none';
                return;
            }

            document.getElementById('colTitle').textContent = collection.name;
            CollectionDetailView.collectionName = collection.name;

            let books = collection.books;

            if (!books || books.length === 0) {
                try {
                    books = await CollectionService.getBooks(id);
                } catch (e) {
                    console.warn("Could not fetch books separately", e);
                    books = [];
                }
            }

            if (!books || books.length === 0) {
                container.innerHTML = '<div class="empty-state"><p>Esta colección está vacía</p></div>';
                document.getElementById('collectionFilters').style.display = 'none';
                return;
            }

            CollectionDetailView.allBooks = books;

            CollectionDetailView.populateFilters(books);

            CollectionDetailView.renderBooks(books);

            CollectionDetailView.bindFilterEvents();

            CollectionDetailView.bindExportEvents();

            CollectionDetailView.bindShareEvents();

        } catch (error) {
            console.error('Error loading collection details:', error);
            document.getElementById('colTitle').textContent = 'Error';
            container.innerHTML = '<div class="error-state"><p>Error al cargar los detalles de la colección.</p></div>';
        }
    },

    populateFilters: (books) => {
        const categorySelect = document.getElementById('filterCategory');
        const authorSelect = document.getElementById('filterAuthor');

        const categories = [...new Set(books.map(b => b.categoryName).filter(Boolean))].sort();
        const authors = [...new Set(books.map(b => b.authorName).filter(Boolean))].sort();

        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat;
            option.textContent = cat;
            categorySelect.appendChild(option);
        });

        authors.forEach(author => {
            const option = document.createElement('option');
            option.value = author;
            option.textContent = author;
            authorSelect.appendChild(option);
        });
    },

    bindFilterEvents: () => {
        const categorySelect = document.getElementById('filterCategory');
        const authorSelect = document.getElementById('filterAuthor');
        const clearBtn = document.getElementById('clearFiltersBtn');

        const applyFilters = () => {
            const categoryFilter = categorySelect.value;
            const authorFilter = authorSelect.value;

            let filteredBooks = CollectionDetailView.allBooks;

            if (categoryFilter) {
                filteredBooks = filteredBooks.filter(b => b.categoryName === categoryFilter);
            }
            if (authorFilter) {
                filteredBooks = filteredBooks.filter(b => b.authorName === authorFilter);
            }

            CollectionDetailView.renderBooks(filteredBooks);
        };

        categorySelect.addEventListener('change', applyFilters);
        authorSelect.addEventListener('change', applyFilters);

        clearBtn.addEventListener('click', () => {
            categorySelect.value = '';
            authorSelect.value = '';
            CollectionDetailView.renderBooks(CollectionDetailView.allBooks);
        });
    },

    bindExportEvents: () => {
        const exportBtn = document.getElementById('exportCollectionBtn');
        const modal = document.getElementById('exportModal');
        const closeBtn = document.getElementById('closeExportModal');
        const csvBtn = document.getElementById('exportCsvBtn');
        const pdfBtn = document.getElementById('exportPdfColBtn');

        exportBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        csvBtn.addEventListener('click', () => {
            CollectionDetailView.exportToCsv();
            modal.style.display = 'none';
        });

        pdfBtn.addEventListener('click', () => {
            CollectionDetailView.exportToPdf();
            modal.style.display = 'none';
        });
    },

    bindShareEvents: () => {
        const shareBtn = document.getElementById('shareCollectionBtn');
        const modal = document.getElementById('shareModal');
        const closeBtn = document.getElementById('closeShareModal');
        const shareLinkInput = document.getElementById('shareLink');
        const copyBtn = document.getElementById('copyLinkBtn');
        const whatsappBtn = document.getElementById('shareWhatsapp');
        const twitterBtn = document.getElementById('shareTwitter');
        const emailBtn = document.getElementById('shareEmail');

        const shareUrl = window.location.href;
        const collectionName = CollectionDetailView.collectionName || 'Mi Colección';
        const shareText = `¡Mira mi colección "${collectionName}" en BiblioDigital!`;

        shareBtn.addEventListener('click', () => {
            shareLinkInput.value = shareUrl;
            modal.style.display = 'flex';
        });

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        copyBtn.addEventListener('click', () => {
            shareLinkInput.select();
            navigator.clipboard.writeText(shareUrl).then(() => {
                Toast.show('Enlace copiado al portapapeles', 'success');
            }).catch(() => {
                document.execCommand('copy');
                Toast.show('Enlace copiado', 'success');
            });
        });

        whatsappBtn.addEventListener('click', () => {
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
            window.open(whatsappUrl, '_blank');
        });

        twitterBtn.addEventListener('click', () => {
            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
            window.open(twitterUrl, '_blank');
        });

        emailBtn.addEventListener('click', () => {
            const subject = encodeURIComponent(`Colección: ${collectionName}`);
            const body = encodeURIComponent(`${shareText}\n\nEnlace: ${shareUrl}`);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        });
    },

    renderBooks: (books) => {
        const container = document.getElementById('colBooks');
        const id = CollectionDetailView.collectionId;

        if (!books || books.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No hay libros que coincidan con los filtros</p></div>';
            return;
        }

        container.innerHTML = `
            <div class="books-grid">
                ${books.map(book => {
            const coverUrl = book.coverPath
                ? `http://localhost:8080/api/v1/media/${book.coverPath}`
                : 'assets/images/placeholder-book.png';
            const authorName = book.authorName || 'Autor desconocido';

            return `
                        <div class="book-card collection-book-card" data-book-id="${book.id}">
                            <button class="remove-btn" data-book-id="${book.id}" title="Eliminar de la colección">
                                <i class="fas fa-times"></i>
                            </button>
                            <div class="book-card-image">
                                <img src="${coverUrl}" alt="${Helpers.escapeHtml(book.title)}" loading="lazy" 
                                     onerror="this.onerror=null; this.src='assets/images/placeholder-book.png';">
                            </div>
                            <div class="book-card-content">
                                ${book.categoryName ? `<span class="book-card-category">${Helpers.escapeHtml(book.categoryName)}</span>` : ''}
                                <h3 class="book-card-title" title="${Helpers.escapeHtml(book.title)}">
                                    ${Helpers.escapeHtml(book.title)}
                                </h3>
                                <p class="book-card-author">${Helpers.escapeHtml(authorName)}</p>
                            </div>
                        </div>
                    `;
        }).join('')}
            </div>
        `;

        container.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const bookId = btn.dataset.bookId;

                if (confirm('¿Estás seguro de eliminar este libro de la colección?')) {
                    try {
                        await CollectionService.removeBook(id, bookId);
                        Toast.show('Libro eliminado de la colección', 'success');
                        CollectionDetailView.afterRender();
                    } catch (error) {
                        console.error('Error removing book:', error);
                        Toast.show('Error al eliminar el libro', 'error');
                    }
                }
            });
        });
    },

    exportToCsv: () => {
        const books = CollectionDetailView.allBooks;
        const collectionName = CollectionDetailView.collectionName || 'Coleccion';

        let csv = 'Título,Autor,Categoría\n';
        books.forEach(book => {
            const title = (book.title || '').replace(/"/g, '""');
            const author = (book.authorName || 'Desconocido').replace(/"/g, '""');
            const category = (book.categoryName || 'Sin categoría').replace(/"/g, '""');
            csv += `"${title}","${author}","${category}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${collectionName.replace(/[^a-z0-9]/gi, '_')}_libros.csv`;
        link.click();

        Toast.show('Colección exportada como CSV', 'success');
    },

    exportToPdf: () => {
        const books = CollectionDetailView.allBooks;
        const collectionName = CollectionDetailView.collectionName || 'Mi Colección';
        const auth = Storage.getAuth();
        const userName = auth?.user ? `${auth.user.firstName} ${auth.user.lastName}` : 'Usuario';
        const currentDate = new Date().toLocaleDateString('es-ES', {
            year: 'numeric', month: 'long', day: 'numeric'
        });

        const pdfContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${Helpers.escapeHtml(collectionName)} - BiblioDigital</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #6366f1; padding-bottom: 20px; }
                    .header h1 { color: #6366f1; font-size: 24px; margin-bottom: 8px; }
                    .header .subtitle { color: #666; font-size: 14px; }
                    .info { background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 25px; }
                    .info p { margin: 4px 0; font-size: 13px; }
                    .books-table { width: 100%; border-collapse: collapse; }
                    .books-table th, .books-table td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
                    .books-table th { background: #6366f1; color: white; font-size: 12px; text-transform: uppercase; }
                    .books-table tr:nth-child(even) { background: #f9f9f9; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; color: #999; font-size: 11px; }
                    @media print { body { padding: 15px; } }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>📚 ${Helpers.escapeHtml(collectionName)}</h1>
                    <p class="subtitle">Colección de BiblioDigital</p>
                </div>
                
                <div class="info">
                    <p><strong>Propietario:</strong> ${Helpers.escapeHtml(userName)}</p>
                    <p><strong>Fecha:</strong> ${currentDate}</p>
                    <p><strong>Total de libros:</strong> ${books.length}</p>
                </div>

                <table class="books-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Título</th>
                            <th>Autor</th>
                            <th>Categoría</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${books.map((book, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td>${Helpers.escapeHtml(book.title)}</td>
                                <td>${Helpers.escapeHtml(book.authorName || 'Desconocido')}</td>
                                <td>${Helpers.escapeHtml(book.categoryName || 'Sin categoría')}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div class="footer">
                    <p>Generado por BiblioDigital - ${new Date().getFullYear()}</p>
                </div>
            </body>
            </html>
        `;

        const printWindow = window.open('', '_blank');
        printWindow.document.write(pdfContent);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 250);

        Toast.show('Preparando PDF de la colección...', 'info');
    }
};

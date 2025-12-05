const MyBooksView = {
    render: async () => {
        return `
            <div class="dashboard-header">
                <h1 class="dashboard-title">Mis Libros</h1>
                <p class="text-muted">Todos los libros que has comprado</p>
            </div>
            
            <div id="myBooksContent"></div>
        `;
    },

    afterRender: async () => {
        const container = document.getElementById('myBooksContent');

        if (!document.getElementById('my-books-styles')) {
            const styles = document.createElement('style');
            styles.id = 'my-books-styles';
            styles.textContent = `
                .my-books-stats {
                    display: flex;
                    gap: 16px;
                    margin-bottom: 24px;
                }
                .my-books-stat {
                    background: var(--bg-secondary);
                    padding: 16px 24px;
                    border-radius: var(--radius-md);
                    border: 1px solid var(--border-color);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .my-books-stat i {
                    font-size: 24px;
                    color: var(--primary);
                }
                .my-books-stat .stat-info .value {
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--text-primary);
                }
                .my-books-stat .stat-info .label {
                    font-size: 12px;
                    color: var(--text-muted);
                }
            `;
            document.head.appendChild(styles);
        }

        try {
            container.innerHTML = '<div class="text-center"><div class="spinner"></div></div>';

            const purchases = await PurchaseService.getHistory();

            const paidPurchases = purchases.filter(p => p.paymentStatus === 'PAID');
            const booksMap = new Map();

            paidPurchases.forEach(purchase => {
                if (purchase.items) {
                    purchase.items.forEach(item => {
                        if (!booksMap.has(item.bookId)) {
                            booksMap.set(item.bookId, {
                                id: item.bookId,
                                title: item.title || item.bookTitle || 'Libro',
                                price: item.price,
                                purchaseDate: purchase.createdAt,

                            });
                        }
                    });
                }
            });

            const ownedBooks = Array.from(booksMap.values());

            if (ownedBooks.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-book-open" style="font-size: 48px; color: var(--primary); opacity: 0.5; margin-bottom: 16px;"></i>
                        <p>Aún no tienes libros comprados</p>
                        <a href="#/books" class="btn btn-primary mt-3">Explorar Libros</a>
                    </div>
                `;
                return;
            }

            const bookDetailsPromises = ownedBooks.map(async (book) => {
                try {
                    const details = await BookService.getById(book.id);
                    return { ...book, ...details };
                } catch (e) {
                    console.warn(`Could not fetch details for book ${book.id}`);
                    return book;
                }
            });

            const booksWithDetails = await Promise.all(bookDetailsPromises);

            container.innerHTML = `
                <div class="my-books-stats">
                    <div class="my-books-stat">
                        <i class="fas fa-book"></i>
                        <div class="stat-info">
                            <div class="value">${ownedBooks.length}</div>
                            <div class="label">Libros en tu biblioteca</div>
                        </div>
                    </div>
                    <div class="my-books-stat">
                        <i class="fas fa-shopping-bag"></i>
                        <div class="stat-info">
                            <div class="value">${paidPurchases.length}</div>
                            <div class="label">Compras realizadas</div>
                        </div>
                    </div>
                </div>
                
                <div class="books-grid">
                    ${booksWithDetails.map(book => {
                const coverUrl = book.coverPath
                    ? `http://localhost:8080/api/v1/media/${book.coverPath}`
                    : 'assets/images/placeholder-book.png';
                const authorName = book.authorName || 'Autor desconocido';

                return `
                            <div class="book-card">
                                <div class="book-card-image">
                                    <img src="${coverUrl}" alt="${Helpers.escapeHtml(book.title)}" loading="lazy" 
                                         onerror="this.onerror=null; this.src='assets/images/placeholder-book.png';">
                                    <span class="book-card-badge" style="background: var(--success);">
                                        <i class="fas fa-check"></i> Comprado
                                    </span>
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

        } catch (error) {
            console.error('Error loading my books:', error);
            container.innerHTML = `
                <div class="error-state">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Error al cargar tus libros. Intenta nuevamente.</p>
                </div>
            `;
        }
    }
};

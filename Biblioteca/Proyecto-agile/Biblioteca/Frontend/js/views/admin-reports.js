const AdminReportsView = {
    render: async () => {
        return `
            <div class="dashboard-header">
                <h1 class="dashboard-title">Reportes y Estadísticas</h1>
            </div>
            
            <div class="report-tabs" id="reportTabs">
                <button class="report-tab active" data-tab="books">
                    <i class="fas fa-book"></i> Libros por Autor
                </button>
                <button class="report-tab" data-tab="sales">
                    <i class="fas fa-chart-line"></i> Ventas
                </button>
            </div>
            
            <div id="booksReport" class="report-section">
                <div class="report-card">
                    <div class="report-header">
                        <h3><i class="fas fa-user-edit"></i> Libros Agrupados por Autor</h3>
                        <div class="export-buttons">
                            <button class="btn btn-outline btn-sm" id="exportBooksAuthorPdf">
                                <i class="fas fa-file-pdf"></i> PDF
                            </button>
                            <button class="btn btn-success btn-sm" id="exportBooksAuthorExcel">
                                <i class="fas fa-file-excel"></i> Excel
                            </button>
                        </div>
                    </div>
                    <div id="booksByAuthorContent"></div>
                </div>
            </div>
            
            <div id="salesReport" class="report-section" style="display: none;">
                <div class="report-card">
                    <div class="report-header">
                        <h3><i class="fas fa-chart-bar"></i> Reporte de Ventas</h3>
                        <div class="export-buttons">
                            <button class="btn btn-outline btn-sm" id="exportSalesPdf">
                                <i class="fas fa-file-pdf"></i> PDF
                            </button>
                            <button class="btn btn-success btn-sm" id="exportSalesExcel">
                                <i class="fas fa-file-excel"></i> Excel
                            </button>
                        </div>
                    </div>
                    <div class="report-filters">
                        <div class="filter-group">
                            <label>Desde:</label>
                            <input type="date" id="salesDateFrom" class="form-control">
                        </div>
                        <div class="filter-group">
                            <label>Hasta:</label>
                            <input type="date" id="salesDateTo" class="form-control">
                        </div>
                        <button class="btn btn-primary" id="applySalesFilter">
                            <i class="fas fa-filter"></i> Filtrar
                        </button>
                    </div>
                    <div id="salesContent"></div>
                </div>
            </div>
        `;
    },

    afterRender: async () => {
        if (!document.getElementById('admin-reports-styles')) {
            const styles = document.createElement('style');
            styles.id = 'admin-reports-styles';
            styles.textContent = `
                .report-tabs { display: flex; gap: 8px; margin-bottom: 24px; border-bottom: 2px solid var(--border-color); padding-bottom: 12px; }
                .report-tab { padding: 10px 20px; background: transparent; border: none; color: var(--text-muted); cursor: pointer; font-size: 14px; font-weight: 500; transition: all 0.2s; }
                .report-tab:hover { color: var(--text-primary); background: var(--bg-secondary); }
                .report-tab.active { color: var(--primary); background: var(--bg-secondary); border-bottom: 2px solid var(--primary); margin-bottom: -14px; }
                .report-card { background: var(--bg-secondary); border-radius: var(--radius-lg); padding: 24px; border: 1px solid var(--border-color); }
                .report-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
                .report-header h3 { margin: 0; font-size: 18px; }
                .export-buttons { display: flex; gap: 8px; }
                .btn-success { background: #22c55e; color: white; }
                .btn-success:hover { background: #16a34a; }
                .report-filters { display: flex; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; align-items: flex-end; }
                .filter-group { display: flex; flex-direction: column; gap: 4px; }
                .filter-group label { font-size: 12px; color: var(--text-muted); }
                .filter-group input { width: 150px; }
                .author-group { margin-bottom: 24px; padding: 16px; background: var(--bg-primary); border-radius: var(--radius-md); border: 1px solid var(--border-color); }
                .author-group h4 { color: var(--primary); margin-bottom: 12px; font-size: 16px; }
                .author-books-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; }
                .author-book-item { padding: 12px; background: var(--bg-secondary); border-radius: var(--radius-sm); font-size: 14px; }
                .sales-summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
                .sales-stat { background: var(--bg-primary); padding: 20px; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--border-color); }
                .sales-stat .value { font-size: 28px; font-weight: 700; color: var(--primary); }
                .sales-stat .label { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
            `;
            document.head.appendChild(styles);
        }

        const today = new Date();
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        document.getElementById('salesDateFrom').value = monthAgo.toISOString().split('T')[0];
        document.getElementById('salesDateTo').value = today.toISOString().split('T')[0];

        await AdminReportsView.loadBooksByAuthor();
        AdminReportsView.bindEvents();
    },

    bindEvents: () => {
        document.querySelectorAll('.report-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.report-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const tabId = tab.dataset.tab;
                document.getElementById('booksReport').style.display = tabId === 'books' ? 'block' : 'none';
                document.getElementById('salesReport').style.display = tabId === 'sales' ? 'block' : 'none';
                if (tabId === 'sales') AdminReportsView.loadSalesReport();
            });
        });

        document.getElementById('applySalesFilter').addEventListener('click', () => AdminReportsView.loadSalesReport());
        document.getElementById('exportBooksAuthorPdf').addEventListener('click', () => AdminReportsView.exportBooksByAuthorPdf());
        document.getElementById('exportBooksAuthorExcel').addEventListener('click', () => AdminReportsView.exportBooksByAuthorExcel());
        document.getElementById('exportSalesPdf').addEventListener('click', () => AdminReportsView.exportSalesPdf());
        document.getElementById('exportSalesExcel').addEventListener('click', () => AdminReportsView.exportSalesExcel());
    },

    loadBooksByAuthor: async () => {
        const container = document.getElementById('booksByAuthorContent');
        try {
            container.innerHTML = '<div class="text-center"><div class="spinner"></div></div>';
            const books = await BookService.getAll();

            const booksByAuthor = {};
            books.forEach(b => {
                const authorName = b.authorName || 'Sin autor';
                if (!booksByAuthor[authorName]) {
                    booksByAuthor[authorName] = { name: authorName, books: [] };
                }
                booksByAuthor[authorName].books.push(b);
            });

            AdminReportsView.booksByAuthorData = booksByAuthor;
            AdminReportsView.allBooks = books;

            let html = '';
            Object.values(booksByAuthor).forEach(author => {
                if (author.books.length > 0) {
                    const escName = Helpers.escapeHtml(author.name);
                    html += `<div class="author-group">
                        <h4><i class="fas fa-user"></i> ${escName} (${author.books.length} libros)</h4>
                        <div class="author-books-list">
                            ${author.books.map(b => `<div class="author-book-item">
                                <strong>${Helpers.escapeHtml(b.title)}</strong>
                                <div style="color: var(--text-muted); font-size: 12px;">${b.categoryName || 'Sin categoría'} • ${Helpers.formatPrice(b.price)}</div>
                            </div>`).join('')}
                        </div>
                    </div>`;
                }
            });
            container.innerHTML = html || '<div class="empty-state"><p>No hay datos disponibles</p></div>';
        } catch (error) {
            console.error('Error loading books by author:', error);
            container.innerHTML = '<div class="error-state"><p>Error al cargar datos</p></div>';
        }
    },

    loadSalesReport: async () => {
        const container = document.getElementById('salesContent');
        const dateFrom = document.getElementById('salesDateFrom').value;
        const dateTo = document.getElementById('salesDateTo').value;

        try {
            container.innerHTML = '<div class="text-center"><div class="spinner"></div></div>';

            let purchases = [];
            try {
                purchases = await HttpClient.get('/admin/reports/sales');
            } catch (e) {
                console.warn('Could not fetch purchases report', e);
            }

            if (dateFrom) {
                purchases = purchases.filter(p => new Date(p.purchaseDate || p.createdAt) >= new Date(dateFrom));
            }
            if (dateTo) {
                const toDate = new Date(dateTo);
                toDate.setHours(23, 59, 59);
                purchases = purchases.filter(p => new Date(p.purchaseDate || p.createdAt) <= toDate);
            }

            AdminReportsView.salesData = { purchases, dateFrom, dateTo };

            const totalSales = purchases.length;
            const totalRevenue = purchases.reduce((sum, p) => sum + (p.total || 0), 0);

            container.innerHTML = `
                <div class="sales-summary">
                    <div class="sales-stat"><div class="value">${totalSales}</div><div class="label">Total Ventas</div></div>
                    <div class="sales-stat"><div class="value">${Helpers.formatPrice(totalRevenue)}</div><div class="label">Ingresos</div></div>
                </div>
                ${purchases.length > 0 ? Table.render({
                columns: [
                    { label: 'ID', key: 'purchaseId', width: '60px' },
                    { label: 'Fecha', key: 'purchaseDate', type: 'date' },
                    { label: 'Cliente', key: 'customerName' },
                    { label: 'Total', key: 'total', type: 'price' }
                ],
                data: purchases
            }) : '<div class="empty-state"><p>No hay ventas en este periodo</p></div>'}
            `;
        } catch (error) {
            console.error('Error loading sales:', error);
            container.innerHTML = '<div class="error-state"><p>Error al cargar ventas</p></div>';
        }
    },

    exportBooksByAuthorExcel: () => {
        const books = AdminReportsView.allBooks || [];
        if (books.length === 0) {
            Toast.show('No hay datos para exportar', 'warning');
            return;
        }

        let csv = '\uFEFF';
        csv += 'Título,Autor,Categoría,Precio\n';
        books.forEach(b => {
            const title = (b.title || '').replace(/"/g, '""');
            const author = (b.authorName || '').replace(/"/g, '""');
            const category = (b.categoryName || '').replace(/"/g, '""');
            csv += `"${title}","${author}","${category}",${b.price || 0}\n`;
        });

        AdminReportsView.downloadFile(csv, 'libros_por_autor.csv', 'text/csv;charset=utf-8');
        Toast.show('Archivo Excel exportado', 'success');
    },

    exportSalesExcel: () => {
        const { purchases } = AdminReportsView.salesData || { purchases: [] };
        if (purchases.length === 0) {
            Toast.show('No hay datos para exportar', 'warning');
            return;
        }

        let csv = '\uFEFF';
        csv += 'ID,Fecha,Cliente,Estado,Total\n';
        purchases.forEach(p => {
            const date = p.purchaseDate || p.createdAt || '';
            const customer = (p.customerName || '').replace(/"/g, '""');
            const status = p.status || 'PENDING';
            csv += `${p.purchaseId || p.id},"${date}","${customer}","${status}",${p.total || 0}\n`;
        });

        AdminReportsView.downloadFile(csv, 'reporte_ventas.csv', 'text/csv;charset=utf-8');
        Toast.show('Archivo Excel exportado', 'success');
    },

    downloadFile: (content, filename, mimeType) => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    exportBooksByAuthorPdf: () => {
        const data = AdminReportsView.booksByAuthorData || {};
        let booksHtml = '';
        Object.values(data).forEach(author => {
            if (author.books.length > 0) {
                booksHtml += `<div style="margin-bottom:20px;"><h3 style="color:#6366f1;">${Helpers.escapeHtml(author.name)} (${author.books.length})</h3>
                    <table style="width:100%;border-collapse:collapse;font-size:12px;">
                        <tr style="background:#f1f5f9;"><th style="padding:8px;">Título</th><th>Categoría</th><th style="text-align:right;">Precio</th></tr>
                        ${author.books.map(b => `<tr><td style="padding:8px;border-bottom:1px solid #eee;">${Helpers.escapeHtml(b.title)}</td>
                            <td style="border-bottom:1px solid #eee;">${b.categoryName || '-'}</td>
                            <td style="text-align:right;border-bottom:1px solid #eee;">${Helpers.formatPrice(b.price)}</td></tr>`).join('')}
                    </table></div>`;
            }
        });
        const pdfContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Libros por Autor</title>
            <style>body{font-family:Arial;padding:40px;}.header{text-align:center;border-bottom:3px solid #6366f1;padding-bottom:20px;margin-bottom:30px;}h1{color:#6366f1;}</style></head>
            <body><div class="header"><h1>📚 Reporte de Libros por Autor</h1><p>${new Date().toLocaleDateString('es-ES')}</p></div>${booksHtml}</body></html>`;
        const w = window.open('', '_blank');
        w.document.write(pdfContent);
        w.document.close();
        setTimeout(() => w.print(), 300);
    },

    exportSalesPdf: () => {
        const { purchases, dateFrom, dateTo } = AdminReportsView.salesData || { purchases: [] };
        const totalRevenue = purchases.reduce((sum, p) => sum + (p.total || 0), 0);
        const pdfContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Reporte Ventas</title>
            <style>body{font-family:Arial;padding:40px;}.header{text-align:center;border-bottom:3px solid #6366f1;padding-bottom:20px;margin-bottom:30px;}h1{color:#6366f1;}
            table{width:100%;border-collapse:collapse;}th,td{padding:10px;border-bottom:1px solid #ddd;}th{background:#6366f1;color:white;}</style></head>
            <body><div class="header"><h1>💰 Reporte de Ventas</h1><p>Período: ${dateFrom || 'Inicio'} - ${dateTo || 'Actual'}</p></div>
            <p><strong>Total:</strong> ${purchases.length} ventas | <strong>Ingresos:</strong> ${Helpers.formatPrice(totalRevenue)}</p>
            <table><thead><tr><th>ID</th><th>Fecha</th><th>Cliente</th><th>Total</th></tr></thead>
            <tbody>${purchases.map(p => `<tr><td>${p.purchaseId || p.id}</td><td>${p.purchaseDate || '-'}</td><td>${p.customerName || '-'}</td><td>${Helpers.formatPrice(p.total)}</td></tr>`).join('')}</tbody></table></body></html>`;
        const w = window.open('', '_blank');
        w.document.write(pdfContent);
        w.document.close();
        setTimeout(() => w.print(), 300);
    }
};

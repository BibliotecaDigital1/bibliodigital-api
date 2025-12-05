const App = {
    router: null,

    init() {

        const auth = Storage.getAuth();
        if (!auth) {
            window.location.href = 'auth.html';
            return;
        }

        this.initLayout();

        const routes = this.getRoutes(auth.user.role.name);

        this.router = new Router(routes);
    },

    initLayout() {
        const auth = Storage.getAuth();
        const role = auth.user.role.name;

        Navbar.render('navbar');

        Sidebar.render('sidebar', role.toLowerCase());

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Storage.clearAuth();
                window.location.href = 'auth.html';
            });
        }
    },

    /**
     * Get routes based on user role
     * @param {string} role 
     */
    getRoutes(role) {

        const routes = [
            { path: '/', view: DashboardView },
            { path: '/profile', view: ProfileView },
        ];

        if (role === 'CUSTOMER') {
            routes.push(
                { path: '/books', view: BooksView },
                { path: '/cart', view: CartView },
                { path: '/checkout', view: CheckoutView },
                { path: '/purchases', view: PurchasesView },
                { path: '/collections', view: CollectionsView },
                { path: '/collection-detail', view: CollectionDetailView },
                { path: '/my-books', view: MyBooksView }
            );
        } else if (role === 'ADMIN') {
            routes.push(
                { path: '/books', view: AdminBooksView },
                { path: '/categories', view: AdminCategoriesView },
                { path: '/authors', view: AdminAuthorsView },
                { path: '/reports', view: AdminReportsView },
                { path: '/users', view: AdminUsersView }
            );
        } else if (role === 'AUTHOR') {
            routes.push(
                { path: '/my-books', view: AuthorBooksView }
            );
        }

        return routes;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

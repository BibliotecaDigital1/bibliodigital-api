class Router {
    constructor(routes) {
        this.routes = routes;
        this.currentView = null;
        this.rootElement = document.getElementById('app-content');

        window.addEventListener('hashchange', () => this.handleRoute());
        window.addEventListener('load', () => this.handleRoute());
    }

    async handleRoute() {
        const fullHash = window.location.hash.slice(1) || '/';

        const hash = fullHash.split('?')[0];

        let route = this.routes.find(r => r.path === hash);

        if (!route) {
            route = this.routes.find(r => r.path === '/') || this.routes[0];
        }

        if (route.guard && !route.guard()) {
            return;
        }

        this.renderView(route.view);

        this.updateActiveLinks(hash);
    }

    /**
     * Render the view component
     * @param {Object|Function} viewComponent 
     */
    async renderView(viewComponent) {

        if (this.rootElement) {
            this.rootElement.innerHTML = '<div class="page-loader"><div class="spinner"></div></div>';
        }

        try {

            const view = typeof viewComponent === 'function' ? await viewComponent() : viewComponent;

            if (this.rootElement) {
                this.rootElement.innerHTML = await view.render();

                if (view.afterRender) {
                    await view.afterRender();
                }
            }

            this.currentView = view;
        } catch (error) {
            console.error('Error rendering view:', error);
            if (this.rootElement) {
                this.rootElement.innerHTML = '<div class="error-state"><h3>Error al cargar la página</h3><p>Por favor intenta nuevamente.</p></div>';
            }
        }
    }

    /**
     * Update active state of navigation links
     * @param {string} hash 
     */
    updateActiveLinks(hash) {
        document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${hash}`) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Navigate to a path programmatically
     * @param {string} path 
     */
    navigate(path) {
        window.location.hash = path;
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = Router;
}

const Sidebar = {
  /**
   * Render the sidebar
   * @param {string} containerId
   * @param {string} activeItem
   */
  render(containerId = "sidebar", activeItem = "") {
    const container = document.getElementById(containerId)
    if (!container) return

    const auth = Storage.getAuth()
    const user = auth?.user
    const role = user?.role?.name

    let menuItems = []

    switch (role) {
      case "CUSTOMER":
        menuItems = [
          { id: "dashboard", icon: "fas fa-th-large", label: "Dashboard", href: "#/" },
          { id: "browse", icon: "fas fa-search", label: "Explorar Libros", href: "#/books" },
          { id: "my-books", icon: "fas fa-book-reader", label: "Mis Libros", href: "#/my-books" },
          { id: "purchases", icon: "fas fa-shopping-bag", label: "Mis Compras", href: "#/purchases" },
          { id: "collections", icon: "fas fa-bookmark", label: "Colecciones", href: "#/collections" },
          { id: "cart", icon: "fas fa-shopping-cart", label: "Carrito", href: "#/cart" },
          { id: "profile", icon: "fas fa-user", label: "Mi Perfil", href: "#/profile" },
        ]
        break

      case "ADMIN":
        menuItems = [
          { id: "dashboard", icon: "fas fa-th-large", label: "Dashboard", href: "#/" },
          { id: "books", icon: "fas fa-book", label: "Libros", href: "#/books" },
          { id: "categories", icon: "fas fa-folder", label: "Categorías", href: "#/categories" },
          { id: "authors", icon: "fas fa-users", label: "Autores", href: "#/authors" },
          { id: "reports", icon: "fas fa-chart-bar", label: "Reportes", href: "#/reports" },
          { id: "users", icon: "fas fa-user-shield", label: "Usuarios", href: "#/users" },
        ]
        break
    }

    const Helpers = {
      getInitials(firstName, lastName) {
        return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`
      },
    }

    container.innerHTML = `
      <aside class="sidebar" id="sidebarNav">
        <div class="sidebar-header">
          <a href="/frontend/index.html" class="sidebar-brand">
            <div class="sidebar-logo">
              <i class="fas fa-book-open"></i>
            </div>
            <span class="sidebar-brand-text">BiblioDigital</span>
          </a>
          <button class="sidebar-close" id="sidebarClose" aria-label="Cerrar menú">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="sidebar-user">
          <div class="avatar">
            ${Helpers.getInitials(user?.firstName, user?.lastName)}
          </div>
          <div class="sidebar-user-info">
            <span class="sidebar-user-name">${user?.firstName} ${user?.lastName}</span>
            <span class="sidebar-user-role">${this._getRoleLabel(role)}</span>
          </div>
        </div>

        <nav class="sidebar-nav">
          <ul class="sidebar-menu">
            ${menuItems
        .map(
          (item) => `
              <li class="sidebar-item">
                <a href="${item.href}" class="sidebar-link ${activeItem === item.id ? "active" : ""}">
                  <i class="${item.icon}"></i>
                  <span>${item.label}</span>
                </a>
              </li>
            `,
        )
        .join("")}
          </ul>
        </nav>
      </aside>

      <div class="sidebar-overlay" id="sidebarOverlay"></div>

      <button class="sidebar-toggle" id="sidebarToggle" aria-label="Abrir menú">
        <i class="fas fa-bars"></i>
      </button>
    `

    this._addStyles()
    this._bindEvents()
  },

  /**
   * Get role label in Spanish
   * @param {string} role
   * @returns {string}
   * @private
   */
  _getRoleLabel(role) {
    const labels = {
      ADMIN: "Administrador",
      CUSTOMER: "Cliente",
      AUTHOR: "Autor",
    }
    return labels[role] || role
  },

  /**
   * Add sidebar styles
   * @private
   */
  _addStyles() {
    if (document.getElementById("sidebar-styles")) return

    const styles = document.createElement("style")
    styles.id = "sidebar-styles"
    styles.textContent = `
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        width: 260px;
        height: 100vh;
        background: #1e293b;
        border-right: 1px solid rgba(148, 163, 184, 0.1);
        display: flex;
        flex-direction: column;
        z-index: 400;
        transition: transform 0.3s ease;
      }

      .sidebar-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.1);
      }

      .sidebar-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
      }

      .sidebar-logo {
        width: 36px;
        height: 36px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
      }

      .sidebar-brand-text {
        font-family: 'Poppins', sans-serif;
        font-size: 1.125rem;
        font-weight: 700;
        background: linear-gradient(135deg, #6366f1, #ec4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .sidebar-close {
        display: none;
        width: 32px;
        height: 32px;
        background: transparent;
        border: none;
        color: #94a3b8;
        cursor: pointer;
        border-radius: 6px;
        transition: all 0.2s ease;
      }

      .sidebar-close:hover {
        background: #334155;
        color: #f1f5f9;
      }

      .sidebar-user {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 20px;
        border-bottom: 1px solid rgba(148, 163, 184, 0.1);
      }

      .sidebar-user-info {
        display: flex;
        flex-direction: column;
      }

      .sidebar-user-name {
        font-size: 14px;
        font-weight: 600;
        color: #f1f5f9;
      }

      .sidebar-user-role {
        font-size: 12px;
        color: #64748b;
      }

      .sidebar-nav {
        flex: 1;
        overflow-y: auto;
        padding: 16px 12px;
      }

      .sidebar-menu {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .sidebar-item {
        margin-bottom: 4px;
      }

      .sidebar-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        color: #94a3b8;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        border-radius: 8px;
        transition: all 0.2s ease;
        border: none;
        background: transparent;
        width: 100%;
        cursor: pointer;
        text-align: left;
      }

      .sidebar-link:hover {
        color: #f1f5f9;
        background: rgba(99, 102, 241, 0.1);
      }

      .sidebar-link.active {
        color: #6366f1;
        background: rgba(99, 102, 241, 0.15);
      }

      .sidebar-link i {
        width: 20px;
        text-align: center;
      }

      .sidebar-footer {
        padding: 16px 12px;
        border-top: 1px solid rgba(148, 163, 184, 0.1);
      }

      .sidebar-logout {
        color: #ef4444 !important;
      }

      .sidebar-logout:hover {
        background: rgba(239, 68, 68, 0.1) !important;
      }

      .sidebar-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 350;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      .sidebar-overlay.active {
        opacity: 1;
        visibility: visible;
      }

      .sidebar-toggle {
        position: fixed;
        top: 20px;
        left: 20px;
        width: 44px;
        height: 44px;
        background: #1e293b;
        border: 1px solid rgba(148, 163, 184, 0.1);
        border-radius: 10px;
        color: #f1f5f9;
        font-size: 18px;
        cursor: pointer;
        z-index: 300;
        display: none;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }

      .sidebar-toggle:hover {
        background: #334155;
      }

      @media (max-width: 1024px) {
        .sidebar {
          transform: translateX(-100%);
        }

        .sidebar.active {
          transform: translateX(0);
        }

        .sidebar-close {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sidebar-toggle {
          display: flex;
        }
      }
    `
    document.head.appendChild(styles)
  },

  /**
   * Bind event listeners
   * @private
   */
  _bindEvents() {
    const sidebar = document.getElementById("sidebarNav")
    const overlay = document.getElementById("sidebarOverlay")
    const toggle = document.getElementById("sidebarToggle")
    const close = document.getElementById("sidebarClose")
    const logout = document.getElementById("sidebarLogout")

    if (toggle) {
      toggle.addEventListener("click", () => {
        sidebar?.classList.add("active")
        overlay?.classList.add("active")
      })
    }

    const closeSidebar = () => {
      sidebar?.classList.remove("active")
      overlay?.classList.remove("active")
    }

    if (close) close.addEventListener("click", closeSidebar)
    if (overlay) overlay.addEventListener("click", closeSidebar)

    if (logout) {
      logout.addEventListener("click", () => {
        Storage.clearAuth()
        Storage.clearCart()
        window.location.href = "/frontend/login.html"
      })
    }
  },

  open() {
    document.getElementById("sidebarNav")?.classList.add("active")
    document.getElementById("sidebarOverlay")?.classList.add("active")
  },

  close() {
    document.getElementById("sidebarNav")?.classList.remove("active")
    document.getElementById("sidebarOverlay")?.classList.remove("active")
  },
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = Sidebar
}

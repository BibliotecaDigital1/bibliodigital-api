const Navbar = {
  /**
   * Render the navbar
   * @param {string} containerId
   */
  render(containerId = "navbar") {
    const container = document.getElementById(containerId)
    if (!container) return

    const auth = Storage.getAuth()
    const isAuthenticated = !!auth
    const user = auth?.user
    const role = user?.role?.name

    container.innerHTML = `
      <nav class="navbar">
        <div class="navbar-container">
          <a href="/frontend/index.html" class="navbar-brand">
            <div class="navbar-logo">
              <i class="fas fa-book-open"></i>
            </div>
            <span class="navbar-brand-text">BiblioDigital</span>
          </a>

          <div class="navbar-menu" id="navbarMenu">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a href="index.html" class="nav-link">
                  <i class="fas fa-home"></i>
                  <span>Inicio</span>
                </a>
              </li>
              ${isAuthenticated && role === "CUSTOMER"
        ? `
                <li class="nav-item">
                  <a href="app.html#/" class="nav-link">
                    <i class="fas fa-th-large"></i>
                    <span>Mi Panel</span>
                  </a>
                </li>
              `
        : ""
      }
              ${isAuthenticated && role === "ADMIN"
        ? `
                <li class="nav-item">
                  <a href="app.html#/" class="nav-link">
                    <i class="fas fa-cog"></i>
                    <span>Administración</span>
                  </a>
                </li>
              `
        : ""
      }
              ${isAuthenticated && role === "AUTHOR"
        ? `
                <li class="nav-item">
                  <a href="app.html#/" class="nav-link">
                    <i class="fas fa-pen-fancy"></i>
                    <span>Mi Panel</span>
                  </a>
                </li>
              `
        : ""
      }
            </ul>
          </div>

          <div class="navbar-actions">
            ${isAuthenticated && role === "CUSTOMER"
        ? `
              <a href="app.html#/cart" class="navbar-cart" id="navbarCart">
                <i class="fas fa-shopping-cart"></i>
                <span class="cart-badge" id="cartBadge">0</span>
              </a>
            `
        : ""
      }

            ${isAuthenticated
        ? `
              <div class="dropdown" id="userDropdown">
                <button class="navbar-user" id="userDropdownBtn">
                  <div class="avatar avatar-sm">
                    ${getInitials(user?.firstName, user?.lastName)}
                  </div>
                  <span class="navbar-user-name">${user?.firstName || "Usuario"}</span>
                  <i class="fas fa-chevron-down"></i>
                </button>
                <div class="dropdown-menu">
                  <div class="dropdown-header">
                    <strong>${user?.firstName} ${user?.lastName}</strong>
                    <small>${user?.email}</small>
                  </div>
                  <div class="dropdown-divider"></div>
                  ${role === "CUSTOMER"
          ? `
                    <a href="app.html#/profile" class="dropdown-item">
                      <i class="fas fa-user"></i>
                      Mi Perfil
                    </a>
                    <a href="app.html#/purchases" class="dropdown-item">
                      <i class="fas fa-shopping-bag"></i>
                      Mis Compras
                    </a>
                    <a href="app.html#/collections" class="dropdown-item">
                      <i class="fas fa-bookmark"></i>
                      Colecciones
                    </a>
                  `
          : ""
        }
                  ${role === "AUTHOR"
          ? `
                    <a href="app.html#/profile" class="dropdown-item">
                      <i class="fas fa-user"></i>
                      Mi Perfil
                    </a>
                  `
          : ""
        }
                  <div class="dropdown-divider"></div>
                  <button class="dropdown-item" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i>
                    Cerrar Sesión
                  </button>
                </div>
              </div>
            `
        : `
              <a href="auth.html" class="btn btn-ghost">Iniciar Sesión</a>
              <a href="auth.html#register" class="btn btn-primary">Registrarse</a>
            `
      }

            <button class="navbar-toggle" id="navbarToggle" aria-label="Toggle menu">
              <i class="fas fa-bars"></i>
            </button>
          </div>
        </div>
      </nav>
    `

    this._addStyles()
    this._bindEvents()
    this._updateCartBadge()
  },

  /**
   * Add navbar styles
   * @private
   */
  _addStyles() {
    if (document.getElementById("navbar-styles")) return

    const styles = document.createElement("style")
    styles.id = "navbar-styles"
    styles.textContent = `
      .navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 70px;
        background: rgba(15, 23, 42, 0.8);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        z-index: 300;
      }

      .navbar-container {
        max-width: 1280px;
        height: 100%;
        margin: 0 auto;
        padding: 0 24px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .navbar-brand {
        display: flex;
        align-items: center;
        gap: 12px;
        text-decoration: none;
      }

      .navbar-logo {
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #6366f1, #8b5cf6);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 18px;
      }

      .navbar-brand-text {
        font-family: 'Poppins', sans-serif;
        font-size: 1.25rem;
        font-weight: 700;
        background: linear-gradient(135deg, #6366f1, #ec4899);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .navbar-menu {
        display: flex;
        align-items: center;
      }

      .navbar-nav {
        display: flex;
        align-items: center;
        gap: 8px;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .nav-link {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 16px;
        color: #94a3b8;
        text-decoration: none;
        font-size: 14px;
        font-weight: 500;
        border-radius: 8px;
        transition: all 0.2s ease;
      }

      .nav-link:hover {
        color: #f1f5f9;
        background: rgba(99, 102, 241, 0.1);
      }

      .nav-link.active {
        color: #6366f1;
        background: rgba(99, 102, 241, 0.1);
      }

      .navbar-actions {
        display: flex;
        align-items: center;
        gap: 16px;
      }

      .navbar-cart {
        position: relative;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #94a3b8;
        border-radius: 8px;
        transition: all 0.2s ease;
      }

      .navbar-cart:hover {
        color: #f1f5f9;
        background: rgba(99, 102, 241, 0.1);
      }

      .cart-badge {
        position: absolute;
        top: 2px;
        right: 2px;
        min-width: 18px;
        height: 18px;
        padding: 0 5px;
        background: #ec4899;
        color: white;
        font-size: 11px;
        font-weight: 600;
        border-radius: 9px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .cart-badge:empty,
      .cart-badge[data-count="0"] {
        display: none;
      }

      .navbar-user {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 12px 6px 6px;
        background: rgba(99, 102, 241, 0.1);
        border: 1px solid rgba(99, 102, 241, 0.2);
        border-radius: 50px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .navbar-user:hover {
        background: rgba(99, 102, 241, 0.2);
        border-color: rgba(99, 102, 241, 0.3);
      }

      .navbar-user-name {
        font-size: 14px;
        font-weight: 500;
        color: #f1f5f9;
      }

      .navbar-user i {
        font-size: 12px;
        color: #94a3b8;
      }

      .dropdown-header {
        padding: 12px 16px;
      }

      .dropdown-header strong {
        display: block;
        color: #f1f5f9;
        font-size: 14px;
      }

      .dropdown-header small {
        color: #64748b;
        font-size: 12px;
      }

      .navbar-toggle {
        display: none;
        width: 40px;
        height: 40px;
        background: transparent;
        border: none;
        color: #94a3b8;
        font-size: 20px;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s ease;
      }

      .navbar-toggle:hover {
        color: #f1f5f9;
        background: rgba(99, 102, 241, 0.1);
      }

      @media (max-width: 768px) {
        .navbar-menu {
          position: fixed;
          top: 70px;
          left: 0;
          right: 0;
          background: #1e293b;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
          padding: 16px;
          transform: translateY(-100%);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .navbar-menu.active {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .navbar-nav {
          flex-direction: column;
          align-items: stretch;
        }

        .nav-link {
          padding: 12px 16px;
        }

        .navbar-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .navbar-user-name {
          display: none;
        }

        .navbar-actions .btn {
          display: none;
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

    const toggle = document.getElementById("navbarToggle")
    const menu = document.getElementById("navbarMenu")
    if (toggle && menu) {
      toggle.addEventListener("click", () => {
        menu.classList.toggle("active")
        const icon = toggle.querySelector("i")
        icon.className = menu.classList.contains("active") ? "fas fa-times" : "fas fa-bars"
      })
    }

    const dropdown = document.getElementById("userDropdown")
    const dropdownBtn = document.getElementById("userDropdownBtn")
    if (dropdown && dropdownBtn) {
      dropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        dropdown.classList.toggle("active")
      })

      document.addEventListener("click", () => {
        dropdown.classList.remove("active")
      })
    }

    const logoutBtn = document.getElementById("logoutBtn")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        Storage.clearAuth()
        Storage.clearCart()
        window.location.href = "auth.html"
      })
    }
  },

  /**
   * Update cart badge count
   * @private
   */
  _updateCartBadge() {
    const badge = document.getElementById("cartBadge")
    if (badge) {
      const count = Storage.getCartCount()
      badge.textContent = count
      badge.dataset.count = count
    }
  },

  refreshCartBadge() {
    this._updateCartBadge()
  },
}

function getInitials(firstName, lastName) {
  return (firstName?.charAt(0) || "").toUpperCase() + (lastName?.charAt(0) || "").toUpperCase()
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = Navbar
}

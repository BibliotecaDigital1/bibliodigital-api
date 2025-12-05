const CARD_CONFIG = {
  BASE_URL: "http://localhost:8080/api/v1",
  ENDPOINTS: {
    MEDIA: {
      GET: (path) => `/media/${path}`,
    },
  },
}


const BookCard = {
  /**
   * Render a book card
   * @param {Object} book
   * @param {Object} options
   * @returns {string}
   */
  render(book, options = {}) {
    const {
      showActions = true,
      showCategory = true,
      showPrice = true,
      actionType = "cart",
      onAddToCart = null,
    } = options

    const coverUrl = book.coverPath
      ? `${CARD_CONFIG.BASE_URL}${CARD_CONFIG.ENDPOINTS.MEDIA.GET(book.coverPath)}`
      : "assets/images/placeholder-book.png"

    const price = Helpers.formatPrice(book.price)
    const authorName =
      book.authorName || `${book.author?.firstName || ""} ${book.author?.lastName || ""}`.trim() || "Autor desconocido"

    let actionsHtml = ""
    if (showActions) {
      switch (actionType) {
        case "cart":

          actionsHtml = `
            <button class="btn btn-ghost btn-sm book-card-favorite" data-book-id="${book.id}">
              <i class="far fa-heart"></i>
            </button>
          `
          break
        case "view":
          actionsHtml = `
            <button class="btn btn-primary btn-sm book-card-view" data-book-id="${book.id}">
              <i class="fas fa-eye"></i>
            </button>
          `
          break
        case "admin":
          actionsHtml = `
            <button class="btn btn-ghost btn-sm book-card-edit" data-book-id="${book.id}">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-ghost btn-sm book-card-delete" data-book-id="${book.id}">
              <i class="fas fa-trash"></i>
            </button>
          `
          break
      }
    }

    return `
      <div class="book-card" data-book-id="${book.id}">
        <div class="book-card-image">
          <img src="${coverUrl}" alt="${Helpers.escapeHtml(book.title)}" loading="lazy" onerror="this.onerror=null; this.src='assets/images/placeholder-book.png';">
          ${book.isNew ? '<span class="book-card-badge badge badge-primary">Nuevo</span>' : ""}
          ${showActions ? `<div class="book-card-actions">${actionsHtml}</div>` : ""}
        </div>
        <div class="book-card-content">
          ${showCategory && book.categoryName
        ? `
            <span class="book-card-category">${Helpers.escapeHtml(book.categoryName)}</span>
          `
        : ""
      }
          <h3 class="book-card-title" title="${Helpers.escapeHtml(book.title)}">
            ${Helpers.escapeHtml(book.title)}
          </h3>
          <p class="book-card-author">${Helpers.escapeHtml(authorName)}</p>
          <div class="book-card-footer">
            ${showPrice ? `<span class="book-card-price">${price}</span>` : ""}
            ${actionType === "cart" && showActions
        ? `
              <button class="btn btn-primary btn-sm book-card-add-cart" data-book-id="${book.id}">
                <i class="fas fa-cart-plus"></i> Agregar
              </button>
            `
        : ""
      }
          </div>
        </div>
      </div>
    `
  },

  /**
   * @param {Array} books
   * @param {Object} options
   * @returns {string}
   */
  renderGrid(books, options = {}) {
    if (!books || books.length === 0) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">
            <i class="fas fa-book-open"></i>
          </div>
          <h3 class="empty-state-title">No hay libros disponibles</h3>
          <p class="empty-state-description">
            No se encontraron libros que coincidan con tu búsqueda.
          </p>
        </div>
      `
    }

    return `
      <div class="books-grid">
        ${books.map((book) => this.render(book, options)).join("")}
      </div>
    `
  },

  /**
   * Render skeleton loading cards
   * @param {number} count
   * @returns {string}
   */
  renderSkeleton(count = 6) {
    const skeleton = `
      <div class="book-card">
        <div class="book-card-image">
          <div class="skeleton" style="width: 100%; height: 100%;"></div>
        </div>
        <div class="book-card-content">
          <div class="skeleton skeleton-text" style="width: 40%;"></div>
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text" style="width: 60%;"></div>
          <div class="book-card-footer">
            <div class="skeleton" style="width: 60px; height: 24px;"></div>
            <div class="skeleton" style="width: 80px; height: 32px; border-radius: 8px;"></div>
          </div>
        </div>
      </div>
    `

    return `
      <div class="books-grid">
        ${Array(count).fill(skeleton).join("")}
      </div>
    `
  },

  /**
   * Bind event listeners for book cards
   * @param {HTMLElement} container
   * @param {Object} handlers
   */
  bindEvents(container, handlers = {}) {
    const {
      onAddToCart = null,
      onBuy = null,
      onView = null,
      onEdit = null,
      onDelete = null,
      onFavorite = null,
    } = handlers

    if (onAddToCart) {
      container.querySelectorAll(".book-card-add-cart").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation()
          const bookId = btn.dataset.bookId
          onAddToCart(bookId)
        })
      })
    }

    if (onBuy) {
      container.querySelectorAll(".book-card-buy").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation()
          const bookId = btn.dataset.bookId
          onBuy(bookId)
        })
      })
    }

    if (onView) {
      container.querySelectorAll(".book-card-view").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation()
          const bookId = btn.dataset.bookId
          onView(bookId)
        })
      })

      container.querySelectorAll(".book-card").forEach((card) => {
        card.addEventListener("click", () => {
          const bookId = card.dataset.bookId
          onView(bookId)
        })
      })
    }

    if (onEdit) {
      container.querySelectorAll(".book-card-edit").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation()
          const bookId = btn.dataset.bookId
          onEdit(bookId)
        })
      })
    }

    if (onDelete) {
      container.querySelectorAll(".book-card-delete").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation()
          const bookId = btn.dataset.bookId
          onDelete(bookId)
        })
      })
    }

    if (onFavorite) {
      container.querySelectorAll(".book-card-favorite").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation()
          const bookId = btn.dataset.bookId
          const icon = btn.querySelector("i")
          icon.classList.toggle("far")
          icon.classList.toggle("fas")
          icon.classList.toggle("text-error")
          onFavorite(bookId)
        })
      })
    }
  },
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = BookCard
}

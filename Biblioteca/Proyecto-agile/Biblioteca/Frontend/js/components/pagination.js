const Pagination = {
  /**
   * Render pagination
   * @param {Object} options
   * @returns {string}
   */
  render(options = {}) {
    const {
      currentPage = 0,
      totalPages = 1,
      totalElements = 0,
      pageSize = 10,
      showInfo = true,
      maxVisiblePages = 5,
    } = options

    if (totalPages <= 1) {
      return ""
    }

    const pages = this._getVisiblePages(currentPage, totalPages, maxVisiblePages)
    const startItem = currentPage * pageSize + 1
    const endItem = Math.min((currentPage + 1) * pageSize, totalElements)

    return `
      <div class="pagination-container">
        ${
          showInfo
            ? `
          <div class="pagination-info">
            Mostrando ${startItem}-${endItem} de ${totalElements} resultados
          </div>
        `
            : ""
        }
        
        <div class="pagination">
          <button 
            class="pagination-btn pagination-prev" 
            ${currentPage === 0 ? "disabled" : ""}
            data-page="${currentPage - 1}"
          >
            <i class="fas fa-chevron-left"></i>
          </button>

          ${pages
            .map((page) => {
              if (page === "...") {
                return '<span class="pagination-ellipsis">...</span>'
              }
              return `
              <button 
                class="pagination-btn pagination-page ${page === currentPage ? "active" : ""}"
                data-page="${page}"
              >
                ${page + 1}
              </button>
            `
            })
            .join("")}

          <button 
            class="pagination-btn pagination-next" 
            ${currentPage >= totalPages - 1 ? "disabled" : ""}
            data-page="${currentPage + 1}"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    `
  },

  /**
   * Get visible page numbers
   * @param {number} currentPage
   * @param {number} totalPages
   * @param {number} maxVisible
   * @returns {Array}
   * @private
   */
  _getVisiblePages(currentPage, totalPages, maxVisible) {
    const pages = []

    if (totalPages <= maxVisible) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
      return pages
    }

    pages.push(0)

    const start = Math.max(1, currentPage - 1)
    const end = Math.min(totalPages - 2, currentPage + 1)

    if (start > 1) {
      pages.push("...")
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < totalPages - 2) {
      pages.push("...")
    }

    if (totalPages > 1) {
      pages.push(totalPages - 1)
    }

    return pages
  },

  /**
   * Bind pagination events
   * @param {HTMLElement} container
   * @param {Function} onPageChange
   */
  bindEvents(container, onPageChange) {
    container.querySelectorAll(".pagination-btn:not(:disabled)").forEach((btn) => {
      btn.addEventListener("click", () => {
        const page = Number.parseInt(btn.dataset.page)
        if (!isNaN(page)) {
          onPageChange(page)
        }
      })
    })
  },

  addStyles() {
    if (document.getElementById("pagination-styles")) return

    const styles = document.createElement("style")
    styles.id = "pagination-styles"
    styles.textContent = `
      .pagination-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 16px;
        padding: 16px 0;
      }

      .pagination-info {
        font-size: 14px;
        color: #94a3b8;
      }

      .pagination {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .pagination-btn {
        min-width: 36px;
        height: 36px;
        padding: 0 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: transparent;
        border: 1px solid rgba(148, 163, 184, 0.1);
        border-radius: 8px;
        color: #94a3b8;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .pagination-btn:hover:not(:disabled) {
        background: rgba(99, 102, 241, 0.1);
        border-color: rgba(99, 102, 241, 0.3);
        color: #f1f5f9;
      }

      .pagination-btn.active {
        background: #6366f1;
        border-color: #6366f1;
        color: white;
      }

      .pagination-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .pagination-ellipsis {
        padding: 0 8px;
        color: #64748b;
      }

      @media (max-width: 640px) {
        .pagination-container {
          justify-content: center;
        }

        .pagination-info {
          width: 100%;
          text-align: center;
        }
      }
    `
    document.head.appendChild(styles)
  },
}

document.addEventListener("DOMContentLoaded", () => Pagination.addStyles())

if (typeof module !== "undefined" && module.exports) {
  module.exports = Pagination
}

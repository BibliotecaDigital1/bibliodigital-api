const Table = {
  /**
   * Render a data table
   * @param {Object} options
   * @returns {string}
   */
  render(options = {}) {
    const {
      columns = [],
      data = [],
      actions = [],
      emptyMessage = "No hay datos disponibles",
      loading = false,
    } = options

    if (loading) {
      return this.renderSkeleton(columns.length)
    }

    if (!data || data.length === 0) {
      return `
        <div class="table-container">
          <div class="empty-state">
            <div class="empty-state-icon">
              <i class="fas fa-inbox"></i>
            </div>
            <h3 class="empty-state-title">${emptyMessage}</h3>
          </div>
        </div>
      `
    }

    const hasActions = actions.length > 0

    return `
      <div class="table-container">
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                ${columns
        .map(
          (col) => `
                  <th style="${col.width ? `width: ${col.width};` : ""}">${col.label}</th>
                `,
        )
        .join("")}
                ${hasActions ? '<th style="width: 100px;">Acciones</th>' : ""}
              </tr>
            </thead>
            <tbody>
              ${data
        .map(
          (row) => `
                <tr data-id="${row.id}">
                  ${columns
              .map(
                (col) => `
                    <td>${this._renderCell(row, col)}</td>
                  `,
              )
              .join("")}
                  ${hasActions
              ? `
                    <td>
                      <div class="table-actions">
                        ${actions
                .map(
                  (action) => `
                          <button 
                            class="table-action ${action.class || ""}" 
                            data-action="${action.name}"
                            data-id="${row.id}"
                            title="${action.label}"
                          >
                            <i class="${action.icon}"></i>
                          </button>
                        `,
                )
                .join("")}
                      </div>
                    </td>
                  `
              : ""
            }
                </tr>
              `,
        )
        .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `
  },

  /**
   * Render a cell value
   * @param {Object} row
   * @param {Object} col
   * @returns {string}
   * @private
   */
  _renderCell(row, col) {
    let value = row[col.key]

    if (col.key.includes(".")) {
      const keys = col.key.split(".")
      value = keys.reduce((obj, key) => obj?.[key], row)
    }

    if (col.formatter) {
      return col.formatter(value, row)
    }

    const formatDate = (val) => {
      if (typeof Helpers !== 'undefined' && Helpers.formatDate) return Helpers.formatDate(val);
      return new Date(val).toLocaleDateString('es-ES');
    };
    const formatPrice = (val) => {
      if (typeof Helpers !== 'undefined' && Helpers.formatPrice) return Helpers.formatPrice(val);
      return 'S/ ' + (val || 0).toFixed(2);
    };

    if (col.type === "date") {
      return value ? formatDate(value) : "-"
    }

    if (col.type === "datetime") {
      return value ? formatDate(value) : "-"
    }

    if (col.type === "price") {
      return formatPrice(value || 0)
    }

    if (col.type === "badge") {
      const badgeClass = col.badgeClass?.(value) || "badge-primary"
      return `<span class="badge ${badgeClass}">${value || "-"}</span>`
    }

    if (col.type === "image") {
      const src = value || "/frontend/assets/images/placeholder-book.png"
      return `<img src="${src}" alt="" style="width: 40px; height: 50px; object-fit: cover; border-radius: 4px;">`
    }

    if (col.type === "boolean") {
      return value ? '<i class="fas fa-check text-success"></i>' : '<i class="fas fa-times text-error"></i>'
    }

    const escapeHtml = (str) => {
      if (typeof Helpers !== 'undefined' && Helpers.escapeHtml) return Helpers.escapeHtml(str);
      return String(str).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" }[m]));
    };
    return value !== null && value !== undefined ? escapeHtml(String(value)) : "-"
  },

  /**
   * Render skeleton loading table
   * @param {number} columns
   * @returns {string}
   */
  renderSkeleton(columns = 4) {
    const rows = 5
    return `
      <div class="table-container">
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                ${Array(columns).fill('<th><div class="skeleton" style="height: 16px; width: 80%;"></div></th>').join("")}
              </tr>
            </thead>
            <tbody>
              ${Array(rows)
        .fill(`
                <tr>
                  ${Array(columns).fill('<td><div class="skeleton" style="height: 16px; width: 70%;"></div></td>').join("")}
                </tr>
              `)
        .join("")}
            </tbody>
          </table>
        </div>
      </div>
    `
  },

  /**
   * Bind table action events
   * @param {HTMLElement} container
   * @param {Object} handlers
   */
  bindEvents(container, handlers = {}) {
    container.querySelectorAll(".table-action").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.dataset.action
        const id = btn.dataset.id

        if (handlers[action]) {
          handlers[action](id)
        }
      })
    })
  },
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = Table
}

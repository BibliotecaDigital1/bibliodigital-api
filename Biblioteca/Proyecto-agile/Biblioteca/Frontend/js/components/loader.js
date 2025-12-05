const Loader = {
  /**
   * Show full page loader
   * @param {string} message
   */
  show(message = "Cargando...") {

    this.hide()

    const loader = document.createElement("div")
    loader.id = "page-loader"
    loader.className = "page-loader"
    loader.innerHTML = `
      <div class="loader-content">
        <div class="loader-spinner"></div>
        <p class="loader-message">${message}</p>
      </div>
    `

    if (!document.getElementById("loader-styles")) {
      const styles = document.createElement("style")
      styles.id = "loader-styles"
      styles.textContent = `
        .page-loader {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.2s ease;
        }

        .loader-content {
          text-align: center;
        }

        .loader-spinner {
          width: 48px;
          height: 48px;
          border: 3px solid rgba(99, 102, 241, 0.2);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin: 0 auto 16px;
        }

        .loader-message {
          color: #94a3b8;
          font-size: 14px;
          margin: 0;
        }

        .btn-loader {
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 2px solid transparent;
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .skeleton {
          background: linear-gradient(
            90deg,
            #334155 25%,
            #475569 50%,
            #334155 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }

        .skeleton-text {
          height: 16px;
          margin-bottom: 8px;
        }

        .skeleton-text:last-child {
          width: 60%;
        }

        .skeleton-title {
          height: 24px;
          width: 70%;
          margin-bottom: 16px;
        }

        .skeleton-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
        }

        .skeleton-image {
          height: 200px;
          margin-bottom: 16px;
        }

        .skeleton-card {
          padding: 20px;
          background: #1e293b;
          border-radius: 12px;
          border: 1px solid rgba(148, 163, 184, 0.1);
        }

        .skeleton-book-card {
          height: 320px;
        }

        .skeleton-table-row {
          display: flex;
          gap: 16px;
          padding: 16px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }

        .skeleton-table-cell {
          height: 20px;
          flex: 1;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `
      document.head.appendChild(styles)
    }

    document.body.appendChild(loader)
    document.body.style.overflow = "hidden"
  },

  hide() {
    const loader = document.getElementById("page-loader")
    if (loader) {
      loader.remove()
      document.body.style.overflow = ""
    }
  },

  /**
   * Add loading state to button
   * @param {HTMLElement} button
   * @param {boolean} loading
   */
  setButtonLoading(button, loading) {
    if (loading) {
      button.disabled = true
      button.dataset.originalText = button.innerHTML
      button.innerHTML = '<span class="btn-loader"></span>'
      button.classList.add("loading")
    } else {
      button.disabled = false
      button.innerHTML = button.dataset.originalText || button.innerHTML
      button.classList.remove("loading")
    }
  },

  /**
   * Generate skeleton card HTML
   * @param {string} type
   * @returns {string}
   */
  skeleton(type = "text") {
    switch (type) {
      case "book":
        return `
          <div class="skeleton-card skeleton-book-card">
            <div class="skeleton skeleton-image"></div>
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-text"></div>
            <div class="skeleton skeleton-text" style="width: 40%;"></div>
          </div>
        `

      case "table":
        return `
          <div class="skeleton-table-row">
            <div class="skeleton skeleton-table-cell" style="flex: 0.5;"></div>
            <div class="skeleton skeleton-table-cell" style="flex: 2;"></div>
            <div class="skeleton skeleton-table-cell"></div>
            <div class="skeleton skeleton-table-cell" style="flex: 0.5;"></div>
          </div>
        `.repeat(5)

      case "stats":
        return `
          <div class="skeleton-card">
            <div class="skeleton skeleton-avatar" style="margin-bottom: 16px;"></div>
            <div class="skeleton skeleton-title" style="width: 50%;"></div>
            <div class="skeleton skeleton-text" style="width: 70%;"></div>
          </div>
        `

      default:
        return `
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text"></div>
        `
    }
  },

  /**
   * Generate multiple skeleton cards
   * @param {string} type
   * @param {number} count
   * @returns {string}
   */
  skeletons(type, count) {
    return Array(count).fill(this.skeleton(type)).join("")
  },
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = Loader
}

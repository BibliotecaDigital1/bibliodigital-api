const Toast = {
  container: null,
  queue: [],
  maxToasts: 3,

  init() {
    if (this.container) return

    this.container = document.createElement("div")
    this.container.className = "toast-container"
    this.container.setAttribute("aria-live", "polite")
    this.container.setAttribute("aria-atomic", "true")
    document.body.appendChild(this.container)

    if (!document.getElementById("toast-styles")) {
      const styles = document.createElement("style")
      styles.id = "toast-styles"
      styles.textContent = `
        .toast-container {
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-width: 400px;
          width: calc(100% - 40px);
        }

        .toast {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: rgba(30, 41, 59, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 12px;
          box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
          animation: toastSlideIn 0.3s ease forwards;
          border-left: 4px solid var(--primary);
        }

        .toast.toast-success { border-left-color: #10b981; }
        .toast.toast-error { border-left-color: #ef4444; }
        .toast.toast-warning { border-left-color: #f59e0b; }
        .toast.toast-info { border-left-color: #3b82f6; }

        .toast.toast-exit {
          animation: toastSlideOut 0.3s ease forwards;
        }

        .toast-icon {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          font-size: 14px;
        }

        .toast-success .toast-icon {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .toast-error .toast-icon {
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .toast-warning .toast-icon {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .toast-info .toast-icon {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
        }

        .toast-content {
          flex: 1;
          min-width: 0;
        }

        .toast-title {
          font-weight: 600;
          font-size: 14px;
          color: #f1f5f9;
          margin-bottom: 4px;
        }

        .toast-message {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.4;
        }

        .toast-close {
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 4px;
          border-radius: 4px;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .toast-close:hover {
          background: rgba(148, 163, 184, 0.1);
          color: #f1f5f9;
        }

        .toast-progress {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 3px;
          background: var(--primary);
          border-radius: 0 0 0 12px;
          animation: toastProgress linear forwards;
        }

        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes toastSlideOut {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(100%);
          }
        }

        @keyframes toastProgress {
          from { width: 100%; }
          to { width: 0%; }
        }

        @media (max-width: 480px) {
          .toast-container {
            top: auto;
            bottom: 20px;
            left: 20px;
            right: 20px;
          }
        }
      `
      document.head.appendChild(styles)
    }
  },

  /**
   * Show a toast notification
   * @param {string} message
   * @param {string} type
   * @param {number} duration
   * @param {string} title
   */
  show(message, type = "info", duration = 3000, title = "") {
    this.init()

    const currentToasts = this.container.querySelectorAll(".toast:not(.toast-exit)")
    if (currentToasts.length >= this.maxToasts) {
      this.dismiss(currentToasts[0])
    }

    const icons = {
      success: '<i class="fas fa-check"></i>',
      error: '<i class="fas fa-times"></i>',
      warning: '<i class="fas fa-exclamation"></i>',
      info: '<i class="fas fa-info"></i>',
    }

    const titles = {
      success: "Éxito",
      error: "Error",
      warning: "Advertencia",
      info: "Información",
    }

    const toast = document.createElement("div")
    toast.className = `toast toast-${type}`
    toast.innerHTML = `
      <div class="toast-icon">${icons[type]}</div>
      <div class="toast-content">
        <div class="toast-title">${title || titles[type]}</div>
        <div class="toast-message">${message}</div>
      </div>
      <button class="toast-close" aria-label="Cerrar">
        <i class="fas fa-times"></i>
      </button>
      <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
    `

    toast.querySelector(".toast-close").addEventListener("click", () => {
      this.dismiss(toast)
    })

    this.container.appendChild(toast)

    setTimeout(() => {
      this.dismiss(toast)
    }, duration)

    return toast
  },

  /**
   * Dismiss a toast
   * @param {HTMLElement} toast
   */
  dismiss(toast) {
    if (!toast || toast.classList.contains("toast-exit")) return

    toast.classList.add("toast-exit")
    setTimeout(() => {
      toast.remove()
    }, 300)
  },

  /**
   * Show success toast
   * @param {string} message
   * @param {number} duration
   */
  success(message, duration = 3000) {
    return this.show(message, "success", duration)
  },

  /**
   * Show error toast
   * @param {string} message
   * @param {number} duration
   */
  error(message, duration = 4000) {
    return this.show(message, "error", duration)
  },

  /**
   * Show warning toast
   * @param {string} message
   * @param {number} duration
   */
  warning(message, duration = 3500) {
    return this.show(message, "warning", duration)
  },

  /**
   * Show info toast
   * @param {string} message
   * @param {number} duration
   */
  info(message, duration = 3000) {
    return this.show(message, "info", duration)
  },

  clearAll() {
    if (!this.container) return
    const toasts = this.container.querySelectorAll(".toast")
    toasts.forEach((toast) => this.dismiss(toast))
  },
}

document.addEventListener("DOMContentLoaded", () => Toast.init())

if (typeof module !== "undefined" && module.exports) {
  module.exports = Toast
}

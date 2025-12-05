const Modal = {
  activeModal: null,
  overlay: null,

  init() {

    if (!this.overlay) {
      this.overlay = document.createElement("div")
      this.overlay.className = "modal-overlay"
      this.overlay.addEventListener("click", (e) => {
        if (e.target === this.overlay) {
          this.close()
        }
      })
      document.body.appendChild(this.overlay)
    }

    if (!document.getElementById("modal-styles")) {
      const styles = document.createElement("style")
      styles.id = "modal-styles"
      styles.textContent = `
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          z-index: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s ease;
        }

        .modal-overlay.active {
          opacity: 1;
          visibility: visible;
        }

        .modal {
          background: #1e293b;
          border: 1px solid rgba(148, 163, 184, 0.1);
          border-radius: 16px;
          width: 100%;
          max-width: 500px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transform: scale(0.95) translateY(20px);
          opacity: 0;
          transition: all 0.3s ease;
        }

        .modal-overlay.active .modal {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        .modal-sm { max-width: 400px; }
        .modal-lg { max-width: 700px; }
        .modal-xl { max-width: 900px; }
        .modal-full { max-width: calc(100vw - 40px); max-height: calc(100vh - 40px); }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }

        .modal-title {
          font-family: 'Poppins', sans-serif;
          font-size: 1.25rem;
          font-weight: 600;
          color: #f1f5f9;
          margin: 0;
        }

        .modal-close {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: #94a3b8;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .modal-close:hover {
          background: #334155;
          color: #f1f5f9;
        }

        .modal-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }

        .modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 12px;
          padding: 16px 24px;
          border-top: 1px solid rgba(148, 163, 184, 0.1);
          background: #334155;
        }

        @media (max-width: 640px) {
          .modal {
            max-height: 100vh;
            border-radius: 16px 16px 0 0;
            margin-top: auto;
          }

          .modal-overlay {
            align-items: flex-end;
            padding: 0;
          }
        }
      `
      document.head.appendChild(styles)
    }

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.activeModal) {
        this.close()
      }
    })
  },

  /**
   * Open a modal
   * @param {Object} options
   * @param {string} options.title
   * @param {string} options.content
   * @param {Array} options.buttons
   * @param {string} options.size
   * @param {Function} options.onOpen
   * @param {Function} options.onClose
   */
  open(options = {}) {
    this.init()

    const { title = "", content = "", buttons = [], size = "", onOpen = null, onClose = null } = options

    const modal = document.createElement("div")
    modal.className = `modal ${size ? `modal-${size}` : ""}`

    let buttonsHtml = ""
    if (buttons.length > 0) {
      buttonsHtml = `
        <div class="modal-footer">
          ${buttons
            .map(
              (btn, index) => `
            <button class="btn ${btn.class || "btn-ghost"}" data-btn-index="${index}">
              ${btn.text}
            </button>
          `,
            )
            .join("")}
        </div>
      `
    }

    modal.innerHTML = `
      <div class="modal-header">
        <h3 class="modal-title">${title}</h3>
        <button class="modal-close" aria-label="Cerrar modal">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        ${content}
      </div>
      ${buttonsHtml}
    `

    modal.querySelector(".modal-close").addEventListener("click", () => {
      this.close()
    })

    buttons.forEach((btn, index) => {
      const btnElement = modal.querySelector(`[data-btn-index="${index}"]`)
      if (btnElement && btn.onClick) {
        btnElement.addEventListener("click", () => {
          btn.onClick(modal)
        })
      }
    })

    modal._onClose = onClose

    this.overlay.innerHTML = ""
    this.overlay.appendChild(modal)
    this.activeModal = modal

    document.body.style.overflow = "hidden"
    requestAnimationFrame(() => {
      this.overlay.classList.add("active")
    })

    if (onOpen) onOpen(modal)

    return modal
  },

  close() {
    if (!this.activeModal) return

    const modal = this.activeModal
    const onClose = modal._onClose

    this.overlay.classList.remove("active")
    document.body.style.overflow = ""

    setTimeout(() => {
      modal.remove()
      this.activeModal = null
      if (onClose) onClose()
    }, 300)
  },

  /**
   * Confirm dialog
   * @param {string} message
   * @param {Object} options
   * @returns {Promise<boolean>}
   */
  confirm(message, options = {}) {
    return new Promise((resolve) => {
      this.open({
        title: options.title || "Confirmar",
        content: `<p style="color: #94a3b8; margin: 0;">${message}</p>`,
        size: "sm",
        buttons: [
          {
            text: options.cancelText || "Cancelar",
            class: "btn-ghost",
            onClick: () => {
              this.close()
              resolve(false)
            },
          },
          {
            text: options.confirmText || "Confirmar",
            class: options.danger ? "btn-danger" : "btn-primary",
            onClick: () => {
              this.close()
              resolve(true)
            },
          },
        ],
      })
    })
  },

  /**
   * Alert dialog
   * @param {string} message
   * @param {string} title
   * @returns {Promise<void>}
   */
  alert(message, title = "Aviso") {
    return new Promise((resolve) => {
      this.open({
        title,
        content: `<p style="color: #94a3b8; margin: 0;">${message}</p>`,
        size: "sm",
        buttons: [
          {
            text: "Aceptar",
            class: "btn-primary",
            onClick: () => {
              this.close()
              resolve()
            },
          },
        ],
      })
    })
  },

  /**
   * Get the modal body element
   * @returns {HTMLElement|null}
   */
  getBody() {
    return this.activeModal?.querySelector(".modal-body") || null
  },

  /**
   * Update modal content
   * @param {string} content
   */
  updateContent(content) {
    const body = this.getBody()
    if (body) {
      body.innerHTML = content
    }
  },
}

document.addEventListener("DOMContentLoaded", () => Modal.init())

if (typeof module !== "undefined" && module.exports) {
  module.exports = Modal
}

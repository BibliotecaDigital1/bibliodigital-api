const API_CONFIG = {

  BASE_URL: "http://localhost:8080/api/v1",

  TIMEOUT: 30000,

  ENDPOINTS: {

    AUTH: {
      LOGIN: "/auth/login",
      REGISTER_CUSTOMER: "/auth/register/customer",
      REGISTER_AUTHOR: "/auth/register/author",
    },

    BOOKS: {
      RECENT: "/books/recent",
      LIST: "/books",
      DETAIL: (id) => `/books/${id}`,
    },

    ADMIN_CATEGORIES: {
      LIST: "/admin/categories",
      PAGE: "/admin/categories/page",
      DETAIL: (id) => `/admin/categories/${id}`,
    },

    ADMIN_AUTHORS: {
      LIST: "/admin/authors",
      PAGE: "/admin/authors/page",
      DETAIL: (id) => `/admin/authors/${id}`,
    },

    ADMIN_BOOKS: {
      LIST: "/admin/books",
      PAGE: "/admin/books/page",
      DETAIL: (id) => `/admin/books/${id}`,
    },

    PURCHASES: {
      CREATE: "/purchases",
      USER: "/purchases/user",
      REPORT: "/purchases/report",
      DETAIL: (id) => `/purchases/${id}`,
      CONFIRM: (id) => `/purchases/confirm/${id}`,
    },

    COLLECTIONS: {
      CREATE: "/collections",
      USER: (userId) => `/collections/user/${userId}`,
      DETAIL: (id) => `/collections/${id}`,
    },

    COLLECTION_BOOKS: {
      ADD: (collectionId) => `/collections-books/${collectionId}/add-book`,
      REMOVE: (collectionId, bookId) => `/collections-books/${collectionId}/remove-book/${bookId}`,
      LIST: (collectionId) => `/collections-books/${collectionId}/books`,
    },

    USER: {
      PROFILE: (id) => `/user/profile/${id}`,
    },

    MEDIA: {
      UPLOAD: "/media/upload",
      GET: (filename) => `/media/${filename}`,
    },
  },

  PAGINATION: {
    DEFAULT_PAGE: 0,
    DEFAULT_SIZE: 10,
    ADMIN_TABLE_SIZE: 5,
  },

  STORAGE_KEYS: {
    AUTH_TOKEN: "authToken",
    USER_PROFILE: "userProfile",
    CART: "cart",
    THEME: "theme",
  },

  ROLES: {
    ADMIN: "ADMIN",
    CUSTOMER: "CUSTOMER",
    AUTHOR: "AUTHOR",
  },

  PURCHASE_STATUS: {
    PENDING: "PENDING",
    PAID: "PAID",
    CANCELLED: "CANCELLED",
  },
}

Object.freeze(API_CONFIG)
Object.freeze(API_CONFIG.ENDPOINTS)
Object.freeze(API_CONFIG.PAGINATION)
Object.freeze(API_CONFIG.STORAGE_KEYS)
Object.freeze(API_CONFIG.ROLES)
Object.freeze(API_CONFIG.PURCHASE_STATUS)

if (typeof module !== "undefined" && module.exports) {
  module.exports = API_CONFIG
}

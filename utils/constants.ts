// API endpoints
export const API_ENDPOINTS = {
  LOGIN: "/api/user/login",
  REGISTER: "/api/user/register",
  PRODUCTS: "/api/products",
  PRODUCT_TYPES: "/api/product-types",
  SALES: "/api/employee/sell-product",
  MY_SALES: "/api/employee/my-sales",
  PENDING_SALES: "/api/admin/pending-sales",
  REPORTS: "/api/reports",
}

// Local storage keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
  OFFLINE_ACTIONS: "offline_actions",
  OFFLINE_PRODUCTS: "offline_products",
  OFFLINE_SALES: "offline_sales",
}

// App constants
export const APP_CONSTANTS = {
  APP_NAME: "StockTrack",
  APP_VERSION: "1.0.0",
  LOW_STOCK_THRESHOLD: 10,
}

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error. Please check your internet connection.",
  UNAUTHORIZED: "Unauthorized. Please login again.",
  SERVER_ERROR: "Server error. Please try again later.",
  VALIDATION_ERROR: "Please check your input and try again.",
}

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  PRODUCT_CREATED: "Product created successfully",
  STOCK_UPDATED: "Stock updated successfully",
  SALE_RECORDED: "Sale recorded successfully",
  PROFILE_UPDATED: "Profile updated successfully",
  PASSWORD_CHANGED: "Password changed successfully",
}

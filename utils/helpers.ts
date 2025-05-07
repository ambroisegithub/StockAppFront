import { Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { STORAGE_KEYS } from "./constants"

// Format currency
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`
}

// Format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

// Format date and time
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Generate a unique ID
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Check if device is iOS
export const isIOS = Platform.OS === "ios"

// Check if device is Android
export const isAndroid = Platform.OS === "android"

// Get user role from AsyncStorage
export const getUserRole = async (): Promise<string | null> => {
  try {
    const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER)
    if (userJson) {
      const user = JSON.parse(userJson)
      return user.role
    }
    return null
  } catch (error) {
    console.error("Error getting user role:", error)
    return null
  }
}

// Check if user is admin
export const isUserAdmin = async (): Promise<boolean> => {
  const role = await getUserRole()
  return role === "admin"
}

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substr(0, maxLength) + "..."
}

// Calculate profit margin
export const calculateProfitMargin = (price: number, costPrice: number): number => {
  if (price === 0) return 0
  return ((price - costPrice) / price) * 100
}

// Get date range for reports
export const getDateRange = (period: "daily" | "weekly" | "monthly") => {
  const today = new Date()
  const startDate = new Date()

  if (period === "daily") {
    startDate.setHours(0, 0, 0, 0)
  } else if (period === "weekly") {
    startDate.setDate(today.getDate() - 7)
  } else if (period === "monthly") {
    startDate.setMonth(today.getMonth() - 1)
  }

  return {
    startDate: startDate.toISOString().split("T")[0],
    endDate: today.toISOString().split("T")[0],
  }
}

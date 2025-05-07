import axios from "axios"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { store } from "../redux/store"
import { logout } from "../redux/slices/authSlice"
import NetInfo from "@react-native-community/netinfo"

// Create axios instance
const api = axios.create({
  baseURL: "http://your-api-url.com", // Replace with your actual API URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    // Check if we're online
    const netInfo = await NetInfo.fetch()
    if (!netInfo.isConnected) {
      throw new Error("No internet connection")
    }

    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem("token")

    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      // Dispatch logout action
      store.dispatch(logout())
    }

    return Promise.reject(error)
  },
)

export default api

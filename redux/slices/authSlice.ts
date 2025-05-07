import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import AsyncStorage from "@react-native-async-storage/async-storage"
import api from "../../utils/api"
import { syncOfflineData } from "../../utils/offlineSync"

interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  telephone: string
  role: string
  isVerified: boolean
  isFirstLogin: boolean
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials: { username: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/user/login", credentials)

      // Store token and user in AsyncStorage
      await AsyncStorage.setItem("token", response.data.token)
      await AsyncStorage.setItem("user", JSON.stringify(response.data.data.user))

      // Sync any offline data
      await syncOfflineData()

      return {
        token: response.data.token,
        user: response.data.data.user,
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Login failed. Please check your credentials.")
    }
  },
)

export const registerUser = createAsyncThunk("auth/register", async (userData: any, { rejectWithValue }) => {
  try {
    const response = await api.post("/api/user/register", userData)
    return response.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Registration failed. Please try again.")
  }
})

export const requestPasswordReset = createAsyncThunk(
  "auth/requestPasswordReset",
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/user/forgot-password", { email })
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Password reset request failed. Please try again.")
    }
  },
)

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (passwordData: { currentPassword: string; newPassword: string }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/user/change-password", passwordData)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Password change failed. Please try again.")
    }
  },
)

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData: any, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as { auth: AuthState }
      const userId = auth.user?.id

      const response = await api.put(`/api/user/${userId}`, profileData)

      // Update user in AsyncStorage
      await AsyncStorage.setItem("user", JSON.stringify(response.data.data))

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Profile update failed. Please try again.")
    }
  },
)

export const restoreAuth = createAsyncThunk("auth/restore", async (_, { rejectWithValue }) => {
  try {
    const token = await AsyncStorage.getItem("token")
    const userJson = await AsyncStorage.getItem("user")

    if (token && userJson) {
      const user = JSON.parse(userJson)
      return { token, user }
    }

    return { token: null, user: null }
  } catch (error) {
    return rejectWithValue("Failed to restore authentication state")
  }
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false

      // Clear AsyncStorage
      AsyncStorage.removeItem("token")
      AsyncStorage.removeItem("user")
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false
      state.isAuthenticated = true
      state.user = action.payload.user
      state.token = action.payload.token
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(registerUser.fulfilled, (state) => {
      state.isLoading = false
    })
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Restore Auth
    builder.addCase(restoreAuth.pending, (state) => {
      state.isLoading = true
    })
    builder.addCase(restoreAuth.fulfilled, (state, action) => {
      state.isLoading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = !!action.payload.token
    })
    builder.addCase(restoreAuth.rejected, (state) => {
      state.isLoading = false
      state.isAuthenticated = false
    })

    // Update Profile
    builder.addCase(updateProfile.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(updateProfile.fulfilled, (state, action) => {
      state.isLoading = false
      state.user = action.payload
    })
    builder.addCase(updateProfile.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })

    // Change Password
    builder.addCase(changePassword.pending, (state) => {
      state.isLoading = true
      state.error = null
    })
    builder.addCase(changePassword.fulfilled, (state) => {
      state.isLoading = false
    })
    builder.addCase(changePassword.rejected, (state, action) => {
      state.isLoading = false
      state.error = action.payload as string
    })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer

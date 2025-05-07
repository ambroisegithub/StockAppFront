import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/api"
import { saveOfflineAction } from "../../utils/offlineSync"

interface Sale {
  id: number
  product: {
    id: number
    name: string
  }
  qtySold: number
  totalPrice: number
  profit: number
  status: "pending" | "approved" | "rejected"
  salesDate: string
}

interface SalesState {
  sales: Sale[]
  pendingSales: Sale[]
  loading: boolean
  error: string | null
}

const initialState: SalesState = {
  sales: [],
  pendingSales: [],
  loading: false,
  error: null,
}

export const fetchMySales = createAsyncThunk("sales/fetchMySales", async (params: any = {}, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/employee/my-sales", { params })
    return response.data.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch sales")
  }
})

export const fetchPendingSales = createAsyncThunk("sales/fetchPendingSales", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/admin/pending-sales")
    return response.data.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch pending sales")
  }
})

export const recordSale = createAsyncThunk(
  "sales/recordSale",
  async (saleData: { productId: number; qtySold: number }, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/employee/sell-product", saleData)
      return response.data.data
    } catch (error: any) {
      // If offline, save action for later sync
      if (!navigator.onLine) {
        await saveOfflineAction({
          type: "RECORD_SALE",
          payload: saleData,
          timestamp: new Date().toISOString(),
        })
        return { success: true, offlineSync: true }
      }

      return rejectWithValue(error.response?.data?.message || "Failed to record sale")
    }
  },
)

export const approveSale = createAsyncThunk(
  "sales/approveSale",
  async (saleId: number, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post(`/api/admin/approve-sale/${saleId}`)

      // Refresh pending sales after approving
      dispatch(fetchPendingSales())

      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to approve sale")
    }
  },
)

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch My Sales
    builder.addCase(fetchMySales.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchMySales.fulfilled, (state, action) => {
      state.loading = false
      state.sales = action.payload
    })
    builder.addCase(fetchMySales.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Fetch Pending Sales
    builder.addCase(fetchPendingSales.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchPendingSales.fulfilled, (state, action) => {
      state.loading = false
      state.pendingSales = action.payload
    })
    builder.addCase(fetchPendingSales.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Record Sale
    builder.addCase(recordSale.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(recordSale.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(recordSale.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Approve Sale
    builder.addCase(approveSale.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(approveSale.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(approveSale.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

export const { clearError } = salesSlice.actions
export default salesSlice.reducer

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/api"

interface ReportState {
  reports: any
  loading: boolean
  error: string | null
}

const initialState: ReportState = {
  reports: null,
  loading: false,
  error: null,
}

export const fetchReports = createAsyncThunk("reports/fetchReports", async (_, { rejectWithValue }) => {
  try {
    // Fetch multiple reports in parallel
    const [salesResponse, inventoryResponse, profitResponse] = await Promise.all([
      api.get("/api/reports/sales-performance", {
        params: {
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date().toISOString().split("T")[0],
        },
      }),
      api.get("/api/reports/inventory-value"),
      api.get("/api/reports/product-type/1/profit"), // Default to first product type
    ])

    return {
      salesReport: salesResponse.data.data,
      inventoryReport: inventoryResponse.data.data,
      profitReport: profitResponse.data.data,
    }
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch reports")
  }
})

export const fetchSalesReport = createAsyncThunk(
  "reports/fetchSalesReport",
  async (params: { startDate: string; endDate: string; productTypeId?: number }, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/reports/sales-performance", { params })
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch sales report")
    }
  },
)

export const fetchInventoryReport = createAsyncThunk("reports/fetchInventoryReport", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/reports/inventory-value")
    return response.data.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch inventory report")
  }
})

export const fetchProductTypeProfitReport = createAsyncThunk(
  "reports/fetchProductTypeProfitReport",
  async (productTypeId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/reports/product-type/${productTypeId}/profit`)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch profit report")
    }
  },
)

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Reports
    builder.addCase(fetchReports.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchReports.fulfilled, (state, action) => {
      state.loading = false
      state.reports = action.payload
    })
    builder.addCase(fetchReports.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Fetch Sales Report
    builder.addCase(fetchSalesReport.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchSalesReport.fulfilled, (state, action) => {
      state.loading = false
      state.reports = { ...state.reports, salesReport: action.payload }
    })
    builder.addCase(fetchSalesReport.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Fetch Inventory Report
    builder.addCase(fetchInventoryReport.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchInventoryReport.fulfilled, (state, action) => {
      state.loading = false
      state.reports = { ...state.reports, inventoryReport: action.payload }
    })
    builder.addCase(fetchInventoryReport.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Fetch Product Type Profit Report
    builder.addCase(fetchProductTypeProfitReport.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchProductTypeProfitReport.fulfilled, (state, action) => {
      state.loading = false
      state.reports = { ...state.reports, profitReport: action.payload }
    })
    builder.addCase(fetchProductTypeProfitReport.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

export const { clearError } = reportSlice.actions
export default reportSlice.reducer

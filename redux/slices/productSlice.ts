import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../utils/api"
import { saveOfflineAction } from "../../utils/offlineSync"

interface ProductType {
  id: number
  name: string
  description: string
}

interface Product {
  id: number
  name: string
  productType: ProductType
  price: number
  costPrice: number
  qtyInStock: number
  description?: string
  sku?: string
  size?: string
  color?: string
}

interface ProductState {
  products: Product[]
  productTypes: ProductType[]
  productDetails: any | null
  searchResults: Product[]
  loading: boolean
  error: string | null
}

const initialState: ProductState = {
  products: [],
  productTypes: [],
  productDetails: null,
  searchResults: [],
  loading: false,
  error: null,
}

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (params: any = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/products", { params })
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products")
    }
  },
)

export const fetchProductTypes = createAsyncThunk("products/fetchProductTypes", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/api/product-types")
    return response.data.data
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch product types")
  }
})

export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/products/${productId}`)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch product details")
    }
  },
)

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData: any, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post("/api/products", productData)

      // Refresh product list after creating a new product
      dispatch(fetchProducts({}))

      return response.data.data
    } catch (error: any) {
      // If offline, save action for later sync
      if (!navigator.onLine) {
        await saveOfflineAction({
          type: "CREATE_PRODUCT",
          payload: productData,
          timestamp: new Date().toISOString(),
        })
        return { ...productData, id: `offline_${Date.now()}` }
      }

      return rejectWithValue(error.response?.data?.message || "Failed to create product")
    }
  },
)

export const updateStock = createAsyncThunk(
  "products/updateStock",
  async (
    stockData: {
      productId: number
      type: "in" | "out"
      quantity: number
      reason: string
      costPrice?: number
    },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await api.post(`/api/products/${stockData.productId}/stock`, stockData)

      // Refresh product details after updating stock
      dispatch(fetchProductDetails(stockData.productId))

      return response.data.data
    } catch (error: any) {
      // If offline, save action for later sync
      if (!navigator.onLine) {
        await saveOfflineAction({
          type: "UPDATE_STOCK",
          payload: stockData,
          timestamp: new Date().toISOString(),
        })
        return { success: true, offlineSync: true }
      }

      return rejectWithValue(error.response?.data?.message || "Failed to update stock")
    }
  },
)

export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/products", {
        params: { search: query },
      })
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to search products")
    }
  },
)

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductDetails: (state) => {
      state.productDetails = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchProducts.fulfilled, (state, action) => {
      state.loading = false
      state.products = action.payload
    })
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Fetch Product Types
    builder.addCase(fetchProductTypes.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchProductTypes.fulfilled, (state, action) => {
      state.loading = false
      state.productTypes = action.payload
    })
    builder.addCase(fetchProductTypes.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Fetch Product Details
    builder.addCase(fetchProductDetails.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchProductDetails.fulfilled, (state, action) => {
      state.loading = false
      state.productDetails = action.payload
    })
    builder.addCase(fetchProductDetails.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Create Product
    builder.addCase(createProduct.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(createProduct.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(createProduct.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Update Stock
    builder.addCase(updateStock.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(updateStock.fulfilled, (state) => {
      state.loading = false
    })
    builder.addCase(updateStock.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Search Products
    builder.addCase(searchProducts.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(searchProducts.fulfilled, (state, action) => {
      state.loading = false
      state.searchResults = action.payload
    })
    builder.addCase(searchProducts.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })
  },
})

export const { clearProductDetails, clearError } = productSlice.actions
export default productSlice.reducer

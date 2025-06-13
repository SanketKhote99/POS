import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Product } from "../../types/types"

interface ProductsState {
  products: Product[]
  isLoading: boolean
  error: string | null
}

const INITIAL_PRODUCTS: Product[] = [
  { id: "bread", name: "Bread", price: 1.1 },
  { id: "milk", name: "Milk", price: 0.5 },
  { id: "cheese", name: "Cheese", price: 0.9 },
  { id: "soup", name: "Soup", price: 0.6 },
  { id: "butter", name: "Butter", price: 1.2 },
]

const initialState: ProductsState = {
  products: INITIAL_PRODUCTS,
  isLoading: false,
  error: null,
}

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProductsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload
      state.isLoading = false
      state.error = null
    },

    setProductsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
      state.isLoading = false
    },

    updateProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = action.payload
      }
    },

    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload)
    },

    removeProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload)
    },
  },
})

export const { setProductsLoading, setProducts, setProductsError, updateProduct, addProduct, removeProduct } =
  productsSlice.actions

export default productsSlice.reducer

// Selectors
export const selectProducts = (state: { products: ProductsState }) => state.products.products
export const selectProductsLoading = (state: { products: ProductsState }) => state.products.isLoading
export const selectProductsError = (state: { products: ProductsState }) => state.products.error
export const selectProductById = (state: { products: ProductsState }, productId: string) =>
  state.products.products.find((p) => p.id === productId)

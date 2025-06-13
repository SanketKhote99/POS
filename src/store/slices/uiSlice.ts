import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type LoadingOperation = "add" | "increment" | "decrement" | "remove"

interface LoadingState {
  productId: string
  operation: LoadingOperation
}

interface UIState {
  isInitialLoading: boolean
  loadingStates: LoadingState[]
  toastQueue: Array<{
    id: string
    title: string
    description: string
    variant?: "default" | "destructive"
  }>
}

const initialState: UIState = {
  isInitialLoading: true,
  loadingStates: [],
  toastQueue: [],
}

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setInitialLoading: (state, action: PayloadAction<boolean>) => {
      state.isInitialLoading = action.payload
    },

    setLoading: (state, action: PayloadAction<LoadingState>) => {
      // Remove any existing loading state for this product
      state.loadingStates = state.loadingStates.filter((loading) => loading.productId !== action.payload.productId)
      // Add new loading state
      state.loadingStates.push(action.payload)
    },

    clearLoading: (state, action: PayloadAction<string>) => {
      state.loadingStates = state.loadingStates.filter((loading) => loading.productId !== action.payload)
    },

    clearAllLoading: (state) => {
      state.loadingStates = []
    },

    addToast: (
      state,
      action: PayloadAction<{
        title: string
        description: string
        variant?: "default" | "destructive"
      }>,
    ) => {
      const toast = {
        id: Date.now().toString(),
        ...action.payload,
      }
      state.toastQueue.push(toast)
    },

    removeToast: (state, action: PayloadAction<string>) => {
      state.toastQueue = state.toastQueue.filter((toast) => toast.id !== action.payload)
    },
  },
})

export const { setInitialLoading, setLoading, clearLoading, clearAllLoading, addToast, removeToast } = uiSlice.actions

export default uiSlice.reducer

// Selectors
export const selectIsInitialLoading = (state: { ui: UIState }) => state.ui.isInitialLoading
export const selectLoadingStates = (state: { ui: UIState }) => state.ui.loadingStates
export const selectIsProductLoading = (state: { ui: UIState }, productId: string, operation: LoadingOperation) =>
  state.ui.loadingStates.some((loading) => loading.productId === productId && loading.operation === operation)
export const selectIsAnyProductLoading = (state: { ui: UIState }, productId: string) =>
  state.ui.loadingStates.some((loading) => loading.productId === productId)
export const selectToastQueue = (state: { ui: UIState }) => state.ui.toastQueue

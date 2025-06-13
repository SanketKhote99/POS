import { configureStore } from "@reduxjs/toolkit"
import cartReducer from "./slices/cartSlice"
import uiReducer from "./slices/uiSlice"
import productsReducer from "./slices/productsSlice"

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    ui: uiReducer,
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CartItem, Product, AppliedOffer } from "../types/types"

interface OperationLoading {
  type: "add" | "update" | "remove"
  productId: string
}

interface CartState {
  items: CartItem[]
  subtotal: number
  totalSavings: number
  finalTotal: number
  appliedOffers: AppliedOffer[]
  isLoading: boolean
  operationLoading: OperationLoading | null
}

const initialState: CartState = {
  items: [],
  subtotal: 0,
  totalSavings: 0,
  finalTotal: 0,
  appliedOffers: [],
  isLoading: false,
  operationLoading: null,
}

// Special offer calculation functions
const calculateSpecialOffers = (items: CartItem[]): { savings: number; offers: AppliedOffer[] } => {
  let totalSavings = 0
  const appliedOffers: AppliedOffer[] = []

  items.forEach((item) => {
    const { product, quantity } = item
    let itemSavings = 0

    switch (product.id) {
      case "cheese":
        // Buy one cheese, get second free
        if (quantity >= 2) {
          const freeItems = Math.floor(quantity / 2)
          itemSavings = freeItems * product.price
          appliedOffers.push({
            productId: product.id,
            description: `Buy ${product.name}, get second free! (${freeItems} free)`,
            savings: itemSavings,
          })
        }
        break

      case "soup":
        // Buy soup, get half price bread
        const breadItem = items.find((i) => i.product.id === "bread")
        if (breadItem) {
          const breadDiscount = Math.min(quantity, breadItem.quantity) * (1.1 / 2)
          itemSavings = breadDiscount
          appliedOffers.push({
            productId: "bread",
            description: `Buy ${product.name}, get half price Bread!`,
            savings: itemSavings,
          })
        }
        break

      case "butter":
        // Get 1/3 off butter
        itemSavings = quantity * product.price * (1 / 3)
        appliedOffers.push({
          productId: product.id,
          description: `Get 1/3 off ${product.name}!`,
          savings: itemSavings,
        })
        break

      default:
        break
    }

    totalSavings += itemSavings
  })

  return { savings: totalSavings, offers: appliedOffers }
}

const calculateTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const { savings, offers } = calculateSpecialOffers(items)

  // Update item total prices with savings applied
  const updatedItems = items.map((item) => {
    const itemOffer = offers.find((offer) => offer.productId === item.product.id)
    const itemSavings = itemOffer ? itemOffer.savings : 0
    const totalPrice = item.product.price * item.quantity - itemSavings

    return {
      ...item,
      totalPrice,
    }
  })

  return {
    items: updatedItems,
    subtotal,
    totalSavings: savings,
    finalTotal: subtotal - savings,
    appliedOffers: offers,
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<OperationLoading>) => {
      state.operationLoading = action.payload
    },

    clearLoading: (state) => {
      state.operationLoading = null
    },

    addToCart: (state, action: PayloadAction<Product>) => {
      const existingItem = state.items.find((item) => item.product.id === action.payload.id)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({
          product: action.payload,
          quantity: 1,
          totalPrice: action.payload.price,
        })
      }

      const calculated = calculateTotals(state.items)
      Object.assign(state, calculated)
      state.operationLoading = null
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.product.id !== action.payload)
      const calculated = calculateTotals(state.items)
      Object.assign(state, calculated)
      state.operationLoading = null
    },

    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find((item) => item.product.id === action.payload.productId)
      if (item) {
        item.quantity = action.payload.quantity
      }
      const calculated = calculateTotals(state.items)
      Object.assign(state, calculated)
      state.operationLoading = null
    },

    clearCart: (state) => {
      Object.assign(state, initialState)
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart, setLoading, clearLoading } = cartSlice.actions
export default cartSlice.reducer

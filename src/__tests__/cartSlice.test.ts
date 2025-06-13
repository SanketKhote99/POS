import { configureStore } from "@reduxjs/toolkit"
import cartReducer, { addToCart, removeFromCart, updateQuantity, clearCart, setLoading } from "../store/cartSlice"
import type { Product } from "../types/types"

const mockProducts: Product[] = [
  { id: "bread", name: "Bread", price: 1.1 },
  { id: "cheese", name: "Cheese", price: 0.9 },
  { id: "soup", name: "Soup", price: 0.6 },
  { id: "butter", name: "Butter", price: 1.2 },
]

describe("cartSlice", () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        cart: cartReducer,
      },
    })
  })

  test("should set loading state", () => {
    store.dispatch(setLoading({ type: "add", productId: "bread" }))
    const state = store.getState().cart

    expect(state.operationLoading).toEqual({ type: "add", productId: "bread" })
  })

  test("should add item to cart and clear loading", () => {
    store.dispatch(addToCart(mockProducts[0]))
    const state = store.getState().cart

    expect(state.items).toHaveLength(1)
    expect(state.items[0].product.name).toBe("Bread")
    expect(state.items[0].quantity).toBe(1)
    expect(state.subtotal).toBe(1.1)
    expect(state.operationLoading).toBeNull()
  })

  test("should apply cheese special offer (buy one get one free)", () => {
    // Add 2 cheese items
    store.dispatch(addToCart(mockProducts[1]))
    store.dispatch(addToCart(mockProducts[1]))

    const state = store.getState().cart

    expect(state.subtotal).toBe(1.8) // 2 * 0.90
    expect(state.totalSavings).toBe(0.9) // One free cheese
    expect(state.finalTotal).toBe(0.9) // Only pay for one
    expect(state.appliedOffers).toHaveLength(1)
    expect(state.appliedOffers[0].description).toContain("get second free")
  })

  test("should apply soup + bread special offer", () => {
    // Add soup and bread
    store.dispatch(addToCart(mockProducts[2])) // soup
    store.dispatch(addToCart(mockProducts[0])) // bread

    const state = store.getState().cart

    expect(state.subtotal).toBe(1.7) // 0.60 + 1.10
    expect(state.totalSavings).toBe(0.55) // Half price bread (1.10 / 2)
    expect(state.finalTotal).toBe(1.15)
    expect(state.appliedOffers).toHaveLength(1)
    expect(state.appliedOffers[0].description).toContain("half price Bread")
  })

  test("should apply butter special offer (1/3 off)", () => {
    store.dispatch(addToCart(mockProducts[3])) // butter

    const state = store.getState().cart

    expect(state.subtotal).toBe(1.2)
    expect(state.totalSavings).toBe(0.4) // 1/3 of 1.20
    expect(state.finalTotal).toBe(0.8)
    expect(state.appliedOffers).toHaveLength(1)
    expect(state.appliedOffers[0].description).toContain("1/3 off")
  })

  test("should remove item from cart and clear loading", () => {
    store.dispatch(addToCart(mockProducts[0]))
    store.dispatch(removeFromCart("bread"))

    const state = store.getState().cart
    expect(state.items).toHaveLength(0)
    expect(state.subtotal).toBe(0)
    expect(state.operationLoading).toBeNull()
  })

  test("should update item quantity and clear loading", () => {
    store.dispatch(addToCart(mockProducts[0]))
    store.dispatch(updateQuantity({ productId: "bread", quantity: 3 }))

    const state = store.getState().cart
    expect(state.items[0].quantity).toBe(3)
    expect(state.subtotal).toBe(3.3)
    expect(state.operationLoading).toBeNull()
  })

  test("should clear cart", () => {
    store.dispatch(addToCart(mockProducts[0]))
    store.dispatch(clearCart())

    const state = store.getState().cart
    expect(state.items).toHaveLength(0)
    expect(state.subtotal).toBe(0)
    expect(state.operationLoading).toBeNull()
  })

  test("should handle multiple special offers simultaneously", () => {
    // Add items that trigger multiple offers
    store.dispatch(addToCart(mockProducts[1])) // cheese
    store.dispatch(addToCart(mockProducts[1])) // cheese (triggers BOGO)
    store.dispatch(addToCart(mockProducts[2])) // soup
    store.dispatch(addToCart(mockProducts[0])) // bread (triggers half price with soup)
    store.dispatch(addToCart(mockProducts[3])) // butter (triggers 1/3 off)

    const state = store.getState().cart

    expect(state.appliedOffers).toHaveLength(3) // All three offers should be applied
    expect(state.totalSavings).toBeGreaterThan(0)
    expect(state.finalTotal).toBeLessThan(state.subtotal)
  })
})

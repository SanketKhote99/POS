import { configureStore } from "@reduxjs/toolkit"
import cartReducer, {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  selectCartItems,
  selectCartTotal,
  selectCartSubtotal,
  selectCartSavings,
  selectAppliedOffers,
  selectCartItemCount,
} from "../../store/slices/cartSlice"
import type { Product } from "../../types/types"

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

  test("should add item to cart", () => {
    store.dispatch(addToCart(mockProducts[0]))
    const state = store.getState()

    expect(selectCartItems(state)).toHaveLength(1)
    expect(selectCartItems(state)[0].product.name).toBe("Bread")
    expect(selectCartItems(state)[0].quantity).toBe(1)
    expect(selectCartSubtotal(state)).toBe(1.1)
    expect(selectCartItemCount(state)).toBe(1)
  })

  test("should increment quantity", () => {
    store.dispatch(addToCart(mockProducts[0]))
    store.dispatch(incrementQuantity("bread"))
    const state = store.getState()

    expect(selectCartItems(state)[0].quantity).toBe(2)
    expect(selectCartSubtotal(state)).toBe(2.2)
    expect(selectCartItemCount(state)).toBe(2)
  })

  test("should decrement quantity", () => {
    store.dispatch(addToCart(mockProducts[0]))
    store.dispatch(incrementQuantity("bread"))
    store.dispatch(decrementQuantity("bread"))
    const state = store.getState()

    expect(selectCartItems(state)[0].quantity).toBe(1)
    expect(selectCartSubtotal(state)).toBe(1.1)
    expect(selectCartItemCount(state)).toBe(1)
  })

  test("should remove item when quantity reaches 0", () => {
    store.dispatch(addToCart(mockProducts[0]))
    store.dispatch(decrementQuantity("bread"))
    const state = store.getState()

    expect(selectCartItems(state)).toHaveLength(0)
    expect(selectCartSubtotal(state)).toBe(0)
    expect(selectCartItemCount(state)).toBe(0)
  })

  test("should apply cheese special offer (buy one get one free)", () => {
    // Add 2 cheese items
    store.dispatch(addToCart(mockProducts[1]))
    store.dispatch(addToCart(mockProducts[1]))

    const state = store.getState()

    expect(selectCartSubtotal(state)).toBe(1.8) // 2 * 0.90
    expect(selectCartSavings(state)).toBe(0.9) // One free cheese
    expect(selectCartTotal(state)).toBe(0.9) // Only pay for one
    expect(selectAppliedOffers(state)).toHaveLength(1)
    expect(selectAppliedOffers(state)[0].description).toContain("get second free")
  })

  test("should apply soup + bread special offer", () => {
    // Add soup and bread
    store.dispatch(addToCart(mockProducts[2])) // soup
    store.dispatch(addToCart(mockProducts[0])) // bread

    const state = store.getState()

    expect(selectCartSubtotal(state)).toBe(1.7) // 0.60 + 1.10
    expect(selectCartSavings(state)).toBe(0.55) // Half price bread (1.10 / 2)
    expect(selectCartTotal(state)).toBe(1.15)
    expect(selectAppliedOffers(state)).toHaveLength(1)
    expect(selectAppliedOffers(state)[0].description).toContain("half price Bread")
  })

  test("should apply butter special offer (1/3 off)", () => {
    store.dispatch(addToCart(mockProducts[3])) // butter

    const state = store.getState()

    expect(selectCartSubtotal(state)).toBe(1.2)
    expect(selectCartSavings(state)).toBe(0.4) // 1/3 of 1.20
    expect(selectCartTotal(state)).toBe(0.8)
    expect(selectAppliedOffers(state)).toHaveLength(1)
    expect(selectAppliedOffers(state)[0].description).toContain("1/3 off")
  })

  test("should handle multiple special offers simultaneously", () => {
    // Add items that trigger multiple offers
    store.dispatch(addToCart(mockProducts[1])) // cheese
    store.dispatch(addToCart(mockProducts[1])) // cheese (triggers BOGO)
    store.dispatch(addToCart(mockProducts[2])) // soup
    store.dispatch(addToCart(mockProducts[0])) // bread (triggers half price with soup)
    store.dispatch(addToCart(mockProducts[3])) // butter (triggers 1/3 off)

    const state = store.getState()

    expect(selectAppliedOffers(state)).toHaveLength(3) // All three offers should be applied
    expect(selectCartSavings(state)).toBeGreaterThan(0)
    expect(selectCartTotal(state)).toBeLessThan(selectCartSubtotal(state))
  })

  test("should clear cart", () => {
    store.dispatch(addToCart(mockProducts[0]))
    store.dispatch(clearCart())

    const state = store.getState()
    expect(selectCartItems(state)).toHaveLength(0)
    expect(selectCartSubtotal(state)).toBe(0)
    expect(selectCartItemCount(state)).toBe(0)
  })
})

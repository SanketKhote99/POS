import { configureStore } from "@reduxjs/toolkit"
import uiReducer, {
  setInitialLoading,
  setLoading,
  clearLoading,
  clearAllLoading,
  addToast,
  removeToast,
  selectIsInitialLoading,
  selectIsProductLoading,
  selectIsAnyProductLoading,
  selectToastQueue,
} from "../../store/slices/uiSlice"

describe("uiSlice", () => {
  let store: ReturnType<typeof configureStore>

  beforeEach(() => {
    store = configureStore({
      reducer: {
        ui: uiReducer,
      },
    })
  })

  test("should set initial loading", () => {
    store.dispatch(setInitialLoading(false))
    const state = store.getState()

    expect(selectIsInitialLoading(state)).toBe(false)
  })

  test("should set loading state for specific product and operation", () => {
    store.dispatch(setLoading({ productId: "bread", operation: "add" }))
    const state = store.getState()

    expect(selectIsProductLoading(state, "bread", "add")).toBe(true)
    expect(selectIsProductLoading(state, "bread", "increment")).toBe(false)
    expect(selectIsAnyProductLoading(state, "bread")).toBe(true)
  })

  test("should clear loading state for specific product", () => {
    store.dispatch(setLoading({ productId: "bread", operation: "add" }))
    store.dispatch(clearLoading("bread"))
    const state = store.getState()

    expect(selectIsProductLoading(state, "bread", "add")).toBe(false)
    expect(selectIsAnyProductLoading(state, "bread")).toBe(false)
  })

  test("should replace loading state for same product", () => {
    store.dispatch(setLoading({ productId: "bread", operation: "add" }))
    store.dispatch(setLoading({ productId: "bread", operation: "increment" }))
    const state = store.getState()

    expect(selectIsProductLoading(state, "bread", "add")).toBe(false)
    expect(selectIsProductLoading(state, "bread", "increment")).toBe(true)
  })

  test("should clear all loading states", () => {
    store.dispatch(setLoading({ productId: "bread", operation: "add" }))
    store.dispatch(setLoading({ productId: "milk", operation: "increment" }))
    store.dispatch(clearAllLoading())
    const state = store.getState()

    expect(selectIsAnyProductLoading(state, "bread")).toBe(false)
    expect(selectIsAnyProductLoading(state, "milk")).toBe(false)
  })

  test("should add and remove toasts", () => {
    const toast = {
      title: "Test Toast",
      description: "Test Description",
      variant: "default" as const,
    }

    store.dispatch(addToast(toast))
    let state = store.getState()
    const toastQueue = selectToastQueue(state)

    expect(toastQueue).toHaveLength(1)
    expect(toastQueue[0].title).toBe("Test Toast")

    store.dispatch(removeToast(toastQueue[0].id))
    state = store.getState()

    expect(selectToastQueue(state)).toHaveLength(0)
  })
})

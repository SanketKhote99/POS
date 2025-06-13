import type React from "react"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { Provider } from "react-redux"
import { configureStore } from "@reduxjs/toolkit"
import ShoppingCart from "../ShoppingCart"
import cartReducer from "../../store/cartSlice"
import { Toaster } from "@/components/ui/toaster"
import jest from "jest" // Import jest to fix the undeclared variable error

// Mock the toast hook
const mockToast = jest.fn()
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}))

const renderWithProvider = (component: React.ReactElement) => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
    },
  })

  return render(
    <Provider store={store}>
      {component}
      <Toaster />
    </Provider>,
  )
}

describe("ShoppingCart Component", () => {
  beforeEach(() => {
    mockToast.mockClear()
  })

  test("renders products and empty cart", async () => {
    renderWithProvider(<ShoppingCart />)

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText("Products")).toBeInTheDocument()
      expect(screen.getByText("Shopping Cart")).toBeInTheDocument()
      expect(screen.getByText("Your cart is empty")).toBeInTheDocument()
    })

    // Check if all products are displayed
    expect(screen.getByText("Bread")).toBeInTheDocument()
    expect(screen.getByText("Milk")).toBeInTheDocument()
    expect(screen.getByText("Cheese")).toBeInTheDocument()
    expect(screen.getByText("Soup")).toBeInTheDocument()
    expect(screen.getByText("Butter")).toBeInTheDocument()
  })

  test("shows loading skeletons initially", () => {
    renderWithProvider(<ShoppingCart />)

    // Should show skeleton loaders initially
    const skeletons = screen.getAllByTestId(/skeleton/i)
    expect(skeletons.length).toBeGreaterThan(0)
  })

  test("adds item to cart and shows toast", async () => {
    renderWithProvider(<ShoppingCart />)

    // Wait for initial loading to complete
    await waitFor(() => {
      expect(screen.getByText("Products")).toBeInTheDocument()
    })

    const addButtons = screen.getAllByText("Add")
    fireEvent.click(addButtons[0]) // Click first Add button (Bread)

    // Wait for item to be added and toast to be called
    await waitFor(
      () => {
        expect(mockToast).toHaveBeenCalledWith({
          title: "Added to cart",
          description: "Bread has been added to your cart.",
        })
      },
      { timeout: 2000 },
    )
  })

  test("displays special offers when applied", async () => {
    renderWithProvider(<ShoppingCart />)

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByText("Products")).toBeInTheDocument()
    })

    // Find and click cheese add button twice
    const cheeseRow = screen.getByText("Cheese").closest("div")
    const cheeseAddButton = cheeseRow?.querySelector("button")

    if (cheeseAddButton) {
      fireEvent.click(cheeseAddButton)
      await waitFor(() => {}, { timeout: 1000 })
      fireEvent.click(cheeseAddButton)
    }

    // Should show special offers section
    await waitFor(
      () => {
        expect(screen.getByText("Special offers applied")).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })

  test("updates quantity correctly", async () => {
    renderWithProvider(<ShoppingCart />)

    // Wait for loading and add an item first
    await waitFor(() => {
      expect(screen.getByText("Products")).toBeInTheDocument()
    })

    const addButtons = screen.getAllByText("Add")
    fireEvent.click(addButtons[0]) // Add bread

    // Wait for item to be added
    await waitFor(
      () => {
        expect(screen.getByDisplayValue || screen.getByText("1")).toBeInTheDocument()
      },
      { timeout: 2000 },
    )

    // Find and click plus button
    const plusButtons = screen.getAllByRole("button")
    const plusButton = plusButtons.find((button) => button.querySelector("svg"))

    if (plusButton) {
      fireEvent.click(plusButton)
    }

    // Should show toast for quantity update
    await waitFor(
      () => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Updated quantity",
          }),
        )
      },
      { timeout: 2000 },
    )
  })

  test("calculates totals correctly", async () => {
    renderWithProvider(<ShoppingCart />)

    await waitFor(() => {
      expect(screen.getByText("Products")).toBeInTheDocument()
    })

    // Add bread (£1.10)
    const breadRow = screen.getByText("Bread").closest("div")
    const breadAddButton = breadRow?.querySelector("button")

    if (breadAddButton) {
      fireEvent.click(breadAddButton)
    }

    // Wait for totals to be calculated and displayed
    await waitFor(
      () => {
        expect(screen.getByText("£1.10")).toBeInTheDocument()
      },
      { timeout: 2000 },
    )
  })

  test("removes item from cart", async () => {
    renderWithProvider(<ShoppingCart />)

    await waitFor(() => {
      expect(screen.getByText("Products")).toBeInTheDocument()
    })

    // Add an item first
    const addButtons = screen.getAllByText("Add")
    fireEvent.click(addButtons[0])

    // Wait for item to be added
    await waitFor(
      () => {
        expect(screen.getByText("1")).toBeInTheDocument()
      },
      { timeout: 2000 },
    )

    // Find and click minus button to remove item
    const minusButtons = screen.getAllByRole("button")
    const minusButton = minusButtons.find(
      (button) => button.querySelector("svg") && button.getAttribute("class")?.includes("outline"),
    )

    if (minusButton) {
      fireEvent.click(minusButton)
    }

    // Should show removal toast
    await waitFor(
      () => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: "Removed from cart",
            variant: "destructive",
          }),
        )
      },
      { timeout: 2000 },
    )
  })
})

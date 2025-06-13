import { Provider } from "react-redux"
import { store } from "./store/store"
import ShoppingCart from "./components/ShoppingCart"
import { Toaster } from "@/components/ui/toaster"
import "./App.css"

function App() {
  return (
    <Provider store={store}>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>
            <p className="text-muted-foreground mt-2">Add products and enjoy special offers</p>
          </div>
          <ShoppingCart />
        </div>
        <Toaster />
      </div>
    </Provider>
  )
}

export default App

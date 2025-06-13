"use client"

import type React from "react"
import { useAppDispatch } from "../hooks/useAppDispatch"
import { useAppSelector } from "../hooks/useAppSelector"
import { addToCart } from "../store/slices/cartSlice"
import { setLoading, clearLoading, selectIsProductLoading } from "../store/slices/uiSlice"
import type { Product } from "../types/types"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProductListProps {
  products: Product[]
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const dispatch = useAppDispatch()
  const { toast } = useToast()
  const isLoading = (productId: string) => useAppSelector((state) => selectIsProductLoading(state, productId, "add"))

  const formatPrice = (price: number) => `£${price.toFixed(2)}`

  const handleAddToCart = async (product: Product) => {
    dispatch(setLoading({ productId: product.id, operation: "add" }))

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      dispatch(addToCart(product))

      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch(clearLoading(product.id))
    }
  }

  return (
    <div className="space-y-4">
      {products.map((product) => {
        const productIsLoading = isLoading(product.id)

        return (
          <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
            </div>
            <Button onClick={() => handleAddToCart(product)} disabled={productIsLoading} size="sm">
              {productIsLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
            </Button>
          </div>
        )
      })}
    </div>
  )
}

export default ProductList

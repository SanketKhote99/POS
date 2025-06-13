"use client"

import type React from "react"
import { useAppDispatch } from "../hooks/useAppDispatch"
import { useAppSelector } from "../hooks/useAppSelector"
import { incrementQuantity, decrementQuantity } from "../store/slices/cartSlice"
import { setLoading, clearLoading, selectIsProductLoading } from "../store/slices/uiSlice"
import type { CartItem, AppliedOffer } from "../types/types"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CartItemListProps {
  items: CartItem[]
  appliedOffers: AppliedOffer[]
}

const CartItemList: React.FC<CartItemListProps> = ({ items, appliedOffers }) => {
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const formatPrice = (price: number) => `£${price.toFixed(2)}`

  const handleIncrement = async (productId: string, productName: string) => {
    dispatch(setLoading({ productId, operation: "increment" }))

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))
      dispatch(incrementQuantity(productId))
      toast({
        title: "Quantity updated",
        description: `${productName} quantity increased.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch(clearLoading(productId))
    }
  }

  const handleDecrement = async (productId: string, productName: string, currentQuantity: number) => {
    dispatch(setLoading({ productId, operation: "decrement" }))

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      dispatch(decrementQuantity(productId))

      if (currentQuantity === 1) {
        toast({
          title: "Removed from cart",
          description: `${productName} has been removed from your cart.`,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Quantity updated",
          description: `${productName} quantity decreased.`,
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity. Please try again.",
        variant: "destructive",
      })
    } finally {
      dispatch(clearLoading(productId))
    }
  }

  // Gather loading states for all items outside the map loop
  const incrementLoadingMap = useAppSelector((state) =>
    Object.fromEntries(
      items.map(item => [
        item.product.id,
        selectIsProductLoading(state, item.product.id, "increment")
      ])
    )
  );

  const decrementLoadingMap = useAppSelector((state) =>
    Object.fromEntries(
      items.map(item => [
        item.product.id,
        selectIsProductLoading(state, item.product.id, "decrement")
      ])
    )
  );

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const appliedOffer = appliedOffers.find((offer) => offer.productId === item.product.id)
        const isIncrementLoading = incrementLoadingMap[item.product.id];
        const isDecrementLoading = decrementLoadingMap[item.product.id];

        return (
          <div key={item.product.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">{item.product.name}</h4>
                <p className="text-sm text-muted-foreground">{formatPrice(item.product.price)} each</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleDecrement(item.product.id, item.product.name, item.quantity)}
                  disabled={isDecrementLoading}
                >
                  {isDecrementLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Minus className="h-3 w-3" />}
                </Button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleIncrement(item.product.id, item.product.name)}
                  disabled={isIncrementLoading}
                >
                  {isIncrementLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                </Button>
              </div>
            </div>

            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  {formatPrice(item.product.price)} × {item.quantity}
                </span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>

              {appliedOffer && appliedOffer.savings > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount applied</span>
                  <span>-{formatPrice(appliedOffer.savings)}</span>
                </div>
              )}

              <div className="flex justify-between font-medium pt-1 border-t">
                <span>Item total</span>
                <span>{formatPrice(item.totalPrice)}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default CartItemList

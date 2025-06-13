"use client"

import type React from "react"
import { useEffect } from "react"
import { useAppSelector } from "../hooks/useAppSelector"
import { useAppDispatch } from "../hooks/useAppDispatch"
import {
  selectCartItems,
  selectCartSubtotal,
  selectCartSavings,
  selectCartTotal,
  selectAppliedOffers,
  selectCartItemCount,
} from "../store/slices/cartSlice"
import { selectProducts } from "../store/slices/productsSlice"
import { selectIsInitialLoading, setInitialLoading } from "../store/slices/uiSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Package, ShoppingCartIcon as CartIcon } from "lucide-react"
import ProductSkeleton from "./ProductSkeleton"
import BasketSkeleton from "./BasketSkeleton"
import ProductList from "./ProductList"
import CartItemList from "./CartItemList"
import OrderSummary from "./OrderSummary"
import SpecialOffers from "./SpecialOffers"
import CheckoutButton from "./CheckoutButton"

const ShoppingCart: React.FC = () => {
  const dispatch = useAppDispatch()

  // Selectors
  const products = useAppSelector(selectProducts)
  const cartItems = useAppSelector(selectCartItems)
  const subtotal = useAppSelector(selectCartSubtotal)
  const totalSavings = useAppSelector(selectCartSavings)
  const finalTotal = useAppSelector(selectCartTotal)
  const appliedOffers = useAppSelector(selectAppliedOffers)
  const itemCount = useAppSelector(selectCartItemCount)
  const isInitialLoading = useAppSelector(selectIsInitialLoading)

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setInitialLoading(false))
    }, 1500)

    return () => clearTimeout(timer)
  }, [dispatch])

  if (isInitialLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductSkeleton />
        <BasketSkeleton />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Products Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ProductList products={products} />
        </CardContent>
      </Card>

      {/* Cart Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CartIcon className="h-5 w-5" />
            Shopping Cart
            {itemCount > 0 && <Badge variant="secondary">{itemCount}</Badge>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <CartIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-medium text-lg mb-2">Your cart is empty</h3>
              <p className="text-sm text-muted-foreground">Add some products to get started</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cart Items */}
              <CartItemList items={cartItems} appliedOffers={appliedOffers} />

              <Separator />

              {/* Order Summary */}
              <OrderSummary subtotal={subtotal} totalSavings={totalSavings} finalTotal={finalTotal} />

              {/* Applied Offers */}
              {appliedOffers.length > 0 && <SpecialOffers offers={appliedOffers} />}

              {/* Checkout Button */}
              <CheckoutButton />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ShoppingCart

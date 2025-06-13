import type React from "react"
import { Separator } from "@/components/ui/separator"

interface OrderSummaryProps {
  subtotal: number
  totalSavings: number
  finalTotal: number
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ subtotal, totalSavings, finalTotal }) => {
  const formatPrice = (price: number) => `£${price.toFixed(2)}`

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Subtotal</span>
        <span>{formatPrice(subtotal)}</span>
      </div>

      {totalSavings > 0 && (
        <div className="flex justify-between text-green-600">
          <span>Total savings</span>
          <span>-{formatPrice(totalSavings)}</span>
        </div>
      )}

      <Separator />

      <div className="flex justify-between text-lg font-semibold">
        <span>Total</span>
        <span>{formatPrice(finalTotal)}</span>
      </div>
    </div>
  )
}

export default OrderSummary

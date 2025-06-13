"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

const CheckoutButton: React.FC = () => {
  const { toast } = useToast()

  const handleCheckout = () => {
    toast({
      title: "Checkout",
      description: "Checkout functionality would be implemented here.",
    })
  }

  return (
    <Button className="w-full" size="lg" onClick={handleCheckout}>
      Proceed to Checkout
    </Button>
  )
}

export default CheckoutButton

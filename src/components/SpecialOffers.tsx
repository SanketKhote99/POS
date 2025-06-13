import type React from "react"
import type { AppliedOffer } from "../types/types"
import { Receipt } from "lucide-react"

interface SpecialOffersProps {
  offers: AppliedOffer[]
}

const SpecialOffers: React.FC<SpecialOffersProps> = ({ offers }) => {
  const formatPrice = (price: number) => `£${price.toFixed(2)}`

  return (
    <div className="rounded-lg border bg-muted/50 p-4">
      <h4 className="font-medium mb-2 flex items-center gap-2">
        <Receipt className="h-4 w-4" />
        Special offers applied
      </h4>
      <ul className="space-y-1 text-sm">
        {offers.map((offer, index) => (
          <li key={index} className="flex justify-between">
            <span className="text-muted-foreground">{offer.description}</span>
            <span className="text-green-600 font-medium">-{formatPrice(offer.savings)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SpecialOffers

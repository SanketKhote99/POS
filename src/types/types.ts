export interface Product {
  id: string
  name: string
  price: number
}

export interface CartItem {
  product: Product
  quantity: number
  totalPrice: number
}

export interface AppliedOffer {
  productId: string
  description: string
  savings: number
}

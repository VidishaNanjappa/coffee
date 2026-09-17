import { useState } from 'react'

export function useCart() {
  const [cart, setCart] = useState([])

  function addToCart(product) {
    setCart((current) => {
      const hasMatch = current.some((item) => item.id === product.id)
      return hasMatch
        ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...product, quantity: 1 }]
    })
  }

  function changeQuantity(id, amount) {
    setCart((current) => current.map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0))
  }

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0)
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  return { cart, addToCart, changeQuantity, itemCount, subtotal }
}

export function getCart(database, userId) {
  let cart = database.carts.find((item) => item.userId === userId)
  if (!cart) {
    cart = { userId, items: [] }
    database.carts.push(cart)
  }
  return cart
}

export function hydrateCart(database, cart) {
  const items = cart.items.map((item) => {
    const product = database.products.find((candidate) => candidate.id === item.productId)
    return product ? { ...item, product, lineTotal: product.price * item.quantity } : null
  }).filter(Boolean)
  return { ...cart, items, subtotal: items.reduce((total, item) => total + item.lineTotal, 0) }
}

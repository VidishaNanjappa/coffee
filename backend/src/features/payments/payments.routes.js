import { Router } from 'express'
import { frontendUrl } from '../../config/env.js'
import { razorpay } from '../../lib/razorpay.js'
import { stripe } from '../../lib/stripe.js'
import { authRequired } from '../../middleware/auth.js'
import { getOrCreateCart, serializeCart } from '../cart/cart.service.js'

const router = Router()

router.post('/checkout', authRequired, async (request, response) => {
  const cart = serializeCart(await getOrCreateCart(request.auth.sub))
  if (!cart.items.length) return response.status(400).json({ error: 'Your cart is empty' })
  if (razorpay) {
    const amount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) * 100
    const paymentLink = await razorpay.paymentLink.create({
      amount,
      currency: 'INR',
      description: 'Coorg Cup order',
      notes: { userId: request.auth.sub },
      callback_url: `${frontendUrl}/?payment=success`,
      callback_method: 'get',
    })
    return response.json({ provider: 'razorpay', checkoutUrl: paymentLink.short_url, referenceId: paymentLink.id })
  }
  if (!stripe) return response.json({ provider: 'local', checkoutUrl: null, message: 'No payment gateway is configured. Add RAZORPAY_KEY_ID/RAZORPAY_KEY_SECRET (or STRIPE_SECRET_KEY) to enable hosted checkout.' })
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: cart.items.map((item) => ({ price_data: { currency: 'inr', product_data: { name: item.product.name }, unit_amount: item.product.price * 100 }, quantity: item.quantity })),
    success_url: `${frontendUrl}/?payment=success`,
    cancel_url: `${frontendUrl}/?payment=cancelled`,
    metadata: { userId: request.auth.sub },
  })
  response.json({ provider: 'stripe', checkoutUrl: session.url, sessionId: session.id })
})

export default router

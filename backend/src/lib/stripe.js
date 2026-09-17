import Stripe from 'stripe'
import { stripeSecretKey } from '../config/env.js'

export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null

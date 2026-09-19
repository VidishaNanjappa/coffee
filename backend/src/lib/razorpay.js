import Razorpay from 'razorpay'
import { razorpayKeyId, razorpayKeySecret } from '../config/env.js'

export const razorpay = razorpayKeyId && razorpayKeySecret
  ? new Razorpay({ key_id: razorpayKeyId, key_secret: razorpayKeySecret })
  : null

import 'dotenv/config'
import bcrypt from 'bcryptjs'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    id: 'coffee-pure-blend',
    category: 'Coffee',
    name: 'Pure Blend',
    roast: 'Filter coffee',
    notes: 'Robust · Clean · Full-bodied',
    price: 289,
    weight: '200g',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=900&q=85',
    tag: 'No added chicory',
    format: '200g · Ground coffee',
    active: true,
  },
  {
    id: 'coffee-crafted-premium-blend',
    category: 'Coffee',
    name: 'Crafted Premium Blend',
    roast: 'Premium blend',
    notes: 'Balanced · Rich · Smooth',
    price: 355,
    weight: '200g',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=85',
    tag: 'House favourite',
    format: '200g · Ground coffee',
    active: true,
  },
  {
    id: 'coffee-arabica-antique-blend',
    category: 'Coffee',
    name: 'Arabica Antique Blend',
    roast: 'Arabica blend',
    notes: 'Aromatic · Gentle · Velvety',
    price: 415,
    weight: '200g',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=900&q=85',
    tag: 'Arabica blend',
    format: '200g · Ground coffee',
    active: true,
  },
  {
    id: 'coffee-classic-blend',
    category: 'Coffee',
    name: 'Classic Blend',
    roast: 'Classic blend',
    notes: 'Deep · Familiar · Comforting',
    price: 239,
    weight: '200g',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85',
    tag: 'Everyday coffee',
    format: '200g · Ground coffee',
    active: true,
  },
  {
    id: 'spice-cardamon',
    category: 'Spices',
    name: 'Cardamon',
    roast: 'Whole spice',
    notes: 'Citrus · Sweet · Fragrant',
    price: 420,
    weight: '100g',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85',
    tag: 'Estate spice',
    format: '100g · Whole pods',
    active: true,
  },
  {
    id: 'spice-black-pepper',
    category: 'Spices',
    name: 'Black Pepper',
    roast: 'Whole spice',
    notes: 'Warm · Sharp · Resinous',
    price: 199,
    weight: '100g',
    image: 'https://images.unsplash.com/photo-1509351631168-7f90cfb4f263?auto=format&fit=crop&w=900&q=85',
    tag: 'Harvest staple',
    format: '100g · Whole pepper',
    active: true,
  },
  {
    id: 'honey-forest-honey',
    category: 'Honey',
    name: 'Forest Honey',
    roast: 'Raw forest honey',
    notes: 'Floral · Wild · Golden',
    price: 715,
    weight: '500g',
    image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?auto=format&fit=crop&w=900&q=85',
    tag: 'From the forest',
    format: '500g · Glass jar',
    active: true,
  },
]

async function main() {
  const email = (process.env.ADMIN_EMAIL || 'admin@coorgcup.in').toLowerCase()
  const password = process.env.ADMIN_PASSWORD || 'change-this-password'
  const passwordHash = await bcrypt.hash(password, 12)

  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name: 'Coorg Cup Admin', role: 'admin' },
    create: { email, name: 'Coorg Cup Admin', passwordHash, role: 'admin' },
  })

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: product,
      create: product,
    })
  }

  console.log(`Seeded admin (${email}) and ${products.length} products`)
}

try {
  await main()
} catch (error) {
  console.error(error)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}

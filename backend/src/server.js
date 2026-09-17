import bcrypt from 'bcryptjs'
import { app } from './app.js'
import { adminEmail, adminPassword, port } from './config/env.js'
import { createId, loadDatabase, saveDatabase } from './db/store.js'

async function bootstrapAdmin() {
  const database = await loadDatabase()
  if (!database.users.some((user) => user.email === adminEmail)) {
    database.users.push({
      id: createId('user'),
      email: adminEmail,
      name: 'Coorg Cup Admin',
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: 'admin',
      createdAt: new Date().toISOString(),
    })
    await saveDatabase(database)
  }
}

bootstrapAdmin().then(() => {
  app.listen(port, () => console.log(`Coorg Cup API running on http://localhost:${port}`))
}).catch((error) => {
  console.error('Could not start API', error)
  process.exitCode = 1
})


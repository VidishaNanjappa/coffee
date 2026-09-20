import { app } from './app.js'
import { port } from './config/env.js'

app.listen(port, () => console.log(`Coorg Cup API running on http://localhost:${port}`))


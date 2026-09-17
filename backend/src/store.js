import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dataPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data', 'db.json')

export async function loadDatabase() {
  const contents = await readFile(dataPath, 'utf8')
  return JSON.parse(contents)
}

export async function saveDatabase(database) {
  await mkdir(path.dirname(dataPath), { recursive: true })
  await writeFile(dataPath, `${JSON.stringify(database, null, 2)}\n`)
}

export function createId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}

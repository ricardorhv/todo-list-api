import { readFile, writeFile } from 'node:fs/promises'

const databasePath = `${import.meta.dirname}/data/db.json`

export class Database {
  #database = {}

  constructor() {
    readFile(databasePath, 'utf-8')
      .then((data) => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    writeFile(databasePath, JSON.stringify(this.#database))
  }
  
  insert(table, data) {
    const tasks = this.#database[table]

    if (Array.isArray(tasks)) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()
  }

  select(table) {
    const data = this.#database[table] ?? []
    return data
  }
}
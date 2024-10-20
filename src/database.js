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

  select(table, search) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter((row) => 
          row.title.toUpperCase().includes(search.toUpperCase()) || 
          row.description.toUpperCase().includes(search.toUpperCase()))
    }

    return data
  }

  update(table, data) {
    const tasks = this.#database[table]

    this.#database[table] = tasks.map((task) => {
      if (task.id === data.id) {
        return {
          ...data
        }
      }

      return task
    })

    this.#persist()
  }

  delete(table, id) {
    const tasks = this.#database[table]

    this.#database[table] = tasks.filter((task) => task.id != id)
    this.#persist()
  }

  deleteAll(table) {
    this.#database[table] = []
    this.#persist()
  }

  patch(table, data) {
    this.#database[table] = this.#database[table].map((row) => {
      if (row.id === data.id) {
        return data
      }

      return row
    })
  }
}
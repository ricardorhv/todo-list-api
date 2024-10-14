import { Database } from "./database.js"
import { buildRoutePath } from "./utils/build-route-path.js"

const database = new Database()

export const routes = [
  {
    path: buildRoutePath('/tasks'),
    method: 'GET',
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', search)
      res.end(JSON.stringify(tasks))
    }
  },
  {
    path: buildRoutePath('/tasks'),
    method: 'POST',
    handler: (req, res) => {
      const { title, description } = req.body

      const task = {
        id: crypto.randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      database.insert('tasks', task)
      res.writeHead(201).end()
    }
  }
]
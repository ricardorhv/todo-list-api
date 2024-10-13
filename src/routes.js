import { Database } from "./database.js"

const database = new Database()

export const routes = [
  {
    path: '/tasks',
    method: 'GET',
    handler: (req, res) => {
      const tasks = database.select('tasks')
      res.end(JSON.stringify(tasks))
    }
  },
  {
    path: '/tasks',
    method: 'POST',
    handler: (req, res) => {
      database.insert('tasks', req.body)
      res.writeHead(201).end('Task added successfully!')
    }
  }
]
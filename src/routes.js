import { parse } from "csv-parse/sync"
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
      return res.end(JSON.stringify(tasks))
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
      return res.writeHead(201).end()
    }
  },
  {
    path: buildRoutePath('/tasks/:taskId'),
    method: 'PUT',
    handler: (req, res) => {
      const { title, description } = req.body
      const { taskId } = req.params
      const tasks = database.select("tasks")
      const task = tasks.find((task) => task.id === taskId)

      if (!task) {
        return res.writeHead(404).end()
      }
      
      if (!title && description) {
        return res.writeHead(400).end()
      }
      
      const updatedTask = {
        ...task,
        title: title ?? task.title,
        description: description ?? task.description,
        updated_at: new Date().toISOString()
      }

      database.update('tasks', updatedTask)
      return res.writeHead(204).end()
    }
  },
  {
    path: buildRoutePath('/tasks/:taskId'),
    method: 'DELETE',
    handler: (req, res) => {
      const { taskId } = req.params
      const tasks = database.select("tasks")
      const task = tasks.find((task) => task.id == taskId)
      
      if (!task) {
        return res.writeHead(404).end()
      }

      database.delete('tasks', taskId)
      return res.writeHead(204).end()
    }
  },
  {
    path: buildRoutePath('/tasks'),
    method: 'DELETE',
    handler: (req, res) => {
      database.deleteAll('tasks')
      return res.writeHead(204).end()
    }
  },
  {
    path: buildRoutePath('/tasks/:taskId/complete'),
    method: 'PATCH',
    handler: (req, res) => {
      if (req.body === null) {
        return res.writeHead(404).end()
      }

      const { taskId } = req.params
      const { isCompleted } = req.body

      const tasks = database.select("tasks")
      const task = tasks.find((task) => task.id == taskId)

      if (!task || isCompleted == undefined) {
        return res.writeHead(404).end()
      }

      const updatedTask = {
       ...task,
        completed_at: isCompleted ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      }

      database.patch('tasks', updatedTask)

      return res.writeHead(204).end()
    }
  },
  {
    path: buildRoutePath('/tasks/import-file'),
    method: 'POST',
    handler: async (req, res) => {
      const { file } = req

      if (!file) {
        return res.writeHead(400).end()
      }

      for await (const row of file) {
        const { title, description } = row

        if (!title && !description) {
          return res.writeHead(400).end()
        }
        const task = {
          title: title ?? '',
          description: description ?? ''
        }

        await fetch('http://localhost:3000/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(task)
        })
      }

      return res.writeHead(204).end()
    }
  }
]
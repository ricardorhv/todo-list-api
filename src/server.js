import { createServer } from 'node:http'
import { streamToJSON } from './middlewares/stream-to-json.js'
import { routes } from './routes.js'

export const server = createServer(async (req, res) => {
  await streamToJSON(req, res, () => {
    const { url, method } = req

    const route = routes.find((route) => url === route.path && method === route.method)

    if (route) {
      return route.handler(req, res)
    }
    
    return res.writeHead(404).end()
  })
})

server.listen(3000)
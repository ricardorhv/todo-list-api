import { createServer } from 'node:http'
import { streamToJSON } from './middlewares/stream-to-json.js'
import { routes } from './routes.js'
import { logger } from './middlewares/logger.js'
import { extractQueryParams } from './utils/extract-query-params.js'

export const server = createServer(async (req, res) => {
  await streamToJSON(req, res, () => {
    logger(req, res, () => {
      const { url, method } = req

      const route = routes.find((route) => {
        if (route.path.test(url) && route.method === method) {
          return route
        }
      })

      if (route) {
        const routeParams = url.match(route.path)
        const { query, ...params } = { ...routeParams.groups }
        
        req.params = params

        req.query = query ? extractQueryParams(query) : {}

        return route.handler(req, res)
      }
      
      return res.writeHead(404).end()
    })
  })
})

server.listen(3000)
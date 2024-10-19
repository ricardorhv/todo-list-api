import { parse } from 'csv-parse'
import { Readable } from 'node:stream'

export async function csvToJson(req, res, next) {
  try {
    const stream = Readable.from(req.rawBody)
    const parser = stream.pipe(parse({
      columns: true
    }))
    
    const data = []
    for await (const chunk of parser) {
      data.push(chunk)
    }
    
    req.file = data
  } catch (error) {
    req.file = null
  }
  
  next()
}
export async function streamToJSON(req, res, next) {
  const buffers = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }

  req.rawBody = Buffer.concat(buffers)

  try {
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch(error) {
    req.body = null
  }

  next()
}
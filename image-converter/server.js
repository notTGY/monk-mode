import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'

const app = new Hono()
app.use('/*', serveStatic({ root: './dist', }))

app.get('/api/email', (c) => {
  console.log(c.req.query)
  c.text('ok')
})

const port = process.env.PORT || 3000
const server = serve({ fetch: app.fetch, port })

console.log(`Server is running on port ${port}`)

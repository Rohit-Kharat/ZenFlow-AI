import 'dotenv/config'
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import wellnessRoutes from './api/routes/wellness.routes.js'
import authRoutes from './api/routes/auth.routes.js'

const app = new Hono()

// Middlewares
app.use('*', logger())
app.use('*', cors())

// Routes
app.get('/', (c) => {
  return c.text('ZenFlow AI API v1')
})

app.route('/api/auth', authRoutes)
app.route('/api/wellness', wellnessRoutes)

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})

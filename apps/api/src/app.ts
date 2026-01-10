import express from 'express'
import cors from 'cors'
import { bridgeRoute } from './modules/bridge/bridge.route'
import { errorHandler } from './common/error/error-handler'

export const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/bridges', bridgeRoute)

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' })
})

// Error handling
app.use(errorHandler)

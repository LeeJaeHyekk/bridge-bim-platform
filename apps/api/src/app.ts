import express from 'express'
import cors from 'cors'
import { bridgeRoute, bimRoute } from './modules'
import { errorHandler } from './common/error/error-handler'

export const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/bridges', bridgeRoute)
app.use('/api/bim', bimRoute)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

// Error handling
app.use(errorHandler)

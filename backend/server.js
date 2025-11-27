import express from 'express'
import axios from 'axios'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

let x = 0
const PORT = process.env.PORT || 3000
const API_CTR_CENTER_URL = process.env.VITE_API_CTR_CENTER_URL
const API_CTR_CENTER_URL_ENDPOINT = process.env.VITE_API_CTR_CENTER_URL_ENDPOINT
const EVENTS_CACHE_TTL_MS = Number(process.env.EVENTS_CACHE_TTL_MS)
const url = API_CTR_CENTER_URL && API_CTR_CENTER_URL_ENDPOINT
  ? `${API_CTR_CENTER_URL}${API_CTR_CENTER_URL_ENDPOINT}`
  : null

let eventsCache = {
  data: null,
  lastFetchedAt: 0,
}

if (!API_CTR_CENTER_URL) {
  console.warn(
    '[backend] API_CTR_CENTER_URL is not set. The /api/events/latest endpoint will return a 500 error until it is configured.'
  )
}

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})

app.get('/api/events/latest', async (req, res) => {
  if (!API_CTR_CENTER_URL) {
    return res.status(500).json({
      error: 'API_CTR_CENTER_URL is not configured on the server',
    })
  }

  const now = Date.now()
  const isCacheFresh = eventsCache.data && now - eventsCache.lastFetchedAt < EVENTS_CACHE_TTL_MS
  const forceRefresh = req.query?.refresh === 'true'

  if (isCacheFresh && !forceRefresh) {
    console.log('cache hit : ',x++)
    return res.json(eventsCache.data)
  }

  try {
    if (!url) {
      throw new Error('API CTR Center URL is not properly configured')
    }

    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
    })
    eventsCache = {
      data: response.data,
      lastFetchedAt: now,
    }
    console.log('cache miss : ',x++)
    res.json(response.data)
  } catch (error) {
    console.error('[backend] Error fetching /events/latest from CTR Center:', error.message)

    if (eventsCache.data) {
      // Provide last known data to avoid UI breaking when upstream is flaky
      return res.json(eventsCache.data)
    }

    const status = error.response?.status || 500
    res.status(status).json({
      error: 'Failed to fetch events from CTR Center API',
      details: error.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`[backend] Server listening on port ${PORT}`)
})



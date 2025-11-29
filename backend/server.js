import express from 'express'
import axios from 'axios'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

let x = 0
const PORT = process.env.PORT || 3000
const API_CTR_CENTER_URL = process.env.VITE_API_CTR_CENTER_URL
const API_CTR_CENTER_URL_ENDPOINT = process.env.VITE_API_CTR_CENTER_URL_ENDPOINT
const API_CTR_CENTER_URL_LOCATION_ENDPOINT = process.env.VITE_API_CTR_CENTER_URL_LOCATION_ENDPOINT
const EVENTS_CACHE_TTL_MS = Number(process.env.EVENTS_CACHE_TTL_MS)
// const url = API_CTR_CENTER_URL && API_CTR_CENTER_URL_ENDPOINT
//   ? `${API_CTR_CENTER_URL}${API_CTR_CENTER_URL_ENDPOINT}`
//   : null
const url = API_CTR_CENTER_URL && API_CTR_CENTER_URL_ENDPOINT
  ? `${API_CTR_CENTER_URL}`
  : null

// Cache global pour /api/events/latest (toutes zones)
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

app.get('/api/test', (req, res) => {
  res.json({ status: 'test ok' })
})

app.get('/api/events/latest', async (req, res) => {

  const url = API_CTR_CENTER_URL + API_CTR_CENTER_URL_ENDPOINT

  if (!API_CTR_CENTER_URL) {
    return res.status(500).json({
      error: 'API_CTR_CENTER_URL is not configured on the server',
    })
  }
  console.log('url /api/events/latest: ',url)

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

// GET /zone/:name
app.get('/api/zone/:name', async (req, res) => {
  const zoneName = req.params.name
  const url = API_CTR_CENTER_URL + API_CTR_CENTER_URL_LOCATION_ENDPOINT + '/' + zoneName

  console.log('url /api/zone/:name: ', url, 'zoneName: ', zoneName)
  if (!API_CTR_CENTER_URL) {
    return res.status(500).json({
      error: 'API_CTR_CENTER_URL is not configured on the server',
    })
  }

  const now = Date.now()
  
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

    // Normaliser la réponse pour le frontend :
    // - forcer le champ "zone" à correspondre à la zone demandée
    // - garantir un objet status et un summary par défaut si absent
    let payload = response.data || {}
    if (typeof payload !== 'object' || Array.isArray(payload)) {
      payload = { raw: payload }
    }

    payload.zone = zoneName
    payload.status = payload.status || {
      urgent: 0,
      pertinent: 0,
      ignored: 0,
    }
    payload.summary =
      payload.summary ||
      `État des lieux — ${zoneName}\n📡 Aucune information disponible pour le moment.`

    console.log('zone fetched from upstream :', zoneName)
    console.log('payload: ', payload)
    res.json(payload)
  } catch (error) {
    console.error('[backend] Error fetching /zone/:name from CTR Center:', error.message)
    
    const status = error.response?.status || 500
    res.status(status).json({
      error: 'Failed to fetch zone data from CTR Center API',
      details: error.message,
    })
  }
})

app.listen(PORT, () => {
  console.log(`[backend] Server listening on port ${PORT}`)
})



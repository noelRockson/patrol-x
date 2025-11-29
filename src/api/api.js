import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_URL + 'api' || 'http://localhost:3000/api'
const CTR_CENTER_ENDPOINT = import.meta.env.VITE_API_CTR_CENTER_URL_ENDPOINT

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 secondes de timeout
})
// Simuler les réponses en attendant le backend
const simulateDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

// Données mockées de fallback
const generalDataFallback = {
  status: {
    urgent: 0,
    pertinent: 0,
    ignored: 0,
  },
  summary: `📊 **État des lieux général — Port-au-Prince**\n\n🏛️ **Aucune information disponible pour le moment**\n\n📡 **Dernière mise à jour** : ${new Date().toLocaleString('fr-FR')}\n💬 Posez-moi des questions ou sélectionnez une zone pour plus de détails !`,
  zones: [],
  lastUpdate: new Date().toISOString(),
}

// Fonction pour transformer les données de l'API au format attendu
const transformApiDataToGeneralStatus = (events) => {
  if (!events || !Array.isArray(events) || events.length === 0) {
    return generalDataFallback
  }

  // Compter les événements par priorité
  let urgent = 0
  let pertinent = 0
  let ignored = 0

  // Grouper par zone
  const zonesMap = new Map()

  events.forEach((event) => {
    // Déterminer la catégorie selon la priorité
    if (event.priority === 'urgent') {
      urgent++
    } else if (event.priority === 'high' || event.priority === 'medium') {
      pertinent++
    } else if (event.priority === 'low') {
      ignored++
    }

    // Grouper par zone (location)
    const zoneName = event.location || 'Général'

    if (!zonesMap.has(zoneName)) {
      zonesMap.set(zoneName, {
        name: zoneName,
        urgent: 0,
        pertinent: 0,
        ignored: 0,
      })
    }

    const zone = zonesMap.get(zoneName)
    if (event.priority === 'urgent') {
      zone.urgent++
    } else if (event.priority === 'high' || event.priority === 'medium') {
      zone.pertinent++
    } else if (event.priority === 'low') {
      zone.ignored++
    }
  })

  // Convertir la Map en tableau et trier par nombre total d'incidents
  const zones = Array.from(zonesMap.values())
    .sort((a, b) => (b.urgent + b.pertinent) - (a.urgent + a.pertinent))

  // Créer un résumé
  const urgentZones = zones
    .filter(z => z.urgent > 0)
    .slice(0, 3)
    .map(z => `${z.name} (${z.urgent} urgent${z.urgent > 1 ? 's' : ''})`)
    .join(', ')

  const summary = `📊 **État des lieux général — Port-au-Prince**\n\n🏛️ **${zones.length} zone${zones.length > 1 ? 's' : ''} surveillée${zones.length > 1 ? 's' : ''}**\n🔥 **${urgent} incident${urgent > 1 ? 's' : ''} urgent${urgent > 1 ? 's' : ''}** signalé${urgent > 1 ? 's' : ''}\n📌 **${pertinent} incident${pertinent > 1 ? 's' : ''} pertinent${pertinent > 1 ? 's' : ''}** en cours\n💤 **${ignored} incident${ignored > 1 ? 's' : ''} ignoré${ignored > 1 ? 's' : ''}**\n\n${urgentZones ? `⚠️ **Zones nécessitant attention** : ${urgentZones}\n\n` : ''}📡 **Dernière mise à jour** : ${new Date().toLocaleString('fr-FR')}\n💬 Posez-moi des questions ou sélectionnez une zone pour plus de détails !`

  return {
    status: {
      urgent,
      pertinent,
      ignored,
    },
    summary,
    zones,
    lastUpdate: new Date().toISOString(),
    rawEvents: events,
  }
}

// GET /events/latest (État général pour toutes les zones)
export const getGeneralStatus = async () => {
  await simulateDelay(800)

  try {
    // On passe maintenant par notre backend (API_BASE_URL) qui proxy les requêtes
    // const response = await api.get(CTR_CENTER_ENDPOINT)
    const response = await api.get('/events/latest')

    const events = response.data?.Events || response.data?.events || response.data || []
    const transformedData = transformApiDataToGeneralStatus(events)
    return { data: transformedData }
  } catch (error) {
    if (error.code === 'ERR_NETWORK' || error.message?.includes('CORS')) {
      console.warn('Erreur CORS ou réseau - utilisation des données mockées')
    } else {
      console.error('Error fetching general status:', error)
    }
    // En cas d’erreur réseau / backend, on revient sur les données mockées
    return { data: generalDataFallback }
  }
}

// GET /zone/:name
export const getZoneData = async (zoneName) => {
  await simulateDelay(800)

  // Simulation de données pour toutes les communes
  const mockData = {
    'Delmas': {
      zone: 'Delmas',
      status: {
        urgent: 3,
        pertinent: 5,
        ignored: 2,
      },
      summary: `🔥 Incidents critiques détectés\n🏃 Mouvement de foule signalé\n🚧 Blocages routiers observés\n📡 Informations en vérification\n💬 Vous pouvez demander : urgences, circulation, sécurité, météo, etc.`,
    },
    'Pétion-Ville': {
      zone: 'Pétion-Ville',
      status: {
        urgent: 1,
        pertinent: 3,
        ignored: 1,
      },
      summary: `🔥 Incidents critiques détectés\n🏃 Mouvement de foule signalé\n🚧 Blocages routiers observés\n📡 Informations en vérification\n💬 Vous pouvez demander : urgences, circulation, sécurité, météo, etc.`,
    },
    'Croix-des-Bouquets': {
      zone: 'Croix-des-Bouquets',
      status: {
        urgent: 2,
        pertinent: 4,
        ignored: 1,
      },
      summary: `🔥 Incidents critiques détectés\n🏃 Mouvement de foule signalé\n🚧 Blocages routiers observés\n📡 Informations en vérification\n💬 Vous pouvez demander : urgences, circulation, sécurité, météo, etc.`,
    },
    'Carrefour': {
      zone: 'Carrefour',
      status: {
        urgent: 4,
        pertinent: 6,
        ignored: 2,
      },
      summary: `🔥 Incidents critiques détectés\n🏃 Mouvement de foule signalé\n🚧 Blocages routiers observés\n📡 Informations en vérification\n💬 Vous pouvez demander : urgences, circulation, sécurité, météo, etc.`,
    },
    'Port-au-Prince': {
      zone: 'Port-au-Prince',
      status: {
        urgent: 5,
        pertinent: 8,
        ignored: 3,
      },
      summary: `🔥 Incidents critiques détectés\n🏃 Mouvement de foule signalé\n🚧 Blocages routiers observés\n📡 Informations en vérification\n💬 Vous pouvez demander : urgences, circulation, sécurité, météo, etc.`,
    },
    'Cité Soleil': {
      zone: 'Cité Soleil',
      status: {
        urgent: 6,
        pertinent: 7,
        ignored: 2,
      },
      summary: `🔥 Incidents critiques détectés\n🏃 Mouvement de foule signalé\n🚧 Blocages routiers observés\n📡 Informations en vérification\n💬 Vous pouvez demander : urgences, circulation, sécurité, météo, etc.`,
    },
    'Tabarre': {
      zone: 'Tabarre',
      status: {
        urgent: 1,
        pertinent: 2,
        ignored: 1,
      },
      summary: `🔥 Incidents critiques détectés\n🏃 Mouvement de foule signalé\n🚧 Blocages routiers observés\n📡 Informations en vérification\n💬 Vous pouvez demander : urgences, circulation, sécurité, météo, etc.`,
    },
  }

  // if (mockData[zoneName]) {
  //   return { data: mockData[zoneName] }
  // }

  try {
    const response = await api.get(`/zone/${zoneName}`)
    console.log('endpoint: ', zoneName)
    return { data: response.data }
  } catch (error) {
    console.error('Error fetching zone data:', error)
    return { data: mockData[zoneName] }
  }
  // Fallback pour autres zones
  return {
    data: {
      zone: zoneName,
      status: {
        urgent: 0,
        pertinent: 0,
        ignored: 0,
      },
      summary: `État des lieux — ${zoneName}\n📡 Aucune information disponible pour le moment.`,
    },
  }
}

// POST /ask - Envoyer une question au chat
export const askQuestion = async (prompt) => {
  try {
    // Validation du prompt
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      throw new Error('Prompt is required and must be a non-empty string')
    }

    const trimmedPrompt = prompt.trim()

    // Logs pour déboguer
    console.log('🔍 [API] Configuration:', {
      baseURL: API_BASE_URL,
      endpoint: '/ask',
      fullURL: `${API_BASE_URL}/ask`,
      prompt: trimmedPrompt
    })

    // Envoyer la requête POST au backend avec le format { prompt: message }
    const response = await api.post('/ask', {
      prompt: trimmedPrompt,
    })

    console.log('✅ [API] Réponse reçue:', response.data)

    // Retourner la réponse normalisée
    return {
      data: {
        response: response.data.response || 'Réponse reçue',
        prompt: response.data.prompt || prompt,
      },
    }
  } catch (error) {
    console.error('❌ [API] Error asking question:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        data: error.config?.data
      }
    })

    // En cas d'erreur, retourner une réponse de fallback
    const lowerPrompt = prompt ? prompt.toLowerCase() : ''

    // Réponses de fallback basiques
    if (lowerPrompt.includes('urgence') || lowerPrompt.includes('urgent')) {
      return {
        data: {
          response: `🚨 Informations sur les urgences à Port-au-Prince:\n\n• Données en cours de chargement\n• Veuillez réessayer dans quelques instants`,
          prompt: prompt,
        },
      }
    }

    if (lowerPrompt.includes('circulation') || lowerPrompt.includes('route') || lowerPrompt.includes('trafic')) {
      return {
        data: {
          response: `🚧 État général de la circulation à Port-au-Prince:\n\n• Données en cours de chargement\n• Veuillez réessayer dans quelques instants`,
          prompt: prompt,
        },
      }
    }

    if (lowerPrompt.includes('sécurité') || lowerPrompt.includes('securite') || lowerPrompt.includes('danger')) {
      return {
        data: {
          response: `⚠️ Niveaux de sécurité à Port-au-Prince:\n\n• Données en cours de chargement\n• Veuillez réessayer dans quelques instants`,
          prompt: prompt,
        },
      }
    }

    // Réponse par défaut en cas d'erreur
    return {
      data: {
        response: `⚠️ Désolé, je n'ai pas pu traiter votre question pour le moment. Veuillez réessayer plus tard.\n\nVotre question : "${prompt}"`,
        prompt: prompt,
      },
    }
  }
}


export default api


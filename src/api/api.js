import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_URL + '/api' || 'http://localhost:3000/api'
const CTR_CENTER_ENDPOINT = import.meta.env.VITE_API_CTR_CENTER_URL_ENDPOINT

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

  if (mockData[zoneName]) {
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

// POST /ask
export const askQuestion = async (zone, query) => {
  await simulateDelay(1200)

  // Simulation de réponses basées sur la requête
  const lowerQuery = query.toLowerCase()

  // Si pas de zone spécifiée, répondre de manière générale
  if (!zone) {
    if (lowerQuery.includes('urgence') || lowerQuery.includes('urgent')) {
      return {
        data: {
          response: `🚨 Informations sur les urgences à Port-au-Prince:\n\n• Plusieurs incidents critiques signalés\n• Interventions en cours dans différentes zones\n• Pour des informations spécifiques sur une zone, sélectionnez-la sur la carte\n\nDernière mise à jour : il y a 5 minutes`,
          zone: null,
          query,
        },
      }
    }

    if (lowerQuery.includes('circulation') || lowerQuery.includes('route') || lowerQuery.includes('trafic')) {
      return {
        data: {
          response: `🚧 État général de la circulation à Port-au-Prince:\n\n• Quelques blocages routiers signalés\n• Circulation fluide dans la plupart des zones\n• Pour des détails sur une zone spécifique, sélectionnez-la sur la carte\n\nMise à jour : il y a 3 minutes`,
          zone: null,
          query,
        },
      }
    }

    if (lowerQuery.includes('sécurité') || lowerQuery.includes('securite') || lowerQuery.includes('safety')) {
      return {
        data: {
          response: `🛡️ Niveau de sécurité général:\n\n• Situation sous surveillance dans l'ensemble de la ville\n• Forces de l'ordre présentes\n• Restez vigilant\n• Pour des informations détaillées sur une zone, sélectionnez-la sur la carte\n\nDernière alerte : il y a 10 minutes`,
          zone: null,
          query,
        },
      }
    }

    if (lowerQuery.includes('météo') || lowerQuery.includes('meteo') || lowerQuery.includes('weather')) {
      return {
        data: {
          response: `🌤️ Conditions météorologiques — Port-au-Prince:\n\n• Température : 28°C\n• Ciel dégagé\n• Visibilité : bonne\n• Aucune alerte météo\n\nConditions similaires dans toutes les zones`,
          zone: null,
          query,
        },
      }
    }

    if (lowerQuery.includes('bonjour') || lowerQuery.includes('salut') || lowerQuery.includes('hello')) {
      return {
        data: {
          response: `Bonjour ! 👋\n\nJe suis votre assistant Patrol-X. Je peux vous aider avec :\n• Informations sur les zones de Port-au-Prince\n• Urgences et incidents\n• État de la circulation\n• Sécurité\n• Météo\n\nPour des informations spécifiques sur une zone, sélectionnez-la sur la carte !`,
          zone: null,
          query,
        },
      }
    }

    if (lowerQuery.includes('aide') || lowerQuery.includes('help')) {
      return {
        data: {
          response: `💬 Voici comment je peux vous aider :\n\n• Posez-moi des questions sur les zones de Port-au-Prince\n• Sélectionnez une zone sur la carte pour voir son état des lieux\n• Demandez des informations sur : urgences, circulation, sécurité, météo\n\nJe suis là pour vous informer en temps réel !`,
          zone: null,
          query,
        },
      }
    }

    // Réponse par défaut sans zone
    return {
      data: {
        response: `📊 J'ai bien reçu votre question : "${query}"\n\nPour vous donner des informations précises, vous pouvez :\n• Sélectionner une zone spécifique sur la carte\n• Me poser des questions générales sur : urgences, circulation, sécurité, météo\n\nQue souhaitez-vous savoir ?`,
        zone: null,
        query,
      },
    }
  }

  // Réponses avec zone spécifiée
  if (lowerQuery.includes('urgence') || lowerQuery.includes('urgent')) {
    return {
      data: {
        response: `🚨 Urgences détectées dans ${zone}:\n\n• 2 incidents critiques signalés\n• Intervention en cours\n• Évitez la zone si possible\n\nDernière mise à jour : il y a 5 minutes`,
        zone,
        query,
      },
    }
  }

  if (lowerQuery.includes('circulation') || lowerQuery.includes('route') || lowerQuery.includes('trafic')) {
    return {
      data: {
        response: `🚧 État de la circulation — ${zone}:\n\n• Blocages routiers sur la route principale\n• Déviation recommandée via les rues secondaires\n• Temps de trajet estimé : +15 minutes\n\nMise à jour : il y a 3 minutes`,
        zone,
        query,
      },
    }
  }

  if (lowerQuery.includes('sécurité') || lowerQuery.includes('securite') || lowerQuery.includes('safety')) {
    return {
      data: {
        response: `🛡️ Niveau de sécurité — ${zone}:\n\n• Situation sous surveillance\n• Forces de l'ordre présentes\n• Restez vigilant\n\nDernière alerte : il y a 10 minutes`,
        zone,
        query,
      },
    }
  }

  if (lowerQuery.includes('météo') || lowerQuery.includes('meteo') || lowerQuery.includes('weather')) {
    return {
      data: {
        response: `🌤️ Conditions météorologiques — ${zone}:\n\n• Température : 28°C\n• Ciel dégagé\n• Visibilité : bonne\n• Aucune alerte météo`,
        zone,
        query,
      },
    }
  }

  // Réponse par défaut avec zone
  return {
    data: {
      response: `📊 Analyse de votre demande concernant "${query}" dans ${zone}:\n\nLes données sont en cours de traitement. Pour des informations plus précises, essayez de demander :\n• urgences\n• circulation\n• sécurité\n• météo`,
      zone,
      query,
    },
  }
}

export default api


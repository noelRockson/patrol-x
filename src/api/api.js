import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Simuler les réponses en attendant le backend
const simulateDelay = (ms = 1000) => new Promise(resolve => setTimeout(resolve, ms))

// GET /general-status (État général pour toutes les zones)
export const getGeneralStatus = async () => {
  await simulateDelay(800)
  
  // Simulation de statistiques agrégées de toutes les zones
  // TODO: Remplacer par l'appel API réel : GET ${API_BASE_URL}/general-status
  const generalData = {
    status: {
      urgent: 22,    // Somme de toutes les zones : 3+1+2+4+5+6+1 = 22
      pertinent: 35, // Somme : 5+3+4+6+8+7+2 = 35
      ignored: 12,   // Somme : 2+1+1+2+3+2+1 = 12
    },
    summary: `📊 **État des lieux général — Port-au-Prince**\n\n🏛️ **7 communes surveillées**\n🔥 **22 incidents urgents** signalés\n📌 **35 incidents pertinents** en cours\n💤 **12 incidents ignorés**\n\n⚠️ **Zones nécessitant attention** : Cité Soleil (6 urgents), Port-au-Prince (5 urgents), Carrefour (4 urgents)\n\n📡 **Dernière mise à jour** : Il y a 2 minutes\n💬 Posez-moi des questions ou sélectionnez une zone pour plus de détails !`,
    zones: [
      { name: 'Cité Soleil', urgent: 6, pertinent: 7, ignored: 2 },
      { name: 'Port-au-Prince', urgent: 5, pertinent: 8, ignored: 3 },
      { name: 'Carrefour', urgent: 4, pertinent: 6, ignored: 2 },
      { name: 'Delmas', urgent: 3, pertinent: 5, ignored: 2 },
      { name: 'Croix-des-Bouquets', urgent: 2, pertinent: 4, ignored: 1 },
      { name: 'Pétion-Ville', urgent: 1, pertinent: 3, ignored: 1 },
      { name: 'Tabarre', urgent: 1, pertinent: 2, ignored: 1 },
    ],
    lastUpdate: new Date().toISOString(),
  }
  
  // TODO: Remplacer par l'appel API réel quand le backend sera prêt
  // try {
  //   const response = await api.get('/general-status')
  //   return { data: response.data }
  // } catch (error) {
  //   console.error('Error fetching general status:', error)
  //   return { data: generalData } // Fallback sur données mockées
  // }
  
  return { data: generalData }
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


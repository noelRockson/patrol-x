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

  // Réponse par défaut
  return {
    data: {
      response: `📊 Analyse de votre demande concernant "${query}" dans ${zone}:\n\nLes données sont en cours de traitement. Pour des informations plus précises, essayez de demander :\n• urgences\n• circulation\n• sécurité\n• météo`,
      zone,
      query,
    },
  }
}

export default api


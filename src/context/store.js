import { create } from 'zustand'

export const useStore = create((set) => ({
  // Zones sélectionnées (tableau de chaînes)
  selectedZone: [],
  setSelectedZone: (zone) => set((state) => {
    // Si la zone est déjà dans le tableau, ne pas l'ajouter
    if (state.selectedZone.includes(zone)) {
      return state
    }
    // Ajouter la zone au tableau et la définir comme zone active
    return { 
      selectedZone: [...state.selectedZone, zone],
      activeZone: zone
    }
  }),
  removeSelectedZone: (zone) => set((state) => {
    const newZones = state.selectedZone.filter(z => z !== zone)
    // Si c'est la dernière zone, réinitialiser les priorités et données
    if (newZones.length === 0) {
      return { 
        selectedZone: [],
        activeZone: null,
        priorities: { urgent: 0, pertinent: 0, ignored: 0 },
        zoneData: null
      }
    }
    // Si la zone supprimée était la zone active, mettre à jour l'activeZone
    let newActiveZone = state.activeZone
    if (state.activeZone === zone && newZones.length > 0) {
      newActiveZone = newZones[newZones.length - 1] // Prendre la dernière zone
    } else if (state.activeZone === zone) {
      newActiveZone = null
    }
    return { 
      selectedZone: newZones,
      activeZone: newActiveZone
    }
  }),
  clearSelectedZones: () => set({ 
    selectedZone: [],
    activeZone: null,
    priorities: { urgent: 0, pertinent: 0, ignored: 0 },
    zoneData: null,
    // Note: generalStatus sera rechargé automatiquement par SidebarPriority
    // Réinitialiser zoneData pour que le chat ne garde pas l'ancien état
  }),

  // Zone active actuellement affichée
  activeZone: null,
  setActiveZone: (zone) => set({ activeZone: zone }),

  // Données de la zone
  zoneData: null,
  setZoneData: (data) => set({ zoneData: data }),

  // État général (pour toutes les zones)
  generalStatus: null,
  setGeneralStatus: (status) => set({ generalStatus: status }),

  // Messages du chat
  messages: [],
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  setMessages: (messages) => set({ messages }),

  // Priorités
  priorities: {
    urgent: 0,
    pertinent: 0,
    ignored: 0,
  },
  setPriorities: (priorities) => set({ priorities }),

  // État de chargement
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}))


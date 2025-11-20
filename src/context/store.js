import { create } from 'zustand'

export const useStore = create((set) => ({
  // Zone sélectionnée
  selectedZone: null,
  setSelectedZone: (zone) => set({ selectedZone: zone }),

  // Données de la zone
  zoneData: null,
  setZoneData: (data) => set({ zoneData: data }),

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


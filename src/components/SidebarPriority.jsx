import React, { useEffect } from 'react'
import { useStore } from '../context/store'
import { getZoneData, getGeneralStatus } from '../api/api'

const SidebarPriority = ({ isMobile = false }) => {
  const { selectedZone, priorities, removeSelectedZone, clearSelectedZones, activeZone, setActiveZone, setZoneData, setPriorities, setIsLoading, generalStatus, setGeneralStatus, zoneData } = useStore()
  // isDisabled est true si le tableau est vide
  const isDisabled = !selectedZone || selectedZone.length === 0

  // Charger l'état général au démarrage et quand aucune zone n'est sélectionnée
  useEffect(() => {
    if (isDisabled) {
      const loadGeneralStatus = async () => {
        setIsLoading(true)
        try {
          const response = await getGeneralStatus()
          const data = response.data
          setGeneralStatus(data)
          setPriorities(data.status)
          // Ne pas mettre à jour zoneData avec l'état général pour que le chat ne l'affiche pas
        } catch (error) {
          console.error('Error fetching general status:', error)
        } finally {
          setIsLoading(false)
        }
      }
      loadGeneralStatus()
    } else {
      // Réinitialiser l'état général quand une zone est sélectionnée
      setGeneralStatus(null)
    }
  }, [isDisabled, setGeneralStatus, setPriorities, setIsLoading])

  // Charger automatiquement les données quand activeZone change (après suppression d'une zone)
  useEffect(() => {
    // Si activeZone existe et qu'on a des zones sélectionnées, charger les données
    // Ne charger que si les données actuelles ne correspondent pas à la zone active
    if (activeZone && selectedZone && selectedZone.length > 0 && selectedZone.includes(activeZone)) {
      // Vérifier si les données actuelles correspondent à la zone active
      const currentZoneName = zoneData?.zone
      if (currentZoneName !== activeZone) {
        const loadZoneData = async () => {
          setIsLoading(true)
          try {
            const response = await getZoneData(activeZone)
            const data = response.data
            
            setZoneData(data)
            setPriorities(data.status)
          } catch (error) {
            console.error('Error fetching zone data:', error)
          } finally {
            setIsLoading(false)
          }
        }
        loadZoneData()
      }
    }
  }, [activeZone, selectedZone, zoneData, setZoneData, setPriorities, setIsLoading])

  // Fonction pour charger les données d'une zone spécifique
  const handleLoadZoneData = async (zoneName) => {
    setIsLoading(true)
    setActiveZone(zoneName)
    
    try {
      const response = await getZoneData(zoneName)
      const data = response.data
      
      setZoneData(data)
      setPriorities(data.status)
    } catch (error) {
      console.error('Error fetching zone data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    {
      emoji: '🔥',
      label: 'Urgent',
      count: priorities.urgent,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      emoji: '📌',
      label: 'Pertinent',
      count: priorities.pertinent,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      emoji: '💤',
      label: 'Ignoré',
      count: priorities.ignored,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
  ]

  return (
    <div className="h-full bg-white dark:bg-gray-800 flex flex-col">
      {/* Header */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
          {isDisabled 
            ? 'Centre de contrôle' // ? 'État des lieux — Vue d\'ensemble' 
            : activeZone 
              ? `État des lieux — ${activeZone}`
              : 'État des lieux'
          }
        </h2>
        
        {/* AFFICHAGE DES ZONES (CHIPS/TAGS) */}
        {selectedZone && selectedZone.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedZone.map((zone, index) => {
              const isActive = activeZone === zone
              return (
                <div 
                  key={`${zone}-${index}`}
                  onClick={() => handleLoadZoneData(zone)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border shadow-sm hover:shadow-md transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 dark:bg-blue-700 text-white border-blue-600 dark:border-blue-700 ring-2 ring-blue-300 dark:ring-blue-600'
                      : 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700 hover:bg-blue-200 dark:hover:bg-blue-800/50'
                  }`}
                >
                  <span>{zone}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      // Si c'est le dernier tag, réinitialiser complètement
                      if (selectedZone.length === 1) {
                        clearSelectedZones()
                      } else {
                        removeSelectedZone(zone)
                      }
                    }}
                    className={`ml-0.5 p-0.5 rounded-full transition-colors focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                      isActive
                        ? 'text-white hover:bg-blue-500 dark:hover:bg-blue-600'
                        : 'text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800'
                    }`}
                    aria-label={`Retirer ${zone}`}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        )}
        
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
        {isDisabled ? (
          <>
            {/* Titre pour l'état général
            <div className="mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                📊 Vue d'ensemble — Port-au-Prince
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Statistiques agrégées de toutes les zones
              </p>
            </div> */}
            
            {/* Statistiques générales */}
            <div className="space-y-3 md:space-y-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border-2 transition-all bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700/50 dark:to-gray-800/50 border-gray-200 dark:border-gray-600 hover:shadow-md dark:hover:shadow-gray-900/50"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{category.emoji}</div>
                      <div>
                        <div className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">
                          {category.label}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {category.count === 0 && 'Aucun incident'}
                          {category.count === 1 && '1 incident au total'}
                          {category.count > 1 && `${category.count} incidents au total`}
                        </div>
                      </div>
                    </div>
                    <div className={`text-2xl md:text-3xl font-bold ${category.color}`}>
                      {category.count}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Liste des zones avec statistiques */}
            {generalStatus && generalStatus.zones && generalStatus.zones.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wide">
                  Détails par zone
                </h4>
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {generalStatus.zones
                    .sort((a, b) => (b.urgent + b.pertinent) - (a.urgent + a.pertinent)) // Trier par nombre d'incidents
                    .map((zone, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                        {zone.name}
                      </span>
                      <div className="flex items-center gap-2 text-xs">
                        {zone.urgent > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-semibold">
                            🔥{zone.urgent}
                          </span>
                        )}
                        {zone.pertinent > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold">
                            📌{zone.pertinent}
                          </span>
                        )}
                        {zone.ignored > 0 && (
                          <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                            💤{zone.ignored}
                          </span>
                        )}
                        {zone.urgent === 0 && zone.pertinent === 0 && zone.ignored === 0 && (
                          <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                            Aucun incident
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Message de chargement */}
            {!generalStatus && (
              <div className="text-center text-gray-400 dark:text-gray-500 py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
                <p className="text-xs">Chargement des statistiques générales...</p>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : `${category.bgColor} dark:bg-gray-700/50 ${category.borderColor} dark:border-gray-600 hover:shadow-md dark:hover:shadow-gray-900/50 cursor-pointer active:scale-[0.98]`
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{category.emoji}</div>
                    <div>
                      <div className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">
                        {category.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {category.count === 0 && 'Aucun incident'}
                        {category.count === 1 && '1 incident'}
                        {category.count > 1 && `${category.count} incidents`}
                      </div>
                    </div>
                  </div>
                  <div className={`text-2xl md:text-3xl font-bold ${category.color}`}>
                    {category.count}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SidebarPriority

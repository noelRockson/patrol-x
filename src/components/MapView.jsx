import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Polygon, Tooltip, Marker, useMap } from 'react-leaflet'
import { useStore } from '../context/store'
import { getZoneData } from '../api/api'
import { portAuPrinceCommunes, communePolygons } from '../utils/communesData'
import { haitiBounds, defaultCenter, minZoom, maxZoom, defaultZoom, portAuPrinceBounds } from '../utils/mapBounds'
import L from 'leaflet'

// Fix pour les icônes Leaflet par défaut
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Composant pour contrôler les limites de la carte
function MapBoundsController({ selectedZone, isMobile }) {
  const map = useMap()
  
  useEffect(() => {
    // Définir les limites maximales (Haïti)
    map.setMaxBounds(haitiBounds)
    
    // Empêcher le zoom trop loin
    map.setMinZoom(minZoom)
    map.setMaxZoom(maxZoom)
    
    // Recentrer si on sort des limites
    map.on('drag', () => {
      const currentBounds = map.getBounds()
      if (!currentBounds.intersects(haitiBounds)) {
        map.fitBounds(haitiBounds)
      }
    })
    
    // Gérer le zoom sur la zone sélectionnée
    if (selectedZone) {
      const commune = portAuPrinceCommunes.find(c => c.name === selectedZone)
      if (commune) {
        const zoomLevel = isMobile ? 12 : 13
        map.flyTo(commune.center, zoomLevel, {
          duration: 1,
          maxZoom: maxZoom // Respecter le zoom maximum
        })
      }
    } else {
      // Recentrer sur Port-au-Prince si aucune sélection
      map.flyTo(defaultCenter, defaultZoom, {
        duration: 1,
        maxZoom: maxZoom
      })
    }
  }, [selectedZone, map, isMobile])
  
  return null
}

// Composant pour forcer le rebond si l'utilisateur sort des limites
function ForceBounds() {
  const map = useMap()
  
  useEffect(() => {
    const checkBounds = () => {
      const currentCenter = map.getCenter()
      const currentZoom = map.getZoom()
      
      // Vérifier si le centre est hors d'Haïti
      if (currentCenter.lat < haitiBounds[0][0] || currentCenter.lat > haitiBounds[1][0] ||
          currentCenter.lng < haitiBounds[0][1] || currentCenter.lng > haitiBounds[1][1]) {
        
        // Recentrer sur Haïti
        map.flyTo(defaultCenter, Math.max(currentZoom, minZoom), {
          duration: 1
        })
      }
      
      // Forcer le zoom dans les limites
      if (currentZoom < minZoom) {
        map.setZoom(minZoom)
      } else if (currentZoom > maxZoom) {
        map.setZoom(maxZoom)
      }
    }
    
    // Vérifier périodiquement et sur les événements de déplacement
    map.on('moveend', checkBounds)
    map.on('zoomend', () => {
      checkBounds()
      // Invalider la taille pour forcer le rechargement des tuiles
      setTimeout(() => {
        map.invalidateSize()
      }, 100)
    })
    
    const interval = setInterval(checkBounds, 1000) // Vérifier toutes les secondes
    
    return () => {
      map.off('moveend', checkBounds)
      map.off('zoomend', checkBounds)
      clearInterval(interval)
    }
  }, [map])
  
  return null
}

// Composant pour afficher le polygone d'une commune avec style organique
function CommunePolygon({ commune, isSelected, onClick, isMobile }) {
  // Utiliser le polygone organique s'il existe, sinon les bounds
  const positions = commune.polygon || communePolygons[commune.id] || [
    [commune.bounds[0][0], commune.bounds[0][1]],
    [commune.bounds[0][0], commune.bounds[1][1]],
    [commune.bounds[1][0], commune.bounds[1][1]],
    [commune.bounds[1][0], commune.bounds[0][1]],
    [commune.bounds[0][0], commune.bounds[0][1]]
  ]

  // Styles dynamiques avec effets améliorés
  const getPolygonStyle = () => {
    const baseStyle = {
      fillColor: commune.color,
      color: isSelected ? '#ffffff' : commune.color,
      weight: isSelected ? 3 : 2,
      opacity: isSelected ? 0.9 : 0.7,
      fillOpacity: isSelected ? 0.3 : 0.15,
      dashArray: isSelected ? '0' : '5,5',
      lineCap: 'round',
      lineJoin: 'round'
    }

    return baseStyle
  }

  return (
    <Polygon
      positions={positions}
      pathOptions={getPolygonStyle()}
      eventHandlers={{
        click: () => onClick(commune.name),
        mouseover: (e) => {
          if (!isMobile) {
            const layer = e.target
            layer.setStyle({
              weight: 3,
              opacity: 0.9,
              fillOpacity: 0.25,
              dashArray: '0'
            })
          }
        },
        mouseout: (e) => {
          if (!isMobile) {
            const layer = e.target
            layer.setStyle(getPolygonStyle())
          }
        }
      }}
      className={`commune-polygon commune-${commune.id} ${isSelected ? 'selected-commune' : ''}`}
    >
      <Tooltip 
        permanent={false} 
        direction="center" 
        className="commune-tooltip"
        opacity={1}
      >
        <div className="text-center min-w-[120px]">
          <strong className="text-xs md:text-sm">{commune.name}</strong>
          <br />
          <span className="text-[10px] md:text-xs text-gray-600">
            {commune.population.toLocaleString()} hab.
          </span>
        </div>
      </Tooltip>
    </Polygon>
  )
}

// Composant pour afficher le nom de la commune au centre
function CommuneLabel({ commune, isMobile }) {
  const customIcon = new L.DivIcon({
    html: `
      <div class="commune-label bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-300 shadow-lg">
        <span class="font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-gray-800 whitespace-nowrap">${commune.name}</span>
      </div>
    `,
    className: 'commune-label-container',
    iconSize: isMobile ? [80, 30] : [100, 40],
    iconAnchor: isMobile ? [40, 15] : [50, 20]
  })

  return (
    <Marker 
      position={commune.center} 
      icon={customIcon}
      interactive={false}
    />
  )
}

const MapView = ({onZoneSelect}) => {
  const { selectedZone, setSelectedZone, setZoneData, setPriorities, setIsLoading } = useStore()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleCommuneClick = async (communeName) => {
    if (selectedZone === communeName) return

    setSelectedZone(communeName)
    setIsLoading(true)

    try {
      const response = await getZoneData(communeName)
      const data = response.data

      setZoneData(data)
      setPriorities(data.status)

      // Ouvrir le chat automatiquement après sélection
      if (onZoneSelect) {
        onZoneSelect()
      }

    } catch (error) {
      console.error('Error fetching zone data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-[1000] px-3 md:px-6 py-3 md:py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Carte interactive</h2>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">Port-au-Prince, Haïti</p>
      </div>

      <div className="h-full pt-16 md:pt-20 pb-2 md:pb-4 px-2 md:px-4">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          minZoom={minZoom}
          maxZoom={maxZoom}
          maxBounds={haitiBounds}
          maxBoundsViscosity={1.0} // Force le rebond aux limites
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg shadow-lg z-0"
          scrollWheelZoom={true}
          touchZoom={true}
          dragging={true}
          tap={true}
          bounceAtZoomLimits={true} // Rebond aux limites de zoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            updateWhenZooming={true}
            updateWhenIdle={true}
          />
          
          {portAuPrinceCommunes.map(commune => (
            <CommunePolygon 
              key={commune.id}
              commune={commune}
              isSelected={selectedZone === commune.name}
              onClick={handleCommuneClick}
              isMobile={isMobile}
            />
          ))}
          
          {portAuPrinceCommunes.map(commune => (
            <CommuneLabel 
              key={commune.id}
              commune={commune}
              isMobile={isMobile}
            />
          ))}
          
          <MapBoundsController selectedZone={selectedZone} isMobile={isMobile} />
          <ForceBounds />
        </MapContainer>
      </div>

      <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 z-[1000] pointer-events-none">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 md:px-4 py-1.5 md:py-2 border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
          <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-300 text-center">
            {isMobile ? 'Touchez' : 'Cliquez sur'} une commune pour voir l'état des lieux
          </p>
          <p className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400 text-center mt-1">
            Zone limitée à Haïti
          </p>
        </div>
      </div>
    </div>
  )
}

export default MapView
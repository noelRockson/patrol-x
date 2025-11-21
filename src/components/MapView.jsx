import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Polygon, Tooltip, Marker, useMap } from 'react-leaflet'
import { useStore } from '../context/store'
import { getZoneData } from '../api/api'
import { portAuPrinceCommunes, communePolygons } from '../utils/communesData'
import L from 'leaflet'

// Fix pour les icônes Leaflet par défaut
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Composant pour contrôler la carte (zoom, centrage)
function MapController({ selectedZone, isMobile }) {
  const map = useMap()
  
  useEffect(() => {
    if (selectedZone) {
      const commune = portAuPrinceCommunes.find(c => c.name === selectedZone)
      if (commune) {
        map.flyTo(commune.center, isMobile ? 12 : 13, {
          duration: 1
        })
      }
    } else {
      map.setView([18.550, -72.302], isMobile ? 10 : 11, {
        animate: true,
        duration: 1
      })
    }
  }, [selectedZone, map, isMobile])
  
  return null
}

// Composant pour afficher le polygone d'une commune
function CommunePolygon({ commune, isSelected, onClick, isMobile }) {
  const polygon = communePolygons[commune.id] || commune.bounds
  
  const positions = polygon.length > 2 
    ? polygon 
    : [
        [commune.bounds[0][0], commune.bounds[0][1]],
        [commune.bounds[0][0], commune.bounds[1][1]],
        [commune.bounds[1][0], commune.bounds[1][1]],
        [commune.bounds[1][0], commune.bounds[0][1]],
        [commune.bounds[0][0], commune.bounds[0][1]]
      ]
  
  const fillOpacity = isSelected ? 0.5 : 0.2
  const weight = isSelected ? (isMobile ? 2 : 3) : 1
  const opacity = isSelected ? 0.8 : 0.6
  
  return (
    <Polygon
      positions={positions}
      pathOptions={{
        fillColor: commune.color,
        color: commune.color,
        weight: weight,
        opacity: opacity,
        fillOpacity: fillOpacity
      }}
      eventHandlers={{
        click: () => onClick(commune.name),
        mouseover: (e) => {
          if (!isMobile) {
            const layer = e.target
            layer.setStyle({
              weight: 2,
              opacity: 0.8,
              fillOpacity: 0.3
            })
          }
        },
        mouseout: (e) => {
          if (!isMobile) {
            const layer = e.target
            layer.setStyle({
              weight: weight,
              opacity: opacity,
              fillOpacity: fillOpacity
            })
          }
        }
      }}
      className={isSelected ? 'selected-commune' : ''}
    >
      <Tooltip 
        permanent={false} 
        direction="center" 
        className="commune-tooltip"
        opacity={1}
      >
        <div className="text-center">
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

const MapView = () => {
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
    } catch (error) {
      console.error('Error fetching zone data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full bg-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 z-[1000] px-3 md:px-6 py-3 md:py-4 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <h2 className="text-base md:text-lg font-semibold text-gray-900">Carte interactive</h2>
        <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1">Port-au-Prince, Haïti</p>
      </div>

      <div className="h-full pt-16 md:pt-20 pb-2 md:pb-4 px-2 md:px-4">
        <MapContainer
          center={[18.594, -72.302]}
          zoom={isMobile ? 10 : 11}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg shadow-lg z-0"
          scrollWheelZoom={true}
          touchZoom={true}
          dragging={true}
          tap={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
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
          
          <MapController selectedZone={selectedZone} isMobile={isMobile} />
        </MapContainer>
      </div>

      <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 z-[1000] pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 md:px-4 py-1.5 md:py-2 border border-gray-200 max-w-md mx-auto">
          <p className="text-[10px] md:text-xs text-gray-600 text-center">
            {isMobile ? 'Touchez' : 'Cliquez sur'} une commune pour voir l'état des lieux
          </p>
        </div>
      </div>
    </div>
  )
}

export default MapView
import React, { useEffect } from 'react'
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
function MapController({ selectedZone }) {
  const map = useMap()
  
  useEffect(() => {
    if (selectedZone) {
      const commune = portAuPrinceCommunes.find(c => c.name === selectedZone)
      if (commune) {
        map.flyTo(commune.center, 13, {
          duration: 1
        })
      }
    } else {
      map.setView([18.550, -72.302], 11, {
        animate: true,
        duration: 1
      })
    }
  }, [selectedZone, map])
  
  return null
}

// Composant pour afficher le polygone d'une commune
function CommunePolygon({ commune, isSelected, onClick }) {
  const polygon = communePolygons[commune.id] || commune.bounds
  
  // Créer un rectangle à partir des bounds si pas de polygone
  const positions = polygon.length > 2 
    ? polygon 
    : [
        [commune.bounds[0][0], commune.bounds[0][1]], // Sud-ouest
        [commune.bounds[0][0], commune.bounds[1][1]], // Nord-ouest
        [commune.bounds[1][0], commune.bounds[1][1]], // Nord-est
        [commune.bounds[1][0], commune.bounds[0][1]], // Sud-est
        [commune.bounds[0][0], commune.bounds[0][1]] // Fermeture
      ]
  
  const fillOpacity = isSelected ? 0.5 : 0.2
  const weight = isSelected ? 3 : 1
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
          const layer = e.target
          layer.setStyle({
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.3
          })
        },
        mouseout: (e) => {
          const layer = e.target
          layer.setStyle({
            weight: weight,
            opacity: opacity,
            fillOpacity: fillOpacity
          })
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
          <strong className="text-sm">{commune.name}</strong>
          <br />
          <span className="text-xs text-gray-600">{commune.population.toLocaleString()} hab.</span>
        </div>
      </Tooltip>
    </Polygon>
  )
}

// Composant pour afficher le nom de la commune au centre
function CommuneLabel({ commune }) {
  const customIcon = new L.DivIcon({
    html: `
      <div class="commune-label bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-300 shadow-lg">
        <span class="font-bold text-sm text-gray-800 whitespace-nowrap">${commune.name}</span>
      </div>
    `,
    className: 'commune-label-container',
    iconSize: [100, 40],
    iconAnchor: [50, 20]
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
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[1000] px-6 py-4 bg-white/90 backdrop-blur-sm border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Carte interactive</h2>
        <p className="text-sm text-gray-500 mt-1">Port-au-Prince, Haïti</p>
      </div>

      {/* Map Container */}
      <div className="h-full pt-20 pb-4 px-4">
        <MapContainer
          center={[18.550, -72.302]} // Centré sur Delmas
          zoom={11}
          style={{ height: '100%', width: '100%' }}
          className="rounded-lg shadow-lg z-0"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Affichage des polygones des communes */}
          {portAuPrinceCommunes.map(commune => (
            <CommunePolygon 
              key={commune.id}
              commune={commune}
              isSelected={selectedZone === commune.name}
              onClick={handleCommuneClick}
            />
          ))}
          
          {/* Marqueurs de centre avec noms des communes */}
          {portAuPrinceCommunes.map(commune => (
            <CommuneLabel 
              key={commune.id}
              commune={commune}
            />
          ))}
          
          <MapController selectedZone={selectedZone} />
        </MapContainer>
      </div>

      {/* Légende ou instructions */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000] pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-200 max-w-md mx-auto">
          <p className="text-xs text-gray-600 text-center">
            Cliquez sur une commune pour voir l'état des lieux
          </p>
        </div>
      </div>
    </div>
  )
}

export default MapView

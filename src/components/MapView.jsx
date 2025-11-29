// // import React, { useEffect, useState } from 'react'
// // import { MapContainer, TileLayer, Polygon, Tooltip, Marker, useMap } from 'react-leaflet'
// // import { useStore } from '../context/store'
// // import { getZoneData } from '../api/api'
// // import { portAuPrinceCommunes, communePolygons } from '../utils/communesData'
// // import { haitiBounds, defaultCenter, minZoom, maxZoom, defaultZoom, portAuPrinceBounds } from '../utils/mapBounds'
// // import L from 'leaflet'

// // // Fix pour les icônes Leaflet par défaut
// // delete L.Icon.Default.prototype._getIconUrl
// // L.Icon.Default.mergeOptions({
// //   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
// //   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
// //   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
// // })

// // // Composant pour contrôler les limites de la carte
// // function MapBoundsController({ selectedZone, activeZone, isMobile }) {
// //   const map = useMap()

// //   useEffect(() => {
// //     // Définir les limites maximales (Haïti)
// //     map.setMaxBounds(haitiBounds)

// //     // Empêcher le zoom trop loin
// //     map.setMinZoom(minZoom)
// //     map.setMaxZoom(maxZoom)

// //     // Recentrer si on sort des limites
// //     map.on('drag', () => {
// //       const currentBounds = map.getBounds()
// //       if (!currentBounds.intersects(haitiBounds)) {
// //         map.fitBounds(haitiBounds)
// //       }
// //     })

// //     // Gérer le zoom sur la zone active, sinon la dernière zone sélectionnée
// //     const zoneToZoom = activeZone || (selectedZone && selectedZone.length > 0 ? selectedZone[selectedZone.length - 1] : null)
// //     if (zoneToZoom) {
// //       const commune = portAuPrinceCommunes.find(c => c.name === zoneToZoom)
// //       if (commune) {
// //         const zoomLevel = isMobile ? 12 : 13
// //         map.flyTo(commune.center, zoomLevel, {
// //           duration: 1,
// //           maxZoom: maxZoom // Respecter le zoom maximum
// //         })
// //       }
// //     } else {
// //       // Recentrer sur Port-au-Prince si aucune sélection
// //       map.flyTo(defaultCenter, defaultZoom, {
// //         duration: 1,
// //         maxZoom: maxZoom
// //       })
// //     }
// //   }, [selectedZone, activeZone, map, isMobile])

// //   return null
// // }

// // // Composant pour forcer le rebond si l'utilisateur sort des limites
// // function ForceBounds() {
// //   const map = useMap()

// //   useEffect(() => {
// //     const checkBounds = () => {
// //       const currentCenter = map.getCenter()
// //       const currentZoom = map.getZoom()

// //       // Vérifier si le centre est hors d'Haïti
// //       if (currentCenter.lat < haitiBounds[0][0] || currentCenter.lat > haitiBounds[1][0] ||
// //           currentCenter.lng < haitiBounds[0][1] || currentCenter.lng > haitiBounds[1][1]) {

// //         // Recentrer sur Haïti
// //         map.flyTo(defaultCenter, Math.max(currentZoom, minZoom), {
// //           duration: 1
// //         })
// //       }

// //       // Forcer le zoom dans les limites
// //       if (currentZoom < minZoom) {
// //         map.setZoom(minZoom)
// //       } else if (currentZoom > maxZoom) {
// //         map.setZoom(maxZoom)
// //       }
// //     }

// //     // Vérifier périodiquement et sur les événements de déplacement
// //     map.on('moveend', checkBounds)
// //     map.on('zoomend', () => {
// //       checkBounds()
// //       // Invalider la taille pour forcer le rechargement des tuiles
// //       setTimeout(() => {
// //         map.invalidateSize()
// //       }, 100)
// //     })

// //     const interval = setInterval(checkBounds, 1000) // Vérifier toutes les secondes

// //     return () => {
// //       map.off('moveend', checkBounds)
// //       map.off('zoomend', checkBounds)
// //       clearInterval(interval)
// //     }
// //   }, [map])

// //   return null
// // }

// // // Composant pour afficher le polygone d'une commune avec style organique
// // function CommunePolygon({ commune, isSelected, isActive, onClick, isMobile }) {
// //   // Utiliser le polygone organique s'il existe, sinon les bounds
// //   const positions = commune.polygon || communePolygons[commune.id] || [
// //     [commune.bounds[0][0], commune.bounds[0][1]],
// //     [commune.bounds[0][0], commune.bounds[1][1]],
// //     [commune.bounds[1][0], commune.bounds[1][1]],
// //     [commune.bounds[1][0], commune.bounds[0][1]],
// //     [commune.bounds[0][0], commune.bounds[0][1]]
// //   ]

// //   // Styles dynamiques avec effets améliorés
// //   const getPolygonStyle = () => {
// //     const baseStyle = {
// //       fillColor: commune.color,
// //       color: isActive ? '#ffffff' : (isSelected ? '#ffffff' : commune.color),
// //       weight: isActive ? 4 : (isSelected ? 3 : 2),
// //       opacity: isActive ? 1.0 : (isSelected ? 0.9 : 0.7),
// //       fillOpacity: isActive ? 0.4 : (isSelected ? 0.3 : 0.15),
// //       dashArray: isActive ? '0' : (isSelected ? '0' : '5,5'),
// //       lineCap: 'round',
// //       lineJoin: 'round'
// //     }

// //     return baseStyle
// //   }

// //   return (
// //     <Polygon
// //       positions={positions}
// //       pathOptions={getPolygonStyle()}
// //       eventHandlers={{
// //         click: () => onClick(commune.name),
// //         mouseover: (e) => {
// //           if (!isMobile) {
// //             const layer = e.target
// //             layer.setStyle({
// //               weight: 3,
// //               opacity: 0.9,
// //               fillOpacity: 0.25,
// //               dashArray: '0'
// //             })
// //           }
// //         },
// //         mouseout: (e) => {
// //           if (!isMobile) {
// //             const layer = e.target
// //             layer.setStyle(getPolygonStyle())
// //           }
// //         }
// //       }}
// //       className={`commune-polygon commune-${commune.id} ${isActive ? 'selected-commune' : ''} ${isSelected ? 'selected-commune' : ''}`}
// //     >
// //       <Tooltip 
// //         permanent={false} 
// //         direction="center" 
// //         className="commune-tooltip"
// //         opacity={1}
// //       >
// //         <div className="text-center min-w-[120px]">
// //           <strong className="text-xs md:text-sm">{commune.name}</strong>
// //           <br />
// //           <span className="text-[10px] md:text-xs text-gray-600">
// //             {commune.population.toLocaleString()} hab.
// //           </span>
// //         </div>
// //       </Tooltip>
// //     </Polygon>
// //   )
// // }

// // // Composant pour afficher le nom de la commune au centre
// // function CommuneLabel({ commune, isMobile }) {
// //   const customIcon = new L.DivIcon({
// //     html: `
// //       <div class="commune-label bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-300 shadow-lg">
// //         <span class="font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-gray-800 whitespace-nowrap">${commune.name}</span>
// //       </div>
// //     `,
// //     className: 'commune-label-container',
// //     iconSize: isMobile ? [80, 30] : [100, 40],
// //     iconAnchor: isMobile ? [40, 15] : [50, 20]
// //   })

// //   return (
// //     <Marker 
// //       position={commune.center} 
// //       icon={customIcon}
// //       interactive={false}
// //     />
// //   )
// // }

// // const MapView = ({onZoneSelect}) => {
// //   const { selectedZone, setSelectedZone, setZoneData, setPriorities, setIsLoading, activeZone, setActiveZone } = useStore()
// //   const [isMobile, setIsMobile] = useState(false)

// //   useEffect(() => {
// //     const checkMobile = () => {
// //       setIsMobile(window.innerWidth < 768)
// //     }

// //     checkMobile()
// //     window.addEventListener('resize', checkMobile)

// //     return () => window.removeEventListener('resize', checkMobile)
// //   }, [])

// //   const handleCommuneClick = async (communeName) => {
// //     // Si la zone est déjà sélectionnée, charger ses données quand même
// //     const isAlreadySelected = selectedZone && selectedZone.includes(communeName)

// //     if (!isAlreadySelected) {
// //       // Ajouter la zone au tableau
// //       setSelectedZone(communeName)
// //     }

// //     // Charger les données de la zone (même si déjà sélectionnée)
// //     setIsLoading(true)
// //     setActiveZone(communeName)

// //     try {
// //       const response = await getZoneData(communeName)
// //       const data = response.data

// //       setZoneData(data)
// //       setPriorities(data.status)

// //       // Ouvrir le chat automatiquement après sélection
// //       if (onZoneSelect) {
// //         onZoneSelect()
// //       }

// //     } catch (error) {
// //       console.error('Error fetching zone data:', error)
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   return (
// //     <div className="h-full bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
// //       <div className="absolute top-0 left-0 right-0 z-[1000] px-3 md:px-6 py-3 md:py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
// //         <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Carte interactive</h2>
// //         <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">Port-au-Prince, Haïti</p>
// //       </div>

// //       <div className="h-full pt-16 md:pt-20 pb-2 md:pb-4 px-2 md:px-4">
// //         <MapContainer
// //           center={defaultCenter}
// //           zoom={defaultZoom}
// //           minZoom={minZoom}
// //           maxZoom={maxZoom}
// //           maxBounds={haitiBounds}
// //           maxBoundsViscosity={1.0} // Force le rebond aux limites
// //           style={{ height: '100%', width: '100%' }}
// //           className="rounded-lg shadow-lg z-0"
// //           scrollWheelZoom={true}
// //           touchZoom={true}
// //           dragging={true}
// //           tap={true}
// //           bounceAtZoomLimits={true} // Rebond aux limites de zoom
// //         >
// //           <TileLayer
// //             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// //             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
// //             updateWhenZooming={true}
// //             updateWhenIdle={true}
// //           />

// //           {portAuPrinceCommunes.map(commune => (
// //             <CommunePolygon 
// //               key={commune.id}
// //               commune={commune}
// //               isSelected={selectedZone && selectedZone.includes(commune.name)}
// //               isActive={activeZone === commune.name}
// //               onClick={handleCommuneClick}
// //               isMobile={isMobile}
// //             />
// //           ))}

// //           {portAuPrinceCommunes.map(commune => (
// //             <CommuneLabel 
// //               key={commune.id}
// //               commune={commune}
// //               isMobile={isMobile}
// //             />
// //           ))}

// //           <MapBoundsController selectedZone={selectedZone} activeZone={activeZone} isMobile={isMobile} />
// //           <ForceBounds />
// //         </MapContainer>
// //       </div>

// //       <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 z-[1000] pointer-events-none">
// //         <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 md:px-4 py-1.5 md:py-2 border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
// //           <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-300 text-center">
// //             {isMobile ? 'Touchez' : 'Cliquez sur'} une commune pour voir l'état des lieux
// //           </p>
// //           <p className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400 text-center mt-1">
// //             Zone limitée à Haïti
// //           </p>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // export default MapView

// import React, { useEffect, useState, memo, useCallback, useRef } from 'react'
// import { MapContainer, TileLayer, Polygon, Tooltip, Marker, useMap } from 'react-leaflet'
// import { useStore } from '../context/store'
// import { getZoneData } from '../api/api'
// import { portAuPrinceCommunes, communePolygons } from '../utils/communesData'
// import { haitiBounds, defaultCenter, minZoom, maxZoom, defaultZoom } from '../utils/mapBounds'
// import L from 'leaflet'

// // Fix pour les icônes Leaflet par défaut
// delete L.Icon.Default.prototype._getIconUrl
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
// })

// function useDebounce(callback, delay) {
//   const timeoutRef = useRef(null)

//   useEffect(() => {
//     return () => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current)
//       }
//     }
//   }, [])

//   return useCallback(
//     (...args) => {
//       if (timeoutRef.current) {
//         clearTimeout(timeoutRef.current)
//       }
//       timeoutRef.current = setTimeout(() => {
//         callback(...args)
//       }, delay)
//     },
//     [callback, delay]
//   )
// }

// function MapBoundsController({ selectedZone, activeZone, isMobile }) {
//   const map = useMap()

//   useEffect(() => {
//     // Définir les limites maximales
//     map.setMaxBounds(haitiBounds)
//     map.setMinZoom(minZoom)
//     map.setMaxZoom(maxZoom)

//     // Recentrer si on sort des limites
//     map.on('drag', () => {
//       const currentBounds = map.getBounds()
//       if (!currentBounds.intersects(haitiBounds)) {
//         map.fitBounds(haitiBounds)
//       }
//     })

//     // Gérer le zoom sur la zone active
//     const zoneToZoom = activeZone || (selectedZone && selectedZone.length > 0 ? selectedZone[selectedZone.length - 1] : null)
//     if (zoneToZoom) {
//       const commune = portAuPrinceCommunes.find(c => c.name === zoneToZoom)
//       if (commune) {
//         const zoomLevel = isMobile ? 12 : 13
//         map.flyTo(commune.center, zoomLevel, {
//           duration: 1,
//           maxZoom: maxZoom
//         })
//       }
//     } else {
//       map.flyTo(defaultCenter, defaultZoom, {
//         duration: 1,
//         maxZoom: maxZoom
//       })
//     }
//   }, [selectedZone, activeZone, map, isMobile])

//   return null
// }

// function ForceBounds() {
//   const map = useMap()

//   useEffect(() => {
//     const checkBounds = () => {
//       const currentCenter = map.getCenter()
//       const currentZoom = map.getZoom()

//       if (currentCenter.lat < haitiBounds[0][0] || currentCenter.lat > haitiBounds[1][0] ||
//           currentCenter.lng < haitiBounds[0][1] || currentCenter.lng > haitiBounds[1][1]) {
//         map.flyTo(defaultCenter, Math.max(currentZoom, minZoom), {
//           duration: 1
//         })
//       }

//       if (currentZoom < minZoom) {
//         map.setZoom(minZoom)
//       } else if (currentZoom > maxZoom) {
//         map.setZoom(maxZoom)
//       }
//     }

//     map.on('moveend', checkBounds)
//     map.on('zoomend', () => {
//       checkBounds()
//       setTimeout(() => {
//         map.invalidateSize()
//       }, 100)
//     })

//     const interval = setInterval(checkBounds, 1000)

//     return () => {
//       map.off('moveend', checkBounds)
//       map.off('zoomend', checkBounds)
//       clearInterval(interval)
//     }
//   }, [map])

//   return null
// }

// const CommunePolygon = memo(({ commune, isSelected, isActive, onClick, isMobile }) => {
//   // Positions du polygone
//   const positions = commune.polygon || communePolygons[commune.id] || [
//     [commune.bounds[0][0], commune.bounds[0][1]],
//     [commune.bounds[0][0], commune.bounds[1][1]],
//     [commune.bounds[1][0], commune.bounds[1][1]],
//     [commune.bounds[1][0], commune.bounds[0][1]],
//     [commune.bounds[0][0], commune.bounds[0][1]]
//   ]

//   // Styles dynamiques
//   const getPolygonStyle = useCallback(() => {
//     return {
//       fillColor: commune.color,
//       color: isActive ? '#ffffff' : (isSelected ? '#ffffff' : commune.color),
//       weight: isActive ? 4 : (isSelected ? 3 : 2),
//       opacity: isActive ? 1.0 : (isSelected ? 0.9 : 0.7),
//       fillOpacity: isActive ? 0.4 : (isSelected ? 0.3 : 0.15),
//       dashArray: isActive ? '0' : (isSelected ? '0' : '5,5'),
//       lineCap: 'round',
//       lineJoin: 'round'
//     }
//   }, [commune.color, isActive, isSelected])

//   const handleClick = useCallback(() => {
//     onClick(commune.name)
//   }, [commune.name, onClick])

//   const handleMouseOver = useCallback((e) => {
//     if (!isMobile) {
//       const layer = e.target
//       layer.setStyle({
//         weight: 3,
//         opacity: 0.9,
//         fillOpacity: 0.25,
//         dashArray: '0'
//       })
//     }
//   }, [isMobile])

//   const handleMouseOut = useCallback((e) => {
//     if (!isMobile) {
//       const layer = e.target
//       layer.setStyle(getPolygonStyle())
//     }
//   }, [isMobile, getPolygonStyle])

//   return (
//     <Polygon
//       positions={positions}
//       pathOptions={getPolygonStyle()}
//       eventHandlers={{
//         click: handleClick,
//         mouseover: handleMouseOver,
//         mouseout: handleMouseOut
//       }}
//       className={`commune-polygon commune-${commune.id} ${isActive ? 'selected-commune' : ''} ${isSelected ? 'selected-commune' : ''}`}
//     >
//       <Tooltip 
//         permanent={false} 
//         direction="center" 
//         className="commune-tooltip"
//         opacity={1}
//       >
//         <div className="text-center min-w-[120px]">
//           <strong className="text-xs md:text-sm">{commune.name}</strong>
//           <br />
//           <span className="text-[10px] md:text-xs text-gray-600">
//             {commune.population.toLocaleString()} hab.
//           </span>
//         </div>
//       </Tooltip>
//     </Polygon>
//   )
// }, (prevProps, nextProps) => {
//   return (
//     prevProps.isSelected === nextProps.isSelected &&
//     prevProps.isActive === nextProps.isActive &&
//     prevProps.commune.id === nextProps.commune.id &&
//     prevProps.isMobile === nextProps.isMobile
//   )
// })

// CommunePolygon.displayName = 'CommunePolygon'

// const CommuneLabel = memo(({ commune, isMobile }) => {
//   const customIcon = new L.DivIcon({
//     html: `
//       <div class="commune-label bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-300 shadow-lg">
//         <span class="font-bold ${isMobile ? 'text-xs' : 'text-sm'} text-gray-800 whitespace-nowrap">${commune.name}</span>
//       </div>
//     `,
//     className: 'commune-label-container',
//     iconSize: isMobile ? [80, 30] : [100, 40],
//     iconAnchor: isMobile ? [40, 15] : [50, 20]
//   })

//   return (
//     <Marker 
//       position={commune.center} 
//       // icon={customIcon}
//       //Add a color on Marker

//       interactive={false}
//     />
//   )
// }, (prevProps, nextProps) => {
//   return (
//     prevProps.commune.id === nextProps.commune.id &&
//     prevProps.isMobile === nextProps.isMobile
//   )
// })

// CommuneLabel.displayName = 'CommuneLabel'

// const MapView = ({ onZoneSelect }) => {
//   const { 
//     selectedZone, 
//     setSelectedZone, 
//     setZoneData, 
//     setPriorities, 
//     setIsLoading, 
//     activeZone, 
//     setActiveZone 
//   } = useStore()

//   const [isMobile, setIsMobile] = useState(false)

//   // Détection mobile
//   useEffect(() => {
//     const checkMobile = () => {
//       setIsMobile(window.innerWidth < 768)
//     }

//     checkMobile()
//     window.addEventListener('resize', checkMobile)

//     return () => window.removeEventListener('resize', checkMobile)
//   }, [])

//   // Gestion du clic sur une commune
//   const handleCommuneClickInternal = useCallback(async (communeName) => {
//     const isAlreadySelected = selectedZone && selectedZone.includes(communeName)

//     if (!isAlreadySelected) {
//       setSelectedZone(communeName)
//     }

//     setIsLoading(true)
//     setActiveZone(communeName)

//     try {
//       const response = await getZoneData(communeName)
//       const data = response.data

//       setZoneData(data)
//       setPriorities(data.status)

//       if (onZoneSelect) {
//         onZoneSelect()
//       }

//     } catch (error) {
//       console.error('Error fetching zone data:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }, [selectedZone, setSelectedZone, setIsLoading, setActiveZone, setZoneData, setPriorities, onZoneSelect])

//   // Appliquer le debounce (300ms)
//   const handleCommuneClick = useDebounce(handleCommuneClickInternal, 300)

//   return (
//     <div className="h-full bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
//       {/* Header */}
//       <div className="absolute top-0 left-0 right-0 z-[1000] px-3 md:px-6 py-3 md:py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
//         <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
//           Carte interactive
//         </h2>
//         <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 md:mt-1">
//           Port-au-Prince, Haïti
//         </p>
//       </div>

//       {/* Carte */}
//       <div className="h-full pt-16 md:pt-20 pb-2 md:pb-4 px-2 md:px-4">
//         <MapContainer
//           center={defaultCenter}
//           zoom={defaultZoom}
//           minZoom={minZoom}
//           maxZoom={maxZoom}
//           maxBounds={haitiBounds}
//           maxBoundsViscosity={1.0}
//           style={{ height: '100%', width: '100%' }}
//           className="rounded-lg shadow-lg z-0"
//           scrollWheelZoom={true}
//           touchZoom={true}
//           dragging={true}
//           tap={true}
//           bounceAtZoomLimits={true}
//         >
//           <TileLayer
//             attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
//             url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//             updateWhenZooming={true}
//             updateWhenIdle={true}
//           />

//           {/* Polygones */}
//           {portAuPrinceCommunes.map(commune => (
//             <CommunePolygon 
//               key={commune.id}
//               commune={commune}
//               isSelected={selectedZone && selectedZone.includes(commune.name)}
//               isActive={activeZone === commune.name}
//               onClick={handleCommuneClick}
//               isMobile={isMobile}
//             />
//           ))}

//           {/* Labels */}
//           {portAuPrinceCommunes.map(commune => (
//             <CommuneLabel 
//               key={`label-${commune.id}`}
//               commune={commune}
//               isMobile={isMobile}
//             />
//           ))}

//           <MapBoundsController 
//             selectedZone={selectedZone} 
//             activeZone={activeZone} 
//             isMobile={isMobile} 
//           />
//           <ForceBounds />
//         </MapContainer>
//       </div>

//       {/* Instructions */}
//       <div className="absolute bottom-2 md:bottom-4 left-2 md:left-4 right-2 md:right-4 z-[1000] pointer-events-none">
//         <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg px-3 md:px-4 py-1.5 md:py-2 border border-gray-200 dark:border-gray-700 max-w-md mx-auto">
//           <p className="text-[10px] md:text-xs text-gray-600 dark:text-gray-300 text-center">
//             {isMobile ? 'Touchez' : 'Cliquez sur'} une commune pour voir l'état des lieux
//           </p>
//           <p className="text-[9px] md:text-[10px] text-gray-500 dark:text-gray-400 text-center mt-1">
//             Zone limitée à Haïti
//           </p>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default MapView
import React, { useEffect, useState, memo, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, Polygon, Tooltip, Marker, useMap } from 'react-leaflet'
import { useStore } from '../context/store'
import { getZoneData } from '../api/api'
import { portAuPrinceCommunes, communePolygons } from '../utils/communesData'
import { haitiBounds, defaultCenter, minZoom, maxZoom, defaultZoom } from '../utils/mapBounds'
import L from 'leaflet'

// Fix pour les icônes Leaflet par défaut
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function MapBoundsController({ selectedZone, activeZone, isMobile }) {
  const map = useMap()

  useEffect(() => {
    map.setMaxBounds(haitiBounds)
    map.setMinZoom(minZoom)
    map.setMaxZoom(maxZoom)

    map.on('drag', () => {
      const currentBounds = map.getBounds()
      if (!currentBounds.intersects(haitiBounds)) {
        map.fitBounds(haitiBounds)
      }
    })

    const zoneToZoom = activeZone || (selectedZone && selectedZone.length > 0 ? selectedZone[selectedZone.length - 1] : null)
    if (zoneToZoom) {
      const commune = portAuPrinceCommunes.find(c => c.name === zoneToZoom)
      if (commune) {
        const zoomLevel = isMobile ? 12 : 13
        map.flyTo(commune.center, zoomLevel, {
          duration: 1,
          maxZoom: maxZoom
        })
      }
    } else {
      map.flyTo(defaultCenter, defaultZoom, {
        duration: 1,
        maxZoom: maxZoom
      })
    }
  }, [selectedZone, activeZone, map, isMobile])

  return null
}

function ForceBounds() {
  const map = useMap()

  useEffect(() => {
    const checkBounds = () => {
      const currentCenter = map.getCenter()
      const currentZoom = map.getZoom()

      if (currentCenter.lat < haitiBounds[0][0] || currentCenter.lat > haitiBounds[1][0] ||
        currentCenter.lng < haitiBounds[0][1] || currentCenter.lng > haitiBounds[1][1]) {
        map.flyTo(defaultCenter, Math.max(currentZoom, minZoom), {
          duration: 1
        })
      }

      if (currentZoom < minZoom) {
        map.setZoom(minZoom)
      } else if (currentZoom > maxZoom) {
        map.setZoom(maxZoom)
      }
    }

    map.on('moveend', checkBounds)
    map.on('zoomend', () => {
      checkBounds()
      setTimeout(() => {
        map.invalidateSize()
      }, 100)
    })

    const interval = setInterval(checkBounds, 1000)

    return () => {
      map.off('moveend', checkBounds)
      map.off('zoomend', checkBounds)
      clearInterval(interval)
    }
  }, [map])

  return null
}

const CommunePolygon = memo(({ commune, isSelected, isActive, onClick, isMobile }) => {
  const positions = commune.polygon || communePolygons[commune.id] || [
    [commune.bounds[0][0], commune.bounds[0][1]],
    [commune.bounds[0][0], commune.bounds[1][1]],
    [commune.bounds[1][0], commune.bounds[1][1]],
    [commune.bounds[1][0], commune.bounds[0][1]],
    [commune.bounds[0][0], commune.bounds[0][1]]
  ]

  const getPolygonStyle = useCallback(() => {
    if (isActive) {
      return {
        fillColor: '#00ff00',
        color: '#00ff00',
        weight: 4,
        opacity: 1.0,
        fillOpacity: 0.35,
        dashArray: '0',
        lineCap: 'round',
        lineJoin: 'round'
      }
    }
    
    if (isSelected) {
      return {
        fillColor: commune.color,
        color: '#00ffff',
        weight: 3,
        opacity: 0.95,
        fillOpacity: 0.28,
        dashArray: '0',
        lineCap: 'round',
        lineJoin: 'round'
      }
    }

    return {
      fillColor: commune.color,
      color: commune.color,
      weight: 2,
      opacity: 0.75,
      fillOpacity: 0.18,
      dashArray: '0',
      lineCap: 'round',
      lineJoin: 'round'
    }
  }, [commune.color, isActive, isSelected])

  const handleClick = useCallback(() => {
    onClick(commune.name)
  }, [commune.name, onClick])

  const handleMouseOver = useCallback((e) => {
    if (!isMobile) {
      const layer = e.target
      layer.setStyle({
        weight: 4,
        opacity: 1.0,
        fillOpacity: 0.4,
        color: '#00ffff',
        dashArray: '0'
      })
    }
  }, [isMobile])

  const handleMouseOut = useCallback((e) => {
    if (!isMobile) {
      const layer = e.target
      layer.setStyle(getPolygonStyle())
    }
  }, [isMobile, getPolygonStyle])

  return (
    <Polygon
      positions={positions}
      pathOptions={getPolygonStyle()}
      eventHandlers={{
        click: handleClick,
        mouseover: handleMouseOver,
        mouseout: handleMouseOut
      }}
      className={`commune-polygon commune-${commune.id} ${isActive ? 'selected-commune' : ''} ${isSelected ? 'selected-commune' : ''}`}
    >
      <Tooltip
        permanent={false}
        direction="center"
        className="commune-tooltip"
        opacity={1}
      >
        <div className="text-center min-w-[120px] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-cyan-500/50 rounded-lg p-2 shadow-lg">
          <strong className="text-xs md:text-sm text-cyan-400 font-mono uppercase tracking-wide">{commune.name}</strong>
          <br />
          <span className="text-[10px] md:text-xs text-emerald-400/80 font-mono">
            {commune.population.toLocaleString()} hab.
          </span>
        </div>
      </Tooltip>
    </Polygon>
  )
}, (prevProps, nextProps) => {
  return (
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isActive === nextProps.isActive &&
    prevProps.commune.id === nextProps.commune.id &&
    prevProps.isMobile === nextProps.isMobile
  )
})

CommunePolygon.displayName = 'CommunePolygon'

const CommuneLabel = memo(({ commune, isMobile }) => {
  return (
    <Marker
      position={commune.center}
      interactive={false}
    />
  )
}, (prevProps, nextProps) => {
  return (
    prevProps.commune.id === nextProps.commune.id &&
    prevProps.isMobile === nextProps.isMobile
  )
})

CommuneLabel.displayName = 'CommuneLabel'

const MapView = ({ onZoneSelect }) => {
  const {
    selectedZone,
    setSelectedZone,
    setZoneData,
    setPriorities,
    setIsLoading,
    activeZone,
    setActiveZone
  } = useStore()

  const [isMobile, setIsMobile] = useState(false)
  const isLoadingRef = useRef(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleCommuneClick = useCallback(async (communeName) => {
    // Empêcher les appels multiples simultanés
    if (isLoadingRef.current) {
      console.log('🚫 Appel ignoré - chargement en cours')
      return
    }

    console.log('🎯 Clic sur zone:', communeName)

    const isAlreadySelected = selectedZone && selectedZone.includes(communeName)

    if (!isAlreadySelected) {
      setSelectedZone(communeName)
    }

    // Définir la zone active et charger les données
    isLoadingRef.current = true
    setIsLoading(true)
    setActiveZone(communeName)

    try {
      console.log('📡 Appel API pour:', communeName)
      const response = await getZoneData(communeName)
      const data = response.data

      setZoneData(data)
      setPriorities(data.status)

    } catch (error) {
      console.error('Error fetching zone data:', error)
    } finally {
      setIsLoading(false)
      isLoadingRef.current = false
    }

    // Ouvrir le chat après avoir défini la zone active
    if (onZoneSelect) {
      onZoneSelect()
    }
  }, [selectedZone, setSelectedZone, setIsLoading, setActiveZone, setZoneData, setPriorities, onZoneSelect])

  return (
    <div className="h-full relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
    }}>
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20 animate-pulse" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px'
      }} />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      {/* Header with glassmorphism */}
      <div className="absolute top-0 left-0 right-0 z-[1000] px-3 md:px-6 py-3 md:py-4 backdrop-blur-xl bg-gradient-to-r from-slate-900/80 via-cyan-900/50 to-slate-900/80 border-b border-cyan-500/30 shadow-lg shadow-cyan-500/20">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50" />
              <h2 className="text-base md:text-lg font-bold bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-wider font-mono">
                Carte Interactive
              </h2>
            </div>
            <p className="text-xs md:text-sm text-cyan-300/70 mt-0.5 md:mt-1 font-mono uppercase tracking-wide">
              Système Online • Port-au-Prince, HT
            </p>
          </div>
          
          {/* Status indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-sm">
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">Active</span>
          </div>
        </div>
      </div>

      {/* Map Container with enhanced styling */}
      <div className="h-full pt-16 md:pt-20 pb-2 md:pb-4 px-2 md:px-4 relative">
        <div className="h-full rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/30 relative">
          {/* Inner glow effect */}
          <div className="absolute inset-0 rounded-2xl shadow-inner shadow-cyan-500/20 pointer-events-none z-10" />
          
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            minZoom={minZoom}
            maxZoom={maxZoom}
            maxBounds={haitiBounds}
            maxBoundsViscosity={1.0}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
            scrollWheelZoom={true}
            touchZoom={true}
            dragging={true}
            tap={true}
            bounceAtZoomLimits={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              updateWhenZooming={true}
              updateWhenIdle={true}
            />

            {portAuPrinceCommunes.map(commune => (
              <CommunePolygon
                key={commune.id}
                commune={commune}
                isSelected={selectedZone && selectedZone.includes(commune.name)}
                isActive={activeZone === commune.name}
                onClick={handleCommuneClick}
                isMobile={isMobile}
              />
            ))}

            {portAuPrinceCommunes.map(commune => (
              <CommuneLabel
                key={`label-${commune.id}`}
                commune={commune}
                isMobile={isMobile}
              />
            ))}

            <MapBoundsController
              selectedZone={selectedZone}
              activeZone={activeZone}
              isMobile={isMobile}
            />
            <ForceBounds />
          </MapContainer>
        </div>
      </div>

      {/* Enhanced CTA Button */}
      {/* Afficher le message uniquement si aucune zone n'est sélectionnée et le rendre plus petit */}
      {(!selectedZone || selectedZone.length === 0) && (
        <div className="absolute bottom-8 md:bottom-10 left-0 right-0 z-[1000] flex justify-center pointer-events-none">
          <div className="relative group pointer-events-auto">
            {/* Button compact */}
            <button className="relative mx-4 glass border border-neon-green/40 rounded-lg px-3 md:px-4 py-2 md:py-2.5 shadow-neon-green hover:border-neon-green/60 transition-all duration-300">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-neon-green/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
                <p className="text-xs md:text-sm text-neon-green/80 font-mono uppercase tracking-wider whitespace-nowrap">
                  Cliquez sur une zone
                </p>
              </div>
          </button>
        </div>
        </div>
      )}
    </div>
  )
}
export default MapView
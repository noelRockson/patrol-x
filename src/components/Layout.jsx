import React, { useState, useEffect } from 'react'
import SidebarPriority from './SidebarPriority'
import MapView from './MapView'
import Chat from './Chat'
import Logo from './Logo'

const Layout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isPrioritiesOpen, setIsPrioritiesOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Détection de la taille d'écran
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fermer les panneaux lors du changement de vue mobile/desktop
  useEffect(() => {
    if (!isMobile) {
      setIsPrioritiesOpen(false)
    }
  }, [isMobile])

  return (
    <div className="h-screen flex flex-col relative">
      {/* Header avec logo */}
      <div className="h-14 md:h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <Logo width={isMobile ? 28 : 32} height={isMobile ? 28 : 32} />
          <h1 className="text-lg md:text-xl font-bold text-gray-900">Patrol-X</h1>
        </div>

        {/* Menu burger pour mobile */}
        {isMobile && (
          <button
            onClick={() => setIsPrioritiesOpen(!isPrioritiesOpen)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Contenu principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop: Colonne gauche - Priorités (toujours visible) */}
        {!isMobile && (
          <div className="w-1/3 lg:w-1/4 border-r border-gray-200">
            <SidebarPriority />
          </div>
        )}

        {/* Mobile: Panneau Priorités en overlay */}
        {isMobile && isPrioritiesOpen && (
          <div className="absolute inset-0 z-[2000] bg-black/50" onClick={() => setIsPrioritiesOpen(false)}>
            <div 
              className="absolute left-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Priorités</h2>
                <button
                  onClick={() => setIsPrioritiesOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto" style={{ height: 'calc(100% - 60px)' }}>
                <SidebarPriority />
              </div>
            </div>
          </div>
        )}

        {/* Carte (prend tout l'espace disponible) */}
        <div className="flex-1 relative">
          <MapView />
          
          {/* Bouton flottant pour ouvrir le chat */}
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="fixed md:absolute bottom-4 md:bottom-6 right-4 md:right-6 z-[1001] bg-blue-600 hover:bg-blue-700 text-white p-3 md:p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
              aria-label="Ouvrir le chat"
            >
              <svg
                className="w-5 h-5 md:w-6 md:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Panneau de chat en overlay */}
      {isChatOpen && (
        <>
          {/* Overlay sombre pour mobile */}
          {isMobile && (
            <div 
              className="fixed inset-0 bg-black/50 z-[1999]"
              onClick={() => setIsChatOpen(false)}
            />
          )}
          
          {/* Panneau chat */}
          <div className={`
            fixed z-[2000] bg-white shadow-2xl flex flex-col
            ${isMobile 
              ? 'inset-x-0 bottom-0 rounded-t-2xl' 
              : 'top-14 md:top-16 bottom-0 right-0 w-full md:w-1/2 lg:w-1/3 border-l border-gray-200'
            }
          `}
          style={isMobile ? { height: '85vh' } : {}}
          >
            <Chat onClose={() => setIsChatOpen(false)} />
          </div>
        </>
      )}
    </div>
  )
}
export default Layout
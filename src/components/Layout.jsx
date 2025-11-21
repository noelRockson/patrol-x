import React, { useState, useEffect } from 'react'
import { useStore } from '../context/store'
import SidebarPriority from './SidebarPriority'
import MapView from './MapView'
import Chat from './Chat'
import Logo from './Logo'

const Layout = () => {
  const { selectedZone } = useStore()
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      // Sur mobile, masquer la sidebar par défaut
      if (mobile) {
        setShowSidebar(false)
      } else {
        setShowSidebar(true)
      }
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Ouvrir automatiquement le chat quand une zone est sélectionnée
  useEffect(() => {
    if (selectedZone) {
      setIsChatOpen(true)
      // Sur mobile, fermer la sidebar pour voir le chat
      if (isMobile) {
        setShowSidebar(false)
      }
    }
  }, [selectedZone, isMobile])

  return (
    <div className="h-screen flex flex-col relative">
      {/* Header avec logo */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Logo width={32} height={32} />
          <h1 className="text-xl font-bold text-gray-900">Patrol-X</h1>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Colonne gauche - Priorités (desktop) ou overlay (mobile) */}
        {isMobile ? (
          <>
            {/* Bouton pour ouvrir la sidebar sur mobile */}
            {!showSidebar && selectedZone && (
              <button
                onClick={() => setShowSidebar(true)}
                className="absolute top-4 left-4 z-[1001] bg-white hover:bg-gray-50 text-gray-700 p-2 rounded-lg shadow-lg border border-gray-200 transition-all"
                aria-label="Afficher les priorités"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </button>
            )}
            
            {/* Sidebar en overlay sur mobile */}
            {showSidebar && (
              <>
                <div
                  className="absolute inset-0 bg-black/50 z-[2500]"
                  onClick={() => setShowSidebar(false)}
                />
                <div className="absolute top-16 bottom-0 left-0 w-80 bg-white border-r border-gray-200 shadow-2xl z-[3000] flex flex-col">
                  <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-gray-900">Priorités</h2>
                    <button
                      onClick={() => setShowSidebar(false)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                      aria-label="Fermer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <SidebarPriority />
                  </div>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-1/3 border-r border-gray-200 shrink-0">
            <SidebarPriority />
          </div>
        )}

        {/* Colonne droite - Carte */}
        <div className={`flex-1 relative ${isMobile && showSidebar ? 'hidden' : ''}`}>
          <MapView />
          
          {/* Bouton flottant pour ouvrir le chat */}
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="absolute bottom-6 right-6 z-[1001] bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300"
              aria-label="Ouvrir le chat"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
        <div
          className={`absolute top-16 bottom-0 right-0 bg-white border-l border-gray-200 shadow-2xl z-[2000] flex flex-col ${
            isMobile ? 'w-full' : 'w-1/3'
          }`}
        >
          <Chat 
            onClose={() => setIsChatOpen(false)}
            onShowPriorities={() => setShowSidebar(true)}
          />
        </div>
      )}

      {/* Bouton pour ouvrir la sidebar sur mobile (visible même avec le chat ouvert) */}
      {isMobile && selectedZone && !showSidebar && (
        <button
          onClick={() => setShowSidebar(true)}
          className="absolute top-20 left-4 z-[2001] bg-white hover:bg-gray-50 text-gray-700 p-2.5 rounded-lg shadow-lg border border-gray-200 transition-all"
          aria-label="Afficher les priorités"
        >
          <div className="flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span className="text-xs font-medium">Priorités</span>
          </div>
        </button>
      )}
    </div>
  )
}

export default Layout


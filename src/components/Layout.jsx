import React, { useState, useEffect } from 'react'
import SidebarPriority from './SidebarPriority'
import MapView from './MapView'
import Chat from './Chat'
import Logo from './Logo'

const Layout = () => {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isPrioritiesOpen, setIsPrioritiesOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Initialiser le mode dark depuis localStorage ou préférence système
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window === 'undefined') return false
    
    // Lire depuis localStorage
    const saved = localStorage.getItem('darkMode')
    if (saved !== null) {
      const isDark = saved === 'true'
      // Appliquer immédiatement
      if (isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return isDark
    }
    
    // Sinon, utiliser la préférence système
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    if (prefersDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    return prefersDark
  })

  // Appliquer le thème quand il change
  useEffect(() => {
    const root = document.documentElement
    
    if (isDarkMode) {
      root.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, [isDarkMode])
  
  // Fonction pour toggle le mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev)
  }

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
    <div className="h-screen flex flex-col relative bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {/* Header avec logo */}
      <div className="h-14 md:h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm">
        <div className="flex items-center gap-2 md:gap-3">
          <Logo width={isMobile ? 28 : 32} height={isMobile ? 28 : 32} />
          <h1 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white">Patrol-X</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Bouton toggle dark/light */}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label={isDarkMode ? 'Activer le mode clair' : 'Activer le mode sombre'}
          >
            {isDarkMode ? (
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
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
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
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>

          {/* Menu burger pour mobile */}
          {isMobile && (
            <button
              onClick={() => setIsPrioritiesOpen(!isPrioritiesOpen)}
              className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
      </div>

      {/* Contenu principal */}
      <div className="flex flex-1 overflow-hidden">
        {/* Desktop: Colonne gauche - Priorités (toujours visible) */}
        {!isMobile && (
          <div className="w-1/3 lg:w-1/4 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <SidebarPriority />
          </div>
        )}

        {/* Mobile: Panneau Priorités en overlay/drawer */}
        {isMobile && isPrioritiesOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-[2000] transition-opacity"
              onClick={() => setIsPrioritiesOpen(false)}
            />
            
            {/* Drawer */}
            <div 
              className="fixed left-0 top-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-gray-800 shadow-2xl z-[2001] transform transition-transform"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header du drawer */}
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Priorités</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">État des lieux</p>
                </div>
                <button
                  onClick={() => setIsPrioritiesOpen(false)}
                  className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Fermer"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Contenu du drawer */}
              <div className="overflow-y-auto" style={{ height: 'calc(100% - 73px)' }}>
                <SidebarPriority isMobile={true} />
              </div>
            </div>
          </>
        )}

        {/* Carte (prend tout l'espace disponible) */}
        <div className="flex-1 relative">
          <MapView onZoneSelect={() => setIsChatOpen(true)} />
          
          {/* Bouton flottant pour ouvrir le chat */}
          {!isChatOpen && (
            <button
              onClick={() => setIsChatOpen(true)}
              className="fixed md:absolute bottom-6 md:bottom-6 right-6 md:right-6 z-[1001] bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white p-4 md:p-4 rounded-full shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-300"
              aria-label="Ouvrir le chat"
            >
              <svg
                className="w-6 h-6 md:w-6 md:h-6"
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
          <div 
            className={`
              fixed z-[2000] bg-white dark:bg-gray-800 shadow-2xl flex flex-col
              ${isMobile 
                ? 'inset-x-0 bottom-0 rounded-t-3xl' 
                : 'top-14 md:top-16 bottom-0 right-0 w-full md:w-1/2 lg:w-1/3 border-l border-gray-200 dark:border-gray-700'
              }
            `}
            style={isMobile ? { height: '90vh', maxHeight: '90vh' } : {}}
          >
            {/* Poignée de glissement mobile */}
            {isMobile && (
              <div className="flex justify-center py-2 bg-white dark:bg-gray-800 rounded-t-3xl">
                <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>
            )}
            
            <Chat onClose={() => setIsChatOpen(false)} isMobile={isMobile} />
          </div>
        </>
      )}
    </div>
  )
}

export default Layout
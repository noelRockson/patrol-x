import React from 'react'
import SidebarPriority from './SidebarPriority'
import MapView from './MapView'
import Chat from './Chat'
import Logo from './Logo'

const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      {/* Header avec logo */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shrink-0">
        <div className="flex items-center gap-3">
          <Logo width={32} height={32} />
          <h1 className="text-xl font-bold text-gray-900">Patrol-X</h1>
        </div>
      </div>

      {/* Contenu principal en 3 colonnes */}
      <div className="flex flex-1 overflow-hidden">
        {/* Colonne gauche - Priorités */}
        <div className="w-1/3 border-r border-gray-200">
          <SidebarPriority />
        </div>

        {/* Colonne centrale - Carte */}
        <div className="w-1/3 border-r border-gray-200">
          <MapView />
        </div>

        {/* Colonne droite - Chat */}
        <div className="w-1/3">
          <Chat />
        </div>
      </div>
    </div>
  )
}

export default Layout


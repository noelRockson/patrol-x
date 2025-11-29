import React, { useState, useRef, useEffect } from 'react'
import { useStore } from '../context/store'

const NotificationButton = () => {
  const isAuthenticated = useStore((state) => state.isAuthenticated)
  const [isOpen, setIsOpen] = useState(false)
  const [notifications] = useState([
    { id: 1, message: 'Nouvelle alerte dans la zone 1', time: 'Il y a 5 min', read: false },
    { id: 2, message: 'Mise à jour des priorités', time: 'Il y a 15 min', read: false },
    { id: 3, message: 'Système opérationnel', time: 'Il y a 1h', read: true },
  ])
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="relative z-[4001]" ref={dropdownRef}>
      {/* Notification Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-neon-green/70 hover:text-neon-green hover:bg-neon-green/10 border border-transparent hover:border-neon-green/30 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-green/50 hover:shadow-neon-green"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full border-2 border-black animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-black border-2 border-neon-green/30 rounded-lg shadow-neon-green-lg z-[4002] animate-scaleIn overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-neon-green/20 bg-black/50 flex items-center justify-between">
            <h3 className="text-neon-green font-bold font-mono uppercase tracking-wider text-sm">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="px-2 py-1 bg-neon-green/20 text-neon-green text-xs font-bold rounded">
                {unreadCount} non lues
              </span>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-neon-green/60 text-sm">
                Aucune notification
              </div>
            ) : (
              <div className="divide-y divide-neon-green/10">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-neon-green/5 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-neon-green/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                        !notification.read ? 'bg-neon-green animate-pulse' : 'bg-neon-green/30'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${
                          !notification.read ? 'text-neon-green font-semibold' : 'text-neon-green/70'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-neon-green/50 mt-1 font-mono">
                          {notification.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-neon-green/20 bg-black/50">
            <button className="w-full text-center text-neon-green/70 hover:text-neon-green text-xs font-mono uppercase transition-colors">
              Voir toutes les notifications
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationButton


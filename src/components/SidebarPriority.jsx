import React from 'react'
import { useStore } from '../context/store'

const SidebarPriority = () => {
  const { selectedZone, priorities } = useStore()
  const isDisabled = !selectedZone

  const categories = [
    {
      emoji: '🔥',
      label: 'Urgent',
      count: priorities.urgent,
      color: 'text-red-600',
    },
    {
      emoji: '📌',
      label: 'Pertinent',
      count: priorities.pertinent,
      color: 'text-blue-600',
    },
    {
      emoji: '💤',
      label: 'Ignoré',
      count: priorities.ignored,
      color: 'text-gray-600',
    },
  ]

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="hidden md:block px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 shrink-0">
        <h2 className="text-base md:text-lg font-semibold text-gray-900">Priorités</h2>
      </div>

      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
        {isDisabled ? (
          <div className="text-center text-gray-400 py-8 md:py-12">
            <p className="text-xs md:text-sm">
              Sélectionnez une zone sur la carte pour afficher les priorités.
            </p>
          </div>
        ) : (
          <div className="space-y-4 md:space-y-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`p-3 md:p-4 rounded-lg border-2 border-gray-200 transition-all ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:border-gray-300 cursor-pointer active:scale-95'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <span className="text-xl md:text-2xl">{category.emoji}</span>
                    <span className="font-medium text-sm md:text-base text-gray-900">
                      {category.label}
                    </span>
                  </div>
                  <span className={`text-lg md:text-xl font-bold ${category.color} ${isDisabled ? 'opacity-50' : ''}`}>
                    {category.count}
                  </span>
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
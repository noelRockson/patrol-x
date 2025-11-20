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
    <div className="h-full bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Priorités</h2>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        {isDisabled ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-sm">
              Sélectionnez une zone sur la carte pour afficher les priorités.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 border-gray-200 transition-all ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:border-gray-300 cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.emoji}</span>
                    <span className="font-medium text-gray-900">
                      {category.label}
                    </span>
                  </div>
                  <span
                    className={`text-xl font-bold ${category.color} ${
                      isDisabled ? 'opacity-50' : ''
                    }`}
                  >
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


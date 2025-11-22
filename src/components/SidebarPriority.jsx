// import React from 'react'
// import { useStore } from '../context/store'

// const SidebarPriority = () => {
//   const { selectedZone, priorities } = useStore()
//   const isDisabled = !selectedZone

//   const categories = [
//     {
//       emoji: '🔥',
//       label: 'Urgent',
//       count: priorities.urgent,
//       color: 'text-red-600',
//     },
//     {
//       emoji: '📌',
//       label: 'Pertinent',
//       count: priorities.pertinent,
//       color: 'text-blue-600',
//     },
//     {
//       emoji: '💤',
//       label: 'Ignoré',
//       count: priorities.ignored,
//       color: 'text-gray-600',
//     },
//   ]

//   return (
//     <div className="h-full bg-white flex flex-col">
//       <div className="hidden md:block px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 shrink-0">
//         <h2 className="text-base md:text-lg font-semibold text-gray-900">Priorités</h2>
//       </div>

//       <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
//         {isDisabled ? (
//           <div className="text-center text-gray-400 py-8 md:py-12">
//             <p className="text-xs md:text-sm">
//               Sélectionnez une zone sur la carte pour afficher les priorités.
//             </p>
//           </div>
//         ) : (
//           <div className="space-y-4 md:space-y-6">
//             {categories.map((category, index) => (
//               <div
//                 key={index}
//                 className={`p-3 md:p-4 rounded-lg border-2 border-gray-200 transition-all ${
//                   isDisabled
//                     ? 'opacity-50 cursor-not-allowed'
//                     : 'hover:border-gray-300 cursor-pointer active:scale-95'
//                 }`}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2 md:gap-3">
//                     <span className="text-xl md:text-2xl">{category.emoji}</span>
//                     <span className="font-medium text-sm md:text-base text-gray-900">
//                       {category.label}
//                     </span>
//                   </div>
//                   <span className={`text-lg md:text-xl font-bold ${category.color} ${isDisabled ? 'opacity-50' : ''}`}>
//                     {category.count}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default SidebarPriority

import React from 'react'
import { useStore } from '../context/store'

const SidebarPriority = ({ isMobile = false }) => {
  const { selectedZone, priorities } = useStore()
  const isDisabled = !selectedZone

  const categories = [
    {
      emoji: '🔥',
      label: 'Urgent',
      count: priorities.urgent,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
    {
      emoji: '📌',
      label: 'Pertinent',
      count: priorities.pertinent,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      emoji: '💤',
      label: 'Ignoré',
      count: priorities.ignored,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
    },
  ]

  return (
    <div className="h-full bg-white dark:bg-gray-800 flex flex-col">
      {/* Header - visible seulement sur desktop */}
      {!isMobile && (
        <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Priorités</h2>
          {selectedZone && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Zone : {selectedZone}</p>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6">
        {isDisabled ? (
          <div className="text-center text-gray-400 dark:text-gray-500 py-12">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Aucune zone sélectionnée
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Sélectionnez une zone sur la carte pour afficher les priorités
            </p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isDisabled
                    ? 'opacity-50 cursor-not-allowed'
                    : `${category.bgColor} dark:bg-gray-700/50 ${category.borderColor} dark:border-gray-600 hover:shadow-md dark:hover:shadow-gray-900/50 cursor-pointer active:scale-[0.98]`
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{category.emoji}</div>
                    <div>
                      <div className="font-semibold text-sm md:text-base text-gray-900 dark:text-white">
                        {category.label}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {category.count === 0 && 'Aucun incident'}
                        {category.count === 1 && '1 incident'}
                        {category.count > 1 && `${category.count} incidents`}
                      </div>
                    </div>
                  </div>
                  <div className={`text-2xl md:text-3xl font-bold ${category.color}`}>
                    {category.count}
                  </div>
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
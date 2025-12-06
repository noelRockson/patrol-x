import React from 'react'
import { AlertTriangle } from 'lucide-react'

const PrototypeBanner = () => {
  return (
    <div className="fixed top-0 left-0 right-0 z-[5000] bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 dark:from-amber-600 dark:via-orange-600 dark:to-amber-600 text-white shadow-lg">
      <div className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold uppercase tracking-wider">
        <AlertTriangle className="w-4 h-4 animate-pulse" />
        <span>Prototype - Version demo </span>
        <AlertTriangle className="w-4 h-4 animate-pulse" />
      </div>
    </div>
  )
}

export default PrototypeBanner


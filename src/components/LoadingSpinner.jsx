import React from 'react'
  
export const LoadingSpinner = ({ size = 'md', message = 'Chargement...' }) => {
const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
}

return (
    <div className="flex flex-col items-center justify-center p-8">
    <div className={`animate-spin rounded-full border-2 border-blue-500 border-t-transparent ${sizes[size]}`} />
    {message && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">{message}</p>
    )}
    </div>
)
}
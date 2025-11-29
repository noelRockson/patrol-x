// import React from 'react'

// const ChatMessage = ({ message, isUser = false }) => {
//   const formatMessage = (text) => {
//     const parts = text.split(/(\*\*.*?\*\*)/g)
//     return parts.map((part, index) => {
//       if (part.startsWith('**') && part.endsWith('**')) {
//         const boldText = part.slice(2, -2)
//         return (
//           <strong key={index} className="font-semibold">
//             {boldText}
//           </strong>
//         )
//       }
//       return <span key={index}>{part}</span>
//     })
//   }

//   return (
//     <div className={`mb-3 md:mb-4 ${isUser ? 'text-right' : 'text-left'}`}>
//       <div
//         className={`inline-block max-w-[90%] md:max-w-[85%] px-3 md:px-4 py-2 md:py-3 rounded-lg ${
//           isUser 
//             ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100' 
//             : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
//         }`}
//       >
//         <div className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed">
//           {formatMessage(message)}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ChatMessage

import React, { memo, useState, useEffect } from 'react'
import { parseMarkdown } from '../utils/markdown.jsx'
import { useTypingEffect } from '../hooks/useTypingEffect'

const ChatMessage = memo(({ message, isUser = false, isAIResponse = false, enableTyping = true }) => {
  // Utiliser l'effet de typing uniquement pour les vraies réponses de l'IA (isAIResponse === true)
  const shouldType = isAIResponse && enableTyping
  const displayedText = useTypingEffect(message, 20, shouldType)
  const [isTypingComplete, setIsTypingComplete] = useState(!shouldType)

  // Détecter quand le typing est terminé
  useEffect(() => {
    if (shouldType && displayedText === message) {
      setIsTypingComplete(true)
    }
  }, [displayedText, message, shouldType])

  // Afficher le curseur de typing pendant que le message s'affiche
  const textToDisplay = shouldType ? displayedText : message

  return (
    <div className={`mb-3 md:mb-4 ${isUser ? 'text-right animate-slideInRight' : 'text-left animate-slideInLeft'}`}>
      <div
        className={`inline-block max-w-[90%] md:max-w-[85%] px-4 md:px-5 py-3 md:py-3.5 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md ${isUser
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-blue-500/30'
            : 'bg-white dark:bg-gray-700/80 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
          }`}
      >
        <div className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed">
          {parseMarkdown(textToDisplay)}
          {/* Curseur clignotant pendant le typing */}
          {shouldType && !isTypingComplete && (
            <span className="inline-block w-0.5 h-4 bg-current ml-0.5 animate-pulse" />
          )}
        </div>
      </div>

      {/* Timestamp subtil */}
      <div className="mt-1 px-1">
        <span className="text-[10px] text-gray-400 dark:text-gray-500">
          {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
})

ChatMessage.displayName = 'ChatMessage'

export default ChatMessage
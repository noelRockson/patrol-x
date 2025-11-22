import React from 'react'

const ChatMessage = ({ message, isUser = false }) => {
  const formatMessage = (text) => {
    const parts = text.split(/(\*\*.*?\*\*)/g)
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2)
        return (
          <strong key={index} className="font-semibold">
            {boldText}
          </strong>
        )
      }
      return <span key={index}>{part}</span>
    })
  }

  return (
    <div className={`mb-3 md:mb-4 ${isUser ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block max-w-[90%] md:max-w-[85%] px-3 md:px-4 py-2 md:py-3 rounded-lg ${
          isUser 
            ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100' 
            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
        }`}
      >
        <div className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed">
          {formatMessage(message)}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage
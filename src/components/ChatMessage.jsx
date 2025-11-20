import React from 'react'

const ChatMessage = ({ message, isUser = false }) => {
  // Simple parsing pour le markdown basique (**texte**)
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
    <div className={`mb-4 ${isUser ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block max-w-[85%] px-4 py-3 rounded-lg ${
          isUser
            ? 'bg-blue-100 text-blue-900'
            : 'bg-gray-100 text-gray-900'
        }`}
      >
        <div className="whitespace-pre-wrap text-sm leading-relaxed">
          {formatMessage(message)}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage


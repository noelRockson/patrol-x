
import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../context/store'
import { askQuestion } from '../api/api'
import ChatMessage from './ChatMessage'

const Chat = ({ onClose, isMobile }) => {
  const { selectedZone, zoneData, messages, addMessage, setMessages, setIsLoading, isLoading } = useStore()
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text: 'Bonjour ! Je suis votre assistant Patrol-X. Vous pouvez me poser des questions sur les zones de Port-au-Prince, ou discuter avec moi. Pour voir l\'état des lieux d\'une zone spécifique, sélectionnez-la sur la carte.',
          isUser: false,
          timestamp: Date.now(),
        },
      ])
    }
  }, [messages.length, setMessages])

  useEffect(() => {
    if (zoneData && selectedZone) {
      const summaryMessage = {
        text: `**État des lieux — ${selectedZone}**\n\n${zoneData.summary}`,
        isUser: false,
        timestamp: Date.now(),
      }
      
      const exists = messages.some(
        (msg) => msg.text.includes(`**État des lieux — ${selectedZone}**`)
      )
      
      if (!exists) {
        addMessage(summaryMessage)
      }
    }
  }, [zoneData, selectedZone, messages, addMessage])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!inputValue.trim() || isLoading) return

    const userMessage = {
      text: inputValue,
      isUser: true,
      timestamp: Date.now(),
    }

    addMessage(userMessage)
    const question = inputValue
    setInputValue('')
    setIsLoading(true)

    try {
      // Si une zone est sélectionnée, utiliser l'API avec zone, sinon sans zone
      const response = await askQuestion(selectedZone || null, question)
      
      const aiMessage = {
        text: response.data.response,
        isUser: false,
        timestamp: Date.now(),
      }

      addMessage(aiMessage)
    } catch (error) {
      const errorMessage = {
        text: '❌ Erreur lors de la récupération des données. Veuillez réessayer.',
        isUser: false,
        timestamp: Date.now(),
      }
      addMessage(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0 bg-white dark:bg-gray-800">
        <div className="flex-1 min-w-0">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">Chat IA</h2>
          {selectedZone && (
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              Zone : {selectedZone}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none shrink-0"
            aria-label="Fermer le chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm py-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
            <span className="italic">En cours de traitement...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 dark:border-gray-700 shrink-0 bg-white dark:bg-gray-800">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tapez votre question ou message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-5 py-3 text-sm md:text-base bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors shrink-0 font-medium"
            >
              {isMobile ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              ) : (
                'Envoyer'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Chat
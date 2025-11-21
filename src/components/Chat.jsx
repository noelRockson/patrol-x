import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../context/store'
import { askQuestion } from '../api/api'
import ChatMessage from './ChatMessage'

const Chat = ({ onClose, onShowPriorities }) => {
  const { selectedZone, zoneData, messages, addMessage, setMessages, setIsLoading, isLoading, priorities } = useStore()
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Message initial
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

  // Ajouter le résumé de la zone quand elle est sélectionnée
  useEffect(() => {
    if (zoneData && selectedZone) {
      const summaryMessage = {
        text: `**État des lieux — ${selectedZone}**\n\n${zoneData.summary}`,
        isUser: false,
        timestamp: Date.now(),
      }
      
      // Vérifier si le message n'existe pas déjà
      const exists = messages.some(
        (msg) => msg.text.includes(`**État des lieux — ${selectedZone}**`)
      )
      
      if (!exists) {
        addMessage(summaryMessage)
      }
    }
  }, [zoneData, selectedZone, messages, addMessage])

  // Scroll automatique vers le bas
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
      // Si une zone est sélectionnée, utiliser l'API avec zone
      if (selectedZone) {
        const response = await askQuestion(selectedZone, question)
        
        const aiMessage = {
          text: response.data.response,
          isUser: false,
          timestamp: Date.now(),
        }

        addMessage(aiMessage)
      } else {
        // Sinon, répondre de manière générale
        const response = await askQuestion(null, question)
        
        const aiMessage = {
          text: response.data.response,
          isUser: false,
          timestamp: Date.now(),
        }

        addMessage(aiMessage)
      }
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
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-base md:text-lg font-semibold text-gray-900">Chat IA</h2>
            {isMobile && selectedZone && onShowPriorities && (
              <button
                onClick={onShowPriorities}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                aria-label="Voir les priorités"
              >
                <span>🔥{priorities.urgent}</span>
                <span>📌{priorities.pertinent}</span>
                <span>💤{priorities.ignored}</span>
              </button>
            )}
          </div>
          {selectedZone && (
            <p className="text-xs md:text-sm text-gray-500 mt-1">Zone : {selectedZone}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Fermer le chat"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.map((msg, index) => (
          <ChatMessage
            key={index}
            message={msg.text}
            isUser={msg.isUser}
          />
        ))}
        {isLoading && (
          <div className="text-gray-500 text-sm italic">
            En cours de traitement...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-t border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Tapez votre question ou message..."
              disabled={isLoading}
              className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="px-4 md:px-6 py-2 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Envoyer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Chat


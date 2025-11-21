import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../context/store'
import { askQuestion } from '../api/api'
import ChatMessage from './ChatMessage'

const Chat = ({ onClose }) => {
  const { selectedZone, zoneData, messages, addMessage, setMessages, setIsLoading, isLoading } = useStore()
  const [inputValue, setInputValue] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          text: 'Sélectionnez une zone sur la carte pour voir l\'état des lieux en temps réel.',
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
    
    if (!inputValue.trim() || !selectedZone || isLoading) return

    const userMessage = {
      text: inputValue,
      isUser: true,
      timestamp: Date.now(),
    }

    addMessage(userMessage)
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await askQuestion(selectedZone, inputValue)
      
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
    <div className="flex flex-col h-full bg-white">
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
        <div className="flex-1 min-w-0">
          <h2 className="text-base md:text-lg font-semibold text-gray-900">Chat IA</h2>
          {selectedZone && (
            <p className="text-xs md:text-sm text-gray-500 mt-0.5 md:mt-1 truncate">
              Zone : {selectedZone}
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-2 md:ml-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
            aria-label="Fermer le chat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-3 md:px-6 py-3 md:py-4">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
        ))}
        {isLoading && (
          <div className="text-gray-500 text-xs md:text-sm italic">
            En cours de traitement...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-3 md:px-6 py-3 md:py-4 border-t border-gray-200 shrink-0">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={selectedZone ? 'Tapez votre question...' : 'Sélectionnez une zone d\'abord'}
              disabled={!selectedZone || isLoading}
              className="flex-1 px-3 md:px-4 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!selectedZone || !inputValue.trim() || isLoading}
              className="px-4 md:px-6 py-2 text-sm md:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shrink-0"
            >
              {isMobile ? '→' : 'Envoyer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Chat
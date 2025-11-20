import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../context/store'
import { askQuestion } from '../api/api'
import ChatMessage from './ChatMessage'

const Chat = () => {
  const { selectedZone, zoneData, messages, addMessage, setMessages, setIsLoading, isLoading } = useStore()
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  // Message initial
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
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Chat IA</h2>
        {selectedZone && (
          <p className="text-sm text-gray-500 mt-1">Zone : {selectedZone}</p>
        )}
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
      <div className="px-6 py-4 border-t border-gray-200">
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={
                selectedZone
                  ? 'Tapez votre question...'
                  : 'Sélectionnez une zone d\'abord'
              }
              disabled={!selectedZone || isLoading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!selectedZone || !inputValue.trim() || isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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


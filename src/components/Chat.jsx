// import React, { useState, useEffect, useRef } from 'react'
// import { useStore } from '../context/store'
// import { askQuestion } from '../api/api'
// import ChatMessage from './ChatMessage'
// import { handleApiError } from '../utils/errors'
// import { useOnlineStatus } from '../hooks/useOnlineStatus'

// const Chat = ({ onClose, isMobile }) => {
//   const { 
//     selectedZone, 
//     activeZone, 
//     zoneData, 
//     messages, 
//     addMessage, 
//     setMessages, 
//     chatLoading,
//     setChatLoading, 
//   } = useStore()
  
//   const [inputValue, setInputValue] = useState('')
//   const messagesEndRef = useRef(null)
//   const isOnline = useOnlineStatus()

//   // Message de bienvenue initial
//   useEffect(() => {
//     if (messages.length === 0 && !zoneData) {
//       setMessages([
//         {
//           text: 'Bonjour ! Je suis votre assistant Patrol-X. Vous pouvez me poser des questions sur les zones de Port-au-Prince, ou discuter avec moi. Pour voir l\'état des lieux d\'une zone spécifique, sélectionnez-la sur la carte.',
//           isUser: false,
//           timestamp: Date.now(),
//         },
//       ])
//     }
//   }, [messages.length, setMessages, zoneData])

//   // Afficher l'état des lieux quand une zone est sélectionnée
//   useEffect(() => {
//     const hasSelectedZone = selectedZone && selectedZone.length > 0
//     if (zoneData && zoneData.summary && hasSelectedZone) {
//       const zoneToShow = activeZone || (selectedZone && selectedZone.length > 0 ? selectedZone[selectedZone.length - 1] : null)
      
//       // Ne pas afficher l'état général dans le chat
//       const isGeneral = zoneData.zone && zoneData.zone.includes('Général')
//       if (isGeneral) {
//         return
//       }
      
//       // Utiliser la zone du zoneData si disponible, sinon la zone active/sélectionnée
//       const actualZone = zoneData.zone || zoneToShow
//       const messageText = `**État des lieux — ${actualZone}**\n\n${zoneData.summary}`
      
//       // Vérifier si ce message exact n'existe pas déjà (évite les doublons)
//       const messageExists = messages.some(
//         msg => msg.text === messageText && !msg.isUser
//       )
      
//       if (!messageExists) {
//         console.log('Adding new zone message:', actualZone, zoneData.summary.substring(0, 50))
//         addMessage({
//           text: messageText,
//           isUser: false,
//           timestamp: Date.now(),
//         })
//       }
//     }
//   }, [
//     // Le _timestamp dans zoneData force la détection de changement
//     zoneData?._timestamp,
//     zoneData?.zone,
//     zoneData?.summary,
//     activeZone, 
//     selectedZone, 
//     addMessage
//   ])

//   // Gérer la désélection de toutes les zones
//   useEffect(() => {
//     if (!activeZone && selectedZone && selectedZone.length === 0) {
//       if (messages.length === 0) {
//         addMessage({
//           text: 'Sélectionnez une zone sur la carte pour voir son état des lieux.',
//           isUser: false,
//           timestamp: Date.now(),
//         })
//       }
//     }
//   }, [activeZone, selectedZone, addMessage, messages])

//   // Auto-scroll vers le bas
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   // Gestion de l'envoi de message
//   const handleSubmit = async (e) => {
//     e.preventDefault()
    
//     if (!inputValue.trim() || chatLoading) return

//     // Vérifier si l'utilisateur est en ligne
//     if (!isOnline) {
//       const offlineMessage = {
//         text: '⚠️ Vous êtes hors ligne. Impossible d\'envoyer votre message.',
//         isUser: false,
//         timestamp: Date.now(),
//       }
//       addMessage(offlineMessage)
//       return
//     }

//     const userMessage = {
//       text: inputValue,
//       isUser: true,
//       timestamp: Date.now(),
//     }

//     addMessage(userMessage)
//     const question = inputValue
//     setInputValue('')
//     setChatLoading(true)

//     try {
//       // Utiliser activeZone pour l'API, sinon la dernière zone sélectionnée
//       const zoneToUse = activeZone || (selectedZone && selectedZone.length > 0 ? selectedZone[selectedZone.length - 1] : null)
//       const response = await askQuestion(zoneToUse || null, question)
      
//       const aiMessage = {
//         text: response.data.response,
//         isUser: false,
//         timestamp: Date.now(),
//       }

//       addMessage(aiMessage)
//     } catch (error) {
//       // Gestion d'erreur améliorée avec messages spécifiques
//       const errorMessage = {
//         text: `⚠️ ${handleApiError(error)}`,
//         isUser: false,
//         timestamp: Date.now(),
//       }
//       addMessage(errorMessage)
//     } finally {
//       setChatLoading(false)
//     }
//   }

//   return (
//     <div className="flex flex-col h-full bg-white dark:bg-gray-800">
//       {/* Header */}
//       <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0 bg-white dark:bg-gray-800">
//         <div className="flex-1 min-w-0">
//           <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
//             Chat IA
//           </h2>
//           {(selectedZone && selectedZone.length > 0) ? (
//             <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
//               {activeZone 
//                 ? `Zone active : ${activeZone}`
//                 : selectedZone.length === 1 
//                   ? `Zone : ${selectedZone[0]}`
//                   : `Zones (${selectedZone.length}) : ${selectedZone.join(', ')}`
//               }
//             </p>
//           ) : (
//             <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
//               Vue d'ensemble — Port-au-Prince
//             </p>
//           )}
//         </div>
//         {onClose && (
//           <button
//             onClick={onClose}
//             className="ml-3 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
//             aria-label="Fermer le chat"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         )}
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 bg-gray-50 dark:bg-gray-900">
//         {messages.map((msg, index) => (
//           <ChatMessage 
//             key={`${msg.timestamp}-${index}`} 
//             message={msg.text} 
//             isUser={msg.isUser} 
//           />
//         ))}
        
//         {/* Indicateur de chargement */}
//         {chatLoading && (
//           <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm py-2">
//             <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
//             <span className="italic">En cours de traitement...</span>
//           </div>
//         )}
        
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="px-4 md:px-6 py-3 md:py-4 border-t border-gray-200 dark:border-gray-700 shrink-0 bg-white dark:bg-gray-800">
//         <form onSubmit={handleSubmit}>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={inputValue}
//               onChange={(e) => setInputValue(e.target.value)}
//               placeholder={isOnline ? "Tapez votre question ou message..." : "Hors ligne..."}
//               disabled={chatLoading || !isOnline}
//               className="flex-1 px-4 py-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
//               aria-label="Message"
//             />
//             <button
//               type="submit"
//               disabled={!inputValue.trim() || chatLoading || !isOnline}
//               className="px-5 py-3 text-sm md:text-base bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors shrink-0 font-medium"
//               aria-label="Envoyer le message"
//             >
//               {isMobile ? (
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                 </svg>
//               ) : (
//                 'Envoyer'
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }

// export default Chat
import React, { useState, useEffect, useRef } from 'react'
import { useStore } from '../context/store'
import { askQuestion } from '../api/api'
import ChatMessage from './ChatMessage'
import { handleApiError } from '../utils/errors'
import { useOnlineStatus } from '../hooks/useOnlineStatus'

// Fonction utilitaire pour décoder les caractères encodés en URL
const decodeHtmlEntities = (text) => {
  if (!text) return '';
  try {
    return decodeURIComponent(text);
  } catch (e) {
    console.error('Erreur lors du décodage du texte:', e);
    return text;
  }
};

const Chat = ({ onClose, isMobile }) => {
  const { 
    selectedZone, 
    activeZone, 
    zoneData, 
    messages, 
    addMessage, 
    setMessages, 
    chatLoading,
    setChatLoading,
    isLoading, // Pour afficher le loading lors du chargement de zone
  } = useStore()
  
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)
  const isOnline = useOnlineStatus()
  const lastDisplayedZoneRef = useRef(null)
  const welcomeMessageShownRef = useRef(false) // Pour éviter le double message de bienvenue

  // Message de bienvenue initial (une seule fois)
  useEffect(() => {
    if (messages.length === 0 && !zoneData && !welcomeMessageShownRef.current) {
      welcomeMessageShownRef.current = true
      setMessages([
        {
          text: 'Bonjour ! Je suis votre assistant Patrol-X. Vous pouvez me poser des questions sur les zones de Port-au-Prince, ou discuter avec moi. Pour voir l\'état des lieux d\'une zone spécifique, sélectionnez-la sur la carte.',
          isUser: false,
          timestamp: Date.now(),
        },
      ])
    }
  }, []) // Dépendances vides = s'exécute une seule fois au montage

  // Afficher l'état des lieux quand une zone est sélectionnée
  useEffect(() => {
    const hasSelectedZone = selectedZone && selectedZone.length > 0
    if (!zoneData || !zoneData.summary || !hasSelectedZone) {
      return
    }

    // Ne pas afficher l'état général dans le chat
    const isGeneral = zoneData.zone && zoneData.zone.includes('Général')
    if (isGeneral) {
      return
    }
    
    // Utiliser la zone du zoneData si disponible, sinon la zone active/sélectionnée
    const zoneToShow = activeZone || (selectedZone && selectedZone.length > 0 ? selectedZone[selectedZone.length - 1] : null)
    const actualZone = zoneData.zone || zoneToShow
    
    // Créer un identifiant unique pour cette zone + summary
    const zoneKey = `${actualZone}:${zoneData.summary.substring(0, 50)}`
    
    // Vérifier si on a déjà affiché cette zone exacte
    if (lastDisplayedZoneRef.current === zoneKey) {
      console.log('🚫 Message ignoré - déjà affiché:', actualZone)
      return
    }
    
const messageText = `**État des lieux — ${actualZone}**\n\n${decodeHtmlEntities(zoneData.summary)}`    
    // Vérifier si ce message exact n'existe pas déjà
    const messageExists = messages.some(
      msg => msg.text === messageText && !msg.isUser
    )
    
    if (!messageExists) {
      console.log('✅ Ajout du message pour:', actualZone)
      lastDisplayedZoneRef.current = zoneKey
      addMessage({
        text: messageText,
        isUser: false,
        timestamp: Date.now(),
      })
    } else {
      console.log('🚫 Message ignoré - existe déjà:', actualZone)
    }
  }, [
    zoneData?.zone,
    zoneData?.summary,
    activeZone, 
    selectedZone?.length, // Utiliser .length au lieu de l'array entier
    addMessage,
    messages.length // Utiliser .length au lieu de l'array entier
  ])

  // Gérer la désélection de toutes les zones
  useEffect(() => {
    if (!activeZone && selectedZone && selectedZone.length === 0) {
      lastDisplayedZoneRef.current = null // Reset le ref
      if (messages.length === 0) {
        addMessage({
          text: 'Sélectionnez une zone sur la carte pour voir son état des lieux.',
          isUser: false,
          timestamp: Date.now(),
        })
      }
    }
  }, [activeZone, selectedZone?.length, addMessage, messages.length])

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Gestion de l'envoi de message
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!inputValue.trim() || chatLoading) return;
  
    const userMessage = {
      text: inputValue,
      isUser: true,
      timestamp: Date.now(),
    };
  
    addMessage(userMessage);
    const question = inputValue.trim();
    setInputValue('');
    setChatLoading(true);
  
    // Validation avant d'envoyer
    if (!question || question.length === 0) {
      setChatLoading(false);
      return;
    }
  
    try {
      console.log('Chat.jsx - Envoi de la question:', question);
      const response = await askQuestion(question);
      console.log('Réponse du serveur:', response); // Pour le débogage

      // Vérifier si la réponse est directement une chaîne ou un objet avec une propriété 'response'
      const responseText = typeof response === 'string' 
        ? response 
        : response?.data?.response || response?.response || 'Réponse reçue';

      const aiMessage = {
        text: responseText,
        isUser: false,
        timestamp: Date.now(),
      };
  
      addMessage(aiMessage);
    } catch (error) {
      addMessage({
        text: `⚠️ ${handleApiError(error)}`,
        isUser: false,
        timestamp: Date.now(),
      });
    } finally {
      setChatLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between shrink-0 bg-white dark:bg-gray-800">
        <div className="flex-1 min-w-0">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">
            Chat IA
          </h2>
          {(selectedZone && selectedZone.length > 0) ? (
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {activeZone 
                ? `Zone active : ${activeZone}`
                : selectedZone.length === 1 
                  ? `Zone : ${selectedZone[0]}`
                  : `Zones (${selectedZone.length}) : ${selectedZone.join(', ')}`
              }
            </p>
          ) : (
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              Vue d'ensemble — Port-au-Prince
            </p>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-3 p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <ChatMessage 
            key={`${msg.timestamp}-${index}`} 
            message={msg.text} 
            isUser={msg.isUser} 
          />
        ))}
        
        {/* Indicateur de chargement pour les questions du chat */}
        {chatLoading && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm py-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
            <span className="italic">En cours de traitement...</span>
          </div>
        )}
        
        {/* Indicateur de chargement pour le chargement des données de zone (seulement si une zone est sélectionnée) */}
        {isLoading && activeZone && selectedZone && selectedZone.length > 0 && (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm py-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
            <span className="italic">Chargement des données de la zone...</span>
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
              placeholder={isOnline ? "Tapez votre question ou message..." : "Hors ligne..."}
              disabled={chatLoading || !isOnline}
              className="flex-1 px-4 py-3 text-sm md:text-base border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:cursor-not-allowed bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              aria-label="Message"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || chatLoading || !isOnline}
              className="px-5 py-3 text-sm md:text-base bg-blue-600 dark:bg-blue-500 text-white rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors shrink-0 font-medium"
              aria-label="Envoyer le message"
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
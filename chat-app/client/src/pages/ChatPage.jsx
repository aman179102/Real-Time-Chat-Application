import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { useWebSocket } from '../context/WebSocketContext'
import MessageList from '../components/MessageList'
import UserList from '../components/UserList'
import MessageInput from '../components/MessageInput'
import UsernameModal from '../components/UsernameModal'
import '../styles/ChatPage.css'

function ChatPage() {
  const { currentUser, logout } = useAuth()
  const { 
    messages, 
    users, 
    isConnected, 
    username, 
    sendMessage, 
    setUsername 
  } = useWebSocket()
  
  const [newMessage, setNewMessage] = useState('')
  const [showUsernameModal, setShowUsernameModal] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      sendMessage(newMessage)
      setNewMessage('')
    }
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h1>ChatApp</h1>
        <div className="header-controls">
          <span className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? 'Online' : 'Offline'}
          </span>
          <button onClick={() => setShowUsernameModal(true)} className="username-button">
            {username}
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      <div className="chat-content">
        <div className="message-area">
          <MessageList messages={messages} currentUsername={username} />
          <div ref={messagesEndRef} />
        </div>
        
        <div className="user-list-container">
          <UserList users={users} />
        </div>
      </div>

      <div className="message-input-container">
        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
        />
      </div>

      {showUsernameModal && (
        <UsernameModal
          currentUsername={username}
          setUsername={setUsername}
          onClose={() => setShowUsernameModal(false)}
        />
      )}
    </div>
  )
}

export default ChatPage
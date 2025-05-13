import React from 'react'
import '../styles/Message.css'

function Message({ message, isCurrentUser }) {
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (message.type === 'system') {
    return (
      <div className="message system-message">
        <span>{message.text}</span>
      </div>
    )
  }

  return (
    <div className={`message ${isCurrentUser ? 'current-user' : 'other-user'}`}>
      {!isCurrentUser && message.username && (
        <div className="message-username">{message.username}</div>
      )}
      <div className="message-bubble">
        <div className="message-text">{message.text}</div>
        <div className="message-time">{formatTime(message.timestamp)}</div>
      </div>
    </div>
  )
}

export default Message
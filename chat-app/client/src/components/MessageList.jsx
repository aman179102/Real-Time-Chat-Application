import React from 'react'
import Message from './Message'
import '../styles/MessageList.css'

function MessageList({ messages, currentUsername }) {
  return (
    <div className="message-list">
      {messages.map((message, index) => (
        <Message 
          key={message.messageId || index} 
          message={message} 
          isCurrentUser={message.username === currentUsername}
        />
      ))}
    </div>
  )
}

export default MessageList
import React from 'react'
import '../styles/MessageInput.css'

function MessageInput({ newMessage, setNewMessage, handleSendMessage }) {
  return (
    <form onSubmit={handleSendMessage} className="message-input-form">
      <input
        type="text"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        placeholder="Type a message..."
        autoFocus
      />
      <button type="submit" disabled={!newMessage.trim()}>
        Send
      </button>
    </form>
  )
}

export default MessageInput
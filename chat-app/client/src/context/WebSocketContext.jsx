import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

const WebSocketContext = createContext()

export function WebSocketProvider({ children }) {
  const [messages, setMessages] = useState([])
  const [users, setUsers] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [userId, setUserId] = useState(null)
  const [username, setUsername] = useState('')
  const ws = useRef(null)

  const connect = () => {
    ws.current = new WebSocket('ws://localhost:8080')

    ws.current.onopen = () => {
      console.log('WebSocket connected')
      setIsConnected(true)
    }

    ws.current.onclose = () => {
      console.log('WebSocket disconnected')
      setIsConnected(false)
      setTimeout(connect, 5000)
    }

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error)
    }

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        handleMessage(message)
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }
  }

  const handleMessage = (message) => {
    switch (message.type) {
      case 'welcome':
        setUserId(message.userId)
        setUsername(message.username)
        setUsers(message.users)
        setMessages(message.history)
        break
      
      case 'chat-message':
        setMessages(prev => [...prev, message])
        break
      
      case 'user-joined':
        setUsers(prev => [...prev, message.username])
        setMessages(prev => [...prev, {
          type: 'system',
          text: `${message.username} joined the chat`,
          timestamp: message.timestamp
        }])
        break
      
      case 'user-left':
        setUsers(prev => prev.filter(user => user !== message.username))
        setMessages(prev => [...prev, {
          type: 'system',
          text: `${message.username} left the chat`,
          timestamp: message.timestamp
        }])
        break
      
      case 'username-changed':
        setUsers(prev => prev.map(user => 
          user === message.oldUsername ? message.newUsername : user
        ))
        setMessages(prev => [...prev, {
          type: 'system',
          text: `${message.oldUsername} changed their name to ${message.newUsername}`,
          timestamp: message.timestamp
        }])
        break
      
      default:
        console.warn('Unknown message type:', message.type)
    }
  }

  const sendMessage = (text) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'chat-message',
        text
      }))
    }
  }

  const setUsernameHandler = (newUsername) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'set-username',
        username: newUsername
      }))
      setUsername(newUsername)
    }
  }

  useEffect(() => {
    connect()
    
    return () => {
      if (ws.current) {
        ws.current.close()
      }
    }
  }, [])

  return (
    <WebSocketContext.Provider value={{
      messages,
      users,
      isConnected,
      userId,
      username,
      sendMessage,
      setUsername: setUsernameHandler
    }}>
      {children}
    </WebSocketContext.Provider>
  )
}

export function useWebSocket() {
  return useContext(WebSocketContext)
}
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import '../styles/LoginPage.css'

function LoginPage() {
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!username.trim()) {
      setError('Please enter a username')
      return
    }
    login(username)
    navigate('/chat')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Welcome to ChatApp</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength="20"
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Join Chat</button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
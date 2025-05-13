import React, { useState } from 'react'
import '../styles/UsernameModal.css'

function UsernameModal({ currentUsername, setUsername, onClose }) {
  const [newUsername, setNewUsername] = useState(currentUsername)
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!newUsername.trim()) {
      setError('Username cannot be empty')
      return
    }
    if (newUsername.length > 20) {
      setError('Username must be 20 characters or less')
      return
    }
    setUsername(newUsername)
    onClose()
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Change Username</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newUsername}
            onChange={(e) => {
              setNewUsername(e.target.value)
              setError('')
            }}
            maxLength="20"
          />
          {error && <p className="error-message">{error}</p>}
          <div className="modal-buttons">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">Save</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UsernameModal
import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)

  const login = (username) => {
    setCurrentUser({ username })
    localStorage.setItem('chatUser', JSON.stringify({ username }))
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('chatUser')
  }

  React.useEffect(() => {
    const storedUser = localStorage.getItem('chatUser')
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
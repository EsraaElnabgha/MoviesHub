import { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../services/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => auth.getCurrentUser())

  useEffect(() => {
    function handleAuthChange() {
      setUser(auth.getCurrentUser())
    }

    // Sync state on custom event and standard storage event
    window.addEventListener('authChange', handleAuthChange)
    window.addEventListener('storage', handleAuthChange)

    return () => {
      window.removeEventListener('authChange', handleAuthChange)
      window.removeEventListener('storage', handleAuthChange)
    }
  }, [])

  const login = (usernameOrEmail, password) => {
    const result = auth.login(usernameOrEmail, password)
    if (result.success) {
      setUser(result.user)
    }
    return result
  }

  const register = (username, email, password, displayName) => {
    const result = auth.register(username, email, password, displayName)
    if (result.success) {
      setUser(result.user)
    }
    return result
  }

  const logout = () => {
    auth.logout()
    setUser(null)
  }

  const updateProfile = (displayName, avatarGradient) => {
    const result = auth.updateProfile(displayName, avatarGradient)
    if (result.success) {
      setUser(result.user)
    }
    return result
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

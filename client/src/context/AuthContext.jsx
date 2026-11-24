import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

// Reads the exp claim from the JWT so an old token is never treated as logged in
function isTokenExpired(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(base64))
    return payload.exp ? payload.exp * 1000 < Date.now() : false
  } catch {
    return true
  }
}

// Restores the session from localStorage when the app loads
function loadSession() {
  const token = localStorage.getItem('token')
  const rawUser = localStorage.getItem('user')
  const empty = { token: null, user: null }

  if (!token || !rawUser || isTokenExpired(token)) {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return empty
  }
  try {
    return { token, user: JSON.parse(rawUser) }
  } catch {
    return empty
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession)

  // The login and register pages save the JWT to localStorage;
  // login() updates the app's state so every component sees it.
  const login = (token, user) => setSession({ token, user })

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setSession({ token: null, user: null })
  }

  return (
    <AuthContext.Provider value={{ ...session, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
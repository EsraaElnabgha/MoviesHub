// Mock authentication service using localStorage
const USERS_KEY = 'moviesHubUsers'
const CURRENT_USER_KEY = 'moviesHubCurrentUser'

// Pre-defined premium avatar gradient themes
export const AVATAR_GRADIENTS = [
  'linear-gradient(135deg, #f67800 0%, #ffc128 100%)', // Orange/Yellow
  'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)', // Indigo
  'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)', // Pink/Rose
  'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 100%)', // Sky Blue
  'linear-gradient(135deg, #10b981 0%, #34d399 100%)', // Emerald
  'linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%)', // Violet
]

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export const auth = {
  getCurrentUser() {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || null
    } catch {
      return null
    }
  },

  register(username, email, password, displayName) {
    const users = getUsers()
    const normalizedUsername = username.trim().toLowerCase()
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedUsername || !normalizedEmail || !password || !displayName.trim()) {
      return { success: false, error: 'All fields are required.' }
    }

    // Check if username already exists
    if (users.some(u => u.username === normalizedUsername)) {
      return { success: false, error: 'Username is already taken.' }
    }

    // Check if email already exists
    if (users.some(u => u.email === normalizedEmail)) {
      return { success: false, error: 'Email is already registered.' }
    }

    // Choose random gradient
    const gradient = AVATAR_GRADIENTS[Math.floor(Math.random() * AVATAR_GRADIENTS.length)]

    const newUser = {
      username: normalizedUsername,
      email: normalizedEmail,
      password: password, // For mock authentication
      displayName: displayName.trim(),
      avatarGradient: gradient,
      createdAt: new Date().toISOString()
    }

    users.push(newUser)
    saveUsers(users)

    // Set active session
    const sessionUser = { ...newUser }
    delete sessionUser.password
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser))

    // Dispatch event to notify tabs
    window.dispatchEvent(new Event('authChange'))

    return { success: true, user: sessionUser }
  },

  login(usernameOrEmail, password) {
    const users = getUsers()
    const normalizedQuery = usernameOrEmail.trim().toLowerCase()

    if (!normalizedQuery || !password) {
      return { success: false, error: 'Username/Email and Password are required.' }
    }

    const matchedUser = users.find(
      u => u.username === normalizedQuery || u.email === normalizedQuery
    )

    if (!matchedUser || matchedUser.password !== password) {
      return { success: false, error: 'Invalid username or password.' }
    }

    const sessionUser = { ...matchedUser }
    delete sessionUser.password
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser))

    // Dispatch event to notify tabs
    window.dispatchEvent(new Event('authChange'))

    return { success: true, user: sessionUser }
  },

  logout() {
    localStorage.removeItem(CURRENT_USER_KEY)
    window.dispatchEvent(new Event('authChange'))
    return { success: true }
  },

  updateProfile(displayName, avatarGradient) {
    const currentUser = this.getCurrentUser()
    if (!currentUser) return { success: false, error: 'No user is logged in.' }

    const users = getUsers()
    const userIndex = users.findIndex(u => u.username === currentUser.username)

    if (userIndex === -1) return { success: false, error: 'User not found.' }

    const updatedUser = {
      ...users[userIndex],
      displayName: displayName.trim(),
      avatarGradient: avatarGradient
    }

    users[userIndex] = updatedUser
    saveUsers(users)

    const sessionUser = { ...updatedUser }
    delete sessionUser.password
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser))

    window.dispatchEvent(new Event('authChange'))

    return { success: true, user: sessionUser }
  }
}

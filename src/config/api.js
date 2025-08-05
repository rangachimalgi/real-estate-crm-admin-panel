import { getEffectiveEnvironment, ENV_CONFIG } from './environment.js'

// Get current API config
const getApiConfig = () => {
  const env = getEffectiveEnvironment()
  return ENV_CONFIG[env]
}

// API base URL
export const API_BASE_URL = getApiConfig().baseURL

// API timeout
export const API_TIMEOUT = getApiConfig().timeout

// Helper function to make API calls
export const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    timeout: API_TIMEOUT,
    ...options
  }

  // Add auth token if available
  const token = localStorage.getItem('adminToken')
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, defaultOptions)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`)
    }
    
    return data
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// Export current environment for debugging
export const CURRENT_ENV = getEffectiveEnvironment() 
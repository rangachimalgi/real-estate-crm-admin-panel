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
  
  console.log('API Call:', url, options) // Debug log
  
  const defaultOptions = {
    headers: {
      ...options.headers
    },
    timeout: API_TIMEOUT,
    ...options
  }

  // TEMPORARY: Remove auth token for testing to match Postman
  console.log('🔧 Testing without auth token to match Postman')
  // delete defaultOptions.headers.Authorization
  
  // Add auth token if available (commented out for testing)
  // const token = localStorage.getItem('adminToken')
  // if (token) {
  //   defaultOptions.headers.Authorization = `Bearer ${token}`
  //   console.log('🔐 Adding auth token:', token.substring(0, 20) + '...')
  // } else {
  //   console.log('⚠️ No auth token found in localStorage')
  // }

  // Only set Content-Type for JSON requests (not FormData)
  if (!(options.body instanceof FormData)) {
    defaultOptions.headers['Content-Type'] = 'application/json'
  }

  console.log('🔧 Final request options:', {
    url,
    method: defaultOptions.method || 'GET',
    headers: defaultOptions.headers,
    hasBody: !!defaultOptions.body,
    bodyType: defaultOptions.body ? (defaultOptions.body instanceof FormData ? 'FormData' : 'JSON') : 'None'
  })

  try {
    const response = await fetch(url, defaultOptions)
    console.log('API Response status:', response.status) // Debug log
    console.log('API Response headers:', Object.fromEntries(response.headers.entries())) // Debug log
    
    // Check if response is JSON
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json()
      console.log('API Response data:', data) // Debug log
      
      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP ${response.status}: ${response.statusText}`)
      }
      
      return data
    } else {
      // Handle non-JSON responses
      const text = await response.text()
      console.log('API Response text:', text) // Debug log
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return text
    }
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// Export current environment for debugging
export const CURRENT_ENV = getEffectiveEnvironment() 
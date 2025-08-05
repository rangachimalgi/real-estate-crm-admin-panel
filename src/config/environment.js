// Environment Configuration
// This file allows you to easily switch between different backend environments

export const ENVIRONMENTS = {
  LOCAL: 'local',
  REMOTE: 'remote'
}

// Current environment - change this to switch between local and remote
export const CURRENT_ENVIRONMENT = ENVIRONMENTS.LOCAL

// Environment-specific configurations
export const ENV_CONFIG = {
  [ENVIRONMENTS.LOCAL]: {
    name: 'Local Development',
    baseURL: 'http://localhost:8000',
    timeout: 10000,
    description: 'Local backend server'
  },
  [ENVIRONMENTS.REMOTE]: {
    name: 'Remote Production',
    baseURL: 'https://real-estate-crm-backend-yfxi.onrender.com',
    timeout: 15000,
    description: 'Remote backend server'
  }
}

// Get current environment config
export const getCurrentConfig = () => {
  return ENV_CONFIG[CURRENT_ENVIRONMENT]
}

// Helper to check if we're in development mode
export const isDevelopment = () => {
  return import.meta.env.DEV
}

// Helper to check if we're in production mode
export const isProduction = () => {
  return import.meta.env.PROD
}

// Get the appropriate environment based on Vite's environment and our override
export const getEffectiveEnvironment = () => {
  // If we're in development mode and have set LOCAL, use local
  if (isDevelopment() && CURRENT_ENVIRONMENT === ENVIRONMENTS.LOCAL) {
    return ENVIRONMENTS.LOCAL
  }
  
  // Otherwise use remote
  return ENVIRONMENTS.REMOTE
} 
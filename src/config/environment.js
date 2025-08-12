// Smart Environment Configuration
// Automatically detects and switches between localhost and production

export const ENVIRONMENTS = {
  LOCAL: 'local',
  REMOTE: 'remote'
}

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

// Current environment (will be set automatically)
let currentEnvironment = null;

// Smart environment detection
const detectEnvironment = async () => {
  console.log('🔍 Detecting backend environment...');
  
  // Try localhost first
  try {
    console.log('🔍 Testing localhost backend...');
    const response = await fetch('http://localhost:8000/', {
      method: 'GET',
      signal: AbortSignal.timeout(3000) // 3 second timeout
    });
    
    if (response.ok) {
      console.log('✅ Localhost backend found and working');
      return ENVIRONMENTS.LOCAL;
    }
  } catch (error) {
    console.log('❌ Localhost backend not available:', error.message);
  }
  
  console.log('🌐 Falling back to production backend');
  return ENVIRONMENTS.REMOTE;
};

// Initialize environment automatically
let isInitialized = false;
export const initializeEnvironment = async () => {
  if (!isInitialized) {
    console.log('🚀 Initializing environment configuration...');
    currentEnvironment = await detectEnvironment();
    isInitialized = true;
    console.log(`🌐 Using environment: ${currentEnvironment}`);
    console.log(`🌐 Backend URL: ${getCurrentConfig().baseURL}`);
  }
  return currentEnvironment;
};

// Get current environment config
export const getCurrentConfig = () => {
  if (!currentEnvironment) {
    // Fallback to remote if not initialized
    return ENV_CONFIG[ENVIRONMENTS.REMOTE];
  }
  return ENV_CONFIG[currentEnvironment];
};

// Helper to check if we're in development mode
export const isDevelopment = () => {
  return import.meta.env.DEV;
};

// Helper to check if we're in production mode
export const isProduction = () => {
  return import.meta.env.PROD;
};

// Get the effective environment
export const getEffectiveEnvironment = () => {
  return currentEnvironment || ENVIRONMENTS.REMOTE;
};

// Manual override functions
export const switchToLocalhost = () => {
  currentEnvironment = ENVIRONMENTS.LOCAL;
  console.log('🌐 Manually switched to localhost backend');
};

export const switchToProduction = () => {
  currentEnvironment = ENVIRONMENTS.REMOTE;
  console.log('🌐 Manually switched to production backend');
};

// Auto-initialize on import
initializeEnvironment().catch(console.error); 
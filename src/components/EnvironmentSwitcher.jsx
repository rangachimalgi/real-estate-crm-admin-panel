import { useState, useEffect } from 'react'
import { ENVIRONMENTS, ENV_CONFIG, getEffectiveEnvironment } from '../config/environment'
import { API_BASE_URL } from '../config/api'

function EnvironmentSwitcher() {
  const [currentEnv, setCurrentEnv] = useState(getEffectiveEnvironment())
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Show environment info in console for debugging
    console.log('🌍 Current Environment:', currentEnv)
    console.log('🔗 API Base URL:', API_BASE_URL)
  }, [currentEnv])

  const handleEnvironmentChange = (newEnv) => {
    setCurrentEnv(newEnv)
    // Reload the page to apply the new environment
    window.location.reload()
  }

  const currentConfig = ENV_CONFIG[currentEnv]

  return (
    <div className="environment-switcher">
      <button 
        className="env-toggle"
        onClick={() => setIsVisible(!isVisible)}
        title="Switch Environment"
      >
        🌍 {currentConfig.name}
      </button>
      
      {isVisible && (
        <div className="env-dropdown">
          <div className="env-info">
            <strong>Current:</strong> {currentConfig.name}
            <br />
            <small>{currentConfig.description}</small>
            <br />
            <small>URL: {currentConfig.baseURL}</small>
          </div>
          
          <div className="env-options">
            <button
              className={`env-option ${currentEnv === ENVIRONMENTS.LOCAL ? 'active' : ''}`}
              onClick={() => handleEnvironmentChange(ENVIRONMENTS.LOCAL)}
            >
              🏠 Local Development
            </button>
            <button
              className={`env-option ${currentEnv === ENVIRONMENTS.REMOTE ? 'active' : ''}`}
              onClick={() => handleEnvironmentChange(ENVIRONMENTS.REMOTE)}
            >
              ☁️ Remote Production
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default EnvironmentSwitcher 
import { useState, useEffect } from 'react'
import { ENVIRONMENTS, getCurrentConfig, switchToLocalhost, switchToProduction } from '../config/environment'
import { getApiBaseUrl } from '../config/api'

function EnvironmentSwitcher() {
  const [currentEnv, setCurrentEnv] = useState(null)
  const [currentConfig, setCurrentConfig] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Initialize and get current environment
    const initEnv = async () => {
      const config = getCurrentConfig();
      const env = config === ENV_CONFIG[ENVIRONMENTS.LOCAL] ? ENVIRONMENTS.LOCAL : ENVIRONMENTS.REMOTE;
      setCurrentEnv(env);
      setCurrentConfig(config);
      
      // Show environment info in console for debugging
      console.log('🌍 Current Environment:', env);
      console.log('🔗 API Base URL:', getApiBaseUrl());
    };
    
    initEnv();
  }, []);

  const handleEnvironmentChange = (newEnv) => {
    if (newEnv === ENVIRONMENTS.LOCAL) {
      switchToLocalhost();
    } else {
      switchToProduction();
    }
    
    // Update state
    setCurrentEnv(newEnv);
    setCurrentConfig(ENV_CONFIG[newEnv]);
    
    // Reload the page to apply the new environment
    window.location.reload();
  };

  if (!currentConfig) {
    return (
      <div className="environment-switcher">
        <button className="env-toggle" disabled>
          🔄 Initializing...
        </button>
      </div>
    );
  }

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
  );
}

export default EnvironmentSwitcher 
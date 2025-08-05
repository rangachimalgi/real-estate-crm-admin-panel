import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateRole() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    screens: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Available screens for selection
  const availableScreens = [
    'Dashboard',
    'Leads', 
    'SiteVisits',
    'Properties',
    'Bookings',
    'Payments',
    'Chat',
    'SiteStaff',
    'Reports'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (error) setError('')
  }

  const handleScreenChange = (screen) => {
    setFormData(prev => ({
      ...prev,
      screens: prev.screens.includes(screen)
        ? prev.screens.filter(s => s !== screen)
        : [...prev.screens, screen]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.name.trim()) {
      setError('Role name is required')
      setLoading(false)
      return
    }

    if (formData.screens.length === 0) {
      setError('Please select at least one screen')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:8000/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create role')
      }

      // Redirect to roles list
      navigate('/roles')
    } catch (error) {
      console.error('Error creating role:', error)
      setError(error.message || 'Failed to create role')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Create New Role</h2>
        <button 
          onClick={() => navigate('/roles')} 
          className="back-button"
        >
          ← Back to Roles
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="role-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Role Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter role name"
              required
            />
          </div>

          <div className="form-group">
            <label>Screens</label>
            <div className="screens-grid">
              {availableScreens.map(screen => (
                <label key={screen} className="screen-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.screens.includes(screen)}
                    onChange={() => handleScreenChange(screen)}
                  />
                  <span className="checkmark"></span>
                  {screen}
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/roles')}
              className="cancel-button"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`submit-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Role'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateRole 
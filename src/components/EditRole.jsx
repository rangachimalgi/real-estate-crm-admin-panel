import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditRole() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    name: '',
    screens: []
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
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

  useEffect(() => {
    fetchRole()
  }, [id])

  const fetchRole = async () => {
    try {
      const response = await fetch(`http://localhost:8000/roles/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch role')
      }

      const role = await response.json()
      setFormData({
        name: role.name,
        screens: role.screens || []
      })
    } catch (error) {
      console.error('Error fetching role:', error)
      setError('Failed to load role')
    } finally {
      setLoading(false)
    }
  }

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
    setSaving(true)
    setError('')

    if (!formData.name.trim()) {
      setError('Role name is required')
      setSaving(false)
      return
    }

    if (formData.screens.length === 0) {
      setError('Please select at least one screen')
      setSaving(false)
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/roles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update role')
      }

      // Redirect to roles list
      navigate('/roles')
    } catch (error) {
      console.error('Error updating role:', error)
      setError(error.message || 'Failed to update role')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading role...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">{error}</div>
        <button 
          onClick={() => navigate('/roles')} 
          className="back-button"
        >
          ← Back to Roles
        </button>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Edit Role</h2>
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
              className={`submit-button ${saving ? 'loading' : ''}`}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditRole 
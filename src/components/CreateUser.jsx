import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateUser() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: ''
  })
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetchingRoles, setFetchingRoles] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      const response = await fetch('http://localhost:8000/roles', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch roles')
      }

      const data = await response.json()
      setRoles(data)
    } catch (error) {
      console.error('Error fetching roles:', error)
      setError('Failed to load roles')
    } finally {
      setFetchingRoles(false)
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.username.trim() || !formData.password.trim() || !formData.name.trim() || !formData.role) {
      setError('All fields are required')
      setLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('http://localhost:8000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create user')
      }

      // Show success message and redirect
      alert('User created successfully!')
      navigate('/roles')
    } catch (error) {
      console.error('Error creating user:', error)
      setError(error.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  if (fetchingRoles) {
    return (
      <div className="page-container">
        <div className="loading">Loading roles...</div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Create New User</h2>
        <button 
          onClick={() => navigate('/roles')} 
          className="back-button"
        >
          ← Back to Roles
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="user-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter password (min 6 characters)"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a role</option>
              {roles.map(role => (
                <option key={role._id} value={role._id}>
                  {role.name} - {role.screens.join(', ')}
                </option>
              ))}
            </select>
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
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateUser 
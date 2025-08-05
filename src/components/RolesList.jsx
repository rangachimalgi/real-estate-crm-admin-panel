import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

function RolesList() {
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
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
      setLoading(false)
    }
  }

  const handleDelete = async (roleId) => {
    if (!window.confirm('Are you sure you want to delete this role?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:8000/roles/${roleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete role')
      }

      // Remove the role from the list
      setRoles(roles.filter(role => role._id !== roleId))
    } catch (error) {
      console.error('Error deleting role:', error)
      alert('Failed to delete role')
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading roles...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Roles Management</h2>
        <Link to="/roles/create" className="add-button">
          ➕ Add Role
        </Link>
      </div>

      <div className="table-container">
        <table className="roles-table">
          <thead>
            <tr>
              <th>Role Name</th>
              <th>Screens</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map(role => (
              <tr key={role._id}>
                <td>{role.name}</td>
                <td>{role.screens.join(', ')}</td>
                <td className="actions">
                  <Link 
                    to={`/roles/${role._id}/edit`} 
                    className="action-button edit"
                  >
                    ✏️ Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(role._id)}
                    className="action-button delete"
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RolesList 
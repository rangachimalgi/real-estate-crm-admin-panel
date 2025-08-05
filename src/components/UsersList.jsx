import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiCall } from '../config/api'

function UsersList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const data = await apiCall('/users')
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }

    try {
      await apiCall(`/users/${userId}`, {
        method: 'DELETE'
      })

      // Remove the user from the list
      setUsers(users.filter(user => user._id !== userId))
    } catch (error) {
      console.error('Error deleting user:', error)
      alert('Failed to delete user')
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading users...</div>
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
        <h2>Users Management</h2>
        <Link to="/users/create" className="add-button">
          ➕ Add User
        </Link>
      </div>

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Full Name</th>
              <th>Role</th>
              <th>Screens</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.name}</td>
                <td>{user.role?.name || 'No Role'}</td>
                <td>{user.role?.screens?.join(', ') || 'No Screens'}</td>
                <td className="actions">
                  <button 
                    onClick={() => handleDelete(user._id)}
                    className="action-button delete"
                    disabled={user.role?.name === 'superadmin'}
                    title={user.role?.name === 'superadmin' ? 'Cannot delete super admin' : 'Delete user'}
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="empty-state">
          <p>No users found. Create your first user!</p>
          <Link to="/users/create" className="add-button">
            ➕ Add User
          </Link>
        </div>
      )}
    </div>
  )
}

export default UsersList 
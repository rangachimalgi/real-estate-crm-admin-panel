import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginScreen from './components/LoginScreen'
import Dashboard from './components/Dashboard'
import RolesList from './components/RolesList'
import CreateRole from './components/CreateRole'
import EditRole from './components/EditRole'
import CreateUser from './components/CreateUser'
import UsersList from './components/UsersList'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('adminToken')
    const userData = localStorage.getItem('adminUser')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        if (parsedUser.role === 'superadmin') {
          setIsAuthenticated(true)
          setUser(parsedUser)
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
      }
    }
  }, [])

  const handleLogin = (userData) => {
    setIsAuthenticated(true)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    setIsAuthenticated(false)
    setUser(null)
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <Router>
      <div className="app">
        <Dashboard user={user} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Navigate to="/roles" replace />} />
            <Route path="/roles" element={<RolesList />} />
            <Route path="/roles/create" element={<CreateRole />} />
            <Route path="/roles/:id/edit" element={<EditRole />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/create" element={<CreateUser />} />
          </Routes>
        </Dashboard>
      </div>
    </Router>
  )
}

export default App

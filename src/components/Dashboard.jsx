import { Link, useLocation } from 'react-router-dom'
import EnvironmentSwitcher from './EnvironmentSwitcher'

function Dashboard({ user, onLogout, children }) {
  const location = useLocation()

  const isActive = (path) => {
    return location.pathname.startsWith(path)
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1>Admin Panel</h1>
            <span className="user-info">Welcome, {user?.name || 'Super Admin'}</span>
          </div>
          <div className="header-right">
            <EnvironmentSwitcher />
            <button onClick={onLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <Link 
            to="/projects" 
            className={`nav-link ${isActive('/projects') ? 'active' : ''}`}
          >
            Projects Management
          </Link>
          <Link 
            to="/roles" 
            className={`nav-link ${isActive('/roles') ? 'active' : ''}`}
          >
            Roles Management
          </Link>
          <Link 
            to="/users" 
            className={`nav-link ${isActive('/users') ? 'active' : ''}`}
          >
            Users Management
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="main-content">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Dashboard 
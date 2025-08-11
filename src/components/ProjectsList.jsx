import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiCall } from '../config/api'

function ProjectsList() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    search: ''
  })

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const data = await apiCall('/projects')
      console.log('Projects API response:', data) // Debug log
      
      // Handle the actual API response structure
      if (data && Array.isArray(data.projects)) {
        setProjects(data.projects)
      } else if (Array.isArray(data)) {
        setProjects(data)
      } else if (data && Array.isArray(data.data)) {
        setProjects(data.data)
      } else {
        console.warn('Unexpected projects data format:', data)
        setProjects([])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
      setError('Failed to load projects. Please check your backend connection.')
      setProjects([])
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return
    }

    try {
      await apiCall(`/projects/${projectId}`, {
        method: 'DELETE'
      })

      // Remove the project from the list
      setProjects(prevProjects => 
        Array.isArray(prevProjects) ? prevProjects.filter(project => project._id !== projectId) : []
      )
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Failed to delete project')
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const filteredProjects = Array.isArray(projects) ? projects.filter(project => {
    const matchesStatus = !filters.status || project.status === filters.status
    const matchesType = !filters.type || project.type === filters.type
    const matchesSearch = !filters.search || 
      project.name?.toLowerCase().includes(filters.search.toLowerCase()) ||
      project.description?.toLowerCase().includes(filters.search.toLowerCase())
    
    return matchesStatus && matchesType && matchesSearch
  }) : []

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { color: 'green', text: 'Active' },
      'inactive': { color: 'gray', text: 'Inactive' },
      'draft': { color: 'yellow', text: 'Draft' },
      'completed': { color: 'blue', text: 'Completed' }
    }
    
    const config = statusConfig[status] || { color: 'gray', text: status }
    return (
      <span className={`status-badge ${config.color}`}>
        {config.text}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading projects...</div>
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
        <h2>Projects Management</h2>
        <Link to="/projects/create" className="add-button">
          ➕ Add Project
        </Link>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label htmlFor="search">Search</label>
            <input
              type="text"
              id="search"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search projects..."
            />
          </div>
          
          <div className="filter-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label htmlFor="type">Type</label>
            <select
              id="type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="mixed">Mixed Use</option>
              <option value="industrial">Industrial</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="projects-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Type</th>
              <th>Status</th>
              <th>Location</th>
              <th>Price Range</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map(project => (
              <tr key={project._id || project.id || Math.random()}>
                <td>
                  <div className="project-info">
                    {project.images && Array.isArray(project.images) && project.images.length > 0 && (
                      <img 
                        src={project.images[0].url || project.images[0]} 
                        alt={project.name || 'Project'}
                        className="project-thumbnail"
                      />
                    )}
                    <div>
                      <div className="project-name">{project.name || 'Unnamed Project'}</div>
                      <div className="project-description">
                        {project.description ? 
                          (project.description.length > 50 ? 
                            `${project.description.substring(0, 50)}...` : 
                            project.description
                          ) : 
                          'No description available'
                        }
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="type-badge">{project.type || 'Residential'}</span>
                </td>
                <td>{getStatusBadge(project.status || 'draft')}</td>
                <td>
                  {project.location ? 
                    `${project.location.city || ''} ${project.location.state || ''}`.trim() || 
                    project.location.address || 
                    'Location not specified'
                  : 'Location not specified'}
                </td>
                <td>
                  {project.price && project.price.min && project.price.max ? (
                    <span className="price-range">
                      ₹{project.price.min.toLocaleString()} - ₹{project.price.max.toLocaleString()}
                    </span>
                  ) : (
                    <span className="no-price">Not specified</span>
                  )}
                </td>
                <td className="actions">
                  <Link 
                    to={`/projects/${project._id || project.id}`} 
                    className="action-button view"
                    title="View Details"
                  >
                    👁️ View
                  </Link>
                  <Link 
                    to={`/projects/${project._id || project.id}/edit`} 
                    className="action-button edit"
                    title="Edit Project"
                  >
                    ✏️ Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(project._id || project.id)}
                    className="action-button delete"
                    title="Delete Project"
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredProjects.length === 0 && (
        <div className="empty-state">
          <p>No projects found. Create your first project!</p>
          <Link to="/projects/create" className="add-button">
            ➕ Add Project
          </Link>
        </div>
      )}
    </div>
  )
}

export default ProjectsList 
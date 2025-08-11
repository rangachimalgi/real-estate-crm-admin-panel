import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiCall } from '../config/api'

function ProjectDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [shareLink, setShareLink] = useState('')

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      const data = await apiCall(`/projects/${id}`)
      setProject(data)
    } catch (error) {
      console.error('Error fetching project:', error)
      setError('Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const generateShareLink = async () => {
    try {
      const response = await apiCall(`/projects/${id}/share`, {
        method: 'POST'
      })
      setShareLink(response.shareLink || response.publicLink)
    } catch (error) {
      console.error('Error generating share link:', error)
      alert('Failed to generate share link')
    }
  }

  const copyShareLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink)
      alert('Share link copied to clipboard!')
    }
  }

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
        <div className="loading">Loading project details...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">{error}</div>
        <button 
          onClick={() => navigate('/projects')} 
          className="back-button"
        >
          ← Back to Projects
        </button>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="page-container">
        <div className="error-message">Project not found</div>
        <button 
          onClick={() => navigate('/projects')} 
          className="back-button"
        >
          ← Back to Projects
        </button>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="header-left">
          <h2>{project.name}</h2>
          <div className="project-meta">
            {getStatusBadge(project.status)}
            <span className="type-badge">{project.type}</span>
            {project.isFeatured && <span className="featured-badge">⭐ Featured</span>}
          </div>
        </div>
        <div className="header-right">
          <button 
            onClick={() => navigate(`/projects/${id}/edit`)} 
            className="edit-button"
          >
            ✏️ Edit Project
          </button>
          <button 
            onClick={() => navigate('/projects')} 
            className="back-button"
          >
            ← Back to Projects
          </button>
        </div>
      </div>

      <div className="project-details">
        {/* Project Images */}
        {project.images && project.images.length > 0 && (
          <div className="project-images">
            <h3>Project Images</h3>
            <div className="image-gallery">
              {project.images.map((image, index) => (
                <div key={image._id || index} className="image-item">
                  <img src={image.url || image} alt={`${project.name} - Image ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="info-section">
          <h3>Basic Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Description</label>
              <p>{project.description}</p>
            </div>
            <div className="info-item">
              <label>Location</label>
              <p>
                {project.location ? 
                  `${project.location.address || ''}, ${project.location.city || ''}, ${project.location.state || ''} - ${project.location.pincode || ''}`.replace(/^,\s*/, '').replace(/,\s*$/, '')
                : 'Location not specified'}
              </p>
            </div>
            {project.price && (
              <div className="info-item">
                <label>Price Range</label>
                <p>₹{project.price.min.toLocaleString()} - ₹{project.price.max.toLocaleString()} {project.price.currency}</p>
              </div>
            )}
            {project.area && (
              <div className="info-item">
                <label>Area Range</label>
                <p>{project.area.min.toLocaleString()} - {project.area.max.toLocaleString()} {project.area.unit}</p>
              </div>
            )}
            {project.bedrooms && (
              <div className="info-item">
                <label>Bedrooms</label>
                <p>{project.bedrooms.min} - {project.bedrooms.max} BHK</p>
              </div>
            )}
          </div>
        </div>

        {/* Specifications */}
        {(project.area || project.bedrooms) && (
          <div className="info-section">
            <h3>Specifications</h3>
            <div className="info-grid">
              {project.area && (
                <div className="info-item">
                  <label>Area Range</label>
                  <p>{project.area.min.toLocaleString()} - {project.area.max.toLocaleString()} {project.area.unit}</p>
                </div>
              )}
              {project.bedrooms && (
                <div className="info-item">
                  <label>Bedroom Range</label>
                  <p>{project.bedrooms.min} - {project.bedrooms.max} BHK</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features & Amenities - Not in current data structure but keeping for future */}
        {(project.features && project.features.length > 0) || (project.amenities && project.amenities.length > 0) ? (
          <>
            {project.features && project.features.length > 0 && (
              <div className="info-section">
                <h3>Features</h3>
                <div className="features-grid">
                  {project.features.map((feature, index) => (
                    <span key={index} className="feature-tag">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {project.amenities && project.amenities.length > 0 && (
              <div className="info-section">
                <h3>Amenities</h3>
                <div className="amenities-grid">
                  {project.amenities.map((amenity, index) => (
                    <span key={index} className="amenity-tag">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}

        {/* Contact Information */}
        {project.contactInfo && (
          <div className="info-section">
            <h3>Contact Information</h3>
            <div className="info-grid">
              {project.contactInfo.phone && (
                <div className="info-item">
                  <label>Phone</label>
                  <p>
                    <a href={`tel:${project.contactInfo.phone}`}>
                      {project.contactInfo.phone}
                    </a>
                  </p>
                </div>
              )}
              {project.contactInfo.email && (
                <div className="info-item">
                  <label>Email</label>
                  <p>
                    <a href={`mailto:${project.contactInfo.email}`}>
                      {project.contactInfo.email}
                    </a>
                  </p>
                </div>
              )}
              {project.contactInfo.whatsapp && (
                <div className="info-item">
                  <label>WhatsApp</label>
                  <p>
                    <a href={`https://wa.me/${project.contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                      {project.contactInfo.whatsapp}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Project Videos */}
        {project.videos && project.videos.length > 0 && (
          <div className="info-section">
            <h3>Project Videos</h3>
            <div className="video-gallery">
              {project.videos.map((video, index) => (
                <div key={video._id || index} className="video-item">
                  <video controls>
                    <source src={video.url || video} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Project Documents */}
        {(project.brochures && project.brochures.length > 0) || 
         (project.layoutPlans && project.layoutPlans.length > 0) || 
         (project.approvalLetters && project.approvalLetters.length > 0) ? (
          <div className="info-section">
            <h3>Documents</h3>
            <div className="documents-list">
              {project.brochures && project.brochures.map((doc, index) => (
                <div key={doc._id || index} className="document-item">
                  <a href={doc.url || doc} target="_blank" rel="noopener noreferrer">
                    📄 Brochure {index + 1}
                  </a>
                </div>
              ))}
              {project.layoutPlans && project.layoutPlans.map((doc, index) => (
                <div key={doc._id || index} className="document-item">
                  <a href={doc.url || doc} target="_blank" rel="noopener noreferrer">
                    📋 Layout Plan {index + 1}
                  </a>
                </div>
              ))}
              {project.approvalLetters && project.approvalLetters.map((doc, index) => (
                <div key={doc._id || index} className="document-item">
                  <a href={doc.url || doc} target="_blank" rel="noopener noreferrer">
                    📜 Approval Letter {index + 1}
                  </a>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Share Link */}
        <div className="info-section">
          <h3>Share Project</h3>
          <div className="share-section">
            {project.publicLink ? (
              <div className="share-link-container">
                <input
                  type="text"
                  value={`${window.location.origin}/project/${project.publicLink}`}
                  readOnly
                  className="share-link-input"
                />
                <button onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/project/${project.publicLink}`)
                  alert('Share link copied to clipboard!')
                }} className="copy-button">
                  📋 Copy
                </button>
              </div>
            ) : (
              <div>
                <p>No public link available for this project.</p>
                <button onClick={generateShareLink} className="share-button">
                  🔗 Generate Share Link
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails 
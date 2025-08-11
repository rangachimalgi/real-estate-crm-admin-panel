import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { apiCall } from '../config/api'

function EditProject() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    status: 'draft',
    location: '',
    address: '',
    priceRange: {
      min: '',
      max: ''
    },
    features: [],
    amenities: [],
    specifications: {
      totalUnits: '',
      unitTypes: '',
      floorArea: '',
      parking: ''
    },
    contactInfo: {
      phone: '',
      email: '',
      website: ''
    },
    isFeatured: false,
    isPublic: false
  })
  
  const [files, setFiles] = useState({
    images: [],
    videos: [],
    documents: []
  })
  
  const [existingFiles, setExistingFiles] = useState({
    images: [],
    videos: [],
    documents: []
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Available options
  const projectTypes = [
    'residential',
    'commercial', 
    'mixed',
    'industrial'
  ]

  const projectStatuses = [
    'draft',
    'active',
    'inactive',
    'completed'
  ]

  const availableFeatures = [
    'Gym',
    'Swimming Pool',
    'Garden',
    'Security',
    'Parking',
    'Lift',
    'Power Backup',
    'Water Supply',
    'Internet',
    'Clubhouse'
  ]

  const availableAmenities = [
    'Shopping Center',
    'Hospital',
    'School',
    'Bank',
    'Restaurant',
    'Bus Stop',
    'Metro Station',
    'Airport',
    'Beach',
    'Park'
  ]

  useEffect(() => {
    fetchProject()
  }, [id])

  const fetchProject = async () => {
    try {
      const project = await apiCall(`/projects/${id}`)
      
      setFormData({
        name: project.name || '',
        description: project.description || '',
        type: project.type || '',
        status: project.status || 'draft',
        location: project.location || '',
        address: project.address || '',
        priceRange: {
          min: project.priceRange?.min || '',
          max: project.priceRange?.max || ''
        },
        features: project.features || [],
        amenities: project.amenities || [],
        specifications: {
          totalUnits: project.specifications?.totalUnits || '',
          unitTypes: project.specifications?.unitTypes || '',
          floorArea: project.specifications?.floorArea || '',
          parking: project.specifications?.parking || ''
        },
        contactInfo: {
          phone: project.contactInfo?.phone || '',
          email: project.contactInfo?.email || '',
          website: project.contactInfo?.website || ''
        },
        isFeatured: project.isFeatured || false,
        isPublic: project.isPublic || false
      })

      // Set existing files
      setExistingFiles({
        images: project.images || [],
        videos: project.videos || [],
        documents: project.documents || []
      })
    } catch (error) {
      console.error('Error fetching project:', error)
      setError('Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }))
    }
    
    if (error) setError('')
  }

  const handleFeatureChange = (feature) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleAmenityChange = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleFileChange = (e, fileType) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(prev => ({
      ...prev,
      [fileType]: [...prev[fileType], ...selectedFiles]
    }))
  }

  const removeFile = (fileType, index) => {
    setFiles(prev => ({
      ...prev,
      [fileType]: prev[fileType].filter((_, i) => i !== index)
    }))
  }

  const removeExistingFile = (fileType, index) => {
    setExistingFiles(prev => ({
      ...prev,
      [fileType]: prev[fileType].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Name and description are required')
      setSaving(false)
      return
    }

    try {
      // Create FormData for file upload
      const submitData = new FormData()
      
      // Add form data
      submitData.append('data', JSON.stringify({
        ...formData,
        existingFiles // Include existing files info
      }))
      
      // Add new files
      files.images.forEach(file => {
        submitData.append('images', file)
      })
      
      files.videos.forEach(file => {
        submitData.append('videos', file)
      })
      
      files.documents.forEach(file => {
        submitData.append('documents', file)
      })

      await apiCall(`/projects/${id}`, {
        method: 'PUT',
        body: submitData,
        headers: {
          // Don't set Content-Type, let browser set it with boundary for FormData
        }
      })

      // Show success message and redirect
      alert('Project updated successfully!')
      navigate('/projects')
    } catch (error) {
      console.error('Error updating project:', error)
      setError(error.message || 'Failed to update project')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading project...</div>
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

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Edit Project</h2>
        <button 
          onClick={() => navigate('/projects')} 
          className="back-button"
        >
          ← Back to Projects
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="project-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Project Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter project name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="type">Project Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="">Select project type</option>
                  {projectTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Enter project description"
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  {projectStatuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter location"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="address">Full Address</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter full address"
                rows="2"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="form-section">
            <h3>Pricing</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="priceRange.min">Minimum Price (₹)</label>
                <input
                  type="number"
                  id="priceRange.min"
                  name="priceRange.min"
                  value={formData.priceRange.min}
                  onChange={handleInputChange}
                  placeholder="Enter minimum price"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="priceRange.max">Maximum Price (₹)</label>
                <input
                  type="number"
                  id="priceRange.max"
                  name="priceRange.max"
                  value={formData.priceRange.max}
                  onChange={handleInputChange}
                  placeholder="Enter maximum price"
                />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="form-section">
            <h3>Specifications</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="specifications.totalUnits">Total Units</label>
                <input
                  type="number"
                  id="specifications.totalUnits"
                  name="specifications.totalUnits"
                  value={formData.specifications.totalUnits}
                  onChange={handleInputChange}
                  placeholder="Enter total units"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="specifications.unitTypes">Unit Types</label>
                <input
                  type="text"
                  id="specifications.unitTypes"
                  name="specifications.unitTypes"
                  value={formData.specifications.unitTypes}
                  onChange={handleInputChange}
                  placeholder="e.g., 1BHK, 2BHK, 3BHK"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="specifications.floorArea">Floor Area (sq ft)</label>
                <input
                  type="number"
                  id="specifications.floorArea"
                  name="specifications.floorArea"
                  value={formData.specifications.floorArea}
                  onChange={handleInputChange}
                  placeholder="Enter floor area"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="specifications.parking">Parking Spaces</label>
                <input
                  type="number"
                  id="specifications.parking"
                  name="specifications.parking"
                  value={formData.specifications.parking}
                  onChange={handleInputChange}
                  placeholder="Enter parking spaces"
                />
              </div>
            </div>
          </div>

          {/* Features & Amenities */}
          <div className="form-section">
            <h3>Features & Amenities</h3>
            
            <div className="checkbox-grid">
              <div className="checkbox-section">
                <h4>Features</h4>
                {availableFeatures.map(feature => (
                  <label key={feature} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureChange(feature)}
                    />
                    <span className="checkmark"></span>
                    {feature}
                  </label>
                ))}
              </div>
              
              <div className="checkbox-section">
                <h4>Amenities</h4>
                {availableAmenities.map(amenity => (
                  <label key={amenity} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                    />
                    <span className="checkmark"></span>
                    {amenity}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="form-section">
            <h3>Contact Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactInfo.phone">Phone</label>
                <input
                  type="tel"
                  id="contactInfo.phone"
                  name="contactInfo.phone"
                  value={formData.contactInfo.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="contactInfo.email">Email</label>
                <input
                  type="email"
                  id="contactInfo.email"
                  name="contactInfo.email"
                  value={formData.contactInfo.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="contactInfo.website">Website</label>
              <input
                type="url"
                id="contactInfo.website"
                name="contactInfo.website"
                value={formData.contactInfo.website}
                onChange={handleInputChange}
                placeholder="Enter website URL"
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="form-section">
            <h3>Media & Documents</h3>
            
            <div className="file-upload-section">
              {/* Existing Images */}
              {existingFiles.images.length > 0 && (
                <div className="file-group">
                  <label>Existing Images</label>
                  <div className="existing-files">
                    {existingFiles.images.map((file, index) => (
                      <div key={index} className="existing-file-item">
                        <img src={file} alt={`Project image ${index + 1}`} />
                        <button 
                          type="button" 
                          onClick={() => removeExistingFile('images', index)}
                          className="remove-file"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="file-group">
                <label htmlFor="images">Add New Images</label>
                <input
                  type="file"
                  id="images"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'images')}
                />
                <div className="file-list">
                  {files.images.map((file, index) => (
                    <div key={index} className="file-item">
                      <span>{file.name}</span>
                      <button 
                        type="button" 
                        onClick={() => removeFile('images', index)}
                        className="remove-file"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Existing Videos */}
              {existingFiles.videos.length > 0 && (
                <div className="file-group">
                  <label>Existing Videos</label>
                  <div className="existing-files">
                    {existingFiles.videos.map((file, index) => (
                      <div key={index} className="existing-file-item">
                        <video controls>
                          <source src={file} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <button 
                          type="button" 
                          onClick={() => removeExistingFile('videos', index)}
                          className="remove-file"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="file-group">
                <label htmlFor="videos">Add New Videos</label>
                <input
                  type="file"
                  id="videos"
                  multiple
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, 'videos')}
                />
                <div className="file-list">
                  {files.videos.map((file, index) => (
                    <div key={index} className="file-item">
                      <span>{file.name}</span>
                      <button 
                        type="button" 
                        onClick={() => removeFile('videos', index)}
                        className="remove-file"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Existing Documents */}
              {existingFiles.documents.length > 0 && (
                <div className="file-group">
                  <label>Existing Documents</label>
                  <div className="existing-files">
                    {existingFiles.documents.map((file, index) => (
                      <div key={index} className="existing-file-item">
                        <a href={file} target="_blank" rel="noopener noreferrer">
                          Document {index + 1}
                        </a>
                        <button 
                          type="button" 
                          onClick={() => removeExistingFile('documents', index)}
                          className="remove-file"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="file-group">
                <label htmlFor="documents">Add New Documents</label>
                <input
                  type="file"
                  id="documents"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange(e, 'documents')}
                />
                <div className="file-list">
                  {files.documents.map((file, index) => (
                    <div key={index} className="file-item">
                      <span>{file.name}</span>
                      <button 
                        type="button" 
                        onClick={() => removeFile('documents', index)}
                        className="remove-file"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="form-section">
            <h3>Settings</h3>
            
            <div className="checkbox-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Featured Project
              </label>
              
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                />
                <span className="checkmark"></span>
                Public Project
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/projects')}
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

export default EditProject 
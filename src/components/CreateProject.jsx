import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiCall } from '../config/api'

function CreateProject() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'draft',
    featured: false,
    isPublic: false,
    location: {
      address: '',
      city: '',
      state: '',
      pincode: ''
    },
    price: {
      min: '',
      max: '',
      currency: 'INR'
    },
    area: {
      min: '',
      max: '',
      unit: 'sqft'
    },
    bedrooms: {
      min: '',
      max: ''
    },
    contactInfo: {
      phone: '',
      email: '',
      whatsapp: ''
    }
  })
  
  const [files, setFiles] = useState({
    images: [],
    videos: [],
    documents: []
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Available options
  const projectStatuses = [
    'draft',
    'active',
    'inactive',
    'completed'
  ]

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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!formData.name.trim() || !formData.description.trim()) {
      setError('Name and description are required')
      setLoading(false)
      return
    }

    try {
      console.log('Submitting form data:', formData) 
      
      // Clean and prepare form data
      const cleanFormData = {
        name: formData.name,
        description: formData.description,
        status: formData.status,
        featured: formData.featured,
        isPublic: formData.isPublic,
        location: {
          address: formData.location.address,
          city: formData.location.city,
          state: formData.location.state,
          pincode: formData.location.pincode
        },
        price: {
          min: parseInt(formData.price.min) || 0,
          max: parseInt(formData.price.max) || 0,
          currency: formData.price.currency
        },
        area: {
          min: parseInt(formData.area.min) || 0,
          max: parseInt(formData.area.max) || 0,
          unit: formData.area.unit
        },
        bedrooms: {
          min: parseInt(formData.bedrooms.min) || 0,
          max: parseInt(formData.bedrooms.max) || 0
        },
        contactInfo: {
          phone: formData.contactInfo.phone,
          email: formData.contactInfo.email,
          whatsapp: formData.contactInfo.whatsapp
        }
      }
      
      console.log('Clean form data:', cleanFormData) // Debug log
      
      // Add type field if missing (EditProject has this)
      if (!cleanFormData.type) {
        cleanFormData.type = 'residential'
      }

            // Try sending as JSON first (no files)
      if (files.images.length === 0 && files.videos.length === 0 && files.documents.length === 0) {
        console.log('Sending as JSON (no files)')
        await apiCall('/projects', {
          method: 'POST',
          body: JSON.stringify(cleanFormData),
          headers: {
            'Content-Type': 'application/json'
          }
        })
      } else {
        console.log('Sending as FormData (with files)')
        
        // Create FormData and send individual fields (matching Postman format)
        const submitFormData = new FormData()
        
        // Send individual fields (not nested in data field)
        submitFormData.append('name', cleanFormData.name)
        submitFormData.append('description', cleanFormData.description)
        submitFormData.append('status', cleanFormData.status)
        submitFormData.append('featured', cleanFormData.featured.toString()) // Convert to string like Postman
        submitFormData.append('isPublic', cleanFormData.isPublic.toString()) // Convert to string like Postman
        
        // Send nested objects as JSON strings
        submitFormData.append('location', JSON.stringify(cleanFormData.location))
        submitFormData.append('price', JSON.stringify(cleanFormData.price))
        submitFormData.append('area', JSON.stringify(cleanFormData.area))
        submitFormData.append('bedrooms', JSON.stringify(cleanFormData.bedrooms))
        submitFormData.append('contactInfo', JSON.stringify(cleanFormData.contactInfo))
        
        // Add files with correct field names (matching Postman)
        files.images.forEach(file => {
          submitFormData.append('images', file)
        })
        
        files.videos.forEach(file => {
          submitFormData.append('videos', file)
        })
        
        // Split documents into different categories like Postman
        files.documents.forEach(file => {
          // You might want to add UI to categorize documents
          // For now, sending all as brochures
          submitFormData.append('brochures', file)
        })
        
        console.log('=== DEBUGGING FORM DATA ===')
        console.log('FormData entries:')
        for (let [key, value] of submitFormData.entries()) {
          console.log(`${key}:`, value)
        }
        
        console.log('=== COMPARISON WITH POSTMAN ===')
        console.log('Expected Postman format:')
        console.log('- name: "test project"')
        console.log('- description: "test project desc"')
        console.log('- status: "active"')
        console.log('- featured: "true"')
        console.log('- location: JSON string')
        console.log('- price: JSON string')
        console.log('- area: JSON string')
        console.log('- bedrooms: JSON string')
        console.log('- contactInfo: JSON string')
        console.log('- images: File')
        console.log('- videos: File')
        console.log('- brochures: File')
        
        console.log('=== OUR ACTUAL DATA ===')
        console.log('cleanFormData:', cleanFormData)
        console.log('Files count:', {
          images: files.images.length,
          videos: files.videos.length,
          documents: files.documents.length
        })
        
        console.log('=== SENDING REQUEST ===')
        console.log('URL: /projects')
        console.log('Method: POST')
        console.log('Body type: FormData')
        console.log('FormData size:', submitFormData.entries().length, 'entries')
        
        await apiCall('/projects', {
          method: 'POST',
          body: submitFormData,
          headers: {
            // Don't set Content-Type, let browser set it with boundary for FormData
          }
        })
      }

      // Show success message and redirect
      alert('Project created successfully!')
      navigate('/projects')
    } catch (error) {
      console.error('Error creating project:', error)
      setError(error.message || 'Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Create New Project</h2>
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
                <label htmlFor="location.address">Address</label>
                <input
                  type="text"
                  id="location.address"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  placeholder="Enter address"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location.city">City</label>
                <input
                  type="text"
                  id="location.city"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="location.state">State</label>
                <input
                  type="text"
                  id="location.state"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="location.pincode">Pincode</label>
                <input
                  type="text"
                  id="location.pincode"
                  name="location.pincode"
                  value={formData.location.pincode}
                  onChange={handleInputChange}
                  placeholder="Enter pincode"
                />
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="form-section">
            <h3>Pricing</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price.min">Minimum Price (₹)</label>
                <input
                  type="number"
                  id="price.min"
                  name="price.min"
                  value={formData.price.min}
                  onChange={handleInputChange}
                  placeholder="Enter minimum price"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="price.max">Maximum Price (₹)</label>
                <input
                  type="number"
                  id="price.max"
                  name="price.max"
                  value={formData.price.max}
                  onChange={handleInputChange}
                  placeholder="Enter maximum price"
                />
              </div>
            </div>
          </div>

          {/* Area & Bedrooms */}
          <div className="form-section">
            <h3>Area & Bedrooms</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="area.min">Minimum Area (sq ft)</label>
                <input
                  type="number"
                  id="area.min"
                  name="area.min"
                  value={formData.area.min}
                  onChange={handleInputChange}
                  placeholder="Enter minimum area"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="area.max">Maximum Area (sq ft)</label>
                <input
                  type="number"
                  id="area.max"
                  name="area.max"
                  value={formData.area.max}
                  onChange={handleInputChange}
                  placeholder="Enter maximum area"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bedrooms.min">Minimum Bedrooms</label>
                <input
                  type="number"
                  id="bedrooms.min"
                  name="bedrooms.min"
                  value={formData.bedrooms.min}
                  onChange={handleInputChange}
                  placeholder="Enter minimum bedrooms"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="bedrooms.max">Maximum Bedrooms</label>
                <input
                  type="number"
                  id="bedrooms.max"
                  name="bedrooms.max"
                  value={formData.bedrooms.max}
                  onChange={handleInputChange}
                  placeholder="Enter maximum bedrooms"
                />
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
              <label htmlFor="contactInfo.whatsapp">WhatsApp</label>
              <input
                type="tel"
                id="contactInfo.whatsapp"
                name="contactInfo.whatsapp"
                value={formData.contactInfo.whatsapp}
                onChange={handleInputChange}
                placeholder="Enter WhatsApp number"
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="form-section">
            <h3>Media & Documents</h3>
            
            <div className="file-upload-section">
              <div className="file-group">
                <label htmlFor="images">Project Images</label>
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

              <div className="file-group">
                <label htmlFor="videos">Project Videos</label>
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

              <div className="file-group">
                <label htmlFor="documents">Documents (Brochures, Plans, etc.)</label>
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
                  name="featured"
                  checked={formData.featured}
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
              className={`submit-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateProject 
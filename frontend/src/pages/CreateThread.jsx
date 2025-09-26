import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ButtonWithLoading, FormLoadingOverlay } from '../components/SkeletonLoader';

function CreateThread() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const errors = {};
    const valid = {};

    switch (name) {
      case 'title':
        if (!value.trim()) {
          errors.title = 'Thread title is required';
        } else if (value.trim().length < 5) {
          errors.title = 'Title must be at least 5 characters long';
        } else if (value.length > 200) {
          errors.title = 'Title must be less than 200 characters';
        } else {
          valid.title = true;
        }
        break;
      case 'description':
        if (!value.trim()) {
          errors.description = 'Description is required';
        } else if (value.trim().length < 20) {
          errors.description = 'Description must be at least 20 characters long';
        } else if (value.length > 1000) {
          errors.description = 'Description must be less than 1000 characters';
        } else {
          valid.description = true;
        }
        break;
      case 'tags':
        // Tags are optional, but if provided, validate format
        if (value.trim() && value.includes(',')) {
          const tagArray = value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
          if (tagArray.length > 10) {
            errors.tags = 'Maximum 10 tags allowed';
          } else if (tagArray.some(tag => tag.length > 30)) {
            errors.tags = 'Each tag must be less than 30 characters';
          } else {
            valid.tags = true;
          }
        } else if (value.trim() && !value.includes(',') && value.length <= 30) {
          valid.tags = true;
        } else if (value.trim() && value.length > 30) {
          errors.tags = 'Each tag must be less than 30 characters';
        }
        break;
    }

    return { errors, valid };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });

    // Real-time validation
    if (touched[name]) {
      const { errors, valid } = validateField(name, value);
      
      setFieldErrors(prev => ({
        ...prev,
        [name]: errors[name]
      }));
      
      setValidFields(prev => ({
        ...prev,
        [name]: valid[name] || false
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const { errors, valid } = validateField(name, value);
    
    setFieldErrors(prev => ({
      ...prev,
      [name]: errors[name]
    }));
    
    setValidFields(prev => ({
      ...prev,
      [name]: valid[name] || false
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate all fields before submission
    const allErrors = {};
    const allValid = {};
    
    Object.keys(formData).forEach(fieldName => {
      const { errors, valid } = validateField(fieldName, formData[fieldName]);
      if (errors[fieldName]) allErrors[fieldName] = errors[fieldName];
      if (valid[fieldName]) allValid[fieldName] = valid[fieldName];
    });

    setFieldErrors(allErrors);
    setValidFields(allValid);
    setTouched({ title: true, description: true, tags: true });

    // Check if there are any errors
    if (Object.keys(allErrors).length > 0) {
      setLoading(false);
      setError('Please fix the errors below before submitting.');
      return;
    }

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const response = await axios.post('/api/threads', {
        title: formData.title,
        description: formData.description,
        tags: tagsArray
      });

      navigate(`/threads/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create thread');
      console.error('Error creating thread:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" className="btn btn-secondary">
          ← Back to All Threads
        </Link>
      </div>

      <div className="page-header">
        <h1>Start a New Thread</h1>
        <p>Create a topic for community members to share their experiences and wisdom</p>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card" style={{ position: 'relative' }}>
        <FormLoadingOverlay isVisible={loading} message="Creating your thread..." />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Thread Title *</label>
            <div className="input-container">
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="What topic would you like people to share stories about? (e.g., Overcoming Career Challenges)"
                required
                maxLength="200"
                className={`form-input ${fieldErrors.title ? 'error' : ''} ${validFields.title ? 'valid' : ''}`}
              />
              {validFields.title && <div className="validation-icon valid">✓</div>}
            </div>
            {fieldErrors.title && <div className="error-message">{fieldErrors.title}</div>}
            <small className="field-hint">
              {formData.title.length}/200 characters • A clear, engaging title helps attract contributors
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <div className="input-container">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Provide context and guidance for contributors. What specific experiences, insights, or perspectives are you looking for? What should people know before sharing?"
                required
                maxLength="1000"
                rows="5"
                className={`form-input ${fieldErrors.description ? 'error' : ''} ${validFields.description ? 'valid' : ''}`}
              />
              {validFields.description && <div className="validation-icon valid">✓</div>}
            </div>
            {fieldErrors.description && <div className="error-message">{fieldErrors.description}</div>}
            <small className="field-hint">
              {formData.description.length}/1000 characters • Help contributors understand what kind of stories you're seeking
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (optional)</label>
            <div className="input-container">
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Add relevant keywords to help people discover your thread (e.g., career, resilience, family, travel)"
                className={`form-input ${fieldErrors.tags ? 'error' : ''} ${validFields.tags ? 'valid' : ''}`}
              />
              {validFields.tags && <div className="validation-icon valid">✓</div>}
            </div>
            {fieldErrors.tags && <div className="error-message">{fieldErrors.tags}</div>}
            <small className="field-hint">
              Separate multiple tags with commas • Maximum 10 tags, 30 characters each
            </small>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <ButtonWithLoading 
              type="submit" 
              className="btn" 
              loading={loading}
              loadingText="Creating Thread..."
            >
              Create Thread
            </ButtonWithLoading>
            <Link to="/" className="btn btn-secondary" style={{ marginLeft: '1rem' }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: '2rem', backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)' }}>
        <h3>Tips for Creating Great Threads</h3>
        <ul>
          <li>Choose a specific, focused topic that encourages personal stories</li>
          <li>Write a clear description that explains what kind of experiences you're looking for</li>
          <li>Use relevant tags to help people discover your thread</li>
          <li>Consider topics like: overcoming challenges, cultural traditions, career journeys, life lessons</li>
        </ul>
      </div>
    </div>
  );
}

export default CreateThread;

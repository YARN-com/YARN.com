import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ButtonWithLoading, FormLoadingOverlay, PageLoadingState } from '../components/SkeletonLoader';

function AddStrand() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [formData, setFormData] = useState({
    contributorName: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fetchError, setFetchError] = useState('');
  const [threadLoading, setThreadLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState({});
  const [validFields, setValidFields] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    fetchThread();
  }, [id]);

  const fetchThread = async () => {
    try {
      setThreadLoading(true);
      const response = await axios.get(`/api/threads/${id}`);
      setThread(response.data);
    } catch (err) {
      setFetchError('Failed to fetch thread data');
      console.error('Error fetching thread:', err);
    } finally {
      setThreadLoading(false);
    }
  };

  const validateField = (name, value) => {
    const errors = {};
    const valid = {};

    switch (name) {
      case 'contributorName':
        if (!value.trim()) {
          errors.contributorName = 'Your name is required';
        } else if (value.trim().length < 2) {
          errors.contributorName = 'Name must be at least 2 characters long';
        } else if (value.length > 100) {
          errors.contributorName = 'Name must be less than 100 characters';
        } else {
          valid.contributorName = true;
        }
        break;
      case 'content':
        if (!value.trim()) {
          errors.content = 'Your story is required';
        } else if (value.trim().length < 50) {
          errors.content = 'Story must be at least 50 characters long to provide meaningful content';
        } else if (value.length > 2000) {
          errors.content = 'Story must be less than 2000 characters';
        } else {
          valid.content = true;
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
    setTouched({ contributorName: true, content: true });

    // Check if there are any errors
    if (Object.keys(allErrors).length > 0) {
      setLoading(false);
      setError('Please fix the errors below before submitting.');
      return;
    }

    try {
      await axios.post('/api/strands', {
        threadId: id,
        contributorName: formData.contributorName,
        content: formData.content
      });

      navigate(`/threads/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add strand');
      console.error('Error adding strand:', err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchError) {
    return <div className="error">{fetchError}</div>;
  }

  if (threadLoading) {
    return <PageLoadingState message="Loading thread details..." />;
  }

  if (!thread) {
    return <div className="error">Thread not found</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link to={`/threads/${id}`} className="btn btn-secondary">
          ← Back to Thread
        </Link>
      </div>

      <div className="page-header">
        <h1>Add Your Story</h1>
        <p>Share your experience with: <strong>{thread.title}</strong></p>
      </div>

      <div className="card" style={{ marginBottom: '2rem', backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)' }}>
        <h3>Thread Description</h3>
        <p>{thread.description}</p>
        {thread.tags && thread.tags.length > 0 && (
          <div className="tags">
            {thread.tags.map((tag, index) => (
              <span key={index} className="tag">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card" style={{ position: 'relative' }}>
        <FormLoadingOverlay isVisible={loading} message="Adding your story..." />
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="contributorName">Your Name *</label>
            <div className="input-container">
              <input
                type="text"
                id="contributorName"
                name="contributorName"
                value={formData.contributorName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter the name you'd like to share your story under (e.g., Sarah, Anonymous, S.M.)"
                required
                maxLength="100"
                className={`form-input ${fieldErrors.contributorName ? 'error' : ''} ${validFields.contributorName ? 'valid' : ''}`}
              />
              {validFields.contributorName && <div className="validation-icon valid">✓</div>}
            </div>
            {fieldErrors.contributorName && <div className="error-message">{fieldErrors.contributorName}</div>}
            <small className="field-hint">
              {formData.contributorName.length}/100 characters • This is how your name will appear with your story
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="content">Your Story *</label>
            <div className="input-container">
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Share your personal experience, what you learned, how it changed you, or wisdom you gained. Be authentic and specific - your story could inspire or help someone facing a similar situation."
                required
                maxLength="2000"
                rows="8"
                className={`form-input ${fieldErrors.content ? 'error' : ''} ${validFields.content ? 'valid' : ''}`}
              />
              {validFields.content && <div className="validation-icon valid">✓</div>}
            </div>
            {fieldErrors.content && <div className="error-message">{fieldErrors.content}</div>}
            <small className="field-hint">
              {formData.content.length}/2000 characters • Share enough detail to make your story meaningful and helpful to others
            </small>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <ButtonWithLoading 
              type="submit" 
              className="btn" 
              loading={loading}
              loadingText="Adding Story..."
            >
              Add My Story
            </ButtonWithLoading>
            <Link 
              to={`/threads/${id}`} 
              className="btn btn-secondary" 
              style={{ marginLeft: '1rem' }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: '2rem', backgroundColor: 'var(--color-card-bg)', color: 'var(--color-text)' }}>
        <h3>Sharing Guidelines</h3>
        <ul>
          <li>Share authentic, personal experiences related to the thread topic</li>
          <li>Be respectful of others' perspectives and experiences</li>
          <li>Focus on what you learned or how the experience shaped you</li>
          <li>Consider how your story might help or inspire others</li>
        </ul>
      </div>
    </div>
  );
}

export default AddStrand;
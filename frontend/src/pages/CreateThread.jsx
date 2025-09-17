import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function CreateThread() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Thread Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Surviving Natural Disasters, First-Time Entrepreneur Stories"
              required
              maxLength="200"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe what kind of stories and experiences you'd like people to share..."
              required
              maxLength="1000"
              rows="5"
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags (optional)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              placeholder="disaster, resilience, community (separate with commas)"
            />
            <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
              Add relevant tags to help people find your thread
            </small>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Creating Thread...' : 'Create Thread'}
            </button>
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

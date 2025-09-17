import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

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

  useEffect(() => {
    fetchThread();
  }, [id]);

  const fetchThread = async () => {
    try {
      const response = await axios.get(`/api/threads/${id}`);
      setThread(response.data);
    } catch (err) {
      setFetchError('Failed to fetch thread data');
      console.error('Error fetching thread:', err);
    }
  };

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

  if (!thread) {
    return <div className="loading">Loading thread...</div>;
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

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="contributorName">Your Name *</label>
            <input
              type="text"
              id="contributorName"
              name="contributorName"
              value={formData.contributorName}
              onChange={handleChange}
              placeholder="How would you like to be identified?"
              required
              maxLength="100"
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">Your Story *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Share your experience, wisdom, or perspective on this topic..."
              required
              maxLength="2000"
              rows="8"
            />
            <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
              {2000 - formData.content.length} characters remaining
            </small>
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button type="submit" className="btn" disabled={loading}>
              {loading ? 'Adding Story...' : 'Add My Story'}
            </button>
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

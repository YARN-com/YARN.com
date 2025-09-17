import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function ThreadView() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [strands, setStrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchThreadAndStrands();
  }, [id]);

  const fetchThreadAndStrands = async () => {
    try {
      const [threadResponse, strandsResponse] = await Promise.all([
        axios.get(`/api/threads/${id}`),
        axios.get(`/api/strands/thread/${id}`)
      ]);

      setThread(threadResponse.data);
      setStrands(strandsResponse.data);
    } catch (err) {
      setError('Failed to fetch thread data');
      console.error('Error fetching thread data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <div className="loading">Loading thread...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!thread) {
    return <div className="error">Thread not found</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" className="btn btn-secondary">
           Back to All Threads
        </Link>
      </div>

      <div className="card">
        <h1 style={{ color: 'var(--color-header)' }}>{thread.title}</h1>
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
        <div className="thread-meta">
          Created on {formatDate(thread.createdAt)}
        </div>
        <div style={{ marginTop: '1rem' }}>
          <Link to={`/threads/${id}/add-strand`} className="btn">
            Add Your Story to This Thread
          </Link>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Community Stories ({strands.length})</h2>

        {strands.length === 0 ? (
          <div className="card">
            <p>No stories have been shared yet. Be the first to contribute!</p>
            <Link to={`/threads/${id}/add-strand`} className="btn">
              Share Your Story
            </Link>
          </div>
        ) : (
          <div>
            {strands.map((strand) => (
              <div key={strand._id} className="card strand">
                <div className="strand-meta">
                  <strong>{strand.contributorName}</strong> shared on {formatDate(strand.createdAt)}
                </div>
                <div className="strand-content">
                  {strand.content.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ThreadView;

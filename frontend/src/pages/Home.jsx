import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    try {
      const response = await axios.get('/api/threads');
      setThreads(response.data);
    } catch (err) {
      setError('Failed to fetch threads');
      console.error('Error fetching threads:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="loading">Loading threads...</div>;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Community Story Threads</h1>
        <p>Discover and contribute to threads that preserve our collective wisdom and experiences</p>
      </div>

      {error && <div className="error">{error}</div>}

      <div style={{ marginBottom: '2rem' }}>
        <Link to="/create-thread" className="btn">
          Start a New Thread
        </Link>
      </div>

      {threads.length === 0 ? (
        <div className="card">
          <h3>No threads yet</h3>
          <p>Be the first to start a community story thread!</p>
          <Link to="/create-thread" className="btn">
            Create the First Thread
          </Link>
        </div>
      ) : (
        <div>
          {threads.map((thread) => (
            <div key={thread._id} className="card">
              <h2>
                <Link
                  to={`/threads/${thread._id}`}
                  style={{ color: 'var(--color-header)', textDecoration: 'none' }}
                >
                  {thread.title}
                </Link>
              </h2>
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
                <Link to={`/threads/${thread._id}`} className="btn">
                  View Thread
                </Link>
                <Link
                  to={`/threads/${thread._id}/add-strand`}
                  className="btn btn-secondary"
                  style={{ marginLeft: '1rem' }}
                >
                  Add Your Story
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;

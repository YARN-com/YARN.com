import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ThreadsGridSkeleton } from '../components/SkeletonLoader';

function Home() {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchThreads();
  }, [retryCount]);

  const fetchThreads = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get('/api/threads');
      setThreads(response.data);
    } catch (err) {
      setError('Failed to fetch threads');
      console.error('Error fetching threads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div>
        <div className="page-header">
          <h1>Community Story Threads</h1>
          <p>Discover and contribute to threads that preserve our collective wisdom and experiences</p>
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <Link to="/create-thread" className="btn">
            Start a New Thread
          </Link>
        </div>

        <ThreadsGridSkeleton count={6} />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Community Story Threads</h1>
        <p>Discover and contribute to threads that preserve our collective wisdom and experiences</p>
      </div>

      {error && (
        <div className="error">
          {error}
          <button 
            onClick={handleRetry} 
            className="btn btn-secondary" 
            style={{ marginLeft: '1rem', padding: '0.5rem 1rem' }}
          >
            Try Again
          </button>
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <Link to="/create-thread" className="btn">
          Start a New Thread
        </Link>
      </div>

      {threads.length === 0 ? (
        <div className="card empty-state">
          <div className="empty-state-content">
            <h3>No threads yet</h3>
            <p>Be the first to start a community story thread!</p>
            <Link to="/create-thread" className="btn">
              Create the First Thread
            </Link>
          </div>
        </div>
      ) : (
        <div className="threads-grid loaded-content">
          {threads.map((thread, index) => (
            <div key={thread._id} className={`card thread-card content-fade-in`} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="thread-header">
                <h2 className="thread-title">
                  <Link 
                    to={`/threads/${thread._id}`}
                    className="thread-title-link"
                  >
                    {thread.title}
                  </Link>
                </h2>
                <div className="thread-meta">
                  <span className="thread-date">
                    Created on {formatDate(thread.createdAt)}
                  </span>
                </div>
              </div>
              
              <div className="thread-body">
                <p className="thread-description">{thread.description}</p>
                
                {thread.tags && thread.tags.length > 0 && (
                  <div className="thread-tags">
                    {thread.tags.map((tag, index) => (
                      <span key={index} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="thread-actions">
                <Link to={`/threads/${thread._id}`} className="btn btn-primary">
                  View Thread
                </Link>
                <Link
                  to={`/threads/${thread._id}/add-strand`}
                  className="btn btn-secondary"
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
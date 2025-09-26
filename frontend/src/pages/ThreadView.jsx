import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ThreadDetailSkeleton, StrandsListSkeleton } from '../components/SkeletonLoader';

function ThreadView() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [strands, setStrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchThreadAndStrands();
  }, [id, retryCount]);

  const fetchThreadAndStrands = async () => {
    try {
      setLoading(true);
      setError('');
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

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
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
    return (
      <div>
        <div style={{ marginBottom: '2rem' }}>
          <Link to="/" className="btn btn-secondary">
            ← Back to All Threads
          </Link>
        </div>

        <ThreadDetailSkeleton />

        <div className="strands-section">
          <div className="section-header">
            <h2 className="strands-title">Community Stories</h2>
            <span className="strand-count">(...)</span>
          </div>
          
          <StrandsListSkeleton count={3} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
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
    );
  }

  if (!thread) {
    return <div className="error">Thread not found</div>;
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" className="btn btn-secondary">
          ← Back to All Threads
        </Link>
      </div>

      <div className="card content-fade-in">
        <h1>{thread.title}</h1>
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

      <div className="strands-section">
        <div className="section-header">
          <h2 className="strands-title">Community Stories</h2>
          <span className="strand-count">({strands.length})</span>
        </div>
        
        {strands.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-state-content">
              <p>No stories have been shared yet. Be the first to contribute!</p>
              <Link to={`/threads/${id}/add-strand`} className="btn">
                Share Your Story
              </Link>
            </div>
          </div>
        ) : (
          <div className="strands-container loaded-content">
            {strands.map((strand, index) => (
              <div key={strand._id} className={`card strand-card content-fade-in`} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="strand-header">
                  <div className="strand-contributor">
                    <span className="contributor-name">{strand.contributorName}</span>
                    <span className="contribution-label">shared their story</span>
                  </div>
                  <div className="strand-timestamp">
                    {formatDate(strand.createdAt)}
                  </div>
                </div>
                
                <div className="strand-separator"></div>
                
                <div className="strand-content">
                  {strand.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="strand-paragraph">{paragraph}</p>
                  ))}
                </div>
                
                <div className="strand-number">
                  Story #{index + 1}
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
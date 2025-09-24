import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './SkeletonLoader.css';

// Base skeleton component for common animations
export function SkeletonBase({ className = '', style = {} }) {
  return (
    <div 
      className={`skeleton-base ${className}`}
      style={style}
    />
  );
}

// Loading spinner component
export function LoadingSpinner({ size = 'medium', color = 'primary' }) {
  const sizeClasses = {
    small: 'spinner-small',
    medium: 'spinner-medium',
    large: 'spinner-large'
  };
  
  const colorClasses = {
    primary: 'spinner-primary',
    secondary: 'spinner-secondary',
    white: 'spinner-white'
  };

  return (
    <div className={`loading-spinner ${sizeClasses[size]} ${colorClasses[color]}`}>
      <div className="spinner-circle"></div>
    </div>
  );
}

// Thread card skeleton
export function ThreadCardSkeleton() {
  return (
    <div className="card thread-card skeleton-card">
      <div className="thread-header">
        <div className="skeleton-thread-title">
          <SkeletonBase style={{ width: '75%', height: '1.5rem', marginBottom: '0.5rem' }} />
          <SkeletonBase style={{ width: '45%', height: '0.875rem' }} />
        </div>
        <div className="thread-meta">
          <SkeletonBase style={{ width: '120px', height: '0.875rem' }} />
        </div>
      </div>
      
      <div className="thread-body">
        <div className="skeleton-description">
          <SkeletonBase style={{ width: '100%', height: '1rem', marginBottom: '0.5rem' }} />
          <SkeletonBase style={{ width: '100%', height: '1rem', marginBottom: '0.5rem' }} />
          <SkeletonBase style={{ width: '80%', height: '1rem', marginBottom: '1rem' }} />
        </div>
        
        <div className="skeleton-tags">
          <SkeletonBase style={{ width: '60px', height: '1.5rem', borderRadius: '16px', marginRight: '0.5rem' }} />
          <SkeletonBase style={{ width: '80px', height: '1.5rem', borderRadius: '16px', marginRight: '0.5rem' }} />
          <SkeletonBase style={{ width: '70px', height: '1.5rem', borderRadius: '16px' }} />
        </div>
      </div>

      <div className="thread-actions">
        <SkeletonBase style={{ width: '100px', height: '2.5rem', borderRadius: '8px', marginRight: '0.75rem' }} />
        <SkeletonBase style={{ width: '120px', height: '2.5rem', borderRadius: '8px' }} />
      </div>
    </div>
  );
}

// Strand card skeleton
export function StrandCardSkeleton() {
  return (
    <div className="card strand-card skeleton-card">
      <div className="strand-header">
        <div className="strand-contributor">
          <SkeletonBase style={{ width: '140px', height: '1.125rem', marginBottom: '0.25rem' }} />
          <SkeletonBase style={{ width: '100px', height: '0.875rem' }} />
        </div>
        <div className="strand-timestamp">
          <SkeletonBase style={{ width: '160px', height: '0.875rem' }} />
        </div>
      </div>
      
      <div className="strand-separator"></div>
      
      <div className="strand-content">
        <div className="skeleton-content">
          <SkeletonBase style={{ width: '100%', height: '1rem', marginBottom: '1rem' }} />
          <SkeletonBase style={{ width: '100%', height: '1rem', marginBottom: '1rem' }} />
          <SkeletonBase style={{ width: '100%', height: '1rem', marginBottom: '1rem' }} />
          <SkeletonBase style={{ width: '85%', height: '1rem', marginBottom: '1rem' }} />
          <SkeletonBase style={{ width: '90%', height: '1rem' }} />
        </div>
      </div>
      
      <div className="strand-number skeleton-badge">
        <SkeletonBase style={{ width: '60px', height: '1rem', borderRadius: '12px' }} />
      </div>
    </div>
  );
}

// Grid skeleton for multiple items
export function ThreadsGridSkeleton({ count = 3 }) {
  return (
    <div className="threads-grid">
      {Array.from({ length: count }, (_, index) => (
        <ThreadCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function StrandsListSkeleton({ count = 2 }) {
  return (
    <div className="strands-container">
      {Array.from({ length: count }, (_, index) => (
        <StrandCardSkeleton key={index} />
      ))}
    </div>
  );
}

// Thread detail skeleton
export function ThreadDetailSkeleton() {
  return (
    <div className="card skeleton-card">
      <SkeletonBase style={{ width: '80%', height: '2rem', marginBottom: '1rem' }} />
      <div className="skeleton-description">
        <SkeletonBase style={{ width: '100%', height: '1rem', marginBottom: '0.5rem' }} />
        <SkeletonBase style={{ width: '100%', height: '1rem', marginBottom: '0.5rem' }} />
        <SkeletonBase style={{ width: '70%', height: '1rem', marginBottom: '1rem' }} />
      </div>
      
      <div className="skeleton-tags">
        <SkeletonBase style={{ width: '60px', height: '1.5rem', borderRadius: '16px', marginRight: '0.5rem' }} />
        <SkeletonBase style={{ width: '80px', height: '1.5rem', borderRadius: '16px', marginRight: '0.5rem' }} />
        <SkeletonBase style={{ width: '70px', height: '1.5rem', borderRadius: '16px' }} />
      </div>

      <div className="thread-meta" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <SkeletonBase style={{ width: '180px', height: '0.875rem' }} />
      </div>

      <SkeletonBase style={{ width: '200px', height: '2.5rem', borderRadius: '8px' }} />
    </div>
  );
}

// Button loading state
export function ButtonWithLoading({ loading, children, loadingText, ...props }) {
  return (
    <button {...props} disabled={loading || props.disabled}>
      {loading ? (
        <div className="btn-loading-content">
          <LoadingSpinner size="small" color="white" />
          <span>{loadingText || 'Loading...'}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
}

// Form loading overlay
export function FormLoadingOverlay({ isVisible, message = 'Submitting...' }) {
  if (!isVisible) return null;

  return (
    <div className="form-loading-overlay">
      <div className="form-loading-content">
        <LoadingSpinner size="large" color="primary" />
        <p className="form-loading-message">{message}</p>
      </div>
    </div>
  );
}

// Page loading state
export function PageLoadingState({ message = 'Loading...', showSpinner = true }) {
  return (
    <div className="page-loading-state">
      {showSpinner && <LoadingSpinner size="large" color="primary" />}
      <p className="page-loading-message">{message}</p>
    </div>
  );
}

// Loading progress bar for page transitions
export function LoadingProgressBar({ isVisible = true }) {
  if (!isVisible) return null;
  
  return (
    <div className="loading-progress">
      <div className="loading-progress-bar"></div>
    </div>
  );
}

// Enhanced empty state with optional loading
export function EmptyStateCard({ 
  title, 
  description, 
  actionText, 
  actionLink, 
  icon = "🎯",
  loading = false 
}) {
  if (loading) {
    return (
      <div className="card empty-state skeleton-card">
        <SkeletonBase style={{ width: '60%', height: '1.5rem', marginBottom: '1rem' }} />
        <SkeletonBase style={{ width: '80%', height: '1rem', marginBottom: '1.5rem' }} />
        <SkeletonBase style={{ width: '140px', height: '2.5rem', borderRadius: '8px' }} />
      </div>
    );
  }

  return (
    <div className="card empty-state content-fade-in">
      <div className="empty-state-content">
        <div className="empty-state-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{description}</p>
        {actionText && actionLink && (
          <Link to={actionLink} className="btn">
            {actionText}
          </Link>
        )}
      </div>
    </div>
  );
}

// Higher-order component for loading states
export function withLoadingState(WrappedComponent, LoadingComponent) {
  return function LoadingWrapper(props) {
    const { loading, ...restProps } = props;
    
    if (loading) {
      return <LoadingComponent {...restProps} />;
    }
    
    return <WrappedComponent {...restProps} />;
  };
}

// Smooth transition wrapper
export function SmoothTransition({ loading, children, fallback, duration = 300 }) {
  const [isVisible, setIsVisible] = useState(!loading);
  const [showFallback, setShowFallback] = useState(loading);

  useEffect(() => {
    if (loading) {
      setIsVisible(false);
      setTimeout(() => setShowFallback(true), duration / 2);
    } else {
      setShowFallback(false);
      setTimeout(() => setIsVisible(true), duration / 2);
    }
  }, [loading, duration]);

  if (showFallback) {
    return <div className={`transition-wrapper ${!loading ? 'content-fade-in' : ''}`}>{fallback}</div>;
  }

  return (
    <div className={`transition-wrapper ${isVisible ? 'content-fade-in' : ''}`}>
      {children}
    </div>
  );
}
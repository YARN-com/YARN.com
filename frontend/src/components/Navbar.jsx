
import { Link } from 'react-router-dom';

function Navbar({ theme, toggleTheme }) {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <h1>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              YARN.com
            </Link>
          </h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/create-thread">Create Thread</Link>
          </nav>
          <button
            className="btn btn-secondary"
            style={{ marginLeft: '1rem' }}
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ThreadView from './pages/ThreadView';
import CreateThread from './pages/CreateThread';
import AddStrand from './pages/AddStrand';


function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <Router>
      <div className="App">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <main className="main-content">
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/threads/:id" element={<ThreadView />} />
              <Route path="/create-thread" element={<CreateThread />} />
              <Route path="/threads/:id/add-strand" element={<AddStrand />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;

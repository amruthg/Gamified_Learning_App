import { Link } from 'react-router-dom';
import '../styles/header.css';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook
export default function Header({ isLoggedIn }) {

  const logout = async () => {
    try {
      await axios.post('/api/users/logout');
      setUser(null);
      localStorage.removeItem('userInfo');
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };
  

  const handleLogout = async () => {
    await logout();
  };
  return (
    <header className='header'>
      <svg className="title-img" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M44 4H30.6666V17.3334H17.3334V30.6666H4V44H44V4Z" fill="currentColor"></path>
      </svg>
      <h2 className="web-title">PixelSpeak</h2>

      {/* Conditionally render buttons if logged in */}
      {isLoggedIn && (
        <div className="header-buttons">
          <Link to="/language">
            <button className="choose-language-button">Choose Language</button>
          </Link>
          <Link to="/">
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </Link>
        </div>
      )}
    </header>
  );
}

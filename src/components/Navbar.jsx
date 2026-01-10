import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="logo-container">
          <img src="/ApexGPS_logo.png" alt="ApexGPS Logo" className="logo-img" />
        </Link>
      </div>

      <div className="navbar-right">
        <Link to="/">Home</Link>
        <Link to="/planner">Planner</Link>
        <Link to="/tour">Tour</Link>
        <Link to="/altro">Altro</Link>
        <Link to="/login" className="login-btn">
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

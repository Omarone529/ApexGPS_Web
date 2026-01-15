import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 flex justify-between items-center py-6 px-16 bg-transparent z-50">
      <div>
        <Link to="/" className="flex items-center gap-3 -ml-20">
          <img src="/ApexGPS_logo.png" alt="ApexGPS Logo" className="h-32 w-auto -my-14 " />
        </Link>
      </div>

      <div className="flex items-center gap-8">
        <Link className="text-white text-sm tracking-[1px] opacity-85 hover:opacity-100" to="/">
          Home
        </Link>
        <Link
          className="text-white text-sm tracking-[1px] opacity-85 hover:opacity-100"
          to="/planner"
        >
          Planner
        </Link>
        <Link className="text-white text-sm tracking-[1px] opacity-85 hover:opacity-100" to="/tour">
          Tour
        </Link>
        <Link
          className="text-white text-sm tracking-[1px] opacity-85 hover:opacity-100"
          to="/altro"
        >
          Altro
        </Link>
        <Link
          to="/login"
          className="text-white text-sm tracking-[1px] opacity-85 py-2 px-4.5
                                     border border-white/60 rounded-full hover:opacity-100"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;

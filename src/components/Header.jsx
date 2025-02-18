import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role"); 
    navigate("/login");
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="text-2xl font-bold">i`l neora</div>
      <nav className="space-x-4">
        <Link to="/" className="hover:text-gray-400">Inicio</Link>
        {token ? (
          <>
            {role === 'admin' && ( 
              <Link to="/dashboard" className="hover:text-gray-400">Dashboard</Link>
            )}
            <button onClick={handleLogout} className="hover:text-gray-400">Logout</button>
          </>
        ) : (
          <Link to="/login" className="hover:text-gray-400">Login</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;
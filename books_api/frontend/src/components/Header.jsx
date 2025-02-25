import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="w-full bg-gray-800 text-white py-4 px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
      <h2 className="text-xl font-semibold cursor-pointer" onClick={() => navigate("/")}>MyBiBlioteca</h2>
      <div>
        {user ? (
          <>
            <button 
              className="px-4 py-2 bg-gray-700 text-white rounded-lg mr-4 hover:bg-gray-600"
              onClick={() => navigate('/profile')}
            >
              Profile
            </button>
            <button 
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              onClick={logout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button 
              className="px-4 py-2 bg-gray-700 text-white rounded-lg mr-4 hover:bg-gray-600"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

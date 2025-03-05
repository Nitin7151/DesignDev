import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, LogOut } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isLoggedIn = localStorage.getItem('token') !== null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/80 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 text-xl font-bold">DesignDev</span>
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                >
                  About
                </Link>
              </div>
              
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/profile"
                    className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-300"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-all duration-300"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-gray-800/80 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-blue-400 focus:outline-none transition-all duration-300"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="text-gray-300 hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-gray-300 hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
            >
              About
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-700">
            {isLoggedIn ? (
              <div className="px-2 space-y-1">
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium flex items-center transition-all duration-300"
                >
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-blue-400 block w-full text-left px-3 py-2 rounded-md text-base font-medium flex items-center transition-all duration-300"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-2 space-y-1">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-blue-400 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 shadow-md"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
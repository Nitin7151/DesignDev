import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="text-2xl font-bold text-white">Design Dev</div>
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/features" className="text-gray-300 hover:text-white transition-colors">
            Features
          </Link>
          <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
            Contact
          </Link>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-300 focus:outline-none">
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 pt-2 pb-4 space-y-2">
          <Link to="/" className="block text-gray-300 hover:text-white transition-colors">
            Home
          </Link>
          <Link to="/features" className="block text-gray-300 hover:text-white transition-colors">
            Features
          </Link>
          <Link to="/contact" className="block text-gray-300 hover:text-white transition-colors">
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;

import React from 'react';

export function Footer() {
  return (
    <footer className="bg-gray-800 py-6">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} Design Dev. All rights reserved.
        </p>
        <div className="mt-4 md:mt-0">
          <a href="#" className="text-gray-400 hover:text-white mx-2">
            Privacy
          </a>
          <a href="#" className="text-gray-400 hover:text-white mx-2">
            Terms
          </a>
          <a href="#" className="text-gray-400 hover:text-white mx-2">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

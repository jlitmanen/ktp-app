import React, { useState } from "react";
import { Link } from "react-router-dom";

const Layout = ({ children, isAuthenticated, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdminDropdownOpen, setIsAdminDropdownOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-alabaster_grey font-sans">
      <nav className="bg-prussian_blue text-white shadow-md fixed w-full z-10 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 font-bold text-xl text-orange hover:text-orange-600 transition-colors">
                KTP - {new Date().getFullYear()}
              </Link>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link to="/ranking" className="hover:bg-prussian_blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Ranking</Link>
                  <Link to="/results/1" className="hover:bg-prussian_blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Matches</Link>
                  <Link to="/open" className="hover:bg-prussian_blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">Opens</Link>
                  <Link to="/about" className="hover:bg-prussian_blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</Link>
                  
                  {isAuthenticated && (
                    <div className="relative inline-block text-left">
                      <button 
                        onClick={() => setIsAdminDropdownOpen(!isAdminDropdownOpen)}
                        className="hover:bg-prussian_blue-600 px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors"
                      >
                        Admin tools
                        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="Wait, let's just use a simple caret" />
                          <path d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {isAdminDropdownOpen && (
                        <div className="origin-top-right absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
                          <div className="py-1">
                            <Link to="/admin/ranking" className="block px-4 py-2 text-sm text-black hover:bg-alabaster_grey-600" onClick={() => setIsAdminDropdownOpen(false)}>Edit players</Link>
                            <Link to="/admin/results" className="block px-4 py-2 text-sm text-black hover:bg-alabaster_grey-600" onClick={() => setIsAdminDropdownOpen(false)}>Edit results</Link>
                            <Link to="/admin/opens" className="block px-4 py-2 text-sm text-black hover:bg-alabaster_grey-600" onClick={() => setIsAdminDropdownOpen(false)}>Edit opens</Link>
                            <Link to="/admin/about" className="block px-4 py-2 text-sm text-black hover:bg-alabaster_grey-600" onClick={() => setIsAdminDropdownOpen(false)}>Edit content</Link>
                            <hr className="my-1 border-alabaster_grey" />
                            <button onClick={() => { onLogout(); setIsAdminDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-alabaster_grey-600">Logout</button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {!isAuthenticated && (
                  <Link to="/login" className="bg-orange text-prussian_blue hover:bg-orange-600 px-4 py-2 rounded-md text-sm font-bold transition-colors">
                    Login
                  </Link>
                )}
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-prussian_blue inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-prussian_blue-600 focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {!isMenuOpen ? (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-prussian_blue-400 border-t border-prussian_blue-600">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/ranking" className="block hover:bg-prussian_blue-600 px-3 py-2 rounded-md text-base font-medium">Ranking</Link>
              <Link to="/results/1" className="block hover:bg-prussian_blue-600 px-3 py-2 rounded-md text-base font-medium">Matches</Link>
              <Link to="/open" className="block hover:bg-prussian_blue-600 px-3 py-2 rounded-md text-base font-medium">Opens</Link>
              <Link to="/about" className="block hover:bg-prussian_blue-600 px-3 py-2 rounded-md text-base font-medium">About</Link>
              {!isAuthenticated && (
                <Link to="/login" className="block bg-orange text-prussian_blue px-3 py-2 rounded-md text-base font-bold">Login</Link>
              )}
              {isAuthenticated && (
                <>
                  <div className="border-t border-prussian_blue-600 my-2"></div>
                  <Link to="/admin/ranking" className="block hover:bg-prussian_blue-600 px-3 py-2 rounded-md text-base font-medium">Edit players</Link>
                  <Link to="/admin/results" className="block hover:bg-prussian_blue-600 px-3 py-2 rounded-md text-base font-medium">Edit results</Link>
                  <Link to="/admin/opens" className="block hover:bg-prussian_blue-600 px-3 py-2 rounded-md text-base font-medium">Edit opens</Link>
                  <Link to="/admin/about" className="block hover:bg-prussian_blue-600 px-3 py-2 rounded-md text-base font-medium">Edit content</Link>
                  <button onClick={onLogout} className="block w-full text-left hover:bg-prussian_blue-600 px-3 py-2 rounded-md text-base font-medium text-red-400">Logout</button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="mt-16 flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow-xl rounded-lg overflow-hidden p-6 border border-alabaster_grey-400">
              {children}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-prussian_blue text-alabaster_grey-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} ktp (ei se kotkalainen)
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

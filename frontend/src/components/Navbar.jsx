import { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { AppContext } from "../context/AppContext";
import { ThemeContext } from "../context/ThemeContext";
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const [showMenu, setShowMenu] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { token, setToken, userData } = useContext(AppContext);

  const logout = async () => {
    try {
      await signOut();
      setToken("");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback: still clear local state
      setToken("");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img
              onClick={() => navigate("/")}
              className="h-10 w-auto cursor-pointer object-contain"
              src={assets.logo}
              alt="Medicare Logo"
            />
          </div>

          {/* Desktop Nav Links */}
          <ul className="hidden md:flex items-center space-x-8">
            {[
              { path: "/", label: "HOME" },
              { path: "/doctors", label: "ALL DOCTORS" },
              { path: "/about", label: "ABOUT" },
              { path: "/contact", label: "CONTACT" },
            ].map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `relative py-2 text-sm font-semibold tracking-wide transition-colors ${
                    isActive
                      ? "text-primary"
                      : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                  } group`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                        isActive ? "w-full" : "w-0 group-hover:w-full"
                      }`}
                    ></span>
                  </>
                )}
              </NavLink>
            ))}
          </ul>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
              )}
            </button>

            {/* User Profile / Login */}
            {token && userData ? (
              <div className="relative group flex items-center gap-2 cursor-pointer">
                <img
                  className="w-9 h-9 rounded-full border-2 border-primary object-cover"
                  src={userData.image}
                  alt="Profile"
                />
                <img className="w-2.5 dark:invert" src={assets.dropdown_icon} alt="" />
                
                {/* Dropdown */}
                <div className="absolute top-full right-0 mt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-2 flex flex-col">
                    <button
                      onClick={() => navigate("/my-profile")}
                      className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary transition-colors"
                    >
                      My Profile
                    </button>
                    <button
                      onClick={() => navigate("/my-appointments")}
                      className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary transition-colors"
                    >
                      My Appointments
                    </button>
                    <button
                      onClick={() => navigate("/medical-history")}
                      className="px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary transition-colors"
                    >
                      Medical History
                    </button>
                    <div className="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    <button
                      onClick={logout}
                      className="px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="hidden md:inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none transition-all duration-300 transform hover:-translate-y-0.5"
              >
                CREATE ACCOUNT
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden flex flex-col justify-between w-6 h-5 focus:outline-none z-50 relative"
              aria-label="Toggle menu"
            >
              <span
                className={`w-6 h-0.5 bg-gray-600 dark:bg-gray-200 rounded-full transition-all duration-300 transform ${
                  showMenu ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`w-6 h-0.5 bg-gray-600 dark:bg-gray-200 rounded-full transition-all duration-300 ${
                  showMenu ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`w-6 h-0.5 bg-gray-600 dark:bg-gray-200 rounded-full transition-all duration-300 transform ${
                  showMenu ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          showMenu ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setShowMenu(false)}
      ></div>

      <div
        className={`fixed inset-y-0 right-0 w-[280px] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          showMenu ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: '#ffffff' }}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-100 dark:border-gray-800">
          <img src={assets.logo} className="h-8 w-auto" alt="Logo" />
        </div>

        <ul className="flex flex-col py-6 h-full w-full" style={{ backgroundColor: '#ffffff' }}>
          {[
            { path: "/", label: "HOME" },
            { path: "/doctors", label: "ALL DOCTORS" },
            { path: "/about", label: "ABOUT" },
            { path: "/contact", label: "CONTACT" },
          ].map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={() => setShowMenu(false)}
              className={({ isActive }) =>
                `px-6 py-3 text-base font-medium transition-colors ${
                  isActive
                    ? "text-primary bg-gray-50 dark:bg-gray-800"
                    : "text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
          
          {/* Mobile Login Button if not logged in */}
          {!token && (
            <div className="px-6 mt-4">
              <button
                onClick={() => {
                  navigate("/login");
                  setShowMenu(false);
                }}
                className="w-full text-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-full shadow-sm text-white bg-primary hover:bg-primary-hover focus:outline-none transition-all duration-300"
              >
                CREATE ACCOUNT
              </button>
            </div>
          )}
        </ul>
      </div>
    </>
  );
};

export default Navbar;

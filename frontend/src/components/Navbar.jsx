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
    <div className="navbar-wrapper">
      <div className="navbar-content">
        <img
          onClick={() => navigate("/")}
          className="logo-img"
          src={assets.logo}
          alt="Medicare Logo"
        />

        <ul className="nav-links">
          <NavLink to="/" className="nav-item">
            <li>HOME</li>
          </NavLink>
          <NavLink to="/doctors" className="nav-item">
            <li>ALL DOCTORS</li>
          </NavLink>
          <NavLink to="/about" className="nav-item">
            <li>ABOUT</li>
          </NavLink>
          <NavLink to="/contact" className="nav-item">
            <li>CONTACT</li>
          </NavLink>
        </ul>

        <div className="navbar-right">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {theme === "dark" ? (
              <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            )}
          </button>

          {token && userData ? (
            <div className="flex items-center gap-2 cursor-pointer group relative">
              <img className="profile-avatar" src={userData.image} alt="Profile" />
              <img className="w-2.5 dark:invert" src={assets.dropdown_icon} alt="" />
              <div className="absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 dark:text-gray-200 z-20 hidden group-hover:block">
                <div className="min-w-48 bg-white dark:bg-gray-800 rounded flex flex-col gap-4 p-4 shadow-lg border dark:border-gray-700">
                  <p onClick={() => { navigate("/my-profile"); setShowMenu(false) }} className="px-4 py-2 hover:bg-[#f0f9fa] hover:text-[#0FB9B1] cursor-pointer transition-all rounded-md">My Profile</p>
                  <p onClick={() => { navigate("/my-appointments"); setShowMenu(false) }} className="px-4 py-2 hover:bg-[#f0f9fa] hover:text-[#0FB9B1] cursor-pointer transition-all rounded-md">My Appointments</p>
                  <p onClick={() => { navigate("/medical-history"); setShowMenu(false) }} className="px-4 py-2 hover:bg-[#f0f9fa] hover:text-[#0FB9B1] cursor-pointer transition-all rounded-md">Medical History</p>
                  <p onClick={logout} className="px-4 py-2 hover:bg-[#f0f9fa] hover:text-[#0FB9B1] cursor-pointer transition-all rounded-md">Logout</p>
                </div>
              </div>
            </div>
          ) : (
            <button onClick={() => navigate("/login")} className="create-account-btn">
              CREATE ACCOUNT
            </button>
          )}

          <img
            onClick={() => setShowMenu(true)}
            className="w-6 md:hidden cursor-pointer dark:invert"
            src={assets.menu_icon}
            alt="Menu"
          />
        </div>
      </div>

      {/* --- Mobile Menu --- */}
      <div className={`md:hidden ${showMenu ? "fixed w-full" : "h-0 w-0"} right-0 top-0 bottom-0 z-50 overflow-hidden bg-white dark:bg-gray-900 transition-all`}>
        <div className="flex items-center justify-between px-5 py-6">
          <img src={assets.logo} className="w-36" alt="Logo" />
          <img onClick={() => setShowMenu(false)} src={assets.cross_icon} className="w-7 cursor-pointer dark:invert" alt="Close" />
        </div>
        <ul className="flex flex-col items-center gap-4 mt-5 px-5 text-lg font-medium dark:text-gray-100">
          <NavLink onClick={() => setShowMenu(false)} to="/"><p className="nav-item">HOME</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/doctors"><p className="nav-item">ALL DOCTORS</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/about"><p className="nav-item">ABOUT</p></NavLink>
          <NavLink onClick={() => setShowMenu(false)} to="/contact"><p className="nav-item">CONTACT</p></NavLink>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;

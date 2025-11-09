import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaBars, FaTimes, FaHeart, FaChevronDown, FaUser, FaBox, FaSignOutAlt, FaCog } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { authAPI, giftAPI } from "../../services/api";
import { useCart } from "../../contexts/CartContext";
import { CgProfile } from "react-icons/cg";

const Header = () => {
  const navigate = useNavigate();
  const isAuthenticated = authAPI.isAuthenticated();
  const user = authAPI.getCurrentUser();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    authAPI.logout();
    navigate("/login");
  };

  // Fetch gift suggestions from API
  const handleSearchChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() && value.length >= 2) {
      setIsSearching(true);
      try {
        const response = await giftAPI.getGifts({ search: value, limit: 5 });
        if (response.success) {
          const giftsPayload = response.data?.gifts || response.data?.items || response.gifts || [];
          const giftNames = giftsPayload.map(gift => gift.name);
          setSuggestions(giftNames);
        }
      } catch (error) {
        console.error('Error fetching gift suggestions:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSelect = (giftName) => {
    setSearchTerm(giftName);
    setSuggestions([]);
    setMobileMenuOpen(false);
    navigate(`/shop?query=${encodeURIComponent(giftName)}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setSuggestions([]);
      setMobileMenuOpen(false);
      navigate(`/shop?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="bg-black text-white shadow-lg border-b border-red-900/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 py-2 sm:px-6 lg:px-6">
        {/* Mobile Header - Logo and Search Bar */}
        <div className="md:hidden mb-2">
          <div className="flex items-center gap-2">
            {/* Logo - smaller on mobile */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center">
                <div className="h-20 w-20 rounded-lg flex items-center justify-center bg-white/5 border border-red-900/40">
                  <img src="/images/aurelane.png" alt="Aurelane Gifts Logo" className="h-full w-full object-contain" />
                </div>
              </Link>
            </div>

            {/* Mobile Search Bar */}
            <div className="flex-1 relative">
              <form onSubmit={handleSearchSubmit}>
                <div className="flex items-center border-2 border-red-900/40 rounded-full px-3 py-2 bg-white/5 hover:border-red-500 focus-within:border-red-400 transition-colors">
                  <CiSearch className="text-red-200 text-lg flex-shrink-0" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search gifts..."
                    className="ml-2 bg-transparent outline-none w-full text-sm text-white placeholder-red-300/70"
                  />
                </div>
              </form>

              {suggestions.length > 0 && (
                <ul className="absolute mt-1 w-full bg-black border-2 border-red-900/40 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                  {isSearching && <li className="px-4 py-3 text-red-200 text-sm text-center">Searching...</li>}
                  {suggestions.map((giftName, idx) => (
                    <li
                      key={idx}
                      className="px-4 py-3 cursor-pointer hover:bg-red-600/20 hover:text-red-200 transition-colors border-b border-white/10 last:border-b-0"
                      onClick={() => handleSearchSelect(giftName)}
                    >
                      <div className="flex items-center">
                        <CiSearch className="text-red-400 mr-2" />
                        <span className="font-medium text-white">{giftName}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Cart and Menu Icons */}
            <div className="flex items-center space-x-2">
              {/* Wishlist Icon - Only for buyers on mobile */}
              {isAuthenticated && (user?.role === "buyer" || !user?.role) && (
                <Link to="/wishlist" className="text-red-200 hover:text-red-400 p-1" title="My Wishlist">
                  <FaHeart size={22} />
                </Link>
              )}

              <Link to="/cart" className="relative text-red-200 hover:text-red-400 p-1" title="Cart">
                <FaShoppingCart size={22} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              {isAuthenticated && (
                <Link
                  to={
                    user?.role === "admin" ? "/admin/sellers" :
                      user?.role === "seller" ? "/seller-dashboard" :
                        "/my-orders"
                  }
                  className="text-red-200 hover:text-red-400 p-1"
                  title="My Account"
                >
                  <CgProfile size={26} />
                </Link>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-red-200 hover:text-red-400 p-1"
              >
                {mobileMenuOpen ? <FaTimes size={26} /> : <FaBars size={26} />}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden md:flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <div className="h-28 w-28 rounded-lg flex items-center justify-center bg-white/5 border border-red-900/40">
                <img src="/images/aurelane.png" alt="Aurelane Gifts Logo" />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 text-sm tracking-wide uppercase">
            {/* <Link
              to="/"
              className="text-gray-600 hover:text-emerald-600 font-medium transition"
            >
              Home
            </Link> */}
            <Link
              to="/shop"
              className="text-red-100 hover:text-red-400 font-semibold transition"
            >
              Shop Gifts
            </Link>

            <Link
              to="/aboutus"
              className="text-red-100 hover:text-red-400 font-semibold transition"
            >
              About Us
            </Link>
            {/* <Link
              to="/contact"
              className="text-gray-600 hover:text-emerald-600 font-medium transition"
            >
              Contact
            </Link> */}
            <Link
              to="/gifts"
              className="text-red-100 hover:text-red-400 font-semibold transition"
            >
              Gift Playbooks
            </Link>
            {isAuthenticated && (
              <>
                {user?.role === "admin" && (
                  <Link
                    to="/admin-dashboard"
                    className="text-red-100 hover:text-red-400 font-semibold transition"
                  >
                    Admin
                  </Link>
                )}
                {user?.role === "seller" && (
                  <>
                    <Link
                      to="/seller-dashboard"
                      className="text-red-100 hover:text-red-400 font-semibold transition"
                    >
                      Seller Hub
                    </Link>
                    <Link
                      to="/add-gift"
                      className="text-red-100 hover:text-red-400 font-semibold transition"
                    >
                      Add Gift
                    </Link>
                  </>
                )}
                {(user?.role === "buyer" || !user?.role) && (
                  <Link
                    to="/my-orders"
                    className="text-red-100 hover:text-red-400 font-semibold transition"
                  >
                    My Orders
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Search bar */}
          <div className="relative hidden md:block w-72">
            <form onSubmit={handleSearchSubmit}>
              <div className="flex items-center border border-red-900/40 rounded-full px-3 py-1.5 bg-white/5">
                <CiSearch className="text-red-200 text-lg" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search gifts..."
                  className="ml-2 bg-transparent outline-none w-full text-white placeholder-red-300/70"
                />
              </div>
            </form>

            {suggestions.length > 0 && (
              <ul className="absolute mt-1 w-full bg-black border border-red-900/40 rounded-lg shadow-lg max-h-48 overflow-y-auto z-50">
                {isSearching && <li className="px-4 py-2 text-red-200 text-sm">Searching...</li>}
                {suggestions.map((giftName, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 cursor-pointer hover:bg-red-600/20 hover:text-red-100 transition-colors"
                    onClick={() => handleSearchSelect(giftName)}
                  >
                    <span className="text-white">{giftName}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cart and User menu */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wishlist Icon - Only for buyers */}
            {isAuthenticated && (user?.role === "buyer" || !user?.role) && (
              <Link
                to="/wishlist"
                className="relative p-2 text-red-200 hover:text-red-400 transition-colors"
                title="My Wishlist"
              >
                <FaHeart className="w-6 h-6" />
              </Link>
            )}

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 text-red-200 hover:text-red-400 transition-colors"
              title="Shopping Cart"
            >
              <FaShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                {/* Profile Button with Dropdown */}
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 px-3 py-2 text-red-100 hover:text-white hover:bg-red-600/20 rounded-lg transition-all"
                >
                  <CgProfile size={24} />
                  <span className="text-sm font-medium text-white">{user?.name || "User"}</span>
                  <FaChevronDown className={`w-3 h-3 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-60 bg-black border border-red-900/40 rounded-xl shadow-2xl z-50 overflow-hidden">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-red-900/30 bg-gradient-to-r from-red-900/60 to-black">
                      <p className="text-sm font-semibold text-white">{user?.name || "User"}</p>
                      <p className="text-xs text-red-200 truncate">{user?.email}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-red-600 text-white text-xs rounded-full font-medium capitalize">
                        {user?.role || "Buyer"}
                      </span>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      {user?.role === "admin" ? (
                        <>
                          <Link
                            to="/admin-dashboard"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center space-x-3 px-4 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white transition-colors"
                          >
                            <FaCog className="w-4 h-4" />
                            <span className="text-sm">Admin Dashboard</span>
                          </Link>
                        </>
                      ) : user?.role === "seller" ? (
                        <>
                          <Link
                            to="/seller-dashboard"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center space-x-3 px-4 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white transition-colors"
                          >
                            <FaCog className="w-4 h-4" />
                            <span className="text-sm">My Dashboard</span>
                          </Link>
                          <Link
                            to="/seller-orders"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center space-x-3 px-4 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white transition-colors"
                          >
                            <FaBox className="w-4 h-4" />
                            <span className="text-sm">My Orders</span>
                          </Link>
                          <Link
                            to="/seller-detail"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center space-x-3 px-4 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white transition-colors"
                          >
                            <FaUser className="w-4 h-4" />
                            <span className="text-sm">My Profile</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/my-orders"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center space-x-3 px-4 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white transition-colors"
                          >
                            <FaBox className="w-4 h-4" />
                            <span className="text-sm">My Orders</span>
                          </Link>
                          <Link
                            to="/wishlist"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center space-x-3 px-4 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white transition-colors"
                          >
                            <FaHeart className="w-4 h-4" />
                            <span className="text-sm">My Wishlist</span>
                          </Link>
                          <Link
                            to="/user-detail"
                            onClick={() => setShowProfileDropdown(false)}
                            className="flex items-center space-x-3 px-4 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white transition-colors"
                          >
                            <FaUser className="w-4 h-4" />
                            <span className="text-sm">My Profile</span>
                          </Link>
                        </>
                      )}
                    </div>

                    {/* Logout Button */}
                    <div className="border-t border-red-900/30 py-2">
                      <button
                        onClick={() => {
                          handleLogout();
                          setShowProfileDropdown(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-2.5 text-red-400 hover:bg-red-600/20 hover:text-white transition-colors w-full"
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        <span className="text-sm font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-red-100 hover:text-red-400 font-semibold transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 shadow-md hover:shadow-lg"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black text-white border-t border-red-900/40 shadow-2xl">
          <div className="p-4 space-y-3">
            {/* User Info Section - Only if authenticated */}
            {isAuthenticated && (
              <div className="pb-3 border-b border-red-900/30 bg-gradient-to-r from-red-900/60 to-black -mx-4 px-4 py-3 mb-3">
                <p className="font-semibold text-white text-sm">👋 {user?.name || "User"}</p>
                <p className="text-xs text-red-200 mt-1">{user?.email}</p>
                <span className="inline-block mt-2 px-2 py-1 bg-red-600 text-white text-xs rounded-full font-medium capitalize">
                  {user?.role || "Buyer"}
                </span>
              </div>
            )}

            {/* Navigation Links */}
            <div className="space-y-2">
              <p className="text-xs font-bold text-red-200 uppercase px-2 mb-3 tracking-widest">📍 Navigate</p>

              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white rounded-lg transition-colors font-medium"
              >
                <span className="text-lg">🏠</span>
                <span>Home</span>
              </Link>

              <Link
                to="/shop"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white rounded-lg transition-colors font-medium"
              >
                <span className="text-lg">🎁</span>
                <span>Shop Gifts</span>
              </Link>

              <Link
                to="/gifts"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white rounded-lg transition-colors font-medium"
              >
                <span className="text-lg">📚</span>
                <span>Gift Playbooks</span>
              </Link>

              <Link
                to="/aboutus"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-3 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white rounded-lg transition-colors font-medium"
              >
                <span className="text-lg">ℹ️</span>
                <span>About Us</span>
              </Link>
            </div>

            {/* Role-Specific Quick Actions */}
            {isAuthenticated && (
              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs font-bold text-red-200 uppercase px-2 mb-3 tracking-widest">
                  {user?.role === "admin" ? "⚙️ Admin Tools" :
                    user?.role === "seller" ? "🏪 Seller Toolkit" :
                      "👤 My Account"}
                </p>

                {user?.role === "admin" ? (
                  <>
                    <Link
                      to="/admin-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white rounded-lg transition-colors"
                    >
                      <span className="text-lg">📊</span>
                      <span>Admin Dashboard</span>
                    </Link>
                  </>
                ) : user?.role === "seller" ? (
                  <>
                    <Link
                      to="/seller-dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white rounded-lg transition-colors"
                    >
                      <span className="text-lg">📊</span>
                      <span>My Dashboard</span>
                    </Link>
                    <Link
                      to="/seller-orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white rounded-lg transition-colors"
                    >
                      <span className="text-lg">📦</span>
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/add-gift"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white rounded-lg transition-colors"
                    >
                      <span className="text-lg">➕</span>
                      <span>Add New Gift</span>
                    </Link>
                    <Link
                      to="/seller-detail"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white rounded-lg transition-colors"
                    >
                      <span className="text-lg">✏️</span>
                      <span>Edit Profile</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/my-orders"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white rounded-lg transition-colors"
                    >
                      <span className="text-lg">📦</span>
                      <span>My Orders</span>
                    </Link>
                    <Link
                      to="/wishlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white rounded-lg transition-colors"
                    >
                      <span className="text-lg">❤️</span>
                      <span>Wishlist</span>
                    </Link>
                    <Link
                      to="/user-detail"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2.5 text-red-100 hover:bg-red-600/20 hover:text-white rounded-lg transition-colors"
                    >
                      <span className="text-lg">👤</span>
                      <span>My Profile</span>
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Auth Section */}
            <div className="pt-3 border-t border-red-900/30">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="text-center text-sm text-red-200 mb-3">
                    Logged in as <span className="font-semibold text-white">{user?.name}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded-lg w-full text-sm font-medium transition-colors flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <span>🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center border border-red-900/40 text-red-100 hover:bg-red-600/20 px-4 py-3 rounded-lg font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center bg-red-600 hover:bg-red-500 text-white px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                  >
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

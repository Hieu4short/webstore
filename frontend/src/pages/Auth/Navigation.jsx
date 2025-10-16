import { useState, useRef, useEffect } from "react";
import {
  AiOutlineHome,
  AiOutlineShopping,
  AiOutlineUserAdd,
  AiOutlineLogin,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Navigation.css";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../../redux/api/usersApiSlice";
import { logout } from "../../redux/features/auth/authSlice";
import FavoritesCount from "../Products/FavoritesCount";
import { FaBars, FaTimes } from "react-icons/fa";

const Navigation = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSideBar, setShowSidebar] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  
  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleSideBar = () => {
    setShowSidebar(!showSideBar);
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  // Detect screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logoutHandler = async () => {
    try {
      console.log("Attempting to logout...");
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
      console.log("Logout successful!");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Hamburger Button - Luôn hiển thị trên mobile, ẩn trên desktop */}
      <button
        onClick={toggleSideBar}
        className="md:hidden fixed top-4 left-4 z-[1000] bg-black text-white p-2 rounded-md focus:outline-none"
      >
        {showSideBar ? <FaTimes size={26} /> : <FaBars size={26} />}
      </button>

      {/* Sidebar Navigation */}
      <div
        ref={sidebarRef}
        style={{ zIndex: 999 }}
        className={`fixed top-0 h-full bg-black p-4 transition-all duration-300 ${
          showSideBar ? "left-0 w-64" : "left-[-100%] w-0"
        } md:left-0 md:w-16 lg:w-20 xl:w-24 md:flex md:flex-col md:justify-between overflow-hidden group hover:w-64`}
        id="navigation-container"
        onMouseEnter={() => isDesktop && setDropdownOpen(false)}
        onMouseLeave={() => isDesktop && setDropdownOpen(false)}
      >
        {/* Menu trên cùng */}
        <div className="flex flex-col justify-center space-y-4">
          <Link
            to="/"
            className="flex items-center transition-transform transform hover:translate-x-2 group"
            onClick={() => setShowSidebar(false)}
          >
            <AiOutlineHome className="min-w-6 mr-2 mt-[3rem]" size={26} />
            <span className={`mt-[3rem] whitespace-nowrap ${showSideBar ? "block" : "hidden"} group-hover:block transition-opacity duration-300`}>
              HOME
            </span>
          </Link>

          <Link
            to="/shop"
            className="flex items-center transition-transform transform hover:translate-x-2 group"
            onClick={() => setShowSidebar(false)}
          >
            <AiOutlineShopping className="min-w-6 mr-2 mt-[3rem]" size={26} />
            <span className={`mt-[3rem] whitespace-nowrap ${showSideBar ? "block" : "hidden"} group-hover:block transition-opacity duration-300`}>
              SHOP
            </span>
          </Link>

          <Link
            to="/cart"
            className="flex items-center transition-transform transform hover:translate-x-2 relative group"
            onClick={() => setShowSidebar(false)}
          >
            <AiOutlineShoppingCart className="min-w-6 mr-2 mt-[3rem]" size={26} />
            <span className={`mt-[3rem] whitespace-nowrap ${showSideBar ? "block" : "hidden"} group-hover:block transition-opacity duration-300`}>
              CART
            </span>

            <div className="absolute top-9 left-2">
              {cartItems.length > 0 && (
                <span className="px-1 py-0 text-sm text-white bg-pink-500 rounded-full">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </div>
          </Link>

          <Link
            to="/favorite"
            className="flex items-center transition-transform transform hover:translate-x-2 group"
            onClick={() => setShowSidebar(false)}
          >
            <FaHeart className="min-w-6 mr-2 mt-[3rem]" size={26} />
            <span className={`mt-[3rem] whitespace-nowrap ${showSideBar ? "block" : "hidden"} group-hover:block transition-opacity duration-300`}>
              FAVORITES
            </span>
            <FavoritesCount />
          </Link>
        </div>

        {/* Dropdown user */}
        <div 
          ref={dropdownRef}
          className="relative mt-auto"
        >
          {userInfo ? (
            <>
              <button
                onClick={toggleDropdown}
                className="flex items-center text-white focus:outline-none w-full justify-between group"
              >
                <div className="flex items-center min-w-0 flex-1">
                  <span className={`py-2 whitespace-nowrap truncate ${showSideBar ? "block" : "hidden"} group-hover:block transition-opacity duration-300`}>
                    {userInfo.username}
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 ml-1 transition-transform flex-shrink-0 ${
                    dropdownOpen ? "rotate-180" : ""
                  } ${showSideBar ? "block" : "hidden"} group-hover:block`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                  />
                </svg>
              </button>

              {dropdownOpen && (
                <ul 
                  className={`absolute ${
                    isDesktop 
                      ? "bottom-full left-0 mb-2 w-48" 
                      : "bottom-0 left-0 mt-2 w-full"
                  } space-y-2 bg-white text-gray-600 border border-blue-500 z-50 rounded shadow-lg`}
                >
                  {userInfo.isAdmin && (
                    <>
                      <li>
                        <Link 
                          to="/admin/dashboard" 
                          className="block px-4 py-2 hover:bg-gray-100 text-sm" 
                          onClick={() => {
                            setShowSidebar(false);
                            setDropdownOpen(false);
                          }}
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/admin/productlist" 
                          className="block px-4 py-2 hover:bg-gray-100 text-sm" 
                          onClick={() => {
                            setShowSidebar(false);
                            setDropdownOpen(false);
                          }}
                        >
                          Products
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/admin/categorylist" 
                          className="block px-4 py-2 hover:bg-gray-100 text-sm" 
                          onClick={() => {
                            setShowSidebar(false);
                            setDropdownOpen(false);
                          }}
                        >
                          Categories
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/admin/orderlist" 
                          className="block px-4 py-2 hover:bg-gray-100 text-sm" 
                          onClick={() => {
                            setShowSidebar(false);
                            setDropdownOpen(false);
                          }}
                        >
                          Orders
                        </Link>
                      </li>
                      <li>
                        <Link 
                          to="/admin/userlist" 
                          className="block px-4 py-2 hover:bg-gray-100 text-sm" 
                          onClick={() => {
                            setShowSidebar(false);
                            setDropdownOpen(false);
                          }}
                        >
                          Users
                        </Link>
                      </li>
                    </>
                  )}
                  <li>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 hover:bg-gray-100 text-sm" 
                      onClick={() => {
                        setShowSidebar(false);
                        setDropdownOpen(false);
                      }}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logoutHandler();
                        setShowSidebar(false);
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </>
          ) : (
            <ul>
              <li>
                <Link
                  to="/login"
                  className="flex items-center transition-transform transform hover:translate-x-2 group"
                  onClick={() => setShowSidebar(false)}
                >
                  <AiOutlineLogin className="min-w-6 mr-2 mt-[3rem]" size={26} />
                  <span className={`mt-[3rem] whitespace-nowrap ${showSideBar ? "block" : "hidden"} group-hover:block transition-opacity duration-300`}>
                    Login
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="flex items-center transition-transform transform hover:translate-x-2 group"
                  onClick={() => setShowSidebar(false)}
                >
                  <AiOutlineUserAdd className="min-w-6 mr-2 mt-[3rem]" size={26} />
                  <span className={`mt-[3rem] whitespace-nowrap ${showSideBar ? "block" : "hidden"} group-hover:block transition-opacity duration-300`}>
                    Register
                  </span>
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>

      {/* Overlay cho mobile */}
      {showSideBar && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[998]"
          onClick={() => setShowSidebar(false)}
        />
      )}
    </>
  );
};

export default Navigation;
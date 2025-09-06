import React, { useState, useEffect, lazy, Suspense, useContext, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { UserContext } from "../Context/UserContext";

const FiMenu = lazy(() => import("react-icons/fi").then(mod => ({ default: mod.FiMenu })));
const FiX = lazy(() => import("react-icons/fi").then(mod => ({ default: mod.FiX })));

const links = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/notes", label: "Notes" },
  { to: "/askai", label: "AskAI" },
  { to: "/upload", label: "Upload" },
  { to: "/bookmarks", label: "Bookmarks" },
];

export default function Navbar() {
  const { user, setUser } = useContext(UserContext);
  useEffect(() => {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  if (storedUser && token && !user) {
    setUser(JSON.parse(storedUser));
  }
}, []);
  const [open, setOpen] = useState(false);
 
  const location = useLocation();

  // 🔹 Ref for first mobile menu link
  const firstLinkRef = useRef(null);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // 🔹 Focus first link when mobile menu opens
  useEffect(() => {
    if (open && firstLinkRef.current) {
      firstLinkRef.current.focus();
    }
  }, [open]);

  // const handleSearchSubmit = (e) => {
  //   e.preventDefault();
  //   alert(`Search submitted: ${search}`);
  //   setSearch("");
  //   setOpen(false);
  // };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setOpen(false);
  };

  return (
    <>
      {/* Navbar Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gradient-to-r from-[#f6bcd8]/90 via-[#fdd3e8]/80 to-[#f6bcd8]/90 dark:bg-gray-900/80 shadow-xl transition-shadow duration-500 flex justify-center border-b border-[#d59b99]/4`}
        style={{ height: "64px" }}
      >
        <nav className="max-w-7xl w-full px-6 flex items-center justify-between">

          {/* Logo */}
          <NavLink
            to="/"
            className="flex items-center gap-1 font-semibold text-[#a01443] dark:text-gray-600 hover:opacity-90 transition "
            onClick={() => setOpen(false)}
          >
            <div className="w-10 h-10 rounded-full bg-[#D9C4B0] flex items-center justify-center overflow-hidden transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
              <img src="/fa.svg" alt="Logo" className="w-8 h-8 " />
            </div>
            <span className="text-xl select-none mr-12 ">SmartLearnHub</span>
          </NavLink>

          {/* Desktop Links */}
          <ul className="hidden md:flex space-x-20 text-[#4B4B4B] dark:text-gray-500 items-center font-medium">
            {links.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    `relative pb-1 transition-all duration-300 cursor-pointer select-none px-3 py-2 ${
                      isActive
                        ? "font-semibold text-[#a01443] drop-shadow-md"
                        : "hover:text-[#d63384] hover:drop-shadow-md hover:bg-[#D9C4B0]/20 rounded-md px-2 py-1"
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  {label}
                  {/* Animated underline */}
                  <span
                    className={`absolute left-0 bottom-0 h-0.5 bg-[#D59B99] origin-left scale-x-0 transition-transform duration-300 ease-out ${
                      location.pathname === to ? "scale-x-100" : "hover:scale-x-100"
                    }`}
                  />
                </NavLink>
              </li>
            ))}

            

            {/* Conditional Login/Profile (after search) */}
            <li>
              {user ? (
                <div className="flex items-center gap-4">
                  <NavLink to="/profile" className="hover:text-[#d63384] cursor-pointer select-none">
                    Profile
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-md bg-[#d63384] text-white font-semibold
             hover:bg-[#a01443]  transition-all duration-300   border border-[#b11654] shadow-md cursor-pointer select-none"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <NavLink to="/login" className="hover:text-[#d63384] cursor-pointer select-none">
                  Login
                </NavLink>
              )}
            </li>
          </ul>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#D59B99]"
          >
            <Suspense fallback={<span />}>
              {open ? <FiX size={24} /> : <FiMenu size={24} />}
            </Suspense>
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-x-4 top-14 z-40 rounded-2xl backdrop-blur-lg bg-[#fde2f4]/85 dark:bg-gray-900/80 shadow-2xl ring-1 ring-[#D59B99]/30 transition-transform duration-300 md:hidden ${
          open ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-10 opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col space-y-4 p-6 text-[#4B4B4B] dark:text-gray-300">
          {links.map(({ to, label }, index) => (
            <NavLink
              key={to}
              to={to}
              ref={index === 0 ? firstLinkRef : null}  // 🔹 First link gets focus
              onClick={() => setOpen(false)}
              style={{ transitionDelay: `${index * 75}ms` }} // 🔹 Animation delay
              className={({ isActive }) =>
                `transition-all duration-300 transform cursor-pointer select-none ${
                  isActive
                    ? "font-semibold border-l-4 border-[#de386f] pl-3"
                    : "hover:text-[#D59B99] hover:scale-105"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          

          {/* Conditional Login/Profile for Mobile (after search) */}
          {user ? (
            <>
              <NavLink to="/profile" onClick={() => setOpen(false)} className="hover:text-[#d63384]">
                Profile
              </NavLink>
              <button
                onClick={handleLogout} aria-label="Logout from SmartLearnHub"
                className="px-4 py-2 rounded-md bg-[#d63384] text-white font-semibold
             hover:bg-[#a01443]  transition-all duration-300   border border-[#b11654] shadow-md"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" onClick={() => setOpen(false)} className="hover:text-[#d63384]">
              Login
            </NavLink>
          )}
        </nav>
      </div>

      {/* Backdrop overlay when menu open */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}

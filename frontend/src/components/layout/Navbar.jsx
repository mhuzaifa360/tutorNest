import React, { useState } from "react";
import Typography from "../common/Typography";
import { Link, useLocation } from "react-router";
import Btn from "../common/Btn";
import { navbar } from "../../assets/constant/navbar";
import { FiMenu, FiX } from "react-icons/fi";

function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">

      <div className="max-w-7xl mx-auto px-4 md:px-6">

        {/* NAVBAR CONTAINER */}
        <div className="flex items-center justify-between h-20">

          {/* LOGO */}
          <Link to="/">
            <Typography
              variant="h3"
              className="font-bold text-textBlue"
            >
              TutorNest
            </Typography>
          </Link>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex items-center gap-2">

            {navbar.map((item, key) => {
              const isActive = location.pathname === item.pathName;

              return (
                <Link
                  to={item.pathName}
                  key={key}
                  className={`px-4 py-2 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "text-textBlue bg-blue-50 font-semibold"
                        : "text-textBlack hover:bg-gray-100"
                    }
                  `}
                >
                  <Typography variant="h6">
                    {item.pathValue}
                  </Typography>
                </Link>
              );
            })}
          </div>

          {/* DESKTOP BUTTONS */}
          <div className="hidden md:flex items-center gap-3">
            <Btn variant="white">Login</Btn>
            <Btn variant="blue">Sign Up</Btn>
          </div>

          {/* MOBILE BURGER BUTTON */}
          <button
            className="md:hidden text-3xl text-textBlack"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-[500px] py-4" : "max-h-0"
          }`}
        >

          {/* MOBILE LINKS */}
          <div className="flex flex-col gap-2">

            {navbar.map((item, key) => {
              const isActive = location.pathname === item.pathName;

              return (
                <Link
                  to={item.pathName}
                  key={key}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      isActive
                        ? "bg-blue-50 text-textBlue font-semibold"
                        : "text-textBlack hover:bg-gray-100"
                    }
                  `}
                >
                  <Typography variant="h6">
                    {item.pathValue}
                  </Typography>
                </Link>
              );
            })}

            {/* MOBILE BUTTONS */}
            <div className="flex flex-col gap-3 pt-4">
              <Btn variant="white">Login</Btn>
              <Btn variant="blue">Sign Up</Btn>
            </div>

          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
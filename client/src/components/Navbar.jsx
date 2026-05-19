import {
  LogOut,
  Menu,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

function Navbar({ setSidebarOpen }) {

  const navigate = useNavigate();

  const { user, logout } =
    useContext(AuthContext);

  const handleLogout = () => {

    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-lg border-b border-slate-800 px-4 md:px-8 py-4 md:py-5 flex items-center justify-between sticky top-0 z-50">

      {/* LEFT */}

      <div className="flex items-center gap-4">

        {/* MOBILE MENU */}

        <button
          onClick={() =>
            setSidebarOpen(true)
          }
          className="md:hidden bg-slate-800 p-2 rounded-xl hover:bg-slate-700 transition"
        >

          <Menu size={22} />

        </button>

        <div>

          <h1 className="text-lg md:text-2xl font-bold text-white">

            Welcome back,
            {" "}

            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              {user?.name}
            </span>

          </h1>

          <p className="text-slate-400 text-xs md:text-sm mt-1 hidden sm:block">
            Manage your projects and tasks efficiently
          </p>

        </div>

      </div>

      {/* RIGHT */}

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 md:px-5 py-2 md:py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:scale-105"
      >

        <LogOut size={18} />

        <span className="hidden sm:inline">
          Logout
        </span>

      </button>

    </div>
  );
}

export default Navbar;
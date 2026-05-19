import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  ShieldCheck,
  X,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router-dom";

import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {

  const { user } =
    useContext(AuthContext);

  const location = useLocation();

  const navLinkClass = (path) =>
    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300
    ${
      location.pathname === path
        ? "bg-blue-600 text-white shadow-lg"
        : "text-slate-300 hover:bg-slate-700 hover:text-white"
    }`;

  return (
    <>

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (

        <div
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />

      )}

      {/* SIDEBAR */}

      <div
        className={`fixed md:static top-0 left-0 z-50 w-72 min-h-screen bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between transform transition-transform duration-300
        ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >

        {/* TOP */}

        <div>

          {/* HEADER */}

          <div className="flex items-center justify-between mb-12">

            <div>

              <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                TaskFlow
              </h1>

              <p className="text-slate-400 text-sm mt-2">
                Team Management System
              </p>

            </div>

            {/* CLOSE BUTTON */}

            <button
              onClick={() =>
                setSidebarOpen(false)
              }
              className="md:hidden bg-slate-800 p-2 rounded-xl hover:bg-slate-700 transition"
            >

              <X size={20} />

            </button>

          </div>

          {/* NAVIGATION */}

          <nav className="space-y-3">

            <Link
              to="/dashboard"
              onClick={() =>
                setSidebarOpen(false)
              }
              className={navLinkClass(
                "/dashboard"
              )}
            >

              <LayoutDashboard size={20} />

              <span className="font-medium">
                Dashboard
              </span>

            </Link>

            <Link
              to="/tasks"
              onClick={() =>
                setSidebarOpen(false)
              }
              className={navLinkClass(
                "/tasks"
              )}
            >

              <CheckSquare size={20} />

              <span className="font-medium">
                Tasks
              </span>

            </Link>

            {/* ADMIN ONLY */}

            {user?.role === "admin" && (

              <Link
                to="/projects"
                onClick={() =>
                  setSidebarOpen(false)
                }
                className={navLinkClass(
                  "/projects"
                )}
              >

                <FolderKanban size={20} />

                <span className="font-medium">
                  Projects
                </span>

              </Link>
            )}

          </nav>

        </div>

        {/* USER PROFILE */}

        <div className="bg-slate-800 rounded-2xl p-4 border border-slate-700">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center font-bold text-lg">

              {user?.name?.charAt(0).toUpperCase()}

            </div>

            <div>

              <p className="font-semibold text-white">
                {user?.name}
              </p>

              <div className="flex items-center gap-2 text-sm text-slate-400">

                <ShieldCheck size={14} />

                <span className="capitalize">
                  {user?.role}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </>
  );
}

export default Sidebar;
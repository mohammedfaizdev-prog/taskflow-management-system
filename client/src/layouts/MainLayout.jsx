import { useState } from "react";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

function MainLayout({ children }) {

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="flex min-h-screen bg-slate-900 text-white overflow-hidden">

      {/* SIDEBAR */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* MAIN CONTENT */}

      <div className="flex-1 flex flex-col">

        <Navbar
          setSidebarOpen={setSidebarOpen}
        />

        <main className="p-4 md:p-6 flex-1 overflow-y-auto">

          {children}

        </main>

      </div>

    </div>
  );
}

export default MainLayout;
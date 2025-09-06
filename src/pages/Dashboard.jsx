import React, { useState } from "react";
import Navbar from "../components/macros/dashboard/Navbar";
import Menubar from "../components/macros/dashboard/Menubar";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col w-full min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      {/* Body */}
      <div className="flex w-full">
        {/* Sidebar */}
        <div
          className={`
            fixed z-30 inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-md transform 
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            transition-transform duration-300 ease-in-out
            md:relative md:translate-x-0 md:flex
          `}
        >
          <Menubar closeSidebar={() => setSidebarOpen(false)} />
        </div>

        {/* For mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-30 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 bg-white md:rounded-tl-2xl shadow-sm md:border-l border-gray-100 min-h-screen ml-0  transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

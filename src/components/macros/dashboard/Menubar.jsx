import React from "react";
import { NavLink } from "react-router-dom";
import { FaHome, FaChartBar, FaFileAlt } from "react-icons/fa";
import { selectCurrentUser } from "../../../../stores/slices/authSlice";
import { useSelector } from "react-redux";

const Menubar = ({ closeSidebar }) => {
  const user = useSelector(selectCurrentUser);

  const allMenuItems = [
    { name: "Dashboard", path: "/dashboard", icon: <FaHome size={18} /> },
    { name: "Sales", path: "/dashboard/sales", icon: <FaChartBar size={18} /> },
    { name: "Reports", path: "/dashboard/reports", icon: <FaFileAlt size={18} /> },
  ];

  const menuItems =
    user?.role === "manager"
      ? allMenuItems.filter((item) => item.name === "Reports" || item.name === "Dashboard")
      : allMenuItems.filter((item) => item.name === "Dashboard" || item.name === "Sales");

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md border-r border-gray-200 md:relative z-40">
      {/* Logo / App Name */}
      <div className="p-5 text-2xl font-bold text-gray-900 tracking-wide border-b border-gray-200">
        Analysis
      </div>

      {/* Navigation */}
      <nav className="flex flex-col mt-4 gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-gray-100 text-black shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            onClick={() => closeSidebar?.()} // Close sidebar on mobile after click
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Menubar;

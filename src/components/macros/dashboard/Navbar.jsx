import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser, clearCredentials } from "../../../../stores/slices/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaBars } from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectCurrentUser);

  const handleLogout = async () => {
    try {
      dispatch(clearCredentials());
      toast.success("Logged out successfully 👋");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while logging out!");
    }
  };

  return (
    <nav className="h-[60px] bg-white border-b border-gray-200 shadow-sm flex justify-between items-center px-4 sm:px-6 sticky top-0 z-50">
      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button onClick={toggleSidebar} className="text-gray-900 p-2 rounded-md hover:bg-gray-100 transition">
          <FaBars size={20} />
        </button>
      </div>

      {/* Brand Logo */}
      <div
        onClick={() => navigate("/dashboard")}
        className="text-xl font-bold tracking-wide cursor-pointer text-gray-900 hover:text-black transition mx-2"
      >
        Proc<span className="text-black">DNA</span>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-4">
        <div className="hidden md:flex flex-col items-end text-right">
          <span className="text-gray-900 font-semibold capitalize">
            {user?.name || "User"}
          </span>
          <span className="text-gray-500 text-sm capitalize">{user?.role || "Role"}</span>
        </div>

        <button
          onClick={handleLogout}
          className="bg-black text-white px-4 py-2 cursor-pointer rounded-lg shadow-md hover:bg-gray-900 transition duration-300 ease-in-out"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

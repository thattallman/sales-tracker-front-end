import React from "react";
import Auth from "../components/macros/Auth";

const Register = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-white transition-colors duration-500">
      {/* App Title */}
      <div className="py-8 px-4 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-2 animate-fadeIn">
          Pharma Sales Tracker
        </h1>
        <p className="text-gray-600 sm:text-lg animate-fadeIn delay-200">
          Track and manage your pharma sales effortlessly.
        </p>
      </div>

      {/* Auth Component */}
      <div className="flex justify-center items-center w-full px-4 sm:px-0">
        <div className="w-full max-w-md p-6 sm:p-[18px] bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-500 animate-slideUp">
          <Auth />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-gray-500 text-sm text-center px-4 animate-fadeIn delay-400">
        &copy; {new Date().getFullYear()} Pharma Sales Tracker. All rights reserved.
      </div>

      {/* Landing Page Animations */}
      <style jsx>{`
        .animate-fadeIn {
          opacity: 0;
          animation: fadeIn 1s forwards;
        }
        .animate-slideUp {
          transform: translateY(30px);
          opacity: 0;
          animation: slideUp 0.8s forwards;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        @keyframes fadeIn {
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Register;

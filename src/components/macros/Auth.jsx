import React, { useState } from "react";
import LoginForm from "../micros/userAuth/LoginForm";
import Signup from "../micros/userAuth/Signup";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="min-h-[70vh] w-full flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transition-all">
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-center mb-2 text-gray-900">
          {isSignUp ? "Create an Account" : "Welcome Back"}
        </h2>
        <p className="text-gray-500 text-sm text-center mb-6">
          {isSignUp
            ? "Sign up to manage your pharma sales easily."
            : "Login to continue tracking your sales."}
        </p>

        {/* Forms */}
        {isSignUp ? (
          <Signup setIsSignUp={setIsSignUp} />
        ) : (
          <LoginForm />
        )}

        {/* Toggle */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 text-black font-semibold hover:underline transition"
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

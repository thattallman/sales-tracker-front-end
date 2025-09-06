import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { register } from "../../../api/auth/auth";
import toast from "react-hot-toast";

const Signup = ({ setIsSignUp }) => {
  const initialValues = {
    name: "",
    email: "",
    password: "",
    role: "",
    mobile: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(2, "Name must be at least 2 characters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    role: Yup.string()
      .oneOf(["sales", "manager"], "Invalid role")
      .required("Role is required"),
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Mobile must be 10 digits")
      .required("Mobile number is required"),
  });

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    handleRegister(values, setSubmitting, resetForm);
  };

  const handleRegister = async (data, setSubmitting, resetForm) => {
    try {
      const response = await register(data);
      console.log("Signup success:", response);

      // Show success toast
      toast.success("Signup successful! Please log in.");

      // Reset form after successful signup
      resetForm();

      // Switch to login form
      setIsSignUp(false);
    } catch (error) {
      console.error("Signup error:", error);

      // Show error toast with API message if available
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Name
              </label>
              <Field
                type="text"
                name="name"
                placeholder="Enter your name"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              />
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Email
              </label>
              <Field
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Password
              </label>
              <Field
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            {/* Role Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Role
              </label>
              <Field
                as="select"
                name="role"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              >
                <option value="">Select Role</option>
                <option value="sales">Sales Representative</option>
                <option value="manager">Manager</option>
              </Field>
              <ErrorMessage
                name="role"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Mobile
              </label>
              <Field
                type="text"
                name="mobile"
                placeholder="Enter your mobile number"
                className="w-full px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
              />
              <ErrorMessage
                name="mobile"
                component="div"
                className="text-red-500 text-xs mt-1"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-2 bg-black cursor-pointer text-white rounded-xl shadow-md hover:bg-gray-900 transition duration-300 ease-in-out disabled:opacity-50"
            >
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Signup;

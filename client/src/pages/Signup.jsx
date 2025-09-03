import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";
import Layout from "../components/Layout";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Get API URL from environment variable
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      console.log("Attempting signup with:", formData);
      console.log("Using API URL:", API_BASE_URL);

      const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (res.ok && data.success) {
        // Successful signup
        alert("Signup Successful! Please login.");
        navigate("/login");
      } else {
        // Handle failure response from backend
        alert(data.message || data.msg || "Signup failed. Please try again.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      // Handle any other errors
      alert(
        "Something went wrong. Please check if the backend server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Google signup
  const handleGoogleSignup = () => {
    // Use environment variable for Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-white dark:from-[#0c0f1c] dark:to-[#1a1d2e] p-4 transition-all duration-300">
        <div className="w-full max-w-3xl bg-white dark:bg-[#0e2433] rounded-3xl shadow-xl overflow-hidden md:flex border border-gray-200 dark:border-slate-700 hover:shadow-2xl transition-shadow duration-300">
          {/* Lottie Image */}
          <div className="md:w-5/12 bg-[#001f3f] dark:bg-blue-900 p-6 flex items-center justify-center rounded-tl-3xl rounded-bl-3xl">
            <Player
              autoplay
              loop
              src="/animations/signup.json"
              style={{ height: "300px", width: "300px" }}
            />
          </div>

          {/* Form */}
          <div className="md:w-7/12 p-8 md:p-10 flex items-center justify-center bg-white dark:bg-slate-900">
            <div className="w-full">
              <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 dark:text-slate-100 mb-6 text-center transition-all duration-300 transform hover:scale-105">
                Create Your Account
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 text-slate-800 dark:text-gray-100 bg-gray-100 dark:bg-slate-800 transition-transform duration-300 hover:scale-105"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 text-slate-800 dark:text-gray-100 bg-gray-100 dark:bg-slate-800 transition-transform duration-300 hover:scale-105"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password (min 6 characters)"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength="6"
                  className="w-full p-4 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-400 text-slate-800 dark:text-gray-100 bg-gray-100 dark:bg-slate-800 transition-transform duration-300 hover:scale-105"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 ${
                    loading
                      ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                      : "bg-green-500 text-white hover:bg-green-600 hover:shadow-lg"
                  }`}
                >
                  {loading ? "Signing up..." : "Signup"}
                </button>
              </form>

              {/* OR Divider */}
              <div className="my-4 text-center text-slate-600 dark:text-slate-300 font-medium">
                <div className="flex items-center justify-center gap-2">
                  <span className="flex-1 h-px bg-gray-300 dark:bg-slate-600" />
                  <span>OR</span>
                  <span className="flex-1 h-px bg-gray-300 dark:bg-slate-600" />
                </div>
              </div>

              {/* Google Signup */}
              <button
                onClick={handleGoogleSignup}
                className="w-full py-3 bg-white dark:bg-slate-900 text-black dark:text-white border border-gray-300 dark:border-slate-600 rounded-lg shadow-md hover:bg-red-400 hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/archive/c/c1/20190925201609%21Google_%22G%22_logo.svg"
                  alt="Google Logo"
                  className="w-5 h-5 mr-3"
                />
                Continue with Google
              </button>

              {/* Login Redirect */}
              <p className="mt-4 text-center text-sm text-slate-800 dark:text-slate-300">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-blue-600 hover:underline transition-all duration-300 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Login here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;

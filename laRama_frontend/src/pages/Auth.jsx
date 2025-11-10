import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();
  const { loginUser, register, loading } = useAuth();

  // Separate state for login form
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
    error: "",
    isSubmitting: false
  });

  // Separate state for signup form
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    error: "",
    isSubmitting: false
  });

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  // Login form handlers
  const handleLoginChange = (field, value) => {
    setLoginData(prev => ({ ...prev, [field]: value, error: "" }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setLoginData(prev => ({ ...prev, isSubmitting: true, error: "" }));

    const { email, password } = loginData;

    if (!email.trim() || !password.trim()) {
      setLoginData(prev => ({ 
        ...prev, 
        error: "Please fill in all fields", 
        isSubmitting: false 
      }));
      return;
    }

    if (!email.includes('@')) {
      setLoginData(prev => ({ 
        ...prev, 
        error: "Please enter a valid email address", 
        isSubmitting: false 
      }));
      return;
    }

    try {
      const result = await loginUser({ email: email.trim(), password: password.trim() });
      
      if (result.success) {
        setLoginData({ email: "", password: "", error: "", isSubmitting: false });
        navigate(redirectTo, { replace: true });
      } else {
        setLoginData(prev => ({ 
          ...prev, 
          error: result.message || "Login failed. Please check your credentials.", 
          isSubmitting: false 
        }));
      }
    } catch (err) {
      console.error("Login error:", err);
      setLoginData(prev => ({ 
        ...prev, 
        error: "Unable to connect to server. Please try again.", 
        isSubmitting: false 
      }));
    }
  };

  // Signup form handlers
  const handleSignupChange = (field, value) => {
    setSignupData(prev => ({ ...prev, [field]: value, error: "" }));
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    setSignupData(prev => ({ ...prev, isSubmitting: true, error: "" }));

    const { name, email, password } = signupData;

    if (!name.trim() || !email.trim() || !password.trim()) {
      setSignupData(prev => ({ 
        ...prev, 
        error: "Please fill in all fields", 
        isSubmitting: false 
      }));
      return;
    }

    if (!email.includes('@')) {
      setSignupData(prev => ({ 
        ...prev, 
        error: "Please enter a valid email address", 
        isSubmitting: false 
      }));
      return;
    }

    if (password.length < 6) {
      setSignupData(prev => ({ 
        ...prev, 
        error: "Password must be at least 6 characters long", 
        isSubmitting: false 
      }));
      return;
    }

    try {
      const result = await register({ 
        name: name.trim(), 
        email: email.trim(), 
        password: password.trim() 
      });
      
      if (result.success) {
        setSignupData({ name: "", email: "", password: "", error: "", isSubmitting: false });
        navigate(redirectTo, { replace: true });
      } else {
        setSignupData(prev => ({ 
          ...prev, 
          error: result.message || "Registration failed. Please try again.", 
          isSubmitting: false 
        }));
      }
    } catch (err) {
      console.error("Registration error:", err);
      setSignupData(prev => ({ 
        ...prev, 
        error: "Unable to connect to server. Please try again.", 
        isSubmitting: false 
      }));
    }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    // Clear any errors when switching tabs
    setLoginData(prev => ({ ...prev, error: "" }));
    setSignupData(prev => ({ ...prev, error: "" }));
  };

  return (
    <div className="min-h-screen bg-[#FAF7F3] py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full">
        {/* Tab Navigation */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-[#F0E4D3] rounded-full p-1 shadow-md">
            <button
              onClick={() => switchTab("login")}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "login"
                  ? "bg-[#D9A299] text-white shadow-md"
                  : "text-[#5C4B3D] hover:text-[#D9A299]"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => switchTab("signup")}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeTab === "signup"
                  ? "bg-[#D9A299] text-white shadow-md"
                  : "text-[#5C4B3D] hover:text-[#D9A299]"
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Welcome Message */}
            <div className="bg-gradient-to-br from-[#DCC5B2] to-[#F0E4D3] p-8 lg:p-12 flex flex-col justify-center">
              <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#5C4B3D] mb-4">
                  {activeTab === "login" ? "Welcome back to LaRama" : "Join the LaRama family"}
                </h1>
                <p className="text-[#8C8A87] text-lg mb-8">
                  {activeTab === "login" 
                    ? "Access your orders, curated recommendations, and saved looks by logging in."
                    : "Join LaRama to unlock tailored style inspiration, track purchases, and craft your signature ensembles."
                  }
                </p>
                
                {/* Decorative Elements */}
                <div className="hidden lg:flex justify-center lg:justify-start space-x-4 mb-8">
                  <div className="w-12 h-12 bg-[#D9A299] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="w-12 h-12 bg-[#D9A299] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="w-12 h-12 bg-[#D9A299] rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Forms */}
            <div className="p-8 lg:p-12">
              {/* Login Form */}
              {activeTab === "login" && (
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#5C4B3D] mb-6">
                    Log in to your account
                  </h2>
                  
                  {loginData.error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {loginData.error}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#5C4B3D] mb-2">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={loginData.email}
                        onChange={(e) => handleLoginChange("email", e.target.value)}
                        className="w-full px-4 py-3 border border-[#DCC5B2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A299] focus:border-transparent transition-all duration-300"
                        placeholder="you@example.com"
                        required
                        disabled={loginData.isSubmitting || loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#5C4B3D] mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={loginData.password}
                        onChange={(e) => handleLoginChange("password", e.target.value)}
                        className="w-full px-4 py-3 border border-[#DCC5B2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A299] focus:border-transparent transition-all duration-300"
                        placeholder="Your password"
                        required
                        disabled={loginData.isSubmitting || loading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loginData.isSubmitting || loading}
                      className="w-full bg-[#D9A299] hover:bg-[#c18981] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
                    >
                      {loginData.isSubmitting ? "Logging in..." : "Login"}
                    </button>
                  </form>
                </div>
              )}

              {/* Signup Form */}
              {activeTab === "signup" && (
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#5C4B3D] mb-6">
                    Create your account
                  </h2>
                  
                  {signupData.error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {signupData.error}
                    </div>
                  )}

                  <form onSubmit={handleSignupSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#5C4B3D] mb-2">
                        Full name
                      </label>
                      <input
                        type="text"
                        value={signupData.name}
                        onChange={(e) => handleSignupChange("name", e.target.value)}
                        className="w-full px-4 py-3 border border-[#DCC5B2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A299] focus:border-transparent transition-all duration-300"
                        placeholder="Alex Taylor"
                        required
                        disabled={signupData.isSubmitting || loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#5C4B3D] mb-2">
                        Email address
                      </label>
                      <input
                        type="email"
                        value={signupData.email}
                        onChange={(e) => handleSignupChange("email", e.target.value)}
                        className="w-full px-4 py-3 border border-[#DCC5B2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A299] focus:border-transparent transition-all duration-300"
                        placeholder="you@example.com"
                        required
                        disabled={signupData.isSubmitting || loading}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#5C4B3D] mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        value={signupData.password}
                        onChange={(e) => handleSignupChange("password", e.target.value)}
                        className="w-full px-4 py-3 border border-[#DCC5B2] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D9A299] focus:border-transparent transition-all duration-300"
                        placeholder="Create a secure password (min 6 characters)"
                        required
                        disabled={signupData.isSubmitting || loading}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={signupData.isSubmitting || loading}
                      className="w-full bg-[#D9A299] hover:bg-[#c18981] disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300"
                    >
                      {signupData.isSubmitting ? "Creating account..." : "Create account"}
                    </button>
                  </form>
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-[#F0E4D3] text-center">
                <p className="text-sm text-[#8C8A87]">
                  {activeTab === "login" ? "New to LaRama? " : "Already have an account? "}
                  <button
                    onClick={() => switchTab(activeTab === "login" ? "signup" : "login")}
                    className="text-[#D9A299] hover:text-[#c18981] font-medium transition-colors duration-300"
                  >
                    {activeTab === "login" ? "Create an account" : "Sign in"}
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

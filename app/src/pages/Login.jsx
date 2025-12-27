import axios from "axios";
import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiMail, FiLock, FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useUser } from '../context/UserContext.jsx'

const Login = () => {
    const navigate = useNavigate();
    const { user, login } = useUser();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
        setError("");
    };

    useEffect(() => {
        if (user) {
            navigate("/dashboard");
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await axios.post("http://localhost:8000/api/users/login", {
                "email": formData.email,
                "password": formData.password
            });

            const { user: userData, token } = response.data;
            
            // Use the login function from context (it handles localStorage)
            login(userData, token);
            
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid email or password. Please try again.");
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full w-full bg-black text-white flex flex-col items-center justify-center font-sans">

            {/* Content Wrapper */}
            <div className="w-full max-w-80 md:max-w-90 flex flex-col px-4 md:px-0">

                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl tracking-tight text-white">Welcome back</h2>
                    <p className="text-sm text-gray-500 mt-2">
                        New here? <a href="/signup" className="text-gray-300 hover:text-white transition-colors underline decoration-gray-700 underline-offset-4">Create account</a>
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded text-red-300 text-sm">
                        {error}
                    </div>
                )}

                {/* Form Inputs */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Email</label>
                        <div className="group relative">
                            <FiMail className="absolute left-0 top-3 text-gray-500 group-focus-within:text-white transition-colors text-lg" />
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange("email", e.target.value)}
                                placeholder="name@example.com"
                                disabled={loading}
                                required
                                className="w-full bg-transparent border-b border-white/20 py-2 pl-8 text-base outline-none focus:border-white transition-colors placeholder:text-gray-700 disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider">Password</label>
                        </div>
                        <div className="group relative">
                            <FiLock className="absolute left-0 top-3 text-gray-500 group-focus-within:text-white transition-colors text-lg" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={(e) => handleChange("password", e.target.value)}
                                placeholder="Enter your password"
                                disabled={loading}
                                required
                                className="w-full bg-transparent border-b border-white/20 py-2 pl-8 pr-8 text-base outline-none focus:border-white transition-colors placeholder:text-gray-700 disabled:opacity-50"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={loading}
                                className="absolute right-0 top-3 text-gray-500 hover:text-white transition-colors disabled:opacity-50"
                            >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                        <div className="flex justify-end mt-2">
                            <a href="/forgot-password" className="text-xs text-gray-500 hover:text-white transition-colors">Forgot password?</a>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-4 w-full bg-white text-black font-semibold h-12 rounded-full flex items-center justify-center gap-2 hover:bg-gray-200 transition-transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                        {!loading && <FiArrowRight />}
                    </button>

                </form>

                {/* Divider */}
                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] uppercase">
                        <span className="bg-black px-2 text-gray-600 font-mono tracking-widest">Or</span>
                    </div>
                </div>

                {/* Google Button */}
                <button disabled={loading} className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white h-12 rounded-full flex items-center justify-center gap-3 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                    <FcGoogle size={20} />
                    <span className="text-sm font-medium">Continue with Google</span>
                </button>

            </div>
        </div>
    );
};

export default Login;
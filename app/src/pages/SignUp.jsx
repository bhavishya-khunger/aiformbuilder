import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FiArrowRight, FiMail, FiUser, FiLock } from "react-icons/fi";

const Signup = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ email: "", password: "", name: "" });

    const handleChange = (field, value) => {
        setFormData({ ...formData, [field]: value });
    };

    const submitForm = () => {
        console.log(formData);
    }

    const googleSignUp = () => {
        console.log("Google");
    }

    return (
        <div className="h-full w-full bg-black text-white flex flex-col items-center justify-center font-sans">

            {/* Content Wrapper - No Box, just width constraints */}
            <div className="w-full max-w-80 md:max-w-90 flex flex-col px-4 md:px-0">

                {/* Header */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl tracking-tight text-white">Create account</h2>
                    <p className="text-sm text-gray-500 mt-2">
                        Already a part? <a href="/login" className="text-gray-300 hover:text-white transition-colors underline decoration-gray-700 underline-offset-4">Sign In</a>
                    </p>
                </div>

                {/* Minimal Progress Bars */}
                <div className="flex gap-2 mb-8">
                    {[1, 2].map((i) => (
                        <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-white" : "bg-white/10"
                                }`}
                        />
                    ))}
                </div>

                {/* Form Inputs */}
                <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">

                    {step === 1 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Email</label>
                                <div className="group relative">
                                    <FiMail className="absolute left-0 top-3 text-gray-500 group-focus-within:text-white transition-colors text-lg" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        placeholder="name@example.com"
                                        autoFocus
                                        className="w-full bg-transparent border-b border-white/20 py-2 pl-8 text-base outline-none focus:border-white transition-colors placeholder:text-gray-700"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Password</label>
                                <div className="group relative">
                                    <FiLock className="absolute left-0 top-3 text-gray-500 group-focus-within:text-white transition-colors text-lg" />
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => handleChange("password", e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-transparent border-b border-white/20 py-2 pl-8 text-base outline-none focus:border-white transition-colors placeholder:text-gray-700"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-500 mb-2 uppercase tracking-wider">Full Name</label>
                                <div className="group relative">
                                    <FiUser className="absolute left-0 top-3 text-gray-500 group-focus-within:text-white transition-colors text-lg" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                        placeholder="John Doe"
                                        autoFocus
                                        className="w-full bg-transparent border-b border-white/20 py-2 pl-8 text-base outline-none focus:border-white transition-colors placeholder:text-gray-700"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        onClick={() => step < 2 ? setStep(step + 1) : submitForm()}
                        className="mt-6 w-full bg-white text-black font-semibold h-12 rounded-full flex items-center justify-center gap-2 hover:bg-gray-200 transition-transform active:scale-[0.98]"
                    >
                        {step === 2 ? "Finish" : "Continue"}
                        <FiArrowRight />
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
                <button
                    onClick={googleSignUp}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white h-12 rounded-full flex items-center justify-center gap-3 transition-colors"
                >
                    <FcGoogle size={20} />
                    <span className="text-sm font-medium">Continue with Google</span>
                </button>

            </div>
        </div>
    );
};

export default Signup;

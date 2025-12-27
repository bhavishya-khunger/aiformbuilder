import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Loader2, AlertCircle, Check, Sparkles,
    Edit3, Moon, Sun, ExternalLink, BarChart3, Image as ImageIcon,
    User, LogIn, ShieldCheck, ArrowRight,
    AlertTriangle,
    X,
    CircleCheck,
    Edit
} from "lucide-react";
import { FORM_API_ROUTE } from "../constants";
import { useUser } from "../context/UserContext";

const PublicFormView = () => {
    const { formId } = useParams();
    const { user } = useUser();

    const [form, setForm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [showEditOptions, setShowEditOptions] = useState(false);

    // High-quality default abstract image
    const defaultCoverImage = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";

    console.log(user)
    const isOwner = user && form?.form?.ownerId === user.id;

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const res = await axios.get(`${FORM_API_ROUTE}/public/${formId}`);
                setForm(res.data);
            } catch (err) {
                console.error("Error fetching form:", err);
                setError("This form is currently unavailable.");
            } finally {
                setLoading(false);
            }
        };
        fetchForm();
    }, [formId]);

    // Set dark mode based on system preference
    useEffect(() => {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDark);
        console.log(user);
        console.log(form);
    }, []);

    const handleInputChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!user) {
            if (window.confirm("You need to be logged in to submit this form. Would you like to login now?")) {
                window.location.href = "/login";
            }
            return;
        }

        setIsSubmitting(true);

        setTimeout(() => {
            console.log("📝 FORM SUBMISSION:", { formId, answers });
            setSubmitted(true);
            setIsSubmitting(false);
        }, 800);
    };

    const handleClearForm = () => {
        if (window.confirm("Clear all responses?")) {
            setAnswers({});
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const navigateToEdit = () => {
        window.location.href = `/dashboard/forms/${formId}/edit`;
    };

    const navigateToAnalytics = () => {
        window.location.href = `/dashboard/forms/${formId}/analytics`;
    };

    // --- PREMIUM THEME CONFIGURATION ---
    const theme = {
        // Main Background: Off-white for light, Pure Black for dark
        bg: darkMode ? "bg-black" : "bg-[#FDFDFD]",

        text: {
            primary: darkMode ? "text-neutral-100" : "text-neutral-900",
            secondary: darkMode ? "text-neutral-400" : "text-neutral-500",
            muted: darkMode ? "text-neutral-600" : "text-neutral-400",
            accent: darkMode ? "text-white" : "text-black"
        },

        border: darkMode ? "border-neutral-800" : "border-neutral-200",

        // Cards: Dark mode gets a very subtle off-black, Light mode gets white
        card: darkMode ? "bg-neutral-950/50" : "bg-white",

        input: {
            // Inputs are filled slightly to distinguish them without harsh borders
            bg: darkMode ? "bg-neutral-900" : "bg-neutral-100",
            border: darkMode ? "border-neutral-800" : "border-transparent",
            focus: darkMode
                ? "focus:bg-black focus:ring-2 focus:ring-neutral-700 focus:border-neutral-700"
                : "focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:border-neutral-300",
            placeholder: darkMode ? "placeholder-neutral-600" : "placeholder-neutral-400"
        },

        button: {
            // Monochrome luxury buttons
            primary: darkMode
                ? "bg-white text-black hover:bg-neutral-200 shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                : "bg-black text-white hover:bg-neutral-800 shadow-lg shadow-neutral-200",
            secondary: darkMode
                ? "bg-neutral-900 text-neutral-300 hover:bg-neutral-800 border border-neutral-800"
                : "bg-white text-neutral-700 hover:bg-neutral-50 border border-neutral-200 shadow-sm",
            danger: "text-red-500 hover:bg-red-500/10"
        }
    };

    // --- LOADING STATE ---
    if (loading) return (
        <div className={`min-h-screen ${theme.bg} flex flex-col items-center justify-center`}>
            <div className="flex flex-col items-center gap-6">
                <Loader2 className={`h-8 w-8 animate-spin ${theme.text.primary}`} />
            </div>
        </div>
    );

    // --- ERROR STATE ---
    if (error) return (
        <div className={`min-h-screen ${theme.bg} flex items-center justify-center p-6`}>
            <div className={`max-w-md text-center space-y-6 p-8 rounded-2xl ${darkMode ? 'border border-neutral-800' : ''}`}>
                <div className={`h-16 w-16 ${darkMode ? 'bg-neutral-900' : 'bg-neutral-100'} rounded-full flex items-center justify-center mx-auto`}>
                    <AlertCircle className="h-8 w-8 text-neutral-500" />
                </div>
                <div className="space-y-2">
                    <h2 className={`text-xl font-semibold ${theme.text.primary}`}>Form Unavailable</h2>
                    <p className={theme.text.secondary}>{error}</p>
                </div>
                <button
                    onClick={() => window.location.href = '/'}
                    className={`text-sm ${theme.text.primary} underline underline-offset-4 hover:opacity-70`}
                >
                    Return to home
                </button>
            </div>
        </div>
    );

    // --- SUCCESS STATE ---
    if (submitted) return (
        <div className={`min-h-screen ${theme.bg} flex flex-col items-center justify-center p-6 transition-colors duration-500`}>
            <div className={`max-w-md w-full text-center space-y-8 p-10 rounded-3xl ${darkMode ? 'bg-neutral-900/30 border border-neutral-800' : 'bg-white shadow-xl shadow-neutral-100'}`}>
                <div className="relative">
                    <div className={`h-24 w-24 ${darkMode ? 'bg-green-500/10' : 'bg-green-50'} rounded-full flex items-center justify-center mx-auto`}>
                        <Check className="h-10 w-10 text-green-500" />
                    </div>
                    <Sparkles className="absolute top-0 right-1/4 h-6 w-6 text-yellow-500 animate-pulse" />
                </div>

                <div className="space-y-3">
                    <h1 className={`text-3xl font-bold tracking-tight ${theme.text.primary}`}>Response Submitted</h1>
                    <p className={theme.text.secondary}>
                        Your response has been securely recorded.
                    </p>
                </div>

                <button
                    onClick={() => window.location.reload()}
                    className={`w-full py-4 rounded-xl font-medium transition-all duration-300 ${theme.button.primary}`}
                >
                    Submit another response
                </button>
            </div>
        </div>
    );

    return (
        <div className={`min-h-screen ${theme.bg} transition-colors duration-500 selection:bg-neutral-500/20`}>

            {/* Owner Header (Glassmorphism) */}
            {isOwner && (
                <header className={`fixed top-0 left-0 right-0 z-50 border-b ${theme.border} ${darkMode ? 'bg-black/80' : 'bg-white/80'} backdrop-blur-md`}>
                    <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
                        <div className={`text-sm font-medium ${theme.text.secondary} flex items-center gap-2`}>
                            <ImageIcon className="h-4 w-4" />
                            <span className="hidden sm:inline tracking-tight">Public View</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <button onClick={toggleDarkMode} className={`p-2 rounded-lg ${theme.button.secondary}`}>
                                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setShowEditOptions(!showEditOptions)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${theme.button.secondary} text-sm font-medium`}
                                >
                                    <Edit3 className="h-4 w-4" />
                                    <span className="hidden sm:inline">Manage</span>
                                </button>

                                {showEditOptions && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setShowEditOptions(false)} />
                                        <div className={`absolute right-0 mt-2 w-56 rounded-xl border ${theme.border} ${darkMode ? 'bg-neutral-900' : 'bg-white'} shadow-2xl z-50 overflow-hidden py-1`}>
                                            <button onClick={navigateToEdit} className={`flex items-center gap-3 w-full px-4 py-3 text-sm ${theme.text.primary} hover:${darkMode ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
                                                <Edit3 className="h-4 w-4" /> Edit Form
                                            </button>
                                            <button onClick={navigateToAnalytics} className={`flex items-center gap-3 w-full px-4 py-3 text-sm ${theme.text.primary} hover:${darkMode ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
                                                <BarChart3 className="h-4 w-4" /> Analytics
                                            </button>
                                            <div className={`h-px mx-4 ${darkMode ? 'bg-neutral-800' : 'bg-neutral-100'}`} />
                                            <button onClick={() => window.location.href = '/dashboard'} className={`flex items-center gap-3 w-full px-4 py-3 text-sm ${theme.text.primary} hover:${darkMode ? 'bg-neutral-800' : 'bg-neutral-50'}`}>
                                                <ExternalLink className="h-4 w-4" /> Dashboard
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>
            )}

            <main className={`max-w-2xl mx-auto px-4 ${isOwner ? 'pt-24' : 'pt-12'} pb-32`}>

                {/* Cover Image - Sleek Aspect Ratio */}
                <div className={`mb-10 overflow-hidden rounded-2xl border ${theme.border} shadow-sm group`}>
                    <div className="relative h-40 sm:h-52 w-full">
                        <img
                            src={defaultCoverImage}
                            alt="Form cover"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className={`absolute inset-0 ${darkMode ? 'bg-black/20' : 'bg-black/5'}`} />
                    </div>
                </div>

                {/* Form Title Block - Minimalist */}
                <div className="mb-12 space-y-6">
                    <h1 className={`text-3xl sm:text-5xl font-bold tracking-tighter ${theme.text.primary} leading-tight`}>
                        {form?.form?.title}
                    </h1>

                    {form?.form?.description && (
                        <div className={`pl-4 border-l-2 ${darkMode ? 'border-neutral-800' : 'border-neutral-200'}`}>
                            <p className={`text-base ${theme.text.secondary} leading-relaxed`}>
                                {form.form.description}
                            </p>
                        </div>
                    )}

                    {/* User Identity Pill */}
                    <div
                        onClick={!user ? () => window.location.href = "/login" : undefined}
                        className={`relative inline-flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${user ? '' : 'hover:scale-[1.02] active:scale-[0.98]'} ${user
                            ? `${darkMode ? 'bg-green-900/30 border-green-700 text-green-300' : 'bg-green-100 border-green-300 text-green-700'}`
                            : `${darkMode ? 'bg-red-900/30 border-red-700 text-red-300 hover:bg-red-900/40' : 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200'}`
                            } border-2 shadow-sm`}
                    >
                        {/* Pulsing animation for login required */}
                        {!user && (
                            <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${darkMode ? 'bg-red-500' : 'bg-red-500'} animate-ping`} />
                        )}
                        {!user && (
                            <div className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${darkMode ? 'bg-red-600' : 'bg-red-600'}`} />
                        )}

                        {user ? (
                            <>
                                <div className={`h-7 w-7 rounded-full flex items-center justify-center ${darkMode ? 'bg-green-800 text-green-300' : 'bg-green-600 text-white'
                                    }`}>
                                    <User className="h-3.5 w-3.5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-xs flex justify-start items-center gap-1 opacity-90">
                                        <CircleCheck className="h-3 w-3" />
                                        Signed in as {user.fullname}
                                    </span>
                                    <span className="text-sm font-semibold">
                                        {user.name || user.email}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-red-800 text-red-300' : 'bg-red-600 text-white'
                                    }`}>
                                    <LogIn className="h-4 w-4" />
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="text-base font-semibold">
                                        Login Required to Submit
                                    </span>
                                    <span className="text-xs flex items-center mt-1 gap-1 opacity-90">
                                        Your progress will not be saved. Click to Login.
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Questions */}
                <form onSubmit={handleSubmit} className="space-y-12">
                    {form?.questions?.map((q) => (
                        <div key={q._id} className="group transition-all duration-300">
                            <div className="space-y-4">
                                {/* Question Text */}
                                <label className={`block text-xl font-medium tracking-tight ${theme.text.primary}`}>
                                    {q.questionText}
                                    {q.required && <span className="text-red-500 ml-1 text-base align-top">*</span>}
                                </label>

                                {q.description && (
                                    <p className={`text-sm ${theme.text.secondary}`}>
                                        {q.description}
                                    </p>
                                )}

                                {/* Inputs */}
                                <div className="pt-2">
                                    {q.type === "short_text" && (
                                        <input
                                            type="text"
                                            required={q.required}
                                            className={`w-full px-4 py-3.5 rounded-lg text-base outline-none transition-all duration-300 ${theme.input.bg} ${theme.input.border} border ${theme.text.primary} ${theme.input.focus} ${theme.input.placeholder}`}
                                            placeholder="Type your answer here..."
                                            onChange={(e) => handleInputChange(q._id, e.target.value)}
                                            value={answers[q._id] || ""}
                                        />
                                    )}

                                    {q.type === "long_text" && (
                                        <textarea
                                            required={q.required}
                                            rows="4"
                                            className={`w-full px-4 py-3.5 rounded-lg text-base outline-none transition-all duration-300 resize-none ${theme.input.bg} ${theme.input.border} border ${theme.text.primary} ${theme.input.focus} ${theme.input.placeholder}`}
                                            placeholder="Type your detailed answer here..."
                                            onChange={(e) => handleInputChange(q._id, e.target.value)}
                                            value={answers[q._id] || ""}
                                        />
                                    )}

                                    {q.type === "email" && (
                                        <input
                                            type="email"
                                            required={q.required}
                                            className={`w-full px-4 py-3.5 rounded-lg text-base outline-none transition-all duration-300 ${theme.input.bg} ${theme.input.border} border ${theme.text.primary} ${theme.input.focus} ${theme.input.placeholder}`}
                                            placeholder="you@example.com"
                                            onChange={(e) => handleInputChange(q._id, e.target.value)}
                                            value={answers[q._id] || ""}
                                        />
                                    )}

                                    {q.type === "number" && (
                                        <input
                                            type="number"
                                            required={q.required}
                                            className={`w-full px-4 py-3.5 rounded-lg text-base outline-none transition-all duration-300 ${theme.input.bg} ${theme.input.border} border ${theme.text.primary} ${theme.input.focus} ${theme.input.placeholder}`}
                                            placeholder="Enter a number"
                                            onChange={(e) => handleInputChange(q._id, e.target.value)}
                                            value={answers[q._id] || ""}
                                        />
                                    )}

                                    {q.type === "date" && (
                                        <input
                                            type="date"
                                            required={q.required}
                                            className={`w-full max-w-xs px-4 py-3.5 rounded-lg text-base outline-none transition-all duration-300 ${theme.input.bg} ${theme.input.border} border ${theme.text.primary} ${theme.input.focus} ${theme.input.placeholder}`}
                                            onChange={(e) => handleInputChange(q._id, e.target.value)}
                                            value={answers[q._id] || ""}
                                        />
                                    )}

                                    {q.type === "time" && (
                                        <input
                                            type="time"
                                            required={q.required}
                                            className={`w-full max-w-xs px-4 py-3.5 rounded-lg text-base outline-none transition-all duration-300 ${theme.input.bg} ${theme.input.border} border ${theme.text.primary} ${theme.input.focus} ${theme.input.placeholder}`}
                                            onChange={(e) => handleInputChange(q._id, e.target.value)}
                                            value={answers[q._id] || ""}
                                        />
                                    )}

                                    {q.type === "url" && (
                                        <input
                                            type="url"
                                            required={q.required}
                                            className={`w-full px-4 py-3.5 rounded-lg text-base outline-none transition-all duration-300 ${theme.input.bg} ${theme.input.border} border ${theme.text.primary} ${theme.input.focus} ${theme.input.placeholder}`}
                                            placeholder="https://example.com"
                                            onChange={(e) => handleInputChange(q._id, e.target.value)}
                                            value={answers[q._id] || ""}
                                        />
                                    )}

                                    {q.type === "phone" && (
                                        <input
                                            type="tel"
                                            required={q.required}
                                            className={`w-full px-4 py-3.5 rounded-lg text-base outline-none transition-all duration-300 ${theme.input.bg} ${theme.input.border} border ${theme.text.primary} ${theme.input.focus} ${theme.input.placeholder}`}
                                            placeholder="(123) 456-7890"
                                            onChange={(e) => handleInputChange(q._id, e.target.value)}
                                            value={answers[q._id] || ""}
                                        />
                                    )}

                                    {q.type === "mcq" && (
                                        <div className="grid gap-3">
                                            {q.options.map((opt, i) => (
                                                <label
                                                    key={i}
                                                    className={`relative flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 group/opt ${answers[q._id] === (opt.value || opt.label)
                                                        ? darkMode
                                                            ? 'border-white bg-neutral-900'
                                                            : 'border-black bg-neutral-50'
                                                        : theme.border
                                                        } hover:border-opacity-100`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name={q._id}
                                                        value={opt.value || opt.label}
                                                        required={q.required}
                                                        onChange={(e) => handleInputChange(q._id, e.target.value)}
                                                        checked={answers[q._id] === (opt.value || opt.label)}
                                                        className="peer sr-only"
                                                    />

                                                    {/* Custom Radio Circle */}
                                                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center mr-4 transition-all ${answers[q._id] === (opt.value || opt.label)
                                                        ? darkMode ? 'border-white' : 'border-black'
                                                        : 'border-neutral-400'
                                                        }`}>
                                                        <div className={`h-2.5 w-2.5 rounded-full transition-transform duration-200 ${answers[q._id] === (opt.value || opt.label)
                                                            ? `scale-100 ${darkMode ? 'bg-white' : 'bg-black'}`
                                                            : 'scale-0'
                                                            }`} />
                                                    </div>

                                                    <span className={`text-base font-medium ${theme.text.primary}`}>
                                                        {opt.label}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    )}

                                    {q.type === "checkbox" && (
                                        <div className="grid gap-3">
                                            {q.options.map((opt, i) => {
                                                const currentAnswers = answers[q._id] || [];
                                                const isChecked = Array.isArray(currentAnswers)
                                                    ? currentAnswers.includes(opt.value || opt.label)
                                                    : false;

                                                return (
                                                    <label
                                                        key={i}
                                                        className={`relative flex items-center p-4 rounded-lg border cursor-pointer transition-all duration-200 group/opt ${isChecked
                                                            ? darkMode
                                                                ? 'border-white bg-neutral-900'
                                                                : 'border-black bg-neutral-50'
                                                            : theme.border
                                                            } hover:border-opacity-100`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            name={q._id}
                                                            value={opt.value || opt.label}
                                                            onChange={(e) => {
                                                                const currentAnswers = answers[q._id] || [];
                                                                let newAnswers;
                                                                if (e.target.checked) {
                                                                    newAnswers = [...currentAnswers, e.target.value];
                                                                } else {
                                                                    newAnswers = currentAnswers.filter(v => v !== e.target.value);
                                                                }
                                                                handleInputChange(q._id, newAnswers);
                                                            }}
                                                            checked={isChecked}
                                                            className="peer sr-only"
                                                        />

                                                        {/* Custom Checkbox */}
                                                        <div className={`h-5 w-5 rounded border flex items-center justify-center mr-4 transition-all ${isChecked
                                                            ? darkMode
                                                                ? 'border-white bg-white'
                                                                : 'border-black bg-black'
                                                            : 'border-neutral-400'
                                                            }`}>
                                                            {isChecked && (
                                                                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth="3"
                                                                        d="M5 13l4 4L19 7"
                                                                        className={darkMode ? 'text-black' : 'text-white'}
                                                                    />
                                                                </svg>
                                                            )}
                                                        </div>

                                                        <span className={`text-base font-medium ${theme.text.primary}`}>
                                                            {opt.label}
                                                        </span>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {q.type === "dropdown" && (
                                        <select
                                            required={q.required}
                                            className={`w-full max-w-xs px-4 py-3.5 rounded-lg text-base outline-none transition-all duration-300 ${theme.input.bg} ${theme.input.border} border ${theme.text.primary} ${theme.input.focus} appearance-none`}
                                            onChange={(e) => handleInputChange(q._id, e.target.value)}
                                            value={answers[q._id] || ""}
                                        >
                                            <option value="" disabled>Select an option</option>
                                            {q.options.map((opt, i) => (
                                                <option key={i} value={opt.value || opt.label}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    {q.type === "linear_scale" && (
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className={`text-sm ${theme.text.secondary}`}>
                                                    {q.scaleLabels?.min || "Strongly disagree"}
                                                </span>
                                                <span className={`text-sm ${theme.text.secondary}`}>
                                                    {q.scaleLabels?.max || "Strongly agree"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between gap-2">
                                                {Array.from({ length: q.scaleRange || 5 }, (_, i) => i + 1).map((num) => (
                                                    <label
                                                        key={num}
                                                        className={`flex-1 flex flex-col items-center`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={q._id}
                                                            value={num}
                                                            required={q.required}
                                                            onChange={(e) => handleInputChange(q._id, e.target.value)}
                                                            checked={answers[q._id] === num.toString()}
                                                            className="peer sr-only"
                                                        />
                                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-1 cursor-pointer transition-all ${answers[q._id] === num.toString()
                                                            ? darkMode
                                                                ? 'bg-blue-600 text-white'
                                                                : 'bg-blue-600 text-white'
                                                            : darkMode
                                                                ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}>
                                                            {num}
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {q.type === "rating" && (
                                        <div className="space-y-2">
                                            <div className="flex justify-center gap-1">
                                                {Array.from({ length: q.ratingMax || 5 }, (_, i) => i + 1).map((star) => {
                                                    const isSelected = answers[q._id] && parseInt(answers[q._id]) >= star;
                                                    return (
                                                        <label key={star} className="cursor-pointer">
                                                            <input
                                                                type="radio"
                                                                name={q._id}
                                                                value={star}
                                                                required={q.required}
                                                                onChange={(e) => handleInputChange(q._id, e.target.value)}
                                                                checked={answers[q._id] === star.toString()}
                                                                className="peer sr-only"
                                                            />
                                                            <svg
                                                                className={`w-10 h-10 transition-transform hover:scale-110 ${isSelected
                                                                    ? darkMode ? 'text-yellow-400 fill-yellow-400' : 'text-yellow-500 fill-yellow-500'
                                                                    : darkMode ? 'text-gray-600' : 'text-gray-300'
                                                                    }`}
                                                                fill="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                                            </svg>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className={`${theme.text.secondary}`}>{q.ratingLabels?.min || "Poor"}</span>
                                                <span className={`${theme.text.secondary}`}>{q.ratingLabels?.max || "Excellent"}</span>
                                            </div>
                                        </div>
                                    )}

                                    {q.type === "file_upload" && (
                                        <div className="space-y-4">
                                            <label className={`flex flex-col items-center justify-center w-full p-8 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-200 hover:border-opacity-80 ${theme.border} ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                                                <input
                                                    type="file"
                                                    required={q.required}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleInputChange(q._id, file.name);
                                                    }}
                                                    className="hidden"
                                                    accept={q.acceptedFiles || "*/*"}
                                                />
                                                <div className="flex flex-col items-center justify-center">
                                                    <svg className={`w-12 h-12 mb-3 ${theme.text.muted}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                    </svg>
                                                    <p className={`mb-1 text-sm ${theme.text.primary}`}>
                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                    </p>
                                                    <p className={`text-xs ${theme.text.muted}`}>
                                                        {q.acceptedFiles === "image/*"
                                                            ? "PNG, JPG, GIF up to 10MB"
                                                            : q.acceptedFiles === ".pdf,.doc,.docx"
                                                                ? "PDF, DOC, DOCX up to 10MB"
                                                                : "Any file up to 10MB"}
                                                    </p>
                                                </div>
                                            </label>
                                            {answers[q._id] && (
                                                <div className={`flex items-center justify-between p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                                    <span className={`text-sm truncate ${theme.text.primary}`}>
                                                        📎 {answers[q._id]}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleInputChange(q._id, "")}
                                                        className={`text-sm ${darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'}`}
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {q.type === "yes_no" && (
                                        <div className="flex gap-4">
                                            <label className={`flex-1 flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${answers[q._id] === "yes"
                                                ? darkMode
                                                    ? 'border-green-500 bg-green-900/20'
                                                    : 'border-green-600 bg-green-50'
                                                : theme.border
                                                } hover:border-opacity-100`}>
                                                <input
                                                    type="radio"
                                                    name={q._id}
                                                    value="yes"
                                                    required={q.required}
                                                    onChange={(e) => handleInputChange(q._id, e.target.value)}
                                                    checked={answers[q._id] === "yes"}
                                                    className="peer sr-only"
                                                />
                                                <span className={`text-base font-medium ${answers[q._id] === "yes" ? darkMode ? 'text-green-400' : 'text-green-700' : theme.text.primary}`}>
                                                    Yes
                                                </span>
                                            </label>
                                            <label className={`flex-1 flex items-center justify-center p-4 rounded-lg border cursor-pointer transition-all duration-200 ${answers[q._id] === "no"
                                                ? darkMode
                                                    ? 'border-red-500 bg-red-900/20'
                                                    : 'border-red-600 bg-red-50'
                                                : theme.border
                                                } hover:border-opacity-100`}>
                                                <input
                                                    type="radio"
                                                    name={q._id}
                                                    value="no"
                                                    required={q.required}
                                                    onChange={(e) => handleInputChange(q._id, e.target.value)}
                                                    checked={answers[q._id] === "no"}
                                                    className="peer sr-only"
                                                />
                                                <span className={`text-base font-medium ${answers[q._id] === "no" ? darkMode ? 'text-red-400' : 'text-red-700' : theme.text.primary}`}>
                                                    No
                                                </span>
                                            </label>
                                        </div>
                                    )}

                                    {q.type === "multiple_choice_grid" && (
                                        <div className="overflow-x-auto">
                                            <table className="w-full border-collapse">
                                                <thead>
                                                    <tr>
                                                        <th className={`p-3 ${theme.border} border-b ${theme.text.secondary} font-normal text-left`}></th>
                                                        {q.columns?.map((col, colIndex) => (
                                                            <th key={colIndex} className={`p-3 ${theme.border} border-b ${theme.text.secondary} font-normal text-center`}>
                                                                {col.label}
                                                            </th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {q.rows?.map((row, rowIndex) => (
                                                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? darkMode ? 'bg-gray-800/30' : 'bg-gray-50' : ''}>
                                                            <td className={`p-3 ${theme.border} border-b ${theme.text.primary} font-medium`}>
                                                                {row.label}
                                                            </td>
                                                            {q.columns?.map((col, colIndex) => {
                                                                const answerKey = `${q._id}_${row.value || row.label}`;
                                                                const isChecked = answers[answerKey] === (col.value || col.label);
                                                                return (
                                                                    <td key={colIndex} className={`p-3 ${theme.border} border-b text-center`}>
                                                                        <label className="inline-flex items-center cursor-pointer">
                                                                            <input
                                                                                type="radio"
                                                                                name={answerKey}
                                                                                value={col.value || col.label}
                                                                                required={q.required}
                                                                                onChange={(e) => handleInputChange(answerKey, e.target.value)}
                                                                                checked={isChecked}
                                                                                className="peer sr-only"
                                                                            />
                                                                            <div className={`h-5 w-5 rounded-full border mx-auto ${isChecked
                                                                                ? darkMode
                                                                                    ? 'border-white'
                                                                                    : 'border-black'
                                                                                : 'border-gray-400'
                                                                                }`}>
                                                                                <div className={`h-2.5 w-2.5 rounded-full m-auto mt-1 transition-transform duration-200 ${isChecked
                                                                                    ? `scale-100 ${darkMode ? 'bg-white' : 'bg-black'}`
                                                                                    : 'scale-0'
                                                                                    }`} />
                                                                            </div>
                                                                        </label>
                                                                    </td>
                                                                );
                                                            })}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Floating Bottom Bar (Mobile & Desktop) */}
                    <div className={`fixed bottom-0 left-0 right-0 p-6 z-40`}>
                        <div className={`max-w-2xl mx-auto rounded-2xl border ${theme.border} ${darkMode ? 'bg-neutral-900/80' : 'bg-white/80'} backdrop-blur-xl shadow-2xl p-4 flex items-center justify-between gap-4`}>

                            <button
                                type="button"
                                onClick={handleClearForm}
                                className={`text-sm font-medium ${theme.text.muted} hover:${theme.text.primary} transition-colors px-4`}
                            >
                                Clear
                            </button>

                            <div className="flex items-center gap-4">
                                {!user && (
                                    <span className={`hidden sm:block text-xs ${theme.text.muted}`}>
                                        Login required
                                    </span>
                                )}

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${theme.button.primary}`}
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            Submit Response
                                            <ArrowRight className="h-4 w-4" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Powered By (Outside the card) */}
                        <div className="text-center mt-2">
                            <span className={`text-[10px] font-medium tracking-widest uppercase ${theme.text.muted} opacity-50`}>
                                Powered by Formify
                            </span>
                        </div>
                    </div>
                </form>

                {/* Dark Mode Toggle (Floating for non-owners) */}
                {!isOwner && (
                    <button
                        onClick={toggleDarkMode}
                        className={`fixed top-6 right-6 p-3 rounded-full ${darkMode ? 'bg-neutral-900 text-white' : 'bg-white text-black'} shadow-xl z-50 transition-transform hover:scale-110`}
                    >
                        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>
                )}
            </main>
        </div>
    );
};

export default PublicFormView;
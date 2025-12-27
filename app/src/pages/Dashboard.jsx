import React, { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Settings,
    LogOut,
    FileText,
    BarChart2,
    Sparkles,
    MessageSquare,
    Menu,
    X,
    Zap
} from "lucide-react";
import { RiGeminiFill } from "react-icons/ri";

// Import Custom Components
import { SidebarItem } from "../components/Shared";
import DashboardTab from "../components/DashboardTab";
import FormsTab from "../components/FormsTab";
import AnalyticsTab from "../components/AnalyticsTab";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FORM_API_ROUTE, USER_API_ROUTE } from "../constants";

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState("dashboard");
    const [forms, setForms] = useState();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [credits] = useState(5);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const { user, logout, token } = useUser();
    const navigate = useNavigate();

    const userName = user?.fullname || "User";
    const userInitial = userName.charAt(0).toUpperCase();
    const nameLength = userName.length;

    // fetch forms

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await axios.get(`${FORM_API_ROUTE}/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                console.log(response);
                setForms(response.data)

            } catch (error) {
                console.error("Failed to fetch forms:", error);
            }
        };
        fetchForms();
    }, []);

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
        setIsMobileMenuOpen(false);
    };

    const confirmLogout = () => {
        logout();
        setShowLogoutModal(false);
        navigate("/login", { replace: true });
    };

    const renderContent = () => {
        switch (activeTab) {
            case "dashboard":
                return <DashboardTab forms={forms} setForms={setForms} />;
            case "forms":
                return <FormsTab forms={forms} setForms={setForms} />;
            case "analytics":
                return <AnalyticsTab />;
            case "templates":
                return (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                        <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-500">
                            <Sparkles size={32} />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">AI Templates</h2>
                        <p className="text-gray-500">Coming soon.</p>
                    </div>
                );
            case "settings":
                return (
                    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                        <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-500">
                            <Settings size={32} />
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">Settings</h2>
                        <p className="text-gray-500">User preferences coming soon.</p>
                    </div>
                );
            default:
                return <FormsTab forms={forms} setForms={setForms} />;
        }
    };

    return (
        <div className="flex h-screen w-full bg-black text-white font-sans overflow-hidden">

            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="w-full max-w-sm bg-[#09090b] border border-white/10 rounded-2xl shadow-2xl p-6 relative overflow-hidden">

                        {/* Ambient Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-red-500/50 blur-[20px]" />

                        <div className="flex flex-col items-center text-center">

                            <h2 className="text-xl font-semibold text-white mb-2">Sign out</h2>
                            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                                Are you sure you want to sign out of your account?
                                You will need to enter your credentials to access your workspace again.
                            </p>

                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={() => setShowLogoutModal(false)}
                                    className="flex-1 px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-800 cursor-pointer transition-colors border border-transparent hover:border-white/50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmLogout}
                                    className="flex-1 px-3 py-2 rounded-lg text-sm cursor-pointer font-medium text-white bg-red-950 hover:bg-red-900 border border-transparent hover:border-white/50 transition-all"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SIDEBAR */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#050505] border-r border-white/10 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
                <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
                    <span className="flex gap-2 items-center justify-center">
                        <RiGeminiFill size={22} className="text-white" />
                        <span className="text-xl font-serif tracking-tight">
                            <span className="italic text-gray-300">Formify</span>AI
                        </span>
                    </span>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8">
                    <div className="space-y-1">
                        <p className="px-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Workspace</p>
                        <SidebarItem icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false) }} />
                        <SidebarItem icon={FileText} label="My Forms" active={activeTab === 'forms'} onClick={() => { setActiveTab('forms'); setIsMobileMenuOpen(false) }} />
                        <SidebarItem icon={BarChart2} label="Analytics" active={activeTab === 'analytics'} onClick={() => { setActiveTab('analytics'); setIsMobileMenuOpen(false) }} />
                        <SidebarItem icon={Sparkles} label="Templates" badge="New" active={activeTab === 'templates'} onClick={() => { setActiveTab('templates'); setIsMobileMenuOpen(false) }} />
                    </div>

                    <div className="space-y-1">
                        <p className="px-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Configuration</p>
                        <SidebarItem icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false) }} />
                        <SidebarItem icon={MessageSquare} label="Feedback" onClick={() => setIsMobileMenuOpen(false)} />
                    </div>

                    <div className="space-y-1">
                        <p className="px-3 text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">Resources</p>
                        <SidebarItem icon={FileText} label="GitHub" onClick={() => window.open("https://github.com", "_blank")} />
                    </div>
                </div>

                <div className="p-4 border-t border-white/10">
                    <SidebarItem icon={LogOut} label="Sign Out" onClick={handleLogoutClick} />
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 flex flex-col min-w-0 bg-black relative">

                {/* Header */}
                <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-8 bg-black/80 backdrop-blur-md sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden cursor-pointer text-gray-400 hover:text-white">
                            <Menu size={24} />
                        </button>
                        <h1 className="text-lg font-medium tracking-tight capitalize text-gray-200">
                            {activeTab.replace('-', ' ')}
                        </h1>
                    </div>

                    <div className="flex select-none items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                            <Zap size={14} className="text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-mono font-medium text-gray-200">
                                {credits} <span className="hidden sm:inline text-gray-500">Credits</span>
                            </span>
                        </div>
                        <div
                            style={{
                                backgroundColor: `hsla(${(nameLength * 50) % 360}, 70%, 50%, 0.7)`
                            }}
                            className="h-8 w-8 select-none font-semibold text-xl flex items-center justify-center rounded-full border border-white/20 ring-2 ring-black">
                            {userInitial}
                        </div>
                    </div>
                </header>

                {/* Dynamic Content Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
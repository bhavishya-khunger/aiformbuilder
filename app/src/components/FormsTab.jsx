import React, { useState } from "react";
import {
    Plus, Search, MoreHorizontal, FileText, Sparkles,
    Edit, ExternalLink, Trash2, Users, Clock, BrainCircuit
} from "lucide-react";
import { Badge } from "../components/Shared";
import { useNavigate } from "react-router-dom";

// Helper: Generate consistent gradient based on string (ID)
const getGradient = (str) => {
    const gradients = [
        "from-purple-500/20 to-blue-500/20",
        "from-emerald-500/20 to-teal-500/20",
        "from-orange-500/20 to-red-500/20",
        "from-pink-500/20 to-rose-500/20",
        "from-cyan-500/20 to-blue-500/20",
    ];
    const index = str.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[index % gradients.length];
};

// Helper: Simple "Time Ago" formatter
const timeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString();
};

const FormsTab = ({ forms = [], setForms, allowSearch = true }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeDropdown, setActiveDropdown] = useState(null);
    const navigate = useNavigate();

    const toggleDropdown = (id) => {
        setActiveDropdown(activeDropdown === id ? null : id);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this form?")) {
            // Note: In real app, call API here
            setForms(forms.filter((f) => f._id !== id));
            setActiveDropdown(null);
        }
    };

    // Filter Logic (Safety check for null titles)
    const filteredForms = forms.filter((form) =>
        (form.title || "Untitled").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div onClick={() => {setActiveDropdown(null)}} className="h-full w-full">
            
            {/* Search Bar (Conditionally Rendered) */}
            {allowSearch && (
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="relative group w-full max-w-md">
                        <Search className="absolute left-3 top-2.5 text-gray-500 group-focus-within:text-white transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search your forms..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0A0A0A] border rounded-xl border-white/10 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-white/30 transition-all placeholder:text-gray-600 text-gray-200"
                        />
                    </div>
                </div>
            )}

            {/* Forms Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">

                {/* Create New Card (Always First) */}
                <div className="group relative flex flex-col items-center justify-center h-70 rounded-2xl border border-dashed border-white/10 hover:border-white/30 hover:bg-white/5 transition-all cursor-pointer">
                    <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-white/10 transition-all shadow-lg shadow-black/50">
                        <Plus size={28} className="text-gray-400 group-hover:text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Create New Form</span>
                    <span className="text-xs text-gray-600 mt-1">Start from scratch or use AI</span>
                </div>

                {/* Existing Forms */}
                {filteredForms.length > 0 ? (
                    filteredForms.map((form) => {
                        const gradient = getGradient(form._id);
                        return (
                            <div
                                key={form._id}
                                onClick={() => navigate(`/form/${form._id}`)}
                                className="group cursor-pointer relative bg-[#0A0A0A] border border-white/10 rounded-2xl hover:border-white/20 transition-all hover:shadow-2xl hover:shadow-black/50 flex flex-col h-70 overflow-hidden"
                            >
                                {/* Cover Area */}
                                <div className={`h-32 bg-linear-to-br ${gradient} p-4 flex items-start justify-between relative`}>
                                    
                                    {/* Icon Badge */}
                                    <div className="p-2.5 rounded-xl bg-black/20 backdrop-blur-md border border-white/10 text-white/90 shadow-sm">
                                        {form.type === "quiz" ? <Sparkles size={20} /> : <FileText size={20} />}
                                    </div>

                                    {/* Status Badge */}
                                    <Badge color={form.status === "published" ? "green" : form.status === "draft" ? "gray" : "yellow"}>
                                        {form.status}
                                    </Badge>

                                    {/* AI Badge (Optional) */}
                                    {form.aiGenerated && (
                                        <div className="absolute bottom-3 left-3 px-2 py-1 rounded-md bg-black/30 backdrop-blur-sm border border-white/10 flex items-center gap-1.5">
                                            <BrainCircuit size={12} className="text-purple-300" />
                                            <span className="text-[10px] font-medium text-white/80 uppercase tracking-wide">AI Generated</span>
                                        </div>
                                    )}
                                </div>

                                {/* Card Content */}
                                <div className="p-5 flex flex-col flex-1 justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-medium text-gray-100 line-clamp-2 leading-snug text-lg group-hover:text-white transition-colors" title={form.title}>
                                                {form.title}
                                            </h3>
                                            
                                            {/* Context Menu Trigger */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleDropdown(form._id);
                                                }}
                                                className="text-gray-500 hover:text-white transition-colors p-1 -mr-2 -mt-1 rounded-md hover:bg-white/5"
                                            >
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Footer Metrics */}
                                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-4">
                                        <div className="flex items-center gap-2 text-gray-500" title="Total Responses">
                                            <Users size={14} />
                                            <span className="text-xs font-medium">{form.responses || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500" title={`Last updated ${new Date(form.updatedAt).toLocaleDateString()}`}>
                                            <Clock size={14} />
                                            <span className="text-xs">{timeAgo(form.updatedAt || form.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dropdown Menu */}
                                {activeDropdown === form._id && (
                                    <div className="absolute right-4 top-14 w-36 bg-[#111] border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100 p-1">
                                        <button className="w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors">
                                            <Edit size={14} /> Edit
                                        </button>
                                        <button className="w-full text-left px-3 py-2 text-xs font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg flex items-center gap-2 transition-colors">
                                            <ExternalLink size={14} /> Preview
                                        </button>
                                        <div className="h-px bg-white/10 my-1 mx-2" />
                                        <button
                                            onClick={() => handleDelete(form._id)}
                                            className="w-full text-left px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-2 transition-colors"
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    /* Empty State (If search yields no results) */
                    allowSearch && searchTerm && (
                        <div className="col-span-full flex flex-col items-center justify-center h-64 text-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <Search size={24} className="text-gray-600" />
                            </div>
                            <p className="text-gray-400 font-medium">No forms found for "{searchTerm}"</p>
                            <p className="text-gray-600 text-sm mt-1">Try a different search term or create a new form.</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default FormsTab;
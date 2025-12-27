import React from "react";

export const SidebarItem = ({ icon: Icon, label, active = false, badge, onClick }) => (
    <button
        onClick={onClick}
        className={`
      w-full group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-all duration-200
      ${active ? "bg-white/10 text-white" : "text-gray-500 hover:bg-white/5 hover:text-gray-300"}
    `}
    >
        <div className="flex items-center gap-3">
            <Icon size={18} />
            <span className="text-sm font-medium">{label}</span>
        </div>
        {badge && (
            <span className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded text-gray-400 font-mono">
                {badge}
            </span>
        )}
    </button>
);

export const Badge = ({ children, color = "gray" }) => {
    const styles = {
        green: "bg-green-500/10 text-green-400 border-green-500/20",
        blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        gray: "bg-white/5 text-gray-400 border-white/10",
        yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    };

    return (
        <span className={`px-2 py-0.5 rounded text-[10px] font-medium border ${styles[color] || styles.gray}`}>
            {children}
        </span>
    );
};
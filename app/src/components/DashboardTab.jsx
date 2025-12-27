import React from "react";
import { 
  Users, 
  Zap, 
  FileCheck, 
  TrendingUp, 
  BrainCircuit, 
  Layout
} from "lucide-react";
import FormsTab from "./FormsTab";

const DashboardTab = ({ forms = [], setForms }) => {
  // --- Calculate Metrics ---
  const totalForms = forms.length;
  
  const publishedForms = forms.filter(f => f.status === "published").length;
  
  // Safeguard: The seed data didn't have a 'responses' field, defaulting to 0 if missing
  const totalResponses = forms.reduce((acc, curr) => acc + (parseInt(curr.responses) || 0), 0);
  
  const aiCount = forms.filter(f => f.aiGenerated).length;
  
  // Calculate AI Adoption Rate
  const aiPercentage = totalForms > 0 ? Math.round((aiCount / totalForms) * 100) : 0;

  const stats = [
    {
      label: "Total Responses",
      value: totalResponses.toLocaleString(),
      subtext: "Across all forms",
      icon: Users,
      gradient: "from-blue-500/20 to-indigo-500/20",
      textGradient: "from-blue-400 to-indigo-400",
      borderColor: "border-blue-500/20"
    },
    {
      label: "Active Forms",
      value: publishedForms,
      subtext: `${totalForms - publishedForms} drafts pending`,
      icon: Layout,
      gradient: "from-emerald-500/20 to-teal-500/20",
      textGradient: "from-emerald-400 to-teal-400",
      borderColor: "border-emerald-500/20"
    },
    {
      label: "AI Generation",
      value: `${aiPercentage}%`,
      subtext: `${aiCount} forms created by AI`,
      icon: BrainCircuit,
      gradient: "from-purple-500/20 to-pink-500/20",
      textGradient: "from-purple-400 to-pink-400",
      borderColor: "border-purple-500/20"
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* --- Welcome Section --- */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white tracking-tight">Overview</h2>
          <p className="text-gray-400 text-sm mt-1">
            Your form analytics and performance metrics.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-gray-300">System Operational</span>
        </div>
      </div>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div 
              key={idx} 
              className={`relative overflow-hidden bg-[#0A0A0A] border ${stat.borderColor} p-6 rounded-2xl transition hover:border-white/20 group`}
            >
              {/* Background Gradient Blob */}
              <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${stat.gradient} blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-white/5 border border-white/5`}>
                    <Icon size={20} className="text-gray-300" />
                  </div>
                  {idx === 2 && (
                     <span className="flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold bg-purple-500/10 text-purple-400 px-2 py-1 rounded-md border border-purple-500/20">
                       <Zap size={10} /> Pro Feature
                     </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-gray-500 text-xs font-medium uppercase tracking-wider">
                    {stat.label}
                  </h3>
                  <p className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${stat.textGradient}`}>
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-400 pt-1">
                    {stat.subtext}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- Recent Activity Section --- */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-white flex items-center gap-2">
            <TrendingUp size={18} className="text-gray-500" />
            Recent Forms
          </h2>
          <button 
             onClick={() => document.getElementById('forms-tab-trigger')?.click()} // Optional: if you want to link to full tab
             className="text-xs text-gray-500 hover:text-white transition cursor-pointer"
          >
            View All
          </button>
        </div>
        
        {/* We pass a sliced array to show only recent ones. 
            We also disable search since this is just a dashboard view. */}
        <div className="bg-[#0A0A0A]/50 border border-white/5 rounded-2xl p-4">
            {forms.length > 0 ? (
                <FormsTab 
                    allowSearch={false} 
                    forms={forms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3)} 
                    setForms={setForms} 
                />
            ) : (
                <div className="text-center py-10 text-gray-500">
                    <FileCheck size={40} className="mx-auto mb-3 opacity-20" />
                    <p>No recent activity found.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
import React, { useState, useMemo } from "react";
import { 
  BarChart2, 
  TrendingUp, 
  Users, 
  Clock, 
  ArrowDown, 
  ArrowUp,
  Download,
  ChevronDown,
  Check
} from "lucide-react";
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// --- Mock Data Generators ---

const FORMS_LIST = [
  { id: 1, name: "Customer Feedback Survey" },
  { id: 2, name: "Tech Hiring Quiz - Senior Dev" },
  { id: 3, name: "Employee Satisfaction Pulse" },
  { id: 5, name: "Event RSVP - AI Summit" },
];

// Simulating different data for each form
const getMockDataForForm = (formId) => {
  // Randomizer to make charts look different per form
  const multiplier = formId * 10;
  
  return {
    stats: {
      totalResponses: 120 + multiplier * 5,
      views: 450 + multiplier * 12,
      avgTime: `${2 + formId}m ${14 + formId * 5}s`,
      completionRate: Math.min(98, 45 + multiplier / 2),
      trend: formId % 2 === 0 ? "down" : "up"
    },
    trends: [
      { name: "Mon", responses: 10 + formId, views: 40 + formId * 2 },
      { name: "Tue", responses: 15 + formId * 2, views: 50 + formId * 3 },
      { name: "Wed", responses: 12 + formId, views: 45 + formId * 2 },
      { name: "Thu", responses: 25 + formId * 2, views: 80 + formId * 4 },
      { name: "Fri", responses: 30 + formId * 3, views: 95 + formId * 5 },
      { name: "Sat", responses: 18 + formId, views: 50 + formId * 2 },
      { name: "Sun", responses: 22 + formId, views: 60 + formId * 3 },
    ],
    devices: [
      { name: "Desktop", value: 40 + (formId % 2) * 20, color: "#8b5cf6" },
      { name: "Mobile", value: 40 - (formId % 2) * 10, color: "#3b82f6" },
      { name: "Tablet", value: 20 - (formId % 2) * 10, color: "#10b981" },
    ]
  };
};

// --- Sub-Components ---

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0A0A0A] border border-white/10 p-3 rounded-lg shadow-xl z-50">
        <p className="text-gray-400 text-xs mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-mono" style={{ color: entry.color || entry.fill }}>
            {entry.name}: <span className="font-bold text-white">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const StatCard = ({ title, value, change, icon: Icon, trend }) => (
  <div className="bg-[#0A0A0A] border border-white/10 p-5 rounded-xl hover:border-white/20 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-white/5 rounded-lg text-gray-400">
        <Icon size={20} />
      </div>
      <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
        trend === 'up' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
      }`}>
        {trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
        {change}
      </div>
    </div>
    <div>
      <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-white mt-1">{value}</p>
    </div>
  </div>
);

const AnalyticsTab = () => {
  const [selectedFormId, setSelectedFormId] = useState(FORMS_LIST[0].id);
  const [timeRange, setTimeRange] = useState("7d");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Get data specifically for the selected form
  const data = useMemo(() => getMockDataForForm(selectedFormId), [selectedFormId]);
  const selectedFormName = FORMS_LIST.find(f => f.id === selectedFormId)?.name;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500" onClick={() => setIsDropdownOpen(false)}>
      
      {/* --- Header & Selection --- */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-xl font-semibold text-white">Form Analytics</h2>
          <p className="text-sm text-gray-500 mt-1">Deep dive into specific form performance.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Form Selector Dropdown */}
          <div className="relative min-w-[280px] z-30">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsDropdownOpen(!isDropdownOpen); }}
              className="w-full flex items-center justify-between bg-[#0A0A0A] border border-white/20 text-white px-4 py-2.5 rounded-lg hover:border-white/40 transition-colors text-sm"
            >
              <span className="truncate">{selectedFormName}</span>
              <ChevronDown size={16} className={`text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-2 bg-[#111] border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                {FORMS_LIST.map((form) => (
                  <button
                    key={form.id}
                    onClick={() => setSelectedFormId(form.id)}
                    className="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/10 hover:text-white flex items-center justify-between group"
                  >
                    <span className="truncate">{form.name}</span>
                    {selectedFormId === form.id && <Check size={14} className="text-purple-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-1 bg-[#0A0A0A] border border-white/10 rounded-lg p-1">
            {["24h", "7d", "30d", "90d"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  timeRange === range 
                    ? "bg-white text-black shadow-sm" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* --- Specific Form Metrics --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Responses" 
          value={data.stats.totalResponses} 
          change="12%" 
          trend={data.stats.trend}
          icon={BarChart2} 
        />
        <StatCard 
          title="Unique Views" 
          value={data.stats.views} 
          change="8%" 
          trend="up" 
          icon={Users} 
        />
        <StatCard 
          title="Avg. Time to Complete" 
          value={data.stats.avgTime} 
          change="4%" 
          trend="down" 
          icon={Clock} 
        />
        <StatCard 
          title="Completion Rate" 
          value={`${data.stats.completionRate}%`} 
          change="2%" 
          trend={data.stats.trend} 
          icon={TrendingUp} 
        />
      </div>

      {/* --- Charts Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Engagement Over Time */}
        <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-medium text-white">Engagement Over Time</h3>
            <button className="text-gray-500 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded">
              <Download size={16} />
            </button>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trends}>
                <defs>
                  <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#666" 
                  tick={{fill: '#666', fontSize: 12}} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#666" 
                  tick={{fill: '#666', fontSize: 12}} 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#fff', strokeWidth: 0.5 }} />
                <Area 
                  type="monotone" 
                  dataKey="responses" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorResponses)" 
                  name="Responses"
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#334155" 
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  fill="transparent" 
                  name="Views"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 flex flex-col">
          <h3 className="font-medium text-white mb-6">Device Breakdown</h3>
          
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.devices}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.devices.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-white">{data.stats.totalResponses}</span>
              <span className="text-xs text-gray-500">Responses</span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {data.devices.map((device) => (
              <div key={device.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: device.color }} />
                  <span className="text-gray-400">{device.name}</span>
                </div>
                <span className="text-white font-mono">{device.value}%</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsTab;
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
    ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { ArrowLeftIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import React, { useEffect, useState } from 'react';

// Enhanced Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // For Pie charts, the label is often in payload[0].name
        const displayName = label || payload[0].name;
        return (
            <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 p-3 rounded-2xl shadow-2xl z-50">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                    {displayName}
                </p>
                <p className="text-lg font-black text-white">
                    {payload[0].value} <span className="text-xs font-medium text-indigo-300">Entries</span>
                </p>
            </div>
        );
    }
    return null;
};

export default function Index({ totalForms, totalSubmissions, topForms, trendData, currentFilter }) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        
        const interval = setInterval(() => {
            router.reload({ 
                only: ['topForms', 'totalSubmissions', 'trendData'],
                data: { range: currentFilter },
                preserveScroll: true 
            });
        }, 30000); 

        return () => {
            window.removeEventListener('resize', handleResize);
            clearInterval(interval);
        };
    }, [currentFilter]);

    const handleFilterChange = (range) => {
        router.get(route('metrics.index'), { range }, { 
            preserveState: true, 
            preserveScroll: true,
            only: ['topForms', 'trendData', 'currentFilter'] 
        });
    };

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899'];

    // Desktop: Full title | Mobile: Shortened
    const barData = topForms.map(form => ({
        name: isMobile 
            ? (form.title.length > 12 ? form.title.substring(0, 12) + '..' : form.title)
            : form.title,
        submissions: form.submissions_count
    }));

    const formattedTrend = trendData.map(item => ({
        date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: item.count
    }));

    const filterOptions = [
        { label: 'Today', value: 'day' },
        { label: '7D', value: 'week' },
        { label: '30D', value: 'month' },
        { label: 'Year', value: 'year' },
    ];

    return (
        <AuthenticatedLayout header="Detailed Analytics">
            <Head title="Analytics" />

            <div className="py-6 sm:py-12 bg-slate-50/30 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 sm:space-y-8">
                    
                    {/* Header Controls */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <Link href={route('dashboard')} className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-bold text-xs group">
                            <ArrowLeftIcon className="w-4 h-4" /> BACK TO DASHBOARD
                        </Link>

                        <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                            {filterOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleFilterChange(opt.value)}
                                    className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                        currentFilter === opt.value 
                                        ? 'bg-indigo-600 text-white shadow-md' 
                                        : 'text-slate-400 hover:bg-slate-50'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Timeline Analysis */}
                    <div className="bg-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
                        <div className="mb-10">
                            <h3 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-2">Trend Analysis</h3>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight italic uppercase">Activity Timeline</h2>
                        </div>
                        
                        <div className="h-64 sm:h-80 w-full">
                            {formattedTrend.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={formattedTrend}>
                                        <defs>
                                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="8 8" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} dy={15} />
                                        <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Area 
                                            type="monotone" 
                                            dataKey="count" 
                                            stroke="#6366f1" 
                                            strokeWidth={4} 
                                            fill="url(#colorCount)" 
                                            dot={{ r: 6, fill: '#6366f1', strokeWidth: 3, stroke: '#fff' }}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full opacity-20"><ChartBarIcon className="w-12 h-12" /></div>
                            )}
                        </div>
                    </div>

                    {/* Rank & Distribution Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        
                        {/* Rank Analysis */}
                        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 mb-8 uppercase tracking-[0.2em]">Rank Analysis</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barData} layout="vertical" margin={{ left: 10, right: 30 }}>
                                        <XAxis type="number" hide />
                                        <YAxis 
                                            dataKey="name" 
                                            type="category" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            fontSize={isMobile ? 10 : 12} 
                                            width={isMobile ? 80 : 140}
                                            tick={{fill: '#475569', fontWeight: 800}}
                                        />
                                        <Tooltip content={<CustomTooltip />} cursor={{fill: '#f8fafc'}} />
                                        <Bar dataKey="submissions" fill="#6366f1" radius={[0, 10, 10, 0]} barSize={24} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Volume Distribution (FIXED TOOLTIP) */}
                        <div className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h3 className="text-[10px] font-black text-slate-400 mb-8 uppercase tracking-[0.2em]">Volume Distribution</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        {/* Tooltip added here to fix the issue */}
                                        <Tooltip content={<CustomTooltip />} />
                                        <Pie 
                                            data={barData} 
                                            dataKey="submissions" 
                                            nameKey="name"
                                            cx="50%" 
                                            cy="45%" 
                                            innerRadius={isMobile ? 55 : 65} 
                                            outerRadius={isMobile ? 75 : 90} 
                                            paddingAngle={8}
                                            stroke="none"
                                        >
                                            {barData.map((_, index) => (
                                                <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Legend 
                                            verticalAlign="bottom" 
                                            iconType="circle" 
                                            formatter={(value) => (
                                                <span className="text-slate-500 font-black uppercase text-[9px] tracking-widest ml-1">
                                                    {value}
                                                </span>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Summary Footer */}
                    <div className="bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
                        <div className="grid grid-cols-2 gap-4 relative z-10 text-center sm:text-left">
                            <div>
                                <p className="text-4xl sm:text-7xl font-black tracking-tighter italic">{totalForms}</p>
                                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-2">Active Forms</p>
                            </div>
                            <div className="sm:text-right">
                                <p className="text-4xl sm:text-7xl font-black tracking-tighter text-indigo-500 italic">{totalSubmissions}</p>
                                <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mt-2">Total Responses</p>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
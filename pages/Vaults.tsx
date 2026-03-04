
import React from 'react';
import { Box, Target, TrendingUp, Plus, ChevronRight, PieChart, ArrowDownLeft, ShieldCheck, Sparkles } from 'lucide-react';

const Vaults: React.FC = () => {
    return (
        <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Capital Vaults</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">Dedicated savings goals for your long-term objectives.</p>
                </div>
                <button className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg">
                    <Plus size={18} /> Create New Vault
                </button>
            </div>

            {/* Portfolio Summary Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
                    <div className="relative z-10 flex flex-col justify-between h-full">
                        <div>
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-2">Total Vault Balance</p>
                            <h2 className="text-5xl font-black tracking-tighter text-white">$482,500.00</h2>
                            <div className="flex items-center gap-2 mt-4">
                                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 bg-emerald-400/10 px-2 py-1 rounded">
                                    <TrendingUp size={12} /> +4.5% APY Earned
                                </span>
                            </div>
                        </div>
                        <div className="mt-12 flex gap-10 border-t border-white/10 pt-8">
                             <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Active Goals</p>
                                 <p className="text-xl font-bold">4</p>
                             </div>
                             <div>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Projected Yield</p>
                                 <p className="text-xl font-bold text-amber-500">$21,712/yr</p>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                     <div>
                        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                            <PieChart size={20} className="text-blue-500" /> Strategic Distribution
                        </h3>
                        <div className="space-y-4">
                            <DistributionRow label="High-Yield" percent={65} color="bg-blue-500" />
                            <DistributionRow label="Direct Equity" percent={25} color="bg-amber-500" />
                            <DistributionRow label="Reserve" percent={10} color="bg-slate-400" />
                        </div>
                     </div>
                     <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                         <ShieldCheck size={20} className="text-emerald-500" />
                         <p className="text-[10px] font-bold text-slate-500 leading-tight">All vaults are protected by advanced security encryption.</p>
                     </div>
                </div>
            </div>

            {/* Individual Vaults Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <VaultCard 
                    title="Luxury Vehicle Fund" 
                    icon={<Sparkles size={20} className="text-amber-500" />}
                    current={42500} 
                    target={120000} 
                    color="bg-amber-500"
                />
                <VaultCard 
                    title="Real Estate Fund" 
                    icon={<Target size={20} className="text-blue-500" />}
                    current={380000} 
                    target={1200000} 
                    color="bg-blue-500"
                />
                <VaultCard 
                    title="Investment Reserve" 
                    icon={<Box size={20} className="text-purple-500" />}
                    current={60000} 
                    target={100000} 
                    color="bg-purple-500"
                />
            </div>
        </div>
    );
};

const DistributionRow = ({ label, percent, color }: any) => (
    <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
            <span>{label}</span>
            <span>{percent}%</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }}></div>
        </div>
    </div>
);

const VaultCard = ({ title, icon, current, target, color }: any) => {
    const progress = (current / target) * 100;
    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all group">
            <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {icon}
                </div>
                <button className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                    <ChevronRight size={20} />
                </button>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                Progress: {Math.round(progress)}%
            </p>

            <div className="space-y-4">
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${progress}%` }}></div>
                </div>
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Stored</p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white">${current.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-0.5">Target</p>
                        <p className="text-sm font-bold text-slate-500">${target.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <button className="w-full py-3.5 mt-8 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                <ArrowDownLeft size={14} /> Deposit to Vault
            </button>
        </div>
    );
}

export default Vaults;

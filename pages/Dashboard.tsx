
import React, { useState, useEffect } from 'react';
import { User, Transaction, View } from '../types';
import { 
  TrendingUp, 
  Send, 
  History, 
  ChevronRight, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Lock, 
  Globe, 
  Sparkles,
  ShieldCheck,
  Clock,
  Bitcoin,
  Zap,
  Activity,
  Layers,
  BarChart3,
  Waves,
  Crosshair,
  Crown,
  Settings,
  ShieldAlert,
  Cpu,
  Unplug,
  User as UserIcon,
  CreditCard,
  PieChart,
  ArrowRight,
  Wifi,
  Terminal,
  Server,
  Globe2,
  Navigation,
  Database,
  Eye,
  EyeOff,
  Command,
  CheckCircle,
  Upload,
  SlidersHorizontal,
  GripVertical,
  ChevronUp,
  ChevronDown,
  X
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  user: User;
  transactions: Transaction[];
  onNavigate: (view: View) => void;
}

const DEFAULT_WIDGETS = [
  { id: 'balance_actions', visible: true, title: 'Balance & Quick Actions' },
  { id: 'milestones', visible: true, title: 'Account Milestones' },
  { id: 'offers', visible: true, title: 'Featured Offers & Investments' },
  { id: 'security', visible: true, title: 'Security & Fraud Monitoring' },
  { id: 'activity', visible: true, title: 'Activity & Spending Overview' },
];

const PremiumBalanceCard = ({ user, onNavigate }: { user: User; onNavigate: (view: View) => void }) => {
  const [shimmer, setShimmer] = useState(false);
  const [showBalance, setShowBalance] = useState(true);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setProfilePic(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
  };

  useEffect(() => {
    const shimmerInterval = setInterval(() => {
      setShimmer(true);
      setTimeout(() => setShimmer(false), 3000);
    }, 8000);
    return () => clearInterval(shimmerInterval);
  }, []);

  return (
    <div className="group relative w-full overflow-hidden rounded-[2.5rem] bg-[#020617] text-white shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] border border-white/10 transition-all duration-1000 hover:shadow-amber-500/20">
        {/* Elite Materials */}
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.08] mix-blend-overlay"></div>
        <div className="absolute -right-10 -top-10 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-amber-500/20 to-transparent blur-[100px]"></div>
        <div className="absolute -bottom-20 -left-10 h-[300px] w-[300px] rounded-full bg-gradient-to-tr from-blue-600/10 to-transparent blur-[80px]"></div>
        
        {/* Dynamic Sweep - Improved with glow */}
        <div className={`absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent -skew-x-12 -translate-x-full transition-transform duration-[4000ms] ease-in-out pointer-events-none ${shimmer ? 'translate-x-[500%]' : ''}`}></div>
        <div className={`absolute inset-y-0 w-2/3 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -skew-x-12 -translate-x-full transition-transform duration-[4000ms] ease-in-out pointer-events-none delay-100 ${shimmer ? 'translate-x-[450%]' : ''}`}></div>

        <div className="relative z-10 flex h-full flex-col justify-between p-8 md:p-10">
          {/* Account Header */}
          <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-4">
                  <div 
                      className="user-profile-card relative h-12 w-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 shadow-[0_10px_20px_-5px_rgba(245,158,11,0.5)] ring-1 ring-white/10 transform hover:scale-110 transition-transform cursor-pointer overflow-hidden group/avatar"
                      onClick={() => fileInputRef.current?.click()}
                  >
                      {profilePic ? (
                          <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                          <Crown size={24} className="text-slate-950" />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                          <span className="text-[6px] font-bold text-white uppercase tracking-wider">Upload</span>
                      </div>
                      <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleImageUpload} 
                          accept="image/*" 
                          className="hidden" 
                      />
                  </div>
                  <div className="hidden xs:block">
                      <h3 className="text-[10px] font-black tracking-[0.5em] text-amber-500 uppercase italic">Active Session</h3>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-1.5 mt-1">
                        <ShieldCheck size={10} className="text-emerald-500" /> Premium Account
                      </p>
                  </div>
              </div>
              <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Security Level</span>
                    <span className="text-[9px] font-mono font-bold text-emerald-500 tracking-tighter">AES-256</span>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 backdrop-blur-2xl shadow-inner group/live cursor-default">
                      <div className="relative">
                        <Activity size={14} className="text-emerald-500 group-hover/live:animate-pulse" />
                        <span className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full opacity-0 group-hover/live:opacity-100 transition-opacity"></span>
                      </div>
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">LIVE DATA</span>
                  </div>
              </div>
          </div>

          {/* Core Figure */}
          <div className="cursor-pointer group/balance relative" onClick={() => onNavigate('activity')}>
              <div className="flex items-center gap-3 mb-4">
                <p className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 group-hover/balance:text-white transition-colors italic">Total Balance</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); setShowBalance(!showBalance); }}
                  className="p-1 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
                <div className="h-px w-12 bg-white/10 group-hover/balance:w-20 transition-all"></div>
              </div>
              
              <div className="flex flex-col gap-6">
                  <div className="flex items-baseline overflow-hidden relative">
                    <span className="text-3xl md:text-4xl font-extralight text-amber-500/20 mr-3 tracking-tighter italic select-none">$</span>
                    <span className={`text-5xl md:text-6xl font-black tracking-tighter text-white transition-all duration-1000 group-hover/balance:scale-[1.02] drop-shadow-[0_10px_20px_rgba(255,255,255,0.05)] italic ${shimmer ? 'text-amber-50 shadow-[0_0_20px_rgba(245,158,11,0.2)]' : ''}`}>
                        {showBalance ? (
                            <>
                                {user.balance.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                                <span className="text-2xl md:text-3xl font-thin opacity-20 ml-1">.{(user.balance % 1).toFixed(2).substring(2)}</span>
                            </>
                        ) : (
                            <span>****</span>
                        )}
                    </span>
                    {/* Targeted Shimmer on Balance */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-[2000ms] ease-in-out pointer-events-none ${shimmer ? 'translate-x-full' : ''}`}></div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                      <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-inner group/stat cursor-default">
                          <TrendingUp size={16} className="text-emerald-500 group-hover/stat:translate-y-[-2px] transition-transform" />
                          <span className="text-sm font-black text-emerald-500 tracking-tight">+14.2% <span className="text-[8px] opacity-60 font-bold ml-1 uppercase">QTD GAIN</span></span>
                      </div>
                      <div className="flex gap-1.5 py-1">
                        {[1,2,3,4,5,6,7,8,9,10].map(i => (
                            <div key={i} className={`h-1 w-3 rounded-full transition-all duration-1000 ${i <= 7 ? 'bg-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-slate-800'}`}></div>
                        ))}
                      </div>
                  </div>
              </div>
          </div>

          {/* Account Summary */}
          <div className="grid grid-cols-2 xs:grid-cols-4 gap-6 mt-12 pt-8 border-t border-white/5 relative">
               <div className="absolute top-0 left-1/4 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-500 rounded-full blur-[1px] shadow-[0_0_8px_rgba(245,158,11,1)]"></div>
               <MicroStat label="Investments" value="$1,245,000" />
               <MicroStat label="Savings" value="$450,200" />
               <MicroStat label="Credit" value="$25,000" />
               <MicroStat label="APY Yield" value="4.81%" />
          </div>
        </div>
    </div>
  );
};

const MicroStat = ({ label, value }: any) => (
    <div className="flex flex-col gap-2.5 cursor-default group/ms">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 group-hover/ms:text-amber-500/90 transition-colors italic">{label}</span>
        <span className="text-base font-mono font-bold text-white tracking-tighter group-hover/ms:translate-x-2 transition-transform">{value}</span>
    </div>
);

const QuickAction = ({ icon, label, onClick, highlight }: { icon: React.ReactNode, label: string, onClick?: () => void, highlight?: boolean }) => (
    <button 
        onClick={onClick}
        className="group relative flex flex-col items-center p-8 rounded-[2rem] w-full transition-all duration-500 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 hover:border-amber-500/50 shadow-sm hover:shadow-xl overflow-hidden active:scale-95"
    >
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className={`relative flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-500 transform group-hover:-translate-y-2 shadow-md ${
            highlight 
            ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white ring-4 ring-amber-500/20' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-slate-900 group-hover:text-amber-400 ring-4 ring-transparent'
        }`}>
            {icon}
        </div>
        <span className="mt-6 text-[11px] font-bold tracking-[0.2em] uppercase text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{label}</span>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-amber-500 transform translate-y-full group-hover:translate-y-0 transition-transform"></div>
        
        {/* Micro-interaction badge */}
        {highlight && (
            <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-amber-500 animate-pulse"></div>
        )}
    </button>
);

const Dashboard: React.FC<DashboardProps> = ({ user, transactions, onNavigate }) => {
  const [tickerLogs, setTickerLogs] = useState<string[]>([]);
  const [showTelemetry, setShowTelemetry] = useState(true);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  
  // Widget System State
  const [widgets, setWidgets] = useState(() => {
      const saved = localStorage.getItem('dashboard_widgets');
      if (saved) {
          try {
              return JSON.parse(saved);
          } catch (e) {
              return DEFAULT_WIDGETS;
          }
      }
      return DEFAULT_WIDGETS;
  });
  const [isCustomizing, setIsCustomizing] = useState(false);

  useEffect(() => {
      localStorage.setItem('dashboard_widgets', JSON.stringify(widgets));
  }, [widgets]);

  const toggleWidget = (id: string) => {
      setWidgets(widgets.map((w: any) => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  const moveWidget = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index > 0) {
          const newWidgets = [...widgets];
          [newWidgets[index - 1], newWidgets[index]] = [newWidgets[index], newWidgets[index - 1]];
          setWidgets(newWidgets);
      } else if (direction === 'down' && index < widgets.length - 1) {
          const newWidgets = [...widgets];
          [newWidgets[index + 1], newWidgets[index]] = [newWidgets[index], newWidgets[index + 1]];
          setWidgets(newWidgets);
      }
  };
  
  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const userTransactions = user.role === 'admin' ? transactions : transactions.filter(tx => tx.userId === user.id);
  
  const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 2000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
  ];
  
  useEffect(() => {
      const logs = [
          "TSLA: $245.60 (+3.2%)",
          "BTC/USD: $42,150.20",
          "EUR/USD: 1.092",
          "GOLD: $2,045.00",
          "S&P 500: 4,780.20",
          "AAPL: $178.35",
          "ETH/USD: $2,240.10",
          "NASDAQ: 15,310.97",
          "US 10Y: 4.02%",
          "VIX: 12.45",
          "MSFT: $375.20",
          "AMZN: $155.40",
          "GOOGL: $142.65"
      ];
      setTickerLogs(logs);
      
      const interval = setInterval(() => {
          setTickerLogs(prev => {
              const newLogs = [...prev];
              const first = newLogs.shift()!;
              newLogs.push(first);
              return newLogs;
          });
      }, 3500);
      return () => clearInterval(interval);
  }, []);

  const renderWidget = (id: string) => {
      switch(id) {
          case 'balance_actions':
              return (
                  <div key={id} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-8">
                          <PremiumBalanceCard user={user} onNavigate={onNavigate} />
                      </div>
                      <div className="lg:col-span-4 space-y-6">
                          <div className="flex items-center gap-4">
                              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Quick Actions</h3>
                              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <QuickAction highlight icon={<Send size={20} />} label="Transfer" onClick={() => onNavigate('transfer')} />
                              <QuickAction icon={<Bitcoin size={20} />} label="Invest" onClick={() => onNavigate('investments')} />
                              <QuickAction icon={<CreditCard size={20} />} label="Cards" onClick={() => onNavigate('cards')} />
                              <QuickAction icon={<Database size={20} />} label="Vaults" onClick={() => onNavigate('vaults')} />
                          </div>
                      </div>
                  </div>
              );
          case 'milestones':
              return (
                  <div key={id} className="space-y-6">
                      <div className="flex items-center gap-4">
                          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Account Milestones</h3>
                          <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {[
                              { title: 'Premium Tier', desc: 'Verified Status Achieved', icon: <Crown size={20} />, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' },
                              { title: 'Global Banking', desc: 'International Access Active', icon: <Globe size={20} />, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                              { title: 'Credit Ready', desc: 'Financing Options Available', icon: <Zap size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                              { title: 'Security Verified', desc: 'Account Audit Complete', icon: <ShieldCheck size={20} />, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-500/10' }
                          ].map((item, i) => (
                              <div key={i} className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 group cursor-default">
                                  <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                      {item.icon}
                                  </div>
                                  <h5 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{item.title}</h5>
                                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                              </div>
                          ))}
                      </div>
                  </div>
              );
          case 'offers':
              return (
                  <div key={id} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-500 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/5 rounded-full blur-[60px] group-hover:bg-blue-500/10 transition-colors"></div>
                          <div className="flex justify-between items-start mb-8">
                              <div className="p-4 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-500">
                                  <Zap size={28} />
                              </div>
                              <div className="flex flex-col items-end">
                                  <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-500/20">Pre-Approved</span>
                                  <span className="text-[9px] font-mono mt-2 text-slate-400 uppercase">OFFER: #EXP-772</span>
                              </div>
                          </div>
                          <h4 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight">Instant Credit Line</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">Access up to <strong className="text-slate-900 dark:text-white font-semibold">$50,000.00</strong> in instant credit based on your account history.</p>
                          <div className="flex items-center justify-between">
                              <button onClick={() => onNavigate('loans')} className="group/btn flex items-center gap-3 text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                                  View Offer <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                              </button>
                              <div className="flex -space-x-2">
                                  {[1,2,3].map(i => (
                                      <div key={i} className="h-8 w-8 rounded-full border-2 border-white dark:border-[#0f172a] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-medium text-slate-500">
                                          {i}
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                      <div className="p-8 md:p-10 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden group shadow-xl border border-slate-800">
                          <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none"></div>
                          <div className="relative z-10">
                              <div className="flex justify-between items-start mb-8">
                                  <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-500 border border-amber-500/20 group-hover:scale-110 transition-transform duration-500">
                                      <TrendingUp size={28} />
                                  </div>
                                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">High Yield</span>
                              </div>
                              <h4 className="text-2xl font-bold mb-3 tracking-tight">Global Tech Fund</h4>
                              <p className="text-sm text-slate-400 mb-8 leading-relaxed">Invest in top-performing global technology assets. Historical returns of <strong className="text-amber-500 font-semibold">18.5% APY</strong> over the last 5 years.</p>
                              <div className="flex items-center justify-between">
                                  <button onClick={() => onNavigate('investments')} className="group/btn flex items-center gap-3 text-sm font-bold text-amber-500 hover:text-amber-400 transition-colors">
                                      Explore Fund <ArrowRight size={18} className="group-hover/btn:translate-x-2 transition-transform" />
                                  </button>
                                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-[10px] font-mono text-slate-400">
                                      <Activity size={12} /> RISK: MODERATE
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              );
          case 'security':
              return (
                  <div key={id} className="p-12 rounded-[4rem] bg-slate-950 text-white relative overflow-hidden group shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] border border-white/5">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]"></div>
                      <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-emerald-500/5 to-transparent pointer-events-none"></div>
                      <div className="relative z-10">
                          <div className="flex justify-between items-start mb-10">
                              <div className="p-5 bg-white/5 rounded-[1.75rem] text-emerald-500 border border-white/10 shadow-inner group-hover:-rotate-12 transition-transform duration-700">
                                  <ShieldAlert size={32} />
                              </div>
                              <span className="text-[11px] font-black text-emerald-500 uppercase tracking-[0.5em] italic">Real-Time Fraud Monitoring</span>
                          </div>
                          <h4 className="text-3xl font-black mb-4 tracking-tighter italic uppercase">Account Protected</h4>
                          <p className="text-base text-slate-400 mb-8 leading-relaxed font-medium">AI-driven behavioral analysis and 2FA are active. 0 suspicious activities detected in the last 30 days.</p>
                          <div className="space-y-3 mb-12">
                              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                  <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                          <CheckCircle size={16} className="text-emerald-500" />
                                      </div>
                                      <div>
                                          <p className="text-sm font-bold text-white">Login Attempt</p>
                                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">San Francisco, CA • 2 mins ago</p>
                                      </div>
                                  </div>
                                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Verified</span>
                              </div>
                              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                                  <div className="flex items-center gap-3">
                                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                          <CheckCircle size={16} className="text-emerald-500" />
                                      </div>
                                      <div>
                                          <p className="text-sm font-bold text-white">Wire Transfer</p>
                                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">$5,500.00 • 2 days ago</p>
                                      </div>
                                  </div>
                                  <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Cleared</span>
                              </div>
                          </div>
                          <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,1)]"></div>
                                  <span className="text-[11px] font-black uppercase text-slate-500 tracking-[0.4em]">System Status: Online</span>
                              </div>
                              <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 text-[9px] font-mono text-slate-500">
                                  <Cpu size={12} /> SECURE_BRANCH_01
                              </div>
                          </div>
                      </div>
                  </div>
              );
          case 'activity':
              return (
                  <div key={id} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      <div className="space-y-6">
                          <div className="flex items-center gap-4">
                              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Spending Overview</h3>
                              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                          </div>
                          <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-md p-6 md:p-8 h-[400px] flex flex-col">
                              <div className="flex justify-between items-center mb-6">
                                  <div>
                                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Spent (YTD)</p>
                                      <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">$19,550.00</p>
                                  </div>
                                  <div className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-100 dark:border-emerald-500/20 text-xs font-bold flex items-center gap-1">
                                      <TrendingUp size={14} /> -12% vs Last Year
                                  </div>
                              </div>
                              <div className="flex-1 w-full min-h-0">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                          <defs>
                                              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                                              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                              </linearGradient>
                                          </defs>
                                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dy={10} />
                                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} tickFormatter={(value) => `$${value}`} />
                                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '1rem', color: '#fff', fontSize: '12px', fontWeight: 'bold' }} itemStyle={{ color: '#f59e0b' }} />
                                          <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                                      </AreaChart>
                                  </ResponsiveContainer>
                              </div>
                          </div>
                      </div>
                      <div className="space-y-6">
                          <div className="flex items-center gap-4">
                              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Recent Transactions</h3>
                              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                          </div>
                          <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden h-[400px] flex flex-col">
                              <div className="divide-y divide-slate-100 dark:divide-slate-800/50 flex-1 overflow-y-auto scrollbar-hide">
                                  {userTransactions.slice(0, 5).map((tx) => (
                                      <div key={tx.id} className="p-5 md:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer" onClick={() => onNavigate('activity')}>
                                          <div className="flex items-center gap-4">
                                              <div className={`w-12 h-12 shrink-0 rounded-xl flex items-center justify-center ${tx.type === 'credit' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}>
                                                  {tx.type === 'credit' ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                                              </div>
                                              <div className="min-w-0">
                                                  <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{tx.description}</p>
                                                  <p className="text-xs text-slate-500 mt-1 truncate">{new Date(tx.date).toLocaleDateString()} • {tx.status}</p>
                                              </div>
                                          </div>
                                          <div className="text-right shrink-0 pl-4">
                                              <p className={`font-mono text-base font-bold ${tx.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                                  {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                              </p>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 text-center shrink-0">
                                  <button onClick={() => onNavigate('activity')} className="text-xs font-bold text-amber-500 hover:text-amber-600 transition-colors flex items-center justify-center gap-2 mx-auto">
                                      View All Activity <ArrowRight size={14} />
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>
              );
          default:
              return null;
      }
  };

  return (
    <div className="space-y-16 animate-fade-in pb-40 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
       
       {/* Dashboard Greeting */}
       <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="flex items-center gap-6">
              <div className="relative group user-profile-card hover:scale-105 transition-transform duration-300">
                  <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 border-4 border-white dark:border-slate-900 shadow-lg overflow-hidden flex items-center justify-center">
                      {profilePic ? (
                          <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                          <UserIcon size={32} className="text-slate-400" />
                      )}
                  </div>
                  <label className="absolute bottom-0 right-0 p-1.5 bg-amber-500 text-white rounded-full cursor-pointer shadow-md hover:bg-amber-600 transition-colors">
                      <Upload size={14} />
                      <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicUpload} />
                  </label>
              </div>
              <div>
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <Sparkles size={18} className="text-amber-500" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-slate-500">Active Session</span>
                </div>
                <h1 className="welcome-message text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Welcome to the High SL Global Bank Dashboard
                </h1>
              </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <Wifi size={12} className="text-emerald-500" /> Network: Stable
            </span>
            <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsCustomizing(true)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:border-amber-500/50 hover:text-amber-500 transition-all duration-300 font-bold text-[11px] uppercase tracking-wider"
                >
                    <SlidersHorizontal size={14} />
                    Customize
                </button>
                <button 
                  onClick={() => setShowTelemetry(!showTelemetry)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl border transition-all duration-300 font-bold text-[11px] uppercase tracking-wider group ${
                    showTelemetry 
                      ? 'bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-amber-500/50'
                  }`}
                >
                    {showTelemetry ? <Eye size={14} /> : <EyeOff size={14} />}
                    {showTelemetry ? 'Market Updates' : 'Show Updates'}
                </button>
                <span className="font-mono text-[11px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hidden md:block">
                    US-EAST
                </span>
            </div>
          </div>
       </div>

       {/* Dynamic Widgets */}
       {widgets.filter((w: any) => w.visible).map((widget: any) => renderWidget(widget.id))}

       {/* MARKET UPDATES (TOGGLEABLE) */}
       <div className={`fixed bottom-0 left-0 lg:left-80 right-0 bg-white/95 dark:bg-black/95 backdrop-blur-3xl border-t border-slate-200 dark:border-white/5 h-14 flex items-center px-10 z-40 overflow-hidden transition-all duration-700 transform ${showTelemetry ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'}`}>
            <div className="flex items-center gap-4 mr-12 shrink-0 border-r border-slate-200 dark:border-white/10 pr-12 h-full">
                <div className="relative">
                    <Navigation size={16} className="text-amber-500 animate-pulse" />
                    <div className="absolute inset-0 bg-amber-500/20 blur-lg rounded-full animate-pulse"></div>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">Market Updates:</span>
            </div>
            <div className="flex gap-16 animate-slide-right-slow whitespace-nowrap">
                {tickerLogs.map((log, i) => (
                    <span key={i} className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-40"></div> {log}
                    </span>
                ))}
                {/* Loop Content */}
                {tickerLogs.map((log, i) => (
                    <span key={`dup-${i}`} className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-40"></div> {log}
                    </span>
                ))}
            </div>
            <div className="absolute right-0 top-0 bottom-0 bg-gradient-to-l from-white dark:from-black to-transparent w-48 z-10 pointer-events-none"></div>
            
            {/* Status Badge */}
            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3 pl-8 bg-gradient-to-l from-white dark:from-black via-white/80 dark:via-black/80 to-transparent pointer-events-auto">
                <div className="px-3 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/20 text-[9px] font-mono font-black text-emerald-500 uppercase tracking-widest">
                    ONLINE
                </div>
            </div>
       </div>

       {/* Customization Modal */}
       {isCustomizing && (
           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
               <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                   <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                       <div className="flex items-center gap-3">
                           <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                               <SlidersHorizontal size={20} />
                           </div>
                           <h3 className="text-lg font-bold text-slate-900 dark:text-white">Customize Dashboard</h3>
                       </div>
                       <button onClick={() => setIsCustomizing(false)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800">
                           <X size={20} />
                       </button>
                   </div>
                   
                   <div className="p-6 overflow-y-auto flex-1 space-y-4">
                       <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Drag to reorder widgets or toggle visibility to personalize your view.</p>
                       
                       {widgets.map((widget: any, index: number) => (
                           <div key={widget.id} className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${widget.visible ? 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-60'}`}>
                               <div className="flex items-center gap-4">
                                   <div className="flex flex-col gap-1">
                                       <button onClick={() => moveWidget(index, 'up')} disabled={index === 0} className="text-slate-400 hover:text-amber-500 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors">
                                           <ChevronUp size={16} />
                                       </button>
                                       <button onClick={() => moveWidget(index, 'down')} disabled={index === widgets.length - 1} className="text-slate-400 hover:text-amber-500 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors">
                                           <ChevronDown size={16} />
                                       </button>
                                   </div>
                                   <span className={`text-sm font-bold ${widget.visible ? 'text-slate-900 dark:text-white' : 'text-slate-500'}`}>{widget.title}</span>
                               </div>
                               <button 
                                   onClick={() => toggleWidget(widget.id)}
                                   className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${widget.visible ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-700'}`}
                               >
                                   <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${widget.visible ? 'translate-x-6' : 'translate-x-1'}`} />
                               </button>
                           </div>
                       ))}
                   </div>
                   
                   <div className="p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                       <button onClick={() => setIsCustomizing(false)} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors shadow-md shadow-amber-500/20">
                           Done
                       </button>
                   </div>
               </div>
           </div>
       )}

    </div>
  );
};

export default Dashboard;

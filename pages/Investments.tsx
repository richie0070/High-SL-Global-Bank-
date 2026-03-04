
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, PieChart, Activity, ArrowUpRight, DollarSign, RefreshCw, Zap, Calendar, Clock, BarChart2, Sparkles, Loader2, Link, Shield, CheckCircle, X, Building2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { GoogleGenAI } from "@google/genai";
import { User } from '../types';

const INITIAL_DATA = [
  { name: 'Jan', value: 145000 },
  { name: 'Feb', value: 152000 },
  { name: 'Mar', value: 148000 },
  { name: 'Apr', value: 165000 },
  { name: 'May', value: 172000 },
  { name: 'Jun', value: 185000 },
  { name: 'Jul', value: 224773 },
];

const INITIAL_ASSETS = [
    { 
        symbol: 'TSLA', 
        name: 'Tesla, Inc.', 
        price: 245.60, 
        change: 3.2, 
        shares: 450, 
        value: 110520.00, 
        purchaseDate: 'Jan 15, 2023', 
        costBasis: 120.50, 
        unrealized: 56295.00,
        unrealizedPercent: 103.8,
        allocation: 49
    },
    { 
        symbol: 'AAPL', 
        name: 'Apple Inc.', 
        price: 178.35, 
        change: 1.2, 
        shares: 150, 
        value: 26752.50, 
        purchaseDate: 'Aug 20, 2022', 
        costBasis: 150.00, 
        unrealized: 4252.50,
        unrealizedPercent: 18.9,
        allocation: 12
    },
    { 
        symbol: 'BTC', 
        name: 'Bitcoin', 
        price: 42150.00, 
        change: 2.4, 
        shares: 1.5, 
        value: 63225.00, 
        purchaseDate: 'Nov 05, 2023', 
        costBasis: 35000.00, 
        unrealized: 10725.00,
        unrealizedPercent: 20.4,
        allocation: 28
    },
    { 
        symbol: 'NVDA', 
        name: 'NVIDIA Corp', 
        price: 485.00, 
        change: 4.5, 
        shares: 50, 
        value: 24250.00, 
        purchaseDate: 'May 10, 2023', 
        costBasis: 300.00, 
        unrealized: 9250.00,
        unrealizedPercent: 61.6,
        allocation: 11
    },
];

interface InvestmentsProps {
  user?: User;
}

const Investments: React.FC<InvestmentsProps> = ({ user }) => {
  const [assets, setAssets] = useState(INITIAL_ASSETS);
  const [portfolioValue, setPortfolioValue] = useState(224773.50);
  const [marketStatus, setMarketStatus] = useState<'Open' | 'Closed'>('Open');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Brokerage Connection State
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [brokerageCreds, setBrokerageCreds] = useState({
      provider: 'Robinhood',
      username: '',
      password: ''
  });
  
  // Partner Benefits Modal State
  const [showBenefitsModal, setShowBenefitsModal] = useState(false);

  // Real-time Market Simulation
  useEffect(() => {
      const interval = setInterval(() => {
          setAssets(currentAssets => {
              const updated = currentAssets.map(asset => {
                  const volatility = 0.0015;
                  const direction = Math.random() > 0.45 ? 1 : -1;
                  const magnitude = Math.random() * volatility;
                  const move = 1 + (direction * magnitude);
                  
                  const newPrice = asset.price * move;
                  const newValue = newPrice * asset.shares;
                  const newUnrealized = newValue - (asset.costBasis * asset.shares);
                  const newUnrealizedPercent = (newUnrealized / (asset.costBasis * asset.shares)) * 100;
                  
                  const newChange = asset.change + (direction * magnitude * 100);

                  return {
                      ...asset,
                      price: newPrice,
                      change: newChange,
                      value: newValue,
                      unrealized: newUnrealized,
                      unrealizedPercent: newUnrealizedPercent
                  };
              });
              
              const newTotal = updated.reduce((acc, curr) => acc + curr.value, 0);
              setPortfolioValue(newTotal);
              setLastUpdate(new Date());
              return updated;
          });
      }, 3000);

      return () => clearInterval(interval);
  }, []);

  const handleAnalyzeTsla = async () => {
    setIsAnalyzing(true);
    setAiAnalysis(null);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const tsla = assets.find(a => a.symbol === 'TSLA');
        const prompt = `Provide a sophisticated, 2-sentence market analysis for Tesla Inc. (TSLA) stock, 
        noting its current price of $${tsla?.price.toFixed(2)} and the partnership with High SL Global Bank 
        offering exclusive financing for Cybertruck and Plaid models.`;
        
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });
        setAiAnalysis(response.text || "Analysis currently unavailable.");
    } catch (error) {
        setAiAnalysis("Unable to reach the market analysis service.");
    } finally {
        setIsAnalyzing(false);
    }
  };

  const handleConnectBrokerage = (e: React.FormEvent) => {
      e.preventDefault();
      setIsConnecting(true);
      
      // Simulate API Call
      setTimeout(() => {
          setIsConnecting(false);
          setConnectionStatus('success');
          
          // Add Mock Assets from "External" Brokerage
          const newAssets = [
              { 
                  symbol: 'AMZN', 
                  name: 'Amazon.com Inc.', 
                  price: 145.20, 
                  change: 0.8, 
                  shares: 50, 
                  value: 7260.00, 
                  purchaseDate: 'Synced just now', 
                  costBasis: 130.00, 
                  unrealized: 760.00,
                  unrealizedPercent: 11.7,
                  allocation: 5
              },
              { 
                  symbol: 'GOOGL', 
                  name: 'Alphabet Inc.', 
                  price: 140.50, 
                  change: -0.5, 
                  shares: 30, 
                  value: 4215.00, 
                  purchaseDate: 'Synced just now', 
                  costBasis: 125.00, 
                  unrealized: 465.00,
                  unrealizedPercent: 12.4,
                  allocation: 3
              }
          ];
          
          setAssets(prev => {
              const updatedAssets = [...prev, ...newAssets];
              const newTotal = updatedAssets.reduce((acc, curr) => acc + curr.value, 0);
              setPortfolioValue(newTotal);
              return updatedAssets;
          });
          
          setTimeout(() => {
              setShowConnectModal(false);
              setConnectionStatus('idle');
              setBrokerageCreds({ provider: 'Robinhood', username: '', password: '' });
          }, 2000);
      }, 2000);
  };

  const totalUnrealized = assets.reduce((acc, curr) => acc + curr.unrealized, 0);
  const totalPercentGain = (totalUnrealized / (portfolioValue - totalUnrealized)) * 100;
  
  const bankBalance = user?.balance || 0;
  const consolidatedNetWorth = portfolioValue + bankBalance;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
                <div className="flex items-center gap-2 mb-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">Market Live</span>
                    <span className="text-[10px] text-slate-400">| Updated: {lastUpdate.toLocaleTimeString()}</span>
                </div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Investment Portfolio</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your assets and analyze market trends.</p>
            </div>
            <div className="flex gap-3">
                 <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <RefreshCw size={16} /> Refresh
                 </button>
                 <button 
                    onClick={() => setShowConnectModal(true)}
                    className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-2 rounded-xl font-bold text-sm hover:opacity-90 transition-colors shadow-lg"
                 >
                    <Link size={16} /> Link Account
                 </button>
                 <button className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20">
                    <DollarSign size={16} /> Trade Assets
                 </button>
            </div>
        </div>

        {/* Featured Partner Section - Tesla */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white rounded-[2.5rem] p-8 relative overflow-hidden shadow-2xl transition-all hover:scale-[1.005] duration-500 border border-white/10 group">
            <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=2071&auto=format&fit=crop" alt="Tesla" className="w-full h-full object-cover opacity-30 mix-blend-luminosity group-hover:scale-105 transition-transform duration-1000" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
            </div>
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="max-w-2xl">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-red-600 text-white p-1 rounded">
                            <Zap size={14} fill="currentColor" />
                        </div>
                        <span className="text-xs font-bold tracking-[0.2em] uppercase text-red-500">Featured Partner</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">Tesla, Inc. (TSLA)</h2>
                    <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
                        High SL Global is a preferred financing partner for Tesla Motors. Members holding &gt;100 shares qualify for an <strong className="text-white">exclusive 40% discount</strong> on Model S and X purchases, plus priority Cybertruck allocation.
                    </p>
                    <div className="flex flex-wrap gap-4 items-center">
                        <button 
                            onClick={() => setShowBenefitsModal(true)}
                            className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors flex items-center gap-2"
                        >
                            <Sparkles size={16} className="text-amber-500" /> View Benefits
                        </button>
                        <button 
                            onClick={handleAnalyzeTsla}
                            disabled={isAnalyzing}
                            className="bg-white/10 text-white border border-white/20 px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors flex items-center gap-2"
                        >
                            {isAnalyzing ? <Loader2 className="animate-spin" size={16} /> : <Sparkles className="text-amber-400" size={16} />}
                            Market Analysis
                        </button>
                    </div>
                    
                    {aiAnalysis && (
                        <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-2xl animate-fade-in text-sm font-medium italic text-slate-300 leading-relaxed shadow-inner">
                            "{aiAnalysis}"
                        </div>
                    )}
                </div>
                
                <div className="flex gap-4">
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center min-w-[140px]">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Market Price</p>
                        <p className="text-3xl font-bold text-white">${assets.find(a => a.symbol === 'TSLA')?.price.toFixed(2)}</p>
                        <p className="text-xs font-bold text-emerald-400 mt-1">+{assets.find(a => a.symbol === 'TSLA')?.change.toFixed(2)}% Today</p>
                    </div>
                    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 text-center min-w-[140px]">
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Portfolio Value</p>
                        <p className="text-3xl font-bold text-amber-500">${(assets.find(a => a.symbol === 'TSLA')?.value! / 1000).toFixed(1)}k</p>
                        <p className="text-xs font-bold text-slate-400 mt-1">{assets.find(a => a.symbol === 'TSLA')?.shares} Shares</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Investment Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative bg-white dark:bg-[#0a0f1e] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative z-10 flex justify-between items-start mb-6">
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform border border-emerald-100 dark:border-emerald-500/20">
                        <TrendingUp size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20">Top Performer</span>
                </div>
                <div className="relative z-10">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Global Tech Fund</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">Diversified exposure to leading technology companies worldwide.</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-emerald-500 tracking-tighter">+18.5%</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">YTD</span>
                    </div>
                </div>
            </div>

            <div className="relative bg-white dark:bg-[#0a0f1e] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative z-10 flex justify-between items-start mb-6">
                    <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform border border-blue-100 dark:border-blue-500/20">
                        <Shield size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-100 dark:border-blue-500/20">Low Risk</span>
                </div>
                <div className="relative z-10">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Treasury Yield Plus</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">Government-backed securities with optimized yield strategies.</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-blue-500 tracking-tighter">+5.2%</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">APY</span>
                    </div>
                </div>
            </div>

            <div className="relative bg-white dark:bg-[#0a0f1e] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm flex flex-col justify-between group hover:shadow-xl transition-all overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                <div className="relative z-10 flex justify-between items-start mb-6">
                    <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-2xl text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform border border-purple-100 dark:border-purple-500/20">
                        <Sparkles size={24} />
                    </div>
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider bg-purple-50 dark:bg-purple-500/10 px-3 py-1.5 rounded-lg border border-purple-100 dark:border-purple-500/20">New Offering</span>
                </div>
                <div className="relative z-10">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">AI Infrastructure</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">Invest in the hardware and networks powering the AI revolution.</p>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-black text-purple-500 tracking-tighter">High</span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Growth Potential</span>
                    </div>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 relative bg-white dark:bg-[#0a0f1e] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-amber-500/10 transition-colors duration-1000"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Consolidated Net Worth</p>
                        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mt-2 transition-all duration-300">
                            ${consolidatedNetWorth.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                        </h2>
                        <div className="flex items-center gap-4 mt-3 text-sm font-medium">
                            <span className="text-slate-500 flex items-center gap-1">
                                <PieChart size={14} /> Portfolio: ${portfolioValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </span>
                            <span className="text-slate-500 flex items-center gap-1">
                                <Building2 size={14} /> Bank: ${bankBalance.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                        <TrendingUp size={20} className="text-emerald-500" />
                        <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">+{totalPercentGain.toFixed(2)}% (All Time)</span>
                    </div>
                </div>
                
                <div className="h-72 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={INITIAL_DATA}>
                            <defs>
                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.3} />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `$${value/1000}k`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                itemStyle={{ color: '#fbbf24' }}
                                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Value']}
                            />
                            <Area type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="relative bg-white dark:bg-[#0a0f1e] p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm flex flex-col overflow-hidden">
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
                <div className="relative z-10">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-8 flex items-center gap-2">
                        <PieChart size={20} className="text-blue-500" /> Portfolio Allocation
                    </h3>
                    <div className="space-y-6 flex-1">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Tesla</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">49%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-red-500 w-[49%] rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Crypto</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">28%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 w-[28%] rounded-full"></div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">Other Tech</span>
                            </div>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">23%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 w-[23%] rounded-full"></div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-8 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-2">Top Asset</p>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center shadow-sm text-xs font-bold">TSLA</div>
                            <span className="font-bold text-slate-900 dark:text-white">Tesla</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-lg">
                            <ArrowUpRight size={12} /> +103.8%
                        </span>
                    </div>
                </div>
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-[#0a0f1e] rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-white/[0.02]">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 text-lg">
                    <Activity size={20} className="text-amber-500" /> Asset Holdings
                </h3>
                <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Download Tax Report</button>
             </div>
             <div className="overflow-x-auto">
                 <table className="min-w-full text-left">
                     <thead className="bg-slate-50 dark:bg-white/[0.02] text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-white/5">
                         <tr>
                             <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Asset Name</th>
                             <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Current Price</th>
                             <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Cost Basis</th>
                             <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Purchase Date</th>
                             <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Unrealized Gain</th>
                             <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Total Value</th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                         {assets.map((asset) => (
                             <tr key={asset.symbol} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors group">
                                 <td className="px-6 py-5 whitespace-nowrap">
                                     <div className="flex items-center gap-4">
                                         <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shadow-sm ${
                                             asset.symbol === 'TSLA' ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300'
                                         }`}>
                                             {asset.symbol}
                                         </div>
                                         <div>
                                             <p className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                                {asset.name}
                                                {asset.symbol === 'TSLA' && <Zap size={12} className="text-red-500 fill-current" />}
                                             </p>
                                             <p className="text-xs text-slate-500">{asset.shares} shares</p>
                                         </div>
                                     </div>
                                 </td>
                                 <td className="px-6 py-5 whitespace-nowrap text-right font-medium text-slate-700 dark:text-slate-300">
                                     <div className="flex flex-col items-end">
                                         <span>${asset.price.toFixed(2)}</span>
                                         <span className={`text-[10px] ${asset.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                            {asset.change >= 0 ? '+' : ''}{asset.change.toFixed(2)}%
                                         </span>
                                     </div>
                                 </td>
                                 <td className="px-6 py-5 whitespace-nowrap text-right text-sm text-slate-500 font-mono">
                                     ${asset.costBasis.toFixed(2)}
                                 </td>
                                 <td className="px-6 py-5 whitespace-nowrap text-right text-sm text-slate-500">
                                     {asset.purchaseDate}
                                 </td>
                                 <td className="px-6 py-5 whitespace-nowrap text-right">
                                     <div>
                                         <span className={`block font-bold ${
                                            asset.unrealized >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'
                                         }`}>
                                             {asset.unrealized >= 0 ? '+' : ''}${asset.unrealized.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                         </span>
                                         <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                                             asset.unrealized >= 0 
                                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                         }`}>
                                             {asset.unrealizedPercent.toFixed(1)}%
                                         </span>
                                     </div>
                                 </td>
                                 <td className="px-6 py-5 whitespace-nowrap text-right">
                                     <p className="font-bold text-lg text-slate-900 dark:text-white transition-all duration-300">
                                        ${asset.value.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                     </p>
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
             <div className="p-4 bg-slate-50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/5 text-center">
                 <button className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center gap-2 w-full">
                     View All Transactions <ArrowUpRight size={12} />
                 </button>
             </div>
        </div>

        {/* Brokerage Connection Modal */}
        {showConnectModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setShowConnectModal(false)}></div>
                <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slide-up">
                    <div className="p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                                <Link size={20} className="text-amber-500" /> Link Account
                            </h3>
                            <button onClick={() => setShowConnectModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                <X size={20} />
                            </button>
                        </div>

                        {connectionStatus === 'success' ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
                                    <CheckCircle size={32} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Connection Successful</h4>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Your {brokerageCreds.provider} account has been linked. Your portfolio has been updated.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleConnectBrokerage} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Institution</label>
                                    <select 
                                        value={brokerageCreds.provider}
                                        onChange={(e) => setBrokerageCreds({...brokerageCreds, provider: e.target.value})}
                                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 font-medium text-slate-900 dark:text-white"
                                    >
                                        <option value="Robinhood">Robinhood</option>
                                        <option value="E*TRADE">E*TRADE</option>
                                        <option value="Fidelity">Fidelity</option>
                                        <option value="Coinbase">Coinbase</option>
                                        <option value="Charles Schwab">Charles Schwab</option>
                                        <option value="Vanguard">Vanguard</option>
                                        <option value="TD Ameritrade">TD Ameritrade</option>
                                        <option value="Interactive Brokers">Interactive Brokers</option>
                                        <option value="Webull">Webull</option>
                                        <option value="Merrill Edge">Merrill Edge</option>
                                        <option value="SoFi Invest">SoFi Invest</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Username / ID</label>
                                    <input 
                                        type="text"
                                        value={brokerageCreds.username}
                                        onChange={(e) => setBrokerageCreds({...brokerageCreds, username: e.target.value})}
                                        placeholder="Enter your username"
                                        required
                                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                                    <input 
                                        type="password"
                                        value={brokerageCreds.password}
                                        onChange={(e) => setBrokerageCreds({...brokerageCreds, password: e.target.value})}
                                        placeholder="••••••••••••"
                                        required
                                        className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 outline-none focus:border-amber-500 font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                                    />
                                </div>

                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-start gap-3">
                                    <Shield size={16} className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                                    <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                        Your credentials are encrypted using AES-256 and never stored on our servers. We use Plaid for secure data synchronization.
                                    </p>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isConnecting}
                                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-2"
                                >
                                    {isConnecting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" /> Linking Account...
                                        </>
                                    ) : (
                                        <>
                                            Link Account <ArrowUpRight size={16} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        )}

        {/* Partner Benefits / Panther Ads Modal */}
        {showBenefitsModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowBenefitsModal(false)}></div>
                <div className="relative z-10 bg-white dark:bg-slate-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
                    
                    {/* Header */}
                    <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-md sticky top-0 z-20">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Premium Member</span>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Partner Benefits</span>
                            </div>
                            <h2 className="text-2xl font-black text-slate-900 dark:text-white italic tracking-tight">Member Benefits</h2>
                        </div>
                        <button onClick={() => setShowBenefitsModal(false)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                            <X size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="overflow-y-auto p-8 space-y-8">
                        
                        {/* Featured Ad - Tesla */}
                        <div className="relative rounded-[2rem] overflow-hidden bg-black text-white p-10 shadow-2xl group">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-[2s]"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
                            
                            <div className="relative z-10 max-w-lg">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">T</div>
                                    <div>
                                        <h3 className="text-2xl font-black italic uppercase">Tesla Motors</h3>
                                        <p className="text-xs text-red-500 font-bold uppercase tracking-widest">Featured Partner</p>
                                    </div>
                                </div>
                                <h4 className="text-5xl font-black mb-6 italic tracking-tighter leading-none">
                                    40% OFF <br/>
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">PREMIUM SERIES</span>
                                </h4>
                                <p className="text-slate-300 text-lg font-medium leading-relaxed mb-8">
                                    Exclusive offer for High SL shareholders. Purchase a new Model S or Model X directly through your portfolio dashboard and receive an instant 40% discount.
                                </p>
                                <div className="flex gap-4">
                                    <button className="bg-red-600 text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30">
                                        Claim Offer
                                    </button>
                                    <button className="bg-white/10 text-white border border-white/20 px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-white/20 transition-colors backdrop-blur-md">
                                        View Inventory
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Other Partners Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* SpaceX */}
                            <div className="bg-slate-900 rounded-[2rem] p-8 relative overflow-hidden border border-slate-800 group hover:border-slate-700 transition-colors">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -mr-16 -mt-16"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-900 font-black text-xl">X</div>
                                        <span className="bg-blue-900/30 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-500/20">Aerospace</span>
                                    </div>
                                    <h4 className="text-2xl font-black text-white italic uppercase mb-3">Priority Access</h4>
                                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                        Secure priority manifest placement for commercial logistics. High SL members receive Tier-1 scheduling status.
                                    </p>
                                    <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors">
                                        Reserve Payload
                                    </button>
                                </div>
                            </div>

                            {/* Neuralink */}
                            <div className="bg-slate-900 rounded-[2rem] p-8 relative overflow-hidden border border-slate-800 group hover:border-slate-700 transition-colors">
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] -ml-16 -mb-16"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-12 h-12 bg-black border border-slate-800 rounded-xl flex items-center justify-center text-white font-black text-xl">N</div>
                                        <span className="bg-emerald-900/30 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20">Biotech</span>
                                    </div>
                                    <h4 className="text-2xl font-black text-white italic uppercase mb-3">Biotech Early Access</h4>
                                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                        Join the waitlist for the next generation Biotech clinical trials. Expedited screening for qualified investors.
                                    </p>
                                    <button className="w-full py-3 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors">
                                        Join Waitlist
                                    </button>
                                </div>
                            </div>

                            {/* Boring Company */}
                            <div className="bg-slate-900 rounded-[2rem] p-8 relative overflow-hidden border border-slate-800 group hover:border-slate-700 transition-colors">
                                <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] -ml-16 -mt-16"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-12 h-12 bg-black border border-slate-800 rounded-xl flex items-center justify-center text-white font-black text-xl">B</div>
                                        <span className="bg-purple-900/30 text-purple-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-purple-500/20">Infrastructure</span>
                                    </div>
                                    <h4 className="text-2xl font-black text-white italic uppercase mb-3">Priority Services</h4>
                                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                        Direct priority access construction for private estates. 20% discount on excavation services.
                                    </p>
                                    <button className="w-full py-3 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors">
                                        Request Survey
                                    </button>
                                </div>
                            </div>

                            {/* Starlink */}
                            <div className="bg-slate-900 rounded-[2rem] p-8 relative overflow-hidden border border-slate-800 group hover:border-slate-700 transition-colors">
                                <div className="absolute bottom-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mr-16 -mb-16"></div>
                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-900 font-black text-xl">S</div>
                                        <span className="bg-amber-900/30 text-amber-400 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-amber-500/20">Connectivity</span>
                                    </div>
                                    <h4 className="text-2xl font-black text-white italic uppercase mb-3">Global Connectivity</h4>
                                    <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                                        Global coverage for vessels. Uncapped bandwidth priority and dedicated satellite allocation.
                                    </p>
                                    <button className="w-full py-3 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors">
                                        Upgrade Fleet
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default Investments;


import React, { useState, useEffect, useRef } from 'react';
import { Transaction } from '../types';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Copy, 
  CheckCircle, 
  FileText, 
  Wallet, 
  CreditCard, 
  Loader2,
  Globe,
  Navigation,
  MapPin,
  Cpu,
  Wifi,
  Zap,
  Activity as ActivityIcon,
  Eye
} from 'lucide-react';

interface ActivityProps {
  transactions: Transaction[];
}

// Global Heuristic Engine for Currency/Region Detection
const detectTransactionIntel = (description: string) => {
    const desc = description.toLowerCase();
    if (desc.includes('ny') || desc.includes('apple') || desc.includes('tesla') || desc.includes('us')) 
        return { code: 'USD', flag: '🇺🇸', region: 'North America', rate: 1.0, latency: '4ms' };
    if (desc.includes('london') || desc.includes('uk') || desc.includes('barclays')) 
        return { code: 'GBP', flag: '🇬🇧', region: 'United Kingdom', rate: 0.79, latency: '14ms' };
    if (desc.includes('tokyo') || desc.includes('japan') || desc.includes('mizuho')) 
        return { code: 'JPY', flag: '🇯🇵', region: 'Asia Pacific', rate: 148.50, latency: '112ms' };
    if (desc.includes('paris') || desc.includes('berlin') || desc.includes('eur') || desc.includes('sepa')) 
        return { code: 'EUR', flag: '🇪🇺', region: 'Eurozone', rate: 0.92, latency: '22ms' };
    if (desc.includes('payroll') || desc.includes('internal') || desc.includes('high sl')) 
        return { code: 'USD', flag: '🏛️', region: 'HSL Core', rate: 1.0, latency: '0.1ms' };
    if (desc.includes('nigeria') || desc.includes('ngn')) 
        return { code: 'NGN', flag: '🇳🇬', region: 'West Africa', rate: 1450.0, latency: '45ms' };
    if (desc.includes('south africa') || desc.includes('zar')) 
        return { code: 'ZAR', flag: '🇿🇦', region: 'Southern Africa', rate: 18.95, latency: '38ms' };
    if (desc.includes('dubai') || desc.includes('uae') || desc.includes('emirates')) 
        return { code: 'AED', flag: '🇦🇪', region: 'Middle East', rate: 3.67, latency: '31ms' };
    
    return { code: 'USD', flag: '🌐', region: 'Global Network', rate: 1.0, latency: '24ms' };
};

const Activity: React.FC<ActivityProps> = ({ transactions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  
  // Infinite Scroll State
  const [visibleCount, setVisibleCount] = useState(20);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const filteredTransactions = transactions.filter(t => 
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.amount.toString().includes(searchTerm)
  );

  const displayedTransactions = filteredTransactions.slice(0, visibleCount);

  const totalIn = transactions.filter(t => t.type === 'credit').reduce((acc, t) => acc + t.amount, 0);
  const totalOut = transactions.filter(t => t.type === 'debit').reduce((acc, t) => acc + t.amount, 0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && visibleCount < filteredTransactions.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
             setVisibleCount(prev => prev + 20);
             setIsLoadingMore(false);
          }, 800);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [visibleCount, filteredTransactions]);

  const toggleExpand = (id: string) => {
      setExpandedId(expandedId === id ? null : id);
  };

  const handleCopy = (e: React.MouseEvent, text: string) => {
      e.stopPropagation();
      navigator.clipboard.writeText(text);
      setCopiedId(text);
      setTimeout(() => setCopiedId(null), 2000);
  };

  const handleExportCSV = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      const headers = ["Date", "Description", "Principal (USD)", "Type", "Status", "Destination", "Currency", "Region", "Reference"];
      const rows = transactions.map(t => {
        const intel = detectTransactionIntel(t.description);
        return [
          t.date,
          `"${t.description}"`,
          t.type === 'debit' ? `-${t.amount}` : t.amount,
          t.type.toUpperCase(),
          t.status || 'Completed',
          intel.flag,
          intel.code,
          intel.region,
          t.reference || t.id
        ];
      });

      const csvContent = [
        headers.join(','),
        ...rows.map(r => r.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      
      link.setAttribute('href', url);
      link.setAttribute('download', `HSL_Global_Statement_${dateStr}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsExporting(false);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-white/5 pb-10">
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                        <Globe size={16} className="text-amber-500 animate-spin-slow" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500">Transaction History</span>
                </div>
                <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">Activity</h1>
            </div>
            <div className="flex gap-4">
                 <button 
                    onClick={handleExportCSV}
                    disabled={isExporting}
                    className="group relative flex items-center gap-3 px-8 py-4 bg-slate-950 dark:bg-white text-white dark:text-slate-900 rounded-[1.75rem] font-black text-xs uppercase tracking-[0.3em] hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 overflow-hidden italic"
                 >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                    {isExporting ? 'Exporting...' : 'Export CSV'}
                 </button>
            </div>
        </div>

        {/* Transaction Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#0f172a] p-10 rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-sm flex items-center justify-between group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10">
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3 italic">Total Inflow</p>
                    <h3 className="text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-1 tracking-tighter italic">
                        +${totalIn.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                </div>
                <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 rounded-[1.5rem] flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-inner group-hover:rotate-12 transition-transform duration-700">
                    <ArrowDownLeft size={32} />
                </div>
            </div>
            <div className="bg-white dark:bg-[#0f172a] p-10 rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-sm flex items-center justify-between group overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <div className="relative z-10">
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] mb-3 italic">Total Outflow</p>
                    <h3 className="text-4xl font-black text-slate-900 dark:text-white mt-1 tracking-tighter italic">
                        -${totalOut.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </h3>
                </div>
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-[1.5rem] flex items-center justify-center text-slate-600 dark:text-slate-400 shadow-inner group-hover:-rotate-12 transition-transform duration-700">
                    <ArrowUpRight size={32} />
                </div>
            </div>
        </div>

        {/* Search & Filters */}
        <div className="bg-white dark:bg-[#0f172a] p-3 rounded-[2.5rem] border border-slate-100 dark:border-white/5 shadow-xl flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="SEARCH TRANSACTIONS..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-slate-50 dark:bg-slate-900/50 border border-transparent rounded-[2rem] outline-none focus:ring-2 focus:ring-amber-500/30 text-slate-900 dark:text-white font-black placeholder:text-slate-400 transition-all text-xs uppercase tracking-widest"
                />
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
                <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-5 border border-slate-100 dark:border-white/5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all italic">
                    <Calendar size={16} /> Date Range
                </button>
                <button className="flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-5 border border-slate-100 dark:border-white/5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all italic">
                    <Filter size={16} /> Intelligence
                </button>
            </div>
        </div>

        {/* Transaction Table */}
        <div className="bg-white dark:bg-[#0f172a] rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden">
             <div className="overflow-x-auto">
                 <table className="min-w-full text-left border-collapse">
                     <thead className="bg-slate-50/50 dark:bg-black/20 text-slate-500 dark:text-slate-500 border-b border-slate-100 dark:border-white/5">
                         <tr>
                             <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] italic">Transaction Details</th>
                             <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] italic">Region</th>
                             <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-right italic">Amount (USD)</th>
                             <th className="px-10 py-8 text-[11px] font-black uppercase tracking-[0.4em] text-right italic">Status</th>
                             <th className="px-10 py-8 w-20"></th>
                         </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                         {filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-10 py-24 text-center">
                                    <div className="flex flex-col items-center gap-6 opacity-30">
                                        <Globe size={64} className="animate-pulse" />
                                        <p className="font-black uppercase tracking-[0.6em] text-sm">No entries found in history.</p>
                                    </div>
                                </td>
                            </tr>
                         ) : (
                            displayedTransactions.map((t) => {
                             const intel = detectTransactionIntel(t.description);
                             const localAmount = t.amount * intel.rate;
                             const currentStatus = t.status || 'Completed';
                             
                             return (
                                <React.Fragment key={t.id}>
                                    <tr 
                                        onClick={() => toggleExpand(t.id)}
                                        className={`group cursor-pointer transition-all duration-700 ${expandedId === t.id ? 'bg-slate-50 dark:bg-white/[0.02]' : 'hover:bg-slate-50 dark:hover:bg-white/[0.01]'}`}
                                    >
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <div className="flex items-center gap-6">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-700 shadow-lg ${
                                                    t.type === 'credit' 
                                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400' 
                                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 group-hover:bg-slate-950 group-hover:text-amber-500'
                                                }`}>
                                                    {t.type === 'credit' ? <ArrowDownLeft size={28} /> : <ArrowUpRight size={28} />}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 dark:text-white text-base uppercase italic tracking-tighter">{t.description}</p>
                                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1.5">{t.date}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="text-2xl filter saturate-[1.2]">{intel.flag}</div>
                                                <div>
                                                    <p className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest italic">{intel.region}</p>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Wifi size={10} className="text-emerald-500" />
                                                        <p className="text-[10px] font-mono font-bold text-slate-500">RTT: {intel.latency}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={`px-10 py-8 whitespace-nowrap text-right font-black text-base tracking-tighter italic ${
                                            t.type === 'credit' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                                        }`}>
                                            {t.type === 'credit' ? '+' : '-'}${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                        <td className="px-10 py-8 whitespace-nowrap text-right">
                                            <div className="flex flex-col items-end gap-1.5">
                                                <span className={`inline-flex items-center px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-inner ${
                                                    currentStatus === 'Pending' || currentStatus === 'Processing' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                    currentStatus === 'Failed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                }`}>
                                                    {currentStatus === 'Completed' ? 'Settled' : currentStatus}
                                                </span>
                                                {intel.code !== 'USD' && (
                                                    <span className="text-[10px] font-mono font-bold text-emerald-500 opacity-80 italic">
                                                        ≈ {intel.flag} {intel.code} {localAmount.toLocaleString(undefined, {minimumFractionDigits: 0})}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-10 py-8 text-right">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleExpand(t.id);
                                                }}
                                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    expandedId === t.id 
                                                    ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20' 
                                                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:bg-slate-200 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white'
                                                }`}
                                            >
                                                {expandedId === t.id ? 'Close' : 'View Details'}
                                                {expandedId === t.id ? <ChevronUp size={14} /> : <Eye size={14} />}
                                            </button>
                                        </td>
                                    </tr>
                                    {expandedId === t.id && (
                                        <tr className="bg-slate-50/50 dark:bg-black/20 animate-fade-in">
                                            <td colSpan={5} className="px-10 pb-12 pt-6">
                                                <div className="ml-20 p-10 bg-white dark:bg-[#020617] rounded-[3rem] border border-slate-100 dark:border-white/5 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-12">
                                                    <div className="space-y-8">
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <Cpu size={14} className="text-amber-500" />
                                                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Transaction ID</span>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <span className="font-mono text-sm font-bold text-amber-500 bg-amber-500/5 px-4 py-2 rounded-xl border border-amber-500/20 shadow-sm">
                                                                    {t.reference || `TXN_${t.id.toUpperCase()}`}
                                                                </span>
                                                                <button 
                                                                    onClick={(e) => handleCopy(e, t.reference || t.id)}
                                                                    className="text-slate-400 hover:text-amber-500 transition-all p-2.5 rounded-xl hover:bg-amber-500/10 border border-transparent hover:border-amber-500/20"
                                                                >
                                                                    {copiedId === (t.reference || t.id) ? <CheckCircle size={20} className="text-emerald-500" /> : <Copy size={20} />}
                                                                </button>
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <Navigation size={14} className="text-blue-500" />
                                                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Network Details</span>
                                                            </div>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                                                Processed via <strong className="text-slate-900 dark:text-white uppercase tracking-widest text-xs">{t.network || 'High SL Global Network'}</strong>. 
                                                                Originating from <strong className="text-slate-900 dark:text-white">New York</strong> cluster. 
                                                                Final settlement achieved in the <strong className="text-slate-900 dark:text-white">{intel.region}</strong> gateway with zero friction.
                                                            </p>
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-3 mb-3">
                                                                <FileText size={14} className="text-purple-500" />
                                                                <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Memo / Notes</span>
                                                            </div>
                                                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                                                {t.notes || 'No additional notes provided for this transaction.'}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-5 pt-2">
                                                            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 shadow-inner">
                                                                <CheckCircle size={14} className="text-emerald-500" />
                                                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Verified</span>
                                                            </div>
                                                            <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 shadow-inner">
                                                                <Zap size={14} className="text-blue-500" />
                                                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest italic">{intel.code} Network Live</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="space-y-8">
                                                        <div className="grid grid-cols-2 gap-8">
                                                            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-inner">
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block italic">Origin Account</span>
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <div className="p-2 bg-white dark:bg-slate-800 rounded-lg">
                                                                        <MapPin size={14} className="text-slate-400" />
                                                                    </div>
                                                                    <p className="font-black text-slate-900 dark:text-white text-xs truncate uppercase tracking-tighter italic">
                                                                        {t.sender || (t.type === 'debit' ? 'S. Jenkins' : t.description)}
                                                                    </p>
                                                                </div>
                                                                <p className="text-[9px] font-mono text-slate-500 ml-11">ACC: •••• {t.senderAccount ? t.senderAccount.slice(-4) : '4421'}</p>
                                                            </div>
                                                            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] border border-slate-100 dark:border-white/5 shadow-inner">
                                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block italic">Target Account</span>
                                                                <div className="flex items-center gap-3 mb-2">
                                                                    <div className="p-2 bg-amber-500/10 rounded-lg">
                                                                        <MapPin size={14} className="text-amber-500" />
                                                                    </div>
                                                                    <p className="font-black text-slate-900 dark:text-white text-xs truncate uppercase tracking-tighter italic">
                                                                        {t.recipient || (t.type === 'debit' ? t.description : 'S. Jenkins')}
                                                                    </p>
                                                                </div>
                                                                <p className="text-[9px] font-mono text-slate-500 ml-11">ACC: •••• {t.recipientAccount ? t.recipientAccount.slice(-4) : '8892'}</p>
                                                            </div>
                                                        </div>
                                                        <div className="p-8 bg-slate-950 rounded-[2.5rem] border border-white/5 relative overflow-hidden shadow-2xl">
                                                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>
                                                            <div className="flex justify-between items-center mb-5">
                                                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Transaction Value</span>
                                                                <div className="flex items-center gap-2">
                                                                    <ActivityIcon size={12} className="text-emerald-500 animate-pulse" />
                                                                    <span className="text-[9px] font-mono text-emerald-500 uppercase font-bold tracking-widest">SYNC_OK</span>
                                                                </div>
                                                            </div>
                                                            <div className="flex justify-between items-end">
                                                                <div>
                                                                    <p className="text-4xl font-black text-white tracking-tighter italic">
                                                                        ${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                                                    </p>
                                                                    <p className="text-[10px] font-bold text-slate-500 mt-2 uppercase tracking-[0.3em] italic">Premium Tier: Zero Network Fees</p>
                                                                </div>
                                                                <button className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10 shadow-lg group italic">
                                                                    <FileText size={16} className="text-amber-500 group-hover:scale-110 transition-transform" /> Get Receipt
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                             );
                            })
                         )}
                     </tbody>
                 </table>
             </div>
                          {/* Infinite Scroll Sentinel */}
             {filteredTransactions.length > 0 && (
                 <div ref={observerTarget} className="p-8 flex justify-center items-center border-t border-slate-100 dark:border-white/5">
                     {isLoadingMore ? (
                         <div className="flex items-center gap-3 text-slate-400">
                             <Loader2 size={20} className="animate-spin text-amber-500" />
                             <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Loading...</span>
                         </div>
                     ) : visibleCount < filteredTransactions.length ? (
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">Scroll for more</span>
                     ) : (
                         <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 italic">End of History</span>
                     )}
                 </div>
             )}
        </div>
    </div>
  );
};

export default Activity;

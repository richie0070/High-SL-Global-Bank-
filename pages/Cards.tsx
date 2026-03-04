
import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Shield, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  Plus, 
  ChevronRight, 
  Apple, 
  Smartphone, 
  Zap, 
  MapPin, 
  Globe, 
  History, 
  AlertCircle,
  Copy,
  CheckCircle,
  RefreshCw,
  Trash2,
  MoreVertical,
  PlusCircle,
  Loader2
} from 'lucide-react';

interface CardData {
    id: string;
    type: 'physical' | 'virtual';
    tier: 'obsidian' | 'platinum' | 'crystal';
    number: string;
    expiry: string;
    holder: string;
    cvv: string;
    status: 'active' | 'frozen' | 'replaced';
}

const Cards: React.FC = () => {
    const [cards, setCards] = useState<CardData[]>([
        {
            id: 'c1',
            type: 'physical',
            tier: 'obsidian',
            number: '4532 9982 1102 8841',
            expiry: '10/28',
            holder: 'SARAH JENKINS',
            cvv: '123',
            status: 'active'
        },
        {
            id: 'c2',
            type: 'virtual',
            tier: 'crystal',
            number: '4112 0042 9912 3302',
            expiry: '05/26',
            holder: 'SARAH JENKINS',
            cvv: '992',
            status: 'active'
        }
    ]);

    const [activeCardId, setActiveCardId] = useState(cards[0].id);
    const [isRevealed, setIsRevealed] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isIssuing, setIsIssuing] = useState(false);
    const [isReplacing, setIsReplacing] = useState(false);

    const activeCard = cards.find(c => c.id === activeCardId) || cards[0];

    const toggleFreeze = () => {
        setCards(cards.map(c => 
            c.id === activeCardId 
            ? { ...c, status: c.status === 'frozen' ? 'active' : 'frozen' } 
            : c
        ));
    };

    const handleReplace = () => {
        setIsReplacing(true);
        setTimeout(() => {
            setCards(cards.map(c => 
                c.id === activeCardId 
                ? { ...c, status: 'replaced', number: '•••• •••• •••• ••••' } 
                : c
            ));
            setIsReplacing(false);
            // In a real app, this would trigger ordering a new one
        }, 2000);
    };

    const handleIssueVirtual = () => {
        setIsIssuing(true);
        setTimeout(() => {
            const newCard: CardData = {
                id: `c${Date.now()}`,
                type: 'virtual',
                tier: 'platinum',
                number: `4812 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`,
                expiry: '12/27',
                holder: 'SARAH JENKINS',
                cvv: String(Math.floor(100 + Math.random() * 899)),
                status: 'active'
            };
            setCards([...cards, newCard]);
            setActiveCardId(newCard.id);
            setIsIssuing(false);
        }, 1500);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(activeCard.number);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-12 animate-fade-in max-w-6xl mx-auto pb-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-10">
                <div>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                            <CreditCard size={18} className="text-amber-500" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500">Card Access Control</span>
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase leading-none">Cards</h1>
                </div>
                <button 
                    onClick={handleIssueVirtual}
                    disabled={isIssuing}
                    className="group relative flex items-center gap-3 bg-slate-950 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-[1.75rem] font-black text-xs uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl overflow-hidden italic"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {isIssuing ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} className="text-amber-500" />}
                    {isIssuing ? 'Issuing Virtual Card...' : 'Issue Virtual Card'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left: Card Selection & Visual */}
                <div className="lg:col-span-7 space-y-12">
                    
                    {/* The Card Component */}
                    <div className="relative group">
                        <div className={`relative w-full aspect-[1.586/1] rounded-[2.5rem] p-10 text-white overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transition-all duration-1000 transform ${activeCard.status === 'frozen' ? 'grayscale opacity-70 scale-[0.98]' : 'hover:scale-[1.02]'} ${
                            activeCard.tier === 'obsidian' ? 'bg-[#020617]' : 
                            activeCard.tier === 'platinum' ? 'bg-gradient-to-br from-slate-400 via-slate-200 to-slate-500 text-slate-900' :
                            'bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-900'
                        }`}>
                            
                            {/* Textures and Premium Effects */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.08] mix-blend-overlay"></div>
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none"></div>
                            
                            {/* Dynamic Shimmer Sweep */}
                            <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[250%] transition-transform duration-[2000ms] ease-in-out"></div>

                            {/* Card Content */}
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className={`text-[12px] font-black uppercase tracking-[0.4em] italic ${activeCard.tier === 'platinum' ? 'text-slate-900' : 'text-amber-500'}`}>High SL Global</h3>
                                        <p className={`text-[9px] font-black tracking-[0.2em] uppercase opacity-60 italic ${activeCard.tier === 'platinum' ? 'text-slate-700' : 'text-slate-400'}`}>
                                            {activeCard.type.toUpperCase()} / {activeCard.tier.toUpperCase()} CARD
                                        </p>
                                    </div>
                                    <div className={`w-14 h-14 flex items-center justify-center rounded-2xl backdrop-blur-md border ${
                                        activeCard.tier === 'platinum' ? 'bg-black/5 border-black/10' : 'bg-white/5 border-white/10'
                                    }`}>
                                        <Zap size={28} className={activeCard.tier === 'platinum' ? 'text-slate-900' : 'text-amber-500'} />
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-14 h-10 rounded-lg flex items-center justify-center relative overflow-hidden ${
                                            activeCard.tier === 'platinum' ? 'bg-black/10' : 'bg-white/10'
                                        }`}>
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent"></div>
                                            <div className="w-10 h-6 border border-white/20 rounded flex items-center justify-center">
                                                <div className="w-4 h-4 bg-white/20 rounded-full blur-[2px]"></div>
                                            </div>
                                        </div>
                                        <p className={`text-3xl md:text-4xl font-mono tracking-[0.18em] transition-all duration-500 ${
                                            activeCard.tier === 'platinum' ? 'text-slate-900' : 'text-white'
                                        }`}>
                                            {activeCard.status === 'replaced' ? '•••• •••• •••• ••••' : isRevealed ? activeCard.number : `•••• •••• •••• ${activeCard.number.slice(-4)}`}
                                        </p>
                                    </div>
                                    
                                    <div className="flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className={`text-[10px] font-black uppercase tracking-widest opacity-50 ${activeCard.tier === 'platinum' ? 'text-slate-700' : 'text-slate-400'}`}>Cardholder</p>
                                            <p className={`text-lg font-black tracking-tight italic uppercase ${activeCard.tier === 'platinum' ? 'text-slate-900' : 'text-white'}`}>{activeCard.holder}</p>
                                        </div>
                                        <div className="flex gap-8 items-end">
                                            <div className="text-right">
                                                <p className={`text-[10px] font-black uppercase tracking-widest opacity-50 ${activeCard.tier === 'platinum' ? 'text-slate-700' : 'text-slate-400'}`}>Expires</p>
                                                <p className={`text-base font-bold font-mono ${activeCard.tier === 'platinum' ? 'text-slate-900' : 'text-white'}`}>{activeCard.expiry}</p>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <div className="flex gap-1 mb-2">
                                                    <div className="w-7 h-7 rounded-full bg-red-600/80 backdrop-blur-sm"></div>
                                                    <div className="w-7 h-7 rounded-full bg-amber-500/80 -ml-4 backdrop-blur-sm"></div>
                                                </div>
                                                <p className={`text-[9px] font-black italic tracking-tighter opacity-70 ${activeCard.tier === 'platinum' ? 'text-slate-950' : 'text-slate-300'}`}>WORLD ELITE</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Status Overlays */}
                            {activeCard.status === 'frozen' && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#020617]/60 backdrop-blur-[3px] animate-fade-in">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="p-6 bg-white rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.5)] border border-slate-200">
                                            <Lock size={48} className="text-slate-950" />
                                        </div>
                                        <span className="text-xl font-black uppercase tracking-[0.4em] text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] italic">Account Frozen</span>
                                    </div>
                                </div>
                            )}

                            {activeCard.status === 'replaced' && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-red-950/40 backdrop-blur-[3px] animate-fade-in">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="p-6 bg-white rounded-[2rem] shadow-xl border border-red-200">
                                            <RefreshCw size={48} className="text-red-600 animate-spin-slow" />
                                        </div>
                                        <span className="text-xl font-black uppercase tracking-[0.4em] text-white italic">Card Deactivated</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Floating Interaction Controls */}
                        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 p-3 bg-white dark:bg-[#0f172a] rounded-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 dark:border-white/5 z-30">
                            <button 
                                onClick={() => setIsRevealed(!isRevealed)}
                                className="flex items-center gap-3 px-6 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 italic"
                            >
                                {isRevealed ? <EyeOff size={18} /> : <Eye size={18} />}
                                {isRevealed ? 'Mask' : 'Reveal'}
                            </button>
                            <div className="w-px h-8 bg-slate-100 dark:bg-white/10"></div>
                            <button 
                                onClick={handleCopy}
                                className="flex items-center gap-3 px-6 py-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 italic"
                            >
                                {copied ? <CheckCircle size={18} className="text-emerald-500" /> : <Copy size={18} />}
                                {copied ? 'Copied' : 'Copy'}
                            </button>
                        </div>
                    </div>

                    {/* Card Dashboard Selector */}
                    <div className="pt-10 space-y-6">
                        <h4 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 italic flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div> Active Card Registry
                        </h4>
                        <div className="flex flex-wrap gap-4">
                            {cards.map((card) => (
                                <button 
                                    key={card.id}
                                    onClick={() => { setActiveCardId(card.id); setIsRevealed(false); }}
                                    className={`relative px-8 py-6 rounded-[2rem] border-2 transition-all duration-500 group ${
                                        activeCardId === card.id 
                                        ? 'bg-white dark:bg-white/5 border-amber-500 shadow-2xl scale-105 z-10' 
                                        : 'bg-slate-50 dark:bg-[#020617] border-slate-200 dark:border-white/5 hover:border-amber-500/30 grayscale opacity-60'
                                    }`}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-xl ${activeCardId === card.id ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'}`}>
                                            <CreditCard size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className={`text-[10px] font-black uppercase tracking-widest ${activeCardId === card.id ? 'text-amber-500' : 'text-slate-500'}`}>
                                                {card.tier} {card.type}
                                            </p>
                                            <p className={`text-sm font-bold ${activeCardId === card.id ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                                •••• {card.number.slice(-4)}
                                            </p>
                                        </div>
                                    </div>
                                    {card.status === 'frozen' && (
                                        <div className="absolute -top-2 -right-2 bg-red-500 p-1.5 rounded-full shadow-lg border-2 border-white dark:border-[#020617]">
                                            <Lock size={12} className="text-white" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Spend Control Module */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-[#0f172a] p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-3 italic">
                                <Apple size={16} className="text-slate-400" /> High-Fidelity Pairing
                            </h4>
                            <div className="space-y-6">
                                <WalletIntegrationItem label="Apple Pay" status="Connected" icon={<Smartphone size={18} className="text-blue-500" />} />
                                <WalletIntegrationItem label="Google Pay" status="Ready" icon={<Smartphone size={18} className="text-emerald-500" />} />
                            </div>
                        </div>
                        <div className="bg-white dark:bg-[#0f172a] p-10 rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-3 italic">
                                <Globe size={16} className="text-slate-400" /> Network Capacity
                            </h4>
                            <div className="space-y-6">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-500 italic">Auth Limit / Day</span>
                                    <span className="text-sm font-black text-slate-900 dark:text-white italic">$12,450 / $25,000</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-amber-500 w-[50%] rounded-full shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                                </div>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-center italic">Resetting in 12h 14m</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Security & Activity */}
                <div className="lg:col-span-5 space-y-12">
                    
                    {/* Command Actions */}
                    <div className="bg-white dark:bg-[#0f172a] rounded-[3rem] border border-slate-200 dark:border-white/5 shadow-sm p-10 space-y-6">
                        <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 italic mb-8">Card Commands</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <button 
                                onClick={toggleFreeze}
                                disabled={activeCard.status === 'replaced'}
                                className={`w-full group flex items-center justify-between p-6 rounded-2xl border transition-all duration-500 ${
                                    activeCard.status === 'frozen' 
                                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20' 
                                    : 'bg-slate-50 dark:bg-[#020617] border-slate-100 dark:border-white/5 hover:border-amber-500/30 text-slate-900 dark:text-white'
                                } ${activeCard.status === 'replaced' ? 'opacity-20 cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl transition-colors ${activeCard.status === 'frozen' ? 'bg-emerald-500 text-white' : 'bg-white dark:bg-slate-800 text-slate-500'}`}>
                                        {activeCard.status === 'frozen' ? <Unlock size={20} /> : <Lock size={20} />}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-black uppercase italic">{activeCard.status === 'frozen' ? 'Unfreeze Card' : 'Freeze Card'}</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest italic">Instant spend lock</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                            </button>

                            <button 
                                onClick={handleReplace}
                                disabled={isReplacing || activeCard.status === 'replaced'}
                                className={`w-full group flex items-center justify-between p-6 rounded-2xl border bg-slate-50 dark:bg-[#020617] border-slate-100 dark:border-white/5 hover:border-red-500/30 text-slate-900 dark:text-white transition-all ${activeCard.status === 'replaced' ? 'opacity-20 cursor-not-allowed' : ''}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white dark:bg-slate-800 text-slate-500 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-all">
                                        {isReplacing ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-black uppercase italic">Replace Card</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest italic">Issue replacement card</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                            </button>

                            <button className="w-full group flex items-center justify-between p-6 rounded-2xl border bg-slate-50 dark:bg-[#020617] border-slate-100 dark:border-white/5 hover:border-blue-500/30 text-slate-900 dark:text-white transition-all">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white dark:bg-slate-800 text-slate-500 rounded-xl group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <Smartphone size={20} />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-black uppercase italic">Update Digital Auth</p>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-widest italic">PIN & Biometric reset</p>
                                    </div>
                                </div>
                                <ChevronRight size={18} className="opacity-20 group-hover:opacity-100 transition-opacity" />
                            </button>
                        </div>
                    </div>

                    {/* Security Shielding */}
                    <div className="bg-[#020617] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl group">
                         <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                         <div className="relative z-10">
                            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 mb-10 italic flex items-center gap-3">
                                <Shield size={18} className="text-emerald-500 animate-pulse" /> Security Controls
                            </h3>
                            <div className="space-y-8">
                                <SecurityToggle label="International Transactions" desc="Authorize spending outside US region" checked={true} />
                                <SecurityToggle label="Virtual Card Access" desc="Allow virtual card spend" checked={true} />
                                <SecurityToggle label="ATM Withdrawals" desc="Authorized physical cash extraction" checked={false} />
                            </div>
                         </div>
                    </div>

                    {/* Recent Transactions List */}
                    <div className="bg-white dark:bg-[#0f172a] rounded-[3rem] p-10 border border-slate-200 dark:border-white/5 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] italic flex items-center gap-3">
                                <History size={18} /> Card Activity
                            </h3>
                            <button className="text-[9px] font-black text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest italic">Full History</button>
                        </div>
                        <div className="space-y-8">
                            <CardTransaction icon={<MapPin size={20} />} title="Apple Store NY" date="Today, 11:24 AM" amount="- $1,299.00" />
                            <CardTransaction icon={<MapPin size={20} />} title="Four Seasons NY" date="Yesterday" amount="- $895.40" />
                            <CardTransaction icon={<MapPin size={20} />} title="Uber Luxury" date="Oct 28" amount="- $142.10" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Legal Footnote */}
            <div className="flex gap-8 p-10 bg-[#020617] rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
                <AlertCircle size={28} className="flex-shrink-0 text-amber-500 mt-1" />
                <p className="text-[10px] text-slate-500 leading-relaxed font-black uppercase tracking-[0.2em] italic opacity-80 group-hover:opacity-100 transition-opacity">
                    All premium cards are issued via High SL Global Bank N.A. and secured by advanced encryption. Multi-factor validation applies to all virtual card spend. Terms of use for premium accounts apply. Member FDIC.
                </p>
            </div>
        </div>
    );
};

const WalletIntegrationItem = ({ label, status, icon }: any) => (
    <div className="flex items-center justify-between p-5 bg-slate-50 dark:bg-white/[0.02] rounded-[1.75rem] border border-slate-100 dark:border-white/5 shadow-inner group hover:border-amber-500/30 transition-all cursor-default">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-white dark:bg-slate-800 rounded-xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{label}</span>
        </div>
        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20 shadow-sm italic">{status}</span>
    </div>
);

const SecurityToggle = ({ label, desc, checked }: any) => {
    const [state, setState] = useState(checked);
    return (
        <div className="flex items-center justify-between group cursor-pointer" onClick={() => setState(!state)}>
            <div className="flex-1">
                <p className="text-sm font-black uppercase italic tracking-tighter text-white group-hover:text-amber-500 transition-colors">{label}</p>
                <p className="text-[10px] text-slate-500 mt-1 font-bold uppercase tracking-widest italic">{desc}</p>
            </div>
            <div className={`w-12 h-6 rounded-full relative transition-all duration-500 shadow-inner ${state ? 'bg-emerald-500' : 'bg-slate-800'}`}>
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-500 shadow-xl ${state ? 'left-7' : 'left-1'}`}></div>
            </div>
        </div>
    );
};

const CardTransaction = ({ icon, title, date, amount }: any) => (
    <div className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-transform">
        <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-amber-500/10 group-hover:text-amber-500 transition-all shadow-inner">
                {icon}
            </div>
            <div>
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">{title}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1.5 italic">{date}</p>
            </div>
        </div>
        <span className="text-sm font-mono font-black text-slate-900 dark:text-white tracking-tighter italic">{amount}</span>
    </div>
);

export default Cards;

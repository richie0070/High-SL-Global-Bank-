
import React, { useState, useEffect } from 'react';
import { User, Loan } from '../types';
import LoanStatusTable from '../components/LoanStatusTable';
import { 
  PlusCircle, 
  Shield, 
  TrendingUp, 
  CreditCard, 
  ChevronRight, 
  ChevronDown,
  Zap, 
  Lock, 
  Home,
  AlertCircle,
  Activity,
  Check,
  X,
  Car,
  Plane,
  DollarSign,
  Calendar,
  Calculator,
  Loader2,
  ShieldCheck,
  ArrowRight,
  Cpu,
  Layers,
  Sparkles,
  ArrowDownLeft,
  ChevronLeft,
  Fingerprint,
  Database
} from 'lucide-react';

const SCORE_HISTORY = [
  { month: 'Jan', score: 710 },
  { month: 'Feb', score: 712 },
  { month: 'Mar', score: 718 },
  { month: 'Apr', score: 715 },
  { month: 'May', score: 728 },
  { month: 'Jun', score: 742 },
];

const CreditFactorRow = ({ label, value, status, percentage, color }: { label: string, value: string, status: string, percentage: number, color: string }) => (
    <div className="mb-6 last:mb-0 group">
        <div className="flex justify-between items-end mb-2">
            <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                {label}
            </span>
            <div className="text-right">
                <span className="text-sm font-bold text-slate-900 dark:text-white mr-3">{value}</span>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest ${
                    status === 'Excellent' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-inner' :
                    status === 'Good' ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-inner' :
                    'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-inner'
                }`}>{status}</span>
            </div>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
            <div 
                className={`h-full rounded-full transition-all duration-[2000ms] ease-out ${color}`} 
                style={{ width: `${percentage}%` }}
            ></div>
        </div>
    </div>
);

// Fix: Define LoansProps interface for the component
interface LoansProps {
  user: User;
  loans: Loan[];
  onApplyLoan: (amount: number, purpose: string) => void;
  filterStatus?: string;
}

const Loans: React.FC<LoansProps> = ({ user, loans, onApplyLoan, filterStatus }) => {
  const userLoans = user.role === 'admin' 
    ? (filterStatus ? loans.filter(l => l.status === filterStatus) : loans)
    : loans.filter(loan => loan.userId === user.id);
    
  const [animateScore, setAnimateScore] = useState(0);
  const SCORE = 742;

  // --- APPLICATION MODAL STATE ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appStep, setAppStep] = useState(1);
  const [appData, setAppData] = useState({
      type: '',
      amount: 15000,
      term: 24, // months
      fullName: '',
      ssn: '',
      phone: '',
      address: '',
      income: '',
      employment: 'Full-time Exec',
      housingPayment: ''
  });
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalLogs, setEvalLogs] = useState<string[]>([]);

  useEffect(() => {
      const timer = setTimeout(() => setAnimateScore(SCORE), 500);
      return () => clearTimeout(timer);
  }, []);

  const percentage = Math.min(Math.max((animateScore - 300) / (850 - 300), 0), 1);

  const APR = 0.0699;
  const monthlyRate = APR / 12;
  const monthlyPayment = (appData.amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -appData.term));

  const handleNextStep = () => {
      if (appStep === 1 && !appData.type) return; 
      if (appStep === 3 && (!appData.fullName || !appData.ssn)) return;
      if (appStep === 4 && (!appData.income || !appData.housingPayment)) return;
      setAppStep(prev => prev + 1);
  };

  // Fix: Added handlePrevStep function to navigate back in the application wizard
  const handlePrevStep = () => {
      setAppStep(prev => prev - 1);
  };

  const submitApplication = async () => {
      setIsEvaluating(true);
      setAppStep(5);
      
      const logs = [
          "Verifying identity...",
          "Checking credit history...",
          "Analyzing income data...",
          "Verifying asset integrity...",
          "Processing application...",
          "Finalizing approval...",
          "Funds ready for deposit"
      ];

      for (const log of logs) {
          setEvalLogs(prev => [...prev, log]);
          await new Promise(r => setTimeout(r, 700));
      }

      if (onApplyLoan) {
          onApplyLoan(appData.amount, appData.type);
      }
      setIsEvaluating(false);
      setAppStep(6);
  };

  const resetModal = () => {
      setIsModalOpen(false);
      setTimeout(() => {
          setAppStep(1);
          setAppData({ 
              type: '', 
              amount: 15000, 
              term: 24, 
              fullName: '',
              ssn: '',
              phone: '',
              address: '',
              income: '', 
              employment: 'Full-time Exec',
              housingPayment: ''
          });
          setEvalLogs([]);
      }, 400);
  };

  return (
    <div className="space-y-16 animate-fade-in max-w-7xl mx-auto pb-32">
      
      {/* Header Block */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-slate-200 dark:border-slate-800/60 pb-12">
          <div>
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-inner">
                    <Sparkles size={24} className="text-amber-500 animate-pulse" />
                </div>
                <span className="text-[12px] font-black uppercase tracking-[0.6em] text-slate-500 italic">Lending & Credit</span>
            </div>
            <h1 className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase leading-none">Lending Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-6 text-xl font-medium italic">High-fidelity liquidity for elite estates.</p>
          </div>
          <button 
             onClick={() => setIsModalOpen(true)}
             className="group relative flex items-center gap-5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 px-10 py-5 rounded-[2.5rem] font-black text-sm uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden italic"
          >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <PlusCircle size={24} className="text-amber-500" /> Apply for Loan
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: Credit Intel */}
        <div className="lg:col-span-4 space-y-12">
            
            <div className="bg-[#020617] rounded-[4rem] p-12 text-white border border-white/10 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.8)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]"></div>
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[120px] group-hover:bg-emerald-500/20 transition-all duration-1000"></div>
                
                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-12">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center shadow-inner">
                                <Shield className="text-emerald-500" size={24} />
                            </div>
                            <h3 className="text-xs font-black tracking-[0.5em] uppercase text-slate-400 italic">Credit Score</h3>
                        </div>
                        <span className="text-[10px] font-mono font-bold bg-white/5 text-emerald-500/80 px-4 py-1.5 rounded-xl border border-white/10 italic">
                            FICO Score
                        </span>
                    </div>

                    <div className="relative h-56 flex items-center justify-center mb-8">
                        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="currentColor" strokeWidth="14" strokeLinecap="round" className="text-white/5" />
                            <defs>
                                <linearGradient id="scoreEliteGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#ef4444" />
                                    <stop offset="50%" stopColor="#f59e0b" />
                                    <stop offset="100%" stopColor="#10b981" />
                                </linearGradient>
                            </defs>
                            <path 
                                d="M 20 100 A 80 80 0 0 1 180 100" 
                                fill="none" 
                                stroke="url(#scoreEliteGrad)" 
                                strokeWidth="14" 
                                strokeLinecap="round" 
                                strokeDasharray="251"
                                strokeDashoffset={251 - (251 * percentage)}
                                className="transition-all duration-[3000ms] ease-out"
                            />
                        </svg>
                        <div className="absolute bottom-6 flex flex-col items-center">
                            <span className="text-7xl font-black text-white tracking-tighter italic">{animateScore}</span>
                            <div className="flex items-center gap-3 mt-4">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                <span className="text-emerald-500 font-black uppercase text-[11px] tracking-[0.4em] italic">Platinum Tier</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 mt-12">
                        <CreditFactorRow label="Payment History" value="100%" status="Excellent" percentage={100} color="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
                        <CreditFactorRow label="Credit Utilization" value="8%" status="Excellent" percentage={92} color="bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.6)]" />
                        <CreditFactorRow label="Account Age" value="4.2 yrs" status="Good" percentage={65} color="bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.6)]" />
                    </div>
                </div>
            </div>
            
            <button className="w-full group p-8 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/5 rounded-[3rem] shadow-xl hover:border-amber-500/50 transition-all flex items-center justify-between overflow-hidden relative">
                <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/5 transition-colors"></div>
                <div className="flex items-center gap-6 relative z-10">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-amber-500 transition-all group-hover:text-slate-950 shadow-inner group-hover:rotate-6">
                        <Activity size={24} />
                    </div>
                    <span className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors italic">Credit Report</span>
                </div>
                <ChevronRight size={22} className="text-slate-300 group-hover:translate-x-2 transition-transform relative z-10" />
            </button>
        </div>

        {/* RIGHT: Offers & History */}
        <div className="lg:col-span-8 space-y-16">
             
             <div className="space-y-10">
                <div className="flex items-center gap-6">
                    <h2 className="text-[13px] font-black uppercase tracking-[0.6em] text-slate-400 italic">Loan Offers</h2>
                    <div className="h-px flex-1 bg-slate-100 dark:bg-white/5"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div onClick={() => setIsModalOpen(true)} className="group relative overflow-hidden rounded-[3.5rem] p-12 bg-[#020617] text-white cursor-pointer transition-all duration-1000 hover:shadow-amber-500/20 border border-white/5 shadow-2xl">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
                        <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-500/10 rounded-full blur-[100px] group-hover:bg-amber-500/20 transition-all"></div>
                        
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-10">
                                    <div className="p-5 bg-white/5 rounded-2xl border border-white/10 group-hover:border-amber-500/40 transition-all shadow-inner group-hover:-translate-y-2">
                                        <CreditCard size={32} className="text-amber-500" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="bg-amber-500 text-slate-950 text-[11px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-xl italic">Elite Tier</span>
                                        <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-3 italic">ZERO ORIGINATION FEES</span>
                                    </div>
                                </div>
                                <h3 className="text-4xl font-black mb-4 italic uppercase tracking-tighter">Personal Loan</h3>
                                <p className="text-slate-400 text-base leading-relaxed mb-12 font-medium">
                                    Instant-settlement capital expansion. Optimized for ultra-high-net-worth liquidity requirements.
                                </p>
                            </div>
                            
                            <div className="pt-10 border-t border-white/5">
                                <div className="flex items-baseline gap-4 mb-8">
                                    <span className="text-6xl font-black text-white tracking-tighter italic">6.99%</span>
                                    <span className="text-sm font-black text-slate-600 uppercase tracking-widest italic">Fixed APR</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-amber-500 uppercase tracking-[0.5em] italic">Cap: $50,000</span>
                                    <div className="flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.3em] group-hover:gap-6 transition-all text-white italic">
                                        Deploy Now <ArrowRight size={20} className="text-amber-500" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-[3.5rem] p-12 bg-white dark:bg-[#0f172a] border border-slate-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-1000 cursor-pointer group">
                         <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-blue-500/0 group-hover:from-blue-500/[0.05] transition-all duration-1000"></div>
                         
                         <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-10">
                                    <div className="p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-white/5 group-hover:bg-slate-950 transition-all shadow-inner group-hover:-translate-y-2">
                                        <Home size={32} className="text-blue-500 group-hover:text-white" />
                                    </div>
                                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest italic">Property Secured</span>
                                </div>
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white mb-4 italic uppercase tracking-tighter">Home Equity</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-base leading-relaxed mb-12 font-medium">
                                    Leverage your property assets for immediate capital deployment.
                                </p>
                            </div>

                            <div className="pt-10 border-t border-slate-100 dark:border-white/5">
                                <div className="flex items-baseline gap-4 mb-8">
                                    <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter italic">4.50%</span>
                                    <span className="text-sm font-black text-slate-500 uppercase tracking-widest italic">Intro Rate</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.5em] italic">Secured Pool</span>
                                    <div className="flex items-center gap-3 text-[12px] font-black uppercase tracking-[0.3em] group-hover:gap-6 transition-all text-slate-950 dark:text-white italic">
                                        View Details <ArrowRight size={20} className="text-blue-500" />
                                    </div>
                                </div>
                            </div>
                         </div>
                    </div>
                </div>
             </div>

             {/* Loan History */}
             <div className="bg-white dark:bg-[#0f172a] rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-2xl overflow-hidden">
                <div className="p-10 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-black/20">
                    <h3 className="text-[13px] font-black uppercase tracking-[0.6em] text-slate-500 italic">My Loans</h3>
                    <button className="text-[11px] font-black text-amber-500 uppercase tracking-[0.4em] hover:text-amber-400 transition-colors italic">View All</button>
                </div>
                <LoanStatusTable loans={userLoans} />
             </div>

             <div className="flex gap-6 p-10 bg-[#020617] rounded-[3rem] border border-white/10 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-[60px] pointer-events-none"></div>
                <AlertCircle size={28} className="flex-shrink-0 text-amber-500 mt-1" />
                <p className="text-xs text-slate-500 leading-relaxed font-black uppercase tracking-[0.15em] opacity-80 group-hover:opacity-100 transition-opacity italic">
                    All loan applications are subject to standard credit review and final evaluation. High SL Global Bank N.A. operates under secure banking protocols. Member FDIC • Equal Housing Lender.
                </p>
             </div>

        </div>
      </div>

      {/* --- ELITE PROVISIONING MODAL --- */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 md:p-14">
              <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-3xl animate-fade-in" onClick={resetModal}></div>
              
              <div className="dialog-content relative z-10 bg-white dark:bg-[#0f172a] w-full max-w-6xl rounded-[4.5rem] shadow-[0_80px_160px_-40px_rgba(0,0,0,1)] overflow-hidden animate-slide-up flex flex-col max-h-full border border-white/10">
                  
                  {/* Modal Terminal Header */}
                  <div className="p-12 border-b border-slate-100 dark:border-white/10 flex justify-between items-center bg-slate-50/80 dark:bg-black/40 backdrop-blur-md">
                      <div>
                          <div className="flex items-center gap-4 mb-4">
                             <div className="h-3 w-3 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,1)]"></div>
                             <h2 className="text-[14px] font-black text-slate-900 dark:text-white uppercase tracking-[0.7em] italic">Loan Application</h2>
                          </div>
                          
                          <div className="w-full max-w-xl mt-8 relative">
                              {/* Progress Bar Background */}
                              <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden">
                                  <div 
                                      className="h-full bg-amber-500 transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(245,158,11,0.5)]"
                                      style={{ width: `${Math.min(((appStep - 1) / 3) * 100, 100)}%` }}
                                  ></div>
                              </div>

                              <div className="flex justify-between relative z-10">
                                  {[1, 2, 3, 4].map((s) => (
                                      <div key={s} className="flex flex-col items-center gap-3 group cursor-default">
                                          <div className={`h-10 w-10 rounded-[1.25rem] flex items-center justify-center text-[11px] font-black border-2 transition-all duration-500 ${
                                              appStep === s 
                                                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.5)] scale-110 z-20' 
                                                  : appStep > s 
                                                      ? 'bg-emerald-500 text-white border-emerald-500 z-10' 
                                                      : 'bg-white dark:bg-slate-900 text-slate-300 dark:text-slate-600 border-slate-200 dark:border-white/10'
                                          }`}>
                                              {appStep > s ? <Check size={16} strokeWidth={4} /> : `0${s}`}
                                          </div>
                                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic transition-all duration-500 ${
                                              appStep === s ? 'text-amber-500 translate-y-0 opacity-100' : appStep > s ? 'text-emerald-500 opacity-80' : 'text-slate-400 opacity-50'
                                          }`}>
                                              {s === 1 && "Loan Type"}
                                              {s === 2 && "Amount"}
                                              {s === 3 && "Personal"}
                                              {s === 4 && "Financial"}
                                          </span>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                      <button onClick={resetModal} className="p-5 bg-white/5 rounded-3xl hover:bg-red-500 hover:text-white transition-all text-slate-500 border border-white/10 group shadow-xl active:scale-90">
                          <X size={28} className="group-hover:rotate-90 transition-transform duration-500" />
                      </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-12 md:p-20 scrollbar-hide">
                      {/* STEP 1: CLASS SELECTION */}
                      {appStep === 1 && (
                          <div className="space-y-14 animate-fade-in">
                              <div className="text-center max-w-2xl mx-auto">
                                <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-4 leading-tight">Select Loan Type</h3>
                                <p className="text-slate-500 font-medium text-lg italic">Choose the loan type that best fits your needs.</p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                  {[
                                      { id: 'Personal Loan', icon: <DollarSign size={48} />, desc: 'Elite estate liquidity.', label: 'Personal' },
                                      { id: 'Asset Purchase', icon: <Car size={48} />, desc: 'Mobility & fleet expansion.', label: 'Auto' },
                                      { id: 'Experiential', icon: <Plane size={48} />, desc: 'Global exploration & access.', label: 'Travel' }
                                  ].map((option) => (
                                      <button 
                                        key={option.id}
                                        onClick={() => setAppData({...appData, type: option.id})}
                                        className={`group relative p-12 rounded-[3.5rem] border-[3px] text-left transition-all duration-700 overflow-hidden ${
                                            appData.type === option.id 
                                            ? 'border-amber-500 bg-amber-500/5 shadow-2xl scale-[1.03]' 
                                            : 'border-slate-100 dark:border-white/5 hover:border-amber-500/30 dark:bg-white/[0.01]'
                                        }`}
                                      >
                                          <div className={`mb-10 w-20 h-20 rounded-[1.75rem] flex items-center justify-center transition-all duration-1000 ${
                                              appData.type === option.id ? 'bg-amber-500 text-slate-950 scale-110 rotate-6 shadow-2xl' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-slate-950 group-hover:text-amber-500'
                                          }`}>
                                              {option.icon}
                                          </div>
                                          <div className="flex flex-col gap-2 mb-4">
                                            <span className={`text-[10px] font-black uppercase tracking-[0.5em] ${appData.type === option.id ? 'text-amber-500' : 'text-slate-600'}`}>Type: {option.label.split('_')[0]}</span>
                                            <h4 className={`font-black text-2xl italic uppercase tracking-tighter ${appData.type === option.id ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>{option.id}</h4>
                                          </div>
                                          <p className="text-base text-slate-500 leading-relaxed font-medium">{option.desc}</p>
                                          
                                          {appData.type === option.id && (
                                              <div className="absolute top-10 right-10">
                                                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,1)]"></div>
                                              </div>
                                          )}
                                      </button>
                                  ))}
                              </div>
                          </div>
                      )}

                      {/* STEP 2: SPECS */}
                      {appStep === 2 && (
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 animate-fade-in items-center">
                              <div className="space-y-16">
                                  <div>
                                      <label className="block text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] mb-12 italic">Loan Amount (USD)</label>
                                      <div className="relative group">
                                          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-7xl font-extralight text-amber-500/10 group-hover:text-amber-500/20 transition-all mr-8 select-none">$</span>
                                          <input 
                                            type="number" 
                                            value={appData.amount}
                                            onChange={(e) => setAppData({...appData, amount: Number(e.target.value)})}
                                            className="w-full bg-transparent text-8xl font-black text-slate-900 dark:text-white pl-16 focus:outline-none border-b-2 border-slate-100 dark:border-white/5 focus:border-amber-500 pb-10 transition-all tracking-tighter italic"
                                          />
                                      </div>
                                      <div className="mt-12 relative">
                                          <input 
                                            type="range" 
                                            min="1000" 
                                            max="100000" 
                                            step="1000"
                                            value={appData.amount}
                                            onChange={(e) => setAppData({...appData, amount: Number(e.target.value)})}
                                            className="w-full h-2.5 bg-slate-100 dark:bg-white/5 rounded-full appearance-none cursor-pointer accent-amber-500 shadow-inner"
                                          />
                                          <div className="flex justify-between mt-6 text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 italic">
                                              <span>Minimum: $1,000</span>
                                              <span>Maximum: $100,000</span>
                                          </div>
                                      </div>
                                  </div>

                                  <div>
                                      <label className="block text-[12px] font-black text-slate-500 uppercase tracking-[0.5em] mb-10 italic">Loan Term (Months)</label>
                                      <div className="flex flex-wrap gap-6">
                                          {[12, 24, 36, 48, 60].map(m => (
                                              <button 
                                                key={m}
                                                onClick={() => setAppData({...appData, term: m})}
                                                className={`px-10 py-5 rounded-[2rem] font-black text-sm tracking-[0.2em] transition-all duration-700 italic ${
                                                    appData.term === m 
                                                    ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.4)] scale-110' 
                                                    : 'bg-slate-50 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-transparent hover:border-amber-500/20 shadow-sm'
                                                }`}
                                              >
                                                  {m}M
                                              </button>
                                          ))}
                                      </div>
                                  </div>
                              </div>

                              <div className="bg-[#020617] p-12 md:p-16 rounded-[4rem] text-white border border-white/10 flex flex-col justify-center relative shadow-[0_60px_120px_-30px_rgba(0,0,0,0.9)] overflow-hidden">
                                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]"></div>
                                  
                                  <div className="relative z-10">
                                    <div className="flex items-center gap-6 mb-14">
                                        <div className="p-5 bg-white/5 rounded-2xl border border-white/10 text-emerald-500 shadow-inner group/icon">
                                            <Calculator size={36} className="group-hover:rotate-12 transition-transform" />
                                        </div>
                                        <div>
                                            <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 mb-2 italic">Loan Summary</h4>
                                            <p className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Fixed Interest Rate: 6.99%</p>
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        <div className="flex justify-between items-center text-sm font-bold">
                                            <span className="text-slate-500 uppercase tracking-[0.5em] text-[11px] font-black italic">Term Length</span>
                                            <span className="font-mono text-white text-lg">{appData.term} MONTHS</span>
                                        </div>
                                        <div className="h-px bg-white/5 shadow-inner"></div>
                                        <div>
                                            <p className="text-[12px] font-black text-slate-600 uppercase tracking-[0.6em] mb-4 italic">Monthly Payment</p>
                                            <div className="flex items-baseline gap-4">
                                                <span className="text-7xl font-black text-white tracking-tighter italic">
                                                    ${monthlyPayment.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                                                </span>
                                                <span className="text-xl font-bold text-slate-700 font-mono italic">/MO</span>
                                            </div>
                                        </div>
                                    </div>
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* STEP 3: IDENTITY SYNC */}
                      {appStep === 3 && (
                          <div className="max-w-3xl mx-auto space-y-16 animate-fade-in">
                              <div className="text-center">
                                <h3 className="text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-6 leading-none">Identity Verification</h3>
                                <p className="text-slate-500 font-medium text-lg italic">Verifying your income and employment details.</p>
                              </div>
                              
                              <div className="space-y-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-3">
                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4 italic pl-2">Annual Income</label>
                                        <div className="relative group">
                                            <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-all" size={28} />
                                            <input 
                                                type="text"
                                                placeholder="ANNUAL INCOME"
                                                value={appData.income}
                                                onChange={(e) => setAppData({...appData, income: e.target.value})}
                                                className="w-full pl-20 pr-8 py-8 bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/5 rounded-[2.5rem] outline-none focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500/50 text-2xl font-black transition-all text-slate-900 dark:text-white italic tracking-tighter"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="block text-[11px] font-black text-slate-500 uppercase tracking-[0.5em] mb-4 italic pl-2">Employment Status</label>
                                        <div className="relative group">
                                            <Database className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-all" size={28} />
                                             <select 
                                                value={appData.employment}
                                                onChange={(e) => setAppData({...appData, employment: e.target.value})}
                                                className="w-full pl-20 pr-12 py-8 bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/5 rounded-[2.5rem] outline-none focus:ring-8 focus:ring-amber-500/5 focus:border-amber-500/50 appearance-none text-2xl font-black transition-all text-slate-900 dark:text-white italic tracking-tighter"
                                            >
                                                <option>Full-time Exec</option>
                                                <option>Principal Owner</option>
                                                <option>Self-Employed</option>
                                                <option>Retired</option>
                                            </select>
                                            <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={28} />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-10 bg-amber-500/5 border-2 border-amber-500/20 rounded-[3.5rem] flex gap-10 items-center shadow-inner group/auth">
                                    <div className="h-20 w-20 bg-amber-500/20 rounded-[1.75rem] flex items-center justify-center text-amber-500 shrink-0 shadow-lg group-hover/auth:scale-110 transition-transform duration-700">
                                        <Fingerprint size={48} className="animate-pulse" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-amber-500 uppercase italic tracking-tighter mb-2">Identity Verified</h4>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-[0.2em] leading-relaxed italic">
                                            Your identity has been verified. No additional documents are required for this application.
                                        </p>
                                    </div>
                                </div>
                              </div>
                          </div>
                      )}

                      {/* EVALUATION VIEW */}
                      {appStep === 4 && (
                          <div className="flex flex-col items-center justify-center min-h-[500px] animate-fade-in text-center">
                              <div className="relative mb-16">
                                  <div className="h-40 w-40 rounded-[3.5rem] bg-[#020617] border-[3px] border-amber-500/40 flex items-center justify-center shadow-[0_0_100px_rgba(245,158,11,0.3)] group">
                                      <ShieldCheck size={80} className="text-amber-500 animate-pulse group-hover:scale-110 transition-transform" />
                                  </div>
                                  <div className="absolute inset-[-15px] rounded-[4rem] border-[3px] border-amber-500 border-t-transparent animate-spin"></div>
                                  <div className="absolute inset-[-30px] rounded-[4.5rem] border border-amber-500/20 animate-spin-reverse opacity-50"></div>
                              </div>
                              <h3 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 dark:text-white mb-10">Verifying credit data...</h3>
                              
                              <div className="w-full max-w-2xl bg-black/90 rounded-[2.5rem] p-10 font-mono text-[11px] space-y-2.5 border border-white/10 shadow-2xl overflow-hidden">
                                  <div className="flex justify-between border-b border-white/5 pb-4 mb-4 text-slate-600">
                                      <span>SECURE_SESSION</span>
                                      <span className="text-amber-500/80">LATENCY: 4ms</span>
                                  </div>
                                  <div className="space-y-1.5 h-48 overflow-y-auto scrollbar-hide">
                                      {evalLogs.map((log, i) => (
                                          <div key={i} className="flex gap-6 animate-slide-right text-left">
                                              <span className="text-slate-700">[{new Date().toLocaleTimeString([], {hour12: false, second: '2-digit'})}]</span>
                                              <span className="text-emerald-500 uppercase tracking-widest font-bold italic">{log}</span>
                                          </div>
                                      ))}
                                      <div className="text-emerald-500 animate-pulse font-black mt-4">_ PROCESSING</div>
                                  </div>
                              </div>
                          </div>
                      )}

                      {/* SUCCESS VIEW */}
                      {appStep === 5 && (
                          <div className="flex flex-col items-center justify-center text-center py-14 animate-fade-in">
                               <div className="w-40 h-40 bg-emerald-500/10 border-[3px] border-emerald-500/30 rounded-[3.5rem] flex items-center justify-center mb-12 shadow-[0_60px_120px_-30px_rgba(16,185,129,0.4)] relative group">
                                  <div className="absolute inset-0 rounded-[3.5rem] border border-emerald-500/20 animate-ping opacity-30"></div>
                                  <Check className="h-24 w-24 text-emerald-500" strokeWidth={5} />
                               </div>
                               <h2 className="text-6xl font-black text-slate-900 dark:text-white mb-6 uppercase italic tracking-tighter leading-none">Loan Approved</h2>
                               <p className="text-slate-500 font-medium max-w-xl mb-16 text-xl italic leading-relaxed">
                                   Your loan of <strong className="text-slate-900 dark:text-white">${appData.amount.toLocaleString()} ({appData.type})</strong> has been approved. Funds will be deposited into your account shortly.
                               </p>
                               <button 
                                 onClick={resetModal}
                                 className="relative group px-20 py-6 bg-slate-950 dark:bg-white text-white dark:text-slate-950 font-black text-sm uppercase tracking-[0.6em] rounded-[2.5rem] hover:scale-105 active:scale-95 transition-all shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)] overflow-hidden italic"
                                >
                                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                   Close
                               </button>
                          </div>
                      )}
                  </div>

                  {/* Modal Footer Controls */}
                  {appStep < 4 && (
                      <div className="p-12 border-t border-slate-100 dark:border-white/10 flex justify-between bg-slate-50/50 dark:bg-black/30 backdrop-blur-md">
                          {appStep > 1 ? (
                              <button 
                                onClick={handlePrevStep}
                                className="flex items-center gap-4 px-10 py-5 font-black text-[12px] uppercase tracking-[0.5em] text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all italic border-2 border-transparent hover:border-slate-200 dark:hover:border-white/10 rounded-2xl"
                              >
                                  <ChevronLeft size={22} /> Revert Step
                              </button>
                          ) : (
                              <div></div>
                          )}

                          <button 
                            onClick={appStep === 3 ? submitApplication : handleNextStep}
                            disabled={(appStep === 1 && !appData.type)}
                            className={`group relative flex items-center gap-6 px-16 py-5 bg-amber-500 text-slate-950 font-black text-[12px] uppercase tracking-[0.5em] rounded-[1.75rem] hover:bg-amber-400 transition-all shadow-[0_30px_60px_-15px_rgba(245,158,11,0.5)] italic ${
                                (appStep === 1 && !appData.type) ? 'opacity-30 cursor-not-allowed grayscale' : 'hover:scale-[1.03]'
                            }`}
                          >
                              {appStep === 3 ? 'Submit Application' : 'Next'}
                              <ArrowRight size={22} className="group-hover:translate-x-3 transition-transform duration-500" />
                          </button>
                      </div>
                  )}
              </div>
          </div>
      )}

    </div>
  );
};

export default Loans;

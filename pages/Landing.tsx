
import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Globe, 
  ArrowRight, 
  Menu, 
  X,
  ChevronRight,
  Lock,
  Moon,
  Sun,
  Zap,
  Briefcase,
  TrendingUp,
  Smartphone,
  CreditCard,
  PieChart,
  Activity,
  Terminal,
  Cpu,
  Fingerprint,
  Award,
  MapPin,
  Wifi,
  CheckCircle,
  Crown,
  Landmark
} from 'lucide-react';

import { Logo } from '../components/Logo';

interface LandingProps {
  onLoginClick: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const Landing: React.FC<LandingProps> = ({ onLoginClick, isDarkMode, toggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
        setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`min-h-screen font-sans selection:bg-amber-500/30 selection:text-amber-900 dark:selection:text-amber-200 transition-colors duration-500 ${isDarkMode ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Abstract Background Mesh */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] rounded-full blur-[120px] opacity-20 mix-blend-screen animate-pulse-slow ${isDarkMode ? 'bg-blue-900' : 'bg-blue-200'}`}></div>
          <div className={`absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-20 mix-blend-screen ${isDarkMode ? 'bg-amber-900' : 'bg-amber-200'}`}></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
          scrolled 
          ? isDarkMode ? 'bg-[#020617]/80 border-white/5 backdrop-blur-xl' : 'bg-white/80 border-slate-200 backdrop-blur-xl'
          : 'bg-transparent border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between h-24 items-center">
            {/* Logo */}
            <Logo 
              iconSize={24} 
              textSize="text-2xl" 
              subTextSize="text-[10px] text-amber-500" 
              onClick={onLoginClick} 
            />

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-10">
              {['Banking', 'Investments', 'Markets', 'Concierge'].map((item) => (
                  <a key={item} href="#" className={`text-xs font-bold uppercase tracking-[0.2em] transition-all hover:text-amber-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      {item}
                  </a>
              ))}
            </div>

            {/* Actions */}
            <div className="hidden lg:flex items-center gap-6">
               <button 
                onClick={toggleTheme}
                className={`p-3 rounded-xl transition-all border ${isDarkMode ? 'text-slate-400 hover:text-white border-white/5 hover:bg-white/5' : 'text-slate-400 hover:text-slate-900 border-slate-200 hover:bg-slate-100'}`}
               >
                 {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
               </button>
              <div className={`h-8 w-px ${isDarkMode ? 'bg-white/10' : 'bg-slate-200'}`}></div>
              <button onClick={onLoginClick} className={`text-xs font-black uppercase tracking-[0.2em] px-2 transition-colors ${isDarkMode ? 'text-white hover:text-amber-500' : 'text-slate-900 hover:text-amber-600'}`}>
                Login
              </button>
              <button
                onClick={onLoginClick}
                className="group relative px-8 py-3 bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-[0.2em] rounded-xl overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all"
              >
                <span className="relative z-10 flex items-center gap-2">Open Account <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" /></span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </button>
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden flex items-center gap-4">
               <button onClick={toggleTheme} className={`${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                 {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
               </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className={`p-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`lg:hidden border-t absolute w-full shadow-2xl animate-slide-up ${isDarkMode ? 'bg-[#020617] border-white/10' : 'bg-white border-slate-100'}`}>
            <div className="p-6 space-y-4">
              {['Private Banking', 'Investment Portfolios', 'Market Insights'].map(item => (
                   <a key={item} href="#" className={`block p-4 text-sm font-bold uppercase tracking-widest rounded-xl transition-colors ${isDarkMode ? 'text-slate-300 hover:bg-white/5' : 'text-slate-600 hover:bg-slate-50'}`}>{item}</a>
              ))}
              <button 
                onClick={onLoginClick}
                className="w-full py-4 mt-4 bg-amber-500 text-slate-900 font-black text-xs uppercase tracking-[0.2em] rounded-xl"
              >
                Enter Portal
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-20 px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop" alt="Professional Architecture" className="w-full h-full object-cover opacity-40 dark:opacity-20 mix-blend-luminosity" referrerPolicy="no-referrer" />
              <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-slate-50/80 to-slate-50 dark:via-[#020617]/80 dark:to-[#020617]`}></div>
          </div>
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
              
              {/* Text Content */}
              <div className="lg:col-span-7 space-y-10 text-center lg:text-left animate-slide-up">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] ${isDarkMode ? 'bg-white/5 border-white/10 text-emerald-400' : 'bg-slate-100 border-slate-200 text-emerald-600'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Secure Banking Protocol
                  </div>
                  
                  <h1 className={`text-[12vw] sm:text-[10vw] lg:text-[8vw] font-black tracking-tighter leading-[0.85] uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      WEALTH <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600 italic">REDEFINED.</span>
                  </h1>
                  
                  <p className={`text-lg sm:text-xl max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      Experience the future of banking. High SL Global provides secure, instant cross-border settlement and premium asset management.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
                      <button 
                        onClick={onLoginClick}
                        className="px-10 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-transform shadow-2xl flex items-center justify-center gap-3"
                      >
                          Open Account <ArrowRight size={16} />
                      </button>
                      <button className={`px-10 py-5 border rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-100 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-3 ${isDarkMode ? 'border-white/10 text-white' : 'border-slate-200 text-slate-900'}`}>
                          <Briefcase size={16} /> Business
                      </button>
                  </div>

                  <div className="pt-12 flex items-center justify-center lg:justify-start gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><ShieldCheck size={18} /> FDIC Insured</div>
                      <div className="w-px h-4 bg-current opacity-20"></div>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest"><Globe size={18} /> 140+ Regions</div>
                  </div>
              </div>

              {/* Visual - Floating Card */}
              <div className="lg:col-span-5 relative perspective-1000 group mt-16 lg:mt-0">
                  <div className={`relative z-20 w-full aspect-[0.65/1] sm:aspect-[1.58/1] lg:aspect-[0.75/1] rounded-[2.5rem] p-10 flex flex-col justify-between shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transform transition-all duration-700 hover:rotate-y-12 hover:rotate-x-12 hover:scale-105 border ${isDarkMode ? 'bg-[#0a0f1e] border-white/10' : 'bg-slate-900 border-slate-700'}`}>
                      
                      {/* Card Shine */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent rounded-[2.5rem] pointer-events-none"></div>
                      <div className="absolute -inset-px rounded-[2.5rem] bg-gradient-to-br from-amber-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-sm"></div>

                      <div className="flex justify-between items-start">
                          <Zap size={32} className="text-amber-500 fill-amber-500/20" />
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Premium Tier</span>
                      </div>

                      <div className="space-y-8">
                          <div className="flex items-center gap-4">
                              <div className="flex gap-2">
                                  <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                  <div className="w-2 h-2 rounded-full bg-white/20"></div>
                                  <div className="w-2 h-2 rounded-full bg-white/20"></div>
                                  <div className="w-2 h-2 rounded-full bg-white/20"></div>
                              </div>
                              <span className="text-white/40 font-mono text-xs tracking-widest">**** 8892</span>
                          </div>
                          <div className="flex justify-between items-end">
                              <div>
                                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Asset Value</p>
                                  <p className="text-4xl sm:text-5xl font-black text-white tracking-tighter italic">$1,245,500.00</p>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Decorative Elements around card */}
                  <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse-slow"></div>
                  <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>
              </div>
          </div>
      </section>

      {/* Live Ticker */}
      <div className={`w-full py-4 border-y overflow-hidden ${isDarkMode ? 'bg-[#050914] border-white/5' : 'bg-slate-100 border-slate-200'}`}>
          <div className="flex whitespace-nowrap animate-slide-right-slow gap-16 items-center">
              {[
                  { s: 'BTC', p: '$42,150.20', c: '+2.4%' },
                  { s: 'ETH', p: '$2,240.10', c: '+1.8%' },
                  { s: 'TSLA', p: '$245.60', c: '+3.2%' },
                  { s: 'AAPL', p: '$178.35', c: '+0.5%' },
                  { s: 'GOLD', p: '$2,045.00', c: '+0.1%' },
                  { s: 'EUR/USD', p: '1.092', c: '-0.2%' },
                  { s: 'S&P 500', p: '4,780.20', c: '+1.1%' },
                  { s: 'UK 100', p: '7,680.50', c: '+0.4%' },
              ].concat([
                  { s: 'BTC', p: '$42,150.20', c: '+2.4%' },
                  { s: 'ETH', p: '$2,240.10', c: '+1.8%' },
              ]).map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-xs font-mono font-bold">
                      <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>{item.s}</span>
                      <span className={isDarkMode ? 'text-white' : 'text-slate-900'}>{item.p}</span>
                      <span className={item.c.includes('+') ? 'text-emerald-500' : 'text-red-500'}>{item.c}</span>
                  </div>
              ))}
          </div>
      </div>

      {/* Feature Grid (Bento) */}
      <section className="py-32 px-6 relative z-10">
          <div className="max-w-7xl mx-auto">
              <div className="mb-20 text-center max-w-3xl mx-auto">
                  <h2 className={`text-5xl md:text-7xl font-black uppercase italic tracking-tighter mb-6 leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      PRECISION <br/> <span className="text-amber-500">ENGINEERING.</span>
                  </h2>
                  <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      A consolidated operating system for your entire financial life. High SL Global merges traditional banking stability with decentralized speed.
                  </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Feature 1 */}
                  <div className={`md:col-span-2 p-10 rounded-[2.5rem] border relative overflow-hidden group ${isDarkMode ? 'bg-[#0a0f1e] border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                      <div className="relative z-10 flex flex-col h-full justify-between">
                          <div>
                              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-8 border border-amber-500/20 text-amber-500">
                                  <Activity size={28} />
                              </div>
                              <h3 className={`text-3xl font-black uppercase italic tracking-tighter mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Smart Savings</h3>
                              <p className={`max-w-md font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                  Our systems automatically optimize your cash flow, moving capital between high-yield accounts and checking based on your needs.
                              </p>
                          </div>
                          <div className="mt-10 flex gap-2">
                              {[1,2,3,4,5,6,7,8].map(i => (
                                  <div key={i} className="h-16 w-8 bg-amber-500/20 rounded-md flex items-end">
                                      <div className={`w-full bg-amber-500 rounded-md transition-all duration-1000 group-hover:bg-amber-400`} style={{ height: `${Math.random() * 100}%` }}></div>
                                  </div>
                              ))}
                          </div>
                      </div>
                      <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none"></div>
                  </div>

                  {/* Feature 2 */}
                  <div className={`p-10 rounded-[2.5rem] border relative overflow-hidden group ${isDarkMode ? 'bg-[#0a0f1e] border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                      <div className="relative z-10">
                          <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 border border-blue-500/20 text-blue-500">
                              <Smartphone size={28} />
                          </div>
                          <h3 className={`text-2xl font-black uppercase italic tracking-tighter mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Mobile Banking</h3>
                          <p className={`font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                              Full financial control from your pocket. Freeze cards, issue wires, and analyze markets instantly.
                          </p>
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  </div>

                  {/* Feature 3 */}
                  <div className={`p-10 rounded-[2.5rem] border relative overflow-hidden group ${isDarkMode ? 'bg-[#0a0f1e] border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                      <div className="relative z-10">
                          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-8 border border-emerald-500/20 text-emerald-500">
                              <ShieldCheck size={28} />
                          </div>
                          <h3 className={`text-2xl font-black uppercase italic tracking-tighter mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Advanced Security</h3>
                          <p className={`font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                              Top-tier encryption for every transaction. Biometric security ensures only you can authorize capital movement.
                          </p>
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                  </div>

                  {/* Account Milestones */}
                  <div className={`md:col-span-2 p-10 rounded-[2.5rem] border relative overflow-hidden group ${isDarkMode ? 'bg-[#0a0f1e] border-white/5' : 'bg-white border-slate-200 shadow-xl'}`}>
                      <div className="relative z-10">
                          <h3 className={`text-3xl font-black uppercase italic tracking-tighter mb-8 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Account Milestones</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                              {[
                                  { title: 'Premium Tier', desc: 'Verified Status Achieved', icon: <Crown size={24} />, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                                  { title: 'Global Banking', desc: 'International Access Active', icon: <Globe size={24} />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                                  { title: 'Credit Ready', desc: 'Financing Options Available', icon: <Zap size={24} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                                  { title: 'Security Verified', desc: 'Account Audit Complete', icon: <ShieldCheck size={24} />, color: 'text-purple-500', bg: 'bg-purple-500/10' }
                              ].map((item, i) => (
                                  <div key={i} className={`p-8 rounded-[2rem] border shadow-sm hover:shadow-xl transition-all duration-500 group/card cursor-default ${isDarkMode ? 'bg-[#0f172a] border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                                      <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-6 group-hover/card:scale-110 transition-transform shadow-inner`}>
                                          {item.icon}
                                      </div>
                                      <h5 className={`text-sm font-black uppercase tracking-widest mb-2 italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h5>
                                      <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider leading-relaxed">{item.desc}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Global Network Map */}
      <section className={`py-40 relative overflow-hidden ${isDarkMode ? 'bg-[#020617]' : 'bg-slate-950'}`}>
          <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop" alt="Global Network" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-[#020617]/80 to-[#020617]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-indigo-500/20 blur-[150px] rounded-full pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12">
                  <Wifi size={12} /> Global Network
              </div>
              <h2 className="text-[10vw] md:text-[8vw] font-black uppercase italic tracking-tighter mb-8 leading-[0.85]">
                  GLOBAL <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">REACH.</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 max-w-5xl mx-auto mt-24">
                  {[
                      { city: 'New York', ping: '12ms', region: 'NA-EAST' },
                      { city: 'London', ping: '24ms', region: 'EU-WEST' },
                      { city: 'Tokyo', ping: '48ms', region: 'AP-NORTHEAST' },
                      { city: 'Singapore', ping: '36ms', region: 'AP-SOUTHEAST' }
                  ].map((node, i) => (
                      <div key={node.city} className="flex flex-col items-center gap-4 group cursor-default">
                          <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center relative mb-4 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 transition-all duration-500">
                              <div className="w-3 h-3 rounded-full bg-indigo-500 relative z-10">
                                  <div className="absolute inset-0 bg-indigo-500 rounded-full animate-ping opacity-75"></div>
                              </div>
                              <svg className="absolute inset-0 w-full h-full -rotate-90 text-indigo-500/30" viewBox="0 0 100 100">
                                  <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
                              </svg>
                          </div>
                          <span className="text-lg font-black uppercase tracking-[0.2em] text-white group-hover:text-indigo-400 transition-colors">{node.city}</span>
                          <div className="flex flex-col items-center gap-1">
                              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{node.region}</span>
                              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md">{node.ping}</span>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      {/* Membership Tiers Preview */}
      <section className={`py-32 px-6 ${isDarkMode ? 'bg-[#050914]' : 'bg-white'}`}>
          <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                  <h2 className={`text-4xl font-black uppercase italic tracking-tighter mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Membership Tiers</h2>
                  <p className={`text-sm font-bold uppercase tracking-widest ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Select your account level</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Standard */}
                  <div className={`p-8 rounded-[2rem] border relative group hover:-translate-y-2 transition-all duration-500 ${isDarkMode ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                      <h3 className={`text-2xl font-black italic uppercase mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Standard</h3>
                      <p className="text-sm font-medium opacity-60 mb-8">For everyday banking.</p>
                      <ul className="space-y-4 mb-8 text-sm font-medium opacity-80">
                          <li className="flex items-center gap-3"><CheckCircle size={16} /> Global Wire Transfers</li>
                          <li className="flex items-center gap-3"><CheckCircle size={16} /> Mobile Banking App</li>
                          <li className="flex items-center gap-3"><CheckCircle size={16} /> Standard Limits</li>
                      </ul>
                  </div>

                  {/* Platinum */}
                  <div className={`p-8 rounded-[2rem] border relative group hover:-translate-y-2 transition-all duration-500 ${isDarkMode ? 'bg-gradient-to-b from-slate-800 to-slate-900 border-white/10' : 'bg-white border-slate-200 shadow-xl'}`}>
                      <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-bl-2xl rounded-tr-2xl">Popular</div>
                      <h3 className={`text-2xl font-black italic uppercase mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Platinum</h3>
                      <p className="text-sm font-medium opacity-60 mb-8">For growing wealth.</p>
                      <ul className="space-y-4 mb-8 text-sm font-medium opacity-80">
                          <li className="flex items-center gap-3"><CheckCircle size={16} className="text-blue-500" /> Priority Support</li>
                          <li className="flex items-center gap-3"><CheckCircle size={16} className="text-blue-500" /> Metal Card Issuance</li>
                          <li className="flex items-center gap-3"><CheckCircle size={16} className="text-blue-500" /> $100k Daily Limits</li>
                      </ul>
                  </div>

                  {/* Obsidian */}
                  <div className="p-8 rounded-[2rem] border border-amber-500/30 bg-[#020617] relative group hover:-translate-y-2 transition-all duration-500 overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.2]"></div>
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-[60px]"></div>
                      
                      <div className="relative z-10 text-white">
                          <h3 className="text-2xl font-black italic uppercase mb-2 text-amber-500">Premium</h3>
                          <p className="text-sm font-medium opacity-60 mb-8">For high-net-worth individuals.</p>
                          <ul className="space-y-4 mb-8 text-sm font-medium">
                              <li className="flex items-center gap-3"><Award size={16} className="text-amber-500" /> 24/7 Private Banker</li>
                              <li className="flex items-center gap-3"><Award size={16} className="text-amber-500" /> Zero FX Fees</li>
                              <li className="flex items-center gap-3"><Award size={16} className="text-amber-500" /> Unlimited Liquidity</li>
                              <li className="flex items-center gap-3"><Award size={16} className="text-amber-500" /> Tesla Partnership Access</li>
                          </ul>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Trust & Metrics */}
      <section className={`py-32 border-y ${isDarkMode ? 'bg-[#050914] border-white/5' : 'bg-slate-50 border-slate-200'}`}>
          <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                  <div>
                      <div className={`text-4xl md:text-6xl font-black tracking-tighter italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>99.9%</div>
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mt-4">Uptime SLA</div>
                  </div>
                  <div>
                      <div className={`text-4xl md:text-6xl font-black tracking-tighter italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>$12B+</div>
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mt-4">Assets Secured</div>
                  </div>
                  <div>
                      <div className={`text-4xl md:text-6xl font-black tracking-tighter italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>0ms</div>
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mt-4">Settlement Delay</div>
                  </div>
                  <div>
                      <div className={`text-4xl md:text-6xl font-black tracking-tighter italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>24/7</div>
                      <div className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500 mt-4">Concierge</div>
                  </div>
              </div>
          </div>
      </section>

      {/* CTA / Footer */}
      <footer className="pt-32 pb-12 px-6">
          <div className="max-w-7xl mx-auto">
              <div className="relative rounded-[3rem] overflow-hidden p-12 md:p-24 text-center border border-white/10 group">
                  <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?q=80&w=2000&auto=format&fit=crop" alt="Luxury Abstract" className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-black/95"></div>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.1]"></div>
                  
                  {/* Glow Effects */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] group-hover:bg-amber-500/20 transition-all duration-1000"></div>

                  <div className="relative z-10 space-y-8">
                      <Zap size={48} className="mx-auto text-amber-500 mb-8" />
                      <h2 className="text-[10vw] md:text-[8vw] font-black text-white uppercase italic tracking-tighter leading-[0.85]">
                          START YOUR <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">JOURNEY.</span>
                      </h2>
                      <p className="text-slate-400 max-w-xl mx-auto text-lg">
                          Join the network of individuals redefining wealth.
                      </p>
                      <button 
                        onClick={onLoginClick}
                        className="px-12 py-6 bg-white text-slate-900 rounded-full font-black text-sm uppercase tracking-[0.3em] hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)]"
                      >
                          Open Account
                      </button>
                  </div>
              </div>

              <div className="mt-20 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 dark:text-slate-600">
                  <div className="flex items-center gap-3">
                      <Landmark size={20} />
                      <span className="font-bold text-sm tracking-widest uppercase">High SL Global Bank N.A.</span>
                  </div>
                  <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
                      <a href="#" className="hover:text-amber-500 transition-colors">Privacy</a>
                      <a href="#" className="hover:text-amber-500 transition-colors">Terms</a>
                      <a href="#" className="hover:text-amber-500 transition-colors">SLA</a>
                  </div>
                  <div className="text-xs font-mono">
                      © 2024 High SL Global Bank
                  </div>
              </div>
          </div>
      </footer>
    </div>
  );
};

export default Landing;

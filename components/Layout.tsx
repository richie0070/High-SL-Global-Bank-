
import React, { useState, useEffect, useRef } from 'react';
import { User, View, Notification } from '../types';
import { Logo } from './Logo';
import { 
  LayoutDashboard, 
  CreditCard, 
  Users, 
  LogOut, 
  Building2, 
  Moon, 
  Sun, 
  Settings, 
  PieChart, 
  HelpCircle,
  FileText, 
  Mail, 
  Bell, 
  ShieldCheck, 
  Home, 
  TrendingUp, 
  ArrowRightLeft, 
  User as UserIcon, 
  Menu, 
  X, 
  Search, 
  ShieldAlert,
  Server,
  ChevronRight,
  Zap,
  Box,
  Plus,
  Clock,
  ExternalLink,
  Terminal,
  Command,
  Landmark
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User;
  currentView: View;
  notifications: Notification[];
  onNavigate: (view: View) => void;
  onLogout: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const SEARCHABLE_VIEWS: { label: string; view: View; icon: React.ReactNode; keywords: string[] }[] = [
    { label: 'Dashboard', view: 'dashboard', icon: <Home size={14} />, keywords: ['home', 'main', 'balance', 'dashboard'] },
    { label: 'Transfers', view: 'transfer', icon: <ArrowRightLeft size={14} />, keywords: ['pay', 'send', 'wire', 'transfer', 'money'] },
    { label: 'Cards', view: 'cards', icon: <CreditCard size={14} />, keywords: ['card', 'credit', 'visa', 'obsidian', 'spend'] },
    { label: 'Lending', view: 'loans', icon: <Zap size={14} />, keywords: ['loan', 'credit', 'borrow', 'finance'] },
    { label: 'Investments', view: 'investments', icon: <TrendingUp size={14} />, keywords: ['stocks', 'invest', 'portfolio', 'tesla', 'crypto'] },
    { label: 'Activity', view: 'activity', icon: <FileText size={14} />, keywords: ['history', 'transactions', 'statement', 'activity'] },
    { label: 'Vaults', view: 'vaults', icon: <Box size={14} />, keywords: ['savings', 'vault', 'goals', 'save'] },
    { label: 'Settings', view: 'account-details', icon: <Settings size={14} />, keywords: ['profile', 'settings', 'limits', 'account'] },
    { label: 'Messages', view: 'messages', icon: <Mail size={14} />, keywords: ['mail', 'inbox', 'messages'] },
];

const NotificationDropdown = ({ isOpen, onClose, notifications }: { isOpen: boolean, onClose: () => void, notifications: Notification[] }) => {
  if (!isOpen) return null;
  return (
    <div className="absolute top-full right-0 mt-4 w-80 md:w-96 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] z-[100] animate-slide-up overflow-hidden backdrop-blur-xl">
      <div className="p-8 border-b border-slate-100 dark:border-white/5 flex justify-between items-center bg-slate-50/50 dark:bg-black/20">
        <h3 className="font-black text-[11px] uppercase tracking-[0.3em] text-slate-900 dark:text-white">Notifications</h3>
        <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg">{notifications.length} NEW</span>
      </div>
      <div className="max-h-[400px] overflow-y-auto scrollbar-hide">
        {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">No new notifications</div>
        ) : (
            notifications.map((notif) => (
            <div key={notif.id} className="p-8 border-b border-slate-50 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-all cursor-pointer group">
                <div className="flex gap-5">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                    notif.type === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : notif.type === 'warn' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : notif.type === 'error' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]'
                }`} />
                <div className="flex-1">
                    <p className="text-[15px] font-black text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors tracking-tight">{notif.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-medium">{notif.desc}</p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black mt-3 uppercase tracking-widest">{notif.time}</p>
                </div>
                </div>
            </div>
            ))
        )}
      </div>
      <button className="w-full p-6 text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50/50 dark:bg-black/20 transition-all border-t border-slate-100 dark:border-white/5">
        View All Activity
      </button>
    </div>
  );
};

const Layout: React.FC<LayoutProps> = ({ children, currentUser, currentView, notifications, onNavigate, onLogout, isDarkMode, toggleTheme }) => {
  const isAdmin = currentUser.role === 'admin';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isActionHubOpen, setIsActionHubOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [heartbeat, setHeartbeat] = useState(98);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsSearchOpen(true);
            setTimeout(() => searchInputRef.current?.focus(), 10);
        }
        if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeartbeat(prev => {
        const move = Math.random() > 0.5 ? 1 : -1;
        const newVal = prev + move;
        return newVal > 100 ? 100 : newVal < 95 ? 95 : newVal;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredResults = SEARCHABLE_VIEWS.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.keywords.some(k => k.includes(searchQuery.toLowerCase()))
  );

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const handleNav = (view: View) => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };
  
  const handleQuickAction = (view: View) => {
    onNavigate(view);
    setIsActionHubOpen(false);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500 font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[140] lg:hidden animate-fade-in" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 w-72 flex flex-col shadow-xl z-[150] flex-shrink-0 border-r transition-transform duration-300 ${isAdmin ? 'bg-slate-950 border-white/5' : 'bg-white dark:bg-[#020617] border-slate-200 dark:border-slate-800'}`}>
        {/* Branding Area */}
        <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
          <Logo isAdmin={isAdmin} onClick={() => handleNav('dashboard')} />
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-4 space-y-8 pt-8 pb-10 scrollbar-hide">
          {/* Section: Core Banking */}
          <div>
            <p className="px-4 mb-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Banking</p>
            <div className="space-y-1">
                {isAdmin ? (
                    <>
                        <NavItem active={currentView === 'admin'} onClick={() => handleNav('admin')} icon={<LayoutDashboard size={18} />} label="Admin Portal" isAdmin />
                        <NavItem active={currentView === 'users'} onClick={() => handleNav('users')} icon={<Users size={18} />} label="User Management" isAdmin />
                        <NavItem active={currentView === 'activity'} onClick={() => handleNav('activity')} icon={<Server size={18} />} label="System Logs" isAdmin />
                    </>
                ) : (
                    <>
                        <NavItem active={currentView === 'dashboard'} onClick={() => handleNav('dashboard')} icon={<Home size={18} />} label="Dashboard" />
                        <NavItem active={currentView === 'cards'} onClick={() => handleNav('cards')} icon={<CreditCard size={18} />} label="Cards" />
                        <NavItem active={currentView === 'transfer'} onClick={() => handleNav('transfer')} icon={<ArrowRightLeft size={18} />} label="Transfers" />
                        <NavItem active={currentView === 'activity'} onClick={() => handleNav('activity')} icon={<FileText size={18} />} label="Activity" />
                    </>
                )}
            </div>
          </div>

          {/* Section: Wealth & Growth */}
          {!isAdmin && (
            <div>
                <p className="px-4 mb-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Wealth</p>
                <div className="space-y-1">
                    <NavItem active={currentView === 'investments'} onClick={() => handleNav('investments')} icon={<TrendingUp size={18} />} label="Investments" />
                    <NavItem active={currentView === 'vaults'} onClick={() => handleNav('vaults')} icon={<Box size={18} />} label="Vaults" />
                    <NavItem active={currentView === 'loans'} onClick={() => handleNav('loans')} icon={<Zap size={18} />} label="Lending" />
                </div>
            </div>
          )}

          {/* Section: Support */}
          <div>
            <p className="px-4 mb-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Support</p>
            <div className="space-y-1">
                <NavItem active={currentView === 'messages'} onClick={() => handleNav('messages')} icon={<Mail size={18} />} label="Messages" badge="2" />
                <NavItem active={currentView === 'documents'} onClick={() => handleNav('documents')} icon={<FileText size={18} />} label="Documents" />
                <NavItem active={currentView === 'support'} onClick={() => handleNav('support')} icon={<HelpCircle size={18} />} label="Support" />
            </div>
          </div>
        </nav>

        {/* Sidebar Footer: System Status */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                            <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-30"></div>
                        </div>
                        <span className="font-mono text-[9px] font-bold text-slate-500 uppercase tracking-wider">System Status</span>
                    </div>
                    <span className="font-mono text-[9px] text-emerald-500 font-bold">Online</span>
                </div>
                
                <div className="flex items-center justify-between p-1 bg-slate-200 dark:bg-slate-800 rounded-lg">
                    <button 
                        onClick={toggleTheme} 
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all duration-300 ${!isDarkMode ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        <Sun size={14} />
                    </button>
                    <button 
                        onClick={toggleTheme} 
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all duration-300 ${isDarkMode ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        <Moon size={14} />
                    </button>
                </div>

                <button 
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 border border-transparent hover:border-red-200 dark:hover:border-red-900/30 rounded-xl transition-all group"
                >
                    <LogOut size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Sign Out
                </button>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header Glassmorphism */}
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-6 md:px-10 bg-white/80 dark:bg-[#020617]/80 backdrop-blur-3xl border-b border-slate-200 dark:border-slate-800 z-40">
            <div className="flex items-center gap-6">
                {/* Mobile Menu Trigger */}
                <button onClick={toggleMobileMenu} className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                    <Menu size={24} />
                </button>

                {/* Search Trigger */}
                <div className="relative" ref={searchContainerRef}>
                    <button 
                        onClick={() => { setIsSearchOpen(true); setTimeout(() => searchInputRef.current?.focus(), 10); }}
                        className="flex items-center gap-3 px-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors group"
                    >
                        <Search size={18} />
                        <span className="text-xs font-bold hidden md:block">Search...</span>
                        <span className="hidden md:block text-[10px] font-bold bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300">⌘K</span>
                    </button>

                    {/* Search Results Dropdown */}
                    {isSearchOpen && (
                        <div className="absolute top-full left-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-[100] animate-slide-up overflow-hidden">
                             <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                                <Search size={18} className="text-slate-400" />
                                <input 
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400"
                                />
                                <button onClick={() => setIsSearchOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                    <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">ESC</span>
                                </button>
                             </div>
                             <div className="max-h-[300px] overflow-y-auto p-2">
                                {filteredResults.length === 0 ? (
                                    <div className="p-8 text-center text-slate-400 text-xs font-medium">No results found</div>
                                ) : (
                                    filteredResults.map((item) => (
                                        <button
                                            key={item.view}
                                            onClick={() => handleQuickAction(item.view)}
                                            className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors group text-left"
                                        >
                                            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                                                {item.icon}
                                            </div>
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white">{item.label}</span>
                                        </button>
                                    ))
                                )}
                             </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <div className="relative" ref={notifRef}>
                  <button 
                    onClick={() => setIsNotifOpen(!isNotifOpen)}
                    className={`relative p-2.5 rounded-xl transition-all ${isNotifOpen ? 'bg-amber-500/10 text-amber-500' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                  >
                      <Bell size={20} />
                      {notifications.length > 0 && !isNotifOpen && (
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#020617]"></span>
                      )}
                  </button>
                  <NotificationDropdown isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} notifications={notifications} />
                </div>

                <div className="h-8 w-px bg-slate-200 dark:border-slate-800 mx-2 hidden md:block"></div>

                <div 
                    onClick={() => onNavigate('account-details')}
                    className="flex items-center gap-3 cursor-pointer group pl-2"
                >
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">{currentUser.name}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                           {isAdmin ? 'Administrator' : 'Obsidian Elite'}
                        </p>
                    </div>
                    <div className="relative">
                        <img 
                            src={`https://ui-avatars.com/api/?name=${currentUser.name}&background=${isAdmin ? 'ef4444' : '0f172a'}&color=fff&bold=true&size=128`} 
                            className="w-10 h-10 rounded-xl shadow-sm group-hover:scale-105 transition-transform border border-slate-200 dark:border-slate-700" 
                            alt="Profile" 
                        />
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-[3px] border-white dark:border-[#020617]"></div>
                    </div>
                </div>

                {isAdmin && (
                    <button 
                        onClick={onLogout}
                        className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group relative"
                        title="Sign Out"
                    >
                        <LogOut size={20} className="group-hover:scale-110 transition-transform" />
                        <span className="absolute top-full right-0 mt-2 px-2 py-1 bg-slate-900 text-white text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">Sign Out</span>
                    </button>
                )}
            </div>
        </header>

        {/* Workspace */}
        <main className="flex-1 overflow-y-auto p-6 md:p-14 pb-36 lg:pb-14 scrollbar-hide scroll-smooth bg-inherit">
            <div className="max-w-[1400px] mx-auto">
                {children}
            </div>
        </main>

        {/* Mobile Central Action Hub Overlay */}
        {isActionHubOpen && (
            <div className="fixed inset-0 z-[100] flex items-end justify-center px-6 pb-28">
                <div className="absolute inset-0 bg-[#020617]/80 backdrop-blur-xl animate-fade-in" onClick={() => setIsActionHubOpen(false)}></div>
                <div className="relative w-full max-w-sm bg-white dark:bg-[#0f172a] rounded-[3.5rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-slate-200 dark:border-white/10 animate-slide-up">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-12 text-center italic">Quick Actions</h3>
                    <div className="grid grid-cols-3 gap-10">
                        <ActionButton icon={<ArrowRightLeft size={28} />} label="Transfer" onClick={() => handleQuickAction('transfer')} />
                        <ActionButton icon={<Zap size={28} />} label="Lending" onClick={() => handleQuickAction('loans')} />
                        <ActionButton icon={<TrendingUp size={28} />} label="Invest" onClick={() => handleQuickAction('investments')} />
                        <ActionButton icon={<Box size={28} />} label="Vaults" onClick={() => handleQuickAction('vaults')} />
                        <ActionButton icon={<CreditCard size={28} />} label="Cards" onClick={() => handleQuickAction('cards')} />
                        <ActionButton icon={<Settings size={28} />} label="Settings" onClick={() => handleQuickAction('account-details')} />
                    </div>
                    <button 
                        onClick={() => setIsActionHubOpen(false)}
                        className="mt-12 w-full py-5 bg-slate-100 dark:bg-white/5 rounded-[1.75rem] text-[11px] font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400 hover:text-white transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        )}

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-6 pb-8">
            <nav className="h-24 bg-white/95 dark:bg-[#020617]/95 backdrop-blur-3xl border border-slate-200 dark:border-white/5 rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)] flex items-center justify-between px-10">
                <MobileNavItem active={currentView === 'dashboard'} icon={<Home size={26} />} onClick={() => onNavigate('dashboard')} />
                <MobileNavItem active={currentView === 'activity'} icon={<FileText size={26} />} onClick={() => onNavigate('activity')} />
                
                {/* Central Multi-Action Button */}
                <button 
                    onClick={() => setIsActionHubOpen(!isActionHubOpen)}
                    className="relative -top-12 w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-3xl shadow-[0_20px_40px_-10px_rgba(245,158,11,0.5)] flex items-center justify-center transform active:scale-90 transition-all ring-[8px] ring-white dark:ring-[#020617]"
                >
                    <Plus size={40} className={`text-slate-950 transition-transform duration-700 ease-in-out ${isActionHubOpen ? 'rotate-225' : ''}`} />
                </button>

                <MobileNavItem active={currentView === 'investments'} icon={<TrendingUp size={26} />} onClick={() => onNavigate('investments')} />
                <MobileNavItem active={currentView === 'cards'} icon={<CreditCard size={26} />} onClick={() => onNavigate('cards')} />
            </nav>
        </div>

      </div>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label, badge, isAdmin }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative ${
      active 
        ? isAdmin 
            ? 'bg-red-500/10 text-red-500 border-l-4 border-red-500' 
            : 'bg-amber-500/10 text-amber-500 border-l-4 border-amber-500' 
        : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 border-l-4 border-transparent'
    }`}
  >
    <div className="flex items-center gap-3">
        <div className={`transition-colors duration-300 ${active ? (isAdmin ? 'text-red-500' : 'text-amber-500') : 'text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white'}`}>{icon}</div>
        <span className={`text-sm font-bold tracking-wide transition-colors duration-300 ${active ? 'text-slate-900 dark:text-white' : ''}`}>{label}</span>
    </div>
    {badge && (
        <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">{badge}</span>
    )}
  </button>
);

const MobileNavItem = ({ active, icon, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`p-5 rounded-2xl transition-all duration-700 transform ${active ? 'bg-amber-500/15 text-amber-500 scale-110' : 'text-slate-500 active:scale-90 hover:text-white'}`}
    >
        {icon}
    </button>
);

const ActionButton = ({ icon, label, onClick }: any) => (
    <button onClick={onClick} className="flex flex-col items-center gap-4 group">
        <div className="w-20 h-20 bg-slate-50 dark:bg-white/[0.03] rounded-[2rem] flex items-center justify-center text-slate-600 dark:text-slate-400 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all transform active:scale-95 shadow-lg border border-slate-200 dark:border-white/5 ring-1 ring-transparent group-hover:ring-amber-500/30">
            {icon}
        </div>
        <span className="text-[11px] font-black text-slate-500 dark:text-slate-400 group-hover:text-amber-500 uppercase tracking-[0.3em] transition-colors italic">{label}</span>
    </button>
);

export default Layout;

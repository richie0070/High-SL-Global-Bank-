
import React, { useState, useEffect } from 'react';
import { 
    Users, 
    CreditCard, 
    DollarSign, 
    AlertCircle, 
    Shield, 
    Activity, 
    Globe, 
    Lock, 
    CheckCircle,
    XCircle,
    ChevronRight,
    Cpu,
    Wifi,
    AlertTriangle,
    Settings,
    Percent,
    Briefcase,
    ArrowRightLeft, 
    Wallet, 
    TrendingUp, 
    Save, 
    Landmark, 
    Bitcoin, 
    Gift, 
    Smartphone, 
    Info, 
    Tags, 
    Loader2,
    Bell,
    Mail,
    MessageSquare
} from 'lucide-react';
import { User, Loan, View, FeeConfiguration, PaymentConfig, Transaction } from '../types';

interface AdminProps {
  users: User[];
  loans: Loan[];
  transactions: Transaction[];
  fees?: FeeConfiguration; 
  paymentConfig?: PaymentConfig;
  onLoanAction: (loanId: string, action: 'approve' | 'reject') => void;
  onNavigate: (view: View, params?: any) => void;
  onUpdateFees?: (newFees: FeeConfiguration) => void;
  onUpdatePaymentConfig?: (newConfig: PaymentConfig) => void;
  onAdminTransaction?: (userId: string, amount: number, type: 'credit' | 'debit', description: string) => void;
  onAddUser?: (user: User) => void;
  onTransactionAction?: (transactionId: string, action: 'approve' | 'reject' | 'require_fee', feeType?: string, feeAmount?: number) => void;
}

const Admin: React.FC<AdminProps> = ({ 
    users, 
    loans, 
    transactions,
    fees = { transferFee: 1.5, networkFee: 0.1, electricalFee: 0.05, loanInterestRate: 6.99, loanOriginationFee: 150, investmentFee: 0.5, escrowFee: 2.0, subjectFee: 45.0, maintenanceFee: 15.0, overdraftFee: 35.0, wireTransferFee: 25.0, internationalTransferFee: 45.0, atmFee: 2.5, latePaymentFee: 29.0 }, 
    paymentConfig = {
        bankName: 'High SL Global Bank', accountName: 'Global Operating', accountNumber: '9988776655', routingNumber: '021000021', swiftCode: 'HSLGUS33XXX',
        btcAddress: '', ethAddress: '', usdtAddress: '',
        paypalEmail: '', zelleContact: '', cashAppTag: '',
        acceptedGiftCards: ''
    },
    onLoanAction, 
    onNavigate, 
    onUpdateFees, 
    onUpdatePaymentConfig,
    onAdminTransaction,
    onAddUser,
    onTransactionAction
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'overview' | 'financials' | 'admins' | 'transactions' | 'loans' | 'fees-management'>('overview');
  
  // State Management for Config
  const [tempFees, setTempFees] = useState<any>(fees);
  const [tempPaymentConfig, setTempPaymentConfig] = useState<PaymentConfig>(paymentConfig);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Notification Config
  const [notifyConfig, setNotifyConfig] = useState({ email: false, sms: false, app: true });

  // Teller/Transaction State
  const [tellerUser, setTellerUser] = useState('');
  const [tellerAmount, setTellerAmount] = useState('');
  const [tellerAction, setTellerAction] = useState<'Deposit' | 'Withdraw'>('Deposit');
  const [tellerMethod, setTellerMethod] = useState('Manual Entry');
  const [tellerProcessing, setTellerProcessing] = useState(false);
  const [tellerSuccess, setTellerSuccess] = useState(false);

  // Admin Management State
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '' });
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);

  // Require Fee Modal State
  const [requireFeeModal, setRequireFeeModal] = useState<{isOpen: boolean, txId: string, feeType: string, feeAmount: string}>({
      isOpen: false, txId: '', feeType: 'Transfer Fee', feeAmount: ''
  });

  const [logs, setLogs] = useState<{time: string, msg: string, type: 'info' | 'warn' | 'error' | 'success'}[]>([
      { time: '10:42:12', msg: 'System check complete', type: 'success' },
      { time: '10:42:15', msg: 'Secure connection established (US-East)', type: 'info' },
      { time: '10:43:01', msg: 'User login failed: IP 192.168.1.55', type: 'warn' },
      { time: '10:44:20', msg: 'Large transaction flagged > $10,000', type: 'warn' },
  ]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
      const interval = setInterval(() => {
          const events = [
              { msg: 'Database connection stable', type: 'info' },
              { msg: 'New session authenticated', type: 'success' },
              { msg: 'API Latency spike detected (150ms)', type: 'warn' },
              { msg: 'Firewall blocked suspicious request', type: 'error' },
              { msg: 'Transaction batch complete', type: 'info' }
          ];
          const randomEvent = events[Math.floor(Math.random() * events.length)];
          const newLog = {
              time: new Date().toLocaleTimeString('en-US', {hour12: false}),
              msg: randomEvent.msg,
              type: randomEvent.type as any
          };
          setLogs(prev => [newLog, ...prev].slice(0, 15));
      }, 5000);
      return () => clearInterval(interval);
  }, []);

  const handleSaveConfig = () => {
      setIsSaving(true);
      const activeChannels = Object.entries(notifyConfig).filter(([_, v]) => v).map(([k]) => k);

      setTimeout(() => {
          const processedFees: any = { ...tempFees };
          for (const key in processedFees) {
              processedFees[key] = parseFloat(processedFees[key]) || 0;
          }
          if (onUpdateFees) onUpdateFees(processedFees as FeeConfiguration);
          if (onUpdatePaymentConfig) onUpdatePaymentConfig(tempPaymentConfig);
          
          if (activeChannels.length > 0) {
              setLogs(prev => [{
                  time: new Date().toLocaleTimeString('en-US', {hour12: false}),
                  msg: `Fee update broadcasted via ${activeChannels.join(', ').toUpperCase()}`,
                  type: 'info'
              }, ...prev]);
          }

          setIsSaving(false);
          setSaveSuccess(true);
          setTimeout(() => setSaveSuccess(false), 2000);
      }, 800);
  };

  const handleProcessTransaction = () => {
      if (!tellerUser || !tellerAmount || !onAdminTransaction) return;
      
      setTellerProcessing(true);
      setTimeout(() => {
          onAdminTransaction(
              tellerUser, 
              parseFloat(tellerAmount), 
              tellerAction === 'Deposit' ? 'credit' : 'debit',
              `${tellerAction} via ${tellerMethod}`
          );
          setTellerProcessing(false);
          setTellerSuccess(true);
          setTimeout(() => {
              setTellerSuccess(false);
              setTellerAmount('');
          }, 3000);
      }, 1500);
  };

  const validateFeeChange = (key: keyof FeeConfiguration, val: string) => {
      setTempFees((prev: any) => ({ ...prev, [key]: val }));
  };

  const handleAddAdmin = (e: React.FormEvent) => {
      e.preventDefault();
      if (!onAddUser) return;

      const adminUser: User = {
          id: `admin${Date.now()}`,
          name: newAdmin.name,
          email: newAdmin.email,
          role: 'admin',
          balance: 0,
          accountType: 'Wealth Management Account',
          accountNumber: `HSL-ADMIN-${Math.floor(100 + Math.random() * 900)}`,
          status: 'Active',
          riskScore: 'Low',
          kycLevel: 3,
          joinedDate: new Date().toISOString().split('T')[0],
          lastLoginIp: 'Pending'
      };

      onAddUser(adminUser);
      setIsAddingAdmin(false);
      setNewAdmin({ name: '', email: '', password: '' });
      setLogs(prev => [{
          time: new Date().toLocaleTimeString('en-US', {hour12: false}),
          msg: `New admin privileges granted to ${adminUser.email}`,
          type: 'success'
      }, ...prev]);
  };

  const totalUsers = users.filter(u => u.role === 'user').length;
  const totalDeposits = users.reduce((acc, curr) => acc + curr.balance, 0);
  const pendingLoans = loans.filter(l => l.status === 'Pending');

  return (
    <div className="space-y-6 animate-fade-in pb-10 relative">
      
      {/* Header / Command Bar */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 rounded-full blur-[80px]"></div>
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                  <Shield className="text-red-500" size={24} />
              </div>
              Admin Dashboard
          </h2>
          <p className="text-slate-400 text-xs font-mono mt-2 flex items-center gap-3">
              <span>SERVER: US-EAST-1</span>
              <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
              <span>{currentTime.toLocaleTimeString()}</span>
              <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
              <span className="text-emerald-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> SYSTEM ONLINE</span>
          </p>
        </div>
        <div className="flex items-center gap-4 relative z-10">
            <div className="bg-slate-800 p-1 rounded-lg flex mr-4 overflow-x-auto scrollbar-hide">
                <button onClick={() => setActiveTab('overview')} className={`px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'overview' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>Overview</button>
                <button onClick={() => setActiveTab('financials')} className={`px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'financials' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>Financials</button>
                <button onClick={() => setActiveTab('fees-management')} className={`px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'fees-management' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>Fees Mgmt</button>
                <button onClick={() => setActiveTab('transactions')} className={`px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'transactions' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>Transactions</button>
                <button onClick={() => setActiveTab('loans')} className={`px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'loans' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>Loans</button>
                <button onClick={() => setActiveTab('admins')} className={`px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'admins' ? 'bg-slate-700 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}>Admins</button>
            </div>
            <StatusBadge label="CPU" status="14%" icon={<Cpu size={14} />} />
        </div>
      </div>

      {activeTab === 'overview' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <AdminStatCard 
                        title="Total Users" 
                        value={totalUsers.toString()} 
                        icon={<Users size={20} />} 
                        trend="+4.1%" 
                        color="text-blue-500" 
                        onClick={() => onNavigate('users', { filter: 'Active' })}
                    />
                    <AdminStatCard 
                        title="Capital Flow" 
                        value={`$${(totalDeposits / 1000000).toFixed(2)}M`} 
                        icon={<TrendingUp size={20} />} 
                        trend="+8.2%" 
                        color="text-emerald-500" 
                        onClick={() => setActiveTab('financials')}
                    />
                    <AdminStatCard 
                        title="Pending Review" 
                        value={pendingLoans.length.toString()} 
                        icon={<AlertTriangle size={20} />} 
                        trend="Action Required" 
                        color="text-amber-500" 
                        onClick={() => onNavigate('loans', { filter: 'Pending' })}
                    />
                </div>

                {/* System Logs */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
                            <Activity size={14} /> System Logs
                        </h3>
                        <span className="text-[10px] text-slate-600 font-mono">UPTIME: 14:22:11</span>
                    </div>
                    <div className="p-4 h-64 overflow-y-auto font-mono text-xs space-y-2 scrollbar-hide">
                        {logs.map((log, i) => (
                            <div key={i} className="flex gap-4 animate-fade-in">
                                <span className="text-slate-600">[{log.time}]</span>
                                <span className={
                                    log.type === 'error' ? 'text-red-500' : 
                                    log.type === 'warn' ? 'text-amber-500' : 
                                    log.type === 'success' ? 'text-emerald-500' : 'text-slate-400'
                                }>
                                    {log.type === 'error' ? 'ERR: ' : log.type === 'warn' ? 'WRN: ' : 'INF: '}
                                    {log.msg}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick User List */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900 dark:text-white">Recent User Additions</h3>
                        <button onClick={() => onNavigate('users')} className="text-xs font-bold text-blue-600 hover:underline">View All Users</button>
                    </div>
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {users.slice(0, 4).map(u => (
                                <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">{u.name.charAt(0)}</div>
                                            <span className="text-sm font-bold text-slate-900 dark:text-white">{u.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-slate-500">{u.email}</td>
                                    <td className="px-6 py-4 text-sm font-bold text-slate-900 dark:text-white">${u.balance.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
                {/* Admin Teller / Quick Transaction */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <Landmark size={14} /> Transaction Management
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Target Account</label>
                            <select 
                                value={tellerUser} 
                                onChange={(e) => setTellerUser(e.target.value)}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm"
                            >
                                <option value="">Select User Account</option>
                                {users.filter(u => u.role === 'user').map(u => (
                                    <option key={u.id} value={u.id}>{u.name} (${u.balance.toLocaleString()})</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => setTellerAction('Deposit')} className={`py-2 rounded-lg font-bold text-xs transition-all ${tellerAction === 'Deposit' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>Deposit</button>
                            <button onClick={() => setTellerAction('Withdraw')} className={`py-2 rounded-lg font-bold text-xs transition-all ${tellerAction === 'Withdraw' ? 'bg-red-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>Withdraw</button>
                        </div>
                        <div>
                            <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Currency Amount (USD)</label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="number" 
                                    value={tellerAmount}
                                    onChange={(e) => setTellerAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <button 
                            onClick={handleProcessTransaction}
                            disabled={!tellerUser || !tellerAmount || tellerProcessing}
                            className={`w-full py-4 mt-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center gap-2 ${tellerProcessing ? 'opacity-50' : ''}`}
                        >
                            {tellerProcessing ? <Loader2 className="animate-spin" size={16} /> : tellerSuccess ? <CheckCircle size={16} /> : 'Process Transaction'}
                        </button>
                    </div>
                </div>

                {/* Pending Loan Approvals */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl p-6 text-white">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                        <Briefcase size={14} /> Loan Requests
                    </h3>
                    <div className="space-y-4 max-h-64 overflow-y-auto scrollbar-hide">
                        {pendingLoans.length === 0 ? (
                            <p className="text-center text-slate-600 text-xs py-10">No pending credit requests.</p>
                        ) : (
                            pendingLoans.map(loan => (
                                <div key={loan.id} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-bold text-sm">{loan.userName}</p>
                                            <p className="text-[10px] text-slate-400">{loan.purpose}</p>
                                        </div>
                                        <p className="font-bold text-emerald-400">${loan.amount.toLocaleString()}</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={() => onLoanAction(loan.id, 'approve')} className="py-2 bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase rounded-lg hover:bg-emerald-400 transition-colors">Approve</button>
                                        <button onClick={() => onLoanAction(loan.id, 'reject')} className="py-2 bg-red-500/10 text-red-500 border border-red-500/20 font-bold text-[10px] uppercase rounded-lg hover:bg-red-500 hover:text-white transition-colors">Reject</button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
      ) : activeTab === 'financials' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Global Fee Summary */}
            <div className="lg:col-span-6 bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden group flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[80px] group-hover:bg-amber-500/10 transition-colors duration-1000"></div>
                
                <div>
                    <div className="flex items-center justify-between mb-10 relative z-10">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 italic tracking-tighter uppercase">
                            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                                <Percent className="text-amber-500" size={24} />
                            </div>
                            Fees Overview
                        </h3>
                        <button 
                            onClick={() => setActiveTab('fees-management')}
                            className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl"
                        >
                            <Settings size={16} /> Manage Fees
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6 relative z-10 mb-8">
                        <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Transfer Fee</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{fees.transferFee}%</p>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Network Fee</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{fees.networkFee}%</p>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Loan APR</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">{fees.loanInterestRate}%</p>
                        </div>
                        <div className="p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-100 dark:border-white/10">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Maintenance</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white">${fees.maintenanceFee}</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 p-6 bg-blue-50 dark:bg-blue-500/10 rounded-2xl border border-blue-100 dark:border-blue-500/20 flex items-start gap-4">
                    <Info className="text-blue-500 shrink-0 mt-0.5" size={20} />
                    <div>
                        <p className="text-sm font-bold text-blue-900 dark:text-blue-400 mb-1">Global Fee Structure</p>
                        <p className="text-xs text-blue-700 dark:text-blue-300">The platform currently enforces {Object.keys(fees).length} distinct fee types across transactions, accounts, and lending products. Click 'Manage Fees' to adjust these rates.</p>
                    </div>
                </div>
            </div>

            {/* Central Settlement Config */}
            <div className="lg:col-span-6 bg-[#020617] border border-white/5 rounded-[2.5rem] p-10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] text-white relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05]"></div>
                <div className="absolute top-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-colors duration-1000"></div>
                <h3 className="text-2xl font-black mb-10 flex items-center gap-3 text-slate-300 italic tracking-tighter uppercase relative z-10">
                    <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                        <ArrowRightLeft className="text-blue-500" size={24} />
                    </div>
                    Payment Settings
                </h3>
                <div className="space-y-8 relative z-10">
                    <div className="grid grid-cols-2 gap-6">
                        <AdminInput dark label="Bank Name" value={tempPaymentConfig.bankName} onChange={v => setTempPaymentConfig({...tempPaymentConfig, bankName: v})} type="text" />
                        <AdminInput dark label="SWIFT Code" value={tempPaymentConfig.swiftCode} onChange={v => setTempPaymentConfig({...tempPaymentConfig, swiftCode: v})} type="text" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <AdminInput dark label="Operating Account" value={tempPaymentConfig.accountNumber} onChange={v => setTempPaymentConfig({...tempPaymentConfig, accountNumber: v})} type="text" />
                        <AdminInput dark label="Routing Number" value={tempPaymentConfig.routingNumber} onChange={v => setTempPaymentConfig({...tempPaymentConfig, routingNumber: v})} type="text" />
                    </div>
                    <div className="h-px bg-white/5 my-4 shadow-inner"></div>
                    <AdminInput dark label="Bitcoin Address" value={tempPaymentConfig.btcAddress} onChange={v => setTempPaymentConfig({...tempPaymentConfig, btcAddress: v})} type="text" icon={<Bitcoin size={18} />} />
                    <AdminInput dark label="Ethereum Address" value={tempPaymentConfig.ethAddress} onChange={v => setTempPaymentConfig({...tempPaymentConfig, ethAddress: v})} type="text" />
                    <div className="grid grid-cols-2 gap-6">
                        <AdminInput dark label="USDT Network" value={tempPaymentConfig.usdtAddress} onChange={v => setTempPaymentConfig({...tempPaymentConfig, usdtAddress: v})} type="text" />
                        <AdminInput dark label="PayPal Email" value={tempPaymentConfig.paypalEmail} onChange={v => setTempPaymentConfig({...tempPaymentConfig, paypalEmail: v})} type="text" />
                    </div>
                </div>
            </div>
        </div>
      ) : activeTab === 'fees-management' ? (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic flex items-center gap-3">
                        <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                            <Percent className="text-amber-500" size={24} />
                        </div>
                        Fees Management
                    </h2>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">Configure global platform fee structures</p>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setActiveTab('financials')}
                        className="px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSaveConfig} 
                        className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-slate-950 rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={16} /> : saveSuccess ? <CheckCircle size={16} /> : <Save size={16} />}
                        {saveSuccess ? 'Applied' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Transaction Fees Card */}
                <div className="bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-[60px] group-hover:bg-blue-500/10 transition-colors duration-700"></div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3 italic tracking-tighter uppercase mb-8 relative z-10">
                        <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                            <ArrowRightLeft className="text-blue-500" size={20} />
                        </div>
                        Transaction Fees
                    </h3>
                    <div className="space-y-5 relative z-10">
                        <AdminInput label="Transfer Fee (%)" value={tempFees.transferFee} onChange={v => validateFeeChange('transferFee', v)} />
                        <AdminInput label="Network Fee (%)" value={tempFees.networkFee} onChange={v => validateFeeChange('networkFee', v)} />
                        <AdminInput label="Electrical Fee (%)" value={tempFees.electricalFee} onChange={v => validateFeeChange('electricalFee', v)} />
                        <AdminInput label="Wire Transfer Fee ($)" value={tempFees.wireTransferFee} onChange={v => validateFeeChange('wireTransferFee', v)} />
                        <AdminInput label="Intl Transfer Fee ($)" value={tempFees.internationalTransferFee} onChange={v => validateFeeChange('internationalTransferFee', v)} />
                        <AdminInput label="Subject Fee ($)" value={tempFees.subjectFee} onChange={v => validateFeeChange('subjectFee', v)} tooltip="A flat fee applied for specific transaction types or compliance checks" />
                    </div>
                </div>

                {/* Account Fees Card */}
                <div className="bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-[60px] group-hover:bg-emerald-500/10 transition-colors duration-700"></div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3 italic tracking-tighter uppercase mb-8 relative z-10">
                        <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                            <Wallet className="text-emerald-500" size={20} />
                        </div>
                        Account Fees
                    </h3>
                    <div className="space-y-5 relative z-10">
                        <AdminInput label="Maintenance Fee ($)" value={tempFees.maintenanceFee} onChange={v => validateFeeChange('maintenanceFee', v)} />
                        <AdminInput label="Overdraft Fee ($)" value={tempFees.overdraftFee} onChange={v => validateFeeChange('overdraftFee', v)} />
                        <AdminInput label="ATM Fee ($)" value={tempFees.atmFee} onChange={v => validateFeeChange('atmFee', v)} />
                        <AdminInput label="Late Payment Fee ($)" value={tempFees.latePaymentFee} onChange={v => validateFeeChange('latePaymentFee', v)} />
                    </div>
                </div>

                {/* Loan & Investment Fees Card */}
                <div className="bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500/5 rounded-full blur-[60px] group-hover:bg-purple-500/10 transition-colors duration-700"></div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-3 italic tracking-tighter uppercase mb-8 relative z-10">
                        <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20">
                            <TrendingUp className="text-purple-500" size={20} />
                        </div>
                        Loan & Investment
                    </h3>
                    <div className="space-y-5 relative z-10">
                        <AdminInput label="Loan APR (%)" value={tempFees.loanInterestRate} onChange={v => validateFeeChange('loanInterestRate', v)} />
                        <AdminInput label="Origination Fee ($)" value={tempFees.loanOriginationFee} onChange={v => validateFeeChange('loanOriginationFee', v)} />
                        <AdminInput label="Investment Fee (%)" value={tempFees.investmentFee} onChange={v => validateFeeChange('investmentFee', v)} />
                        <AdminInput label="Escrow Fee (%)" value={tempFees.escrowFee} onChange={v => validateFeeChange('escrowFee', v)} />
                    </div>
                </div>
            </div>

            {/* Notification Configuration for Fee Updates */}
            <div className="bg-white dark:bg-[#020617] border border-slate-200 dark:border-white/5 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-100 dark:bg-white/5 rounded-2xl text-slate-500 border border-slate-200 dark:border-white/10">
                            <Bell size={20} />
                        </div>
                        <div>
                            <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.3em] block italic">Notification System</span>
                            <span className="text-[10px] text-slate-400 font-bold italic">Broadcast fee updates to users upon saving</span>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <NotificationToggle 
                            icon={<Mail size={14} />} 
                            label="Email" 
                            active={notifyConfig.email} 
                            onClick={() => setNotifyConfig(prev => ({...prev, email: !prev.email}))} 
                        />
                        <NotificationToggle 
                            icon={<MessageSquare size={14} />} 
                            label="SMS" 
                            active={notifyConfig.sms} 
                            onClick={() => setNotifyConfig(prev => ({...prev, sms: !prev.sms}))} 
                        />
                        <NotificationToggle 
                            icon={<Bell size={14} />} 
                            label="App Notice" 
                            active={notifyConfig.app} 
                            onClick={() => setNotifyConfig(prev => ({...prev, app: !prev.app}))} 
                        />
                    </div>
                </div>
            </div>
        </div>
      ) : activeTab === 'admins' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Shield className="text-amber-500" size={20} /> System Administrators
                            </h3>
                            <p className="text-xs text-slate-500 mt-1">Authorized personnel with administrative access.</p>
                        </div>
                        <button 
                            onClick={() => setIsAddingAdmin(true)}
                            className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-xl font-bold text-xs hover:opacity-90 transition-all shadow-lg"
                        >
                            <Users size={14} /> Add Admin
                        </button>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Admin Profile</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Access Level</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Last Login</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {users.filter(u => u.role === 'admin').map(admin => (
                                <tr key={admin.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-500 border border-slate-200 dark:border-slate-700">
                                                {admin.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 dark:text-white text-sm">{admin.name}</p>
                                                <p className="text-xs text-slate-500">{admin.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Shield size={14} className="text-amber-500" />
                                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Access</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                                            <Globe size={12} /> {admin.lastLoginIp || '127.0.0.1'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                                            Active
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="lg:col-span-4">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-[60px]"></div>
                    <h3 className="font-bold mb-6 flex items-center gap-2 relative z-10">
                        <Lock className="text-amber-500" size={20} /> Security Policy
                    </h3>
                    <div className="space-y-6 relative z-10">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Access Policy</h4>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                Admin accounts require multi-factor authentication for all administrative operations.
                            </p>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Audit Logging</h4>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                All admin actions are recorded in the system logs.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-4">
                            <CheckCircle size={14} className="text-emerald-500" />
                            <span>System Integrity Verified</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      ) : activeTab === 'transactions' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Activity className="text-blue-500" size={20} /> Transaction Management
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID / Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Details</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {transactions.map(tx => (
                            <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="text-xs font-mono text-slate-500">{tx.id}</p>
                                    <p className="text-xs text-slate-400">{tx.date}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{tx.description}</p>
                                    <p className="text-xs text-slate-500">{tx.network || 'Internal'}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-sm font-bold ${tx.type === 'credit' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}${tx.amount.toLocaleString()}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        tx.status === 'Completed' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                        tx.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                                        tx.status === 'Requires Fee' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                        {tx.status || 'Completed'}
                                    </span>
                                    {tx.status === 'Requires Fee' && (
                                        <p className="text-[10px] text-blue-500 mt-1">{tx.requiredFeeType}: ${tx.requiredFeeAmount}</p>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {tx.status === 'Pending' && onTransactionAction && (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => onTransactionAction(tx.id, 'approve')} className="p-1.5 bg-emerald-100 text-emerald-600 rounded hover:bg-emerald-200 transition-colors" title="Approve">
                                                <CheckCircle size={16} />
                                            </button>
                                            <button onClick={() => onTransactionAction(tx.id, 'reject')} className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors" title="Reject">
                                                <XCircle size={16} />
                                            </button>
                                            <button onClick={() => setRequireFeeModal({ isOpen: true, txId: tx.id, feeType: 'Transfer Fee', feeAmount: '' })} className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors" title="Require Fee">
                                                <Percent size={16} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      ) : activeTab === 'loans' ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Briefcase className="text-amber-500" size={20} /> Loan Management
                </h3>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                        <tr>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Applicant</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount / Purpose</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {loans.map(loan => (
                            <tr key={loan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-slate-900 dark:text-white">{loan.userName}</p>
                                    <p className="text-xs font-mono text-slate-500">{loan.id}</p>
                                </td>
                                <td className="px-6 py-4">
                                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">${loan.amount.toLocaleString()}</p>
                                    <p className="text-xs text-slate-500">{loan.purpose}</p>
                                </td>
                                <td className="px-6 py-4 text-xs text-slate-500">{loan.dateApplied}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        loan.status === 'Approved' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400' :
                                        loan.status === 'Pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' :
                                        'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                        {loan.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {loan.status === 'Pending' && (
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => onLoanAction(loan.id, 'approve')} className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-lg hover:bg-emerald-600 transition-colors">Approve</button>
                                            <button onClick={() => onLoanAction(loan.id, 'reject')} className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg hover:bg-red-600 transition-colors">Reject</button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      ) : null}

      {/* Add Admin Modal */}
      {isAddingAdmin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsAddingAdmin(false)}></div>
              <div className="relative z-10 bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-xl p-8 animate-slide-up border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Shield className="text-amber-500" size={20} /> Add New Administrator
                      </h2>
                      <button onClick={() => setIsAddingAdmin(false)} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
                  </div>
                  
                  <form onSubmit={handleAddAdmin} className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Admin Name</label>
                          <input 
                            required 
                            value={newAdmin.name} 
                            onChange={e => setNewAdmin({...newAdmin, name: e.target.value})} 
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-slate-900 dark:text-white font-medium" 
                            placeholder="e.g. Administrator"
                          />
                      </div>
                      
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Secure Email</label>
                          <input 
                            required 
                            type="email" 
                            value={newAdmin.email} 
                            onChange={e => setNewAdmin({...newAdmin, email: e.target.value})} 
                            className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-slate-900 dark:text-white font-medium" 
                            placeholder="admin@highsl.com"
                          />
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Temporary Password</label>
                          <div className="relative">
                              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                              <input 
                                required 
                                type="password" 
                                value={newAdmin.password} 
                                onChange={e => setNewAdmin({...newAdmin, password: e.target.value})} 
                                className="w-full p-3 pl-9 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-slate-900 dark:text-white font-medium" 
                                placeholder="••••••••"
                              />
                          </div>
                      </div>

                      <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                          <div className="flex gap-3">
                              <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                              <p className="text-xs text-amber-600 dark:text-amber-400 leading-relaxed">
                                  <strong>Warning:</strong> You are granting full system privileges. This user will have access to all financial data and configuration settings.
                              </p>
                          </div>
                      </div>

                      <button type="submit" className="w-full py-4 mt-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl shadow-lg transition-all hover:opacity-90">
                          Authorize Admin
                      </button>
                  </form>
              </div>
          </div>
      )}

      {/* Require Fee Modal */}
      {requireFeeModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setRequireFeeModal({ ...requireFeeModal, isOpen: false })}></div>
              <div className="relative z-10 bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-xl p-8 animate-slide-up border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <Percent className="text-blue-500" size={20} /> Require Fee
                      </h2>
                      <button onClick={() => setRequireFeeModal({ ...requireFeeModal, isOpen: false })} className="text-slate-400 hover:text-slate-600"><XCircle size={24} /></button>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fee Type</label>
                          <select 
                              value={requireFeeModal.feeType}
                              onChange={e => setRequireFeeModal({...requireFeeModal, feeType: e.target.value})}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white"
                          >
                              <option value="Transfer Fee">Transfer Fee</option>
                              <option value="Network Fee">Network Fee</option>
                              <option value="Electrical Fee">Electrical Fee</option>
                              <option value="Escrow Fee">Escrow Fee</option>
                              <option value="Investment Fee">Investment Fee</option>
                              <option value="Subject Fee">Subject Fee</option>
                              <option value="Maintenance Fee">Maintenance Fee</option>
                              <option value="Overdraft Fee">Overdraft Fee</option>
                              <option value="Wire Transfer Fee">Wire Transfer Fee</option>
                              <option value="International Transfer Fee">International Transfer Fee</option>
                              <option value="ATM Fee">ATM Fee</option>
                              <option value="Late Payment Fee">Late Payment Fee</option>
                              <option value="Custom Fee">Custom Fee</option>
                          </select>
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fee Amount ($)</label>
                          <input 
                              type="number" 
                              value={requireFeeModal.feeAmount}
                              onChange={e => setRequireFeeModal({...requireFeeModal, feeAmount: e.target.value})}
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-900 dark:text-white"
                              placeholder="e.g. 50.00"
                          />
                      </div>
                      <div className="pt-4">
                          <button 
                              onClick={() => {
                                  if (onTransactionAction && requireFeeModal.feeAmount) {
                                      onTransactionAction(requireFeeModal.txId, 'require_fee', requireFeeModal.feeType, parseFloat(requireFeeModal.feeAmount));
                                      setRequireFeeModal({ ...requireFeeModal, isOpen: false });
                                      setLogs([{ time: new Date().toLocaleTimeString(), msg: `Fee required for TX ${requireFeeModal.txId}`, type: 'info' }, ...logs]);
                                  }
                              }}
                              disabled={!requireFeeModal.feeAmount}
                              className="w-full bg-blue-500 text-white font-bold py-3 rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              Apply Fee Requirement
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

const AdminInput = ({ label, value, onChange, type = 'number', dark = false, icon, tooltip }: any) => (
    <div className="space-y-2 group">
        <div className="flex items-center gap-2">
             <label className={`text-[10px] font-black uppercase tracking-[0.2em] block italic transition-colors ${dark ? 'text-slate-500 group-focus-within:text-amber-500' : 'text-slate-400 group-focus-within:text-amber-500'}`}>{label}</label>
             {tooltip && (
                 <div className="group/tooltip relative cursor-help">
                     <Info size={12} className="text-slate-400" />
                     <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-slate-900 text-white text-[10px] font-medium rounded-xl shadow-xl opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50 text-center leading-relaxed border border-white/10">
                         {tooltip}
                         <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-2 border-4 border-transparent border-t-slate-900"></div>
                     </div>
                 </div>
             )}
        </div>
        <div className="relative">
            {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40 group-focus-within:opacity-100 group-focus-within:text-amber-500 transition-all">{icon}</div>}
            <input 
                type={type} 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className={`w-full ${icon ? 'pl-10' : 'px-5'} py-4 text-sm font-black rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/10 transition-all italic tracking-tight ${
                    dark 
                    ? 'bg-white/[0.03] border-2 border-white/5 text-white focus:border-amber-500/50' 
                    : 'bg-slate-50 dark:bg-white/[0.03] border-2 border-slate-100 dark:border-white/5 text-slate-900 dark:text-white focus:border-amber-500/50'
                }`}
            />
        </div>
    </div>
);

const NotificationToggle = ({ label, active, onClick, icon }: any) => (
    <button 
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all text-[10px] font-black uppercase tracking-[0.2em] italic ${
            active 
            ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
            : 'bg-transparent text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
        }`}
    >
        {icon}
        {label}
    </button>
);

const AdminStatCard = ({ title, value, icon, trend, color, onClick }: any) => (
    <div 
        onClick={onClick}
        className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start justify-between transition-all ${onClick ? 'cursor-pointer hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700' : ''}`}
    >
        <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{title}</p>
            <h4 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h4>
            <p className={`text-[10px] font-black mt-2 uppercase ${trend.includes('+') ? 'text-emerald-500' : 'text-blue-500'}`}>{trend}</p>
        </div>
        <div className={`p-3 bg-slate-50 dark:bg-slate-800 rounded-xl ${color}`}>
            {icon}
        </div>
    </div>
);

const StatusBadge = ({ label, status, icon, color = 'text-slate-400' }: any) => (
    <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl">
        <div className={color}>{icon}</div>
        <div className="flex flex-col">
            <span className="text-[8px] font-black text-slate-500 uppercase leading-none">{label}</span>
            <span className="text-[11px] font-bold text-white mt-1 leading-none">{status}</span>
        </div>
    </div>
);

export default Admin;

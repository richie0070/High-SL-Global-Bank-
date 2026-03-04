
import React, { useState, useEffect } from 'react';
import { User, View, Transaction, Loan, FeeConfiguration, PaymentConfig, Notification } from './types';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Loans from './pages/Loans';
import Admin from './pages/Admin';
import UsersPage from './pages/Users';
import Transfer from './pages/Transfer';
import AccountDetails from './pages/AccountDetails';
import Investments from './pages/Investments';
import Activity from './pages/Activity';
import Support from './pages/Support';
import Documents from './pages/Documents';
import Messages from './pages/Messages';
import Cards from './pages/Cards';
import Vaults from './pages/Vaults';
import AIWealthAdvisor from './components/AIWealthAdvisor';
import { MOCK_TRANSACTIONS, MOCK_LOANS, MOCK_USERS } from './mockData';

export function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('landing');
  const [viewParams, setViewParams] = useState<any>(null);
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [loans, setLoans] = useState<Loan[]>(MOCK_LOANS);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
      { id: 1, title: 'Large Deposit Received', desc: 'A deposit of $12,500.00 was successfully verified.', time: '2m ago', type: 'success' },
      { id: 2, title: 'Login Detected', desc: 'Secure session initiated from New York, US.', time: '14m ago', type: 'info' },
      { id: 3, title: 'Limit Warning', desc: 'You have reached 80% of your daily wire limit.', time: '1h ago', type: 'warn' },
  ]);

  // Global Fee Configuration
  const [fees, setFees] = useState<FeeConfiguration>({
      transferFee: 1.5,
      networkFee: 0.1,
      electricalFee: 0.05,
      loanInterestRate: 6.99,
      loanOriginationFee: 150,
      investmentFee: 0.5,
      escrowFee: 2.0,
      subjectFee: 45.0,
      maintenanceFee: 15.0,
      overdraftFee: 35.0,
      wireTransferFee: 25.0,
      internationalTransferFee: 45.0,
      atmFee: 2.5,
      latePaymentFee: 29.0
  });

  // Global Payment Method Configuration
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>({
      bankName: 'High SL Global Bank',
      accountName: 'High SL Operating Account',
      accountNumber: '9988776655',
      routingNumber: '021000021',
      swiftCode: 'HSLGUS33XXX',
      btcAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      ethAddress: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
      usdtAddress: 'TJ8vc98k3...Trc20',
      paypalEmail: 'payments@highsl.com',
      zelleContact: 'billing@highsl.com',
      cashAppTag: '$HighSLGlobal',
      acceptedGiftCards: 'Apple, Amazon, Steam, Google Play, Razer Gold'
  });

  // Initialize theme from local storage
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const handleNavigate = (view: View, params?: any) => {
      setCurrentView(view);
      if (params) {
          setViewParams(params);
      } else {
          setViewParams(null);
      }
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      handleNavigate('admin');
    } else {
      handleNavigate('dashboard');
    }
  };

  const handleRegister = (newUser: User) => {
    setAllUsers([...allUsers, newUser]);
    handleLogin(newUser);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    handleNavigate('landing');
  };

  const handleUpdateFees = (newFees: FeeConfiguration) => {
      setFees(newFees);
      const newNotif: Notification = {
          id: Date.now(),
          title: 'Fee Configuration Updated',
          desc: 'The fee structure has been updated by the administrator.',
          time: 'Just now',
          type: 'info'
      };
      setNotifications(prev => [newNotif, ...prev]);
  };

  const handleTransfer = (amount: number, recipient: string, note: string) => {
      if (!currentUser) return;

      // CORE LOGIC UPDATE: Fees are NOT deducted from balance.
      // Only the principal amount is checked and deducted.
      
      if (currentUser.balance < amount) {
          alert(`Insufficient funds for transfer principal: $${amount.toLocaleString()}`);
          return;
      }

      const updatedUser = { ...currentUser, balance: currentUser.balance - amount };
      setCurrentUser(updatedUser);
      setAllUsers(allUsers.map(u => u.id === currentUser.id ? updatedUser : u));
      
      const newTransaction: Transaction = {
          id: `t${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          description: `Transfer to ${recipient}`,
          amount: amount,
          type: 'debit',
          status: 'Completed',
          network: 'Internal Transfer',
          sender: currentUser.name,
          recipient: recipient,
          reference: `TRX-${Math.floor(Math.random() * 1000000)}`
      };
      
      // We do NOT create a transaction record for fees here as they are settled separately.
      setTransactions([newTransaction, ...transactions]);
  };

  const handleApplyLoan = (amount: number, purpose: string) => {
    if (!currentUser) return;
    const newLoan: Loan = {
      id: `l${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      amount: amount,
      status: 'Pending',
      dateApplied: new Date().toISOString().split('T')[0],
      purpose: purpose
    };
    setLoans([newLoan, ...loans]);
  };

  const renderContent = () => {
    if (!currentUser) return null;

    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={currentUser} transactions={transactions} onNavigate={handleNavigate} />;
      case 'admin':
        return (
            <Admin 
                users={allUsers} 
                loans={loans} 
                fees={fees}
                paymentConfig={paymentConfig}
                transactions={transactions}
                onLoanAction={(id, action) => setLoans(loans.map(l => l.id === id ? { ...l, status: action === 'approve' ? 'Approved' : 'Rejected' } : l))} 
                onTransactionAction={(id, action, feeType, feeAmount) => setTransactions(transactions.map(t => {
                    if (t.id === id) {
                        if (action === 'require_fee') {
                            return { ...t, status: 'Requires Fee', requiredFeeType: feeType, requiredFeeAmount: feeAmount };
                        } else if (action === 'approve') {
                            return { ...t, status: 'Completed', requiredFeeType: undefined, requiredFeeAmount: undefined };
                        } else if (action === 'reject') {
                            return { ...t, status: 'Failed', requiredFeeType: undefined, requiredFeeAmount: undefined };
                        }
                    }
                    return t;
                }))}
                onNavigate={handleNavigate}
                onUpdateFees={handleUpdateFees}
                onUpdatePaymentConfig={setPaymentConfig}
                onAdminTransaction={(userId, amount, type, desc) => {
                    const user = allUsers.find(u => u.id === userId);
                    if (user) {
                        const updated = { ...user, balance: type === 'credit' ? user.balance + amount : user.balance - amount };
                        setAllUsers(allUsers.map(u => u.id === userId ? updated : u));
                        if (currentUser.id === userId) setCurrentUser(updated);
                    }
                }}
                onAddUser={(u) => setAllUsers([...allUsers, u])}
            />
        );
      case 'users':
        return <UsersPage users={allUsers} onAddUser={(u) => setAllUsers([...allUsers, u])} onUpdateUser={(u) => setAllUsers(allUsers.map(usr => usr.id === u.id ? u : usr))} initialFilter={viewParams?.filter} />;
      case 'loans':
        return <Loans user={currentUser} loans={loans} onApplyLoan={handleApplyLoan} filterStatus={viewParams?.filter} />;
      case 'transfer':
        return <Transfer user={currentUser} fees={fees} paymentConfig={paymentConfig} onBack={() => handleNavigate('dashboard')} onTransfer={handleTransfer} onNavigate={handleNavigate} />;
      case 'account-details':
        return <AccountDetails user={currentUser} />;
      case 'investments':
        return <Investments user={currentUser} />;
      case 'activity':
        return <Activity transactions={transactions} />;
      case 'support':
          return <Support />;
      case 'documents':
          return <Documents />;
      case 'messages':
          return <Messages />;
      case 'cards':
          return <Cards />;
      case 'vaults':
          return <Vaults />;
      default:
        return <Dashboard user={currentUser} transactions={transactions} onNavigate={handleNavigate} />;
    }
  };

  if (currentView === 'landing') return <Landing onLoginClick={() => handleNavigate('login')} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;
  if (currentView === 'login') return <Login onLogin={handleLogin} onRegister={handleRegister} existingUsers={allUsers} onBack={() => handleNavigate('landing')} isDarkMode={isDarkMode} toggleTheme={toggleTheme} />;

  return (
    <Layout currentUser={currentUser} currentView={currentView} notifications={notifications} onNavigate={handleNavigate} onLogout={handleLogout} isDarkMode={isDarkMode} toggleTheme={toggleTheme}>
      {renderContent()}
      {currentUser && currentUser.role === 'user' && <AIWealthAdvisor currentUser={currentUser} transactions={transactions} />}
    </Layout>
  );
}

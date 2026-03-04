import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Lock, 
  Mail, 
  ArrowLeft, 
  User as UserIcon, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  EyeOff,
  ShieldCheck,
  Globe,
  Calendar,
  Phone,
  Check,
  ChevronRight,
  Sun,
  Moon,
  Smartphone,
  Shield,
  Fingerprint,
  Upload,
  Trophy,
  Loader2,
  Database,
  Activity,
  Cpu,
  Hash,
  Briefcase,
  Wallet,
  PiggyBank,
  Landmark,
  ShieldEllipsis
} from 'lucide-react';
import { User, AccountType } from '../types';
import { Logo } from '../components/Logo';

interface LoginProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  existingUsers: User[];
  onBack: () => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

type RegistrationStep = 1 | 2 | 3 | 4 | 5;

const Login: React.FC<LoginProps> = ({ onLogin, onRegister, existingUsers, onBack, isDarkMode, toggleTheme }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoverySuccess, setRecoverySuccess] = useState(false);
  const [pendingUser, setPendingUser] = useState<User | null>(null);
  
  // Login State
  const [loginData, setLoginData] = useState({
    email: 'highslbankingservices@gmail.com',
    password: 'Richie1@'
  });

  // Registration State
  const [regStep, setRegStep] = useState<RegistrationStep>(1);
  const [isValidating, setIsValidating] = useState(false);
  const [validationLogs, setValidationLogs] = useState<string[]>([]);
  const [regData, setRegData] = useState({
    firstName: '',
    lastName: '',
    dob: '',
    ssn: '',
    email: '',
    phone: '',
    otp: '',
    address: '',
    password: '',
    confirmPassword: '',
    pin: '',
    accountType: 'Savings Account' as AccountType,
    agreedToTerms: false,
    documentUploaded: false
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleRegChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setRegData({ ...regData, [target.name]: value });
    setError('');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
        if (loginData.email === 'highslbankingservices@gmail.com' && loginData.password === 'Richie1@') {
            const adminUser = existingUsers.find(u => u.role === 'admin');
            if (adminUser) {
                setPendingUser(adminUser);
                setShow2FA(true);
                setIsLoading(false);
                return;
            }
        }

        const user = existingUsers.find(u => u.email.toLowerCase() === loginData.email.toLowerCase());
        if (user) {
            setPendingUser(user);
            setShow2FA(true);
        } else {
            setError('Account credentials not found in our global directory.');
        }
        setIsLoading(false);
    }, 1200);
  };

  const handle2FASubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      setTimeout(() => {
          if (twoFactorCode.length === 6) {
              if (pendingUser) {
                  onLogin(pendingUser);
              }
          } else {
              setError('Invalid 2FA code. Please enter the 6-digit code sent to your device.');
          }
          setIsLoading(false);
      }, 1000);
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError('');

      setTimeout(() => {
          if (recoveryEmail) {
              setRecoverySuccess(true);
          } else {
              setError('Please enter a valid email address.');
          }
          setIsLoading(false);
      }, 1500);
  };

  const validateStep = (step: RegistrationStep): boolean => {
      setError('');
      switch(step) {
          case 1:
              if (!regData.firstName || !regData.lastName || !regData.dob || !regData.ssn) {
                  setError('All identity fields are required for verification.');
                  return false;
              }
              return true;
          case 2:
              if (!regData.email || !regData.phone) {
                  setError('Contact details must be provided before proceeding.');
                  return false;
              }
              return true;
          case 3:
              if (!regData.documentUploaded) {
                  setError('Document upload is required for identity verification.');
                  return false;
              }
              return true;
          case 4:
              return true; // Account type selection
          case 5:
              if (regData.password !== regData.confirmPassword) {
                  setError('Passwords do not match. Please re-verify.');
                  return false;
              }
              if (regData.password.length < 8) {
                  setError('Password must be at least 8 characters.');
                  return false;
              }
              if (regData.pin.length !== 4) {
                  setError('A 4-digit security PIN is mandatory.');
                  return false;
              }
              return true;
          default:
              return false;
      }
  };

  const handleNextStep = async () => {
      if (validateStep(regStep)) {
          setIsValidating(true);
          setValidationLogs([]);
          
          const logs = [
              "Verifying Identity...",
              "Checking Social Security records...",
              "Querying credit databases...",
              "Connection established with secure server."
          ];

          for (const log of logs) {
              setValidationLogs(prev => [...prev, log]);
              await new Promise(r => setTimeout(r, 450));
          }

          setIsValidating(false);
          if (regStep < 5) {
              setRegStep((prev) => (prev + 1) as RegistrationStep);
          } else {
              handleRegisterSubmit();
          }
      }
  };

  const handlePrevStep = () => {
      if (regStep > 1) {
          setRegStep((prev) => (prev - 1) as RegistrationStep);
          setError('');
      }
  };

  const handleRegisterSubmit = () => {
      setIsLoading(true);
      setTimeout(() => {
        const initialBalanceMap = {
            'Savings Account': 1000.00,
            'Cheque Account': 500.00,
            'Business Account': 15000.00,
            'Wealth Management Account': 100000.00
        };

        const newUser: User = {
            id: `u${Date.now()}`,
            name: `${regData.firstName} ${regData.lastName}`,
            email: regData.email,
            role: 'user',
            balance: initialBalanceMap[regData.accountType],
            accountType: regData.accountType,
            accountNumber: `HSL-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'Active',
            riskScore: 'Low',
            kycLevel: regData.accountType === 'Wealth Management Account' ? 3 : (regData.accountType === 'Business Account' ? 2 : 1),
            joinedDate: new Date().toISOString().split('T')[0]
        };
        onRegister(newUser);
        setIsLoading(false);
      }, 3000);
  };

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Left Column - Branding (Desktop) */}
      <div className="hidden lg:flex w-5/12 bg-slate-900 relative overflow-hidden flex-col justify-between p-16 text-white border-r border-slate-800">
          <div className="absolute inset-0 z-0">
             <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-slate-950 via-slate-900 to-black"></div>
             <div className="absolute -right-40 -top-40 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px]"></div>
             <div className="absolute -left-40 bottom-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]"></div>
             <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>
          
          <div className="relative z-10">
             <Logo 
                className="mb-16" 
                iconSize={28} 
                textSize="text-3xl" 
                subTextSize="text-[10px] text-amber-500" 
                onClick={onBack} 
             />
             
             <div className="mt-12 space-y-8">
                 <h1 className="text-5xl xl:text-7xl font-black leading-[1.05] tracking-tighter">
                    {isRegistering ? "Secure Your Financial Future." : "The Apex of Private Banking."}
                 </h1>
                 <p className="text-slate-400 text-xl max-w-md leading-relaxed font-light">
                    {isRegistering 
                        ? "Join the elite network moving the global economy with high-level security and ultimate liquidity."
                        : "Authenticated access to global high-limit settlements, investment pools, and premium assets."
                    }
                 </p>
             </div>
          </div>

          <div className="relative z-10 space-y-6">
              <div className="bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-[2.5rem] shadow-2xl">
                  <div className="flex items-center gap-4 mb-4">
                      <div className="p-2.5 bg-emerald-500/20 rounded-2xl">
                        <ShieldCheck className="text-emerald-400" size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg tracking-tight">System Integrity</h3>
                        <p className="text-slate-400 text-[10px] tracking-[0.2em] uppercase font-black">Quantum Encryption Active</p>
                      </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                      All protocols are hardened against unauthorized access. Your session is protected by multi-factor authentication.
                  </p>
              </div>
          </div>
      </div>

      {/* Right Column - Forms */}
      <div className="w-full lg:w-7/12 flex flex-col relative overflow-y-auto scrollbar-hide">
          {/* Header */}
          <div className="sticky top-0 left-0 w-full p-6 flex justify-between items-center lg:p-10 z-50 bg-inherit/80 backdrop-blur-md">
              <button 
                 onClick={onBack}
                 className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all px-5 py-2.5 rounded-2xl ${isDarkMode ? 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800' : 'text-slate-500 hover:text-slate-900 bg-white border border-gray-100 shadow-sm'}`}
              >
                  <ArrowLeft size={14} /> Exit Portal
              </button>

              <div className="flex items-center gap-6">
                  <button onClick={toggleTheme} className={`p-2.5 rounded-2xl transition-all ${isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-900' : 'text-slate-400 hover:text-slate-900 hover:bg-gray-100'}`}>
                      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                  <div className="lg:hidden flex items-center gap-2">
                     <Logo onClick={onBack} />
                  </div>
              </div>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 min-h-screen">
              <div className="w-full max-w-xl">
                  
                  {/* Mode Toggle & Progress */}
                  <div className="mb-12 text-center">
                      {isRegistering ? (
                          <>
                            <div className="flex items-center justify-center gap-4 mb-8">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <div key={s} className="flex items-center">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all duration-500 ${
                                            regStep === s ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20 scale-110' : 
                                            regStep > s ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                                        }`}>
                                            {regStep > s ? <Check size={16} /> : s}
                                        </div>
                                        {s < 5 && <div className={`w-6 md:w-10 h-0.5 mx-1 md:mx-2 transition-colors duration-500 ${regStep > s ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`}></div>}
                                    </div>
                                ))}
                            </div>
                            <h2 className={`text-3xl md:text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>
                                {regStep === 1 && "Personal Details"}
                                {regStep === 2 && "Contact Info"}
                                {regStep === 3 && "ID Verification"}
                                {regStep === 4 && "Account Type"}
                                {regStep === 5 && "Security Setup"}
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-500' : 'text-slate-400'} mt-3 text-sm font-medium`}>Step {regStep} of 5 — Enrollment in Progress</p>
                          </>
                      ) : (
                          <>
                             <div className={`inline-flex p-1.5 rounded-2xl mb-10 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-slate-100 border border-gray-200 shadow-inner'}`}>
                                <button className={`px-10 py-3 shadow-2xl rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-white text-slate-900'}`}>Login</button>
                                <button 
                                    onClick={() => { setIsRegistering(true); setError(''); setRegStep(1); }}
                                    className={`px-10 py-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${isDarkMode ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                                >
                                    Register
                                </button>
                             </div>
                             <h2 className={`text-4xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight`}>Client Portal</h2>
                             <p className={`${isDarkMode ? 'text-slate-500' : 'text-slate-400'} mt-3 text-sm font-medium`}>Handshake required for secure session.</p>
                          </>
                      )}
                  </div>

                  {/* Error Display */}
                  {error && (
                      <div className="mb-8 bg-red-500/10 border border-red-500/20 text-red-500 px-6 py-5 rounded-[2rem] flex items-start gap-4 text-sm animate-fade-in">
                          <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
                          <span className="font-bold">{error}</span>
                      </div>
                  )}

                  {/* FORM CONTENT */}
                  {showRecovery ? (
                      /* --- PASSWORD RECOVERY --- */
                      <form onSubmit={handleRecoverySubmit} className="space-y-6 animate-fade-in">
                          <div className="mb-6 text-center">
                              <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight mb-2`}>Account Recovery</h3>
                              <p className={`${isDarkMode ? 'text-slate-500' : 'text-slate-400'} text-sm font-medium`}>Enter your email to receive reset instructions.</p>
                          </div>
                          
                          {recoverySuccess ? (
                              <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-6 py-8 rounded-[2rem] flex flex-col items-center gap-4 text-center animate-fade-in">
                                  <Check size={48} className="text-emerald-500 mb-2" />
                                  <span className="font-bold text-lg">Recovery Email Sent</span>
                                  <span className="text-sm opacity-80">Please check your inbox for further instructions to reset your password.</span>
                                  <button 
                                      type="button" 
                                      onClick={() => { setShowRecovery(false); setRecoverySuccess(false); }}
                                      className="mt-4 px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 transition-colors"
                                  >
                                      Return to Login
                                  </button>
                              </div>
                          ) : (
                              <>
                                  <div className="space-y-2">
                                      <label className={`block text-[10px] font-black uppercase tracking-[0.25em] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Email Address</label>
                                      <div className="relative group">
                                          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                              <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                                          </div>
                                          <input
                                              name="recoveryEmail"
                                              type="email"
                                              value={recoveryEmail}
                                              onChange={(e) => setRecoveryEmail(e.target.value)}
                                              className={`block w-full pl-14 pr-5 py-5 border rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-medium ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-slate-900'}`}
                                              placeholder="Registered Email"
                                              required
                                          />
                                      </div>
                                  </div>
                                  <div className="flex justify-between items-center pt-2">
                                      <button 
                                          type="button" 
                                          onClick={() => setShowRecovery(false)}
                                          className={`text-xs font-bold ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors`}
                                      >
                                          Back to Login
                                      </button>
                                      <button
                                          type="submit"
                                          disabled={isLoading}
                                          className="px-8 py-4 bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-xl shadow-amber-500/10 flex items-center gap-2"
                                      >
                                          {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Send Link'}
                                      </button>
                                  </div>
                              </>
                          )}
                      </form>
                  ) : show2FA ? (
                      /* --- 2FA VERIFICATION --- */
                      <form onSubmit={handle2FASubmit} className="space-y-6 animate-fade-in">
                          <div className="mb-6 text-center">
                              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                                  <Smartphone size={28} className="text-amber-500" />
                              </div>
                              <h3 className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'} tracking-tight mb-2`}>Two-Factor Authentication</h3>
                              <p className={`${isDarkMode ? 'text-slate-500' : 'text-slate-400'} text-sm font-medium`}>Enter the 6-digit code sent to your registered device.</p>
                          </div>
                          <div className="space-y-2">
                              <label className={`block text-[10px] font-black uppercase tracking-[0.25em] text-center ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>Security Code</label>
                              <input
                                  name="twoFactorCode"
                                  type="text"
                                  maxLength={6}
                                  value={twoFactorCode}
                                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                                  className={`block w-full text-center text-3xl tracking-[0.5em] py-5 border rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-mono font-bold ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-slate-900'}`}
                                  placeholder="------"
                                  required
                              />
                          </div>
                          <div className="flex justify-between items-center pt-2">
                              <button 
                                  type="button" 
                                  onClick={() => setShow2FA(false)}
                                  className={`text-xs font-bold ${isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'} transition-colors`}
                              >
                                  Cancel
                              </button>
                              <button
                                  type="submit"
                                  disabled={isLoading || twoFactorCode.length !== 6}
                                  className="px-8 py-4 bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all shadow-xl shadow-amber-500/10 flex items-center gap-2 disabled:opacity-50"
                              >
                                  {isLoading ? <Loader2 className="animate-spin" size={16} /> : 'Verify'}
                              </button>
                          </div>
                      </form>
                  ) : !isRegistering ? (
                      /* --- LOGIN --- */
                      <form onSubmit={handleLoginSubmit} className="space-y-6 animate-fade-in">
                          <InputField 
                              label="Email Address" 
                              name="email" 
                              value={loginData.email} 
                              onChange={handleLoginChange} 
                              icon={<Mail className="h-5 w-5" />} 
                              type="text" 
                              placeholder="Email Address"
                              required
                              isDarkMode={isDarkMode} 
                          />
                          
                          <InputField 
                              label="Password" 
                              name="password" 
                              value={loginData.password} 
                              onChange={handleLoginChange} 
                              icon={<Lock className="h-5 w-5" />} 
                              type="password" 
                              placeholder="Password"
                              required
                              isDarkMode={isDarkMode} 
                          />

                          <div className="flex items-center justify-between py-2">
                              <label className="flex items-center gap-2 cursor-pointer group">
                                  <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-300 text-amber-500 focus:ring-amber-500" />
                                  <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-500 group-hover:text-slate-300' : 'text-slate-400 group-hover:text-slate-900'} transition-colors`}>Persist Session</span>
                              </label>
                              <button type="button" onClick={() => setShowRecovery(true)} className="text-xs font-black uppercase tracking-widest text-amber-500 hover:text-amber-400">Recovery</button>
                          </div>

                          <button
                              type="submit"
                              disabled={isLoading}
                              className="w-full py-5 bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:opacity-90 transition-all shadow-xl shadow-amber-500/10 flex items-center justify-center gap-3 active:scale-[0.98]"
                          >
                              {isLoading ? <Loader2 className="animate-spin" size={18} /> : <>Secure Login <ArrowRight size={18} /></>}
                          </button>
                      </form>
                  ) : (
                      /* --- REGISTRATION --- */
                      <div className="space-y-8 animate-fade-in pb-10">
                          
                          {/* Step 1: Identity */}
                          {regStep === 1 && (
                              <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                      <InputField label="Given Name" name="firstName" value={regData.firstName} onChange={handleRegChange} icon={<UserIcon size={18} />} isDarkMode={isDarkMode} />
                                      <InputField label="Surname" name="lastName" value={regData.lastName} onChange={handleRegChange} icon={<UserIcon size={18} />} isDarkMode={isDarkMode} />
                                  </div>
                                  <InputField label="Date of Birth" name="dob" value={regData.dob} onChange={handleRegChange} icon={<Calendar size={18} />} type="date" isDarkMode={isDarkMode} />
                                  <InputField label="Government ID / SSN" name="ssn" value={regData.ssn} onChange={handleRegChange} icon={<Hash size={18} />} placeholder="***-**-****" isDarkMode={isDarkMode} />
                              </div>
                          )}

                          {/* Step 2: Contact */}
                          {regStep === 2 && (
                              <div className="space-y-6">
                                  <InputField label="Email Address" name="email" value={regData.email} onChange={handleRegChange} icon={<Mail size={18} />} type="email" isDarkMode={isDarkMode} />
                                  <InputField label="Mobile Number" name="phone" value={regData.phone} onChange={handleRegChange} icon={<Phone size={18} />} type="tel" isDarkMode={isDarkMode} />
                                  <div className="p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex items-center gap-3">
                                      <Smartphone className="text-amber-500" size={20} />
                                      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">A 2FA verification code will be sent to your mobile.</p>
                                  </div>
                              </div>
                          )}

                          {/* Step 3: Document Upload */}
                          {regStep === 3 && (
                              <div className="space-y-8">
                                  <div 
                                      onClick={() => setRegData({...regData, documentUploaded: true})}
                                      className={`border-2 border-dashed rounded-[2.5rem] p-12 text-center transition-all cursor-pointer ${
                                          regData.documentUploaded 
                                          ? 'bg-emerald-500/5 border-emerald-500 text-emerald-500' 
                                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-500'
                                      }`}
                                  >
                                      {regData.documentUploaded ? (
                                          <div className="animate-fade-in">
                                              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                                                  <Check size={32} />
                                              </div>
                                              <p className="font-bold">Digital ID Scanned & Verified</p>
                                              <p className="text-xs opacity-60 mt-2">Compliance Score: 99.8%</p>
                                          </div>
                                      ) : (
                                          <>
                                              <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                                              <p className="font-bold text-lg">Upload Identity Document</p>
                                              <p className="text-sm text-slate-500 mt-2">Drag and drop Passport, Driver's License or National ID</p>
                                          </>
                                      )}
                                  </div>
                              </div>
                          )}

                          {/* Step 4: Account Type Selection */}
                          {regStep === 4 && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <TierCard 
                                      active={regData.accountType === 'Savings Account'}
                                      onClick={() => setRegData({...regData, accountType: 'Savings Account'})}
                                      name="Savings Account"
                                      price="$1,000 min"
                                      icon={<PiggyBank size={24} />}
                                      color="blue"
                                  />
                                  <TierCard 
                                      active={regData.accountType === 'Cheque Account'}
                                      onClick={() => setRegData({...regData, accountType: 'Cheque Account'})}
                                      name="Cheque Account"
                                      price="$500 min"
                                      icon={<Wallet size={24} />}
                                      color="amber"
                                  />
                                  <TierCard 
                                      active={regData.accountType === 'Business Account'}
                                      onClick={() => setRegData({...regData, accountType: 'Business Account'})}
                                      name="Business Account"
                                      price="$15k min"
                                      icon={<Briefcase size={24} />}
                                      color="emerald"
                                  />
                                  <TierCard 
                                      active={regData.accountType === 'Wealth Management Account'}
                                      onClick={() => setRegData({...regData, accountType: 'Wealth Management Account'})}
                                      name="Wealth Portfolio"
                                      price="$100k min"
                                      icon={<Trophy size={24} />}
                                      color="blue"
                                      elite
                                  />
                              </div>
                          )}

                          {/* Step 5: Master Setup */}
                          {regStep === 5 && (
                              <div className="space-y-6">
                                  <InputField label="Master Password" name="password" value={regData.password} onChange={handleRegChange} icon={<Lock size={18} />} type="password" isDarkMode={isDarkMode} />
                                  <InputField label="Verify Password" name="confirmPassword" value={regData.confirmPassword} onChange={handleRegChange} icon={<Shield size={18} />} type="password" isDarkMode={isDarkMode} />
                                  <InputField label="4-Digit PIN" name="pin" value={regData.pin} onChange={handleRegChange} icon={<Smartphone size={18} />} placeholder="0000" maxLength={4} isDarkMode={isDarkMode} />
                                  
                                  <div className="flex items-start gap-4 p-5 bg-white/5 border border-white/10 rounded-2xl">
                                      <Fingerprint className="text-amber-500 mt-1 shrink-0" size={24} />
                                      <div>
                                          <p className="text-sm font-bold">Biometric Bonding</p>
                                          <p className="text-xs text-slate-500 leading-relaxed">By finalizing, you authorize High SL to bind your account to this device's biometric sensors for future auth.</p>
                                      </div>
                                  </div>
                              </div>
                          )}

                          {/* VALIDATION OVERLAY */}
                          {isValidating && (
                              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-xl">
                                  <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-10 font-mono shadow-2xl">
                                      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
                                          <Activity className="text-emerald-500 animate-pulse" size={20} />
                                          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Security Log</h4>
                                      </div>
                                      <div className="space-y-3 min-h-[140px]">
                                          {validationLogs.map((log, i) => (
                                              <div key={i} className="flex gap-3 text-xs animate-slide-right">
                                                  <span className="text-slate-700">[{new Date().toLocaleTimeString([], {hour12: false, second: '2-digit'})}]</span>
                                                  <span className="text-emerald-500">{log}</span>
                                              </div>
                                          ))}
                                          <div className="animate-pulse text-emerald-500">_</div>
                                      </div>
                                      <div className="mt-8 flex justify-center">
                                          <Loader2 className="animate-spin text-amber-500" size={32} />
                                      </div>
                                  </div>
                              </div>
                          )}

                          {/* Navigation Buttons */}
                          <div className="flex gap-4 pt-6">
                              <button
                                  onClick={handlePrevStep}
                                  className={`flex-1 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] border transition-all ${isDarkMode ? 'border-slate-800 text-slate-500 hover:text-white hover:bg-slate-900' : 'border-gray-200 text-slate-400 hover:text-slate-900 hover:bg-gray-100'}`}
                              >
                                  Back
                              </button>
                              <button
                                  onClick={handleNextStep}
                                  disabled={isLoading}
                                  className="flex-[2] py-5 bg-slate-950 dark:bg-amber-500 text-white dark:text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:opacity-90 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-3"
                              >
                                  {isLoading ? <Loader2 className="animate-spin" size={18} /> : <> {regStep === 5 ? 'Finalize' : 'Next'} <ArrowRight size={16} /></>}
                              </button>
                          </div>
                      </div>
                  )}

                  <div className="mt-12 text-center">
                      {isRegistering ? (
                          <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                              Already an elite client? 
                              <button onClick={() => setIsRegistering(false)} className="ml-2 text-amber-500 hover:text-amber-400 underline font-black uppercase tracking-widest">Login</button>
                          </p>
                      ) : (
                          <p className={`text-xs font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                              New to High SL Global? 
                              <button onClick={() => setIsRegistering(true)} className="ml-2 text-amber-500 hover:text-amber-400 underline font-black uppercase tracking-widest">Enroll Now</button>
                          </p>
                      )}
                  </div>
              </div>
          </div>
          
          {/* Footer Info */}
          <div className={`p-10 border-t flex flex-col md:flex-row justify-between items-center gap-6 mt-auto ${isDarkMode ? 'border-slate-900 bg-slate-950/50' : 'border-gray-100 bg-slate-50'}`}>
              <div className="flex items-center gap-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                  <Shield size={24} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                  <Database size={24} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
                  <Cpu size={24} className={isDarkMode ? 'text-slate-400' : 'text-slate-500'} />
              </div>
              <p className={`text-[9px] font-black uppercase tracking-[0.3em] text-center md:text-right ${isDarkMode ? 'text-slate-700' : 'text-slate-400'}`}>
                  Member FDIC • Equal Housing Lender • © 2024 High SL Global Bank N.A.
              </p>
          </div>
      </div>
    </div>
  );
};

// UI Components for the New Flow
const InputField = ({ label, icon, isDarkMode, type, ...props }: any) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="space-y-2 w-full">
            <label className={`block text-[10px] font-black uppercase tracking-[0.25em] ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>{label}</label>
            <div className="relative group">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-slate-500 group-focus-within:text-amber-500 transition-colors">
                        {icon}
                    </div>
                )}
                <input
                    {...props}
                    type={inputType}
                    className={`block w-full ${icon ? 'pl-14' : 'pl-6'} ${isPassword ? 'pr-14' : 'pr-5'} py-5 border rounded-2xl focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-medium ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-gray-200 text-slate-900'}`}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-5 flex items-center text-slate-500 hover:text-amber-500"
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                )}
            </div>
        </div>
    );
};

const TierCard = ({ active, onClick, name, price, icon, color, elite }: any) => {
    const colors = {
        amber: 'bg-amber-500/10 border-amber-500 text-amber-500',
        blue: 'bg-blue-500/10 border-blue-500 text-blue-500',
        emerald: 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
    }[color as 'amber' | 'blue' | 'emerald'];

    return (
        <div 
            onClick={onClick}
            className={`relative p-6 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 group overflow-hidden ${
                active ? colors + ' shadow-2xl scale-[1.05] z-10' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
        >
            {elite && <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-amber-400 to-orange-600 rotate-45 flex items-end justify-center pb-2 text-[8px] text-slate-950 font-black uppercase tracking-widest shadow-xl">Elite</div>}
            
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 ${active ? 'bg-white/10' : 'bg-slate-200 dark:bg-slate-800'}`}>
                {icon}
            </div>
            <h4 className="text-lg font-black tracking-tight mb-1">{name}</h4>
            <p className="text-xs opacity-60 font-bold">{price}</p>
            
            <div className={`mt-6 transition-all duration-500 ${active ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <ChevronRight size={20} />
            </div>
        </div>
    );
};

export default Login;
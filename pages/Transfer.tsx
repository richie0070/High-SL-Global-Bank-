
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, View, FeeConfiguration, PaymentConfig } from '../types';
import { 
  ArrowLeft, 
  CheckCircle, 
  User as UserIcon, 
  Building,
  Loader2,
  ShieldCheck,
  Hash,
  Activity,
  Briefcase,
  Home,
  ChevronDown,
  Check,
  Zap,
  X,
  ArrowRight,
  ArrowRightLeft,
  Edit3,
  Globe2,
  Cpu,
  ShieldAlert,
  Smartphone,
  Lock,
  Wifi,
  Navigation,
  Server,
  Key,
  Info,
  Layers,
  Terminal,
  CreditCard,
  FileText,
  AlertTriangle,
  QrCode,
  Printer,
  Download,
  Share2,
  Copy,
  Search,
  Upload
} from 'lucide-react';
import { MOCK_RECIPIENTS, BANK_NETWORKS, BeneficiaryInfo } from '../mockData';

interface TransferProps {
  user: User;
  fees: FeeConfiguration;
  paymentConfig: PaymentConfig;
  onBack: () => void;
  onTransfer: (amount: number, recipient: string, note: string) => void;
  onNavigate: (view: View) => void;
}

type TransferStep = 'discovery' | 'settlement' | 'fee_payment' | 'authorization' | 'finalized';

const CURRENCY_CONFIG: Record<string, { symbol: string, rate: number }> = {
  'USD': { symbol: '$', rate: 1 },
  'ZAR': { symbol: 'R', rate: 18.95 },
  'NGN': { symbol: '₦', rate: 1450.00 },
  'EUR': { symbol: '€', rate: 0.92 },
  'GBP': { symbol: '£', rate: 0.79 }
};

const REGION_CONFIG: Record<string, { currency: string, deliveryTime: string, flag: string }> = {
  'South Africa (BankServAfrica/RTC)': { currency: 'ZAR', deliveryTime: '1-2 Business Days', flag: '🇿🇦' },
  'Nigeria (NIBSS/NIP)': { currency: 'NGN', deliveryTime: 'Instant - 24 Hours', flag: '🇳🇬' },
  'North America (FedWire/NACHA)': { currency: 'USD', deliveryTime: 'Same Day', flag: '🇺🇸' },
  'Europe (SEPA/TARGET2)': { currency: 'EUR', deliveryTime: '1 Business Day', flag: '🇪🇺' }
};

const TransferProgress = ({ currentStep }: { currentStep: number }) => {
  const steps = [
    { label: 'Recipient', icon: Search },
    { label: 'Amount', icon: FileText },
    { label: 'Processing', icon: Activity },
    { label: 'Review', icon: Lock },
    { label: 'Complete', icon: CheckCircle },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto mb-16 px-4">
      <div className="relative flex justify-between items-center">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 dark:bg-white/5 rounded-full -z-10"></div>
        
        {/* Active Line Progress */}
        <div 
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-amber-600 to-amber-400 rounded-full -z-10 transition-all duration-700 ease-out"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((s, i) => {
            const isActive = i === currentStep;
            const isCompleted = i < currentStep;
            const Icon = s.icon;

            return (
                <div key={i} className="flex flex-col items-center gap-3 relative group">
                    <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center border-[3px] transition-all duration-500 z-10 bg-white dark:bg-[#020617]
                        ${isActive || isCompleted 
                            ? 'border-amber-500 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)] scale-110' 
                            : 'border-slate-200 dark:border-white/10 text-slate-300 dark:text-slate-700 scale-100'}
                    `}>
                        {isCompleted ? <CheckCircle size={20} className="fill-amber-500 text-slate-950" /> : <Icon size={18} />}
                    </div>
                    <span className={`
                        absolute -bottom-8 text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 whitespace-nowrap
                        ${isActive ? 'text-amber-500 opacity-100 translate-y-0' : isCompleted ? 'text-slate-500 opacity-100' : 'text-slate-300 dark:text-slate-600 opacity-60'}
                    `}>
                        {s.label}
                    </span>
                </div>
            )
        })}
      </div>
    </div>
  );
};

const Transfer: React.FC<TransferProps> = ({ user, fees, paymentConfig, onBack, onTransfer, onNavigate }) => {
  const [step, setStep] = useState<TransferStep>('discovery');
  
  // Detection Fields
  const [transferType, setTransferType] = useState<'internal' | 'external'>('external');
  const [accountNumber, setAccountNumber] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>(''); 
  const [manualMode, setManualMode] = useState(false);
  const [isCustomBank, setIsCustomBank] = useState(false);
  
  // Results
  const [isHandshaking, setIsHandshaking] = useState(false);
  const [handshakeLogs, setHandshakeLogs] = useState<string[]>([]);
  const [detectedBeneficiary, setDetectedBeneficiary] = useState<BeneficiaryInfo | null>(null);
  
  // Settlement Fields
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [note, setNote] = useState('');
  
  // Fee Settlement State
  const [feesSettled, setFeesSettled] = useState(false);
  const [isSettlingFees, setIsSettlingFees] = useState(false);
  
  // Auth & Receipt
  const [pin, setPin] = useState(['', '', '', '']);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [txReceipt, setTxReceipt] = useState<any>(null);
  const [receiptEmail, setReceiptEmail] = useState('');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  const pinRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const availableBanks = useMemo(() => {
    if (selectedRegion && BANK_NETWORKS[selectedRegion as keyof typeof BANK_NETWORKS]) {
        return BANK_NETWORKS[selectedRegion as keyof typeof BANK_NETWORKS];
    }
    // If manual mode and no region selected, show all or let user pick region first
    return [];
  }, [selectedRegion]);

  const activeStepIndex = useMemo(() => {
    if (step === 'finalized') return 4;
    if (step === 'authorization') return 3;
    if (step === 'fee_payment') return 2;
    if (detectedBeneficiary) return 1;
    return 0;
  }, [step, detectedBeneficiary]);

  // Derived Fees
  const numAmount = parseFloat(amount) || 0;
  const variableFeePercent = fees.networkFee;
  const variableFeeAmount = (numAmount * variableFeePercent) / 100;
  const totalFee = variableFeeAmount;
  const totalDeduction = numAmount;

  // Reset fees settled when amount changes
  useEffect(() => {
      setFeesSettled(false);
  }, [amount]);

  // Reset custom bank toggle if manual mode is disabled
  useEffect(() => {
      if (!manualMode) setIsCustomBank(false);
  }, [manualMode]);

  const handleSettleFees = () => {
      setStep('fee_payment');
  };

  // AUTOMATIC BENEFICIARY DETECTION & MANUAL ROUTING LOGIC
  useEffect(() => {
    const performHandshake = async () => {
      if (transferType === 'internal') return;
      
      if (accountNumber.length >= 8) {
        setIsHandshaking(true);
        setHandshakeLogs(["Verifying account...", "Checking network..."]);
        
        await new Promise(r => setTimeout(r, 800));

        const found = MOCK_RECIPIENTS[accountNumber];
        
        if (found) {
            // Auto-populate found user
            setHandshakeLogs(prev => [...prev, "Account found", "Retrieving details..."]);
            await new Promise(r => setTimeout(r, 600));
            
            setSelectedRegion(found.region);
            setSelectedBank(found.bank);
            setDetectedBeneficiary(found);
            setSelectedCurrency(found.currency);
            setManualMode(false);
        } else {
            // Not found - Enable Manual Routing
            setHandshakeLogs(prev => [...prev, "Account not found", "Enabling manual entry..."]);
            setManualMode(true);
            // Clear beneficiary until manually filled
            if (!manualMode) { // Only clear if we weren't already in manual mode
                setDetectedBeneficiary(null);
                setSelectedBank('');
                setSelectedRegion('');
            }
        }
        setIsHandshaking(false);
      } else {
          setDetectedBeneficiary(null);
          setManualMode(false);
          setHandshakeLogs([]);
      }
    };

    const debounce = setTimeout(performHandshake, 600);
    return () => clearTimeout(debounce);
  }, [accountNumber, transferType]);

  // Construct beneficiary object when in Manual Mode
  useEffect(() => {
      if (manualMode && selectedBank && selectedRegion && accountNumber.length >= 8) {
          setDetectedBeneficiary({
              name: "External Beneficiary",
              bank: selectedBank,
              network: "Manual Asset Routing / SWIFT",
              accountType: "External",
              region: selectedRegion,
              currency: "USD", // Default for manual
              nodeStatus: "Unregistered"
          });
      }
  }, [manualMode, selectedBank, selectedRegion, accountNumber]);

  const internalAccounts = [
    { id: '1', name: 'Savings Account', number: '1002938475', balance: 450200 },
    { id: '2', name: 'Checking Account', number: '1002938476', balance: 12500 },
    { id: '3', name: 'Investment Account', number: '1002938477', balance: 1245000 }
  ];

  const handleFinalize = () => {
      setIsFinalizing(true);
      let currentProgress = 0;
      const interval = setInterval(() => {
          currentProgress += 4;
          if (currentProgress >= 100) {
              clearInterval(interval);
              setProgress(100);
              
              // Generate Receipt Data
              const receipt = {
                  ref: `HSL-${Math.floor(Math.random() * 1000000000)}`,
                  date: new Date().toLocaleString(),
                  amount: parseFloat(amount),
                  currency: selectedCurrency,
                  recipientName: detectedBeneficiary?.name || accountNumber,
                  recipientBank: detectedBeneficiary?.bank || selectedBank,
                  recipientAcc: accountNumber,
                  senderName: user.name,
                  feesPaid: totalFee,
                  note: note
              };
              setTxReceipt(receipt);
              
              onTransfer(parseFloat(amount), detectedBeneficiary?.name || accountNumber, note);
              setStep('finalized');
          } else {
              setProgress(currentProgress);
          }
      }, 80);
  };

  if (step === 'finalized' && txReceipt) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-10 animate-fade-in relative">
            <div className="w-full max-w-lg mb-8">
                <TransferProgress currentStep={activeStepIndex} />
            </div>
            
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-emerald-500/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="bg-white dark:bg-[#020617] w-full max-w-lg rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden relative">
                {/* Receipt Header */}
                <div className="bg-slate-50 dark:bg-[#0f172a] p-8 border-b border-slate-200 dark:border-white/5 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -mr-16 -mt-16 pointer-events-none"></div>
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)] relative z-10">
                        <Check className="w-10 h-10 text-emerald-500" strokeWidth={3} />
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-widest relative z-10">Transfer Successful</h2>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2 relative z-10">Settlement Complete</p>
                </div>

                {/* Receipt Body */}
                <div className="p-8 space-y-8">
                    <div className="text-center">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Amount Sent</p>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                            {CURRENCY_CONFIG[txReceipt.currency]?.symbol}{txReceipt.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                        </h1>
                        <p className="text-[10px] font-mono text-slate-400 mt-2 bg-slate-100 dark:bg-white/5 inline-block px-3 py-1 rounded-lg">
                            REF: {txReceipt.ref}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-white/5 border-dashed">
                            <span className="text-xs font-bold text-slate-500 uppercase">Beneficiary</span>
                            <div className="text-right">
                                <p className="text-sm font-black text-slate-900 dark:text-white uppercase">{txReceipt.recipientName}</p>
                                <p className="text-[10px] text-slate-400 font-mono">**** {txReceipt.recipientAcc.slice(-4)}</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-white/5 border-dashed">
                            <span className="text-xs font-bold text-slate-500 uppercase">Institution</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white text-right max-w-[60%]">{txReceipt.recipientBank}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-white/5 border-dashed">
                            <span className="text-xs font-bold text-slate-500 uppercase">Date & Time</span>
                            <span className="text-sm font-bold text-slate-900 dark:text-white">{txReceipt.date}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-white/5 border-dashed">
                            <span className="text-xs font-bold text-slate-500 uppercase">Protocol Fees</span>
                            <div className="text-right">
                                <span className="text-sm font-bold text-emerald-500 block">PAID SEPARATELY</span>
                                <span className="text-[10px] text-slate-400 font-mono">${txReceipt.feesPaid.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* QR & Verification */}
                    <div className="bg-slate-50 dark:bg-white/5 p-6 rounded-2xl flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verify Transaction</p>
                            <p className="text-[9px] text-slate-500 leading-tight max-w-[150px]">
                                Scan this unique QR hash to validate settlement integrity on the ledger.
                            </p>
                        </div>
                        <div className="bg-white p-2 rounded-lg">
                            <QrCode size={64} className="text-slate-900" />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-slate-50 dark:bg-[#0f172a] border-t border-slate-200 dark:border-white/5 flex gap-4">
                    <button onClick={() => onNavigate('dashboard')} className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:opacity-90 transition-all">
                        Return to Dashboard
                    </button>
                    <button className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
                        <Download size={20} />
                    </button>
                    <button className="p-4 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-xl hover:bg-slate-50 dark:hover:bg-white/10 transition-all">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-32">
        {/* Transfer Header */}
        <div className="flex items-end justify-between border-b border-slate-100 dark:border-white/5 pb-10">
            <div>
                <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                        <ArrowRightLeft size={18} className="text-amber-500" />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-500 italic">
                        {transferType === 'internal' ? 'Internal Transfer' : 'International Transfer'}
                    </span>
                </div>
                <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase leading-none">Transfer Funds</h1>
            </div>
            <button onClick={onBack} className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-[0.3em] flex items-center gap-2 transition-colors italic">
                <X size={16} /> Close Transfer
            </button>
        </div>

        {/* Progress Stepper */}
        <TransferProgress currentStep={activeStepIndex} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-10">
                
                {/* STAGE 1: RECIPIENT VERIFICATION */}
                <div className="bg-white dark:bg-[#0f172a] rounded-[3.5rem] p-10 md:p-14 border border-slate-100 dark:border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                    
                    <div className="flex justify-between items-center mb-10">
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Recipient Details</label>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => {
                                    setTransferType('internal');
                                    setAccountNumber('');
                                    setManualMode(false);
                                    setDetectedBeneficiary(null);
                                    setSelectedBank("High SL Global");
                                    setSelectedRegion("Global");
                                    setSelectedCurrency("USD");
                                }}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${transferType === 'internal' ? 'bg-amber-500 text-slate-900' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                Internal
                            </button>
                            <button 
                                onClick={() => {
                                    setTransferType('external');
                                    setAccountNumber('');
                                    setDetectedBeneficiary(null);
                                    setManualMode(false);
                                }}
                                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${transferType === 'external' ? 'bg-amber-500 text-slate-900' : 'bg-slate-100 dark:bg-white/5 text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                            >
                                External
                            </button>
                        </div>
                        {manualMode && <span className="text-[9px] font-black bg-amber-500 text-slate-900 px-2 py-1 rounded uppercase tracking-widest ml-2">Manual Entry Mode</span>}
                    </div>

                    <div className="space-y-8">
                        {transferType === 'internal' ? (
                            <div className="relative">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-1 mb-3 block italic">Select Destination Account</label>
                                <div className="relative group/select">
                                    <select 
                                        value={accountNumber}
                                        onChange={(e) => {
                                            setAccountNumber(e.target.value);
                                            const acc = internalAccounts.find(a => a.number === e.target.value);
                                            if (acc) {
                                                setDetectedBeneficiary({
                                                    name: user.name,
                                                    bank: "High SL Global",
                                                    network: "Internal Transfer",
                                                    accountType: acc.name,
                                                    region: "Internal",
                                                    currency: "USD",
                                                    nodeStatus: "Verified"
                                                });
                                                setSelectedCurrency("USD");
                                                setManualMode(false);
                                            }
                                        }}
                                        className="w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/10 rounded-2xl px-6 py-5 text-sm font-black text-slate-900 dark:text-white outline-none focus:border-amber-500 appearance-none uppercase tracking-widest cursor-pointer italic transition-all"
                                    >
                                        <option value="">Select Account...</option>
                                        {internalAccounts.map(acc => (
                                            <option key={acc.id} value={acc.number}>{acc.name} (...{acc.number.slice(-4)}) - ${acc.balance.toLocaleString()}</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>
                        ) : (
                            <div className="relative">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-1 mb-3 block italic">Account Number</label>
                                <div className="relative">
                                    <Hash className="absolute left-0 top-1/2 -translate-y-1/2 text-5xl font-extralight text-amber-500/20 mr-6 tracking-tighter italic select-none" size={48} />
                                    <input 
                                        type="text" 
                                        value={accountNumber}
                                        onChange={(e) => {
                                            if (transferType === 'external') {
                                                setAccountNumber(e.target.value.replace(/\D/g, ''));
                                            }
                                        }}
                                        placeholder="8037375289..."
                                        className="w-full bg-transparent text-5xl md:text-6xl font-black text-slate-900 dark:text-white pl-12 focus:outline-none border-b-2 border-slate-100 dark:border-white/5 focus:border-amber-500 pb-6 transition-all tracking-tighter placeholder:text-slate-100 dark:placeholder:text-slate-800 uppercase italic"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SYSTEM LOGS */}
                    {handshakeLogs.length > 0 && (
                        <div className="mt-10 bg-black/90 rounded-[2rem] p-8 font-mono text-[10px] space-y-1.5 border border-white/5 shadow-2xl backdrop-blur-xl">
                            {handshakeLogs.map((log, i) => (
                                <div key={i} className="flex gap-4 animate-slide-right">
                                    <span className="text-slate-600">[{new Date().toLocaleTimeString([], {hour12: false, second: '2-digit'})}]</span>
                                    <span className="text-emerald-500 uppercase tracking-widest font-bold italic">{log}</span>
                                </div>
                            ))}
                            {isHandshaking && <div className="text-amber-500 animate-pulse flex items-center gap-2 mt-2 font-black italic">_ PROCESSING_VERIFICATION <Loader2 size={10} className="animate-spin" /></div>}
                        </div>
                    )}
                </div>

                {/* INTERNATIONAL ROUTING DETAILS */}
                {transferType === 'external' && (
                <div className={`bg-white dark:bg-[#0f172a] rounded-[3.5rem] p-10 md:p-14 border border-slate-100 dark:border-white/5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group transition-all duration-500 ${accountNumber.length > 3 ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 pointer-events-none'}`}>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                            <Globe2 size={20} className="text-blue-500" />
                        </div>
                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Bank Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-1 italic">Country/Region</label>
                            <div className="relative group/select">
                                <Globe2 size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                                <select 
                                    value={selectedRegion}
                                    onChange={(e) => { setSelectedRegion(e.target.value); setSelectedBank(''); }}
                                    disabled={!manualMode} 
                                    className={`w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/10 rounded-2xl pl-16 pr-6 py-5 text-xs font-black text-slate-500 dark:text-slate-300 outline-none focus:border-amber-500 appearance-none uppercase tracking-widest cursor-pointer italic transition-all ${!manualMode ? 'cursor-not-allowed opacity-80' : ''}`}
                                >
                                    <option value="">Select Region...</option>
                                    {Object.keys(BANK_NETWORKS).map(region => (
                                        <option key={region} value={region}>{REGION_CONFIG[region]?.flag} {region}</option>
                                    ))}
                                </select>
                                <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            </div>
                            {selectedRegion && REGION_CONFIG[selectedRegion] && (
                                <div className="mt-3 p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/10 space-y-3">
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-slate-500 font-bold uppercase tracking-widest">Est. Delivery</span>
                                        <span className="text-slate-900 dark:text-white font-black">{REGION_CONFIG[selectedRegion].deliveryTime}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px]">
                                        <span className="text-slate-500 font-bold uppercase tracking-widest">Exchange Rate</span>
                                        <span className="text-emerald-500 font-black">1 USD = {CURRENCY_CONFIG[REGION_CONFIG[selectedRegion].currency].rate} {REGION_CONFIG[selectedRegion].currency}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="space-y-3">
                            <div className="flex justify-between items-center pr-1">
                                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] pl-1 italic">Bank Name</label>
                                {manualMode && (
                                    <button 
                                        onClick={() => {
                                            setIsCustomBank(!isCustomBank);
                                            setSelectedBank(''); // Clear on toggle to prevent invalid state mix
                                        }}
                                        className="group flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-amber-500 hover:text-amber-400 transition-colors"
                                    >
                                        {isCustomBank ? (
                                            <>
                                                <Building size={10} /> Select from Network
                                            </>
                                        ) : (
                                            <>
                                                <Edit3 size={10} /> Enter Custom Name
                                            </>
                                        )}
                                    </button>
                                )}
                            </div>
                            
                            <div className="relative group/select">
                                {manualMode && isCustomBank ? (
                                    <>
                                        <Edit3 size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-amber-500 animate-pulse" />
                                        <input 
                                            type="text"
                                            value={selectedBank}
                                            onChange={(e) => setSelectedBank(e.target.value)}
                                            placeholder="ENTER INSTITUTION..."
                                            className="w-full bg-slate-50 dark:bg-white/[0.03] border-2 border-amber-500/30 rounded-2xl pl-16 pr-6 py-5 text-xs font-black text-slate-900 dark:text-white outline-none focus:border-amber-500 transition-all appearance-none uppercase tracking-widest italic placeholder:text-slate-400"
                                        />
                                        <div className="absolute right-6 top-1/2 -translate-y-1/2 px-2 py-1 bg-amber-500/10 rounded text-[9px] font-bold text-amber-500 uppercase tracking-widest pointer-events-none">
                                            Manual
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <Building size={16} className={`absolute left-6 top-1/2 -translate-y-1/2 ${manualMode ? 'text-slate-400' : 'text-slate-400 opacity-50'}`} />
                                        <select 
                                            value={selectedBank}
                                            onChange={(e) => setSelectedBank(e.target.value)}
                                            disabled={!manualMode}
                                            className={`w-full bg-slate-50 dark:bg-white/[0.03] border border-slate-100 dark:border-white/10 rounded-2xl pl-16 pr-6 py-5 text-xs font-black text-slate-500 dark:text-slate-300 outline-none focus:border-amber-500 appearance-none uppercase tracking-widest cursor-pointer italic transition-all ${!manualMode ? 'cursor-not-allowed opacity-50' : 'hover:border-amber-500/30'}`}
                                        >
                                            <option value="">{manualMode ? "Select Institution..." : "Auto-Detected"}</option>
                                            {availableBanks.map(bank => <option key={bank} value={bank}>{bank}</option>)}
                                            {!manualMode && selectedBank && !availableBanks.includes(selectedBank) && <option value={selectedBank}>{selectedBank}</option>}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                )}

                {/* STAGE 2: RECIPIENT CONFIRMATION */}
                {detectedBeneficiary && !isHandshaking && (
                    <div className="space-y-10 animate-fade-in">
                        <div className="bg-[#020617] rounded-[3.5rem] p-12 text-white border border-white/5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
                            <div className="absolute -right-20 -top-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
                            
                            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-12">
                                <div className="space-y-10 flex-1">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Recipient Profile</p>
                                            {manualMode ? (
                                                <span className="bg-amber-500 text-slate-900 text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.4)]">
                                                    <ShieldAlert size={10} strokeWidth={3} /> External Account
                                                </span>
                                            ) : (
                                                <span className="bg-emerald-500 text-slate-900 text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest flex items-center gap-1.5 shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                                                    <CheckCircle size={10} strokeWidth={3} /> Verified Account
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-white">{detectedBeneficiary.name}</h3>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10">
                                        <MetaDataItem label="Institution" value={detectedBeneficiary.bank} icon={<Building size={14} />} />
                                        <MetaDataItem label="Network Protocol" value={detectedBeneficiary.network} icon={<Server size={14} />} />
                                        {detectedBeneficiary.branchCode && (
                                            <MetaDataItem label="Branch Code" value={detectedBeneficiary.branchCode} icon={<Key size={14} />} />
                                        )}
                                        <MetaDataItem label="Account Type" value={detectedBeneficiary.accountType} icon={<ShieldCheck size={14} />} />
                                        <MetaDataItem label="Region Cluster" value={detectedBeneficiary.region} icon={<Globe2 size={14} />} />
                                    </div>
                                </div>
                                
                                <div className={`p-8 rounded-[2.5rem] border flex flex-col items-center gap-5 w-full md:w-auto shadow-inner ${manualMode ? 'bg-amber-500/10 border-amber-500/20' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
                                    <div className="relative">
                                        <ShieldCheck size={52} className={manualMode ? 'text-amber-500' : 'text-emerald-500'} />
                                        {!manualMode && <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full animate-ping"></div>}
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1 italic">Account Status</p>
                                        <p className={`text-2xl font-black italic tracking-tighter ${manualMode ? 'text-amber-500' : 'text-emerald-500'}`}>
                                            {manualMode ? 'EXTERNAL' : 'VERIFIED'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* STAGE 3: SETTLEMENT PARAMETERS */}
                        <div className="bg-white dark:bg-[#0f172a] rounded-[3.5rem] p-12 border border-slate-100 dark:border-white/5 shadow-2xl space-y-12 relative overflow-hidden">
                            
                            <div>
                                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mb-10 italic">Transfer Amount</h3>
                                <div className="relative mb-8 group">
                                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-7xl font-extralight text-amber-500/10 group-hover:text-amber-500/20 transition-colors select-none">$</span>
                                    <input 
                                        type="number" 
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full bg-transparent text-7xl md:text-9xl font-black text-slate-900 dark:text-white pl-16 focus:outline-none border-b-2 border-slate-100 dark:border-white/5 focus:border-amber-500 pb-8 transition-all tracking-tighter placeholder:text-slate-50 dark:placeholder:text-slate-900/30 italic"
                                    />
                                </div>
                                
                                <div className="flex flex-wrap items-center justify-between gap-4 mb-14">
                                    <div className="flex flex-wrap gap-3">
                                        {[100, 500, 1000, 5000].map(val => (
                                            <button 
                                                key={val}
                                                onClick={() => setAmount(val.toString())}
                                                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white hover:border-amber-500/30 transition-all"
                                            >
                                                +${val.toLocaleString()}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Balance</p>
                                        <p className={`text-sm font-mono font-bold ${parseFloat(amount) > user.balance ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                                            ${user.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-end">
                                    <div className="space-y-10">
                                        <div className="grid grid-cols-2 gap-6">
                                            {Array.from(new Set(['USD', detectedBeneficiary.currency])).map(curr => (
                                                <button 
                                                    key={curr} 
                                                    onClick={() => setSelectedCurrency(curr)}
                                                    className={`px-8 py-5 rounded-2xl text-xs font-black uppercase tracking-widest border-2 transition-all ${selectedCurrency === curr ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xl' : 'bg-transparent text-slate-400 border-slate-100 dark:border-white/10 hover:border-amber-500/30'}`}
                                                >
                                                    {curr} Settlement
                                                </button>
                                            ))}
                                        </div>
                                        <div className="relative group/note">
                                            <FileText size={16} className="absolute left-0 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/note:text-amber-500 transition-colors" />
                                            <input 
                                                value={note}
                                                onChange={(e) => setNote(e.target.value)}
                                                placeholder="TRANSFER NOTE (OPTIONAL)"
                                                className="w-full bg-transparent border-b border-slate-100 dark:border-white/5 focus:border-amber-500 outline-none text-xs font-bold text-slate-500 py-3 pl-8 uppercase tracking-widest transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* LIVE TRANSFER SUMMARY MODULE */}
                                    <div className="bg-slate-50 dark:bg-black/40 p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 text-right relative overflow-hidden group/conv shadow-inner">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover/conv:bg-emerald-500/10 transition-colors"></div>
                                        <div className="flex items-center justify-between gap-4 mb-8">
                                            <div className="flex items-center gap-3">
                                                <Activity size={14} className="text-emerald-500 animate-pulse" />
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Transfer Summary</p>
                                            </div>
                                            <span className="text-[9px] font-mono text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded uppercase">SYNC_OK</span>
                                        </div>
                                        
                                        <div className="space-y-6">
                                            <p className="text-5xl font-black text-emerald-500 tracking-tighter italic">
                                                ≈ {CURRENCY_CONFIG[selectedCurrency]?.symbol || '$'}{(parseFloat(amount || '0') * (CURRENCY_CONFIG[selectedCurrency]?.rate || 1)).toLocaleString(undefined, {minimumFractionDigits: 2})}
                                            </p>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                                                    <Navigation size={12} className="text-blue-500" /> Latency: 12ms (Direct)
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                                                    <Wifi size={12} className="text-emerald-500" /> Network: {detectedBeneficiary.network}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* FEE BREAKDOWN - 3D STRUCTURE */}
                                {amount && (
                                    <div className="mt-14 relative group/fee">
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-[3rem] blur-xl opacity-50"></div>
                                        <div className="relative p-10 bg-slate-50/80 dark:bg-[#080c16]/80 rounded-[3rem] border border-slate-200 dark:border-white/10 backdrop-blur-2xl shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)] overflow-hidden">
                                            
                                            {/* Header */}
                                            <div className="flex items-center justify-between mb-8 border-b border-slate-200 dark:border-white/5 pb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-slate-200 dark:bg-white/5 rounded-2xl text-slate-500 dark:text-slate-400">
                                                        <Terminal size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-[0.4em] italic">Transfer Details</h4>
                                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Fees & Summary</p>
                                                    </div>
                                                </div>
                                                <div className="px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[9px] font-black text-amber-500 uppercase tracking-widest italic">
                                                    Fee_Structure_v4.2
                                                </div>
                                            </div>

                                            {/* Fee Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                                                <FeeItem label="NETWORK_FEE" value={`${fees.networkFee.toFixed(2)}%`} desc="Admin Required Network Cost" />
                                            </div>

                                            {/* FEE SETTLEMENT MODULE */}
                                            <div className="mb-10 bg-slate-950 rounded-2xl p-6 border border-slate-800 shadow-inner flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.1]"></div>
                                                <div className="relative z-10 flex items-center gap-4">
                                                    <div className={`p-3 rounded-xl border ${feesSettled ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/10 border-amber-500/30 text-amber-500'}`}>
                                                        {feesSettled ? <CheckCircle size={24} /> : <AlertTriangle size={24} className="animate-pulse" />}
                                                    </div>
                                                    <div>
                                                        <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${feesSettled ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                            {feesSettled ? 'FEES PAID' : 'PAYMENT REQUIRED'}
                                                        </p>
                                                        <p className="text-xs font-mono font-bold text-slate-400 mt-1">
                                                            {feesSettled ? 'Fee payment verified' : 'Fees pending'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="relative z-10 flex items-center gap-6">
                                                    <div className="text-right">
                                                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Total Fees</p>
                                                        <p className="text-xl font-mono font-bold text-white">${totalFee.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                                    </div>
                                                    <button 
                                                        onClick={handleSettleFees}
                                                        disabled={feesSettled || isSettlingFees}
                                                        className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-3 ${
                                                            feesSettled 
                                                            ? 'bg-emerald-500/10 text-emerald-500 cursor-default border border-emerald-500/20' 
                                                            : 'bg-amber-500 text-slate-900 hover:bg-amber-400 hover:scale-105 shadow-lg shadow-amber-500/20'
                                                        }`}
                                                    >
                                                        {isSettlingFees ? <Loader2 size={14} className="animate-spin" /> : feesSettled ? <Check size={14} /> : <CreditCard size={14} />}
                                                        {isSettlingFees ? 'Processing...' : feesSettled ? 'Paid' : 'Pay Fees'}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Totals */}
                                            <div className="flex flex-col md:flex-row justify-between items-end gap-6 pt-6 border-t border-slate-200 dark:border-white/5">
                                                <div className="space-y-2 opacity-50">
                                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] italic">Total Fees</p>
                                                    <p className="text-xl font-bold text-slate-600 dark:text-slate-400 font-mono tracking-tight">
                                                        ${totalFee.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                                    </p>
                                                </div>
                                                
                                                <div className="text-right">
                                                    <div className="flex flex-col items-end">
                                                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-[0.4em] italic mb-1">Total Amount</span>
                                                        <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter italic">
                                                            ${totalDeduction.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                                        </span>
                                                        <span className="mt-3 text-[9px] font-black text-amber-500 uppercase tracking-[0.3em] bg-amber-500/10 px-3 py-1.5 rounded border border-amber-500/20 shadow-sm italic flex items-center gap-2">
                                                            <ShieldAlert size={10} /> * FEES PAID SEPARATELY
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <button 
                                    onClick={() => setStep('authorization')}
                                    disabled={!feesSettled || !amount || parseFloat(amount) <= 0 || parseFloat(amount) > user.balance || totalDeduction > user.balance}
                                    className={`w-full py-8 mt-10 font-black text-sm uppercase tracking-[0.6em] rounded-[2.5rem] transition-all shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] flex items-center justify-center gap-6 group italic ${
                                        feesSettled 
                                        ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20 cursor-pointer' 
                                        : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    {feesSettled ? 'Continue to Review' : 'Awaiting Fee Payment'}
                                    <ArrowRight size={24} className={`transition-transform duration-500 ${feesSettled ? 'group-hover:translate-x-3' : 'opacity-20'}`} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* SIDEBAR DETAILS */}
            <div className="lg:col-span-4 space-y-10">
                <div className="bg-[#020617] rounded-[3.5rem] p-10 text-white border border-white/5 relative overflow-hidden shadow-2xl group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 shadow-inner">
                                <Lock className="text-emerald-500" size={24} />
                            </div>
                            <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 italic">Security Details</h3>
                        </div>
                        <div className="space-y-12">
                            <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-inner group-hover:scale-[1.02] transition-transform duration-700">
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 italic">Available Balance</p>
                                <p className="text-4xl font-black italic tracking-tighter text-white">${user.balance.toLocaleString()}</p>
                            </div>
                            <div className="space-y-6 px-4">
                                <StatusRow icon={<ShieldCheck size={14} className="text-emerald-500" />} label="Secure Encryption" />
                                <StatusRow icon={<Cpu size={14} className="text-blue-500" />} label="Server Verified" />
                                <StatusRow icon={<Activity size={14} className="text-amber-500" />} label="Real-time Connection" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-[#0f172a] rounded-[3.5rem] p-10 border border-slate-100 dark:border-white/5 shadow-xl">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.5em] text-slate-400 mb-10 italic">Recent Recipients</h3>
                    <div className="space-y-6">
                        {Object.keys(MOCK_RECIPIENTS).map((acc, i) => {
                            const rec = MOCK_RECIPIENTS[acc];
                            return (
                                <button 
                                    key={i}
                                    onClick={() => {
                                        setSelectedRegion(rec.region);
                                        setSelectedBank(rec.bank);
                                        setAccountNumber(acc);
                                    }}
                                    className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-[2rem] hover:bg-slate-950 hover:text-white transition-all group border border-transparent hover:border-amber-500/20 shadow-sm"
                                >
                                    <div className="text-left">
                                        <p className="text-sm font-black uppercase italic group-hover:text-amber-500 transition-colors tracking-tight">{rec.name}</p>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{rec.bank}</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all group-hover:bg-amber-500 group-hover:text-slate-950 shadow-md">
                                        <ArrowRight size={18} />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>

        {/* FEE PAYMENT OVERLAY */}
        {step === 'fee_payment' && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl animate-fade-in" onClick={() => setStep('settlement')}></div>
                <div className="relative z-10 bg-white dark:bg-[#0f172a] w-full max-w-3xl rounded-[4rem] p-12 md:p-16 shadow-2xl border border-white/10 animate-slide-up text-center max-h-[90vh] overflow-y-auto scrollbar-hide">
                    <div className="mb-10">
                        <div className="inline-flex p-6 bg-blue-500/10 rounded-[2.5rem] border border-blue-500/20 mb-8">
                            <Server size={48} className="text-blue-500" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-4">Secure Clearing Gateway</h2>
                        <p className="text-slate-500 font-medium text-sm leading-relaxed italic px-4 mb-8">
                            To process your transfer via the secure network, a mandatory clearing fee of <strong className="text-amber-500">${totalFee.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong> is required. Please remit payment to our authorized clearing accounts below:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left mb-10">
                            {/* Bank Details */}
                            <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-6 border border-slate-100 dark:border-white/10">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Building size={14} className="text-blue-500" /> Bank Transfer</h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center"><span className="text-[9px] text-slate-500 uppercase">Bank</span><span className="text-xs font-bold text-slate-900 dark:text-white">{paymentConfig.bankName}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-[9px] text-slate-500 uppercase">Account Name</span><span className="text-xs font-bold text-slate-900 dark:text-white">{paymentConfig.accountName}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-[9px] text-slate-500 uppercase">Account No</span><span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{paymentConfig.accountNumber}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-[9px] text-slate-500 uppercase">Routing</span><span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{paymentConfig.routingNumber}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-[9px] text-slate-500 uppercase">SWIFT</span><span className="text-xs font-mono font-bold text-slate-900 dark:text-white">{paymentConfig.swiftCode}</span></div>
                                </div>
                            </div>

                            {/* Crypto Details */}
                            <div className="bg-slate-50 dark:bg-white/5 rounded-3xl p-6 border border-slate-100 dark:border-white/10">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Activity size={14} className="text-purple-500" /> Cryptocurrency</h4>
                                <div className="space-y-4">
                                    <div>
                                        <span className="text-[9px] text-slate-500 uppercase block mb-1">BTC Address</span>
                                        <span className="text-[10px] font-mono font-bold text-slate-900 dark:text-white break-all">{paymentConfig.btcAddress}</span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] text-slate-500 uppercase block mb-1">ETH Address</span>
                                        <span className="text-[10px] font-mono font-bold text-slate-900 dark:text-white break-all">{paymentConfig.ethAddress}</span>
                                    </div>
                                    <div>
                                        <span className="text-[9px] text-slate-500 uppercase block mb-1">USDT (TRC20)</span>
                                        <span className="text-[10px] font-mono font-bold text-slate-900 dark:text-white break-all">{paymentConfig.usdtAddress}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Other Methods */}
                            <div className="md:col-span-2 bg-slate-50 dark:bg-white/5 rounded-3xl p-6 border border-slate-100 dark:border-white/10">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2"><Smartphone size={14} className="text-emerald-500" /> Digital Wallets & Other</h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="flex justify-between items-center"><span className="text-[9px] text-slate-500 uppercase">PayPal</span><span className="text-xs font-bold text-slate-900 dark:text-white">{paymentConfig.paypalEmail}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-[9px] text-slate-500 uppercase">Zelle</span><span className="text-xs font-bold text-slate-900 dark:text-white">{paymentConfig.zelleContact}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-[9px] text-slate-500 uppercase">CashApp</span><span className="text-xs font-bold text-slate-900 dark:text-white">{paymentConfig.cashAppTag}</span></div>
                                    <div className="flex justify-between items-center"><span className="text-[9px] text-slate-500 uppercase">Gift Cards</span><span className="text-[10px] font-bold text-slate-900 dark:text-white text-right">{paymentConfig.acceptedGiftCards}</span></div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <div className="relative w-full sm:w-auto">
                                <input 
                                    type="email" 
                                    placeholder="Enter email for receipt"
                                    value={receiptEmail}
                                    onChange={(e) => setReceiptEmail(e.target.value)}
                                    className="w-full sm:w-64 px-4 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-transparent text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-amber-500 transition-all"
                                />
                            </div>
                            <div className="relative w-full sm:w-auto">
                                <input 
                                    type="file" 
                                    id="payment-proof"
                                    className="hidden"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) {
                                            setPaymentProof(e.target.files[0]);
                                        }
                                    }}
                                />
                                <label 
                                    htmlFor="payment-proof"
                                    className={`w-full sm:w-64 px-4 py-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-transparent text-xs font-bold outline-none transition-all flex items-center justify-center gap-2 cursor-pointer ${paymentProof ? 'text-emerald-500 border-emerald-500/30 bg-emerald-500/5' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-amber-500'}`}
                                >
                                    <Upload size={16} />
                                    {paymentProof ? 'Proof Uploaded' : 'Upload Payment Proof'}
                                </label>
                            </div>
                            <button 
                                onClick={() => setStep('settlement')}
                                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] border-2 border-slate-200 dark:border-white/10 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-white/20 transition-all"
                            >
                                Back
                            </button>
                            <button 
                                onClick={() => {
                                    setIsSettlingFees(true);
                                    setTimeout(() => {
                                        setFeesSettled(true);
                                        setIsSettlingFees(false);
                                        setStep('settlement');
                                    }, 1500);
                                }}
                                disabled={isSettlingFees || !receiptEmail.includes('@') || !paymentProof}
                                className={`w-full sm:w-auto px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 ${
                                    receiptEmail.includes('@') && paymentProof
                                    ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-xl shadow-amber-500/20' 
                                    : 'bg-slate-200 dark:bg-white/5 text-slate-400 cursor-not-allowed'
                                }`}
                            >
                                {isSettlingFees ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                                {isSettlingFees ? 'Verifying...' : 'Submit Verification'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* AUTH OVERLAY */}
        {step === 'authorization' && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-slate-950/98 backdrop-blur-3xl animate-fade-in" onClick={() => setStep('discovery')}></div>
                <div className="relative z-10 bg-white dark:bg-[#0f172a] w-full max-w-2xl rounded-[4rem] p-12 md:p-20 shadow-2xl border border-white/10 animate-slide-up text-center">
                    <div className="mb-14">
                        <div className="inline-flex p-6 bg-amber-500/10 rounded-[2.5rem] border border-amber-500/20 mb-10">
                            <Key size={48} className="text-amber-500" />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-6">Review Transfer</h2>
                        <p className="text-slate-500 font-medium text-lg leading-relaxed italic px-4 mb-8">
                            Enter PIN to authorize transfer of <strong className="text-slate-900 dark:text-white">${parseFloat(amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</strong> to <strong className="text-slate-900 dark:text-white">{detectedBeneficiary?.name || accountNumber}</strong>.
                        </p>
                        
                        <div className="bg-slate-50 dark:bg-white/5 rounded-2xl p-6 mb-10 text-left space-y-4 border border-slate-100 dark:border-white/10">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Amount</span>
                                <span className="font-mono font-bold text-slate-900 dark:text-white">${parseFloat(amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Fees</span>
                                <span className="font-mono font-bold text-emerald-500">PAID</span>
                            </div>
                            <div className="h-px bg-slate-200 dark:bg-white/10"></div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Total Deduction</span>
                                <span className="font-mono font-black text-amber-500">${parseFloat(amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                            </div>
                        </div>
                    </div>

                    {isFinalizing ? (
                        <div className="flex flex-col items-center py-10 space-y-12">
                             <div className="relative">
                                <div className="h-32 w-32 rounded-[3.5rem] border-[4px] border-emerald-500 border-t-transparent animate-spin"></div>
                                <ShieldCheck className="absolute inset-0 m-auto text-emerald-500 animate-pulse" size={40} />
                             </div>
                             <div className="space-y-6 w-full">
                                <p className="font-mono text-sm text-emerald-500 uppercase tracking-[0.5em] font-black italic">Processing transfer...</p>
                                <div className="w-full max-w-xs h-1.5 bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden mx-auto">
                                    <div className="h-full bg-emerald-500 transition-all duration-300" style={{width: `${progress}%`}}></div>
                                </div>
                             </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="flex justify-center gap-6 mb-10">
                                {pin.map((digit, i) => (
                                    <input
                                        key={i}
                                        ref={pinRefs[i]}
                                        type="password"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => {
                                            const newPin = [...pin];
                                            newPin[i] = e.target.value;
                                            setPin(newPin);
                                            if (e.target.value && i < 3) pinRefs[i+1].current?.focus();
                                            if (i === 3 && e.target.value) {
                                                if (newPin.join('') === '1234') handleFinalize();
                                                else { setPin(['','','','']); pinRefs[0].current?.focus(); }
                                            }
                                        }}
                                        className="w-20 h-24 rounded-[2rem] border-[3px] bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/10 text-center text-4xl font-black text-slate-950 dark:text-white focus:border-amber-500 transition-all shadow-xl outline-none"
                                    />
                                ))}
                            </div>
                            
                            <div className="flex items-center gap-4 w-full max-w-xs mb-8">
                                <div className="h-px bg-slate-200 dark:bg-white/10 flex-1"></div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">OR</span>
                                <div className="h-px bg-slate-200 dark:bg-white/10 flex-1"></div>
                            </div>

                            <button 
                                onClick={() => handleFinalize()}
                                className="flex items-center gap-4 px-8 py-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:border-amber-500 hover:bg-amber-500/5 transition-all group"
                            >
                                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl shadow-sm group-hover:text-amber-500 transition-colors">
                                    <Smartphone size={24} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Use Biometric Auth</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">Face ID / Touch ID</p>
                                </div>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};

const FeeItem = ({ label, value, desc }: { label: string, value: string, desc: string }) => (
    <div className="flex flex-col gap-1.5 p-4 bg-white dark:bg-white/[0.03] rounded-2xl border border-slate-100 dark:border-white/5 group hover:border-amber-500/20 transition-all">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        <span className="text-sm font-bold text-slate-900 dark:text-white font-mono group-hover:text-amber-500 transition-colors">{value}</span>
        <span className="text-[8px] font-bold text-slate-500 uppercase italic opacity-60">{desc}</span>
    </div>
);

const MetaDataItem = ({ label, value, icon }: { label: string, value: string, icon: React.ReactNode }) => (
    <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-slate-500 group-hover:text-amber-500 transition-colors">
            {icon}
            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
        </div>
        <p className="text-sm font-black italic uppercase text-slate-200 truncate">{value}</p>
    </div>
);

const StatusRow = ({ icon, label }: any) => (
    <div className="flex items-center gap-4">
        {icon}
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] italic">{label}</p>
    </div>
);

export default Transfer;

import React, { useState } from 'react';
import { User } from '../types';
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Shield,
  Key,
  CreditCard,
  Copy,
  Eye,
  EyeOff,
  CheckCircle,
  Smartphone,
  Globe,
  Award,
  Download,
  Bell,
  Laptop,
  LogOut,
  Fingerprint,
  ChevronRight,
  Wallet,
  Settings,
  Building2,
  Info
} from 'lucide-react';

interface AccountDetailsProps {
  user: User;
}

type Tab = 'overview' | 'personal' | 'security';

const AccountDetails: React.FC<AccountDetailsProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showSensitive, setShowSensitive] = useState(false);
  const [copied, setCopied] = useState('');

  // Mock State for toggles
  const [settings, setSettings] = useState({
      twoFactor: true,
      biometric: true,
      emailNotifs: true,
      pushNotifs: true,
      marketing: false,
      allowNewDevices: true
  });

  const [activeSessions, setActiveSessions] = useState([
      { id: '1', name: 'MacBook Pro 16', location: 'New York, USA', status: 'Active Now', isCurrent: true, icon: 'Laptop' },
      { id: '2', name: 'iPhone 14 Pro', location: 'New York, USA', status: 'Active 14m ago', isCurrent: false, icon: 'Smartphone' }
  ]);

  const handleRevokeSession = (id: string) => {
      setActiveSessions(prev => prev.filter(s => s.id !== id));
  };

  const toggleSetting = (key: keyof typeof settings) => {
      setSettings(prev => ({...prev, [key]: !prev[key]}));
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(''), 2000);
  };

  // Tier Logic (Mock)
  const defaultDaily = user.accountType === 'Wealth Management Account' ? 50000 : 5000;
  const defaultMonthly = user.accountType === 'Wealth Management Account' ? 250000 : 25000;
  
  const [dailyLimit, setDailyLimit] = useState(defaultDaily);
  const [monthlyLimit, setMonthlyLimit] = useState(defaultMonthly);
  const [isEditingLimits, setIsEditingLimits] = useState(false);
  const [tempDaily, setTempDaily] = useState(dailyLimit);
  const [tempMonthly, setTempMonthly] = useState(monthlyLimit);

  const handleSaveLimits = () => {
      setDailyLimit(tempDaily);
      setMonthlyLimit(tempMonthly);
      setIsEditingLimits(false);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-10">
      
      {/* Hero Profile Header */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900 dark:bg-black border border-slate-800 shadow-2xl">
          {/* Background Effects */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] -ml-20 -mb-20"></div>
          
          <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center md:items-end gap-8">
              <div className="relative">
                  <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/20">
                      <div className="w-full h-full rounded-full bg-slate-900 overflow-hidden border-4 border-slate-900">
                          <img 
                              src={`https://ui-avatars.com/api/?name=${user.name}&background=0f172a&color=fff&size=128`} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                          />
                      </div>
                  </div>
                  <div className="absolute bottom-1 right-1 bg-emerald-500 text-slate-900 p-1.5 rounded-full border-4 border-slate-900" title="Verified Identity">
                      <CheckCircle size={16} fill="white" className="text-emerald-500" />
                  </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold text-slate-300 mx-auto md:mx-0 w-fit">
                          <Award size={12} className="text-amber-500" /> {user.accountType === 'Wealth Management Account' ? 'Premium Portfolio' : 'Verified Client'}
                      </span>
                  </div>
                  <p className="text-slate-400 flex items-center justify-center md:justify-start gap-2 text-sm">
                      <Mail size={14} /> {user.email} • ID: {user.id.toUpperCase()}
                  </p>
              </div>

              <div className="flex gap-3">
                  <button className="px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors shadow-lg flex items-center gap-2">
                      <Download size={16} /> Download Data
                  </button>
              </div>
          </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-slate-200 dark:border-slate-800">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<Wallet size={18} />} label="Overview & Limits" />
          <TabButton active={activeTab === 'personal'} onClick={() => setActiveTab('personal')} icon={<UserIcon size={18} />} label="Personal Profile" />
          <TabButton active={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={<Shield size={18} />} label="Security & Settings" />
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              {/* Left: Banking Details */}
              <div className="lg:col-span-2 space-y-6">
                  
                  {/* Banking Details Card */}
                  <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative group">
                        {/* Decorative background header */}
                        <div className="h-24 bg-slate-900 dark:bg-slate-950 relative overflow-hidden">
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -mr-16 -mt-32"></div>
                            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -ml-16 -mb-32"></div>
                            
                            <div className="relative z-10 p-6 flex justify-between items-center h-full">
                                <div className="flex items-center gap-3">
                                    <div className="bg-amber-500 p-2 rounded-lg text-slate-900 shadow-lg shadow-amber-500/20">
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white tracking-wide">High SL Global</h3>
                                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Official Banking Details</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setShowSensitive(!showSensitive)}
                                    className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-all border border-white/10 backdrop-blur-sm"
                                >
                                    {showSensitive ? <EyeOff size={14} /> : <Eye size={14} />}
                                    {showSensitive ? 'Hide' : 'Reveal'}
                                </button>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                                {/* Beneficiary Info */}
                                <div className="space-y-6">
                                    <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                                        <h4 className="text-xs font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                                            <UserIcon size={14} /> Beneficiary Details
                                        </h4>
                                        <DetailItem label="Beneficiary Name" value={user.name} copyable onCopy={() => handleCopy(user.name, 'name')} isCopied={copied === 'name'} />
                                        <DetailItem label="Account Number" value={showSensitive ? (user.accountNumber || 'HSL-8892-1102') : `•••• •••• ${user.accountNumber?.slice(-4) || '1102'}`} copyable valueToCopy={user.accountNumber || 'HSL-8892-1102'} onCopy={() => handleCopy(user.accountNumber || 'HSL-8892-1102', 'acc')} isCopied={copied === 'acc'} monospace />
                                        <DetailItem label="Account Classification" value={user.accountType || 'Standard Account'} />
                                    </div>
                                </div>

                                {/* Bank Info */}
                                <div className="space-y-6">
                                    <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                                        <h4 className="text-xs font-bold text-blue-600 dark:text-blue-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                                            <Building2 size={14} /> Bank Details
                                        </h4>
                                        <DetailItem label="Bank Name" value="High SL Global Bank, N.A." />
                                        <DetailItem label="Routing (ABA/ACH)" value={showSensitive ? '021000021' : '•••• 0021'} copyable valueToCopy="021000021" onCopy={() => handleCopy('021000021', 'rout')} isCopied={copied === 'rout'} monospace />
                                        <DetailItem label="SWIFT / BIC" value="HSLGUS33XXX" copyable onCopy={() => handleCopy('HSLGUS33XXX', 'swift')} isCopied={copied === 'swift'} monospace />
                                        <DetailItem label="Bank Address" value="123 Financial District, New York, NY 10005, USA" className="text-xs text-slate-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
                                    <p className="flex items-start gap-2 leading-relaxed">
                                        <Info size={14} className="mt-0.5 flex-shrink-0 text-slate-400" />
                                        Use these details for domestic wire transfers and international SWIFT payments. For ACH direct deposits, use the Routing Number.
                                    </p>
                                </div>
                                <button 
                                    onClick={() => {
                                        const text = `Beneficiary: ${user.name}\nAccount: ${user.accountNumber || 'HSL-8892-1102'}\nAccount Type: ${user.accountType}\nRouting: 021000021\nSWIFT: HSLGUS33XXX\nBank: High SL Global Bank, N.A.\nAddress: 123 Financial District, New York, NY 10005, USA`;
                                        handleCopy(text, 'all');
                                    }}
                                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg whitespace-nowrap"
                                >
                                    {copied === 'all' ? <CheckCircle size={16} /> : <Copy size={16} />}
                                    {copied === 'all' ? 'Copied All' : 'Copy Full Details'}
                                </button>
                            </div>
                        </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Active Subscriptions</h3>
                      <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
                              <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600 dark:text-amber-500">
                                      <Award size={20} />
                                  </div>
                                  <div>
                                      <p className="font-bold text-slate-900 dark:text-white">High SL Premium</p>
                                      <p className="text-xs text-slate-500">Billed monthly • Next billing Dec 1st</p>
                                  </div>
                              </div>
                              <span className="font-bold text-slate-900 dark:text-white">$25.00</span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Right: Limits */}
              <div className="lg:col-span-1">
                  <div className="bg-slate-900 dark:bg-slate-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden h-full">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                      
                      <div className="relative z-10">
                          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                              <Wallet size={20} className="text-amber-500" /> Spending Limits
                          </h3>

                          <div className="space-y-8">
                              {isEditingLimits ? (
                                  <div className="space-y-4">
                                      <div>
                                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Daily Transfer Limit</label>
                                          <input 
                                              type="number" 
                                              value={tempDaily} 
                                              onChange={(e) => setTempDaily(Number(e.target.value))}
                                              className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-2 text-sm"
                                          />
                                      </div>
                                      <div>
                                          <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Monthly Volume Limit</label>
                                          <input 
                                              type="number" 
                                              value={tempMonthly} 
                                              onChange={(e) => setTempMonthly(Number(e.target.value))}
                                              className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-2 text-sm"
                                          />
                                      </div>
                                      <div className="flex gap-2 mt-4">
                                          <button onClick={handleSaveLimits} className="flex-1 py-2 bg-amber-500 text-slate-900 rounded-lg text-xs font-bold hover:bg-amber-400 transition-colors">
                                              Save Limits
                                          </button>
                                          <button onClick={() => setIsEditingLimits(false)} className="flex-1 py-2 bg-slate-700 text-white rounded-lg text-xs font-bold hover:bg-slate-600 transition-colors">
                                              Cancel
                                          </button>
                                      </div>
                                  </div>
                              ) : (
                                  <>
                                      <LimitBar label="Daily Transfer" current={1250} max={dailyLimit} color="bg-blue-500" />
                                      <LimitBar label="Monthly Volume" current={8500} max={monthlyLimit} color="bg-purple-500" />
                                      <LimitBar label="ATM Withdrawal" current={200} max={1000} color="bg-emerald-500" />
                                  </>
                              )}
                          </div>

                          {!isEditingLimits && (
                              <div className="mt-10 p-4 bg-white/5 rounded-xl border border-white/10">
                                  <p className="text-xs text-slate-400 mb-3">Need higher limits or want to restrict spending? Adjust your limits securely.</p>
                                  <button onClick={() => setIsEditingLimits(true)} className="w-full py-2 bg-white text-slate-900 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">
                                      Manage Limits
                                  </button>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* TAB CONTENT: PERSONAL */}
      {activeTab === 'personal' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm animate-fade-in">
              <div className="flex justify-between items-center mb-8 border-b border-slate-100 dark:border-slate-800 pb-6">
                  <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">Personal Information</h3>
                      <p className="text-slate-500 text-sm mt-1">Manage your identity details and contact preferences.</p>
                  </div>
                  <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                      Edit Profile
                  </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <ProfileField label="Full Legal Name" value={user.name} />
                  <ProfileField label="Current Account" value={user.accountType || 'Savings Account'} />
                  <ProfileField label="Email Address" value={user.email} />
                  <ProfileField label="Phone Number" value={user.phoneNumber || "+1 (555) 123-4567"} />
                  <ProfileField label="Date of Birth" value={user.dob || "Oct 24, 1988"} />
                  <ProfileField label="Tax ID / SSN" value={user.ssn || "***-**-4451"} />
                  <ProfileField label="Employment Status" value={user.employmentStatus || "Self-Employed"} />
                  <ProfileField label="Residential Address" value={user.residentialAddress || "123 Financial District, Suite 400, New York, NY 10005"} fullWidth />
              </div>

              <div className="mt-10 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl p-4 flex items-start gap-3">
                  <div className="mt-0.5 text-amber-600 dark:text-amber-500"><Shield size={18} /></div>
                  <div>
                      <h4 className="font-bold text-sm text-amber-900 dark:text-amber-400">KYC Verification Complete</h4>
                      <p className="text-xs text-amber-800 dark:text-amber-500/80 mt-1">
                          Your identity has been verified to standards for your {user.accountType}. You have full access to global wire transfers and high-yield investment products.
                      </p>
                  </div>
              </div>
          </div>
      )}

      {/* TAB CONTENT: SECURITY */}
      {activeTab === 'security' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
              
              {/* Left: Security Settings */}
              <div className="lg:col-span-2 space-y-6">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Authentication</h3>
                      
                      <div className="space-y-6">
                          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800">
                              <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                      <Key size={20} />
                                  </div>
                                  <div>
                                      <p className="font-bold text-slate-900 dark:text-white">Password</p>
                                      <p className="text-xs text-slate-500">Last changed 3 months ago</p>
                                  </div>
                              </div>
                              <button className="text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg">
                                  Update
                              </button>
                          </div>

                          <ToggleRow 
                              icon={<Smartphone size={20} />}
                              title="2-Factor Authentication"
                              desc="Secure your account with SMS codes."
                              checked={settings.twoFactor}
                              onChange={() => toggleSetting('twoFactor')}
                          />

                          <ToggleRow 
                              icon={<Fingerprint size={20} />}
                              title="Biometric Login"
                              desc="Use FaceID or TouchID on supported devices."
                              checked={settings.biometric}
                              onChange={() => toggleSetting('biometric')}
                          />

                          <ToggleRow 
                              icon={<Shield size={20} />}
                              title="Allow New Device Logins"
                              desc="If disabled, new devices cannot log in even with correct credentials."
                              checked={settings.allowNewDevices}
                              onChange={() => toggleSetting('allowNewDevices')}
                          />
                      </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Active Sessions</h3>
                      <div className="space-y-4">
                          {activeSessions.map(session => (
                              <DeviceRow 
                                  key={session.id}
                                  icon={session.icon === 'Laptop' ? <Laptop size={20} /> : <Smartphone size={20} />}
                                  name={session.name}
                                  location={session.location}
                                  status={session.status}
                                  isCurrent={session.isCurrent}
                                  onRevoke={() => handleRevokeSession(session.id)}
                              />
                          ))}
                          {activeSessions.length === 0 && (
                              <p className="text-sm text-slate-500 text-center py-4">No active sessions found.</p>
                          )}
                      </div>
                  </div>
              </div>

              {/* Right: Notifications */}
              <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm h-full">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                          <Bell size={20} className="text-amber-500" /> Notifications
                      </h3>
                      
                      <div className="space-y-6">
                          <ToggleRow 
                              small
                              title="Email Alerts"
                              desc="Transaction summaries & security alerts."
                              checked={settings.emailNotifs}
                              onChange={() => toggleSetting('emailNotifs')}
                          />
                          <ToggleRow 
                              small
                              title="Push Notifications"
                              desc="Real-time activity updates on mobile."
                              checked={settings.pushNotifs}
                              onChange={() => toggleSetting('pushNotifs')}
                          />
                          <ToggleRow 
                              small
                              title="Marketing & Offers"
                              desc="New product announcements."
                              checked={settings.marketing}
                              onChange={() => toggleSetting('marketing')}
                          />
                      </div>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

// --- Sub-components ---

const TabButton = ({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
            active 
            ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-lg' 
            : 'bg-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
    >
        {icon} {label}
    </button>
);

const DetailItem = ({ label, value, copyable, valueToCopy, onCopy, isCopied, monospace, className }: any) => (
    <div className={`mb-4 last:mb-0 ${className || ''}`}>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">{label}</p>
        <div className="flex items-center justify-between group/item">
            <p className={`text-sm font-bold text-slate-900 dark:text-white ${monospace ? 'font-mono tracking-wide' : ''}`}>
                {value}
            </p>
            {copyable && (
                <button 
                    onClick={onCopy}
                    className="p-1.5 text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all opacity-0 group-hover/item:opacity-100 focus:opacity-100"
                    title="Copy"
                >
                    {isCopied ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
            )}
        </div>
    </div>
);

const LimitBar = ({ label, current, max, color }: { label: string, current: number, max: number, color: string }) => (
    <div>
        <div className="flex justify-between mb-2">
            <span className="text-xs font-bold text-slate-300 uppercase">{label}</span>
            <span className="text-xs font-bold text-white">${current.toLocaleString()} / ${max.toLocaleString()}</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${(current / max) * 100}%` }}></div>
        </div>
    </div>
);

const ProfileField = ({ label, value, fullWidth }: { label: string, value: string, fullWidth?: boolean }) => (
    <div className={fullWidth ? 'md:col-span-2' : ''}>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{label}</label>
        <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white font-medium">
            {value}
        </div>
    </div>
);

const ToggleRow = ({ icon, title, desc, checked, onChange, small }: any) => (
    <div className={`flex items-center justify-between ${!small ? 'pb-6 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0' : ''}`}>
        <div className="flex items-center gap-4">
            {icon && (
                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                    {icon}
                </div>
            )}
            <div>
                <p className={`font-bold text-slate-900 dark:text-white ${small ? 'text-sm' : ''}`}>{title}</p>
                {desc && <p className="text-xs text-slate-500">{desc}</p>}
            </div>
        </div>
        <button 
            onClick={onChange}
            className={`w-12 h-6 rounded-full transition-colors relative ${checked ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-700'}`}
        >
            <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </button>
    </div>
);

const DeviceRow = ({ icon, name, location, status, isCurrent, onRevoke }: any) => (
    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
            <div className="text-slate-400">{icon}</div>
            <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    {name} {isCurrent && <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded font-bold">Current</span>}
                </p>
                <p className="text-xs text-slate-500">{location} • {status}</p>
            </div>
        </div>
        {!isCurrent && (
            <button onClick={onRevoke} className="text-slate-400 hover:text-red-500 transition-colors" title="Revoke Session">
                <LogOut size={16} />
            </button>
        )}
    </div>
);

export default AccountDetails;
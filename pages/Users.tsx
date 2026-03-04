import React, { useState, useMemo, useEffect } from 'react';
import { User, AccountType } from '../types';
import { 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ShieldAlert, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Unlock, 
  Eye, 
  RefreshCw, 
  AlertTriangle,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Activity,
  Smartphone,
  ChevronRight,
  Shield,
  FileText,
  CreditCard,
  Globe,
  Clock,
  Save,
  Edit2,
  Fingerprint,
  Download,
  X,
  Building2,
  Briefcase
} from 'lucide-react';

interface UsersPageProps {
  users: User[];
  onAddUser: (user: User) => void;
  onUpdateUser: (user: User) => void;
  initialFilter?: FilterStatus;
}

type FilterStatus = 'All' | 'Active' | 'Frozen' | 'Suspended' | 'High Risk';
type DossierTab = 'identity' | 'financial' | 'security';

const UsersPage: React.FC<UsersPageProps> = ({ users, onAddUser, onUpdateUser, initialFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterStatus>(initialFilter || 'All');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  
  // Dossier State
  const [dossierTab, setDossierTab] = useState<DossierTab>('identity');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});

  useEffect(() => {
    if (initialFilter) {
        setActiveFilter(initialFilter);
    }
  }, [initialFilter]);

  // Create User Form State
  const [newUser, setNewUser] = useState({ 
      firstName: '', 
      lastName: '', 
      email: '', 
      phoneNumber: '',
      dob: '',
      ssn: '',
      employmentStatus: 'Employed',
      residentialAddress: '',
      balance: '',
      accountType: 'Savings Account' as AccountType,
      riskScore: 'Low' as User['riskScore']
  });

  const filteredUsers = useMemo(() => {
      return users.filter(u => {
          if (u.role === 'admin') return false;
          
          const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                u.id.toLowerCase().includes(searchTerm.toLowerCase());
          
          if (!matchesSearch) return false;

          if (activeFilter === 'All') return true;
          if (activeFilter === 'High Risk') return u.riskScore === 'High' || u.riskScore === 'Critical';
          return u.status === activeFilter;
      });
  }, [users, searchTerm, activeFilter]);

  const handleOpenDossier = (user: User) => {
      setSelectedUser(user);
      setEditForm(user);
      setDossierTab('identity');
      setIsEditing(false);
  };

  const handleEditUser = (user: User) => {
      setSelectedUser(user);
      setEditForm(user);
      setDossierTab('identity');
      setIsEditing(true);
  };

  const handleSaveChanges = () => {
      if (selectedUser && editForm) {
          const updatedUser = { ...selectedUser, ...editForm } as User;
          onUpdateUser(updatedUser);
          setSelectedUser(updatedUser);
          setIsEditing(false);
      }
  };

  const handleCreateUser = (e: React.FormEvent) => {
      e.preventDefault();
      const user: User = {
          id: `u${Date.now()}`,
          name: `${newUser.firstName} ${newUser.lastName}`,
          email: newUser.email,
          phoneNumber: newUser.phoneNumber,
          dob: newUser.dob,
          ssn: newUser.ssn,
          employmentStatus: newUser.employmentStatus,
          residentialAddress: newUser.residentialAddress,
          role: 'user',
          balance: parseFloat(newUser.balance) || 0,
          accountType: newUser.accountType,
          accountNumber: `HSL-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'Active',
          riskScore: newUser.riskScore,
          kycLevel: newUser.accountType === 'Wealth Management Account' ? 3 : 1,
          joinedDate: new Date().toISOString().split('T')[0],
          lastLoginIp: 'Pending'
      };
      onAddUser(user);
      setIsAddUserOpen(false);
      setNewUser({ 
          firstName: '', lastName: '', email: '', phoneNumber: '', dob: '', ssn: '', 
          employmentStatus: 'Employed', residentialAddress: '', balance: '', 
          accountType: 'Savings Account', riskScore: 'Low' 
      });
  };

  const handleStatusChange = (status: User['status']) => {
      if (!selectedUser) return;
      const updatedUser = { ...selectedUser, status };
      onUpdateUser(updatedUser);
      setSelectedUser(updatedUser);
  };

  const handleDownloadCSV = () => {
      const headers = [
          "User ID",
          "Full Name",
          "Email Address",
          "Role",
          "Account Number",
          "Account Type",
          "Balance",
          "Status",
          "Risk Score",
          "KYC Level",
          "Joined Date",
          "Last Login IP"
      ];

      const csvRows = [
          headers.join(','),
          ...users
            .filter(u => u.role !== 'admin')
            .map(u => [
              u.id,
              `"${u.name}"`,
              u.email,
              u.role,
              `"${u.accountNumber || ''}"`,
              `"${u.accountType || ''}"`,
              u.balance.toFixed(2),
              u.status,
              u.riskScore,
              u.kycLevel,
              u.joinedDate,
              u.lastLoginIp || 'N/A'
            ].join(','))
      ];

      const csvContent = csvRows.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `hsl_users_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const getRiskColor = (score: string = 'Low') => {
      switch(score) {
          case 'Critical': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400';
          case 'High': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
          case 'Medium': return 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400';
          default: return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400';
      }
  };

  return (
    <div className="space-y-8 pb-10 animate-fade-in relative">
      
      {/* Header Area */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">User Management</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm max-w-xl">
              Monitor user base, manage access controls, and oversee risk compliance across all accounts.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadCSV}
            className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700 px-5 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Download CSV</span>
          </button>
          <button 
            onClick={() => setIsAddUserOpen(true)}
            className="flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-5 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <UserPlus size={18} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-2">
          {/* Search */}
          <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search by name, email, or ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none focus:ring-2 focus:ring-amber-500/50 text-sm font-medium text-slate-900 dark:text-white"
              />
          </div>
          
          {/* Filter Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl overflow-x-auto scrollbar-hide">
              {['All', 'Active', 'Frozen', 'Suspended', 'High Risk'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setActiveFilter(status as FilterStatus)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                        activeFilter === status 
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                    }`}
                  >
                      {status}
                  </button>
              ))}
          </div>
      </div>

      {/* User Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                      <tr>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User Profile</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type / Risk</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Balance</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Account Details</th>
                          <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredUsers.length === 0 ? (
                          <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                  No users found matching criteria.
                              </td>
                          </tr>
                      ) : (
                          filteredUsers.map((user) => (
                              <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-500 border border-slate-200 dark:border-slate-700">
                                              {user.name.charAt(0)}
                                          </div>
                                          <div>
                                              <p className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</p>
                                              <p className="text-xs text-slate-500">{user.email}</p>
                                          </div>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex flex-col items-start gap-1">
                                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700`}>
                                              {user.accountType || 'Standard'}
                                          </span>
                                          <span className={`text-[10px] font-bold flex items-center gap-1 ${getRiskColor(user.riskScore)} px-1.5 rounded`}>
                                              <ShieldAlert size={10} /> Risk: {user.riskScore}
                                          </span>
                                      </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <p className="font-mono font-bold text-slate-900 dark:text-white text-sm">
                                          ${user.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}
                                      </p>
                                      <span className={`inline-flex items-center text-[9px] font-black uppercase ${
                                          user.status === 'Active' ? 'text-emerald-500' :
                                          user.status === 'Frozen' ? 'text-blue-500' :
                                          'text-red-500'
                                      }`}>
                                          {user.status}
                                      </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                      <p className="font-mono text-xs text-slate-500">{user.accountNumber || 'Pending'}</p>
                                      <p className="text-[10px] text-slate-400">ID: {user.id}</p>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right">
                                      <div className="flex justify-end gap-2">
                                          <button 
                                            onClick={() => handleEditUser(user)}
                                            className="text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                            title="Edit User"
                                          >
                                              <Edit2 size={18} />
                                          </button>
                                          <button 
                                            onClick={() => handleOpenDossier(user)}
                                            className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                                            title="View Details"
                                          >
                                              <MoreHorizontal size={18} />
                                          </button>
                                      </div>
                                  </td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
          </div>
      </div>

      {/* Dossier Modal */}
      {selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setSelectedUser(null)}></div>
              
              <div className="relative z-10 bg-white dark:bg-slate-900 w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col md:flex-row max-h-[90vh]">
                  
                  {/* Left Sidebar Profile */}
                  <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-950 p-8 border-r border-slate-200 dark:border-slate-800 flex flex-col">
                      <div className="text-center mb-6">
                          <div className="w-24 h-24 mx-auto bg-white dark:bg-slate-900 rounded-full p-1 shadow-lg mb-4">
                              <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-3xl font-bold text-slate-400">
                                  {selectedUser.name.charAt(0)}
                              </div>
                          </div>
                          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedUser.name}</h2>
                          <p className="text-xs text-slate-500 font-mono mt-1">{selectedUser.id}</p>
                          <div className={`inline-flex mt-3 px-3 py-1 rounded-full text-xs font-bold ${getRiskColor(selectedUser.riskScore)}`}>
                              Risk Level: {selectedUser.riskScore}
                          </div>
                      </div>

                      <div className="space-y-4 flex-1">
                          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Total Balance</p>
                              <p className="text-2xl font-mono font-bold text-slate-900 dark:text-white">
                                  ${selectedUser.balance.toLocaleString()}
                              </p>
                              <p className="text-[10px] font-black uppercase text-amber-500 mt-1">{selectedUser.accountType}</p>
                          </div>
                          
                          <div className="space-y-2">
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Quick Actions</p>
                              {selectedUser.status === 'Active' ? (
                                  <button onClick={() => handleStatusChange('Frozen')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors text-sm font-bold">
                                      <Lock size={16} /> Freeze Account
                                  </button>
                              ) : (
                                  <button onClick={() => handleStatusChange('Active')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-sm font-bold">
                                      <Unlock size={16} /> Unfreeze Account
                                  </button>
                              )}
                              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors text-sm font-bold">
                                  <Mail size={16} /> Send Secure Email
                              </button>
                          </div>
                      </div>
                  </div>

                  {/* Main Content Area */}
                  <div className="flex-1 flex flex-col min-w-0">
                      
                      {/* Tabs Header */}
                      <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                           <div className="flex gap-6">
                               <button 
                                 onClick={() => setDossierTab('identity')}
                                 className={`pb-1 text-sm font-bold transition-all border-b-2 ${dossierTab === 'identity' ? 'text-slate-900 dark:text-white border-amber-500' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
                               >
                                   Identity & Verification
                               </button>
                               <button 
                                 onClick={() => setDossierTab('financial')}
                                 className={`pb-1 text-sm font-bold transition-all border-b-2 ${dossierTab === 'financial' ? 'text-slate-900 dark:text-white border-amber-500' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
                               >
                                   Financial Details
                               </button>
                               <button 
                                 onClick={() => setDossierTab('security')}
                                 className={`pb-1 text-sm font-bold transition-all border-b-2 ${dossierTab === 'security' ? 'text-slate-900 dark:text-white border-amber-500' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
                               >
                                   Security History
                               </button>
                           </div>
                           <div className="flex items-center gap-2">
                               {isEditing ? (
                                   <>
                                    <button onClick={() => setIsEditing(false)} className="p-2 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                                    <button onClick={handleSaveChanges} className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-slate-900 rounded-lg font-bold text-xs hover:bg-amber-400"><Save size={14} /> Save</button>
                                   </>
                               ) : (
                                   <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700"><Edit2 size={14} /> Edit User</button>
                               )}
                               <button onClick={() => setSelectedUser(null)} className="ml-2 p-2 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                           </div>
                      </div>

                      {/* Tab Content */}
                      <div className="flex-1 overflow-y-auto p-8">
                          {dossierTab === 'identity' && (
                              <div className="space-y-6">
                                  {/* Account Summary Section */}
                                  <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                          <CreditCard size={14} /> Account Information
                                      </h4>
                                      <div className="grid grid-cols-2 gap-4">
                                          <div>
                                              <p className="text-[10px] font-bold text-slate-400 uppercase">Account Number</p>
                                              <p className="font-mono font-bold text-slate-900 dark:text-white">{selectedUser.accountNumber}</p>
                                          </div>
                                          <div>
                                              <p className="text-[10px] font-bold text-slate-400 uppercase">Account Type</p>
                                              <p className="font-bold text-slate-900 dark:text-white">{selectedUser.accountType}</p>
                                          </div>
                                          <div className="col-span-2">
                                              <p className="text-[10px] font-bold text-slate-400 uppercase">Current Balance</p>
                                              <p className="font-mono text-xl font-bold text-emerald-500">${selectedUser.balance.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
                                          </div>
                                      </div>
                                  </div>

                                  <div className="grid grid-cols-2 gap-6">
                                      <div className="space-y-1">
                                          <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
                                      {isEditing ? (
                                          <input value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg" />
                                      ) : (
                                          <p className="text-slate-900 dark:text-white font-medium">{selectedUser.name}</p>
                                      )}
                                  </div>
                                  <div className="space-y-1">
                                      <label className="text-xs font-bold text-slate-500 uppercase">Account Type</label>
                                      {isEditing ? (
                                          <select value={editForm.accountType} onChange={e => setEditForm({...editForm, accountType: e.target.value as AccountType})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg">
                                              <option>Savings Account</option>
                                              <option>Cheque Account</option>
                                              <option>Business Account</option>
                                              <option>Wealth Management Account</option>
                                          </select>
                                      ) : (
                                          <p className="text-slate-900 dark:text-white font-medium">{selectedUser.accountType}</p>
                                      )}
                                  </div>
                                  <div className="space-y-1">
                                      <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                                      {isEditing ? (
                                          <input value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-lg" />
                                      ) : (
                                          <p className="text-slate-900 dark:text-white font-medium">{selectedUser.email}</p>
                                      )}
                                  </div>
                                  <div className="space-y-1">
                                      <label className="text-xs font-bold text-slate-500 uppercase">Join Date</label>
                                      <p className="text-slate-900 dark:text-white font-medium">{selectedUser.joinedDate}</p>
                                  </div>
                                  </div>
                                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                                      <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                          <Fingerprint size={16} className="text-blue-500" /> KYC Status
                                      </h4>
                                      <div className="flex items-center gap-4">
                                          <div className="flex-1 p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl flex items-center gap-3">
                                              <CheckCircle size={20} className="text-emerald-500" />
                                              <div>
                                                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Identity Verified</p>
                                                  <p className="text-[10px] text-emerald-600/70 dark:text-emerald-500/70">Passport on file</p>
                                              </div>
                                          </div>
                                          <div className="flex-1 p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl flex items-center gap-3">
                                              <CheckCircle size={20} className="text-emerald-500" />
                                              <div>
                                                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Address Verified</p>
                                                  <p className="text-[10px] text-emerald-600/70 dark:text-emerald-500/70">Utility Bill confirmed</p>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          )}

                          {dossierTab === 'financial' && (
                              <div className="space-y-6">
                                  <div className="grid grid-cols-2 gap-4">
                                      <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                                          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Account Number</p>
                                          <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">{selectedUser.accountNumber}</p>
                                      </div>
                                      <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                                          <p className="text-xs text-slate-500 uppercase font-bold mb-1">Routing Number</p>
                                          <p className="font-mono text-lg font-bold text-slate-900 dark:text-white">021000021</p>
                                      </div>
                                  </div>
                                  
                                  <div>
                                      <h4 className="font-bold text-slate-900 dark:text-white mb-4">Transaction Velocity</h4>
                                      <div className="space-y-4">
                                          <div>
                                              <div className="flex justify-between text-xs font-bold mb-1">
                                                  <span className="text-slate-500">Inbound Volume (30d)</span>
                                                  <span className="text-slate-900 dark:text-white">$12,450.00</span>
                                              </div>
                                              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                  <div className="w-[35%] h-full bg-blue-500 rounded-full"></div>
                                              </div>
                                          </div>
                                          <div>
                                              <div className="flex justify-between text-xs font-bold mb-1">
                                                  <span className="text-slate-500">Outbound Volume (30d)</span>
                                                  <span className="text-slate-900 dark:text-white">$4,200.00</span>
                                              </div>
                                              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full">
                                                  <div className="w-[15%] h-full bg-amber-500 rounded-full"></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          )}

                          {dossierTab === 'security' && (
                              <div className="space-y-4">
                                  {[
                                      { event: 'Successful Login', ip: '192.168.1.42', location: 'New York, US', date: 'Today, 10:42 AM', status: 'success' },
                                      { event: 'Password Changed', ip: '192.168.1.42', location: 'New York, US', date: 'Oct 24, 2023', status: 'warn' },
                                      { event: 'Failed Login Attempt', ip: '45.22.11.99', location: 'Moscow, RU', date: 'Oct 22, 2023', status: 'error' },
                                      { event: 'Device Authorized', ip: '192.168.1.55', location: 'New York, US', date: 'Sep 15, 2023', status: 'success' },
                                  ].map((log, i) => (
                                      <div key={i} className="flex items-center justify-between p-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
                                          <div className="flex items-center gap-3">
                                              <div className={`w-2 h-2 rounded-full ${
                                                  log.status === 'success' ? 'bg-emerald-500' :
                                                  log.status === 'warn' ? 'bg-amber-500' : 'bg-red-500'
                                              }`}></div>
                                              <div>
                                                  <p className="text-sm font-bold text-slate-900 dark:text-white">{log.event}</p>
                                                  <p className="text-xs text-slate-500 font-mono">{log.ip} • {log.location}</p>
                                              </div>
                                          </div>
                                          <span className="text-xs text-slate-400 font-medium">{log.date}</span>
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Add User Modal */}
      {isAddUserOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={() => setIsAddUserOpen(false)}></div>
              <div className="relative z-10 bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-xl p-8 animate-slide-up">
                  <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New User</h2>
                      <button onClick={() => setIsAddUserOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
                  </div>
                  
                  <form onSubmit={handleCreateUser} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-hide">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First Name</label>
                              <input required value={newUser.firstName} onChange={e => setNewUser({...newUser, firstName: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Last Name</label>
                              <input required value={newUser.lastName} onChange={e => setNewUser({...newUser, lastName: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" />
                          </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
                              <input required type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number</label>
                              <input required type="tel" value={newUser.phoneNumber} onChange={e => setNewUser({...newUser, phoneNumber: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" />
                          </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date of Birth</label>
                              <input required type="date" value={newUser.dob} onChange={e => setNewUser({...newUser, dob: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tax ID / SSN</label>
                              <input required type="text" value={newUser.ssn} onChange={e => setNewUser({...newUser, ssn: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" placeholder="***-**-****" />
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Residential Address</label>
                          <input required type="text" value={newUser.residentialAddress} onChange={e => setNewUser({...newUser, residentialAddress: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Employment Status</label>
                              <select 
                                value={newUser.employmentStatus} 
                                onChange={e => setNewUser({...newUser, employmentStatus: e.target.value})}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl appearance-none"
                              >
                                  <option>Employed</option>
                                  <option>Self-Employed</option>
                                  <option>Unemployed</option>
                                  <option>Retired</option>
                                  <option>Student</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Account Type</label>
                              <select 
                                value={newUser.accountType} 
                                onChange={e => setNewUser({...newUser, accountType: e.target.value as AccountType})}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl appearance-none"
                              >
                                  <option>Savings Account</option>
                                  <option>Cheque Account</option>
                                  <option>Business Account</option>
                                  <option>Wealth Management Account</option>
                              </select>
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Residential Address</label>
                          <input required type="text" value={newUser.residentialAddress} onChange={e => setNewUser({...newUser, residentialAddress: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" />
                      </div>
 
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Initial Balance</label>
                              <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                                  <input type="number" value={newUser.balance} onChange={e => setNewUser({...newUser, balance: e.target.value})} className="w-full p-3 pl-6 bg-slate-50 dark:bg-slate-800 border-none rounded-xl" />
                              </div>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Risk Rating</label>
                              <select 
                                value={newUser.riskScore} 
                                onChange={e => setNewUser({...newUser, riskScore: e.target.value as any})}
                                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl appearance-none"
                              >
                                  <option>Low</option>
                                  <option>Medium</option>
                                  <option>High</option>
                                  <option>Critical</option>
                              </select>
                          </div>
                      </div>

                      <button type="submit" className="w-full py-4 mt-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-500/20 transition-all">
                          Create Account
                      </button>
                  </form>
              </div>
          </div>
      )}

    </div>
  );
};

export default UsersPage;
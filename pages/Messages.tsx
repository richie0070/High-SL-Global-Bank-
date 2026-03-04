import React from 'react';
import { Mail, Star, Trash2, AlertCircle } from 'lucide-react';

const MESSAGES = [
    { id: 1, sender: 'High SL Security', subject: 'New Device Sign-in Detected', date: '10:42 AM', read: false, important: true },
    { id: 2, sender: 'Account Services', subject: 'Your Monthly Statement is Ready', date: 'Yesterday', read: true, important: false },
    { id: 3, sender: 'Loan Department', subject: 'Rate Update: Personal Loans', date: 'Oct 28', read: true, important: false },
];

const Messages: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Secure Inbox</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Encrypted communications from High SL Bank.</p>
            </div>
            <button className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-blue-500 transition-colors shadow-lg">
                Compose New
            </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
             <div className="divide-y divide-slate-100 dark:divide-slate-800">
                 {MESSAGES.map((msg) => (
                     <div 
                        key={msg.id} 
                        className={`p-4 md:p-5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group ${!msg.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                     >
                         <div className="flex items-center gap-4 flex-1 min-w-0">
                             <button className={`text-slate-300 hover:text-amber-400 transition-colors ${msg.important ? 'text-amber-400' : ''}`}>
                                 <Star size={18} fill={msg.important ? "currentColor" : "none"} />
                             </button>
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!msg.read ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-500 dark:bg-slate-800'}`}>
                                 <Mail size={18} />
                             </div>
                             <div className="min-w-0 flex-1">
                                 <div className="flex items-center gap-2">
                                     <p className={`text-sm truncate ${!msg.read ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>
                                         {msg.sender}
                                     </p>
                                     {!msg.read && <div className="w-2 h-2 rounded-full bg-blue-500"></div>}
                                 </div>
                                 <p className={`text-xs truncate ${!msg.read ? 'text-slate-600 dark:text-slate-400 font-medium' : 'text-slate-500'}`}>
                                     {msg.subject}
                                 </p>
                             </div>
                         </div>
                         <div className="flex items-center gap-4 pl-4">
                             <span className="text-xs font-bold text-slate-400 whitespace-nowrap">{msg.date}</span>
                             <button className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                 <Trash2 size={16} />
                             </button>
                         </div>
                     </div>
                 ))}
             </div>
             <div className="p-8 text-center mt-auto">
                 <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
                     <AlertCircle size={12} /> Messages are automatically archived after 180 days.
                 </p>
             </div>
        </div>
    </div>
  );
};

export default Messages;
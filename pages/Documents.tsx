import React from 'react';
import { FileText, Download, Filter, Calendar } from 'lucide-react';

const STATEMENTS = [
    { id: '1', date: 'Oct 31, 2023', type: 'Account Statement', size: '1.2 MB' },
    { id: '2', date: 'Sep 30, 2023', type: 'Account Statement', size: '1.1 MB' },
    { id: '3', date: 'Aug 31, 2023', type: 'Account Statement', size: '1.3 MB' },
    { id: '4', date: 'Dec 31, 2022', type: 'Year-End Tax Document', size: '2.4 MB' },
];

const Documents: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Documents & Statements</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Access and download your financial records.</p>
            </div>
            <div className="flex gap-3">
                 <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <Filter size={16} /> Filter Type
                 </button>
            </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
             <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar size={20} className="text-slate-400" /> Recent Documents
                </h3>
             </div>
             <div className="divide-y divide-slate-100 dark:divide-slate-800">
                 {STATEMENTS.map((doc) => (
                     <div key={doc.id} className="p-4 md:p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                         <div className="flex items-center gap-4">
                             <div className="w-12 h-12 bg-red-50 dark:bg-red-900/10 rounded-xl flex items-center justify-center text-red-500 border border-red-100 dark:border-red-900/20">
                                 <FileText size={24} />
                             </div>
                             <div>
                                 <p className="font-bold text-slate-900 dark:text-white text-sm md:text-base">{doc.type}</p>
                                 <p className="text-xs text-slate-500">{doc.date} • {doc.size}</p>
                             </div>
                         </div>
                         <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                             <Download size={14} /> <span className="hidden md:inline">Download PDF</span>
                         </button>
                     </div>
                 ))}
             </div>
        </div>
    </div>
  );
};

export default Documents;
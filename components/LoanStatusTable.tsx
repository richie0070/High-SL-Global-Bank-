import React from 'react';
import { Loan } from '../types';
import { Clock, CheckCircle, XCircle, FileText, ChevronRight } from 'lucide-react';

interface LoanStatusTableProps {
  loans: Loan[];
}

const LoanStatusTable: React.FC<LoanStatusTableProps> = ({ loans }) => {
  const getStatusBadge = (status: Loan['status']) => {
    switch (status) {
      case 'Approved':
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                <CheckCircle size={12} /> Approved
            </span>
        );
      case 'Rejected':
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <XCircle size={12} /> Rejected
            </span>
        );
      default:
        return (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                <Clock size={12} /> Pending Review
            </span>
        );
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left">
        <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
          <tr>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Ref ID</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Details</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Amount</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Date</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Status</th>
            <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {loans.length === 0 ? (
             <tr>
               <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                   <div className="flex flex-col items-center gap-2">
                       <FileText size={24} className="opacity-20" />
                       <p>No active loan applications found.</p>
                   </div>
               </td>
             </tr>
          ) : (
            loans.map((loan) => (
              <tr key={loan.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-bold text-slate-500">#{loan.id.toUpperCase()}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-bold text-slate-900 dark:text-white block">{loan.purpose}</span>
                    <span className="text-xs text-slate-500">Personal Lending</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900 dark:text-white">
                    ${loan.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
                    {loan.dateApplied}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(loan.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      className="loan-details-button text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      onClick={() => alert('Loan details loaded')}
                      title="Loan details loaded"
                    >
                        <ChevronRight size={18} />
                    </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LoanStatusTable;
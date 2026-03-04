
import React, { useState, useRef } from 'react';
import { 
    MessageSquare, 
    Phone, 
    Mail, 
    ChevronDown, 
    ChevronUp, 
    Search, 
    HelpCircle, 
    Upload, 
    FileText, 
    CheckCircle, 
    Copy, 
    Image as ImageIcon, 
    X,
    Send
} from 'lucide-react';

const FAQS = [
    { q: "How do I reset my transaction PIN?", a: "You can reset your PIN by navigating to Account Details > Security Settings. You will need to verify your identity via SMS OTP." },
    { q: "What are the fees for international transfers?", a: "International transfers via SWIFT incur a fee ranging from $15 to $35 depending on the destination currency and region. Domestic transfers are free for Premium members." },
    { q: "How do I freeze my card?", a: "Go to Cards, select your active card, and toggle the 'Freeze Card' switch. This will instantly block all new transactions." },
    { q: "Are my funds insured?", a: "Yes, all deposit accounts are FDIC insured up to $250,000 per depositor, for each account ownership category." },
];

const Support: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  // Payment Proof State
  const [refId, setRefId] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [emailCopied, setEmailCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          setSelectedFile(e.target.files[0]);
          setUploadSuccess(false);
      }
  };

  const handleUpload = () => {
      if (!selectedFile) return;
      setIsUploading(true);
      
      // Simulate network request
      setTimeout(() => {
          setIsUploading(false);
          setUploadSuccess(true);
          setRefId('');
          setSelectedFile(null);
          // Reset success message after 3 seconds
          setTimeout(() => setUploadSuccess(false), 5000);
      }, 2000);
  };

  const handleCopyEmail = () => {
      navigator.clipboard.writeText('highslbankingservices@gmail.com');
      setEmailCopied(true);
      setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto pb-10">
        
        {/* Header */}
        <div className="text-center py-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">How can we help you?</h1>
            <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="text" 
                    placeholder="Search for answers..." 
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-white placeholder-slate-400 transition-all"
                />
            </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center hover:border-blue-500 transition-colors group cursor-pointer">
                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <MessageSquare size={24} className="text-blue-500" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Live Chat</h3>
                <p className="text-sm text-slate-500 mb-4">Chat with our support team 24/7.</p>
                <button className="text-blue-600 font-bold text-sm hover:underline">Start Chat</button>
            </div>
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center hover:border-blue-500 transition-colors group cursor-pointer">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Phone size={24} className="text-emerald-500" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Call Us</h3>
                <p className="text-sm text-slate-500 mb-4">Speak directly to an agent.</p>
                <button className="text-emerald-600 font-bold text-sm hover:underline">+1 (800) 123-4567</button>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm text-center hover:border-blue-500 transition-colors group cursor-pointer">
                <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Mail size={24} className="text-amber-500" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-2">Email Support</h3>
                <p className="text-sm text-slate-500 mb-4">Get a response within 24 hours.</p>
                <button className="text-amber-600 font-bold text-sm hover:underline">support@highsl.com</button>
            </div>
        </div>

        {/* Payment Confirmation Center */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText size={20} className="text-amber-500" /> Payment Confirmation Center
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                    Upload proof of payment for manual review or pending international transfers.
                </p>
            </div>
            
            <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Method 1: Upload Portal */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-2">Option 1: Upload Portal</h3>
                    
                    {uploadSuccess ? (
                        <div className="h-64 flex flex-col items-center justify-center bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-100 dark:border-emerald-900/30 rounded-2xl animate-fade-in">
                            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-sm">
                                <CheckCircle size={32} />
                            </div>
                            <h4 className="font-bold text-emerald-700 dark:text-emerald-400">Submission Received</h4>
                            <p className="text-xs text-emerald-600/80 dark:text-emerald-500/80 mt-1 text-center px-4">
                                Your payment proof has been uploaded securely. <br/> Reference ID: #REQ-{Math.floor(Math.random() * 10000)}
                            </p>
                            <button 
                                onClick={() => setUploadSuccess(false)}
                                className="mt-6 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline"
                            >
                                Upload Another
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 mb-2">Transaction Ref ID (Optional)</label>
                                <input 
                                    type="text" 
                                    value={refId}
                                    onChange={(e) => setRefId(e.target.value)}
                                    placeholder="e.g. TRX-88291..."
                                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 text-sm"
                                />
                            </div>
                            
                            <div 
                                className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*,.pdf"
                                    onChange={handleFileChange}
                                />
                                {selectedFile ? (
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-3">
                                            <ImageIcon size={24} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{selectedFile.name}</p>
                                        <p className="text-xs text-slate-500 mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                                            className="mt-3 text-xs text-red-500 font-bold hover:underline flex items-center gap-1"
                                        >
                                            <X size={12} /> Remove
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl flex items-center justify-center mb-3">
                                            <Upload size={24} />
                                        </div>
                                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Click to Upload Proof</p>
                                        <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, PDF (Max 5MB)</p>
                                    </>
                                )}
                            </div>

                            <button 
                                onClick={handleUpload}
                                disabled={!selectedFile || isUploading}
                                className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isUploading ? 'Uploading...' : 'Submit Verification'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Method 2: Email Instructions */}
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-4">Option 2: Email Verification</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                            Prefer to email? Send your payment receipt directly to our verification team. Ensure your <strong>Account Number</strong> is included in the subject line.
                        </p>
                        
                        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-6 relative group">
                            <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Support Verification Email</label>
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-mono font-bold text-slate-900 dark:text-white break-all">
                                    highslbankingservices@gmail.com
                                </span>
                                <button 
                                    onClick={handleCopyEmail}
                                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-500 dark:text-slate-400"
                                    title="Copy Email"
                                >
                                    {emailCopied ? <CheckCircle size={16} className="text-emerald-500" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <a 
                        href="mailto:highslbankingservices@gmail.com?subject=Payment Proof - Account ID"
                        className="w-full py-3 bg-amber-500 text-slate-900 font-bold rounded-xl hover:bg-amber-400 transition-colors shadow-lg flex items-center justify-center gap-2"
                    >
                        <Send size={18} /> Open Email App
                    </a>
                </div>

            </div>
        </div>

        {/* FAQs */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden p-6 md:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <HelpCircle size={20} className="text-slate-400" /> Frequently Asked Questions
            </h2>
            <div className="space-y-4">
                {FAQS.map((faq, i) => (
                    <div key={i} className="border-b border-slate-100 dark:border-slate-800 last:border-0 pb-4 last:pb-0">
                        <button 
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="w-full flex items-center justify-between text-left font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                            {faq.q}
                            {openIndex === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        {openIndex === i && (
                            <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 leading-relaxed animate-fade-in">
                                {faq.a}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </div>
  );
};

export default Support;

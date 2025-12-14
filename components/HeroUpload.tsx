import React, { useRef } from 'react';
import { Upload, FileImage } from 'lucide-react';
import { ProcessingState } from '../types';

interface HeroUploadProps {
  onFileSelect: (file: File) => void;
  processingState: ProcessingState;
}

const HeroUpload: React.FC<HeroUploadProps> = ({ onFileSelect, processingState }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
        fileInputRef.current.click();
    }
  };

  const isProcessing = processingState.status === 'processing' || processingState.status === 'uploading';

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 animate-fade-in">
      <div className="mb-10 relative">
        {/* Removed circular icon as requested */}
        <h1 className="text-5xl font-bold text-emerald-950 mt-6 mb-4 font-serif drop-shadow-sm">
          مواقيت الصلاة الذكية
        </h1>
        <p className="text-xl text-emerald-900/90 max-w-lg mx-auto leading-relaxed font-medium">
          قم برفع صورة الجدول الشهري وسنقوم بتحويله إلى تقويم رقمي تفاعلي ودقيق.
        </p>
      </div>

      <div className="w-full max-w-md">
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />
        
        {/* Ornamental Border Container */}
        <div className="p-1.5 rounded-2xl bg-gradient-to-r from-amber-300 via-amber-500 to-amber-300 shadow-xl">
            <button
            onClick={handleButtonClick}
            disabled={isProcessing}
            className={`group relative w-full flex items-center justify-center gap-3 px-8 py-5 rounded-xl text-xl font-bold transition-all transform 
                ${isProcessing 
                ? 'bg-slate-100 text-slate-500 cursor-not-allowed' 
                : 'bg-emerald-900 text-amber-50 hover:bg-emerald-800'
                }`}
            >
            {isProcessing ? (
                <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>جارٍ التحليل...</span>
                </>
            ) : (
                <>
                <Upload className="w-6 h-6 text-amber-400" />
                <span>ارفع صورة الجدول</span>
                </>
            )}
            </button>
        </div>
        
        {processingState.status === 'error' && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200 shadow-sm">
            <strong>تنبيه:</strong> {processingState.message || "حدث خطأ. يرجى المحاولة مرة أخرى."}
          </div>
        )}

        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-emerald-900/70 font-semibold">
          <FileImage className="w-4 h-4" />
          <span>يدعم صور JPG, PNG بوضوح عالٍ</span>
        </div>
      </div>
    </div>
  );
};

export default HeroUpload;
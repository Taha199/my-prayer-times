import React, { useState, useEffect } from 'react';
import HeroUpload from './components/HeroUpload';
import DailyView from './components/DailyView';
import MonthlyTable from './components/MonthlyTable';
import TasbihTicker from './components/TasbihTicker';
import { PrayerDay, ProcessingState, ViewMode } from './types';
import { extractPrayerTimes } from './services/geminiService';
import { Calendar, RotateCcw, Table, Trash2, X, AlertTriangle, Star } from 'lucide-react';

function App() {
  const [data, setData] = useState<PrayerDay[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState<number>(0);
  const [processingState, setProcessingState] = useState<ProcessingState>({ status: 'idle' });
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.DAILY);
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  
  // New state for outdated detection
  const [scheduleMeta, setScheduleMeta] = useState<{ isOutdated: boolean; detectedMonth: string } | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedData = localStorage.getItem('prayerTimesData');
    const storedMeta = localStorage.getItem('prayerTimesMeta');
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (Array.isArray(parsedData) && parsedData.length > 0) {
          setData(parsedData);
          setProcessingState({ status: 'success' });
        }
      } catch (error) {
        console.error("Failed to load saved data", error);
        localStorage.removeItem('prayerTimesData');
      }
    }

    if (storedMeta) {
      try {
        setScheduleMeta(JSON.parse(storedMeta));
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Save data to localStorage whenever it updates
  useEffect(() => {
    if (data.length > 0) {
      localStorage.setItem('prayerTimesData', JSON.stringify(data));
    }
    if (scheduleMeta) {
      localStorage.setItem('prayerTimesMeta', JSON.stringify(scheduleMeta));
    }
  }, [data, scheduleMeta]);

  // Attempt to auto-select today's date based on day number
  useEffect(() => {
    if (data.length > 0 && processingState.status === 'success') {
        const today = new Date();
        const dayOfMonth = today.getDate(); // 1-31
        
        // Strategy 1: Try to match the day label number to today's date
        // e.g. Label "5 Ramadan" or "5" -> matches day 5
        const foundIndex = data.findIndex(d => {
            const num = parseInt(d.dayLabel.replace(/\D/g, '') || '0', 10);
            return num === dayOfMonth;
        });

        // Strategy 2: If no match found or index out of bounds, just assume row index corresponds to day of month
        // (Row 0 = Day 1, Row 1 = Day 2, etc.)
        if (foundIndex !== -1) {
            setCurrentDayIndex(foundIndex);
        } else {
            // Fallback: use (dayOfMonth - 1) clamped to array bounds
            const fallbackIndex = Math.min(Math.max(0, dayOfMonth - 1), data.length - 1);
            setCurrentDayIndex(fallbackIndex);
        }
    }
    // Only run this when data is first loaded successfully
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [processingState.status]); // Depend on status changing to success


  const handleFileUpload = async (file: File) => {
    setProcessingState({ status: 'processing', message: 'جاري تحليل الصورة، وقراءة التاريخ، واستخراج الأوقات...' });
    
    try {
      const result = await extractPrayerTimes(file);
      
      if (result && result.days && result.days.length > 0) {
        setData(result.days);
        setScheduleMeta(result.metadata);
        setProcessingState({ status: 'success' });
      } else {
        setProcessingState({ status: 'error', message: 'لم نتمكن من العثور على جدول صلاة في هذه الصورة.' });
      }
    } catch (err) {
      console.error(err);
      setProcessingState({ status: 'error', message: 'حدث خطأ في الاتصال بالخدمة. يرجى المحاولة مرة أخرى.' });
    }
  };

  const handleResetClick = () => {
    setIsConfirmingReset(true);
  };

  const confirmReset = () => {
    setData([]);
    setScheduleMeta(null);
    localStorage.removeItem('prayerTimesData');
    localStorage.removeItem('prayerTimesMeta');
    setProcessingState({ status: 'idle' });
    setCurrentDayIndex(0);
    setIsConfirmingReset(false);
  };

  const cancelReset = () => {
    setIsConfirmingReset(false);
  };

  const handleNextDay = () => {
    if (currentDayIndex < data.length - 1) {
      setCurrentDayIndex(prev => prev + 1);
    }
  };

  const handlePrevDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex(prev => prev - 1);
    }
  };

  // Helper to calculate the actual date for the current view based on index
  // Assuming the schedule starts from the 1st of the CURRENT month
  const getCurrentViewDate = () => {
    const now = new Date();
    // We assume row 0 is the 1st day of the current month
    // So row `i` is the `i+1` day
    const dayOfMonth = currentDayIndex + 1;
    return new Date(now.getFullYear(), now.getMonth(), dayOfMonth);
  };

  // Get current Arabic month name for display
  const currentMonthName = new Intl.DateTimeFormat('ar-EG', { month: 'long' }).format(new Date());

  return (
    <div className="min-h-screen bg-islamic-pattern text-slate-800 font-sans pb-24">
      {/* Islamic Header */}
      <header className="bg-emerald-950 shadow-md border-b-4 border-amber-500 relative z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg transform rotate-45 flex items-center justify-center shadow-lg border-2 border-amber-200">
               <div className="transform -rotate-45 text-emerald-950 font-bold text-lg">
                 <Star className="w-6 h-6 fill-current" />
               </div>
            </div>
            <div className="flex flex-col mr-2">
                <span className="text-xl font-bold text-amber-50">مواقيت صلاتي</span>
                <span className="text-xs text-emerald-400 font-light tracking-wide">رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ</span>
            </div>
          </div>
          
          {data.length > 0 && (
             isConfirmingReset ? (
               <div className="flex items-center gap-2 animate-fade-in bg-red-900/80 p-1.5 rounded-lg border border-red-700 backdrop-blur-sm">
                 <span className="text-xs font-bold text-red-100 px-1 hidden sm:inline">حذف الجدول؟</span>
                 <button 
                   onClick={confirmReset}
                   className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-xs font-bold rounded hover:bg-red-500 transition-colors shadow-sm"
                 >
                   <Trash2 className="w-3 h-3" />
                   تأكيد
                 </button>
                 <button 
                   onClick={cancelReset}
                   className="flex items-center gap-1 px-3 py-1 bg-transparent text-red-100 text-xs font-bold rounded border border-red-400/50 hover:bg-white/10 transition-colors"
                 >
                   <X className="w-3 h-3" />
                   إلغاء
                 </button>
               </div>
             ) : (
               <button 
                 onClick={handleResetClick}
                 className="flex items-center gap-2 text-sm text-emerald-100 hover:text-amber-400 transition-colors px-3 py-1.5 rounded-lg border border-emerald-800 hover:bg-emerald-900"
               >
                 <RotateCcw className="w-4 h-4" />
                 <span>جدول جديد</span>
               </button>
             )
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        
        {/* Outdated Schedule Warning Banner */}
        {data.length > 0 && scheduleMeta?.isOutdated && (
          <div className="mb-6 bg-amber-50 border-r-4 border-amber-500 rounded-lg p-4 flex items-start gap-3 animate-fade-in shadow-md">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-amber-900 text-sm">تنبيه: الجدول قديم</h3>
              <p className="text-amber-800 text-sm mt-1">
                يبدو أن الصورة تعود لشهر <strong>{scheduleMeta.detectedMonth}</strong>، بينما نحن الآن في شهر <strong>{currentMonthName}</strong>. 
              </p>
            </div>
          </div>
        )}

        {data.length === 0 ? (
          <HeroUpload onFileSelect={handleFileUpload} processingState={processingState} />
        ) : (
          <div className="animate-fade-in-up">
            
            {/* View Toggles */}
            <div className="flex justify-center mb-8">
                <div className="bg-white/80 backdrop-blur p-1.5 rounded-2xl shadow-sm border border-emerald-100 inline-flex">
                    <button 
                        onClick={() => setViewMode(ViewMode.DAILY)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === ViewMode.DAILY ? 'bg-emerald-700 text-amber-50 shadow-md ring-2 ring-emerald-700 ring-offset-2 ring-offset-white' : 'text-emerald-800 hover:bg-emerald-50'}`}
                    >
                        <Calendar className="w-4 h-4" />
                        عرض يومي
                    </button>
                    <button 
                        onClick={() => setViewMode(ViewMode.MONTHLY)}
                        className={`flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all ${viewMode === ViewMode.MONTHLY ? 'bg-emerald-700 text-amber-50 shadow-md ring-2 ring-emerald-700 ring-offset-2 ring-offset-white' : 'text-emerald-800 hover:bg-emerald-50'}`}
                    >
                        <Table className="w-4 h-4" />
                        الجدول الكامل
                    </button>
                </div>
            </div>

            {viewMode === ViewMode.DAILY ? (
              <DailyView 
                day={data[currentDayIndex]} 
                date={getCurrentViewDate()}
                onNext={handleNextDay}
                onPrev={handlePrevDay}
                hasNext={currentDayIndex < data.length - 1}
                hasPrev={currentDayIndex > 0}
                dayIndex={currentDayIndex}
              />
            ) : (
              <MonthlyTable 
                data={data} 
                onSelectDay={(idx) => {
                    setCurrentDayIndex(idx);
                    setViewMode(ViewMode.DAILY);
                }}
                currentIndex={currentDayIndex}
                monthName={currentMonthName}
              />
            )}
            
          </div>
        )}
      </main>

      <TasbihTicker />
    </div>
  );
}

export default App;
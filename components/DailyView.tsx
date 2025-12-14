import React from 'react';
import { PrayerDay } from '../types';
import { Moon, Sun, Sunrise, Sunset, Clock, ChevronRight, ChevronLeft, Calendar } from 'lucide-react';

interface DailyViewProps {
  day: PrayerDay;
  date: Date;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  dayIndex: number;
}

const DailyView: React.FC<DailyViewProps> = ({ day, date, onNext, onPrev, hasNext, hasPrev, dayIndex }) => {
  
  // Format Hijri Date
  const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long'
  }).format(date);

  // Format Gregorian Date
  const gregorianDate = new Intl.DateTimeFormat('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(date);

  const PrayerRow = ({ name, time, icon, isNext = false }: { name: string; time: string; icon: React.ReactNode; isNext?: boolean }) => (
    <div className={`relative flex items-center justify-between p-4 mb-3 transition-all group overflow-hidden
      ${isNext 
        ? 'bg-emerald-900 text-amber-50 rounded-xl shadow-lg border border-amber-500/50 transform scale-[1.02]' 
        : 'bg-white text-emerald-950 rounded-lg border border-slate-100 hover:border-amber-300 shadow-sm'
      }`}>
      
      {/* Decorative side accent for active item */}
      {isNext && <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-amber-400 to-amber-600"></div>}

      <div className="flex items-center gap-4 z-10">
        <div className={`p-2.5 rounded-full ${isNext ? 'bg-emerald-800 text-amber-400' : 'bg-emerald-50 text-emerald-700'}`}>
          {icon}
        </div>
        <span className={`text-xl font-bold ${isNext ? 'text-amber-50' : 'text-emerald-900'}`}>{name}</span>
      </div>
      <span className={`text-2xl font-mono font-bold tracking-wider z-10 ${isNext ? 'text-white' : 'text-slate-600'}`}>
        {time || "--:--"}
      </span>
    </div>
  );

  return (
    <div className="w-full max-w-lg mx-auto">
      
      {/* Mihrab / Arch Style Container */}
      <div className="bg-white rounded-t-[3rem] rounded-b-2xl shadow-xl border-t-8 border-amber-500 relative overflow-hidden">
        
        {/* Ornamental Top Header */}
        <div className="bg-emerald-50 pb-6 pt-8 px-6 text-center border-b border-amber-200">
           
           <div className="flex items-center justify-between mb-4">
             <button 
                onClick={onPrev} 
                disabled={!hasPrev}
                className={`p-2 rounded-full transition-colors ${!hasPrev ? 'text-slate-300' : 'text-emerald-700 hover:bg-emerald-200 bg-white shadow-sm'}`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              <div className="flex flex-col items-center">
                 <div className="text-xs font-serif text-amber-600 mb-1 tracking-widest">بسم الله الرحمن الرحيم</div>
                 <h2 className="text-xl font-bold text-emerald-950 mb-1">{hijriDate}</h2>
                 <div className="flex items-center gap-1.5 text-sm text-slate-500 font-medium bg-white px-3 py-0.5 rounded-full shadow-sm border border-slate-100">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    <span>{gregorianDate}</span>
                 </div>
              </div>

              <button 
                onClick={onNext} 
                disabled={!hasNext}
                className={`p-2 rounded-full transition-colors ${!hasNext ? 'text-slate-300' : 'text-emerald-700 hover:bg-emerald-200 bg-white shadow-sm'}`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
           </div>
        </div>

        {/* Decorative Divider */}
        <div className="h-2 w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEwIDAgTDIwIDEwIEwxMCAyMCBMMCAxMCBaIiBmaWxsPSIjZjU5ZTBYiBmaWxsLW9wYWNpdHk9IjAuMiIvPjwvc3ZnPg==')] opacity-50"></div>

        {/* Prayer Times List */}
        <div className="p-6 space-y-2 bg-gradient-to-b from-white to-slate-50">
          <PrayerRow name="الفجر" time={day.fajr} icon={<Moon className="w-6 h-6" />} />
          <PrayerRow name="الشروق" time={day.sunrise} icon={<Sunrise className="w-6 h-6" />} />
          <PrayerRow name="الظهر" time={day.dhuhr} icon={<Sun className="w-6 h-6" />} />
          <PrayerRow name="العصر" time={day.asr} icon={<Sun className="w-6 h-6 opacity-75" />} />
          <PrayerRow name="المغرب" time={day.maghrib} icon={<Sunset className="w-6 h-6" />} />
          <PrayerRow name="العشاء" time={day.isha} icon={<Moon className="w-6 h-6" />} />
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-900/10 rounded-full text-emerald-800 text-sm border border-emerald-900/20">
          <Clock className="w-4 h-4" />
          <span>تأكد دائمًا من تطابق الأوقات مع المساجد المحلية</span>
        </div>
      </div>
    </div>
  );
};

export default DailyView;
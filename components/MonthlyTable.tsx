import React from 'react';
import { PrayerDay } from '../types';

interface MonthlyTableProps {
  data: PrayerDay[];
  onSelectDay: (index: number) => void;
  currentIndex: number;
  monthName: string;
}

const MonthlyTable: React.FC<MonthlyTableProps> = ({ data, onSelectDay, currentIndex, monthName }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border-2 border-emerald-900 overflow-hidden flex flex-col max-h-[70vh]">
      <div className="p-4 bg-emerald-900 border-b-4 border-amber-500 flex items-center justify-between">
        <h3 className="font-bold text-amber-50 text-lg">الجدول الشهري</h3>
        <div className="px-4 py-1 bg-amber-500/20 rounded-full text-amber-100 text-sm font-bold shadow-inner border border-amber-500/50">
          شهر {monthName}
        </div>
      </div>
      <div className="overflow-auto flex-1">
        <table className="w-full text-right border-collapse">
          <thead className="bg-emerald-50 sticky top-0 z-10 text-emerald-800 text-sm shadow-sm border-b border-emerald-100">
            <tr>
              <th className="p-3 font-bold">اليوم</th>
              <th className="p-3 font-semibold text-emerald-700">الفجر</th>
              <th className="p-3 font-semibold text-amber-700">الشروق</th>
              <th className="p-3 font-semibold text-emerald-700">الظهر</th>
              <th className="p-3 font-semibold text-emerald-700">العصر</th>
              <th className="p-3 font-semibold text-emerald-700">المغرب</th>
              <th className="p-3 font-semibold text-emerald-700">العشاء</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50/50 text-emerald-900">
            {data.map((day, idx) => (
              <tr 
                key={idx} 
                onClick={() => onSelectDay(idx)}
                className={`cursor-pointer hover:bg-amber-50 transition-colors ${currentIndex === idx ? 'bg-emerald-100/60 ring-inset ring-2 ring-amber-400' : 'even:bg-slate-50/50'}`}
              >
                <td className="p-3 font-bold text-emerald-950">{day.dayLabel}</td>
                <td className="p-3 font-mono text-sm font-medium">{day.fajr}</td>
                <td className="p-3 font-mono text-sm text-slate-400">{day.sunrise}</td>
                <td className="p-3 font-mono text-sm font-medium">{day.dhuhr}</td>
                <td className="p-3 font-mono text-sm font-medium">{day.asr}</td>
                <td className="p-3 font-mono text-sm font-medium">{day.maghrib}</td>
                <td className="p-3 font-mono text-sm font-medium">{day.isha}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyTable;
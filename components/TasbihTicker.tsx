import React from 'react';

const TASBIH_PHRASES = [
  "سبحان الله",
  "الحمد لله",
  "لا إله إلا الله",
  "الله أكبر",
  "سبحان الله وبحمده",
  "سبحان الله العظيم",
  "أستغفر الله العظيم وأتوب إليه",
  "لا حول ولا قوة إلا بالله العلي العظيم",
  "اللهم صل وسلم على نبينا محمد",
  "رضيت بالله رباً وبالإسلام ديناً وبمحمد صلى الله عليه وسلم نبياً",
  "اللهم إنك عفو تحب العفو فاعف عنا",
  "ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة وقنا عذاب النار"
];

const TasbihTicker: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-emerald-950 border-t-4 border-amber-500 text-white h-14 flex items-center shadow-2xl marquee-container">
      {/* Use inline-flex to allow horizontal layout of children while respecting marquee container */}
      <div className="animate-marquee inline-flex items-center">
        {TASBIH_PHRASES.map((phrase, idx) => (
          <div key={idx} className="flex items-center">
             <span className="text-lg font-bold tracking-wide whitespace-nowrap text-amber-50">
               {phrase}
             </span>
             {/* Separator placed AFTER the text with equal margins (mx-12 = 3rem) to center it perfectly between phrases */}
             <span className="text-amber-500 text-2xl mx-12 opacity-100 drop-shadow-md">۞</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TasbihTicker;
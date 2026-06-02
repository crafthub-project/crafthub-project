import { useState } from 'react';
import { AlertTriangle, Play, Calendar, MapPin, CheckCircle, Circle, Heart, Baby } from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';

const NAVY = '#003366';
const GOLD = '#B48C00';
const GREEN = '#1F5C2E';

const dangerSigns = [
  { id: 1, sign: 'highFever',           icon: '🌡️' },
  { id: 2, sign: 'difficultyBreathing', icon: '😮' },
  { id: 3, sign: 'refusingToFeed',      icon: '🍼' },
  { id: 4, sign: 'convulsionsSeizures', icon: '⚠️' },
  { id: 5, sign: 'sunkenFontanelle',    icon: '👶' },
];

const nutritionItems = [
  { emoji: '🍼', key: 'breastMilkOnly' },
  { emoji: '💧', key: 'cleanWater'     },
  { emoji: '🥗', key: 'solidFoodsAt6Months' },
];

export default function BabyHealth() {
  const { t } = useLocale();
  const [babyAge, setBabyAge] = useState(4);
  const [ancVisits, setAncVisits] = useState([
    { id: 1, name: 'firstANCVisit',  completed: true  },
    { id: 2, name: 'secondANCVisit', completed: true  },
    { id: 3, name: 'thirdANCVisit',  completed: true  },
    { id: 4, name: 'fourthANCVisit', completed: false },
  ]);

  const toggleVisit = (id: number) =>
    setAncVisits((prev) =>
      prev.map((v) => (v.id === id ? { ...v, completed: !v.completed } : v))
    );

  const completedVisits = ancVisits.filter((v) => v.completed).length;

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('babyHealthGuide')}</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your baby's health, milestones, and clinic visits
          </p>
        </div>
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold self-start"
          style={{ backgroundColor: '#FDF4FF', color: '#A21CAF', border: '1px solid #E879F9' }}
        >
          <Heart size={14} />
          Mama Care Mode
        </div>
      </div>

      {/* Baby age + stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Age selector */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 col-span-2 lg:col-span-1">
          <p className="text-xs text-slate-500 mb-2">{t('myBabyIs')}</p>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              max={60}
              value={babyAge}
              onChange={(e) => setBabyAge(Number(e.target.value))}
              className="w-20 px-3 py-2 rounded-lg border border-slate-200 text-center text-lg font-bold text-slate-900 outline-none focus:border-slate-400 bg-slate-50"
            />
            <span className="text-sm text-slate-500">{t('monthsOld')}</span>
          </div>
        </div>

        {[
          { icon: Baby,      label: 'ANC Visits',    value: `${completedVisits}/4`,      color: NAVY,  bg: '#EEF2FF' },
          { icon: Heart,     label: 'Health Status',  value: 'Good',                      color: GREEN, bg: '#ECFDF5' },
          { icon: Calendar,  label: 'Next Visit',     value: completedVisits < 4 ? 'Due' : 'Complete', color: GOLD, bg: '#FFFBEB' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: stat.bg }}>
                <Icon size={18} style={{ color: stat.color }} />
              </div>
              <p className="text-xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          {/* Danger signs */}
          <div className="bg-white rounded-xl border-2 border-red-200 overflow-hidden">
            <div className="flex items-center gap-3 px-6 py-4 bg-red-50 border-b border-red-100">
              <AlertTriangle size={18} className="text-red-600 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-red-700 text-sm">Danger Signs — Go to Clinic Immediately</h2>
                <p className="text-xs text-red-500 mt-0.5">{t('goClinicIf')}</p>
              </div>
            </div>
            <div className="divide-y divide-red-50">
              {dangerSigns.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-red-50/40 transition-colors">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <span className="text-sm font-medium text-slate-700">{t(item.sign)}</span>
                </div>
              ))}
            </div>
            <div className="px-6 py-4 bg-red-50">
              <button
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#DC2626' }}
              >
                <MapPin size={15} />
                {t('findClinic')}
              </button>
            </div>
          </div>

          {/* Weekly health tip */}
          <div
            className="rounded-xl p-6"
            style={{ background: `linear-gradient(135deg, #FFF8EE 0%, #FFFBF0 100%)`, border: `2px solid ${GOLD}30` }}
          >
            <div className="flex items-start gap-5">
              <div className="text-5xl flex-shrink-0">👶🏾</div>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: GOLD }}>
                  Weekly Health Tip
                </p>
                <h3 className="font-bold text-slate-900 mb-2">{t('fourMonthMilestoneCheck')}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">{t('fourMonthMilestoneDetails')}</p>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: GOLD }}
                >
                  <Play size={14} />
                  {t('listenLuganda')}
                </button>
              </div>
            </div>
          </div>

          {/* Nutrition */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">{t('ageAppropriateNutrition')}</h2>
              <p className="text-xs text-slate-500 mt-0.5">For babies {babyAge} months old</p>
            </div>
            <div className="p-5 grid sm:grid-cols-3 gap-3">
              {nutritionItems.map((item) => (
                <div
                  key={item.key}
                  className="text-center p-4 rounded-xl border border-slate-100"
                  style={{ backgroundColor: '#F8FAFC' }}
                >
                  <div className="text-3xl mb-2">{item.emoji}</div>
                  <p className="text-xs font-medium text-slate-600 leading-snug">{t(item.key)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: ANC tracker */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div
              className="px-5 py-4 border-b border-slate-100 flex items-center justify-between"
            >
              <h3 className="font-semibold text-slate-900">{t('ancVisitTracker')}</h3>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: '#EEF2FF', color: NAVY }}
              >
                {completedVisits}/4
              </span>
            </div>

            {/* Progress bar */}
            <div className="px-5 pt-4 pb-2">
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${(completedVisits / 4) * 100}%`, backgroundColor: GREEN }}
                />
              </div>
            </div>

            <div className="divide-y divide-slate-50 px-2">
              {ancVisits.map((visit) => (
                <button
                  key={visit.id}
                  onClick={() => toggleVisit(visit.id)}
                  className="w-full flex items-center gap-3 px-3 py-3.5 hover:bg-slate-50/60 rounded-lg transition-colors text-left"
                >
                  {visit.completed ? (
                    <CheckCircle size={20} style={{ color: GREEN }} className="flex-shrink-0" />
                  ) : (
                    <Circle size={20} className="text-slate-300 flex-shrink-0" />
                  )}
                  <span
                    className={`text-sm font-medium ${visit.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}
                  >
                    {t(visit.name)}
                  </span>
                </button>
              ))}
            </div>

            <div className="p-4">
              <button
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: NAVY }}
              >
                <Calendar size={15} />
                {t('scheduleNext')}
              </button>
            </div>
          </div>

          {/* Support card */}
          <div
            className="rounded-xl p-5"
            style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #0F3D1E 100%)` }}
          >
            <Heart size={18} className="text-green-300 mb-3" />
            <h3 className="font-semibold text-white text-sm mb-2">You're doing great, Mama!</h3>
            <p className="text-xs text-green-200 leading-relaxed">
              Regular check-ups help your baby grow strong. CraftHub and Uganda Christian University support you every step of the way.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

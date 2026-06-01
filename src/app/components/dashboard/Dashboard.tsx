import { useNavigate } from 'react-router';
import {
  BookOpen,
  ShoppingBag,
  Star,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  BarChart3,
  Users,
  Package,
  Activity,
  ChevronRight,
  Zap,
  Store,
  Eye,
} from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import { useUser } from '../../context/UserContext';

const NAVY = '#003366';
const GOLD = '#B48C00';
const GREEN = '#1F5C2E';

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const kpiCards = [
  {
    label: 'Active Skills',
    value: '8',
    icon: BookOpen,
    trend: '+2 this week',
    trendUp: true,
    iconBg: '#EEF2FF',
    iconColor: '#4F46E5',
  },
  {
    label: 'Monthly Revenue',
    value: '45,200',
    suffix: ' UGX',
    icon: TrendingUp,
    trend: '+24% vs last month',
    trendUp: true,
    iconBg: '#FEF9E7',
    iconColor: GOLD,
  },
  {
    label: 'Orders',
    value: '12',
    icon: Package,
    trend: '+3 new orders',
    trendUp: true,
    iconBg: '#ECFDF5',
    iconColor: GREEN,
  },
  {
    label: 'Rating',
    value: '4.8',
    icon: Star,
    trend: '+0.2 this month',
    trendUp: true,
    iconBg: '#FFF7ED',
    iconColor: '#EA580C',
  },
];

const learningSkills = [
  { name: 'Bread Baking', emoji: '🍞', progress: 75, category: 'Baking', nextLesson: 'Advanced Techniques' },
  { name: 'Basket Weaving', emoji: '🧺', progress: 45, category: 'Crafts', nextLesson: 'Traditional Patterns' },
  { name: 'Soap Making', emoji: '🧼', progress: 30, category: 'Crafts', nextLesson: 'Natural Ingredients' },
  { name: 'Machine Tailoring', emoji: '🧵', progress: 60, category: 'Tailoring', nextLesson: 'Dress Patterns' },
];

const recentActivity = [
  { icon: '🎉', text: 'Completed lesson "Bread Baking Basics"', time: '2 hours ago', color: '#ECFDF5' },
  { icon: '🛒', text: 'New order: Vanilla Cake — 15,000 UGX', time: '5 hours ago', color: '#FEF9E7' },
  { icon: '⭐', text: 'Received 5-star review from Mary K.', time: 'Yesterday', color: '#FFF7ED' },
  { icon: '📦', text: 'Product listed: Handwoven Basket', time: '2 days ago', color: '#EEF2FF' },
];

const topSkills = [
  { name: 'Bread Baking', emoji: '🍞', sales: 24, revenue: '360,000', growth: '+18%', up: true },
  { name: 'Basket Weaving', emoji: '🧺', sales: 15, revenue: '225,000', growth: '+12%', up: true },
  { name: 'Soap Making', emoji: '🧼', sales: 10, revenue: '120,000', growth: '-3%', up: false },
  { name: 'Machine Tailoring', emoji: '🧵', sales: 8, revenue: '240,000', growth: '+31%', up: true },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { t } = useLocale();
  const { userProfile } = useUser();
  const userName = userProfile?.firstName || t('user') || 'Friend';
  const greeting = getTimeOfDay();

  return (
    <div className="space-y-6 max-w-screen-2xl">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #001F40 100%)` }}
      >
        <div
          className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-10"
          style={{ backgroundColor: GOLD }}
        />
        <div
          className="absolute -bottom-12 right-28 w-36 h-36 rounded-full opacity-5"
          style={{ backgroundColor: GOLD }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest mb-1.5" style={{ color: GOLD }}>
              {greeting}
            </p>
            <h1 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
              {t('helloName')
                ? t('helloName').replace('{name}', userName)
                : `Hello, ${userName}!`}
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-md">
              Your craft business is growing steadily. Keep up the great work!
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            {[
              { value: '127', label: 'Sellers' },
              { value: '342', label: 'Products' },
              { value: '89%', label: 'Satisfaction' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center bg-white/10 rounded-xl px-4 py-3 backdrop-blur-sm border border-white/10"
              >
                <p className="text-xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-300 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: card.iconBg }}
                >
                  <Icon size={19} style={{ color: card.iconColor }} />
                </div>
                <span
                  className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
                    card.trendUp
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-red-600 bg-red-50'
                  }`}
                >
                  {card.trendUp ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {card.value}
                {card.suffix && (
                  <span className="text-sm font-medium text-slate-400 ml-0.5">{card.suffix}</span>
                )}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{card.label}</p>
              <p className="text-xs mt-2 font-medium" style={{ color: card.trendUp ? GREEN : '#DC2626' }}>
                {card.trend}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Progress */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-semibold text-slate-900">Learning Progress</h2>
                <p className="text-xs text-slate-500 mt-0.5">{learningSkills.length} active skills in progress</p>
              </div>
              <button
                onClick={() => navigate('/learn')}
                className="flex items-center gap-1.5 text-sm font-medium hover:underline"
                style={{ color: NAVY }}
              >
                View all <ArrowRight size={14} />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {learningSkills.map((skill) => (
                <div key={skill.name} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-50 rounded-lg flex-shrink-0 border border-slate-100">
                    {skill.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-slate-900 text-sm">{skill.name}</p>
                        <span className="text-xs px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 font-medium hidden sm:inline">
                          {skill.category}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-600">{skill.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${skill.progress}%`,
                          backgroundColor:
                            skill.progress >= 70 ? GREEN : skill.progress >= 40 ? GOLD : NAVY,
                        }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Next: {skill.nextLesson}</p>
                  </div>
                  <button
                    onClick={() => navigate('/learn')}
                    className="flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all"
                    style={{ borderColor: NAVY, color: NAVY }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = NAVY;
                      (e.currentTarget as HTMLButtonElement).style.color = '#fff';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
                      (e.currentTarget as HTMLButtonElement).style.color = NAVY;
                    }}
                  >
                    Continue
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="font-semibold text-slate-900">Recent Activity</h2>
                <p className="text-xs text-slate-500 mt-0.5">Your latest updates</p>
              </div>
              <Activity size={16} className="text-slate-400" />
            </div>
            <div className="divide-y divide-slate-50">
              {recentActivity.map((item, index) => (
                <div key={index} className="px-6 py-3.5 flex items-center gap-3 hover:bg-slate-50/50 transition-colors">
                  <div
                    className="h-9 w-9 rounded-lg flex items-center justify-center text-base flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate">{item.text}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.time}</p>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="font-semibold text-slate-900">Quick Actions</h2>
              <p className="text-xs text-slate-500 mt-0.5">Shortcuts to key tasks</p>
            </div>
            <div className="p-4 space-y-2">
              <button
                onClick={() => navigate('/my-shop')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: NAVY }}
              >
                <Plus size={16} />
                List a Product
                <ChevronRight size={14} className="ml-auto" />
              </button>
              <button
                onClick={() => navigate('/market')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <ShoppingBag size={16} />
                Browse Market
                <ChevronRight size={14} className="ml-auto text-slate-400" />
              </button>
              <button
                onClick={() => navigate('/my-shop')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Store size={16} />
                View My Shop
                <ChevronRight size={14} className="ml-auto text-slate-400" />
              </button>
              <button
                onClick={() => navigate('/learn')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                <Zap size={16} />
                Start a Skill
                <ChevronRight size={14} className="ml-auto text-slate-400" />
              </button>
            </div>
          </div>

          {/* Community Stats */}
          <div
            className="rounded-xl p-5 text-white"
            style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #0F3D1E 100%)` }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} style={{ color: '#6EE7A0' }} />
              <h2 className="font-semibold text-sm">Community Stats</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Active Sellers', value: '127' },
                { label: 'Products Live', value: '342' },
                { label: 'Orders This Week', value: '58' },
                { label: 'UGX Generated', value: '2.1M' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/10 rounded-lg px-3 py-2.5 backdrop-blur-sm border border-white/10"
                >
                  <p className="text-lg font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-green-200 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Performance */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-slate-900 text-sm">Performance</h2>
                <p className="text-xs text-slate-500 mt-0.5">This month</p>
              </div>
              <BarChart3 size={15} className="text-slate-400" />
            </div>
            <div className="space-y-3.5">
              {[
                { label: 'Views', value: 320, max: 400, color: NAVY },
                { label: 'Sales', value: 240, max: 400, color: GOLD },
                { label: 'Repeat buyers', value: 160, max: 400, color: GREEN },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>{row.label}</span>
                    <span className="font-semibold text-slate-700">{row.value}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${(row.value / row.max) * 100}%`, backgroundColor: row.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="mt-4 flex items-center gap-1.5 text-xs font-medium hover:underline"
              style={{ color: NAVY }}
            >
              <Eye size={12} /> View full analytics
            </button>
          </div>
        </div>
      </div>

      {/* Top Performing Skills table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div>
            <h2 className="font-semibold text-slate-900">Top Performing Skills</h2>
            <p className="text-xs text-slate-500 mt-0.5">Revenue generated this month</p>
          </div>
          <button
            onClick={() => navigate('/analytics')}
            className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            View Report
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3 text-left font-semibold w-8">#</th>
                <th className="px-6 py-3 text-left font-semibold">Skill</th>
                <th className="px-6 py-3 text-right font-semibold">Sales</th>
                <th className="px-6 py-3 text-right font-semibold">Revenue (UGX)</th>
                <th className="px-6 py-3 text-right font-semibold">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topSkills.map((skill, index) => (
                <tr key={skill.name} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <span className="text-xs font-bold text-slate-400">{index + 1}</span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{skill.emoji}</span>
                      <span className="font-medium text-slate-900">{skill.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right text-slate-600 font-medium">{skill.sales}</td>
                  <td className="px-6 py-3.5 text-right font-semibold text-slate-900">{skill.revenue}</td>
                  <td className="px-6 py-3.5 text-right">
                    <span
                      className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-full ${
                        skill.up ? 'text-emerald-700 bg-emerald-50' : 'text-red-600 bg-red-50'
                      }`}
                    >
                      {skill.up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                      {skill.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

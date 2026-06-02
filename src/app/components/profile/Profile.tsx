import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  User,
  Bell,
  Globe,
  Shield,
  HelpCircle,
  LogOut,
  X,
  Award,
  Star,
  ChevronRight,
  BookOpen,
  ShoppingBag,
  DollarSign,
  CheckCircle,
  Settings,
} from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';
import { useCertificate } from '../../context/CertificateContext';
import CertificateModal from '../certificates/CertificateModal';
import type { Certificate, Badge } from '../../context/CertificateContext';

const NAVY = '#003366';
const GOLD = '#B48C00';
const GREEN = '#1F5C2E';

const BADGE_STYLES: Record<Badge['level'], { bg: string; border: string; label: string; icon: string }> = {
  bronze: { bg: '#FFF7ED', border: '#EA580C', label: 'Bronze', icon: '🥉' },
  silver: { bg: '#F8FAFC', border: '#94A3B8', label: 'Silver', icon: '🥈' },
  gold:   { bg: '#FFFBEB', border: '#EAB308', label: 'Gold',   icon: '🥇' },
};

const LANGUAGES = [
  { code: 'en'  as const, label: '🇬🇧 English'    },
  { code: 'lg'  as const, label: '🇺🇬 Luganda'    },
  { code: 'rk'  as const, label: '🇺🇬 Runyankore' },
  { code: 'ac'  as const, label: '🇺🇬 Acholi'     },
  { code: 'teo' as const, label: '🇺🇬 Ateso'      },
  { code: 'lgg' as const, label: '🇺🇬 Lugbara'    },
  { code: 'cgg' as const, label: '🇺🇬 Rukiga'     },
  { code: 'sw'  as const, label: '🇹🇿 Swahili'    },
  { code: 'ny'  as const, label: '🇺🇬 Nyoro'      },
  { code: 'nd'  as const, label: '🇿🇦 Ndebele'    },
];

const LANG_NAMES: Record<string, string> = {
  en: 'English', lg: 'Luganda', rk: 'Runyankore', ac: 'Acholi',
  teo: 'Ateso', lgg: 'Lugbara', cgg: 'Rukiga', sw: 'Swahili', ny: 'Nyoro', nd: 'Ndebele',
};

export default function Profile() {
  const { t, locale, setLocale } = useLocale();
  const { userProfile } = useUser();
  const { logout } = useAuth();
  const { certificates, badges } = useCertificate();
  const navigate = useNavigate();
  const [showLangModal, setShowLangModal] = useState(false);
  const [activeCert, setActiveCert] = useState<{ cert: Certificate; badge: Badge } | null>(null);

  const userName  = userProfile?.firstName || 'User';
  const district  = userProfile?.district  || 'Uganda';

  const handleSignOut = () => { logout(); navigate('/'); };

  const openCert = (cert: Certificate) => {
    const badge = badges.find((b) => b.skillId === cert.skillId);
    if (badge) setActiveCert({ cert, badge });
  };

  return (
    <div className="space-y-6 max-w-screen-xl">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{t('profile')}</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account, progress, and preferences</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Profile card + stats */}
        <div className="space-y-5">
          {/* Avatar + info */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 text-center">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border-4"
              style={{ backgroundColor: '#EEF4FB', borderColor: GOLD }}
            >
              👩🏾
            </div>
            <h2 className="text-xl font-bold text-slate-900">{userName}</h2>
            <p className="text-sm text-slate-500 mt-0.5">{district}</p>
            <span
              className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: '#EEF4FB', color: NAVY }}
            >
              Vocational Learner
            </span>
            <div className="mt-4">
              <button
                className="w-full py-2 rounded-lg text-sm font-semibold border-2 transition-colors hover:bg-slate-50"
                style={{ borderColor: NAVY, color: NAVY }}
              >
                <User size={14} className="inline mr-1.5" />
                {t('editProfile')}
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-semibold text-slate-900 mb-4">{t('yourProgress')}</h3>
            <div className="space-y-4">
              {[
                { icon: DollarSign,  label: t('totalEarned'), value: '45,000 UGX', color: GOLD,  bg: '#FFFBEB' },
                { icon: BookOpen,    label: t('lessonsDone'), value: `${certificates.length * 8 + 9} Lessons`, color: NAVY, bg: '#EEF2FF' },
                { icon: ShoppingBag, label: t('totalOrders'), value: '12 Orders',  color: GREEN, bg: '#ECFDF5' },
                { icon: Award,       label: 'Certificates',  value: `${certificates.length} Earned`, color: GOLD, bg: '#FFFBEB' },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: stat.bg }}
                    >
                      <Icon size={16} style={{ color: stat.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500">{stat.label}</p>
                      <p className="text-sm font-bold text-slate-900">{stat.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* UCU trust badge */}
          <div
            className="rounded-xl p-4 flex items-start gap-3"
            style={{ backgroundColor: '#F0FDF4', border: `1px solid ${GREEN}30` }}
          >
            <Shield size={18} style={{ color: GREEN }} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-slate-900">{t('supportedByUCU')}</p>
              <p className="text-xs text-slate-500 mt-1">{t('programmeFreeBacked')}</p>
            </div>
          </div>
        </div>

        {/* Right: Certificates, Badges, Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Certificates section */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award size={16} style={{ color: GOLD }} />
                <h2 className="font-semibold text-slate-900">My Certificates</h2>
                {certificates.length > 0 && (
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: '#FFFBEB', color: GOLD }}
                  >
                    {certificates.length}
                  </span>
                )}
              </div>
              <button
                onClick={() => navigate('/learn')}
                className="text-xs font-medium hover:underline"
                style={{ color: NAVY }}
              >
                Earn More →
              </button>
            </div>

            {certificates.length === 0 ? (
              <div className="p-10 text-center">
                <div className="text-4xl mb-3">🎓</div>
                <p className="font-semibold text-slate-900 mb-1">No certificates yet</p>
                <p className="text-sm text-slate-500 mb-4">Complete a skill course to earn your first certificate.</p>
                <button
                  onClick={() => navigate('/learn')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                  style={{ backgroundColor: NAVY }}
                >
                  Browse Skills
                </button>
              </div>
            ) : (
              <div className="p-4 grid sm:grid-cols-2 gap-3">
                {certificates.map((cert) => (
                  <button
                    key={cert.id}
                    onClick={() => openCert(cert)}
                    className="text-left rounded-xl border-2 p-4 transition-all hover:shadow-md group"
                    style={{ borderColor: `${GOLD}60`, backgroundColor: '#FFFDF5' }}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{cert.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-900 truncate group-hover:text-[#003366]">
                          {cert.skillName}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">{cert.completionDate}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <CheckCircle size={12} style={{ color: GREEN }} />
                          <span className="text-xs font-semibold" style={{ color: GREEN }}>
                            Certified
                          </span>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-slate-600 flex-shrink-0 mt-0.5" />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Badges section */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Star size={16} style={{ color: GOLD }} />
              <h2 className="font-semibold text-slate-900">My Badges</h2>
              {badges.length > 0 && (
                <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#EEF2FF', color: NAVY }}>
                  {badges.length}
                </span>
              )}
            </div>

            {badges.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-2">🏅</div>
                <p className="text-sm text-slate-500">Complete courses to earn skill badges</p>
              </div>
            ) : (
              <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {badges.map((badge) => {
                  const style = BADGE_STYLES[badge.level];
                  return (
                    <div
                      key={badge.id}
                      className="rounded-xl border-2 p-3 text-center transition-all hover:shadow-sm"
                      style={{ borderColor: style.border, backgroundColor: style.bg }}
                    >
                      <div className="text-3xl mb-1">{style.icon}</div>
                      <p className="text-xs font-bold text-slate-900 truncate">{badge.skillName}</p>
                      <p className="text-xs font-semibold mt-0.5 capitalize" style={{ color: style.border }}>
                        {badge.level}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <Settings size={15} className="text-slate-400" />
              <h2 className="font-semibold text-slate-900">{t('settings')}</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {[
                { icon: User,        label: t('editProfile'),     sub: 'Update your name and details',    onClick: () => {} },
                { icon: Bell,        label: t('notifications'),   sub: 'Manage alerts and reminders',      onClick: () => {} },
                {
                  icon: Globe,
                  label: t('language'),
                  sub: LANG_NAMES[locale],
                  onClick: () => setShowLangModal(true),
                },
                { icon: Shield,      label: t('privacySecurity'), sub: 'Data & account protection',        onClick: () => {} },
                { icon: HelpCircle,  label: t('helpSupport'),     sub: 'FAQs and contact support',         onClick: () => {} },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={item.onClick}
                    className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#EEF4FB' }}>
                      <Icon size={16} style={{ color: NAVY }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                    </div>
                    <ChevronRight size={15} className="text-slate-300 flex-shrink-0" />
                  </button>
                );
              })}
            </div>
            <div className="p-4">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-red-600 border-2 border-red-100 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                {t('signOut')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Language modal */}
      {showLangModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => e.target === e.currentTarget && setShowLangModal(false)}
        >
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ backgroundColor: NAVY }}
            >
              <p className="text-white font-bold">{t('chooseLanguage')}</p>
              <button
                onClick={() => setShowLangModal(false)}
                className="p-1 text-white/60 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto space-y-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setLocale(lang.code); setShowLangModal(false); }}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all"
                  style={
                    locale === lang.code
                      ? { backgroundColor: NAVY, color: '#fff' }
                      : { backgroundColor: '#F8FAFC', color: '#1E293B' }
                  }
                >
                  <span>{lang.label}</span>
                  {locale === lang.code && <CheckCircle size={16} style={{ color: GOLD }} />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certificate detail modal */}
      {activeCert && (
        <CertificateModal
          certificate={activeCert.cert}
          badge={activeCert.badge}
          onClose={() => setActiveCert(null)}
        />
      )}
    </div>
  );
}

import { useMemo, useState, useRef, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router';
import {
  BarChart3,
  BookOpen,
  CreditCard,
  FileText,
  Heart,
  Home,
  Layers,
  MessageSquare,
  Settings,
  ShoppingBag,
  ShoppingCart,
  User,
  Bell,
  Search,
  ChevronDown,
  LogOut,
  Menu,
  X,
  TrendingUp,
  Globe,
  CheckCircle,
} from 'lucide-react';
import { useLocale } from '../../context/LocaleContext';
import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';

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

const LANG_SHORT: Record<string, string> = {
  en: 'EN', lg: 'LG', rk: 'RK', ac: 'AC', teo: 'TEO', lgg: 'LGG', cgg: 'CGG', sw: 'SW', ny: 'NY', nd: 'ND',
};

const NAVY = '#003366';
const GOLD = '#B48C00';

const mainNavItems = [
  { title: 'Dashboard', path: '/dashboard', icon: Home },
  { title: 'Learn', path: '/learn', icon: BookOpen },
  { title: 'Marketplace', path: '/market', icon: ShoppingBag },
  { title: 'My Shop', path: '/my-shop', icon: ShoppingCart },
  { title: 'Baby Health', path: '/baby-health', icon: Heart },
  { title: 'Profile', path: '/profile', icon: User },
];

const insightsNavItems = [
  { title: 'Analytics', path: '/analytics', icon: BarChart3 },
  { title: 'Reports', path: '/reports', icon: FileText },
  { title: 'Messages', path: '/messages', icon: MessageSquare },
  { title: 'Team', path: '/team', icon: Layers },
  { title: 'Billing', path: '/billing', icon: CreditCard },
  { title: 'Settings', path: '/settings', icon: Settings },
];

function formatBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  return segments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
    path: `/${segments.slice(0, index + 1).join('/')}`,
  }));
}

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  userName: string;
  locale: string;
}

function Sidebar({ open, onClose, userName, locale }: SidebarProps) {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const navItemClass = (path: string) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 w-full text-left ${
      isActive(path)
        ? 'text-[#003366]'
        : 'text-slate-300 hover:text-white hover:bg-white/10'
    }`;

  const navItemStyle = (path: string): React.CSSProperties =>
    isActive(path) ? { backgroundColor: GOLD, color: NAVY } : {};

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-60 flex flex-col transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
        style={{ backgroundColor: NAVY }}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-lg flex items-center justify-center text-base font-bold flex-shrink-0 shadow-sm"
              style={{ backgroundColor: GOLD, color: NAVY }}
            >
              C
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-none tracking-wide">CraftHub</p>
              <p className="text-xs mt-0.5 leading-none" style={{ color: GOLD }}>
                Vocational Platform
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-white/60 hover:text-white p-1 rounded transition-colors"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest px-3 mb-2"
              style={{ color: GOLD }}
            >
              Main Menu
            </p>
            <ul className="space-y-0.5">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      className={navItemClass(item.path)}
                      style={navItemStyle(item.path)}
                    >
                      <Icon size={17} className="flex-shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <p
              className="text-xs font-semibold uppercase tracking-widest px-3 mb-2"
              style={{ color: GOLD }}
            >
              Insights
            </p>
            <ul className="space-y-0.5">
              {insightsNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      className={navItemClass(item.path)}
                      style={navItemStyle(item.path)}
                    >
                      <Icon size={17} className="flex-shrink-0" />
                      <span>{item.title}</span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <div className="px-4 py-4 border-t border-white/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0"
              style={{ backgroundColor: GOLD, color: NAVY }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate leading-none">{userName}</p>
              <p className="text-xs mt-0.5 truncate leading-none" style={{ color: GOLD }}>
                {locale.toUpperCase()}
              </p>
            </div>
            <TrendingUp size={14} className="text-white/30 flex-shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
}

interface HeaderProps {
  onMenuClick: () => void;
  userName: string;
  search: string;
  onSearchChange: (v: string) => void;
}

function Header({ onMenuClick, userName, search, onSearchChange }: HeaderProps) {
  const { logout } = useAuth();
  const { locale, setLocale } = useLocale();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const breadcrumbs = useMemo(() => formatBreadcrumbs(location.pathname), [location.pathname]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 lg:px-6 gap-4 flex-shrink-0 z-30 shadow-sm">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      <nav className="flex items-center gap-1.5 text-sm text-slate-500 flex-1 min-w-0 overflow-hidden">
        <NavLink to="/dashboard" className="hover:text-slate-800 transition-colors whitespace-nowrap font-medium">
          Home
        </NavLink>
        {breadcrumbs.map((crumb, index) => (
          <span key={crumb.path} className="flex items-center gap-1.5 min-w-0">
            <span className="text-slate-300 flex-shrink-0">/</span>
            <span
              className={`truncate ${
                index === breadcrumbs.length - 1
                  ? 'text-slate-900 font-semibold'
                  : 'hover:text-slate-800 cursor-pointer'
              }`}
            >
              {crumb.label}
            </span>
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="relative hidden sm:block">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            size={15}
          />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="pl-9 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-lg outline-none focus:border-slate-300 focus:bg-white transition-colors w-48 lg:w-64"
          />
        </div>

        <button
          className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span
            className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full border border-white"
            style={{ backgroundColor: GOLD }}
          />
        </button>

        {/* Language switcher */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setLangOpen((v) => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
            aria-label="Change language"
          >
            <Globe size={14} />
            <span className="font-semibold text-xs">{LANG_SHORT[locale] ?? 'EN'}</span>
            <ChevronDown size={12} className={`text-slate-400 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
          </button>
          {langOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 max-h-64 overflow-y-auto">
              <p className="px-3 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Language</p>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => { setLocale(lang.code); setLangOpen(false); }}
                  className="flex items-center justify-between w-full px-3 py-2 text-sm hover:bg-slate-50 transition-colors"
                  style={{ color: locale === lang.code ? NAVY : '#374151', fontWeight: locale === lang.code ? 600 : 400 }}
                >
                  {lang.label}
                  {locale === lang.code && <CheckCircle size={13} style={{ color: GOLD }} />}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <div
              className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
              style={{ backgroundColor: NAVY, color: '#fff' }}
            >
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline font-medium">{userName}</span>
            <ChevronDown
              size={14}
              className={`text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-xs font-semibold text-slate-900 truncate">{userName}</p>
                <p className="text-xs text-slate-500">Vocational Learner</p>
              </div>
              <NavLink
                to="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <User size={15} />
                Profile
              </NavLink>
              <NavLink
                to="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Settings size={15} />
                Settings
              </NavLink>
              <div className="border-t border-slate-100 my-1" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
              >
                <LogOut size={15} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default function AppShell() {
  const { locale } = useLocale();
  const { userProfile } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');

  const userName = userProfile?.firstName || 'User';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userName={userName}
        locale={locale}
      />

      <div className="flex flex-col flex-1 overflow-hidden lg:ml-60">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
          userName={userName}
          search={search}
          onSearchChange={setSearch}
        />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

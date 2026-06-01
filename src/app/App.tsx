import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';
import { LocaleProvider } from './context/LocaleContext';
import { CertificateProvider } from './context/CertificateContext';
import Splash from './components/onboarding/Splash';
import Login from './components/onboarding/Login';
import LanguageSelect from './components/onboarding/LanguageSelect';
import UserType from './components/onboarding/UserType';
import ProfileSetup from './components/onboarding/ProfileSetup';
import TrustBanner from './components/onboarding/TrustBanner';
import DashboardRoute from './components/routes/DashboardRoute';
import SkillsLibrary from './components/skills/SkillsLibrary';
import SkillDetail from './components/skills/SkillDetail';
import Marketplace from './components/marketplace/Marketplace';
import MyShop from './components/marketplace/MyShop';
import BabyHealth from './components/baby/BabyHealth';
import Profile from './components/profile/Profile';
import AppShell from './components/layout/AppShell';
import SectionPage from './components/pages/SectionPage';

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <LocaleProvider>
          <CertificateProvider>
          <BrowserRouter>
            <div className="size-full">
              <Routes>
                <Route path="/" element={<Splash />} />
                <Route path="/login" element={<Login />} />
                <Route path="/language" element={<LanguageSelect />} />
                <Route path="/user-type" element={<UserType />} />
                <Route path="/profile-setup" element={<ProfileSetup />} />
                <Route path="/trust" element={<TrustBanner />} />

                <Route path="/" element={<AppShell />}>
                  <Route path="dashboard" element={<DashboardRoute />} />
                  <Route path="learn" element={<SkillsLibrary />} />
                  <Route path="skill/:skillId" element={<SkillDetail />} />
                  <Route path="market" element={<Marketplace />} />
                  <Route path="my-shop" element={<MyShop />} />
                  <Route path="baby-health" element={<BabyHealth />} />
                  <Route path="profile" element={<Profile />} />
                  <Route
                    path="analytics"
                    element={
                      <SectionPage
                        title="Analytics"
                        description="Track engagement, revenue, and growth across your marketplace ecosystem."
                      >
                        <div className="grid gap-6 xl:grid-cols-3">
                          <div className="rounded-3xl bg-white p-6 shadow-sm">
                            <p className="text-sm text-slate-500">Total Transactions</p>
                            <p className="mt-4 text-3xl font-semibold text-slate-900">12.8K</p>
                          </div>
                          <div className="rounded-3xl bg-white p-6 shadow-sm">
                            <p className="text-sm text-slate-500">Active Users</p>
                            <p className="mt-4 text-3xl font-semibold text-slate-900">7.2K</p>
                          </div>
                          <div className="rounded-3xl bg-white p-6 shadow-sm">
                            <p className="text-sm text-slate-500">Revenue Growth</p>
                            <p className="mt-4 text-3xl font-semibold text-slate-900">+24%</p>
                          </div>
                        </div>
                      </SectionPage>
                    }
                  />
                  <Route
                    path="reports"
                    element={
                      <SectionPage
                        title="Reports"
                        description="Download weekly insights, payment reports, and seller performance summaries."
                      >
                        <div className="rounded-3xl bg-white p-6 shadow-sm">
                          <p className="text-sm text-slate-500">Latest report</p>
                          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-xl font-semibold text-slate-900">Marketplace Q2 Review</p>
                              <p className="mt-1 text-sm text-slate-500">Generate a PDF summary of your top categories.</p>
                            </div>
                            <button className="rounded-2xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700">
                              Download report
                            </button>
                          </div>
                        </div>
                      </SectionPage>
                    }
                  />
                  <Route
                    path="messages"
                    element={
                      <SectionPage
                        title="Messages"
                        description="View customer conversations, team updates, and notifications in one place."
                      >
                        <div className="rounded-3xl bg-white p-6 shadow-sm">
                          <p className="text-sm text-slate-500">No unread messages</p>
                          <div className="mt-6 rounded-3xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
                            Your inbox is clear. Check back later for updates.
                          </div>
                        </div>
                      </SectionPage>
                    }
                  />
                  <Route
                    path="team"
                    element={
                      <SectionPage
                        title="Team"
                        description="Manage trusted helpers, partner sellers, and support staff from a single dashboard."
                      >
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                          {[
                            { name: 'Sarah', role: 'Seller partner' },
                            { name: 'Grace', role: 'Growth lead' },
                            { name: 'Anita', role: 'Operations' },
                          ].map((member) => (
                            <div key={member.name} className="rounded-3xl bg-white p-6 shadow-sm">
                              <p className="text-sm text-slate-500">{member.role}</p>
                              <p className="mt-4 text-lg font-semibold text-slate-900">{member.name}</p>
                            </div>
                          ))}
                        </div>
                      </SectionPage>
                    }
                  />
                  <Route
                    path="billing"
                    element={
                      <SectionPage
                        title="Billing"
                        description="Review invoices, subscriptions, and payout schedules for your business."
                      >
                        <div className="rounded-3xl bg-white p-6 shadow-sm">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm text-slate-500">Next payout</p>
                              <p className="mt-2 text-3xl font-semibold text-slate-900">UGX 85,000</p>
                            </div>
                            <button className="rounded-2xl bg-slate-900 px-5 py-3 text-white transition hover:bg-slate-700">
                              Manage payout
                            </button>
                          </div>
                        </div>
                      </SectionPage>
                    }
                  />
                  <Route
                    path="settings"
                    element={
                      <SectionPage
                        title="Settings"
                        description="Adjust your workspace preferences, notifications, and account settings."
                      >
                        <div className="rounded-3xl bg-white p-6 shadow-sm">
                          <p className="text-sm text-slate-500">Your preferences are saved instantly.</p>
                          <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <button className="rounded-2xl border border-slate-200 p-4 text-left transition hover:border-slate-300">
                              <p className="font-semibold text-slate-900">Workspace appearance</p>
                              <p className="mt-2 text-sm text-slate-600">Switch between dark and light mode.</p>
                            </button>
                            <button className="rounded-2xl border border-slate-200 p-4 text-left transition hover:border-slate-300">
                              <p className="font-semibold text-slate-900">Notification preferences</p>
                              <p className="mt-2 text-sm text-slate-600">Choose which alerts you receive.</p>
                            </button>
                          </div>
                        </div>
                      </SectionPage>
                    }
                  />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </BrowserRouter>
          </CertificateProvider>
        </LocaleProvider>
      </UserProvider>
    </AuthProvider>
  );
}

import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  DollarSign,
  CheckCircle,
  Circle,
  Award,
  Play,
  FileText,
  Wrench,
  ShoppingBag,
  Star,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { useUser } from '../../context/UserContext';
import { useCertificate } from '../../context/CertificateContext';
import { SKILLS_DATABASE } from '../../utils/skillsDatabase';
import CertificateModal from '../certificates/CertificateModal';
import type { Certificate, Badge } from '../../context/CertificateContext';

const NAVY = '#003366';
const GOLD = '#B48C00';
const GREEN = '#1F5C2E';

function getBadgeLevelForSkill(skillId: number): Badge['level'] {
  if (skillId >= 37) return 'gold';
  if (skillId >= 19) return 'silver';
  return 'bronze';
}

function getDifficultyStyle(d: string) {
  if (d === 'Beginner') return { bg: '#ECFDF5', text: '#065F46', dot: '#10B981' };
  if (d === 'Intermediate') return { bg: '#FFFBEB', text: '#92400E', dot: '#F59E0B' };
  return { bg: '#FEF2F2', text: '#991B1B', dot: '#EF4444' };
}

function generateLessons(skill: { id: number; name: string; lessons: number; hasVideo: boolean; hasPDF: boolean }) {
  const titles = [
    'Introduction & Overview',
    'Tools & Materials Setup',
    'Basic Techniques',
    'Hands-on Practice',
    'Intermediate Methods',
    'Quality Standards',
    'Business Basics',
    'Pricing Your Products',
    'Finding Customers',
    'Marketing Tips',
    'Scaling Your Business',
    'Advanced Techniques',
    'Troubleshooting',
    'Final Project',
    'Assessment',
  ];
  return Array.from({ length: skill.lessons }, (_, i) => ({
    id: i + 1,
    title: titles[i % titles.length] ?? `Lesson ${i + 1}`,
    type: i % 3 === 0 && skill.hasVideo ? 'video' : skill.hasPDF ? 'pdf' : 'text',
    duration: `${Math.floor(10 + (i * 7) % 30)} min`,
  }));
}

export default function SkillDetail() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const { awardCertificate, hasCertificate, certificates, badges } = useCertificate();

  const skill = SKILLS_DATABASE.find((s) => s.id === Number(skillId));
  const lessons = useMemo(() => (skill ? generateLessons(skill) : []), [skill]);

  const [completedLessons, setCompletedLessons] = useState<Set<number>>(() => {
    try {
      const stored = localStorage.getItem(`skill_progress_${skillId}`);
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  const [activeCert, setActiveCert] = useState<{ cert: Certificate; badge: Badge } | null>(null);

  if (!skill) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Skill not found</h2>
        <button
          onClick={() => navigate('/learn')}
          className="mt-4 px-5 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundColor: NAVY }}
        >
          Back to Skills Library
        </button>
      </div>
    );
  }

  const diff = getDifficultyStyle(skill.difficulty);
  const progress = lessons.length > 0 ? Math.round((completedLessons.size / lessons.length) * 100) : 0;
  const alreadyCertified = hasCertificate(skill.id);
  const allDone = completedLessons.size === lessons.length;

  const toggleLesson = (id: number) => {
    setCompletedLessons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(`skill_progress_${skillId}`, JSON.stringify([...next]));
      return next;
    });
  };

  const handleComplete = () => {
    const userName = userProfile?.firstName || 'Learner';
    const cert = awardCertificate(skill.id, skill.name, skill.emoji, userName);
    // Build badge locally so we never read from stale async state
    const earnedBadge: Badge = {
      id: `badge-${skill.id}-${Date.now()}`,
      skillId: skill.id,
      skillName: skill.name,
      emoji: skill.emoji,
      level: getBadgeLevelForSkill(skill.id),
      earnedAt: new Date().toISOString(),
    };
    setActiveCert({ cert, badge: earnedBadge });
  };

  const showExistingCert = () => {
    const cert = certificates.find((c) => c.skillId === skill.id);
    const badgeInCtx = badges.find((b) => b.skillId === skill.id);
    if (cert && badgeInCtx) setActiveCert({ cert, badge: badgeInCtx });
  };

  return (
    <div className="max-w-screen-xl space-y-6">
      {/* Back + breadcrumb */}
      <button
        onClick={() => navigate('/learn')}
        className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Skills Library
      </button>

      {/* Hero header */}
      <div
        className="rounded-2xl p-6 lg:p-8 text-white relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #001F40 100%)` }}
      >
        <div className="absolute -top-8 -right-8 w-48 h-48 rounded-full opacity-10" style={{ backgroundColor: GOLD }} />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div
            className="h-20 w-20 rounded-2xl flex items-center justify-center text-5xl flex-shrink-0 border-2 border-white/20"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          >
            {skill.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span
                className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: diff.bg, color: diff.text }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: diff.dot }} />
                {skill.difficulty}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-white/10 text-white">
                {skill.category}
              </span>
              {alreadyCertified && (
                <span
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-semibold cursor-pointer"
                  style={{ backgroundColor: GOLD, color: '#fff' }}
                  onClick={showExistingCert}
                >
                  <Award size={12} /> Certified
                </span>
              )}
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{skill.name}</h1>
            <p className="text-slate-300 text-sm mb-4 max-w-2xl">{skill.description}</p>
            <div className="flex flex-wrap items-center gap-5 text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <BookOpen size={14} /> {skill.lessons} lessons
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {skill.timeToLearn}
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign size={14} /> {skill.startupCost} startup cost
              </span>
              <span className="flex items-center gap-1.5">
                <Star size={14} fill={GOLD} stroke={GOLD} /> 4.{5 + (skill.id % 5)} rating
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center gap-2">
            <div
              className="relative h-20 w-20 rounded-full flex items-center justify-center"
              style={{ background: `conic-gradient(${GOLD} ${progress * 3.6}deg, rgba(255,255,255,0.15) 0deg)` }}
            >
              <div className="h-14 w-14 rounded-full bg-[#001F40] flex items-center justify-center flex-col">
                <span className="text-lg font-bold text-white">{progress}%</span>
              </div>
            </div>
            <p className="text-xs text-slate-300">Progress</p>
          </div>
        </div>
      </div>

      {/* Main content 2-col */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Lessons list */}
        <div className="lg:col-span-2 space-y-4">
          {/* Progress bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="font-semibold text-slate-900">Course Lessons</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {completedLessons.size} of {lessons.length} completed
                </p>
              </div>
              {allDone && !alreadyCertified && (
                <button
                  onClick={handleComplete}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: GREEN }}
                >
                  <Award size={15} />
                  Claim Certificate
                </button>
              )}
              {alreadyCertified && (
                <button
                  onClick={showExistingCert}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
                  style={{ backgroundColor: GOLD }}
                >
                  <Award size={15} />
                  View Certificate
                </button>
              )}
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${progress}%`,
                  backgroundColor: progress === 100 ? GREEN : NAVY,
                }}
              />
            </div>
          </div>

          {/* Lesson list */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-50">
              {lessons.map((lesson) => {
                const done = completedLessons.has(lesson.id);
                return (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors cursor-pointer"
                    onClick={() => toggleLesson(lesson.id)}
                  >
                    <button
                      className="flex-shrink-0 transition-transform hover:scale-110"
                      onClick={(e) => { e.stopPropagation(); toggleLesson(lesson.id); }}
                      aria-label={done ? 'Mark incomplete' : 'Mark complete'}
                    >
                      {done ? (
                        <CheckCircle size={22} style={{ color: GREEN }} fill={GREEN} />
                      ) : (
                        <Circle size={22} className="text-slate-300" />
                      )}
                    </button>
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: done ? '#ECFDF5' : '#EEF2FF' }}
                    >
                      {lesson.type === 'video' ? (
                        <Play size={14} style={{ color: done ? GREEN : '#4F46E5' }} />
                      ) : (
                        <FileText size={14} style={{ color: done ? GREEN : '#4F46E5' }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium truncate ${done ? 'line-through text-slate-400' : 'text-slate-900'}`}
                      >
                        Lesson {lesson.id}: {lesson.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                        <Clock size={11} /> {lesson.duration}
                        <span className="mx-1">·</span>
                        <span className="capitalize">{lesson.type}</span>
                      </p>
                    </div>
                    <span
                      className="text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                      style={
                        done
                          ? { backgroundColor: '#ECFDF5', color: '#065F46' }
                          : { backgroundColor: '#F1F5F9', color: '#64748B' }
                      }
                    >
                      {done ? 'Done' : `${lesson.duration}`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Complete button below list when all done */}
          {allDone && !alreadyCertified && (
            <div
              className="rounded-2xl p-6 text-center border-2"
              style={{ borderColor: GREEN, backgroundColor: '#F0FDF4' }}
            >
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="font-bold text-slate-900 mb-1">You've completed all lessons!</h3>
              <p className="text-sm text-slate-500 mb-4">
                Claim your certificate and badge to prove your expertise.
              </p>
              <button
                onClick={handleComplete}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white mx-auto transition-opacity hover:opacity-90"
                style={{ backgroundColor: GREEN }}
              >
                <Award size={16} />
                Claim Certificate & Badge
              </button>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-5">
          {/* Quick start */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="font-semibold text-slate-900">Quick Start</h3>
            </div>
            <div className="p-4 space-y-2.5">
              <button
                onClick={() => toggleLesson(1)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold text-white transition-opacity hover:opacity-90"
                style={{ backgroundColor: NAVY }}
              >
                <Zap size={15} />
                Start First Lesson
                <ChevronRight size={14} className="ml-auto" />
              </button>
              {alreadyCertified && (
                <button
                  onClick={showExistingCert}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold border-2 transition-colors hover:bg-slate-50"
                  style={{ borderColor: GOLD, color: GOLD }}
                >
                  <Award size={15} />
                  View My Certificate
                  <ChevronRight size={14} className="ml-auto" />
                </button>
              )}
            </div>
          </div>

          {/* Skill info */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 className="font-semibold text-slate-900">Skill Details</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Difficulty', value: skill.difficulty, color: diff.text, bg: diff.bg },
                { label: 'Startup Cost', value: skill.startupCost, color: GOLD, bg: '#FFFBEB' },
                { label: 'Income Level', value: skill.incomeLevel, color: GREEN, bg: '#ECFDF5' },
                { label: 'Duration', value: skill.timeToLearn, color: NAVY, bg: '#EEF2FF' },
              ].map((item) => (
                <div key={item.label} className="rounded-lg p-3" style={{ backgroundColor: item.bg }}>
                  <p className="text-xs text-slate-500 mb-0.5">{item.label}</p>
                  <p className="text-sm font-bold" style={{ color: item.color }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <Wrench size={15} style={{ color: NAVY }} />
              <h3 className="font-semibold text-slate-900 text-sm">Tools You'll Need</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skill.tools.map((tool) => (
                <span
                  key={tool}
                  className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-600"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Materials */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShoppingBag size={15} style={{ color: GREEN }} />
              <h3 className="font-semibold text-slate-900 text-sm">Materials</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {skill.materials.map((m) => (
                <span
                  key={m}
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ backgroundColor: '#ECFDF5', color: '#065F46' }}
                >
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* What you earn */}
          <div
            className="rounded-xl p-5 text-white"
            style={{ background: `linear-gradient(135deg, ${GREEN} 0%, #0F3D1E 100%)` }}
          >
            <h3 className="font-semibold text-sm mb-3">After Completion</h3>
            <div className="space-y-2 text-sm text-green-100">
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-300 flex-shrink-0" />
                Digital certificate of completion
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-300 flex-shrink-0" />
                Skill badge for your profile
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-300 flex-shrink-0" />
                List your products in the Marketplace
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={14} className="text-green-300 flex-shrink-0" />
                {skill.incomeLevel} income potential
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate modal */}
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

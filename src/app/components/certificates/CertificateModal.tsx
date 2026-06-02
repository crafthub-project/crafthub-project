import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { X, Download, Award, Star, CheckCircle } from 'lucide-react';
import type { Certificate, Badge } from '../../context/CertificateContext';

const NAVY = '#003366';
const GOLD = '#B48C00';
const GREEN = '#1F5C2E';

const BADGE_STYLES: Record<Badge['level'], { bg: string; border: string; label: string; icon: string }> = {
  bronze: { bg: '#FFF7ED', border: '#EA580C', label: 'Bronze', icon: '🥉' },
  silver: { bg: '#F8FAFC', border: '#94A3B8', label: 'Silver', icon: '🥈' },
  gold: { bg: '#FFFBEB', border: '#EAB308', label: 'Gold', icon: '🥇' },
};

interface CertificateModalProps {
  certificate: Certificate;
  badge: Badge;
  onClose: () => void;
}

export default function CertificateModal({ certificate, badge, onClose }: CertificateModalProps) {
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 3000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: [GOLD, NAVY, GREEN, '#ffffff'],
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: [GOLD, NAVY, GREEN, '#ffffff'],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  const badgeStyle = BADGE_STYLES[badge.level];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ background: `linear-gradient(135deg, ${NAVY} 0%, #001F40 100%)` }}
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl" style={{ backgroundColor: GOLD }}>
              {certificate.emoji}
            </div>
            <div>
              <p className="text-white font-bold text-sm">Course Completed!</p>
              <p className="text-xs" style={{ color: GOLD }}>CraftHub Vocational Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Certificate area */}
        <div className="p-6 lg:p-8">
          {/* Certificate card */}
          <div
            className="rounded-2xl p-8 mb-6 text-center relative overflow-hidden border-2"
            style={{ borderColor: GOLD, background: 'linear-gradient(135deg, #FFFDF5 0%, #FFF9E6 100%)' }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: GOLD }} />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: NAVY }} />

            <div className="relative z-10">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Award size={20} style={{ color: GOLD }} />
                <p className="text-xs font-bold uppercase tracking-widest" style={{ color: GOLD }}>
                  Certificate of Completion
                </p>
                <Award size={20} style={{ color: GOLD }} />
              </div>

              <p className="text-sm text-slate-500 mb-2">This certifies that</p>
              <h2
                className="text-3xl font-bold mb-2"
                style={{ color: NAVY, fontFamily: 'Georgia, serif' }}
              >
                {certificate.userName}
              </h2>
              <p className="text-sm text-slate-500 mb-3">has successfully completed</p>

              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-4xl">{certificate.emoji}</span>
                <h3 className="text-2xl font-bold" style={{ color: NAVY }}>
                  {certificate.skillName}
                </h3>
              </div>

              <p className="text-xs text-slate-400 mb-6">
                Completed on {certificate.completionDate}
              </p>

              <div className="flex items-center justify-center gap-3">
                <div className="h-px flex-1" style={{ backgroundColor: GOLD, opacity: 0.4 }} />
                <CheckCircle size={20} style={{ color: GREEN }} />
                <div className="h-px flex-1" style={{ backgroundColor: GOLD, opacity: 0.4 }} />
              </div>

              <p className="text-xs mt-3 font-semibold" style={{ color: NAVY }}>
                CraftHub Vocational Platform · Uganda
              </p>
            </div>
          </div>

          {/* Badge section */}
          <div
            className="flex items-center gap-4 rounded-xl p-4 mb-6 border-2"
            style={{ backgroundColor: badgeStyle.bg, borderColor: badgeStyle.border }}
          >
            <div className="text-4xl">{badgeStyle.icon}</div>
            <div className="flex-1">
              <p className="font-bold text-sm text-slate-900">{badgeStyle.label} Badge Earned!</p>
              <p className="text-xs text-slate-500 mt-0.5">
                {certificate.skillName} — Level {badge.level.charAt(0).toUpperCase() + badge.level.slice(1)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((i) => (
                <Star
                  key={i}
                  size={16}
                  fill={badge.level === 'gold' ? GOLD : badge.level === 'silver' && i <= 2 ? '#94A3B8' : i <= 1 ? '#EA580C' : 'none'}
                  stroke={GOLD}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: NAVY }}
            >
              <Download size={16} />
              Download Certificate
            </button>
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-2 transition-colors hover:bg-slate-50"
              style={{ borderColor: NAVY, color: NAVY }}
            >
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

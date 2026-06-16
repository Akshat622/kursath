import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Smartphone, Network } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ExamCalendar from '../components/ExamCalendar';

export default function Home() {
  const { t } = useLanguage();

  const stats = [
    { value: '12,000+', label: t('home.stats.supported') },
    { value: '20+', label: t('home.stats.cities') },
    { value: '180+', label: t('home.stats.schemes') },
    { value: '350+', label: t('home.stats.mentors') }
  ];

  const pillars = [
    {
      title: t('home.pillars.verified.title'),
      desc: t('home.pillars.verified.desc'),
      icon: ShieldCheck
    },
    {
      title: t('home.pillars.lastmile.title'),
      desc: t('home.pillars.lastmile.desc'),
      icon: Smartphone
    },
    {
      title: t('home.pillars.community.title'),
      desc: t('home.pillars.community.desc'),
      icon: Network
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0a2540] via-[#0d3b60] to-[#0a2540] text-white py-28 px-4 sm:px-6 lg:px-8 animate-gradient-flow">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        {/* Ambient light effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none"></div>

        <div className="relative max-w-4xl mx-auto text-center space-y-8 animate-fadeIn">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs sm:text-sm font-semibold text-brand-gold backdrop-blur-md animate-float">
            <span className="flex h-2 w-2 rounded-full bg-brand-gold animate-pulse"></span>
            {t('home.badge')}
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            {t('home.heading')}
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
            {t('home.subheading')}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-amber-400 text-brand-dark font-extrabold rounded-xl hover:bg-amber-300 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-amber-400/20"
            >
              <span>{t('home.explore')}</span>
              <ArrowRight className="h-4 w-4 stroke-[3px]" />
            </Link>
            <Link
              to="/about"
              className="flex items-center justify-center px-8 py-4 border border-white/15 hover:border-white/35 bg-white/5 hover:bg-white/10 font-bold rounded-xl transition-all"
            >
              {t('home.learnMore')}
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Ticker */}
      <section className="bg-white border-y border-slate-100 shadow-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {stats.map((stat, index) => (
              <div key={index} className="pt-4 md:pt-0 border-t-0">
                <div className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Exam Calendar Section */}
      <section className="py-20 bg-slate-50/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <ExamCalendar />
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-24 border-t border-slate-100 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="flex items-start gap-4 p-6 bg-slate-50/50 border border-slate-100 rounded-2xl"
              >
                <div className="bg-brand-gold/10 text-brand-yellow p-3 rounded-xl shrink-0 shadow-sm border border-brand-gold/15">
                  <pillar.icon className="h-6 w-6 text-brand-yellow" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-brand-dark">
                    {pillar.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

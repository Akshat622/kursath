import { Target, Eye, ShieldCheck, Smartphone, Network } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { t } = useLanguage();
  const pillars = [
    {
      title: 'Verified Information',
      desc: 'Every listing is reviewed before it reaches a student.',
      icon: ShieldCheck
    },
    {
      title: 'Last-Mile Access',
      desc: 'Designed for low-end smartphones and limited bandwidth.',
      icon: Smartphone
    },
    {
      title: 'Community First',
      desc: 'Powered by volunteers in cities across India.',
      icon: Network
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#0a2540] to-[#0d3b60] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn">
          <span className="text-xs sm:text-sm font-extrabold text-brand-gold uppercase tracking-wider block">
            {t('about.badge')}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {t('about.heading')}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
            {t('about.desc')}
          </p>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Our Mission */}
            <a 
              href="https://www.kursathfoundation.org/kursathfoundationmission" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-8 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group"
            >
              <div className="bg-brand-dark text-white p-3.5 rounded-xl w-fit shadow-sm group-hover:scale-105 transition-transform">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-2xl font-extrabold text-brand-dark group-hover:text-brand-navy transition-colors">
                {t('about.mission.title')}
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                {t('about.mission.desc')}
              </p>
            </a>

            {/* Our Vision */}
            <a 
              href="https://www.kursathfoundation.org/aboutkursathfoundation" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block p-8 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-4 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer group"
            >
              <div className="bg-brand-gold text-brand-dark p-3.5 rounded-xl w-fit shadow-sm group-hover:scale-105 transition-transform">
                <Eye className="h-7 w-7 text-brand-dark" />
              </div>
              <h2 className="text-2xl font-extrabold text-brand-dark group-hover:text-brand-navy transition-colors">
                {t('about.vision.title')}
              </h2>
              <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
                {t('about.vision.desc')}
              </p>
            </a>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8 border-t border-slate-100">
        <div className="max-w-7xl mx-auto space-y-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark text-center">
            {t('about.pillars.heading')}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="flex items-start gap-4 p-6 bg-slate-50 border border-slate-100 rounded-2xl"
              >
                <div className="bg-brand-navy/5 text-brand-navy p-3 rounded-xl shrink-0">
                  <pillar.icon className="h-6 w-6 text-brand-navy" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-brand-dark">
                    {t(pillar.title)}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {t(pillar.desc)}
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

import { Link } from 'react-router-dom';
import { 
  BookOpen, Award, Building2, Briefcase, 
  Compass, Users, HandHelping, Building, ArrowRight 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Modules() {
  const { t } = useLanguage();
  const modules = [
    {
      title: 'Entrance & Admission Alerts',
      desc: 'CUET, application windows, admit cards and results — filtered by course and state.',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      tab: 'admission'
    },
    {
      title: 'Scholarship Hub',
      desc: 'NSP, state and private scholarships with eligibility checker and deadline alerts.',
      icon: Award,
      color: 'bg-amber-50 text-amber-600 border-amber-100',
      tab: 'scholarship'
    },
    {
      title: 'Hostel & Accommodation',
      desc: 'Government, community and NGO hostels filtered by city, gender and cost.',
      icon: Building2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      tab: 'hostel'
    },
    {
      title: 'Internships & Livelihood',
      desc: 'Paid and skill-based opportunities from MSMEs, NGOs and corporates.',
      icon: Briefcase,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      tab: 'livelihood'
    },
    {
      title: 'Career Guidance (Post-12th)',
      desc: 'Structured pathways for Science, Arts and Commerce streams with cost and duration.',
      icon: Compass,
      color: 'bg-cyan-50 text-cyan-600 border-cyan-100',
      tab: 'career'
    },
    {
      title: 'Mentorship Platform',
      desc: 'Connect with alumni and professionals through 1:1 or group sessions.',
      icon: Users,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      tab: 'mentorship'
    },
    {
      title: 'Volunteer Network',
      desc: 'City-wise volunteers ready to help with documentation, schemes and career guidance.',
      icon: HandHelping,
      color: 'bg-teal-50 text-teal-600 border-teal-100',
      tab: 'volunteer'
    },
    {
      title: 'Government Schemes',
      desc: 'Pension, social protection and education schemes with eligibility filters.',
      icon: Building,
      color: 'bg-violet-50 text-violet-600 border-violet-100',
      tab: 'scheme'
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="bg-gradient-to-b from-[#0a2540] to-[#0d3b60] text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn">
          <span className="text-xs sm:text-sm font-extrabold text-brand-gold uppercase tracking-wider block">
            {t('home.modules.badge')}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {t('home.modules.heading')}
          </h1>
          <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
            {t('home.modules.subheading')}
          </p>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {modules.map((mod) => (
              <div 
                key={mod.title}
                className="bg-white border border-slate-100 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6 items-start"
              >
                <div className={`p-4 rounded-2xl w-fit ${mod.color} border shrink-0`}>
                  <mod.icon className="h-8 w-8" />
                </div>
                <div className="space-y-4 flex-1">
                  <h2 className="text-xl font-extrabold text-brand-dark">
                    {t(mod.title)}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {t(mod.desc)}
                  </p>
                  <Link
                    to={`/dashboard?tab=${mod.tab}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:border-brand-navy hover:bg-slate-50 text-slate-700 hover:text-brand-navy font-bold text-sm rounded-xl transition-all"
                  >
                    <span>{t('home.explore')}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

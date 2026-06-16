import { Link } from 'react-router-dom';
import { Mail, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#0b3b60] text-slate-200 border-t border-brand-gold/20 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Social Icons Strip */}
        <div className="flex justify-center items-center gap-6 mb-10 pb-8 border-b border-white/10">
          <a 
            href="https://www.linkedin.com/company/kursath-foundation/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-brand-gold transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
            aria-label="LinkedIn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
              <rect width="4" height="12" x="2" y="9"/>
              <circle cx="4" cy="4" r="2"/>
            </svg>
          </a>
          <a 
            href="https://x.com/KursathInfo" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-brand-gold transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
            aria-label="Twitter / X"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
              <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
            </svg>
          </a>
          <a 
            href="https://www.facebook.com/infokursathfoundation/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-brand-gold transition-all duration-300 hover:-translate-y-0.5 shadow-sm"
            aria-label="Facebook"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
            </svg>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-white p-1 rounded-xl shadow-sm border border-white/10 group-hover:scale-105 transition-all">
                <img 
                  src="/logo.png" 
                  alt="Kursath Foundation Logo" 
                  className="h-10 w-auto object-contain"
                />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Kursath Foundation
              </span>
            </Link>
            <p className="text-slate-200/90 text-sm max-w-xs leading-relaxed">
              {t('footer.desc')}
            </p>
          </div>

          {/* Modules Column */}
          <div className="space-y-4">
            <h3 className="text-slate-100 font-extrabold text-base tracking-wider uppercase">
              {t('nav.modules')}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/dashboard?tab=scholarship" className="hover:text-brand-gold transition-colors">
                  {t('Scholarship Hub')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=admission" className="hover:text-brand-gold transition-colors">
                  {t('Entrance & Admission Alerts')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=scheme" className="hover:text-brand-gold transition-colors">
                  {t('Government Schemes')}
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=mentorship" className="hover:text-brand-gold transition-colors">
                  {t('Mentorship Platform')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Reach Us Column */}
          <div className="space-y-4">
            <h3 className="text-slate-100 font-extrabold text-base tracking-wider uppercase">
              {t('contact.reach.heading')}
            </h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-slate-300">
                <Mail className="h-4 w-4 text-brand-gold shrink-0" />
                <a href="mailto:contact@kursathfoundation.org" className="hover:text-slate-200 break-all">
                  contact@kursathfoundation.org
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <MapPin className="h-4 w-4 text-brand-gold shrink-0 mt-0.5" />
                <span>{t('Delhi')} · {t('Noida')} · {t('Kolkata')} · {t('Meerut')} · {t('Gurgaon')}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-300/60 font-semibold">
          <span>&copy; {new Date().getFullYear()} Kursath Foundation. All rights reserved.</span>
          <span className="text-slate-300">{t('footer.impact')}</span>
        </div>
      </div>
    </footer>
  );
}

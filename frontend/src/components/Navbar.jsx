import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Globe, LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.modules'), path: '/modules' },
    { name: t('nav.dashboard'), path: '/dashboard' },
    { name: t('nav.contact'), path: '/contact' }
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3.5 group">
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100/50 group-hover:scale-105 transition-all">
              <img 
                src="/logo.png" 
                alt="Kursath Foundation Logo" 
                className="h-12 w-auto object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <span className="font-extrabold text-xl text-brand-dark tracking-tight block">
                Kursath Foundation
              </span>
              <span className="text-[10px] tracking-wider uppercase font-bold text-slate-500 block mt-[-2px]">
                {t('nav.subtitle')}
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-semibold text-sm transition-colors duration-200 py-1 ${
                  isActive(link.path)
                    ? 'text-brand-navy border-b-2 border-brand-gold'
                    : 'text-slate-500 hover:text-brand-navy'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Lang switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3.5 py-1.5 border border-slate-200 hover:border-slate-300 rounded-full text-sm font-semibold hover:bg-slate-50 text-slate-600 transition-all cursor-pointer"
            >
              <Globe className="h-4 w-4 text-brand-navy" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>

            {/* Admin Controls */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-navy text-white text-sm font-bold rounded-xl hover:bg-brand-dark transition-all shadow-sm"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>{t('nav.signin')}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 border border-rose-200 text-rose-600 rounded-xl hover:bg-rose-50 transition-all cursor-pointer"
                  title={t('nav.signout')}
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 px-4 py-2 border border-slate-200 hover:border-brand-navy text-slate-700 hover:text-brand-navy text-sm font-bold rounded-xl transition-all"
              >
                {t('nav.signin')}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 p-2 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
            >
              <Globe className="h-4 w-4 text-brand-navy" />
              <span className="text-xs">{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-brand-navy"
            >
              {mobileMenuOpen ? <X className="h-5 w-5 text-brand-navy" /> : <Menu className="h-5 w-5 text-brand-navy" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-md py-4 px-4 space-y-3 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl font-semibold text-base ${
                isActive(link.path)
                  ? 'bg-slate-100 text-brand-navy'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="border-t border-slate-100 pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-navy text-white font-bold rounded-xl"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  {t('nav.signin')} {t('nav.dashboard')}
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 border border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-50"
                >
                  <LogOut className="h-4 w-4" />
                  {t('nav.signout')}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center w-full py-2.5 border border-slate-200 text-slate-700 font-bold rounded-xl"
              >
                {t('nav.signin')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

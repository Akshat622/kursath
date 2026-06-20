import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GraduationCap, Globe, LogOut, LayoutDashboard, Menu, X, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const getInitials = (user) => {
  if (!user) return '';
  if (user.firstName || user.lastName) {
    const f = user.firstName ? user.firstName.charAt(0) : '';
    const l = user.lastName ? user.lastName.charAt(0) : '';
    return (f + l).toUpperCase();
  }
  const cleanUsername = user.username || '';
  if (cleanUsername.includes('@')) {
    const namePart = cleanUsername.split('@')[0];
    const parts = namePart.split(/[\._-]/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return namePart.substring(0, 2).toUpperCase();
  }
  const parts = cleanUsername.split(/[\._-]/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return cleanUsername.substring(0, 2).toUpperCase();
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

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
                {(user.role === 'admin' || user.role === 'sub-admin') && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1.5 px-4 py-2 bg-brand-navy text-white text-sm font-bold rounded-xl hover:bg-brand-dark transition-all shadow-sm"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>{user.role === 'admin' ? t('nav.admin') : t('nav.subadmin')}</span>
                  </Link>
                )}
                {user.role === 'user' && (
                  <div className="relative">
                    <button 
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="w-9 h-9 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center font-extrabold text-sm shadow-sm border border-brand-gold/30 cursor-pointer focus:outline-none hover:scale-105 active:scale-95 transition-transform"
                      title={`${user.firstName || ''} ${user.lastName || ''} (${user.username})`}
                    >
                      {getInitials(user)}
                    </button>
                    
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-2.5 w-48 bg-white border border-slate-100 rounded-2xl shadow-xl py-2 z-50 animate-fadeIn">
                        <div className="px-4 py-2 border-b border-slate-50 mb-1">
                          <span className="block text-xs font-bold text-slate-800 truncate">
                            {user.firstName || user.lastName ? `${user.firstName} ${user.lastName}` : 'Google User'}
                          </span>
                          <span className="block text-[10px] text-slate-400 truncate">{user.username}</span>
                        </div>
                        
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-600 hover:text-brand-navy hover:bg-slate-50 transition-colors"
                        >
                          <User className="h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                        
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50/50 transition-colors cursor-pointer"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
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
                {(user.role === 'admin' || user.role === 'sub-admin') && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-navy text-white font-bold rounded-xl"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    {user.role === 'admin' ? t('nav.admin') : t('nav.subadmin')} {t('nav.dashboard')}
                  </Link>
                )}
                {user.role === 'user' && (
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center gap-3 bg-slate-50 py-2.5 rounded-xl border border-slate-100">
                      <div className="w-9 h-9 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center font-extrabold text-sm shadow-sm border border-brand-gold/30">
                        {getInitials(user)}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-bold text-slate-800">
                          {user.firstName || user.lastName ? `${user.firstName} ${user.lastName}` : 'User'}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold">{user.username}</span>
                      </div>
                    </div>
                    
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 bg-brand-gold/10 hover:bg-brand-gold/20 text-brand-navy font-bold rounded-xl text-sm transition-colors"
                    >
                      <User className="h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </div>
                )}
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

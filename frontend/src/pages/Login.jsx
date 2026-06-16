import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, User } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Login() {
  const { login, error, token, loading } = useAuth();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const isHi = language === 'hi';
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState('');

  // Forgot password states
  const [view, setView] = useState('login'); // 'login' | 'forgot' | 'reset'
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');
  const [devUrl, setDevUrl] = useState('');

  // Reset password states
  const [resetToken, setResetToken] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');
  const [resetError, setResetError] = useState('');

  // Check URL query parameters for reset token
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    if (tokenParam) {
      setView('reset');
      setResetToken(tokenParam);
    }
  }, []);

  // If already logged in, redirect to admin
  useEffect(() => {
    if (token && view === 'login') {
      navigate('/admin');
    }
  }, [token, view, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setValidationError(isHi ? 'कृपया उपयोगकर्ता नाम और पासवर्ड दोनों दर्ज करें।' : 'Please enter both username and password.');
      return;
    }
    setValidationError('');
    const success = await login(username, password);
    if (success) {
      navigate('/admin');
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      setForgotError(isHi ? 'कृपया अपना ईमेल पता दर्ज करें।' : 'Please enter your email address.');
      return;
    }
    setForgotError('');
    setForgotSuccess('');
    setDevUrl('');

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: forgotEmail })
      });
      const data = await response.json();
      if (response.ok) {
        setForgotSuccess(data.msg);
        if (data.devResetUrl) {
          setDevUrl(data.devResetUrl);
        }
      } else {
        setForgotError(data.msg || (isHi ? 'अनुरोध विफल रहा।' : 'Request failed.'));
      }
    } catch (err) {
      console.error(err);
      setForgotError(isHi ? 'सर्वर कनेक्शन विफल रहा।' : 'Server connection failed.');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      setResetError(isHi ? 'कृपया सभी फ़ील्ड भरें।' : 'Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setResetError(isHi ? 'पासवर्ड मेल नहीं खाते।' : 'Passwords do not match.');
      return;
    }
    setResetError('');
    setResetSuccess('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, password: newPassword })
      });
      const data = await response.json();
      if (response.ok) {
        setResetSuccess(data.msg);
        setTimeout(() => {
          // Clear query parameters
          window.history.replaceState({}, document.title, window.location.pathname);
          setView('login');
          resetResetForm();
        }, 3000);
      } else {
        setResetError(data.msg || (isHi ? 'रीसेट विफल रहा।' : 'Reset failed.'));
      }
    } catch (err) {
      console.error(err);
      setResetError(isHi ? 'सर्वर कनेक्शन विफल रहा।' : 'Server connection failed.');
    }
  };

  const resetResetForm = () => {
    setNewPassword('');
    setConfirmPassword('');
    setResetToken(null);
    setResetSuccess('');
    setResetError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white border border-slate-100 p-8 sm:p-10 rounded-3xl shadow-xl animate-fadeIn">
        
        {/* VIEW 1: LOGIN */}
        {view === 'login' && (
          <>
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="bg-brand-dark text-white p-3 rounded-2xl w-fit mx-auto shadow-md">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h2 className="text-3xl font-extrabold text-brand-dark">{t('nav.signin')}</h2>
              <p className="text-slate-500 text-sm">
                {t('login.badge')}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {(validationError || error) && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-semibold">
                  {validationError || error}
                </div>
              )}

              <div className="space-y-5">
                {/* Username */}
                <div className="relative">
                  <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                    {t('login.username')}
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder={t('login.username.placeholder')}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="relative">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider">
                      {t('login.password')}
                    </label>
                    <button
                      type="button"
                      onClick={() => { setView('forgot'); setValidationError(''); }}
                      className="text-xs font-bold text-brand-navy hover:underline cursor-pointer"
                    >
                      {isHi ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder={t('login.password.placeholder')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-brand-navy hover:bg-brand-dark text-white font-extrabold rounded-xl shadow-sm text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? '...' : t('nav.signin')}
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-6">
              <div className="border-t border-slate-100 w-full"></div>
              <span className="absolute bg-white px-3 text-xs text-slate-500 font-semibold uppercase tracking-wider">or</span>
            </div>

            {/* Google sign-in */}
            <button
              onClick={() => alert('Google authentication is mocked. Please use admin email: info@kursathfoundation.org, password: kursath@2000')}
              className="w-full py-3 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span>{t('login.google')}</span>
            </button>

            <div className="text-center text-xs text-slate-500 font-semibold mt-4">
              {t('login.noaccount')} <span className="text-brand-navy hover:underline cursor-pointer" onClick={() => alert('Default admin setup is configured. Use username: info@kursathfoundation.org, password: kursath@2000')}>{t('login.signup')}</span>
            </div>
          </>
        )}

        {/* VIEW 2: FORGOT PASSWORD */}
        {view === 'forgot' && (
          <>
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="bg-brand-dark text-white p-3 rounded-2xl w-fit mx-auto shadow-md">
                <Lock className="h-8 w-8 text-brand-gold animate-float" />
              </div>
              <h2 className="text-2xl font-extrabold text-brand-dark">
                {isHi ? 'पासवर्ड भूल गए?' : 'Forgot Password?'}
              </h2>
              <p className="text-slate-500 text-sm">
                {isHi 
                  ? 'अपना एडमिन ईमेल दर्ज करें। हम आपको पासवर्ड रीसेट करने के लिए एक लिंक भेजेंगे।' 
                  : 'Enter your admin email. We will send you a link to reset your password.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleForgotSubmit} className="space-y-6">
              {forgotError && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-semibold animate-fadeIn">
                  {forgotError}
                </div>
              )}
              {forgotSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-xs font-semibold animate-fadeIn space-y-2">
                  <p>{forgotSuccess}</p>
                  {devUrl && (
                    <div className="pt-2 border-t border-emerald-100/50">
                      <span className="text-[10px] uppercase font-extrabold block text-emerald-500 mb-1">Local Testing Link (Copy):</span>
                      <textarea 
                        readOnly 
                        value={devUrl} 
                        onClick={(e) => e.target.select()}
                        className="w-full text-[10px] p-2 bg-white border border-emerald-200 rounded-lg focus:outline-none resize-none font-mono"
                        rows="2"
                      />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                  {isHi ? 'ईमेल पता' : 'Email Address'}
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="info@kursathfoundation.org"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy text-sm transition-all"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 bg-brand-navy hover:bg-brand-dark text-white font-extrabold rounded-xl shadow-sm text-sm transition-all"
              >
                {isHi ? 'रीसेट लिंक भेजें' : 'Send Reset Link'}
              </button>

              {/* Back to sign in */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setView('login'); setForgotError(''); setForgotSuccess(''); setDevUrl(''); }}
                  className="text-xs font-bold text-brand-navy hover:underline cursor-pointer"
                >
                  {isHi ? 'साइन इन पर वापस जाएं' : 'Back to sign in'}
                </button>
              </div>
            </form>
          </>
        )}

        {/* VIEW 3: RESET PASSWORD */}
        {view === 'reset' && (
          <>
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="bg-brand-dark text-white p-3 rounded-2xl w-fit mx-auto shadow-md">
                <Lock className="h-8 w-8 text-brand-gold" />
              </div>
              <h2 className="text-2xl font-extrabold text-brand-dark">
                {isHi ? 'नया पासवर्ड बनाएं' : 'Reset Password'}
              </h2>
              <p className="text-slate-500 text-sm">
                {isHi 
                  ? 'अपने मुख्य व्यवस्थापक खाते के लिए एक नया मजबूत पासवर्ड सेट करें।' 
                  : 'Set a new strong password for your primary administrator account.'}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleResetSubmit} className="space-y-6">
              {resetError && (
                <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-semibold animate-fadeIn">
                  {resetError}
                </div>
              )}
              {resetSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-xs font-semibold animate-fadeIn">
                  {resetSuccess}
                </div>
              )}

              <div className="space-y-5">
                {/* New Password */}
                <div>
                  <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                    {isHi ? 'नया पासवर्ड' : 'New Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy text-sm transition-all"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                    {isHi ? 'पासवर्ड की पुष्टि करें' : 'Confirm Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 bg-brand-navy hover:bg-brand-dark text-white font-extrabold rounded-xl shadow-sm text-sm transition-all"
              >
                {isHi ? 'पासवर्ड सहेजें' : 'Save New Password'}
              </button>

              {/* Back to sign in */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => { setView('login'); resetResetForm(); }}
                  className="text-xs font-bold text-brand-navy hover:underline cursor-pointer"
                >
                  {isHi ? 'साइन इन पर वापस जाएं' : 'Back to sign in'}
                </button>
              </div>
            </form>
          </>
        )}

      </div>
    </div>
  );
}

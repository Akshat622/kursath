import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  User, GraduationCap, Bookmark, Phone, Mail, 
  Building2, BookOpen, Clock, IndianRupee, ShieldCheck, 
  FileText, X, ArrowUpRight, Save, LayoutDashboard, Bell
} from 'lucide-react';

const isExpired = (deadlineStr) => {
  if (!deadlineStr) return false;
  const cleanStr = deadlineStr.trim();
  const normalized = cleanStr.toLowerCase();
  if (normalized === 'open' || normalized === 'ongoing' || normalized === 'n/a' || normalized === 'na') {
    return false;
  }
  const parsed = Date.parse(cleanStr);
  if (isNaN(parsed)) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(parsed) < today;
};

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
  return cleanUsername.substring(0, 2).toUpperCase();
};

export default function Profile() {
  const { user, token, logout, updateUserProfile, updateSavedOpportunities } = useAuth();
  const { language, t, tVal } = useLanguage();
  const navigate = useNavigate();

  // Redirect if not logged in or if they are admin/sub-admin
  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (user && user.role !== 'user') {
      navigate('/admin');
    }
  }, [token, user, navigate]);

  const [activeTab, setActiveTab] = useState('academic');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedOpp, setSelectedOpp] = useState(null);

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [institution, setInstitution] = useState('');
  const [classOrDegree, setClassOrDegree] = useState('');
  const [courseOrMajor, setCourseOrMajor] = useState('');

  // Notification states
  const [notifPrefs, setNotifPrefs] = useState({
    scholarships: true,
    hostels: true,
    schemes: true,
    livelihoods: true,
    careers: true
  });

  // Sync form states with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
      setInstitution(user.institution || '');
      setClassOrDegree(user.classOrDegree || '');
      setCourseOrMajor(user.courseOrMajor || '');
      if (user.notificationPreferences) {
        setNotifPrefs({
          scholarships: user.notificationPreferences.scholarships !== undefined ? user.notificationPreferences.scholarships : true,
          hostels: user.notificationPreferences.hostels !== undefined ? user.notificationPreferences.hostels : true,
          schemes: user.notificationPreferences.schemes !== undefined ? user.notificationPreferences.schemes : true,
          livelihoods: user.notificationPreferences.livelihoods !== undefined ? user.notificationPreferences.livelihoods : true,
          careers: user.notificationPreferences.careers !== undefined ? user.notificationPreferences.careers : true
        });
      }
    }
  }, [user]);

  if (!user) return null;

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
          institution,
          classOrDegree,
          courseOrMajor
        })
      });

      const data = await response.json();
      if (response.ok) {
        updateUserProfile(data);
        setSuccessMsg(language === 'en' ? 'Profile updated successfully!' : 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!');
      } else {
        setErrorMsg(data.msg || 'Failed to update profile');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          notificationPreferences: notifPrefs
        })
      });
      const data = await response.json();
      if (response.ok) {
        updateUserProfile(data);
        setSuccessMsg(language === 'en' ? 'Notification preferences updated successfully!' : 'अधिसूचना प्राथमिकताएं सफलतापूर्वक अपडेट की गईं!');
      } else {
        setErrorMsg(data.msg || (language === 'en' ? 'Failed to update preferences.' : 'प्राथमिकताएं अपडेट करने में विफल।'));
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(language === 'en' ? 'Connection to server failed.' : 'सर्वर से कनेक्शन विफल रहा।');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSave = async (e, oppId) => {
    e.stopPropagation();
    try {
      const response = await fetch(`/api/auth/save-opportunity/${oppId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        updateSavedOpportunities(data.savedOpportunities);
        if (selectedOpp && selectedOpp._id === oppId) {
          setSelectedOpp(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Profile Panel */}
        <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-40 h-40 bg-brand-gold/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute left-0 bottom-0 w-40 h-40 bg-brand-navy/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="w-20 h-20 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center font-extrabold text-3xl shadow-md border border-brand-gold/30 shrink-0">
            {getInitials(user)}
          </div>
          
          <div className="text-center sm:text-left flex-grow space-y-1.5">
            <h2 className="text-2xl font-extrabold text-brand-dark">
              {user.firstName || user.lastName ? `${user.firstName} ${user.lastName}` : 'Google User'}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs font-semibold text-slate-500">
              <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                <Mail className="h-4 w-4 text-slate-400" />
                {user.username}
              </span>
              {user.phone && (
                <span className="flex items-center gap-1.5 justify-center sm:justify-start">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {user.phone}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 px-4.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-brand-dark text-xs font-bold rounded-xl transition-all"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>{t('nav.dashboard')}</span>
            </button>
            <button
              onClick={logout}
              className="px-4.5 py-2.5 border border-rose-100 hover:bg-rose-50 text-rose-600 text-xs font-bold rounded-xl transition-all"
            >
              {t('nav.signout')}
            </button>
          </div>
        </div>

        {/* Form & List Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Left Sidebar Navigation */}
          <div className="md:col-span-1 space-y-2">
            <button
              onClick={() => { setActiveTab('academic'); setSuccessMsg(''); setErrorMsg(''); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer border ${
                activeTab === 'academic'
                  ? 'bg-brand-navy text-white border-brand-navy shadow-md'
                  : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              <span>{language === 'en' ? 'Academic Profile' : 'शैक्षणिक प्रोफ़ाइल'}</span>
            </button>
            <button
              onClick={() => { setActiveTab('personal'); setSuccessMsg(''); setErrorMsg(''); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer border ${
                activeTab === 'personal'
                  ? 'bg-brand-navy text-white border-brand-navy shadow-md'
                  : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
              }`}
            >
              <User className="h-4 w-4" />
              <span>{language === 'en' ? 'Personal Details' : 'व्यक्तिगत विवरण'}</span>
            </button>
            <button
              onClick={() => { setActiveTab('saved'); setSuccessMsg(''); setErrorMsg(''); }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer border ${
                activeTab === 'saved'
                  ? 'bg-brand-navy text-white border-brand-navy shadow-md'
                  : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Bookmark className="h-4 w-4" />
                <span>{language === 'en' ? 'Saved Benefits' : 'सहेजे गए लाभ'}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                activeTab === 'saved' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {user.savedOpportunities?.length || 0}
              </span>
            </button>
            <button
              onClick={() => { setActiveTab('notifications'); setSuccessMsg(''); setErrorMsg(''); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer border ${
                activeTab === 'notifications'
                  ? 'bg-brand-navy text-white border-brand-navy shadow-md'
                  : 'bg-white text-slate-600 border-slate-100 hover:bg-slate-50'
              }`}
            >
              <Bell className="h-4 w-4" />
              <span>{language === 'en' ? 'Email Alerts' : 'ईमेल अलर्ट'}</span>
            </button>
          </div>

          {/* Right Main Content Panel */}
          <div className="md:col-span-3">
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              
              {successMsg && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-2xl">
                  {successMsg}
                </div>
              )}

              {errorMsg && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-2xl">
                  {errorMsg}
                </div>
              )}

              {/* Tab: Academic Form */}
              {activeTab === 'academic' && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold text-brand-dark mb-1">
                      {language === 'en' ? 'Educational Background' : 'शैक्षणिक पृष्ठभूमि'}
                    </h3>
                    <p className="text-slate-400 text-xs font-semibold">
                      {language === 'en' ? 'Provide your school or college academic qualifications' : 'अपनी स्कूल या कॉलेज की शैक्षणिक योग्यताएं दर्ज करें'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    <div>
                      <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">School / College Name</label>
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        placeholder="e.g. IIT Kanpur"
                        className="w-full px-4 py-3.5 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Class / Degree</label>
                      <input
                        type="text"
                        value={classOrDegree}
                        onChange={(e) => setClassOrDegree(e.target.value)}
                        placeholder="e.g. B.Tech"
                        className="w-full px-4 py-3.5 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Course / Stream / Major</label>
                      <input
                        type="text"
                        value={courseOrMajor}
                        onChange={(e) => setCourseOrMajor(e.target.value)}
                        placeholder="e.g. Computer Science & Engineering"
                        className="w-full px-4 py-3.5 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-brand-navy text-white text-xs font-bold rounded-xl hover:bg-brand-dark transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Saving...' : (language === 'en' ? 'Save Profile' : 'प्रोफ़ाइल सहेजें')}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Tab: Personal Details Form */}
              {activeTab === 'personal' && (
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold text-brand-dark mb-1">
                      {language === 'en' ? 'Personal Information' : 'व्यक्तिगत जानकारी'}
                    </h3>
                    <p className="text-slate-400 text-xs font-semibold">
                      {language === 'en' ? 'View and update your personal details' : 'अपने व्यक्तिगत विवरण देखें और अपडेट करें'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                    <div>
                      <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">First Name</label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full px-4 py-3.5 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full px-4 py-3.5 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Phone Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full px-4 py-3.5 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Email Address</label>
                      <input
                        type="text"
                        value={user.username}
                        disabled
                        className="w-full px-4 py-3.5 border border-slate-200 bg-slate-50 text-slate-400 rounded-xl text-sm"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-brand-navy text-white text-xs font-bold rounded-xl hover:bg-brand-dark transition-all shadow-md cursor-pointer disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? 'Saving...' : (language === 'en' ? 'Save Profile' : 'प्रोफ़ाइल सहेजें')}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Tab: Saved Opportunities List */}
              {activeTab === 'saved' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold text-brand-dark mb-1">
                      {language === 'en' ? 'Saved Benefits & Alerts' : 'सहेजे गए लाभ और अलर्ट'}
                    </h3>
                    <p className="text-slate-400 text-xs font-semibold">
                      {language === 'en' ? 'Manage your saved scholarship opportunities' : 'अपने सहेजे गए छात्रवृत्ति अवसरों को प्रबंधित करें'}
                    </p>
                  </div>

                  {(!user.savedOpportunities || user.savedOpportunities.length === 0) ? (
                    <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center space-y-4">
                      <Bookmark className="h-10 w-10 text-slate-300" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-700">
                          {language === 'en' ? 'No saved benefits yet' : 'अभी तक कोई लाभ सहेजा नहीं गया है'}
                        </h4>
                        <p className="text-slate-400 text-[11px] font-semibold max-w-xs leading-relaxed">
                          {language === 'en' ? 'Explore active opportunities and click the bookmark button to save them.' : 'सक्रिय अवसरों का पता लगाएं और उन्हें सहेजने के लिए बुकमार्क बटन पर क्लिक करें।'}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="px-4.5 py-2.5 bg-brand-navy hover:bg-brand-dark text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
                      >
                        Explore Opportunities
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                      {user.savedOpportunities.map((opp) => (
                        <div
                          key={opp._id}
                          onClick={() => setSelectedOpp(opp)}
                          className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-gold/30 transition-all cursor-pointer flex flex-col justify-between"
                        >
                          <div className="space-y-3.5">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="text-sm font-bold text-brand-dark line-clamp-2 leading-snug">
                                {tVal(opp.title)}
                              </h4>
                              {opp.type && (
                                <span className="text-[8px] font-extrabold uppercase bg-brand-navy/5 text-brand-navy px-1.5 py-0.5 rounded shrink-0">
                                  {t(opp.type)}
                                </span>
                              )}
                            </div>
                            
                            <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-wider">
                              {tVal(opp.provider)}
                            </p>

                            <div className="space-y-2 pt-2 border-t border-slate-50">
                              {opp.deadline && (
                                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                                  <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                  <span>Deadline: <strong className="text-slate-600">{tVal(opp.deadline)}</strong></span>
                                </div>
                              )}
                              {opp.amount && (
                                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500">
                                  <IndianRupee className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                                  <span>Benefit: <strong className="text-slate-600">{tVal(opp.amount)}</strong></span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-4 mt-2">
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-brand-navy hover:text-brand-gold transition-colors">
                              <span>View Details</span>
                              <ArrowUpRight className="h-3 w-3" />
                            </span>
                            <button
                              onClick={(e) => handleRemoveSave(e, opp._id)}
                              className="px-2.5 py-1.5 border border-slate-100 hover:border-rose-100 hover:bg-rose-50 text-rose-500 text-[10px] font-bold rounded-lg transition-all cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab: Notification Settings Form */}
              {activeTab === 'notifications' && (
                <form onSubmit={handleNotificationSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-base font-extrabold text-brand-dark mb-1">
                      {language === 'en' ? 'Email Alerts & Subscriptions' : 'ईमेल अलर्ट और सदस्यता'}
                    </h3>
                    <p className="text-slate-400 text-xs font-semibold">
                      {language === 'en' 
                        ? 'Select the categories for which you wish to receive real-time email notifications and scholarship alerts.'
                        : 'उन श्रेणियों का चयन करें जिनके लिए आप वास्तविक समय में ईमेल सूचनाएं और छात्रवृत्ति अलर्ट प्राप्त करना चाहते हैं।'}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    {/* Scholarship Alerts */}
                    <div className="flex items-start gap-4 p-4 border border-slate-100 hover:border-slate-200 rounded-2xl transition-all bg-slate-50/20">
                      <div className="flex items-center h-5">
                        <input
                          id="pref-scholarships"
                          type="checkbox"
                          checked={notifPrefs.scholarships}
                          onChange={(e) => setNotifPrefs(prev => ({ ...prev, scholarships: e.target.checked }))}
                          className="h-4 w-4 text-brand-navy focus:ring-brand-navy border-slate-300 rounded cursor-pointer"
                        />
                      </div>
                      <label htmlFor="pref-scholarships" className="cursor-pointer">
                        <span className="block text-xs font-bold text-brand-dark">
                          {language === 'en' ? 'Scholarships & Schemes Alerts' : 'छात्रवृत्ति और योजनाएं अलर्ट'}
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-0.5">
                          {language === 'en' 
                            ? 'Get instant alerts when new scholarships or educational aids are published.'
                            : 'नई छात्रवृत्ति या शैक्षणिक सहायता प्रकाशित होने पर तुरंत अलर्ट प्राप्त करें।'}
                        </span>
                      </label>
                    </div>

                    {/* Hostel Alerts */}
                    <div className="flex items-start gap-4 p-4 border border-slate-100 hover:border-slate-200 rounded-2xl transition-all bg-slate-50/20">
                      <div className="flex items-center h-5">
                        <input
                          id="pref-hostels"
                          type="checkbox"
                          checked={notifPrefs.hostels}
                          onChange={(e) => setNotifPrefs(prev => ({ ...prev, hostels: e.target.checked }))}
                          className="h-4 w-4 text-brand-navy focus:ring-brand-navy border-slate-300 rounded cursor-pointer"
                        />
                      </div>
                      <label htmlFor="pref-hostels" className="cursor-pointer">
                        <span className="block text-xs font-bold text-brand-dark">
                          {language === 'en' ? 'Hostel Accommodations' : 'छात्रावास आवास अलर्ट'}
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-0.5">
                          {language === 'en' 
                            ? 'Be notified about new hostel admissions, lodging, and student accommodations.'
                            : 'नए छात्रावास प्रवेश, आवास और छात्र आवास के बारे में अधिसूचित हों।'}
                        </span>
                      </label>
                    </div>

                    {/* Schemes Alerts */}
                    <div className="flex items-start gap-4 p-4 border border-slate-100 hover:border-slate-200 rounded-2xl transition-all bg-slate-50/20">
                      <div className="flex items-center h-5">
                        <input
                          id="pref-schemes"
                          type="checkbox"
                          checked={notifPrefs.schemes}
                          onChange={(e) => setNotifPrefs(prev => ({ ...prev, schemes: e.target.checked }))}
                          className="h-4 w-4 text-brand-navy focus:ring-brand-navy border-slate-300 rounded cursor-pointer"
                        />
                      </div>
                      <label htmlFor="pref-schemes" className="cursor-pointer">
                        <span className="block text-xs font-bold text-brand-dark">
                          {language === 'en' ? 'Social Welfare & Pension Schemes' : 'समाज कल्याण और पेंशन योजनाएं'}
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-0.5">
                          {language === 'en' 
                            ? 'Get updates on central/state pensions, disability benefits, and local welfare schemes.'
                            : 'केंद्रीय/राज्य पेंशन, विकलांगता लाभ और स्थानीय कल्याण योजनाओं पर अपडेट प्राप्त करें।'}
                        </span>
                      </label>
                    </div>

                    {/* Livelihoods Alerts */}
                    <div className="flex items-start gap-4 p-4 border border-slate-100 hover:border-slate-200 rounded-2xl transition-all bg-slate-50/20">
                      <div className="flex items-center h-5">
                        <input
                          id="pref-livelihoods"
                          type="checkbox"
                          checked={notifPrefs.livelihoods}
                          onChange={(e) => setNotifPrefs(prev => ({ ...prev, livelihoods: e.target.checked }))}
                          className="h-4 w-4 text-brand-navy focus:ring-brand-navy border-slate-300 rounded cursor-pointer"
                        />
                      </div>
                      <label htmlFor="pref-livelihoods" className="cursor-pointer">
                        <span className="block text-xs font-bold text-brand-dark">
                          {language === 'en' ? 'Livelihood & Vocational Training' : 'आजीविका और व्यावसायिक प्रशिक्षण'}
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-0.5">
                          {language === 'en' 
                            ? 'Stay updated on skill development, self-employment schemes, and training opportunities.'
                            : 'कौशल विकास, स्व-रोजगार योजनाओं और प्रशिक्षण के अवसरों पर अपडेट रहें।'}
                        </span>
                      </label>
                    </div>

                    {/* Careers Alerts */}
                    <div className="flex items-start gap-4 p-4 border border-slate-100 hover:border-slate-200 rounded-2xl transition-all bg-slate-50/20">
                      <div className="flex items-center h-5">
                        <input
                          id="pref-careers"
                          type="checkbox"
                          checked={notifPrefs.careers}
                          onChange={(e) => setNotifPrefs(prev => ({ ...prev, careers: e.target.checked }))}
                          className="h-4 w-4 text-brand-navy focus:ring-brand-navy border-slate-300 rounded cursor-pointer"
                        />
                      </div>
                      <label htmlFor="pref-careers" className="cursor-pointer">
                        <span className="block text-xs font-bold text-brand-dark">
                          {language === 'en' ? 'Careers & Internship Updates' : 'करियर और इंटर्नशिप अपडेट'}
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-0.5">
                          {language === 'en' 
                            ? 'Receive alerts about internships, entry-level job roles, and career counseling.'
                            : 'इंटर्नशिप, प्रवेश-स्तर की नौकरी की भूमिकाओं और career परामर्श के बारे में अलर्ट प्राप्त करें।'}
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-50">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-3 bg-brand-navy hover:bg-brand-dark text-white text-xs font-extrabold rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                      <Save className="h-4 w-4" />
                      <span>{loading ? '...' : (language === 'en' ? 'Save Settings' : 'सेटिंग्स सहेजें')}</span>
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>

      {/* Drawer overlay: Opportunity details */}
      {selectedOpp && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity animate-fadeIn"
            onClick={() => setSelectedOpp(null)}
          ></div>
          
          <div className="fixed inset-y-0 right-0 max-w-lg w-full bg-white z-50 shadow-2xl flex flex-col justify-between animate-slideIn">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-brand-dark text-white">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-gold bg-brand-gold/10 px-2 py-0.5 rounded-md">
                  {t(selectedOpp.category)}
                </span>
                <h3 className="text-lg font-extrabold line-clamp-1 leading-snug">{tVal(selectedOpp.title)}</h3>
              </div>
              <button 
                onClick={() => setSelectedOpp(null)}
                className="text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-grow custom-scrollbar">
              <div className="space-y-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-3.5 text-sm font-semibold text-slate-600">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100"><Clock className="h-5 w-5 text-brand-navy/70" /></div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wider">{t('drawer.deadline')}</span>
                    <span className="text-slate-800 font-extrabold">{tVal(selectedOpp.deadline)}</span>
                  </div>
                </div>
                {selectedOpp.amount && (
                  <div className="flex items-center gap-3.5 text-sm font-semibold text-slate-600">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100"><IndianRupee className="h-5 w-5 text-brand-navy/70" /></div>
                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wider">{t('drawer.benefit')}</span>
                      <span className="text-slate-800 font-extrabold">{tVal(selectedOpp.amount)}</span>
                    </div>
                  </div>
                )}
                {selectedOpp.eligibility && (
                  <div className="flex items-start gap-3.5 text-sm font-semibold text-slate-600">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-0.5"><ShieldCheck className="h-5 w-5 text-brand-navy/70" /></div>
                    <div>
                      <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wider">{t('drawer.eligibility')}</span>
                      <span className="text-slate-800 font-bold leading-relaxed">{tVal(selectedOpp.eligibility)}</span>
                    </div>
                  </div>
                )}
              </div>

              {selectedOpp.description && (
                <div className="space-y-2 pb-6 border-b border-slate-100">
                  <span className="text-slate-500 text-[10px] block uppercase font-extrabold tracking-wider">{t('drawer.desc')}</span>
                  <p className="text-slate-600 text-xs font-medium leading-relaxed whitespace-pre-line">{tVal(selectedOpp.description)}</p>
                </div>
              )}

              {selectedOpp.provider && (
                <div className="space-y-2">
                  <span className="text-slate-500 text-[10px] block uppercase font-extrabold tracking-wider">{t('drawer.provider')}</span>
                  <div className="flex items-center gap-3">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100"><Building2 className="h-5 w-5 text-brand-navy/70" /></div>
                    <span className="text-slate-800 font-bold text-sm">{tVal(selectedOpp.provider)}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-4">
              {selectedOpp.link && (
                <a
                  href={selectedOpp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow flex items-center justify-center gap-1.5 px-6 py-3.5 bg-brand-navy text-white text-xs font-bold rounded-xl hover:bg-brand-dark transition-all shadow-md"
                >
                  <span>{t('drawer.apply')}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
              <button
                onClick={(e) => handleRemoveSave(e, selectedOpp._id)}
                className="px-6 py-3.5 border border-rose-100 hover:bg-rose-50 text-rose-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Unsave
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}

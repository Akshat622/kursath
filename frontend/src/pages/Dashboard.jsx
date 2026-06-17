import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, Award, BookOpen, Building, Building2, 
  Briefcase, Compass, Users, HandHelping, Mail, 
  MapPin, Clock, IndianRupee, ShieldCheck, FileText,
  AlertCircle, ChevronRight, X, ArrowUpRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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

export default function Dashboard() {
  const { t, tVal } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'scholarship';
  
  const [opportunities, setOpportunities] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [contactVolunteer, setContactVolunteer] = useState(null);

  // Tabs structure
  const tabs = [
    { id: 'scholarship', name: 'Scholarship Hub', icon: Award },
    { id: 'casestudy', name: 'Case Studies', icon: FileText },
    { id: 'admission', name: 'Entrance & Admission Alerts', icon: BookOpen },
    { id: 'scheme', name: 'Government Schemes', icon: Building },
    { id: 'hostel', name: 'Hostel & Accommodation', icon: Building2 },
    { id: 'livelihood', name: 'Internships & Livelihood', icon: Briefcase },
    { id: 'career', name: 'Career Guidance (Post-12th)', icon: Compass },
    { id: 'mentorship', name: 'Mentorship Platform', icon: Users },
    { id: 'volunteer', name: 'Volunteer Network', icon: HandHelping }
  ];

  // Fetch opportunities and volunteers
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const oppRes = await fetch('/api/opportunities');
        if (oppRes.ok) {
          const oppData = await oppRes.json();
          setOpportunities(oppData);
        }
        
        const volRes = await fetch('/api/volunteers');
        if (volRes.ok) {
          const volData = await volRes.json();
          setVolunteers(volData);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Update URL search param on tab click
  const handleTabChange = (tabId) => {
    setSearchParams({ tab: tabId });
    setActiveFilter('All');
    setSearchQuery('');
  };

  // Get active filters for each tab
  const getFilters = () => {
    switch (activeTab) {
      case 'scholarship':
        return ['All', 'Government', 'Private', 'Individual support'];
      case 'casestudy':
        return ['All', 'Success Story', 'Social Impact', 'Career Growth'];
      case 'scheme':
        return ['All', 'Pension', 'Social Protection', 'Education', 'Health'];
      case 'career':
        return ['All', 'After 10th', 'After 12th', 'Skill-based work'];
      default:
        return [];
    }
  };

  // Apply filters and searches
  const getFilteredData = () => {
    if (activeTab === 'volunteer') {
      return volunteers.filter(vol => {
        const matchesSearch = 
          vol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vol.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vol.specialty.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
      });
    }

    return opportunities.filter(opp => {
      // Must match active tab category
      if (opp.category !== activeTab) return false;

      // Automatically hide expired opportunities
      if (isExpired(opp.deadline)) return false;

      // Filter query match
      const matchesSearch = 
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.eligibility.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter pill match
      if (activeFilter === 'All') return matchesSearch;
      
      const matchesFilter = opp.type && opp.type.toLowerCase() === activeFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  };

  const filteredItems = getFilteredData();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#0a2540] via-[#0d3b60] to-[#0a2540] text-white py-20 px-4 sm:px-6 lg:px-8 animate-gradient-flow">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:32px_32px]"></div>
        
        <div className="relative max-w-7xl mx-auto space-y-5 animate-fadeIn">
          <span className="text-[10px] font-extrabold text-brand-gold uppercase tracking-widest bg-brand-gold/10 px-3.5 py-1.5 rounded-full border border-brand-gold/20 w-fit block backdrop-blur-md">
            {t('LIVE PREVIEW WITH SAMPLE DATA')}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {t('nav.subtitle')}
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mt-6">
            <Search className="absolute left-4.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-200" />
            <input
              type="text"
              placeholder={activeTab === 'volunteer' ? t('dash.search.volunteer') : t('dash.search.opportunity')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-13 pr-4 py-4 rounded-2xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-brand-gold text-white placeholder-white/60 text-sm sm:text-base backdrop-blur-md transition-all focus:border-transparent focus:bg-white/15"
            />
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="bg-white border-b border-slate-100 shadow-sm sticky top-20 z-40 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-6 py-5 border-b-2 font-bold text-sm whitespace-nowrap transition-all duration-200 ${
                  isTabActive
                    ? 'border-brand-navy text-brand-navy bg-slate-50/50'
                    : 'border-transparent text-slate-600 hover:text-brand-navy hover:bg-slate-50/20'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 transition-transform duration-200 ${isTabActive ? 'text-brand-navy scale-105' : 'text-slate-500'}`} />
                {t(tab.name)}
              </button>
            );
          })}
        </div>
      </section>

      {/* Filters & Grid Section */}
      <section className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-slate-50/30">
        <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
          
          {/* Filter Pills */}
          {getFilters().length > 0 && (
            <div className="flex flex-wrap gap-2">
              {getFilters().map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                    activeFilter === filter
                      ? 'bg-brand-navy text-white shadow-md shadow-brand-navy/10'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  {t(filter)}
                </button>
              ))}
            </div>
          )}

          {/* Load indicator */}
          {loading ? (
            <div className="text-center py-24">
              <div className="w-12 h-12 border-4 border-brand-navy border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-600 font-semibold mt-4 text-sm">{t('dash.loading')}</p>
            </div>
          ) : filteredItems.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center text-center py-24 px-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-4">
              <div className="p-5 bg-slate-50 rounded-full text-slate-500 border border-slate-100/50">
                {activeTab === 'volunteer' ? (
                  <HandHelping className="h-12 w-12" />
                ) : (
                  <AlertCircle className="h-12 w-12" />
                )}
              </div>
              <h3 className="text-xl font-bold text-brand-dark">
                {activeTab === 'hostel' ? t('dash.empty.hostel.title') : t('dash.empty.title')}
              </h3>
              <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                {activeTab === 'hostel' 
                  ? t('dash.empty.hostel.desc') 
                  : t('dash.empty.desc')}
              </p>
            </div>
          ) : (
            /* Listings Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Opportunities rendering */}
              {activeTab !== 'volunteer' && filteredItems.map((opp) => (
                <div
                  key={opp._id}
                  onClick={() => setSelectedOpp(opp)}
                  className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:border-brand-gold/30 hover:-translate-y-1 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-brand-dark line-clamp-2 leading-snug">
                        {tVal(opp.title)}
                      </h3>
                      {opp.type && (
                        <span className="text-[9px] font-extrabold uppercase bg-brand-navy/5 text-brand-navy px-2 py-0.5 rounded-md shrink-0">
                          {t(opp.type)}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">
                      {tVal(opp.provider)}
                    </p>
                    
                    <div className="space-y-3 pt-4 border-t border-slate-50">
                      {opp.deadline && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                          <Clock className="h-4.5 w-4.5 text-slate-500 shrink-0" />
                          <span>{t('dash.card.deadline')} <strong className="text-slate-700">{tVal(opp.deadline)}</strong></span>
                        </div>
                      )}
                      {opp.amount && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                          <IndianRupee className="h-4.5 w-4.5 text-slate-500 shrink-0" />
                          <span>{t('dash.card.benefit')} <strong className="text-slate-700">{tVal(opp.amount)}</strong></span>
                        </div>
                      )}
                      {opp.eligibility && (
                        <div className="flex items-start gap-2 text-xs font-semibold text-slate-600">
                          <ShieldCheck className="h-4.5 w-4.5 text-slate-500 shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{t('dash.card.eligibility')} <strong className="text-slate-700">{tVal(opp.eligibility)}</strong></span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs font-bold text-brand-navy hover:text-brand-gold pt-6 transition-colors">
                    <span>{t('dash.card.view')}</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              ))}

              {/* Volunteers rendering */}
              {activeTab === 'volunteer' && filteredItems.map((vol) => (
                <div
                  key={vol._id}
                  className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-lg transition-shadow"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-brand-dark">
                          {vol.name}
                        </h3>
                        <p className="text-xs font-semibold text-slate-500">
                          {tVal(vol.specialty)}
                        </p>
                      </div>
                      <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                        vol.status === 'available'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {vol.status === 'available' ? t('AVAILABLE') : t('BUSY')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 pt-2 border-t border-slate-50">
                      <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                      <span>{t('dash.card.city')} <strong className="text-slate-700">{tVal(vol.city)}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => setContactVolunteer(vol)}
                    className="w-full mt-6 py-2.5 border border-slate-200 hover:border-brand-navy hover:bg-slate-50 text-slate-700 hover:text-brand-navy font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Mail className="h-4.5 w-4.5" />
                    {t('dash.card.contact')}
                  </button>
                </div>
              ))}

            </div>
          )}
        </div>
      </section>

      {/* Slide-Over Details Drawer */}
      {selectedOpp && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white w-full max-w-lg shadow-2xl border-l border-slate-100 flex flex-col h-full animate-slideIn">
            
            {/* Header */}
            <div className="p-6 bg-brand-dark text-white relative flex justify-between items-start">
              <div>
                {selectedOpp.type && (
                  <span className="text-[9px] font-extrabold uppercase bg-brand-gold text-brand-dark px-2.5 py-0.5 rounded-md block w-fit mb-2">
                    {t(selectedOpp.type)}
                  </span>
                )}
                <h3 className="text-lg sm:text-xl font-extrabold leading-snug">
                  {tVal(selectedOpp.title)}
                </h3>
                <p className="text-slate-200 text-xs font-bold uppercase tracking-wider mt-1.5">
                  {tVal(selectedOpp.provider)}
                </p>
              </div>
              <button 
                onClick={() => setSelectedOpp(null)}
                className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all ml-4"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Content Body */}
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
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Description</h4>
                  <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 border border-slate-100 rounded-2xl">
                    {tVal(selectedOpp.description)}
                  </p>
                </div>
              )}
            </div>

            {/* Actions Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
              {selectedOpp.link && (
                <a
                  href={selectedOpp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow py-3 px-4 bg-brand-navy hover:bg-brand-dark text-white font-extrabold text-center rounded-xl shadow-md text-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <span>{t('drawer.apply')}</span>
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
              <button
                onClick={() => setSelectedOpp(null)}
                className="px-6 py-3 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 font-bold text-sm transition-all"
              >
                {t('drawer.close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Volunteer Contact Details Modal */}
      {contactVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100">
            <div className="p-6 bg-brand-navy text-white relative">
              <button 
                onClick={() => setContactVolunteer(null)}
                className="absolute right-4 top-4 text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-extrabold">
                {t('drawer.vol.title')}
              </h3>
              <p className="text-slate-300 text-xs mt-1">
                {t('drawer.vol.desc')}
              </p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-50">
                  <span className="text-slate-500 text-xs font-semibold">{t('drawer.vol.name')}</span>
                  <span className="text-slate-900 font-bold text-base">{contactVolunteer.name}</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-50">
                  <span className="text-slate-500 text-xs font-semibold">{t('drawer.vol.spec')}</span>
                  <span className="text-slate-800 font-bold text-sm">{tVal(contactVolunteer.specialty)}</span>
                </div>
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-50">
                  <span className="text-slate-500 text-xs font-semibold">{t('drawer.vol.loc')}</span>
                  <span className="text-slate-800 font-bold text-sm">{tVal(contactVolunteer.city)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-semibold">{t('drawer.vol.status')}</span>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                    contactVolunteer.status === 'available' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {contactVolunteer.status === 'available' ? t('AVAILABLE') : t('BUSY')}
                  </span>
                </div>
              </div>

              {contactVolunteer.contact && (
                <div className="bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100 mt-4">
                  <div className="bg-brand-navy/5 p-2 rounded-xl text-brand-navy shrink-0"><Mail className="h-5 w-5" /></div>
                  <div>
                    <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wider">{t('drawer.vol.email')}</span>
                    <a href={`mailto:${contactVolunteer.contact}`} className="text-brand-navy font-bold text-sm hover:underline break-all">
                      {contactVolunteer.contact}
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setContactVolunteer(null)}
                className="px-6 py-2.5 bg-brand-navy hover:bg-brand-dark text-white rounded-xl text-sm font-bold transition-all"
              >
                {t('drawer.close')}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

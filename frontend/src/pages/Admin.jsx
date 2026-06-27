import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, Edit2, Trash2, Mail, Users, Award, 
  LogOut, Clock, CheckCircle2, AlertCircle, 
  Calendar, FileText, Globe, X, Paperclip
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

export default function Admin() {
  const { token, logout, user, hasPermission } = useAuth();
  const navigate = useNavigate();

  // If not logged in, redirect to login page. If role is 'user', block and redirect to home.
  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else if (user && user.role === 'user') {
      navigate('/');
    }
  }, [token, user, navigate]);

  const [activeTab, setActiveTab] = useState('opportunities');
  const [oppFilter, setOppFilter] = useState('all');
  const [opportunities, setOpportunities] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sub-admin form states
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPerms, setUserPerms] = useState({ view: true, edit: false, delete: false });

  const getTypeOptions = () => {
    switch (oppCategory) {
      case 'scholarship':
        return ['Government', 'Private', 'Individual support'];
      case 'scheme':
        return ['Pension', 'Social Protection', 'Education', 'Health'];
      case 'career':
        return ['After 10th', 'After 12th', 'Skill-based work'];
      case 'casestudy':
        return ['Success Story', 'Social Impact', 'Career Growth'];
      default:
        return ['General', 'Government', 'Private'];
    }
  };

  // Form states
  const [showOppForm, setShowOppForm] = useState(false);
  const [showVolForm, setShowVolForm] = useState(false);
  
  // Opp form inputs
  const [oppTitle, setOppTitle] = useState('');
  const [oppProvider, setOppProvider] = useState('');
  const [oppCategory, setOppCategory] = useState('scholarship');
  const [oppType, setOppType] = useState('');
  const [oppDeadline, setOppDeadline] = useState('');
  const [oppCurrency, setOppCurrency] = useState('₹');
  const [oppAmountVal, setOppAmountVal] = useState('');
  const [oppEligibility, setOppEligibility] = useState('');
  const [oppDescription, setOppDescription] = useState('');
  const [oppLink, setOppLink] = useState('');
  const [oppAttachmentUrl, setOppAttachmentUrl] = useState('');
  const [oppAttachmentName, setOppAttachmentName] = useState('');
  const [oppAttachmentUploading, setOppAttachmentUploading] = useState(false);
  const [oppAttachmentError, setOppAttachmentError] = useState('');
  const [editingOppId, setEditingOppId] = useState(null);

  // Vol form inputs
  const [volName, setVolName] = useState('');
  const [volSpecialty, setVolSpecialty] = useState('');
  const [volCity, setVolCity] = useState('');
  const [volStatus, setVolStatus] = useState('available');
  const [volContact, setVolContact] = useState('');
  const [editingVolId, setEditingVolId] = useState(null);

  // Error/Success indicators
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Fetch all admin data
  const fetchAdminData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      // Fetch Opps
      const oppRes = await fetch('/api/opportunities');
      if (oppRes.ok) setOpportunities(await oppRes.json());
      
      // Fetch Volunteers
      const volRes = await fetch('/api/volunteers');
      if (volRes.ok) setVolunteers(await volRes.json());

      // Fetch Messages (Authorized)
      const msgRes = await fetch('/api/contact', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (msgRes.ok) setMessages(await msgRes.json());

    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchUsers = useCallback(async () => {
    if (!token || user?.role !== 'admin') return;
    try {
      const res = await fetch('/api/auth/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setUsers(await res.json());
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }, [token, user]);

  useEffect(() => {
    // Avoid synchronous state update during effect dispatch by scheduling it
    const load = async () => {
      await fetchAdminData();
      if (user?.role === 'admin') {
        await fetchUsers();
      }
    };
    load();
  }, [fetchAdminData, fetchUsers, user]);

  const resetUserForm = () => {
    setEditingUserId(null);
    setUserName('');
    setUserPassword('');
    setUserPerms({ view: true, edit: false, delete: false });
    setShowUserForm(false);
    setActionError('');
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    if (!userName || (!editingUserId && !userPassword)) {
      setActionError('Username and password are required.');
      return;
    }

    const payload = {
      username: userName,
      permissions: userPerms
    };
    if (userPassword) payload.password = userPassword;

    try {
      const url = editingUserId 
        ? `/api/auth/users/${editingUserId}`
        : '/api/auth/users';
      const method = editingUserId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setActionSuccess(editingUserId ? 'User permissions updated!' : 'New sub-admin created!');
        resetUserForm();
        fetchUsers();
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        const errData = await res.json();
        setActionError(errData.msg || 'Save failed.');
      }
    } catch (err) {
      console.error('Error saving user:', err);
      setActionError('Network error occurred.');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sub-admin?')) return;
    try {
      const res = await fetch(`/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setActionSuccess('Sub-admin deleted.');
        fetchUsers();
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        const errData = await res.json();
        setActionError(errData.msg || 'Deletion failed.');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
      setActionError('Deletion failed.');
    }
  };

  const startEditUser = (u) => {
    setEditingUserId(u._id);
    setUserName(u.username);
    setUserPassword('');
    setUserPerms(u.permissions || { view: true, edit: false, delete: false });
    setShowUserForm(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setOppAttachmentUploading(true);
    setOppAttachmentError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/opportunities/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setOppAttachmentUrl(data.url);
        setOppAttachmentName(data.name);
      } else {
        setOppAttachmentError(data.msg || 'Upload failed.');
      }
    } catch (err) {
      console.error(err);
      setOppAttachmentError('Upload failed due to network error.');
    } finally {
      setOppAttachmentUploading(false);
    }
  };

  const handleOppSubmit = async (e) => {
    e.preventDefault();
    if (!oppTitle || !oppProvider || !oppCategory) {
      setActionError('Title, Provider, and Category are required.');
      return;
    }

    const payload = {
      title: oppTitle,
      provider: oppProvider,
      category: oppCategory,
      type: oppType,
      deadline: oppDeadline,
      amount: oppCurrency + oppAmountVal,
      eligibility: oppEligibility,
      description: oppDescription,
      link: oppLink,
      attachment: oppAttachmentUrl ? { url: oppAttachmentUrl, name: oppAttachmentName } : null
    };

    try {
      const url = editingOppId 
        ? `/api/opportunities/${editingOppId}`
        : '/api/opportunities';
      
      const method = editingOppId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setActionSuccess(editingOppId ? 'Opportunity updated successfully!' : 'New opportunity created!');
        resetOppForm();
        fetchAdminData();
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        const errData = await res.json();
        setActionError(errData.msg || 'Save failed.');
      }
    } catch (err) {
      console.error('Error saving opportunity:', err);
      setActionError('Network error occurred.');
    }
  };

  const handleVolSubmit = async (e) => {
    e.preventDefault();
    if (!volName || !volCity) {
      setActionError('Name and City are required.');
      return;
    }

    const payload = {
      name: volName,
      specialty: volSpecialty,
      city: volCity,
      status: volStatus,
      contact: volContact
    };

    try {
      const url = editingVolId
        ? `/api/volunteers/${editingVolId}`
        : '/api/volunteers';
      
      const method = editingVolId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setActionSuccess(editingVolId ? 'Volunteer profile updated!' : 'New volunteer added!');
        resetVolForm();
        fetchAdminData();
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        const errData = await res.json();
        setActionError(errData.msg || 'Save failed.');
      }
    } catch (err) {
      console.error('Error saving volunteer:', err);
      setActionError('Network error occurred.');
    }
  };

  const deleteOpp = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
    try {
      const res = await fetch(`/api/opportunities/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setActionSuccess('Opportunity deleted successfully.');
        fetchAdminData();
        setTimeout(() => setActionSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error deleting opportunity:', err);
      setActionError('Deletion failed.');
    }
  };

  const deleteVol = async (id) => {
    if (!window.confirm('Are you sure you want to delete this volunteer?')) return;
    try {
      const res = await fetch(`/api/volunteers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setActionSuccess('Volunteer profile removed.');
        fetchAdminData();
        setTimeout(() => setActionSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error deleting volunteer:', err);
      setActionError('Deletion failed.');
    }
  };

  const toggleMessageFixed = async (id, currentFixed) => {
    try {
      const res = await fetch(`/api/contact/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fixed: !currentFixed })
      });

      if (res.ok) {
        setActionSuccess('Message status updated successfully!');
        setMessages(prev => prev.map(msg => msg._id === id ? { ...msg, fixed: !currentFixed } : msg));
        setTimeout(() => setActionSuccess(''), 3000);
      } else {
        const errData = await res.json();
        setActionError(errData.msg || 'Update failed.');
      }
    } catch (err) {
      console.error('Error updating message status:', err);
      setActionError('Network error occurred.');
    }
  };

  const startEditOpp = (opp) => {
    setEditingOppId(opp._id);
    setOppTitle(opp.title);
    setOppProvider(opp.provider);
    setOppCategory(opp.category);
    setOppType(opp.type || '');
    setOppDeadline(opp.deadline || '');
    
    const amountStr = opp.amount || '';
    if (amountStr.startsWith('₹')) {
      setOppCurrency('₹');
      setOppAmountVal(amountStr.substring(1));
    } else if (amountStr.startsWith('$')) {
      setOppCurrency('$');
      setOppAmountVal(amountStr.substring(1));
    } else {
      setOppCurrency('');
      setOppAmountVal(amountStr);
    }
    
    setOppEligibility(opp.eligibility || '');
    setOppDescription(opp.description || '');
    setOppLink(opp.link || '');
    setOppAttachmentUrl(opp.attachment?.url || '');
    setOppAttachmentName(opp.attachment?.name || '');
    setOppAttachmentError('');
    setShowOppForm(true);
  };

  const resetOppForm = () => {
    setEditingOppId(null);
    setOppTitle('');
    setOppProvider('');
    setOppCategory('scholarship');
    setOppType('Government');
    setOppDeadline('');
    setOppCurrency('₹');
    setOppAmountVal('');
    setOppEligibility('');
    setOppDescription('');
    setOppLink('');
    setOppAttachmentUrl('');
    setOppAttachmentName('');
    setOppAttachmentUploading(false);
    setOppAttachmentError('');
    setShowOppForm(false);
    setActionError('');
  };

  const startEditVol = (vol) => {
    setEditingVolId(vol._id);
    setVolName(vol.name);
    setVolSpecialty(vol.specialty || '');
    setVolCity(vol.city);
    setVolStatus(vol.status || 'available');
    setVolContact(vol.contact || '');
    setShowVolForm(true);
  };

  const resetVolForm = () => {
    setEditingVolId(null);
    setVolName('');
    setVolSpecialty('');
    setVolCity('');
    setVolStatus('available');
    setVolContact('');
    setShowVolForm(false);
    setActionError('');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-[#0a2540] via-[#0d3b60] to-[#0a2540] text-white py-12 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">Admin Portal</h1>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Logged in as <strong className="text-brand-gold">{user?.username || 'Admin'}</strong>
            </p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-4.5 py-2.5 border border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 font-bold rounded-xl text-sm transition-all"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </section>

      {/* Success/Error Alerts */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {actionSuccess && (
          <div className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl flex items-center gap-2 text-xs font-semibold shadow-sm animate-fadeIn">
            <CheckCircle2 className="h-4 w-4" />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl flex items-center gap-2 text-xs font-semibold shadow-sm animate-fadeIn">
            <AlertCircle className="h-4 w-4" />
            <span>{actionError}</span>
          </div>
        )}
      </div>

      {/* Quick Statistics Banner */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-blue-50 text-blue-500 p-3.5 rounded-xl border border-blue-100/50"><Award className="h-6 w-6" /></div>
            <div>
              <span className="text-2xl font-extrabold text-slate-800 tracking-tight">{opportunities.length}</span>
              <span className="text-slate-500 text-[10px] uppercase font-bold block tracking-wider mt-0.5">Opportunities</span>
            </div>
          </div>
          <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-teal-50 text-teal-500 p-3.5 rounded-xl border border-teal-100/50"><Users className="h-6 w-6" /></div>
            <div>
              <span className="text-2xl font-extrabold text-slate-800 tracking-tight">{volunteers.length}</span>
              <span className="text-slate-500 text-[10px] uppercase font-bold block tracking-wider mt-0.5">Volunteers</span>
            </div>
          </div>
          <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="bg-purple-50 text-purple-500 p-3.5 rounded-xl border border-purple-100/50"><Mail className="h-6 w-6" /></div>
            <div>
              <span className="text-2xl font-extrabold text-slate-800 tracking-tight">{messages.length}</span>
              <span className="text-slate-500 text-[10px] uppercase font-bold block tracking-wider mt-0.5">Messages Inbox</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Tab Bar */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 mt-8 border-b border-slate-200">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('opportunities')}
            className={`pb-4 border-b-2 font-bold text-sm whitespace-nowrap transition-all duration-200 ${
              activeTab === 'opportunities' ? 'border-brand-navy text-brand-navy' : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Manage Opportunities
          </button>
          <button
            onClick={() => setActiveTab('volunteers')}
            className={`pb-4 border-b-2 font-bold text-sm whitespace-nowrap transition-all duration-200 ${
              activeTab === 'volunteers' ? 'border-brand-navy text-brand-navy' : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Manage Volunteers
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-4 border-b-2 font-bold text-sm whitespace-nowrap transition-all duration-200 ${
              activeTab === 'messages' ? 'border-brand-navy text-brand-navy' : 'border-transparent text-slate-600 hover:text-slate-800'
            }`}
          >
            Contact Messages ({messages.length})
          </button>
          {user?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('team')}
              className={`pb-4 border-b-2 font-bold text-sm whitespace-nowrap transition-all duration-200 ${
                activeTab === 'team' ? 'border-brand-navy text-brand-navy' : 'border-transparent text-slate-600 hover:text-slate-800'
              }`}
            >
              Manage Team
            </button>
          )}
        </div>
      </section>

      {/* Main Content Areas */}
      <section className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        {loading ? (
          <div className="text-center py-24">
            <div className="w-10 h-10 border-4 border-brand-navy border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 text-sm font-semibold mt-3">Fetching data...</p>
          </div>
        ) : (
          <div>
            {/* Tab: Opportunities */}
            {activeTab === 'opportunities' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-bold text-brand-dark">Active Opportunities</h2>
                    <select
                      value={oppFilter}
                      onChange={(e) => setOppFilter(e.target.value)}
                      className="text-xs font-semibold px-3 py-1.5 border border-slate-200 rounded-xl bg-white text-slate-600 focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    >
                      <option value="all">All Modules</option>
                      <option value="scholarship">Scholarship Hub</option>
                      <option value="casestudy">Case Studies</option>
                      <option value="admission">Entrance Alerts</option>
                      <option value="scheme">Government Schemes</option>
                      <option value="hostel">Hostel & Accommodation</option>
                      <option value="livelihood">Internships & Livelihood</option>
                      <option value="career">Career Guidance</option>
                      <option value="mentorship">Mentorship Platform</option>
                    </select>
                  </div>
                  {hasPermission('edit') && (
                    <button
                      onClick={() => { 
                        resetOppForm(); 
                        if (oppFilter !== 'all') {
                          setOppCategory(oppFilter);
                        }
                        setShowOppForm(true); 
                      }}
                      className="flex items-center gap-1.5 px-4.5 py-2.5 bg-brand-navy text-white text-sm font-bold rounded-xl hover:bg-brand-dark transition-all shadow-md"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Opportunity</span>
                    </button>
                  )}
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                          <th className="py-4.5 px-6">Opportunity Title</th>
                          <th className="py-4.5 px-6">Category</th>
                          <th className="py-4.5 px-6">Provider</th>
                          <th className="py-4.5 px-6">Deadline</th>
                          <th className="py-4.5 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
                        {opportunities
                          .filter((opp) => oppFilter === 'all' || opp.category === oppFilter)
                          .map((opp) => (
                            <tr key={opp._id} className="hover:bg-slate-50/40">
                            <td className="py-4 px-6 font-bold text-slate-800">{opp.title}</td>
                            <td className="py-4 px-6 text-[10px] font-extrabold uppercase tracking-wider text-slate-500">{opp.category}</td>
                            <td className="py-4 px-6 text-xs font-semibold">{opp.provider}</td>
                            <td className="py-4 px-6 text-xs text-slate-500 font-semibold">
                               <div className="flex flex-col gap-1">
                                 <span>{opp.deadline}</span>
                                 {isExpired(opp.deadline) && (
                                   <span className="text-[9px] font-extrabold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-100 px-1.5 py-0.5 rounded w-fit">
                                     Expired
                                   </span>
                                 )}
                               </div>
                             </td>
                            <td className="py-4 px-6 text-right flex justify-end gap-2.5">
                              <button
                                onClick={() => startEditOpp(opp)}
                                className="p-2 border border-slate-200 text-slate-500 rounded-xl hover:border-brand-navy hover:text-brand-navy transition-all"
                                title="Edit"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => deleteOpp(opp._id)}
                                className="p-2 border border-rose-100 text-rose-500 rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-all"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Volunteers */}
            {activeTab === 'volunteers' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-brand-dark">Volunteer Roster</h2>
                  {hasPermission('edit') && (
                    <button
                      onClick={() => { resetVolForm(); setShowVolForm(true); }}
                      className="flex items-center gap-1.5 px-4.5 py-2.5 bg-brand-navy text-white text-sm font-bold rounded-xl hover:bg-brand-dark transition-all shadow-md"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Volunteer</span>
                    </button>
                  )}
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                          <th className="py-4.5 px-6">Name</th>
                          <th className="py-4.5 px-6">Specialty</th>
                          <th className="py-4.5 px-6">City</th>
                          <th className="py-4.5 px-6">Status</th>
                          <th className="py-4.5 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
                        {volunteers.map((vol) => (
                          <tr key={vol._id} className="hover:bg-slate-50/40">
                            <td className="py-4 px-6 font-bold text-slate-800">{vol.name}</td>
                            <td className="py-4 px-6 text-xs font-semibold">{vol.specialty}</td>
                            <td className="py-4 px-6 text-xs font-semibold">{vol.city}</td>
                            <td className="py-4 px-6">
                              <span className={`text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-md ${
                                vol.status === 'available'
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                  : 'bg-slate-100 text-slate-500 border border-slate-200'
                              }`}>
                                {vol.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right flex justify-end gap-2.5">
                              {hasPermission('edit') && (
                                <button
                                  onClick={() => startEditVol(vol)}
                                  className="p-2 border border-slate-200 text-slate-500 rounded-xl hover:border-brand-navy hover:text-brand-navy transition-all"
                                  title="Edit"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                              {hasPermission('delete') && (
                                <button
                                  onClick={() => deleteVol(vol._id)}
                                  className="p-2 border border-rose-100 text-rose-500 rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-all"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              )}
                              {!hasPermission('edit') && !hasPermission('delete') && (
                                <span className="text-xs text-slate-400 italic">View Only</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Messages */}
            {activeTab === 'messages' && (
              <div className="space-y-6 animate-fadeIn">
                <h2 className="text-lg font-bold text-brand-dark">Inbox Messages</h2>
                
                {messages.length === 0 ? (
                  <div className="bg-white border border-slate-100 p-16 rounded-3xl text-center text-slate-500 font-semibold shadow-sm">
                    No messages received yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {messages.map((msg) => (
                      <div
                        key={msg._id}
                        className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-slate-100/50">
                          <div>
                            <div className="flex items-center gap-3">
                              <h3 className="font-extrabold text-brand-dark text-base">{msg.name}</h3>
                              <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${
                                msg.fixed 
                                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                                  : 'bg-rose-50 text-rose-600 border border-rose-100'
                              }`}>
                                {msg.fixed ? 'Fixed' : 'Pending'}
                              </span>
                            </div>
                            <a href={`mailto:${msg.email}`} className="text-xs text-brand-navy font-bold hover:underline flex items-center gap-1 mt-0.5">
                              <Mail className="h-3.5 w-3.5" />
                              <span>{msg.email}</span>
                            </a>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            {hasPermission('edit') && (
                              <button
                                onClick={() => toggleMessageFixed(msg._id, msg.fixed)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                                  msg.fixed
                                    ? 'border-slate-200 text-slate-500 hover:bg-slate-50'
                                    : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                                }`}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                <span>{msg.fixed ? 'Mark Pending' : 'Mark Fixed'}</span>
                              </button>
                            )}
                            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">
                              <Clock className="h-3.5 w-3.5" />
                              {new Date(msg.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 border border-slate-100/50 rounded-2xl">
                          {msg.message}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Team Management */}
            {activeTab === 'team' && user?.role === 'admin' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-brand-dark">Team Members (Sub-Admins)</h2>
                  <button
                    onClick={() => { resetUserForm(); setShowUserForm(true); }}
                    className="flex items-center gap-1.5 px-4.5 py-2.5 bg-brand-navy text-white text-sm font-bold rounded-xl hover:bg-brand-dark transition-all shadow-md"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Sub-Admin</span>
                  </button>
                </div>

                <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                          <th className="py-4.5 px-6">Username</th>
                          <th className="py-4.5 px-6">Role</th>
                          <th className="py-4.5 px-6">Permissions</th>
                          <th className="py-4.5 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-sm text-slate-600">
                        {users.map((u) => (
                          <tr key={u._id} className="hover:bg-slate-50/40">
                            <td className="py-4 px-6 font-bold text-slate-800">{u.username}</td>
                            <td className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500">
                              <span className={`px-2 py-0.5 rounded ${u.role === 'admin' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex gap-2">
                                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${u.permissions?.view ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                  View
                                </span>
                                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${u.permissions?.edit ? 'bg-blue-50 text-blue-600 border border-blue-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                  Edit
                                </span>
                                <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded ${u.permissions?.delete ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                  Delete
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-right flex justify-end gap-2.5">
                              {u.role !== 'admin' ? (
                                <>
                                  <button
                                    onClick={() => startEditUser(u)}
                                    className="p-2 border border-slate-200 text-slate-500 rounded-xl hover:border-brand-navy hover:text-brand-navy transition-all"
                                    title="Edit Permissions"
                                  >
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    onClick={() => deleteUser(u._id)}
                                    className="p-2 border border-rose-100 text-rose-500 rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-all"
                                    title="Delete User"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </>
                              ) : (
                                <span className="text-xs text-slate-400 italic font-semibold">Primary Account</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Modal: Opportunity Form */}
      {showOppForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
            <div className="p-6 bg-brand-dark text-white relative">
              <button
                onClick={resetOppForm}
                className="absolute right-5 top-5 text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-extrabold">
                {editingOppId ? 'Edit Opportunity' : 'Add Opportunity'}
              </h3>
            </div>
            
            <form onSubmit={handleOppSubmit} className="flex-1 overflow-y-auto p-6 space-y-4.5 custom-scrollbar">
              <div>
                <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Title</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={oppTitle}
                    onChange={(e) => setOppTitle(e.target.value)}
                    placeholder="Azim Premji Foundation Scholarship"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Provider</label>
                  <input
                    type="text"
                    value={oppProvider}
                    onChange={(e) => setOppProvider(e.target.value)}
                    placeholder="APF"
                    className="w-full px-4 py-3 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={oppCategory}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setOppCategory(newCat);
                      const defaultTypes = {
                        scholarship: 'Government',
                        scheme: 'Pension',
                        career: 'After 10th',
                        casestudy: 'Success Story'
                      };
                      setOppType(defaultTypes[newCat] || 'General');
                    }}
                    className="w-full px-4 py-3 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm bg-white"
                  >
                    <option value="scholarship">Scholarship Hub</option>
                    <option value="casestudy">Case Studies</option>
                    <option value="admission">Entrance Alerts</option>
                    <option value="scheme">Government Schemes</option>
                    <option value="hostel">Hostel & Accommodation</option>
                    <option value="livelihood">Internships & Livelihood</option>
                    <option value="career">Career Guidance</option>
                    <option value="mentorship">Mentorship Platform</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Type / Pill</label>
                  <select
                    value={oppType}
                    onChange={(e) => setOppType(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm bg-white"
                  >
                    {getTypeOptions().map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Deadline</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                    <input
                       type="text"
                      value={oppDeadline}
                      onChange={(e) => setOppDeadline(e.target.value)}
                      placeholder="15 Nov 2025"
                      className="w-full pl-9 pr-4 py-3 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Amount</label>
                  <div className="flex gap-1">
                    <select
                      value={oppCurrency}
                      onChange={(e) => setOppCurrency(e.target.value)}
                      className="px-2 py-3 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm bg-white font-bold text-slate-700"
                    >
                      <option value="₹">₹</option>
                      <option value="$">$</option>
                      <option value="">None</option>
                    </select>
                    <input
                      type="text"
                      value={oppAmountVal}
                      onChange={(e) => setOppAmountVal(e.target.value)}
                      placeholder="30,000/yr"
                      className="w-full px-3 py-3 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Eligibility</label>
                <div className="relative">
                  <CheckCircle2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={oppEligibility}
                    onChange={(e) => setOppEligibility(e.target.value)}
                    placeholder="UG students, merit + need"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Source URL / Link</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={oppLink}
                    onChange={(e) => setOppLink(e.target.value)}
                    placeholder="https://azimpremjifoundation.org"
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Description</label>
                <textarea
                  value={oppDescription}
                  onChange={(e) => setOppDescription(e.target.value)}
                  placeholder="Write description or application details..."
                  rows="3"
                  className="w-full px-4 py-3 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">File Attachment</label>
                <div className="border border-dashed border-slate-200 rounded-2xl p-4.5 bg-slate-50/20 space-y-2">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl cursor-pointer transition-all">
                      <Paperclip className="h-4 w-4 text-slate-500" />
                      <span>{oppAttachmentUploading ? 'Uploading...' : 'Choose File'}</span>
                      <input
                        type="file"
                        onChange={handleFileChange}
                        disabled={oppAttachmentUploading}
                        className="hidden"
                      />
                    </label>
                    <span className="text-[11px] text-slate-400">PDF, PNG, JPG or any doc up to 10MB</span>
                  </div>

                  {oppAttachmentName && (
                    <div className="flex items-center justify-between p-2 bg-emerald-50/30 border border-emerald-100 rounded-xl text-xs font-bold text-emerald-800 animate-fadeIn">
                      <span className="truncate max-w-[250px]">{oppAttachmentName}</span>
                      <button
                        type="button"
                        onClick={() => { setOppAttachmentUrl(''); setOppAttachmentName(''); }}
                        className="text-rose-500 hover:text-rose-700 p-1 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  {oppAttachmentError && (
                    <div className="text-[11px] font-bold text-rose-500 animate-fadeIn">
                      {oppAttachmentError}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100 font-bold">
                <button
                  type="submit"
                  className="flex-grow py-3.5 bg-brand-navy hover:bg-brand-dark text-white rounded-xl font-bold text-sm shadow-md"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={resetOppForm}
                  className="px-6 py-3.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 text-sm font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Volunteer Form */}
      {showVolForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-fadeIn">
            <div className="p-6 bg-brand-dark text-white relative">
              <button
                onClick={resetVolForm}
                className="absolute right-5 top-5 text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-extrabold">
                {editingVolId ? 'Edit Volunteer' : 'Add Volunteer'}
              </h3>
            </div>
            
            <form onSubmit={handleVolSubmit} className="p-6 space-y-4.5">
              <div>
                <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Volunteer Name</label>
                <input
                  type="text"
                  value={volName}
                  onChange={(e) => setVolName(e.target.value)}
                  placeholder="Shishupal"
                  className="w-full px-4 py-3 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Specialty</label>
                <input
                  type="text"
                  value={volSpecialty}
                  onChange={(e) => setVolSpecialty(e.target.value)}
                  placeholder="Career & schemes"
                  className="w-full px-4 py-3 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">City</label>
                  <input
                    type="text"
                    value={volCity}
                    onChange={(e) => setVolCity(e.target.value)}
                    placeholder="Delhi"
                    className="w-full px-4 py-3 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Status</label>
                  <select
                    value={volStatus}
                    onChange={(e) => setVolStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm bg-white"
                  >
                    <option value="available">Available</option>
                    <option value="busy">Busy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Contact Info (Email)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    value={volContact}
                    onChange={(e) => setVolContact(e.target.value)}
                    placeholder="volunteer@kursathfoundation.org"
                    className="w-full pl-9 pr-4 py-3 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-grow py-3.5 bg-brand-navy hover:bg-brand-dark text-white rounded-xl font-bold text-sm shadow-md"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={resetVolForm}
                  className="px-6 py-3.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 text-sm font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Sub-Admin Form */}
      {showUserForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-100 animate-fadeIn">
            <div className="p-6 bg-brand-dark text-white relative">
              <button
                onClick={resetUserForm}
                className="absolute right-5 top-5 text-white/60 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
              <h3 className="text-xl font-extrabold">
                {editingUserId ? 'Edit Sub-Admin' : 'Add Sub-Admin'}
              </h3>
            </div>
            
            <form onSubmit={handleUserSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">Username</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="teammate_username"
                  disabled={!!editingUserId}
                  className="w-full px-4 py-3 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm disabled:bg-slate-50 disabled:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                  {editingUserId ? 'Change Password (Leave blank to keep current)' : 'Password'}
                </label>
                <input
                  type="password"
                  value={userPassword}
                  onChange={(e) => setUserPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 border border-slate-200 focus:ring-2 focus:ring-brand-navy/10 focus:border-brand-navy rounded-xl text-sm"
                />
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-1">Set Permissions</label>
                
                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">Allow View</span>
                    <span className="text-[10px] text-slate-400">Can view the admin dashboard lists.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={userPerms.view}
                    disabled
                    className="h-4.5 w-4.5 text-brand-navy rounded focus:ring-brand-navy border-slate-300"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors cursor-pointer" onClick={() => setUserPerms(prev => ({ ...prev, edit: !prev.edit }))}>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">Allow Edit</span>
                    <span className="text-[10px] text-slate-400">Can create and update opportunities/volunteers.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={userPerms.edit}
                    onChange={() => {}}
                    className="h-4.5 w-4.5 text-brand-navy rounded focus:ring-brand-navy border-slate-300 pointer-events-none"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors cursor-pointer" onClick={() => setUserPerms(prev => ({ ...prev, delete: !prev.delete }))}>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700">Allow Delete</span>
                    <span className="text-[10px] text-slate-400">Can delete opportunities and volunteers.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={userPerms.delete}
                    onChange={() => {}}
                    className="h-4.5 w-4.5 text-brand-navy rounded focus:ring-brand-navy border-slate-300 pointer-events-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-grow py-3.5 bg-brand-navy hover:bg-brand-dark text-white rounded-xl font-bold text-sm shadow-md"
                >
                  Save Sub-Admin
                </button>
                <button
                  type="button"
                  onClick={resetUserForm}
                  className="px-6 py-3.5 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-500 text-sm font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

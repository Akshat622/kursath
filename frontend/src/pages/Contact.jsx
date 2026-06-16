import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill out all fields.');
      return;
    }
    setSubmitting(true);
    setError('');
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        const data = await response.json();
        setError(data.msg || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Contact form submission error:', err);
      setError('Connection to server failed. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#0a2540] to-[#0d3b60] text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4 animate-fadeIn">
          <span className="text-xs sm:text-sm font-extrabold text-brand-gold uppercase tracking-wider block">
            {t('contact.badge')}
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {t('contact.heading')}
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
            {t('contact.subheading')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/50 flex-1">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm lg:col-span-7 space-y-6">
            {success ? (
              <div className="text-center py-10 space-y-4">
                <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto" />
                <h3 className="text-2xl font-extrabold text-brand-dark">{t('contact.form.success.heading')}</h3>
                <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                  {t('contact.form.success.desc')}
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 bg-brand-navy hover:bg-brand-dark text-white rounded-xl font-bold text-sm transition-all"
                >
                  {t('contact.form.success.again')}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-xs font-semibold">
                    {error}
                  </div>
                )}
                
                <div>
                  <label className="block text-slate-555 text-[10px] font-extrabold uppercase tracking-wider mb-2 text-slate-500">
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t('contact.form.name.placeholder')}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t('contact.form.email.placeholder')}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy text-sm transition-all"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 text-[10px] font-extrabold uppercase tracking-wider mb-2">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t('contact.form.message.placeholder')}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy text-sm transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-brand-navy hover:bg-brand-dark text-white font-extrabold rounded-xl shadow-sm text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  <span>{submitting ? t('contact.form.submitting') : t('contact.form.submit')}</span>
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xl font-extrabold text-brand-dark">{t('contact.reach.heading')}</h2>
            
            <div className="space-y-4">
              {/* Email */}
              <div className="bg-white p-6 border border-slate-100 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="bg-brand-navy/5 p-3 rounded-xl text-brand-navy shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] font-extrabold uppercase tracking-wider block">{t('contact.reach.email')}</span>
                  <a href="mailto:info@kursathfoundation.org" className="text-brand-dark hover:text-brand-navy font-bold text-sm">
                    info@kursathfoundation.org
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white p-6 border border-slate-100 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="bg-brand-navy/5 p-3 rounded-xl text-brand-navy shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] font-extrabold uppercase tracking-wider block">{t('contact.reach.phone')}</span>
                  <span className="text-brand-dark font-bold text-sm">
                    +91 98xxx xxxxx
                  </span>
                </div>
              </div>

              {/* Location */}
              <div className="bg-white p-6 border border-slate-100 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="bg-brand-navy/5 p-3 rounded-xl text-brand-navy shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] font-extrabold uppercase tracking-wider block">{t('contact.reach.locations')}</span>
                  <span className="text-brand-dark font-bold text-sm leading-relaxed block">
                    {t('Delhi')} · {t('Noida')} · {t('Kolkata')} · {t('Meerut')} · {t('Gurgaon')}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.modules': 'Modules',
    'nav.dashboard': 'Dashboard',
    'nav.contact': 'Contact us',
    'nav.signin': 'Sign in',
    'nav.signout': 'Sign out',
    'nav.admin': 'Admin',
    'nav.subtitle': 'Opportunity Dashboard',
    
    // Home Page
    'home.badge': 'A digital bridge to opportunity',
    'home.heading': 'Verified opportunities for every young Indian',
    'home.subheading': 'A single, trusted dashboard for scholarships, exams, schemes, mentorship and livelihood — built for last-mile access.',
    'home.explore': 'Explore Dashboard',
    'home.learnMore': 'Learn More',
    'home.stats.supported': 'STUDENTS SUPPORTED',
    'home.stats.cities': 'ACTIVE CITIES',
    'home.stats.schemes': 'SCHEMES TRACKED',
    'home.stats.mentors': 'MENTORS ONBOARDED',
    'home.modules.badge': 'Modules',
    'home.modules.heading': 'Eight modules. One dashboard.',
    'home.modules.subheading': 'Everything an underprivileged learner needs — from entrance alerts to government schemes — in one accessible place.',
    'home.pillars.verified.title': 'Verified Information',
    'home.pillars.verified.desc': 'Every listing is reviewed before it reaches a student.',
    'home.pillars.lastmile.title': 'Last-Mile Access',
    'home.pillars.lastmile.desc': 'Designed for low-end smartphones and limited bandwidth.',
    'home.pillars.community.title': 'Community First',
    'home.pillars.community.desc': 'Powered by volunteers in cities across India.',
    
    // About Page
    'about.badge': 'About',
    'about.heading': 'About Kursath Foundation',
    'about.desc': 'Kursath Foundation works at the last mile — connecting underprivileged youth to opportunities they have a right to, but often never hear about.',
    'about.mission.title': 'Our Mission',
    'about.mission.desc': 'To build a centralized, verified information ecosystem so that no young person misses a scholarship, exam or scheme due to lack of awareness.',
    'about.vision.title': 'Our Vision',
    'about.vision.desc': 'An India where every learner — regardless of city, caste or income — has equal access to information and mentorship.',
    'about.pillars.heading': 'What we stand for',
    
    // Contact Page
    'contact.badge': 'Contact us',
    'contact.heading': 'Get in touch',
    'contact.subheading': 'Partner with us, volunteer, or request information for your community.',
    'contact.form.name': 'Your Name',
    'contact.form.name.placeholder': 'Enter your full name',
    'contact.form.email': 'Email Address',
    'contact.form.email.placeholder': 'Enter your email address',
    'contact.form.message': 'How can we help?',
    'contact.form.message.placeholder': 'Write your message here...',
    'contact.form.submit': 'Send message',
    'contact.form.submitting': 'Sending message...',
    'contact.form.success.heading': 'Message Sent!',
    'contact.form.success.desc': 'Thank you for reaching out. A team member or volunteer will contact you shortly.',
    'contact.form.success.again': 'Send another message',
    'contact.reach.heading': 'Reach us',
    'contact.reach.email': 'Email Address',
    'contact.reach.phone': 'Phone Contact',
    'contact.reach.locations': 'Locations Supported',
    
    // Dashboard & Modules general
    'dash.search.opportunity': 'Search opportunities by title, provider, criteria...',
    'dash.search.volunteer': 'Search volunteers by name, city or specialty...',
    'dash.loading': 'Loading opportunities...',
    'dash.empty.title': 'No opportunities in this category yet',
    'dash.empty.hostel.title': 'No hostel listings yet',
    'dash.empty.desc': 'Curated articles and listings from our editorial team will appear here once published.',
    'dash.empty.hostel.desc': 'Verified hostel & accommodation listings will appear here once published.',
    'dash.card.deadline': 'Deadline:',
    'dash.card.benefit': 'Benefit:',
    'dash.card.eligibility': 'Eligibility:',
    'dash.card.view': 'View details',
    'dash.card.contact': 'Contact',
    'dash.card.city': 'City:',
    
    // Drawer/Modal
    'drawer.deadline': 'Deadline',
    'drawer.benefit': 'Benefit',
    'drawer.eligibility': 'Eligibility Criteria',
    'drawer.description': 'Description',
    'drawer.apply': 'Apply / View source',
    'drawer.close': 'Close',
    'drawer.vol.title': 'Contact Volunteer',
    'drawer.vol.desc': 'Reach out to get support on documentation and schemes.',
    'drawer.vol.name': 'Volunteer Name:',
    'drawer.vol.spec': 'Specialty:',
    'drawer.vol.loc': 'Location:',
    'drawer.vol.status': 'Availability Status:',
    'drawer.vol.email': 'Email Address',
    'footer.desc': 'Enabling Technologies for Underprivileged Communities. Connecting young learners to opportunities they have a right to.',
    'footer.impact': 'Built for impact.',
    
    // Login Page
    'login.badge': 'Access the admin dashboard.',
    'login.username': 'Username',
    'login.username.placeholder': 'Enter username',
    'login.password': 'Password',
    'login.password.placeholder': 'Enter password',
    'login.google': 'Continue with Google',
    'login.noaccount': "Don't have an account?",
    'login.signup': 'Sign up',
  },
  hi: {
    // Navbar
    'nav.home': 'होम',
    'nav.about': 'हमारे बारे में',
    'nav.modules': 'मॉड्यूल',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.contact': 'संपर्क',
    'nav.signin': 'लॉग इन',
    'nav.signout': 'लॉग आउट',
    'nav.admin': 'एडमिन',
    'nav.subtitle': 'अवसर डैशबोर्ड',
    
    // Home Page
    'home.badge': 'अवसरों का एक डिजिटल सेतु',
    'home.heading': 'हर युवा भारतीय के लिए सत्यापित अवसर',
    'home.subheading': 'छात्रवृत्ति, परीक्षा, योजनाओं, परामर्श और आजीविका के लिए एक एकल, विश्वसनीय डैशबोर्ड - अंतिम मील तक पहुँच के लिए निर्मित।',
    'home.explore': 'डैशबोर्ड देखें',
    'home.learnMore': 'अधिक जानें',
    'home.stats.supported': 'सहायता प्राप्त छात्र',
    'home.stats.cities': 'सक्रिय शहर',
    'home.stats.schemes': 'योजनाएं ट्रैक की गईं',
    'home.stats.mentors': 'शामिल किए गए मेंटर्स',
    'home.modules.badge': 'मॉड्यूल',
    'home.modules.heading': 'आठ मॉड्यूल। एक डैशबोर्ड।',
    'home.modules.subheading': 'एक वंचित शिक्षार्थी की जरूरत की हर चीज - प्रवेश अलर्ट से लेकर सरकारी योजनाओं तक - एक सुलभ स्थान पर।',
    'home.pillars.verified.title': 'सत्यापित जानकारी',
    'home.pillars.verified.desc': 'प्रत्येक लिस्टिंग छात्र तक पहुँचने से पहले समीक्षा की जाती है।',
    'home.pillars.lastmile.title': 'अंतिम-मील पहुंच',
    'home.pillars.lastmile.desc': 'कम-एंड स्मार्टफोन और सीमित बैंडविड्थ के लिए डिज़ाइन किया गया।',
    'home.pillars.community.title': 'समुदाय पहले',
    'home.pillars.community.desc': 'भारत भर के शहरों में स्वयंसेवकों द्वारा संचालित।',
    
    // About Page
    'about.badge': 'हमारे बारे में',
    'about.heading': 'कुर्साथ फाउंडेशन के बारे में',
    'about.desc': 'कुर्साथ फाउंडेशन अंतिम छोर पर काम करता है - वंचित युवाओं को उन अवसरों से जोड़ता है जिन पर उनका अधिकार है, लेकिन अक्सर वे इसके बारे में कभी नहीं सुन पाते हैं।',
    'about.mission.title': 'हमारा मिशन',
    'about.mission.desc': 'एक केंद्रीकृत, सत्यापित सूचना पारिस्थितिकी तंत्र का निर्माण करना ताकि कोई भी युवा जागरूकता की कमी के कारण छात्रवृत्ति, परीक्षा या योजना से न चूके।',
    'about.vision.title': 'हमारा विजन',
    'about.vision.desc': 'एक ऐसा भारत जहां हर शिक्षार्थी को - शहर, जाति या आय की परवाह किए बिना - सूचना और परामर्श तक समान पहुंच प्राप्त हो।',
    'about.pillars.heading': 'हम किसलिए खड़े हैं',
    
    // Contact Page
    'contact.badge': 'संपर्क',
    'contact.heading': 'संपर्क करें',
    'contact.subheading': 'हमारे साथ साझेदारी करें, स्वयंसेवा करें, या अपने समुदाय के लिए जानकारी का अनुरोध करें।',
    'contact.form.name': 'आपका नाम',
    'contact.form.name.placeholder': 'अपना पूरा नाम दर्ज करें',
    'contact.form.email': 'ईमेल पता',
    'contact.form.email.placeholder': 'अपना ईमेल पता दर्ज करें',
    'contact.form.message': 'हम आपकी क्या मदद कर सकते हैं?',
    'contact.form.message.placeholder': 'अपना संदेश यहाँ लिखें...',
    'contact.form.submit': 'संदेश भेजें',
    'contact.form.submitting': 'संदेश भेजा जा रहा है...',
    'contact.form.success.heading': 'संदेश भेजा गया!',
    'contact.form.success.desc': 'संपर्क करने के लिए धन्यवाद। हमारी टीम का सदस्य या स्वयंसेवक आपसे शीघ्र ही संपर्क करेगा।',
    'contact.form.success.again': 'एक और संदेश भेजें',
    'contact.reach.heading': 'हम तक पहुँचें',
    'contact.reach.email': 'ईमेल पता',
    'contact.reach.phone': 'फ़ोन संपर्क',
    'contact.reach.locations': 'समर्थित स्थान',
    
    // Dashboard & Modules general
    'dash.search.opportunity': 'शीर्षक, प्रदाता, पात्रता मानदंड द्वारा खोजें...',
    'dash.search.volunteer': 'नाम, शहर या विशेषता द्वारा स्वयंसेवकों की खोज करें...',
    'dash.loading': 'अवसर लोड हो रहे हैं...',
    'dash.empty.title': 'इस श्रेणी में अभी तक कोई अवसर नहीं है',
    'dash.empty.hostel.title': 'अभी तक कोई छात्रावास सूची नहीं है',
    'dash.empty.desc': 'हमारी संपादकीय टीम द्वारा क्यूरेट की गई सूची यहाँ प्रकाशित होने पर दिखाई देगी।',
    'dash.empty.hostel.desc': 'सत्यापित छात्रावास और आवास सूची यहाँ प्रकाशित होने पर दिखाई देगी।',
    'dash.card.deadline': 'समय सीमा:',
    'dash.card.benefit': 'लाभ:',
    'dash.card.eligibility': 'पात्रता:',
    'dash.card.view': 'विवरण देखें',
    'dash.card.contact': 'संपर्क करें',
    'dash.card.city': 'शहर:',
    
    // Drawer/Modal
    'drawer.deadline': 'समय सीमा',
    'drawer.benefit': 'लाभ',
    'drawer.eligibility': 'पात्रता मानदंड',
    'drawer.description': 'विवरण',
    'drawer.apply': 'आवेदन करें / स्रोत देखें',
    'drawer.close': 'बंद करें',
    'drawer.vol.title': 'स्वयंसेवक से संपर्क करें',
    'drawer.vol.desc': 'दस्तावेज़ीकरण और योजनाओं पर सहायता प्राप्त करने के लिए संपर्क करें।',
    'drawer.vol.name': 'स्वयंसेवक का नाम:',
    'drawer.vol.spec': 'विशेषता:',
    'drawer.vol.loc': 'स्थान:',
    'drawer.vol.status': 'उपलब्धता स्थिति:',
    'drawer.vol.email': 'ईमेल पता',
    'footer.desc': 'वंचित समुदायों के लिए सक्षम तकनीकें। युवा शिक्षार्थियों को उन अवसरों से जोड़ना जिनका उन पर अधिकार है।',
    'footer.impact': 'प्रभाव के लिए निर्मित।',
    
    // Login Page
    'login.badge': 'व्यवस्थापक डैशबोर्ड तक पहुंचें।',
    'login.username': 'उपयोगकर्ता नाम',
    'login.username.placeholder': 'उपयोगकर्ता नाम दर्ज करें',
    'login.password': 'पासवर्ड',
    'login.password.placeholder': 'पासवर्ड दर्ज करें',
    'login.google': 'गूगल के साथ जारी रखें',
    'login.noaccount': 'खाता नहीं है?',
    'login.signup': 'साइन अप करें',
    
    // Database Seeding translations
    // Titles
    "Azim Premji Foundation Scholarship": "अज़ीम प्रेमजी फाउंडेशन छात्रवृत्ति",
    "Indian Oil Academic Scholarship": "इंडियन ऑयल अकादमिक छात्रवृत्ति",
    "Post-Matric Scholarship for SC/ST": "अनुसूचित जाति/अनुसूचित जनजाति के लिए पोस्ट-मैट्रिक छात्रवृत्ति",
    "PM Vidya Lakshmi Loan Subsidy": "पीएम विद्या लक्ष्मी ऋण सब्सिडी",
    "National Scholarship Portal (NSP)": "राष्ट्रीय छात्रवृत्ति पोर्टल (एनएसपी)",
    "Indira Gandhi Old Age Pension": "इन्दिरा गांधी वृद्धावस्था पेंशन",
    "Widow Pension Scheme": "विधवा पेंशन योजना",
    "Disability Pension": "विकलांगता पेंशन",
    "PM YASASVI Scholarship": "पीएम यशस्वी छात्रवृत्ति",
    "Beti Bachao Beti Padhao": "बेटी बचाओ बेटी पढ़ाओ",
    "Ayushman Bharat (PM-JAY)": "आयुष्मान भारत (पीएम-जय)",
    
    // Providers
    "APF": "एपीएफ",
    "IOCL": "आईओसीएल",
    "Min. of Social Justice": "सामाजिक न्याय मंत्रालय",
    "MoE": "शिक्षा मंत्रालय",
    "Govt. of India": "भारत सरकार",
    "Pension": "पेंशन",
    "Social Protection": "सामाजिक सुरक्षा",
    "Education": "शिक्षा",
    "Health": "स्वास्थ्य",
    
    // Deadlines
    "15 Nov 2025": "15 नवंबर 2025",
    "20 Dec 2025": "20 दिसंबर 2025",
    "30 Nov 2025": "30 नवंबर 2025",
    "Open": "खुला है",
    "31 Oct 2025": "31 अक्टूबर 2025",
    "Ongoing": "जारी है",
    
    // Benefits
    "₹30,000/yr": "₹30,000/वर्ष",
    "₹3,000/month": "₹3,000/माह",
    "Tuition + maintenance": "शिक्षण शुल्क + रखरखाव",
    "Interest subsidy": "ब्याज सब्सिडी",
    "₹12,000–₹50,000/yr": "₹12,000–₹50,000/वर्ष",
    "₹200–₹500/mo": "₹200–₹500/माह",
    "₹300–₹500/mo": "₹300–₹500/माह",
    "₹75,000–₹1.25L": "₹75,000–₹1.25 लाख",
    "Multiple benefits": "अनेक लाभ",
    "₹5L health cover": "₹5 लाख स्वास्थ्य बीमा",
    
    // Eligibility
    "UG students, merit + need": "यूजी छात्र, योग्यता + आवश्यकता",
    "Class 11 onwards": "कक्षा 11 से आगे",
    "SC/ST, post-Class 10": "एससी/एसटी, कक्षा 10 के बाद",
    "Income < ₹4.5L, UG": "आय < ₹4.5 लाख, यूजी",
    "Class 9–PG, family income < ₹2.5L": "कक्षा 9-पीजी, पारिवारिक आय < ₹2.5 लाख",
    "60+ yrs, BPL": "60+ वर्ष, बीपीएल",
    "Widowed, BPL": "विधवा, बीपीएल",
    "40%+ disability": "40%+ विकलांगता",
    "OBC/EBC/DNT, Class 9–10": "ओबीसी/ईबीसी/डीएनटी, कक्षा 9-10",
    "Girl child": "बालिका (लड़की)",
    "SECC families": "एसईसीसी परिवार",
    
    // Descriptions
    "Provides financial aid to deserving students pursuing undergraduate courses in India. Focuses on merit-cum-means selection.": "भारत में स्नातक पाठ्यक्रमों को आगे बढ़ाने वाले योग्य छात्रों को वित्तीय सहायता प्रदान करता है। योग्यता-सह-साधन चयन पर ध्यान केंद्रित करता है।",
    "Scholarship scheme for class 11th, ITI, Engineering, MBBS, and MBA students.": "कक्षा 11वीं, आईटीआई, इंजीनियरिंग, एमबीबीएस और एमबीए के छात्रों के लिए छात्रवृत्ति योजना।",
    "Financial assistance for post-matriculation or post-secondary courses to support SC and ST students.": "एससी और एसटी छात्रों का समर्थन करने के लिए मैट्रिक के बाद या माध्यमिक के बाद के पाठ्यक्रमों के लिए वित्तीय सहायता।",
    "Provides interest subsidy on education loans for students from economically weaker sections pursuing higher education.": "उच्च शिक्षा प्राप्त करने वाले आर्थिक रूप से कमजोर वर्गों के छात्रों के लिए शिक्षा ऋण पर ब्याज सब्सिडी प्रदान करता है।",
    "A single portal for various government scholarship schemes provided by Central, State, and UT governments.": "केंद्र, राज्य और केंद्र शासित प्रदेश सरकारों द्वारा प्रदान की जाने वाली विभिन्न सरकारी छात्रवृत्ति योजनाओं के लिए एक एकल पोर्टल।",
    "Financial assistance to senior citizens belonging to households below the poverty line (BPL).": "गरीबी रेखा (बीपीएल) से नीचे के परिवारों से संबंधित वरिष्ठ नागरिकों को वित्तीय सहायता।",
    "Provides pension to widows belonging to BPL households to ensure their livelihood security.": "आजीविका सुरक्षा सुनिश्चित करने के लिए बीपीएल परिवारों की विधवाओं को पेंशन प्रदान करता है।",
    "Provides financial aid to disabled persons below the poverty line.": "गरीबी रेखा से नीचे के विकलांग व्यक्तियों को वित्तीय सहायता प्रदान करता है।",
    "Vibrant India Scholarship Scheme for meritorious OBC, EBC and DNT students studying in classes 9 to 12.": "कक्षा 9 से 12 में पढ़ने वाले मेधावी ओबीसी, ईबीसी और डीएनटी छात्रों के लिए जीवंत भारत छात्रवृत्ति योजना।",
    "A central government scheme aimed at generating awareness and improving the efficiency of welfare services intended for girls.": "एक केंद्र सरकार की योजना जिसका उद्देश्य जागरूकता पैदा करना और लड़कियों के लिए बनाई गई कल्याणकारी सेवाओं की दक्षता में सुधार करना है।",
    "National Health Protection Scheme providing health cover up to Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization.": "राष्ट्रीय स्वास्थ्य संरक्षण योजना जो माध्यमिक और तृतीयक देखभाल अस्पताल में भर्ती होने के लिए प्रति वर्ष प्रति परिवार 5 लाख रुपये तक का स्वास्थ्य कवर प्रदान करती है।",

    // Modules
    "Scholarship Hub": "छात्रवृत्ति हब",
    "Entrance & Admission Alerts": "प्रवेश और प्रवेश अलर्ट",
    "Government Schemes": "सरकारी योजनाएं",
    "Hostel & Accommodation": "छात्रावास और आवास",
    "Internships & Livelihood": "इंटर्नशिप और आजीविका",
    "Career Guidance (Post-12th)": "करियर मार्गदर्शन (12वीं के बाद)",
    "Mentorship Platform": "परामर्श मंच",
    "Volunteer Network": "स्वयंसेवक नेटवर्क",
    
    // Filters
    "All": "सभी",
    "Government": "सरकारी",
    "Private": "निजी",
    "Individual support": "व्यक्तिगत सहायता",
    "After 10th": "10वीं के बाद",
    "After 12th": "12वीं के बाद",
    "Skill-based work": "कौशल-आधारित कार्य",

    // Volunteer Networks
    "Career & schemes": "करियर और योजनाएं",
    "Documentation": "दस्तावेज़ीकरण",
    "Scholarships": "छात्रवृत्ति सहायता",
    "Girls education": "बालिका शिक्षा",
    "Career guidance": "करियर मार्गदर्शन",
    "Schemes & docs": "योजनाएं और दस्तावेज़",
    "Delhi": "दिल्ली",
    "Noida": "नोएडा",
    "Kolkata": "कोलकाता",
    "Meerut": "मेरठ",
    "Gurgaon": "गुड़गांव",
    "available": "उपलब्ध",
    "busy": "व्यस्त",
    
    // Case Studies
    "Case Studies": "केस स्टडीज़",
    "Priya Sharma's Journey to Engineering": "प्रिया शर्मा का इंजीनियरिंग तक का सफर",
    "Aman Prajapati's Hostel Support": "अमन प्रजापति को छात्रावास सहायता",
    "Komal's Vocational Empowerment": "कोमल का व्यावसायिक सशक्तिकरण",
    "Azim Premji Foundation": "अज़ीम प्रेमजी फाउंडेशन",
    "NSP & Volunteer Network": "एनएसपी और स्वयंसेवक नेटवर्क",
    "PM YASASVI Scheme": "पीएम यशस्वी योजना",
    "Success Story": "सफलता की कहानी",
    "Social Impact": "सामाजिक प्रभाव",
    "Career Growth": "करियर विकास",
    "First-generation Learner": "पहली पीढ़ी के शिक्षार्थी",
    "Rural Migrant Student": "ग्रामीण प्रवासी छात्र",
    "OBC Category Student": "ओबीसी श्रेणी के छात्र",
    "Priya, daughter of a daily wage earner in Meerut, was assisted by volunteer Ankit to apply for the APF Scholarship. She secured 100% tuition coverage for her B.Tech course.": "मेरठ में एक दैनिक वेतन भोगी की बेटी प्रिया को स्वयंसेवक अंकित ने एपीएफ छात्रवृत्ति के लिए आवेदन करने में सहायता की थी। उसने अपने बी.टेक पाठ्यक्रम के लिए 100% ट्यूशन कवरेज प्राप्त किया।",
    "Aman moved from a village near Noida to Delhi for his higher studies. Volunteer Hemant helped him find local NGO hostel support and apply for the Post-Matric scheme, saving him ₹5,000/month in rent.": "अमन उच्च शिक्षा के लिए नोएडा के पास के एक गाँव से दिल्ली आया था। स्वयंसेवक हेमंत ने उसे स्थानीय एनजीओ छात्रावास सहायता खोजने और पोस्ट-मैट्रिक योजना के लिए आवेदन करने में मदद की, जिससे उसके किराए में ₹5,000/माह की बचत हुई।",
    "Komal completed her Class 10 but had no resources for higher schooling. Through the volunteer network, she learned about the PM YASASVI scholarship and secured ₹75,000 funding for secondary education.": "कोमल ने अपनी कक्षा 10 पूरी कर ली थी, लेकिन उच्च शिक्षा के लिए संसाधन नहीं थे। स्वयंसेवक नेटवर्क के माध्यम से, उसने पीएम यशस्वी छात्रवृत्ति के बारे में जाना और माध्यमिक शिक्षा के लिए ₹75,000 का फंड प्राप्त किया।"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('language') || 'en');

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Translate static labels
  const t = (key) => {
    return translations[language]?.[key] || key;
  };

  // Translate database values/opportunities
  const tVal = (val) => {
    if (language === 'en') return val;
    return translations.hi?.[val] || val;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tVal }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

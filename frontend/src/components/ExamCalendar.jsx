import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Search, Sparkles, 
  ExternalLink, Calendar as CalendarIcon, ArrowRight, Send 
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const examsData = [
  {
    id: 'jee-main-1',
    name: 'JEE Main (Session 1)',
    category: 'Engineering',
    categoryHi: 'इंजीनियरिंग',
    level: 'National',
    levelHi: 'राष्ट्रीय',
    date: '2026-01-24',
    registrationStart: '2025-11-06',
    registrationEnd: '2025-12-15',
    link: 'https://jeemain.nta.ac.in/',
    description: 'Joint Entrance Examination for admission to undergraduate engineering programs (B.E./B.Tech.) at NITs, IIITs, and other Centrally Funded Technical Institutions.',
    descriptionHi: 'एनआईटी, आईआईआईटी और अन्य केंद्रीय वित्त पोषित तकनीकी संस्थानों में स्नातक इंजीनियरिंग कार्यक्रमों (बी.ई./बी.टेक.) में प्रवेश के लिए संयुक्त प्रवेश परीक्षा।'
  },
  {
    id: 'jee-main-2',
    name: 'JEE Main (Session 2)',
    category: 'Engineering',
    categoryHi: 'इंजीनियरिंग',
    level: 'National',
    levelHi: 'राष्ट्रीय',
    date: '2026-04-12',
    registrationStart: '2026-02-02',
    registrationEnd: '2026-03-02',
    link: 'https://jeemain.nta.ac.in/',
    description: 'Second session of JEE Main 2026. Best of the two scores will be considered for ranking.',
    descriptionHi: 'जेईई मेन 2026 का दूसरा सत्र। रैंकिंग के लिए दोनों स्कोर में से सर्वश्रेष्ठ पर विचार किया जाएगा।'
  },
  {
    id: 'jee-adv',
    name: 'JEE Advanced 2026',
    category: 'Engineering',
    categoryHi: 'इंजीनियरिंग',
    level: 'National',
    levelHi: 'राष्ट्रीय',
    date: '2026-05-24',
    registrationStart: '2026-04-27',
    registrationEnd: '2026-05-04',
    link: 'https://jeeadv.ac.in/',
    description: 'Entrance exam for admission to undergraduate courses at Indian Institutes of Technology (IITs).',
    descriptionHi: 'भारतीय प्रौद्योगिकी संस्थानों (IITs) में स्नातक पाठ्यक्रमों में प्रवेश के लिए प्रवेश परीक्षा।'
  },
  {
    id: 'neet-ug',
    name: 'NEET UG 2026',
    category: 'Medical',
    categoryHi: 'मेडिकल',
    level: 'National',
    levelHi: 'राष्ट्रीय',
    date: '2026-05-03',
    registrationStart: '2026-02-09',
    registrationEnd: '2026-03-09',
    link: 'https://exams.nta.ac.in/NEET/',
    description: 'National Eligibility cum Entrance Test for undergraduate medical courses (MBBS, BDS, AYUSH, etc.) in Indian medical colleges.',
    descriptionHi: 'भारतीय मेडिकल कॉलेजों में स्नातक चिकित्सा पाठ्यक्रमों (एमबीबीएस, बीडीएस, आयुष, आदि) के लिए राष्ट्रीय पात्रता सह प्रवेश परीक्षा।'
  },
  {
    id: 'cuet-ug',
    name: 'CUET UG 2026',
    category: 'General UG',
    categoryHi: 'सामान्य स्नातक',
    level: 'National',
    levelHi: 'राष्ट्रीय',
    date: '2026-05-15',
    registrationStart: '2026-02-27',
    registrationEnd: '2026-03-26',
    link: 'https://exams.nta.ac.in/CUET-UG/',
    description: 'Common University Entrance Test for admission to undergraduate programs in Central and participating Universities across India.',
    descriptionHi: 'पूरे भारत में केंद्रीय और भाग लेने वाले विश्वविद्यालयों में स्नातक कार्यक्रमों में प्रवेश के लिए सामान्य विश्वविद्यालय प्रवेश परीक्षा।'
  },
  {
    id: 'upsc-cse',
    name: 'UPSC Civil Services (Prelims)',
    category: 'Government',
    categoryHi: 'सरकारी नौकरी',
    level: 'National',
    levelHi: 'राष्ट्रीय',
    date: '2026-05-31',
    registrationStart: '2026-02-11',
    registrationEnd: '2026-03-03',
    link: 'https://www.upsc.gov.in/',
    description: 'Union Public Service Commission Civil Services Examination for recruitment to IAS, IPS, IFS, and other Group A/B services.',
    descriptionHi: 'आईएएस, आईपीएस, आईएफएस और अन्य ग्रुप ए/बी सेवाओं में भर्ती के लिए संघ लोक सेवा आयोग सिविल सेवा परीक्षा।'
  },
  {
    id: 'ssc-cgl',
    name: 'SSC CGL Tier-1 2026',
    category: 'Government',
    categoryHi: 'सरकारी नौकरी',
    level: 'National',
    levelHi: 'राष्ट्रीय',
    date: '2026-09-15',
    registrationStart: '2026-06-20',
    registrationEnd: '2026-07-19',
    link: 'https://ssc.gov.in/',
    description: 'Staff Selection Commission Combined Graduate Level examination for recruiting staff to various posts in ministries, departments, and organisations of the Government of India.',
    descriptionHi: 'भारत सरकार के विभिन्न मंत्रालयों, विभागों और संगठनों में पदों पर भर्ती के लिए कर्मचारी चयन आयोग संयुक्त स्नातक स्तरीय परीक्षा।'
  },
  {
    id: 'nda-1',
    name: 'NDA & NA (I) 2026',
    category: 'Defense / Govt',
    categoryHi: 'रक्षा / सरकारी',
    level: 'National',
    levelHi: 'राष्ट्रीय',
    date: '2026-04-19',
    registrationStart: '2025-12-17',
    registrationEnd: '2026-01-14',
    link: 'https://www.upsc.gov.in/',
    description: 'National Defence Academy and Naval Academy examination for entry into Army, Navy, and Air Force wings.',
    descriptionHi: 'सेना, नौसेना और वायु सेना के अंगों में प्रवेश के लिए राष्ट्रीय रक्षा अकादमी और नौसेना अकादमी परीक्षा।'
  },
  {
    id: 'gate',
    name: 'GATE 2026',
    category: 'Engineering / PG',
    categoryHi: 'इंजीनियरिंग / पीजी',
    level: 'National',
    levelHi: 'राष्ट्रीय',
    date: '2026-02-07',
    registrationStart: '2025-08-28',
    registrationEnd: '2025-10-07',
    link: 'https://gate2026.iitd.ac.in/',
    description: 'Graduate Aptitude Test in Engineering for admission to postgraduate programs and recruitment in public sector undertakings (PSUs).',
    descriptionHi: 'स्नातकोत्तर कार्यक्रमों में प्रवेश और सार्वजनिक क्षेत्र के उपक्रमों (पीएसयू) में भर्ती के लिए इंजीनियरिंग में ग्रेजुएट एप्टीट्यूड टेस्ट।'
  },
  {
    id: 'clat',
    name: 'CLAT 2026',
    category: 'Law',
    categoryHi: 'कानून',
    level: 'National',
    levelHi: 'राष्ट्रीय',
    date: '2026-12-07',
    registrationStart: '2025-07-15',
    registrationEnd: '2025-11-10',
    link: 'https://consortiumofnlus.ac.in/',
    description: 'Common Law Admission Test for admission to under-graduate and post-graduate degree programmes at National Law Universities.',
    descriptionHi: 'राष्ट्रीय विधि विश्वविद्यालयों में स्नातक और स्नातकोत्तर डिग्री पाठ्यक्रमों में प्रवेश के लिए कॉमन लॉ एडमिशन टेस्ट।'
  }
];

export default function ExamCalendar() {
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [currentDate, setCurrentDate] = useState(new Date(2026, 4, 1)); // Initialize in May 2026
  const [selectedDate, setSelectedDate] = useState('2026-05-03'); // Default to NEET UG date
  const [searchQuery, setSearchQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiTyping, setAiTyping] = useState(false);
  const typingTimerRef = useRef(null);

  // Suggested chips translation
  const suggestionChips = isHi ? [
    { label: 'नीट (NEET) की तारीख', query: 'neet' },
    { label: 'जेईई (JEE) मेन और एडवांस्ड', query: 'jee' },
    { label: 'मई 2026 की परीक्षाएं', query: 'may' },
    { label: 'सरकारी नौकरियां / UPSC', query: 'government' }
  ] : [
    { label: 'NEET UG Dates', query: 'neet' },
    { label: 'JEE Main & Advanced', query: 'jee' },
    { label: 'Exams in May 2026', query: 'may' },
    { label: 'Govt Exams / UPSC', query: 'government' }
  ];

  // Months name array
  const monthsEng = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const monthsHi = [
    'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
    'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'
  ];
  const months = isHi ? monthsHi : monthsEng;

  const daysOfWeekEng = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysOfWeekHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];
  const daysOfWeek = isHi ? daysOfWeekHi : daysOfWeekEng;

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get total days in current month
  const totalDays = new Date(year, month + 1, 0).getDate();
  // Get the first day of the month index (0 for Sunday, etc.)
  const startDayIndex = new Date(year, month, 1).getDay();

  // Format date to YYYY-MM-DD
  const formatDateString = (dayNum) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(dayNum).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  // Find exams on a specific date
  const getExamsForDate = (dateStr) => {
    return examsData.filter(e => e.date === dateStr);
  };

  // Trigger simulated AI response
  const triggerAI = (queryText) => {
    if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    setAiTyping(true);
    setAiResponse('');
    
    const query = queryText.toLowerCase().trim();
    let matchedExams = [];
    let responseText = '';

    if (query.includes('jee') || query.includes('joint entrance') || query.includes('iit') || query.includes('जेईई')) {
      matchedExams = examsData.filter(e => e.id.startsWith('jee'));
      if (isHi) {
        responseText = "मुझे संयुक्त प्रवेश परीक्षा (JEE) के लिए निम्नलिखित विवरण मिले हैं:\n\n" + 
          "• **JEE Main (सत्र 1)**: परीक्षा 24 जनवरी 2026 को है। पंजीकरण 6 नवंबर से 15 दिसंबर 2025 तक था।\n" +
          "• **JEE Main (सत्र 2)**: परीक्षा 12 अप्रैल 2026 को है। पंजीकरण 2 फरवरी से 3 मार्च 2026 तक खुला है।\n" +
          "• **JEE Advanced**: परीक्षा 24 मई 2026 को है। पंजीकरण 27 अप्रैल से 4 मई 2026 तक चलेगा।\n\n" +
          "मैंने कैलेंडर को मई 2026 पर सेट कर दिया है। विस्तृत जानकारी और आधिकारिक पंजीकरण लिंक के लिए कैलेंडर पर हाइलाइट की गई तारीखों को चुनें।";
      } else {
        responseText = "I found the following details for the Joint Entrance Examination (JEE):\n\n" + 
          "• **JEE Main (Session 1)**: Exam on Jan 24, 2026. Registration: Nov 6 – Dec 15, 2025.\n" +
          "• **JEE Main (Session 2)**: Exam on Apr 12, 2026. Registration: Feb 2 – Mar 2, 2026.\n" +
          "• **JEE Advanced**: Exam on May 24, 2026. Registration: Apr 27 – May 4, 2026.\n\n" +
          "I have centered the calendar to May 2026. Select the highlighted dates on the calendar to view registration details and apply.";
      }
      setCurrentDate(new Date('2026-05-24'));
      setSelectedDate('2026-05-24');
    } else if (query.includes('neet') || query.includes('medical') || query.includes('mbbs') || query.includes('नीट')) {
      matchedExams = examsData.filter(e => e.id === 'neet-ug');
      if (isHi) {
        responseText = "राष्ट्रीय पात्रता सह प्रवेश परीक्षा (NEET UG 2026) **3 मई 2026** को आयोजित की जाएगी।\n\n" +
          "• **पंजीकरण अवधि**: 9 फरवरी से 9 मार्च 2026।\n" +
          "• **आयोजक**: राष्ट्रीय परीक्षण एजेंसी (NTA)।\n" +
          "• **योग्यता**: भौतिकी, रसायन विज्ञान, जीव विज्ञान/बायोटेक्नोलॉजी के साथ 10+2।\n\n" +
          "मैंने कैलेंडर में 3 मई 2026 को चुन लिया है। आधिकारिक NTA NEET पोर्टल पर जाने के लिए नीचे दिए गए बटन पर क्लिक करें।";
      } else {
        responseText = "National Eligibility cum Entrance Test (NEET UG 2026) is scheduled for **May 3, 2026**.\n\n" +
          "• **Registration Period**: Feb 9 to Mar 9, 2026.\n" +
          "• **Conducting Body**: National Testing Agency (NTA).\n" +
          "• **Eligibility**: 10+2 with Physics, Chemistry, Biology/Biotechnology.\n\n" +
          "I have selected May 3 on the calendar. Use the direct link below to start your application on the official NEET portal.";
      }
      setCurrentDate(new Date('2026-05-03'));
      setSelectedDate('2026-05-03');
    } else if (query.includes('cuet') || query.includes('university') || query.includes('सीयूईटी')) {
      matchedExams = examsData.filter(e => e.id === 'cuet-ug');
      if (isHi) {
        responseText = "सामान्य विश्वविद्यालय प्रवेश परीक्षा (CUET UG 2026) **15 मई 2026** को आयोजित होगी।\n\n" +
          "• **पंजीकरण अवधि**: 27 फरवरी से 26 मार्च 2026।\n" +
          "• **विवरण**: भारत भर के केंद्रीय और अन्य भाग लेने वाले विश्वविद्यालयों में स्नातक पाठ्यक्रमों में प्रवेश के लिए एकल खिड़की प्रणाली।\n\n" +
          "मैंने आपके लिए कैलेंडर में 15 मई 2026 को हाइलाइट कर दिया है। पंजीकरण शुरू करने के लिए नीचे दिए गए लिंक पर जाएं।";
      } else {
        responseText = "Common University Entrance Test (CUET UG 2026) is scheduled for **May 15, 2026**.\n\n" +
          "• **Registration Period**: Feb 27 to Mar 26, 2026.\n" +
          "• **Purpose**: Single-window admission to undergraduate programs in Central and participating Universities across India.\n\n" +
          "I have highlighted and selected May 15. The official registration link is available below.";
      }
      setCurrentDate(new Date('2026-05-15'));
      setSelectedDate('2026-05-15');
    } else if (query.includes('upsc') || query.includes('civil') || query.includes('ias') || query.includes('यूपीएससी')) {
      matchedExams = examsData.filter(e => e.id === 'upsc-cse');
      if (isHi) {
        responseText = "यूपीएससी सिविल सेवा परीक्षा (प्रारंभिक) 2026 की तिथि **31 मई 2026** है।\n\n" +
          "• **पंजीकरण अवधि**: 11 फरवरी से 3 मार्च 2026।\n" +
          "• **योग्यता**: किसी भी मान्यता प्राप्त विश्वविद्यालय से स्नातक डिग्री।\n\n" +
          "मैंने कैलेंडर में 31 मई 2026 को चिह्नित कर दिया है। आवेदन प्रक्रिया के लिए आप नीचे दी गई आधिकारिक संघ लोक सेवा आयोग की वेबसाइट पर जा सकते हैं।";
      } else {
        responseText = "UPSC Civil Services Examination (Preliminary) 2026 is scheduled for **May 31, 2026**.\n\n" +
          "• **Registration Period**: Feb 11 to Mar 3, 2026.\n" +
          "• **Eligibility**: Graduate degree from a recognized university, age 21-32 years.\n\n" +
          "I have selected May 31 on the calendar. Click the registration link below to apply online via UPSC.";
      }
      setCurrentDate(new Date('2026-05-31'));
      setSelectedDate('2026-05-31');
    } else if (query.includes('ssc') || query.includes('cgl') || query.includes('government') || query.includes('govt') || query.includes('सरकारी') || query.includes('एसएससी')) {
      matchedExams = examsData.filter(e => e.category === 'Government' || e.id === 'ssc-cgl');
      if (isHi) {
        responseText = "मैंने आपकी खोज के अनुसार प्रमुख सरकारी परीक्षाएं ढूंढी हैं:\n\n" +
          "• **UPSC Civil Services (Prelims)**: 31 मई 2026 (पंजीकरण: 11 फरवरी – 3 मार्च 2026)\n" +
          "• **SSC CGL Tier-1 2026**: 15 सितंबर 2026 (पंजीकरण: 20 जून – 19 जुलाई 2026)\n" +
          "• **NDA & NA (I) 2026**: 19 अप्रैल 2026 (पंजीकरण: 17 दिसंबर 2025 – 14 जनवरी 2026)\n\n" +
          "मैंने कैलेंडर को सितंबर 2026 पर सेट करके SSC CGL को चुना है। अन्य परीक्षाओं के लिए संबंधित महीनों के कैलेंडर को देखें।";
      } else {
        responseText = "I found several major Government recruitment examinations:\n\n" +
          "• **UPSC Civil Services (Prelims)**: May 31, 2026 (Reg: Feb 11 – Mar 3, 2026)\n" +
          "• **SSC CGL Tier-1 2026**: September 15, 2026 (Reg: Jun 20 – Jul 19, 2026)\n" +
          "• **NDA & NA (I) 2026**: April 19, 2026 (Reg: Dec 17, 2025 – Jan 14, 2026)\n\n" +
          "I have switched to September 2026 to show SSC CGL Tier-1. Click on other highlighted dates to explore details.";
      }
      setCurrentDate(new Date('2026-09-15'));
      setSelectedDate('2026-09-15');
    } else if (query.includes('gate') || query.includes('गेठ') || query.includes('गेट')) {
      matchedExams = examsData.filter(e => e.id === 'gate');
      if (isHi) {
        responseText = "गेट परीक्षा (GATE 2026) **7 फरवरी 2026** को निर्धारित है।\n\n" +
          "• **पंजीकरण अवधि**: 28 अगस्त से 7 अक्टूबर 2025।\n" +
          "• **आयोजक**: भारतीय प्रौद्योगिकी संस्थान (IIT) दिल्ली।\n" +
          "• **उद्देश्य**: स्नातकोत्तर कार्यक्रमों (M.Tech/M.E.) में प्रवेश और प्रमुख PSUs में सीधी भर्ती।\n\n" +
          "मैंने फरवरी 2026 कैलेंडर में 7 तारीख को चुन लिया है। आधिकारिक GOAPS पोर्टल का लिंक नीचे उपलब्ध है।";
      } else {
        responseText = "The Graduate Aptitude Test in Engineering (GATE 2026) is scheduled for **February 7, 2026**.\n\n" +
          "• **Registration Period**: Aug 28 to Oct 7, 2025.\n" +
          "• **Conducting Body**: IIT Delhi.\n" +
          "• **Purpose**: Admissions to Master's programs and direct recruitment at PSUs.\n\n" +
          "I have selected February 7 on the calendar. Use the link below to access the GATE Online Application system.";
      }
      setCurrentDate(new Date('2026-02-07'));
      setSelectedDate('2026-02-07');
    } else if (query.includes('clat') || query.includes('law') || query.includes('क्लैट') || query.includes('कानून')) {
      matchedExams = examsData.filter(e => e.id === 'clat');
      if (isHi) {
        responseText = "कॉमन लॉ एडमिशन टेस्ट (CLAT 2026) **7 दिसंबर 2025** को आयोजित होगा।\n\n" +
          "• **पंजीकरण अवधि**: 15 जुलाई से 10 नवंबर 2025।\n" +
          "• **योग्यता**: नेशनल लॉ यूनिवर्सिटीज में एकीकृत एलएलबी और एलएलएम प्रवेश के लिए।\n\n" +
          "दिसंबर 2025 कैलेंडर में 7 तारीख हाइलाइटेड है। आधिकारिक पंजीकरण लिंक नीचे दी गई है।";
      } else {
        responseText = "Common Law Admission Test (CLAT 2026) will be held on **December 7, 2025** (for 2026 law admissions).\n\n" +
          "• **Registration Period**: Jul 15 to Nov 10, 2025.\n" +
          "• **Conducting Body**: Consortium of National Law Universities.\n\n" +
          "I have selected December 7, 2025. Click the link below to register on the Consortium portal.";
      }
      setCurrentDate(new Date('2025-12-07'));
      setSelectedDate('2025-12-07');
    } else if (query.includes('may') || query.includes('मई')) {
      matchedExams = examsData.filter(e => new Date(e.date).getMonth() === 4 && new Date(e.date).getFullYear() === 2026);
      if (isHi) {
        responseText = "मई 2026 में 4 बड़ी राष्ट्रीय प्रवेश परीक्षाएं आयोजित हो रही हैं:\n\n" +
          "• **NEET UG**: 3 मई 2026\n" +
          "• **CUET UG**: 15 मई 2026\n" +
          "• **JEE Advanced**: 24 मई 2026\n" +
          "• **UPSC Civil Services Prelims**: 31 मई 2026\n\n" +
          "मैंने कैलेंडर को मई 2026 पर सेट कर दिया है। विस्तृत विवरण और पंजीकरण लिंक के लिए कैलेंडर की हाइलाइट की गई तारीखों पर क्लिक करें।";
      } else {
        responseText = "I found 4 major exams in May 2026:\n\n" +
          "• **NEET UG**: May 3, 2026\n" +
          "• **CUET UG**: May 15, 2026\n" +
          "• **JEE Advanced**: May 24, 2026\n" +
          "• **UPSC Civil Services Prelims**: May 31, 2026\n\n" +
          "I have switched the calendar to May 2026. Select any of these dates to see application links.";
      }
      setCurrentDate(new Date('2026-05-03'));
      setSelectedDate('2026-05-03');
    } else {
      if (isHi) {
        responseText = "नमस्ते! मैं आपका एआई परीक्षा सहायक हूँ। आप मुझसे राष्ट्रीय और सरकारी भर्ती परीक्षाओं के बारे में पूछ सकते हैं।\n\n" +
          "उदाहरण के लिए पूछें:\n" +
          "• *'नीट परीक्षा कब है?'*\n" +
          "• *'जेईई परीक्षा की महत्वपूर्ण तारीखें बताएं'* \n" +
          "• *'मई 2026 में कौन सी परीक्षाएं हैं?'*\n" +
          "• *'सरकारी सिविल सेवा परीक्षा के आवेदन लिंक बताएं'*";
      } else {
        responseText = "Hello! I am your AI Exam Assistant. I can help you search, locate, and navigate dates & registration portals for major national entrance and government exams.\n\n" +
          "Try typing or asking queries like:\n" +
          "• *'When is the NEET UG exam?'*\n" +
          "• *'List JEE Main and Advanced dates'*\n" +
          "• *'What exams are scheduled in May 2026?'*\n" +
          "• *'Show me UPSC and government exams'*";
      }
    }

    // Typing effect implementation
    let index = 0;
    typingTimerRef.current = setInterval(() => {
      setAiResponse(prev => prev + responseText.charAt(index));
      index++;
      if (index >= responseText.length) {
        clearInterval(typingTimerRef.current);
        setAiTyping(false);
      }
    }, 8);
  };

  // Trigger default greeting on load
  useEffect(() => {
    // Show details for default selected date (NEET UG)
    const activeExams = getExamsForDate(selectedDate);
    if (activeExams.length > 0) {
      const exam = activeExams[0];
      const intro = isHi 
        ? `चयनित तिथि: **3 मई 2026**। इस दिन **${exam.name}** आयोजित की जा रही है।\n\n**विवरण**: ${exam.descriptionHi}\n\n• **स्तर**: ${exam.levelHi} (${exam.categoryHi})\n• **आवेदन अवधि**: ${exam.registrationStart} से ${exam.registrationEnd}\n\nपंजीकरण के लिए नीचे दी गई आधिकारिक लिंक का उपयोग करें।`
        : `Selected Date: **May 3, 2026**. **${exam.name}** is scheduled on this day.\n\n**Description**: ${exam.description}\n\n• **Level**: ${exam.level} (${exam.category})\n• **Application Window**: ${exam.registrationStart} to ${exam.registrationEnd}\n\nClick the registration button below to navigate to the official portal.`;
      setAiResponse(intro);
    }
  }, [language]);

  // Clean timer on unmount
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
    };
  }, []);

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    const dateExams = getExamsForDate(dateStr);
    
    if (dateExams.length > 0) {
      const exam = dateExams[0];
      const desc = isHi ? exam.descriptionHi : exam.description;
      const cat = isHi ? exam.categoryHi : exam.category;
      const lvl = isHi ? exam.levelHi : exam.level;
      
      const text = isHi 
        ? `मैंने तिथि **${dateStr}** पर **${exam.name}** पाया है।\n\n**विवरण**: ${desc}\n\n• **श्रेणी**: ${cat}\n• **स्तर**: ${lvl}\n• **पंजीकरण अवधि**: ${exam.registrationStart} से ${exam.registrationEnd}\n\nपंजीकरण लिंक नीचे सक्रिय है।`
        : `I found **${exam.name}** scheduled on **${dateStr}**.\n\n**Description**: ${desc}\n\n• **Category**: ${cat}\n• **Level**: ${lvl}\n• **Registration Window**: ${exam.registrationStart} to ${exam.registrationEnd}\n\nDirect application link is available below.`;
      
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      setAiTyping(true);
      setAiResponse('');
      let index = 0;
      typingTimerRef.current = setInterval(() => {
        setAiResponse(prev => prev + text.charAt(index));
        index++;
        if (index >= text.length) {
          clearInterval(typingTimerRef.current);
          setAiTyping(false);
        }
      }, 8);
    } else {
      const noExamText = isHi
        ? `तिथि **${dateStr}** पर कोई प्रमुख राष्ट्रीय या सरकारी परीक्षा निर्धारित नहीं है।\n\nकृपया कैलेंडर में रंगीन बिंदुओं वाली तारीखों पर क्लिक करें, या विशेष परीक्षाओं (जैसे: NEET, JEE, UPSC) के बारे में एआई चैट में पूछें!`
        : `There are no major national or government exams scheduled on **${dateStr}**.\n\nTry clicking on the dates highlighted with dots, or ask me about specific exams (like NEET, JEE, or UPSC) in the input below!`;
      
      if (typingTimerRef.current) clearInterval(typingTimerRef.current);
      setAiTyping(true);
      setAiResponse('');
      let index = 0;
      typingTimerRef.current = setInterval(() => {
        setAiResponse(prev => prev + noExamText.charAt(index));
        index++;
        if (index >= noExamText.length) {
          clearInterval(typingTimerRef.current);
          setAiTyping(false);
        }
      }, 8);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const onSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    triggerAI(searchQuery);
    setSearchQuery('');
  };

  // Render Days Grid
  const daysGrid = [];
  // Add padding days from previous month
  for (let i = 0; i < startDayIndex; i++) {
    daysGrid.push(<div key={`pad-${i}`} className="h-10 sm:h-12 w-full"></div>);
  }
  // Add days of current month
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = formatDateString(d);
    const dateExams = getExamsForDate(dateStr);
    const isSelected = selectedDate === dateStr;
    const hasExams = dateExams.length > 0;

    // Categorize color dot
    let dotColor = "bg-blue-500";
    if (hasExams) {
      const cat = dateExams[0].category;
      if (cat === "Medical") dotColor = "bg-rose-500";
      else if (cat === "Government") dotColor = "bg-emerald-500";
      else if (cat.includes("Defense")) dotColor = "bg-violet-500";
      else if (cat.includes("Law")) dotColor = "bg-amber-500";
    }

    daysGrid.push(
      <button
        key={`day-${d}`}
        onClick={() => handleDayClick(dateStr)}
        className={`h-10 sm:h-12 w-full flex flex-col items-center justify-center rounded-xl relative transition-all duration-200 border border-transparent
          ${isSelected 
            ? 'bg-brand-navy text-white font-extrabold shadow-md scale-105 border-brand-gold' 
            : 'hover:bg-slate-100 hover:scale-102 text-slate-700 font-semibold'
          }
        `}
      >
        <span className="text-xs sm:text-sm">{d}</span>
        {hasExams && (
          <span className={`absolute bottom-1.5 h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-brand-gold' : dotColor} animate-pulse`}></span>
        )}
      </button>
    );
  }

  // Selected date exams
  const selectedDateExams = getExamsForDate(selectedDate);
  const activeExamLink = selectedDateExams.length > 0 ? selectedDateExams[0].link : null;

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 rounded-3xl border border-slate-200/60 p-6 md:p-8 shadow-sm">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Banner Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-gold/10 text-brand-yellow border border-brand-gold/15 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>{isHi ? 'राष्ट्रीय परीक्षा पोर्टल' : 'National Exam Portal'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">
              {isHi ? 'एआई-संचालित परीक्षा कैलेंडर' : 'AI-Powered Exam Calendar'}
            </h2>
            <p className="text-slate-500 font-medium text-xs sm:text-sm">
              {isHi 
                ? 'सभी प्रमुख राष्ट्रीय (JEE, NEET, CUET) और सरकारी नौकरियों की परीक्षाओं की तारीखें और पंजीकरण लिंक एक जगह।' 
                : 'Track schedules, eligibility, and direct registration links for major national and government recruitment exams.'}
            </p>
          </div>
          
          {/* Quick Search Bar */}
          <form onSubmit={onSearchSubmit} className="relative w-full md:w-80 shrink-0">
            <input
              type="text"
              placeholder={isHi ? "परीक्षा खोजें (जैसे: JEE)..." : "Search exam (e.g. NEET)..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-11 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-navy/20 focus:border-brand-navy text-xs sm:text-sm font-semibold transition-all shadow-sm"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <button 
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-brand-navy text-white hover:bg-brand-gold hover:text-brand-dark transition-colors"
            >
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>

        {/* Calendar and AI Panel Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Column 1: Interactive Calendar (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/50 p-4 sm:p-6 shadow-sm flex flex-col justify-between">
            <div>
              {/* Calendar Control Header */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <h3 className="text-base sm:text-lg font-extrabold text-brand-dark flex items-center gap-2">
                  <CalendarIcon className="h-4 sm:h-5 w-4 sm:w-5 text-brand-navy" />
                  <span>{months[month]} {year}</span>
                </h3>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrevMonth}
                    className="p-1.5 sm:p-2 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-600 transition-colors"
                    aria-label="Previous Month"
                  >
                    <ChevronLeft className="h-4 w-4 stroke-[2.5]" />
                  </button>
                  <button
                    onClick={() => { setCurrentDate(new Date(2026, 4, 1)); setSelectedDate('2026-05-03'); }}
                    className="px-2.5 py-1.5 text-xs font-bold rounded-lg border border-slate-100 hover:bg-slate-50 text-brand-navy transition-colors"
                  >
                    {isHi ? 'आज' : 'Today'}
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-1.5 sm:p-2 rounded-lg border border-slate-100 hover:bg-slate-50 text-slate-600 transition-colors"
                    aria-label="Next Month"
                  >
                    <ChevronRight className="h-4 w-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>

              {/* Days of Week Header */}
              <div className="grid grid-cols-7 text-center py-4 text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-400">
                {daysOfWeek.map((day) => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2">
                {daysGrid}
              </div>
            </div>

            {/* Legend & Categories */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-6 border-t border-slate-100 mt-6 text-[10px] sm:text-xs font-bold text-slate-500">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span>
                <span>{isHi ? 'इंजीनियरिंग (JEE)' : 'Engineering (JEE)'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span>
                <span>{isHi ? 'मेडिकल (NEET)' : 'Medical (NEET)'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                <span>{isHi ? 'सरकारी (UPSC/SSC)' : 'Govt (UPSC/SSC)'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
                <span>{isHi ? 'कानून (CLAT)' : 'Law (CLAT)'}</span>
              </div>
            </div>

          </div>

          {/* Column 2: AI Exam Assistant (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* AI Assistant Conversation Bubble */}
            <div className="flex-1 bg-brand-dark text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[350px]">
              {/* Decorative backdrops */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 blur-2xl pointer-events-none"></div>
              
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
                  <div className="p-2 rounded-lg bg-white/10 text-brand-gold border border-white/15">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white">
                      {isHi ? 'परीक्षा एआई सहायक' : 'Exam AI Assistant'}
                    </h4>
                    <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                      {isHi ? 'ऑनलाइन' : 'Online'}
                    </span>
                  </div>
                </div>

                {/* AI Chat Text */}
                <div className="text-xs sm:text-sm font-semibold text-slate-200 leading-relaxed max-h-60 overflow-y-auto pr-1">
                  <div className="whitespace-pre-line">
                    {aiResponse}
                    {aiTyping && (
                      <span className="inline-block h-3.5 w-1.5 bg-brand-gold ml-1 animate-pulse"></span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button & Link (Placed inside Chat card) */}
              {activeExamLink && (
                <div className="pt-6 border-t border-white/10 mt-6 flex flex-col gap-3">
                  <div className="text-[10px] sm:text-xs font-bold text-brand-gold uppercase tracking-wider flex items-center gap-1">
                    <span className="flex h-2 w-2 rounded-full bg-brand-gold"></span>
                    <span>{isHi ? 'सत्यापित पंजीकरण लिंक उपलब्ध है' : 'Verified Registration Link Available'}</span>
                  </div>
                  <a
                    href={activeExamLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-brand-dark font-extrabold rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-amber-400/20 text-xs sm:text-sm"
                  >
                    <span>{isHi ? 'अभी पंजीकरण करें / वेबसाइट पर जाएं' : 'Register Now / Go to Portal'}</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>

            {/* Quick Suggestions Block */}
            <div className="bg-white rounded-2xl border border-slate-200/50 p-4 sm:p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-brand-yellow" />
                <span>{isHi ? 'त्वरित प्रश्न पूछें' : 'Ask Quick Questions'}</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {suggestionChips.map((chip, index) => (
                  <button
                    key={index}
                    onClick={() => triggerAI(chip.query)}
                    className="text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 px-3 py-2 rounded-xl transition-all text-left"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
          
        </div>

      </div>
    </div>
  );
}

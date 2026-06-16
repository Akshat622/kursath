const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const { getFallbackStatus } = require('./db');

const Opportunity = require('../models/Opportunity');
const Volunteer = require('../models/Volunteer');
const User = require('../models/User');

const fallbackFilePath = path.join(__dirname, '..', 'data_fallback.json');

const sampleOpportunities = [
  // Scholarships
  {
    title: "Azim Premji Foundation Scholarship",
    provider: "APF",
    category: "scholarship",
    type: "Private",
    deadline: "15 Nov 2026",
    amount: "₹30,000/yr",
    eligibility: "UG students, merit + need",
    description: "Provides financial aid to deserving students pursuing undergraduate courses in India. Focuses on merit-cum-means selection.",
    link: "https://azimpremjifoundation.org"
  },
  {
    title: "Indian Oil Academic Scholarship",
    provider: "IOCL",
    category: "scholarship",
    type: "Government",
    deadline: "20 Dec 2026",
    amount: "₹3,000/month",
    eligibility: "Class 11 onwards",
    description: "Scholarship scheme for class 11th, ITI, Engineering, MBBS, and MBA students.",
    link: "https://www.iocl.com"
  },
  {
    title: "Post-Matric Scholarship for SC/ST",
    provider: "Min. of Social Justice",
    category: "scholarship",
    type: "Government",
    deadline: "30 Nov 2026",
    amount: "Tuition + maintenance",
    eligibility: "SC/ST, post-Class 10",
    description: "Financial assistance for post-matriculation or post-secondary courses to support SC and ST students.",
    link: "https://scholarships.gov.in"
  },
  {
    title: "PM Vidya Lakshmi Loan Subsidy",
    provider: "MoE",
    category: "scholarship",
    type: "Government",
    deadline: "Open",
    amount: "Interest subsidy",
    eligibility: "Income < ₹4.5L, UG",
    description: "Provides interest subsidy on education loans for students from economically weaker sections pursuing higher education.",
    link: "https://www.vidyalakshmi.co.in"
  },
  {
    title: "National Scholarship Portal (NSP)",
    provider: "Govt. of India",
    category: "scholarship",
    type: "Government",
    deadline: "31 Oct 2026",
    amount: "₹12,000–₹50,000/yr",
    eligibility: "Class 9–PG, family income < ₹2.5L",
    description: "A single portal for various government scholarship schemes provided by Central, State, and UT governments.",
    link: "https://scholarships.gov.in"
  },
  // Government Schemes
  {
    title: "Indira Gandhi Old Age Pension",
    provider: "Pension",
    category: "scheme",
    type: "Pension",
    deadline: "Open",
    amount: "₹200–₹500/mo",
    eligibility: "60+ yrs, BPL",
    description: "Financial assistance to senior citizens belonging to households below the poverty line (BPL).",
    link: "https://nsap.nic.in"
  },
  {
    title: "Widow Pension Scheme",
    provider: "Social Protection",
    category: "scheme",
    type: "Social Protection",
    deadline: "Open",
    amount: "₹300–₹500/mo",
    eligibility: "Widowed, BPL",
    description: "Provides pension to widows belonging to BPL households to ensure their livelihood security.",
    link: "https://nsap.nic.in"
  },
  {
    title: "Disability Pension",
    provider: "Social Protection",
    category: "scheme",
    type: "Social Protection",
    deadline: "Open",
    amount: "₹300–₹500/mo",
    eligibility: "40%+ disability",
    description: "Provides financial aid to disabled persons below the poverty line.",
    link: "https://nsap.nic.in"
  },
  {
    title: "PM YASASVI Scholarship",
    provider: "Education",
    category: "scheme",
    type: "Education",
    deadline: "Open",
    amount: "₹75,000–₹1.25L",
    eligibility: "OBC/EBC/DNT, Class 9–10",
    description: "Vibrant India Scholarship Scheme for meritorious OBC, EBC and DNT students studying in classes 9 to 12.",
    link: "https://yet.nta.ac.in"
  },
  {
    title: "Beti Bachao Beti Padhao",
    provider: "Education",
    category: "scheme",
    type: "Education",
    deadline: "Ongoing",
    amount: "Multiple benefits",
    eligibility: "Girl child",
    description: "A central government scheme aimed at generating awareness and improving the efficiency of welfare services intended for girls.",
    link: "https://wcd.nic.in"
  },
  {
    title: "Ayushman Bharat (PM-JAY)",
    provider: "Health",
    category: "scheme",
    type: "Health",
    deadline: "Open",
    amount: "₹5L health cover",
    eligibility: "SECC families",
    description: "National Health Protection Scheme providing health cover up to Rs. 5 lakhs per family per year for secondary and tertiary care hospitalization.",
    link: "https://pmjay.gov.in"
  },
  // Case Studies
  {
    title: "Priya Sharma's Journey to Engineering",
    provider: "Azim Premji Foundation",
    category: "casestudy",
    type: "Success Story",
    deadline: "N/A",
    amount: "₹30,000/yr Support",
    eligibility: "First-generation Learner",
    description: "Priya, daughter of a daily wage earner in Meerut, was assisted by volunteer Ankit to apply for the APF Scholarship. She secured 100% tuition coverage for her B.Tech course.",
    link: "https://azimpremjifoundation.org"
  },
  {
    title: "Aman Prajapati's Hostel Support",
    provider: "NSP & Volunteer Network",
    category: "casestudy",
    type: "Social Impact",
    deadline: "N/A",
    amount: "Free Accommodation",
    eligibility: "Rural Migrant Student",
    description: "Aman moved from a village near Noida to Delhi for his higher studies. Volunteer Hemant helped him find local NGO hostel support and apply for the Post-Matric scheme, saving him ₹5,000/month in rent.",
    link: "https://nsap.nic.in"
  },
  {
    title: "Komal's Vocational Empowerment",
    provider: "PM YASASVI Scheme",
    category: "casestudy",
    type: "Career Growth",
    deadline: "N/A",
    amount: "₹75,000 Support",
    eligibility: "OBC Category Student",
    description: "Komal completed her Class 10 but had no resources for higher schooling. Through the volunteer network, she learned about the PM YASASVI scholarship and secured ₹75,000 funding for secondary education.",
    link: "https://yet.nta.ac.in"
  }
];

const sampleVolunteers = [
  {
    name: "Shishupal",
    specialty: "Career & schemes",
    city: "Delhi",
    status: "available",
    contact: "shishupal@kursathfoundation.org"
  },
  {
    name: "Hemant",
    specialty: "Documentation",
    city: "Noida",
    status: "available",
    contact: "hemant@kursathfoundation.org"
  },
  {
    name: "Ritesh",
    specialty: "Scholarships",
    city: "Kolkata",
    status: "busy",
    contact: "ritesh@kursathfoundation.org"
  },
  {
    name: "Deepa",
    specialty: "Girls education",
    city: "Delhi",
    status: "available",
    contact: "deepa@kursathfoundation.org"
  },
  {
    name: "Ankit Prajapati",
    specialty: "Career guidance",
    city: "Meerut",
    status: "available",
    contact: "ankit@kursathfoundation.org"
  },
  {
    name: "Vijay Prajapati",
    specialty: "Schemes & docs",
    city: "Gurgaon",
    status: "available",
    contact: "vijay@kursathfoundation.org"
  }
];

const seedIfEmpty = async () => {
  // If fallback JSON mode is active
  if (getFallbackStatus()) {
    try {
      if (!fs.existsSync(fallbackFilePath)) {
        fs.writeFileSync(fallbackFilePath, JSON.stringify({ opportunities: [], volunteers: [], messages: [], users: [] }));
      }
      
      const fileData = fs.readFileSync(fallbackFilePath, 'utf8');
      const db = JSON.parse(fileData);
      let changed = false;

      if (!db.opportunities || db.opportunities.length === 0) {
        db.opportunities = sampleOpportunities.map((o, idx) => ({ _id: `opp_${idx + 1}`, ...o, createdAt: new Date().toISOString() }));
        changed = true;
        console.log(`AutoSeed(JSON): Preloaded ${sampleOpportunities.length} opportunities.`);
      }

      if (!db.volunteers || db.volunteers.length === 0) {
        db.volunteers = sampleVolunteers.map((v, idx) => ({ _id: `vol_${idx + 1}`, ...v, createdAt: new Date().toISOString() }));
        changed = true;
        console.log(`AutoSeed(JSON): Preloaded ${sampleVolunteers.length} volunteers.`);
      }

      if (!db.users) db.users = [];
      const adminExists = db.users.some(u => u.username === 'info@kursathfoundation.org');
      if (!adminExists) {
        // Remove old generic 'admin' user if present
        db.users = db.users.filter(u => u.username !== 'admin');
        
        const hashedPassword = bcrypt.hashSync('kursath@2000', 10);
        db.users.push({
          _id: 'user_admin',
          username: 'info@kursathfoundation.org',
          password: hashedPassword,
          role: 'admin',
          permissions: {
            view: true,
            edit: true,
            delete: true
          },
          createdAt: new Date().toISOString()
        });
        changed = true;
        console.log('AutoSeed(JSON): Preloaded Admin user (username: info@kursathfoundation.org, password set).');
      }

      if (changed) {
        fs.writeFileSync(fallbackFilePath, JSON.stringify(db, null, 2));
      }
    } catch (err) {
      console.error('AutoSeed(JSON): Error seeding JSON file fallback:', err.message);
    }
    return;
  }

  // If MongoDB/Mongoose mode is active
  try {
    const oppCount = await Opportunity.countDocuments();
    if (oppCount === 0) {
      await Opportunity.insertMany(sampleOpportunities);
      console.log(`AutoSeed(Mongoose): Seeded ${sampleOpportunities.length} opportunities into MongoDB.`);
    }

    const volCount = await Volunteer.countDocuments();
    if (volCount === 0) {
      await Volunteer.insertMany(sampleVolunteers);
      console.log(`AutoSeed(Mongoose): Seeded ${sampleVolunteers.length} volunteers into MongoDB.`);
    }

    const adminUserExists = await User.findOne({ username: 'info@kursathfoundation.org' });
    if (!adminUserExists) {
      // Clean up legacy generic 'admin' account
      await User.deleteOne({ username: 'admin' });
      
      const hashedPassword = bcrypt.hashSync('kursath@2000', 10);
      const adminUser = new User({
        username: 'info@kursathfoundation.org',
        password: hashedPassword,
        role: 'admin',
        permissions: {
          view: true,
          edit: true,
          delete: true
        }
      });
      await adminUser.save();
      console.log('AutoSeed(Mongoose): Seeded Admin user (info@kursathfoundation.org, password set) into MongoDB.');
    }
  } catch (err) {
    console.error('AutoSeed(Mongoose): Error performing check or seeding database:', err.message);
  }
};

module.exports = { seedIfEmpty };

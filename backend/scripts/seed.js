const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Mongoose Models
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
    deadline: "15 Nov 2025",
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
    deadline: "20 Dec 2025",
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
    deadline: "30 Nov 2025",
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
    deadline: "31 Oct 2025",
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

async function seedMongoDB() {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/kursath-foundation';
  try {
    await mongoose.connect(mongoURI, { serverSelectionTimeoutMS: 2000 });
    console.log('Seed: Connected to MongoDB.');

    // Clear existing data
    await Opportunity.deleteMany({});
    await Volunteer.deleteMany({});
    await User.deleteMany({});

    // Insert Opportunities
    await Opportunity.insertMany(sampleOpportunities);
    console.log(`Seed: Inserted ${sampleOpportunities.length} opportunities into MongoDB.`);

    // Insert Volunteers
    await Volunteer.insertMany(sampleVolunteers);
    console.log(`Seed: Inserted ${sampleVolunteers.length} volunteers into MongoDB.`);

    // Hash Admin Password
    const hashedPassword = bcrypt.hashSync('password123', 10);
    const adminUser = new User({
      username: 'admin',
      password: hashedPassword
    });
    await adminUser.save();
    console.log('Seed: Created Admin user (username: admin, password: password123) in MongoDB.');

    await mongoose.disconnect();
    console.log('Seed: MongoDB disconnect.');
  } catch (err) {
    console.log('Seed: MongoDB connection failed, seeding JSON file fallback instead.');
    seedJSON();
  }
}

function seedJSON() {
  const hashedPassword = bcrypt.hashSync('password123', 10);

  // Structure the fallback object
  const dbData = {
    opportunities: sampleOpportunities.map((opp, index) => ({
      _id: `opp_${index + 1}`,
      ...opp,
      createdAt: new Date().toISOString()
    })),
    volunteers: sampleVolunteers.map((vol, index) => ({
      _id: `vol_${index + 1}`,
      ...vol,
      createdAt: new Date().toISOString()
    })),
    messages: [],
    users: [
      {
        _id: 'user_admin',
        username: 'admin',
        password: hashedPassword,
        createdAt: new Date().toISOString()
      }
    ]
  };

  // Write file
  fs.writeFileSync(fallbackFilePath, JSON.stringify(dbData, null, 2));
  console.log(`Seed: Successfully seeded local JSON file fallback (${sampleOpportunities.length} opportunities, ${sampleVolunteers.length} volunteers, 1 Admin user) at ${fallbackFilePath}`);
}

// Run Seeding
(async () => {
  await seedMongoDB();
})();

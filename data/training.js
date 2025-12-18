export const weeklyTrainingMaterials = [
  {
    id: 1,
    week: 'Week 1',
    title: 'Building Taqwa in Daily Life',
    category: 'Tarbiya',
    description: 'Understanding God-consciousness in modern student life',
    downloadUrl: '/materials/week1-taqwa.pdf',
    topics: ['Awareness of Allah', 'Daily Practices', 'Student Challenges']
  },
  {
    id: 2,
    week: 'Week 2',
    title: 'The Art of Dawah: Logic and Evidence',
    category: 'Dawah',
    description: 'Mastering intellectual dialogue with wisdom',
    downloadUrl: '/materials/week2-dawah.pdf',
    topics: ['Logical Arguments', 'Burhan Methodology', 'Hikmah in Discourse']
  },
  {
    id: 3,
    week: 'Week 3',
    title: 'Strategic Leadership in Islamic Organizations',
    category: 'Idad',
    description: 'Planning and managing Muslim student organizations',
    downloadUrl: '/materials/week3-leadership.pdf',
    topics: ['Vision Setting', 'Team Management', 'Shura Process']
  },
  {
    id: 4,
    week: 'Week 4',
    title: 'Student Fiqh: Rulings for University Life',
    category: 'Irshad',
    description: 'Practical Islamic rulings for academic settings',
    downloadUrl: '/materials/week4-fiqh.pdf',
    topics: ['Exam Ethics', 'Travel Rules', 'Financial Transactions']
  },
  {
    id: 5,
    week: 'Week 5',
    title: 'Tazkiyat al-Nafs: Purification of the Heart',
    category: 'Tarbiya',
    description: 'Identifying and treating spiritual diseases',
    downloadUrl: '/materials/week5-tazkiyah.pdf',
    topics: ['Pride & Envy', 'Spiritual Laziness', 'Accountability']
  },
  {
    id: 6,
    week: 'Week 6',
    title: 'Public Speaking & Khutbah Delivery',
    category: 'Idad',
    description: 'Mastering the art of Islamic public speaking',
    downloadUrl: '/materials/week6-khutbah.pdf',
    topics: ['Voice Modulation', 'Sermon Structure', 'Engaging the Audience']
  }
];

export const idadPrograms = [
  {
    id: 'qadah',
    name: 'Idad Al-Qadah',
    title: 'Leadership Preparation',
    sector: 'Irshad',
    duration: '12 weeks',
    description: 'Comprehensive training for Muslim student leaders',
    modules: [
      {
        name: 'Strategic Planning',
        topics: ['Long-term Vision', 'Goal Setting', 'Resource Management']
      },
      {
        name: 'Conflict Resolution',
        topics: ['Mediation Skills', 'Islamic Principles of Islah', 'Communication']
      },
      {
        name: 'Public Relations',
        topics: ['Media Engagement', 'Representing Islam', 'University Relations']
      },
      {
        name: 'Youth Mentorship',
        topics: ['Train the Trainer', 'Peer Leadership', 'Character Development']
      }
    ],
    requirements: ['Leadership experience', 'Good standing in Jemea', 'Interview']
  },
  {
    id: 'duat',
    name: 'Idad Al-Duat',
    title: 'Caller Preparation',
    sector: 'Dawah',
    duration: '10 weeks',
    description: 'Training in the art of Islamic outreach and dialogue',
    modules: [
      {
        name: 'Dialogue & Logic',
        topics: ['Logical Arguments', 'Burhan Methodology', 'Socratic Method']
      },
      {
        name: 'Psychology of Dawah',
        topics: ['Understanding Audiences', 'Addressing Doubts', 'Wisdom in Approach']
      },
      {
        name: 'Comparative Religion',
        topics: ['Christianity', 'Judaism', 'Atheism & Materialism']
      },
      {
        name: 'Digital Dawah',
        topics: ['Content Creation', 'Social Media Strategy', 'Online Safety']
      }
    ],
    requirements: ['Basic Islamic knowledge', 'Communication skills', 'Application form']
  },
  {
    id: 'imam',
    name: 'Idad Al-Imam',
    title: 'Imam Preparation',
    sector: 'Irshad',
    duration: '16 weeks',
    description: 'Comprehensive training for leading prayer and community',
    modules: [
      {
        name: 'Fiqh of Worship',
        topics: ['Salah Rulings', 'Janazah Procedures', 'Eid & Jumuah']
      },
      {
        name: 'Tajweed Excellence',
        topics: ['Advanced Recitation', 'Makharij', 'Beautification']
      },
      {
        name: 'Community Care',
        topics: ['Visiting the Sick', 'Counseling', 'Nikkah Contracts']
      },
      {
        name: 'Masjid Management',
        topics: ['Administration', 'Event Planning', 'Financial Management']
      }
    ],
    requirements: ['Quran memorization (min 5 Juz)', 'Tajweed certification', 'Interview']
  },
  {
    id: 'khutaba',
    name: 'Idad Al-Khutaba',
    title: 'Oratory & Sermon Training',
    sector: 'Dawah & Irshad',
    duration: '12 weeks',
    description: 'Master the art of public speaking and sermon delivery',
    modules: [
      {
        name: 'Public Speaking Fundamentals',
        topics: ['Overcoming Fear', 'Voice Modulation', 'Body Language']
      },
      {
        name: 'Khutbah Structure',
        topics: ['Opening & Hamdala', 'Evidence & Stories', 'Call to Action']
      },
      {
        name: 'Addressing Modernity',
        topics: ['Mental Health', 'Technology', 'Social Ethics']
      },
      {
        name: 'Rhetoric & Balagha',
        topics: ['Arabic Eloquence', 'Persuasive Techniques', 'Emotional Appeal']
      }
    ],
    requirements: ['Basic Arabic', 'Public speaking interest', 'Sample speech submission']
  }
];

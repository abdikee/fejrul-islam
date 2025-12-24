'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Users, Heart, MessageCircle, ArrowRight, CheckCircle, Star, Target, Globe } from 'lucide-react';
import ManagedPageSection from '@/components/site/ManagedPageSection';

const sectors = [
  {
    id: 1,
    title: 'Qirat & Ilm',
    subtitle: 'Knowledge, Learning, Academic Faith Development',
    description: 'The foundation of Islamic education, focusing on Quranic recitation, Islamic sciences, and comprehensive knowledge acquisition.',
    icon: BookOpen,
    color: 'emerald',
    detailedDescription: `The Qirat & Ilm sector serves as the cornerstone of Islamic education at HUMSJ. This comprehensive program integrates traditional Islamic sciences with modern academic approaches, ensuring students develop a deep understanding of their faith while maintaining academic excellence.

Our curriculum encompasses Quranic studies with proper Tajweed, Hadith sciences, Islamic jurisprudence (Fiqh), Islamic history, and Arabic language studies. We believe that true knowledge (Ilm) is not merely academic but transformative, shaping both the mind and the heart.

The sector emphasizes critical thinking, research methodology, and scholarly discourse while maintaining the spiritual dimension of learning. Students engage with classical Islamic texts alongside contemporary scholarship, developing the ability to navigate modern challenges through an Islamic lens.`,
    tracks: [
      {
        name: 'Quran Track',
        description: 'Comprehensive Quranic studies including Tajweed, Tafsir, and memorization',
        features: ['Tajweed Mastery', 'Tafsir Studies', 'Quranic Arabic', 'Memorization Programs']
      },
      {
        name: 'Kitab Track', 
        description: 'Classical Islamic texts and scholarly works',
        features: ['Hadith Sciences', 'Fiqh Studies', 'Islamic History', 'Arabic Literature']
      },
      {
        name: 'Islam Essentials',
        description: 'Fundamental Islamic knowledge for all students',
        features: ['Aqeedah (Creed)', 'Basic Fiqh', 'Seerah (Biography)', 'Islamic Ethics']
      },
      {
        name: 'Resource Vault',
        description: 'Digital library and learning resources',
        features: ['Digital Library', 'Research Tools', 'Study Materials', 'Online Courses']
      }
    ],
    objectives: [
      'Develop deep understanding of Islamic sciences',
      'Master Quranic recitation and comprehension',
      'Build strong foundation in Arabic language',
      'Cultivate scholarly research skills',
      'Integrate Islamic knowledge with modern education'
    ]
  },
  {
    id: 2,
    title: 'Literature & History',
    subtitle: 'Identity, Memory, Intellectual Expression',
    description: 'Preserving Islamic heritage while fostering creative expression and documenting the journey of Muslim communities.',
    icon: Users,
    color: 'amber',
    detailedDescription: `The Literature & History sector is dedicated to preserving the rich intellectual and cultural heritage of the Muslim Ummah while encouraging contemporary creative expression. This sector serves as the memory keeper of our community, documenting achievements, challenges, and growth.

We believe that understanding our history is crucial for shaping our future. Through comprehensive historical studies, creative writing programs, and documentation projects, students connect with their Islamic identity and contribute to the ongoing narrative of Muslim excellence.

The sector encourages students to express their faith through various forms of literature - poetry, essays, research papers, and creative works. We maintain archives of community achievements, publish student works, and create platforms for intellectual discourse that bridges traditional Islamic scholarship with contemporary expression.`,
    tracks: [
      {
        name: 'Jemea History',
        description: 'Comprehensive documentation of HUMSJ history and milestones',
        features: ['Historical Archives', 'Timeline Documentation', 'Legacy Projects', 'Oral History Collection']
      },
      {
        name: 'Status Dashboard',
        description: 'Tracking community growth and achievements',
        features: ['Progress Metrics', 'Achievement Records', 'Impact Assessment', 'Growth Analytics']
      },
      {
        name: 'Creative Works',
        description: 'Platform for student literary and artistic expression',
        features: ['Poetry Collections', 'Essay Publications', 'Creative Writing', 'Art Exhibitions']
      },
      {
        name: 'Publications',
        description: 'Academic and intellectual publications',
        features: ['Research Papers', 'Academic Journals', 'Book Publications', 'Digital Archives']
      }
    ],
    objectives: [
      'Preserve and document Islamic heritage',
      'Encourage creative and intellectual expression',
      'Build strong community identity and memory',
      'Publish high-quality academic and creative works',
      'Connect historical wisdom with contemporary challenges'
    ]
  },
  {
    id: 3,
    title: 'Tarbiya & Idad',
    subtitle: 'Character Development, Spiritual Growth & Leadership Training',
    description: 'Comprehensive character building and leadership development rooted in Islamic values and prophetic guidance.',
    icon: Heart,
    color: 'rose',
    detailedDescription: `The Tarbiya & Idad sector focuses on the holistic development of Muslim character and leadership capabilities. Tarbiya (character development) emphasizes spiritual purification, moral excellence, and personal growth, while Idad (preparation/training) develops specialized skills for community leadership and service.

This sector recognizes that true leadership in Islam begins with self-mastery and spiritual development. Through systematic programs of self-reflection, peer accountability, and mentorship, students develop the inner qualities necessary for effective leadership while acquiring practical skills for community service.

Our approach combines traditional Islamic methods of character development with modern leadership training, creating well-rounded individuals who can serve their communities with wisdom, integrity, and effectiveness. The sector prepares future imams, community leaders, speakers, and activists who embody Islamic values in their personal and professional lives.`,
    tracks: [
      {
        name: 'Tazkiyat al-Nafs',
        description: 'Spiritual purification and character development',
        features: ['Heart Purification', 'Spiritual Diseases Treatment', 'Self-Accountability', 'Dhikr Programs']
      },
      {
        name: 'Usrah Circles',
        description: 'Brotherhood/sisterhood building and peer support',
        features: ['Peer Mentorship', 'Accountability Groups', 'Brotherhood Building', 'Support Networks']
      },
      {
        name: 'Training Materials',
        description: 'Comprehensive resources for character development',
        features: ['Weekly Curricula', 'Study Guides', 'Reflection Exercises', 'Assessment Tools']
      },
      {
        name: 'Idad Programs',
        description: 'Specialized leadership training tracks',
        features: ['Imam Training', 'Speaker Development', 'Community Leadership', 'Activist Preparation']
      }
    ],
    objectives: [
      'Develop strong Islamic character and spirituality',
      'Build effective leadership and communication skills',
      'Create supportive brotherhood/sisterhood networks',
      'Prepare specialized community servants',
      'Integrate spiritual growth with practical skills'
    ]
  },
  {
    id: 4,
    title: 'Dawah & Comparative Religion',
    subtitle: 'Outreach, Logic, Intellectual Defense',
    description: 'Equipping Muslims with knowledge and skills for effective dawah, interfaith dialogue, and intellectual engagement.',
    icon: MessageCircle,
    color: 'blue',
    detailedDescription: `The Dawah & Comparative Religion sector prepares Muslims to engage confidently and effectively with people of all backgrounds and beliefs. This sector combines deep Islamic knowledge with understanding of other worldviews, enabling respectful and informed dialogue.

We emphasize the importance of hikmah (wisdom) in all interactions, teaching students to present Islam with clarity, compassion, and intellectual rigor. The sector addresses contemporary challenges to faith, equips students with logical arguments, and provides practical training in communication and dialogue skills.

Our approach includes studying comparative religion not to diminish other faiths, but to understand different perspectives and find common ground for meaningful conversation. We prepare students to defend Islamic principles intellectually while maintaining the prophetic character of gentleness and respect in all interactions.`,
    tracks: [
      {
        name: 'Comparative Religion',
        description: 'Study of world religions and belief systems',
        features: ['Interfaith Dialogue', 'Ahl al-Kitab Studies', 'World Religions Overview', 'Common Ground Identification']
      },
      {
        name: 'Modern Ideologies',
        description: 'Understanding and responding to contemporary worldviews',
        features: ['Atheism & Agnosticism', 'Secularism Analysis', 'Materialism Critique', 'Philosophical Responses']
      },
      {
        name: 'Revert Journey',
        description: 'Supporting those entering or exploring Islam',
        features: ['Mentorship Programs', 'Integration Support', 'Basic Fiqh Training', 'Community Welcome']
      },
      {
        name: 'Debate & Dialogue',
        description: 'Practical skills for intellectual engagement',
        features: ['Debate Training', 'Logic & Reasoning', 'Communication Skills', 'Respectful Discourse']
      }
    ],
    objectives: [
      'Develop effective dawah and communication skills',
      'Build understanding of diverse worldviews and religions',
      'Prepare intellectual responses to contemporary challenges',
      'Support new Muslims and seekers',
      'Foster respectful interfaith dialogue and understanding'
    ]
  },
  {
    id: 5,
    title: 'Ziyara (Student Welfare)',
    subtitle: 'Student Welfare & Community Support',
    description: 'Comprehensive support system ensuring the holistic wellbeing and community development of all students.',
    icon: Heart,
    color: 'purple',
    detailedDescription: `The Ziyara sector serves as the caring and nurturing arm of HUMSJ, ensuring that every student receives the support they need to thrive academically, spiritually, and personally. Ziyara, meaning "visit" or "care," embodies our commitment to knowing and caring for each individual student while building strong community bonds.

This sector provides comprehensive welfare services including academic support, mental health resources, spiritual counseling, and practical assistance. We recognize that students face diverse challenges and our role is to provide a supportive community environment that enables success while maintaining Islamic values and fostering brotherhood/sisterhood.

The sector also focuses on developing student leadership capabilities through community service, peer support programs, and practical experience opportunities. Students develop the skills and confidence needed for effective community service while learning to care for and support their fellow students in the spirit of Islamic brotherhood.`,
    tracks: [
      {
        name: 'Student Support Hub',
        description: 'Comprehensive student support and community building',
        features: ['Peer Support Networks', 'Academic Assistance', 'Community Events', 'Brotherhood/Sisterhood Building']
      },
      {
        name: 'Counseling & Guidance',
        description: 'Mental health and spiritual support services',
        features: ['Individual Counseling', 'Group Support', 'Spiritual Guidance', 'Crisis Support']
      },
      {
        name: 'Community Service',
        description: 'Practical service and community engagement',
        features: ['Volunteer Programs', 'Community Outreach', 'Service Projects', 'Social Impact']
      },
      {
        name: 'Leadership Development',
        description: 'Student leadership and mentorship programs',
        features: ['Peer Mentorship', 'Leadership Skills', 'Community Projects', 'Service Leadership']
      }
    ],
    objectives: [
      'Ensure comprehensive student welfare and support',
      'Build strong community bonds and brotherhood/sisterhood',
      'Provide accessible mental health and counseling services',
      'Foster community service and social responsibility',
      'Develop caring and supportive student leaders'
    ]
  }
];

const colorMap = {
  emerald: {
    gradient: 'from-emerald-500 to-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    button: 'bg-emerald-600 hover:bg-emerald-700'
  },
  amber: {
    gradient: 'from-amber-500 to-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    button: 'bg-amber-600 hover:bg-amber-700'
  },
  rose: {
    gradient: 'from-rose-500 to-rose-700',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    button: 'bg-rose-600 hover:bg-rose-700'
  },
  blue: {
    gradient: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    button: 'bg-blue-600 hover:bg-blue-700'
  },
  purple: {
    gradient: 'from-purple-500 to-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    button: 'bg-purple-600 hover:bg-purple-700'
  }
};

export default function SectorsPage() {
  const [selectedSector, setSelectedSector] = useState(null);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxib29rc3xlbnwwfHx8fDE3NjYwNTEwMjd8MA&ixlib=rb-4.1.0&q=85"
            alt="Islamic Education Sectors" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl font-serif font-bold mb-4">Our Five Sectors</h1>
          <p className="text-2xl font-light">Comprehensive Islamic Development Framework</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-emerald-600">Home</Link>
            <span>/</span>
            <span className="text-emerald-600 font-semibold">Sectors</span>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">Holistic Islamic Development</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Our five-sector framework provides comprehensive Islamic education and development, 
              addressing every aspect of a Muslim's spiritual, intellectual, and social growth. 
              Each sector is carefully designed to complement the others, creating a holistic 
              approach to Islamic education and character development.
            </p>
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {sectors.map((sector) => {
              const Icon = sector.icon;
              const colors = colorMap[sector.color];
              
              return (
                <div 
                  key={sector.id}
                  className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => setSelectedSector(sector)}
                >
                  <div className={`h-2 bg-gradient-to-r ${colors.gradient}`}></div>
                  
                  <div className="p-8">
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${colors.gradient} text-white`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">
                          {sector.title}
                        </h3>
                        <p className={`text-sm font-semibold ${colors.text} mb-3`}>
                          {sector.subtitle}
                        </p>
                        <p className="text-slate-600 leading-relaxed">
                          {sector.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      {sector.tracks.slice(0, 4).map((track, idx) => (
                        <div key={idx} className={`p-3 ${colors.bg} ${colors.border} border rounded-lg`}>
                          <h4 className="font-semibold text-slate-800 text-sm mb-1">{track.name}</h4>
                          <p className="text-xs text-slate-600">{track.description}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className={`flex items-center ${colors.text} font-semibold hover:gap-3 gap-2 transition-all`}>
                      Learn More
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sector Detail Modal */}
      {selectedSector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${colorMap[selectedSector.color].gradient} text-white`}>
                    <selectedSector.icon className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-slate-800">{selectedSector.title}</h2>
                    <p className={`text-lg font-semibold ${colorMap[selectedSector.color].text} mb-2`}>
                      {selectedSector.subtitle}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSector(null)}
                  className="text-slate-400 hover:text-slate-600 text-3xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <div className="prose max-w-none">
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Sector Overview</h3>
                    <div className="text-slate-700 leading-relaxed whitespace-pre-line mb-6">
                      {selectedSector.detailedDescription}
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-4">Learning Tracks</h3>
                    <div className="space-y-4">
                      {selectedSector.tracks.map((track, idx) => (
                        <div key={idx} className={`p-4 ${colorMap[selectedSector.color].bg} ${colorMap[selectedSector.color].border} border rounded-lg`}>
                          <h4 className="font-bold text-slate-800 mb-2">{track.name}</h4>
                          <p className="text-slate-600 text-sm mb-3">{track.description}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {track.features.map((feature, fIdx) => (
                              <div key={fIdx} className="flex items-center gap-2 text-sm text-slate-700">
                                <CheckCircle className="w-4 h-4 text-green-500" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="space-y-6">
                  <div className={`p-6 ${colorMap[selectedSector.color].bg} ${colorMap[selectedSector.color].border} border rounded-lg`}>
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Key Objectives
                    </h4>
                    <ul className="space-y-2">
                      {selectedSector.objectives.map((objective, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          {objective}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                    <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Impact & Reach
                    </h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Active Programs:</span>
                        <span className="font-semibold">{selectedSector.tracks.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Learning Areas:</span>
                        <span className="font-semibold">{selectedSector.tracks.reduce((acc, track) => acc + track.features.length, 0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Key Objectives:</span>
                        <span className="font-semibold">{selectedSector.objectives.length}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                <p className="text-slate-600 mb-4">
                  Ready to explore this sector and begin your journey?
                </p>
                <button 
                  onClick={() => alert('Enrollment system coming soon!')}
                  className={`px-8 py-3 ${colorMap[selectedSector.color].button} text-white rounded-lg transition-colors font-semibold`}
                >
                  Get Started with {selectedSector.title}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Begin Your Comprehensive Islamic Journey
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-emerald-100">
            Our five-sector framework ensures balanced development in all aspects of Islamic life. 
            Start your journey today and experience holistic growth.
          </p>
          <Link 
            href="/auth/login" 
            className="inline-block px-8 py-4 bg-white text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition-colors shadow-lg"
          >
            Start Your Journey
          </Link>
        </div>
      </section>
    </div>
  );
}
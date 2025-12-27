'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  MessageSquare, Compass, Globe, Users, BookOpen, 
  ArrowRight, CheckCircle, Star, Target, Calendar,
  Heart, Phone, Mail, MapPin, Clock, Award, FileText, Shield,
  UserPlus, Loader2
} from 'lucide-react';
import EnrollmentButton from '@/components/enrollment/EnrollmentButton';

// The 5 main sectors of HUMSJ with their programs
const sectorsData = {
  'qirat-ilm': {
    id: 1,
    title: 'Qirat & Ilm',
    subtitle: 'Quranic Recitation & Islamic Knowledge',
    description: 'The foundation of Islamic education, focusing on Quranic recitation, Islamic sciences, and comprehensive knowledge acquisition.',
    icon: BookOpen,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-600',
    detailedDescription: `The Qirat & Ilm sector serves as the cornerstone of Islamic education at HUMSJ. This comprehensive program integrates traditional Islamic sciences with modern academic approaches, ensuring participants develop a deep understanding of their faith while maintaining academic excellence.

Our curriculum encompasses Quranic studies with proper Tajweed, Hadith sciences, Islamic jurisprudence (Fiqh), Islamic history, and Arabic language studies. We believe that true knowledge (Ilm) is not merely academic but transformative, shaping both the mind and the heart.

The sector emphasizes critical thinking, research methodology, and scholarly discourse while maintaining the spiritual dimension of learning. Participants engage with classical Islamic texts alongside contemporary scholarship, developing the ability to navigate modern challenges through an Islamic lens.`,
    programs: [
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
        description: 'Fundamental Islamic knowledge for all participants',
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
    ],
    stats: { programs: 24, participants: 2847, sessionsCompleted: 1234 }
  },
  'literature-history': {
    id: 2,
    title: 'Literature & History',
    subtitle: 'Islamic Heritage & Creative Expression',
    description: 'Preserving Islamic heritage while fostering creative expression and documenting the journey of Muslim communities.',
    icon: FileText,
    color: 'amber',
    gradient: 'from-amber-500 to-orange-600',
    detailedDescription: `The Literature & History sector is dedicated to preserving the rich intellectual and cultural heritage of the Muslim Ummah while encouraging contemporary creative expression. This sector serves as the memory keeper of our community, documenting achievements, challenges, and growth.

We believe that understanding our history is crucial for shaping our future. Through comprehensive historical studies, creative writing programs, and documentation projects, participants connect with their Islamic identity and contribute to the ongoing narrative of Muslim excellence.

The sector encourages participants to express their faith through various forms of literature - poetry, essays, research papers, and creative works. We maintain archives of community achievements, publish participant works, and create platforms for intellectual discourse that bridges traditional Islamic scholarship with contemporary expression.`,
    programs: [
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
        description: 'Platform for participant literary and artistic expression',
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
    ],
    stats: { programs: 18, participants: 1234, sessionsCompleted: 567 }
  },
  'dawah-comparative-religion': {
    id: 3,
    title: 'Dawah & Comparative Religion',
    subtitle: 'Outreach, Dialogue & Intellectual Defense',
    description: 'Equipping Muslims with knowledge and skills for effective dawah, interfaith dialogue, and intellectual engagement.',
    icon: MessageSquare,
    color: 'blue',
    gradient: 'from-blue-500 to-indigo-600',
    detailedDescription: `The Dawah & Comparative Religion sector prepares Muslims to engage confidently and effectively with people of all backgrounds and beliefs. This sector combines deep Islamic knowledge with understanding of other worldviews, enabling respectful and informed dialogue.

We emphasize the importance of hikmah (wisdom) in all interactions, teaching participants to present Islam with clarity, compassion, and intellectual rigor. The sector addresses contemporary challenges to faith, equips participants with logical arguments, and provides practical training in communication and dialogue skills.

Our approach includes studying comparative religion not to diminish other faiths, but to understand different perspectives and find common ground for meaningful conversation. We prepare participants to defend Islamic principles intellectually while maintaining the prophetic character of gentleness and respect in all interactions.`,
    programs: [
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
    ],
    stats: { programs: 22, participants: 1567, sessionsCompleted: 890 }
  },
  'tarbiya-idad': {
    id: 4,
    title: 'Tarbiya & Idad',
    subtitle: 'Character Building & Leadership Training',
    description: 'Comprehensive character building and leadership development rooted in Islamic values and prophetic guidance.',
    icon: Heart,
    color: 'rose',
    gradient: 'from-rose-500 to-pink-600',
    detailedDescription: `The Tarbiya & Idad sector focuses on the holistic development of Muslim character and leadership capabilities. Tarbiya (character development) emphasizes spiritual purification, moral excellence, and personal growth, while Idad (preparation/training) develops specialized skills for community leadership and service.

This sector recognizes that true leadership in Islam begins with self-mastery and spiritual development. Through systematic programs of self-reflection, peer accountability, and mentorship, participants develop the inner qualities necessary for effective leadership while acquiring practical skills for community service.

Our approach combines traditional Islamic methods of character development with modern leadership training, creating well-rounded individuals who can serve their communities with wisdom, integrity, and effectiveness. The sector prepares future imams, community leaders, speakers, and activists who embody Islamic values in their personal and professional lives.`,
    programs: [
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
    ],
    stats: { programs: 16, participants: 987, sessionsCompleted: 456 }
  },
  'ziyara': {
    id: 5,
    title: 'Ziyara',
    subtitle: 'Student Welfare & Community Support',
    description: 'Comprehensive support system ensuring the holistic wellbeing and development of all participants.',
    icon: Shield,
    color: 'purple',
    gradient: 'from-purple-500 to-violet-600',
    detailedDescription: `The Ziyara sector serves as the protective and nurturing arm of HUMSJ, ensuring that every participant receives the support they need to thrive academically, spiritually, and personally. Ziyara, meaning "visit" or "care," embodies our commitment to knowing and caring for each individual.

This sector provides comprehensive welfare services including academic support, mental health resources, spiritual counseling, and practical assistance. We recognize that participants face diverse challenges and our role is to provide a safety net that enables success while maintaining Islamic values and community bonds.

The sector also focuses on developing participant leadership capabilities, identifying and nurturing future leaders who will serve the Muslim community. Through mentorship programs, leadership training, and practical experience opportunities, participants develop the skills and confidence needed for effective community service.`,
    programs: [
      {
        name: 'Welfare Dashboard',
        description: 'Comprehensive participant support and tracking system',
        features: ['Participant Tracking', 'Wellbeing Assessment', 'Support Coordination', 'Progress Monitoring']
      },
      {
        name: 'Counseling Services',
        description: 'Mental health and spiritual support services',
        features: ['Individual Counseling', 'Group Therapy', 'Spiritual Guidance', 'Crisis Intervention']
      },
      {
        name: 'Status Tracking',
        description: 'Academic and personal development monitoring',
        features: ['Academic Progress', 'Attendance Tracking', 'Goal Setting', 'Achievement Recognition']
      },
      {
        name: 'Leadership Access',
        description: 'Advanced leadership development programs',
        features: ['Leadership Training', 'Mentorship Programs', 'Skill Development', 'Community Projects']
      }
    ],
    objectives: [
      'Ensure comprehensive participant welfare and support',
      'Provide mental health and counseling services',
      'Monitor and support academic and personal progress',
      'Develop future community leaders and servants',
      'Create a caring and supportive community environment'
    ],
    stats: { programs: 12, participants: 756, sessionsCompleted: 345 }
  }
};

const colorMap = {
  emerald: {
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    button: 'bg-emerald-600 hover:bg-emerald-700',
    light: 'bg-emerald-100'
  },
  amber: {
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    button: 'bg-amber-600 hover:bg-amber-700',
    light: 'bg-amber-100'
  },
  blue: {
    gradient: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    button: 'bg-blue-600 hover:bg-blue-700',
    light: 'bg-blue-100'
  },
  rose: {
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    button: 'bg-rose-600 hover:bg-rose-700',
    light: 'bg-rose-100'
  },
  purple: {
    gradient: 'from-purple-500 to-violet-600',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    text: 'text-purple-700',
    button: 'bg-purple-600 hover:bg-purple-700',
    light: 'bg-purple-100'
  }
};

export default function SectorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug;
  const sector = sectorsData[slug];
  const [dbSector, setDbSector] = useState(null);
  const [activeProgram, setActiveProgram] = useState(null);
  const [user, setUser] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState({
    motivation: '',
    studyHours: '5',
    previousKnowledge: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const sectorIdForApi = dbSector?.id ?? sector?.id;
  const programsToShow = Array.isArray(dbSector?.programs) && dbSector.programs.length > 0 ? dbSector.programs : (sector?.programs || []);
  const programsCount = typeof dbSector?.program_count === 'number' ? dbSector.program_count : sector?.stats?.programs;
  const participantsCount = typeof dbSector?.participants_count === 'number' ? dbSector.participants_count : sector?.stats?.participants;

  // Check if user is logged in and enrolled
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Load DB-backed sector info (programs + real sector id)
        try {
          const homeRes = await fetch('/api/public/home-sectors', { cache: 'no-store' });
          const homeData = await homeRes.json();
          if (homeData?.success && Array.isArray(homeData.sectors)) {
            const match = homeData.sectors.find((s) => s.code === slug);
            if (match) setDbSector(match);
          }
        } catch (e) {
          // best-effort
        }

        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          
          // Check enrollment status
          if (sectorIdForApi) {
            const enrollRes = await fetch(`/api/sectors/${sectorIdForApi}/enrollment-status`);
            if (enrollRes.ok) {
              const enrollData = await enrollRes.json();
              setIsEnrolled(enrollData.isEnrolled);
            }
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [slug, sectorIdForApi]);

  // Handle enrollment
  const handleEnroll = async () => {
    const returnUrl = encodeURIComponent(`/sectors/${slug}`);
    if (!user) {
      router.push(`/auth/login?returnUrl=${returnUrl}&enroll=sector:${slug}`);
      return;
    }

    setEnrolling(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch('/api/enrollment/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programType: 'sector',
          programId: slug,
          enrollmentData: { source: 'sector_page', auto_enrolled: true }
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsEnrolled(true);
        setMessage({ type: 'success', text: 'Successfully enrolled! Redirecting to dashboard...' });
        setTimeout(() => {
          router.push('/dashboard');
        }, 1200);
      } else {
        setMessage({ type: 'error', text: data.message || 'Enrollment failed' });
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setEnrolling(false);
    }
  };

  // Modal-based enrollment is deprecated in favor of auto-enroll.
  useEffect(() => {
    if (showEnrollModal) setShowEnrollModal(false);
  }, [showEnrollModal]);

  const submitEnrollment = async () => {
    if (!enrollmentData.motivation || !enrollmentData.studyHours) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }

    setEnrolling(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await fetch(`/api/sectors/${sector.id}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrollmentData)
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsEnrolled(true);
        setShowEnrollModal(false);
        setMessage({ type: 'success', text: 'Successfully enrolled! Redirecting to dashboard...' });
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.message || 'Enrollment failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setEnrolling(false);
    }
  };

  // Handle unknown sector
  if (!sector) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">Sector Not Found</h1>
          <p className="text-slate-600 mb-6">The sector you're looking for doesn't exist.</p>
          <Link 
            href="/sectors" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to All Sectors
          </Link>
        </div>
      </div>
    );
  }

  const Icon = sector.icon;
  const colors = colorMap[sector.color];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className={`relative h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-br ${colors.gradient}`}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mb-6">
            <Icon className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold mb-4">{sector.title}</h1>
          <p className="text-2xl font-light opacity-90">{sector.subtitle}</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-emerald-600">Home</Link>
            <span>/</span>
            <Link href="/sectors" className="hover:text-emerald-600">Sectors</Link>
            <span>/</span>
            <span className={`${colors.text} font-semibold`}>{sector.title}</span>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-6">
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
            <div>
              <div className={`text-3xl font-bold ${colors.text}`}>{typeof programsCount === 'number' ? programsCount : sector.stats.programs}</div>
              <div className="text-sm text-slate-600">Programs</div>
            </div>
            <div>
              <div className={`text-3xl font-bold ${colors.text}`}>{typeof participantsCount === 'number' ? participantsCount.toLocaleString() : sector.stats.participants.toLocaleString()}</div>
              <div className="text-sm text-slate-600">Participants</div>
            </div>
            <div>
              <div className={`text-3xl font-bold ${colors.text}`}>{sector.stats.sessionsCompleted}</div>
              <div className="text-sm text-slate-600">Sessions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-slate-800 mb-6">About This Sector</h2>
            <div className="text-lg text-slate-600 leading-relaxed whitespace-pre-line">
              {sector.detailedDescription}
            </div>
          </div>
        </div>
      </section>

      {/* Programs */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-10">Our Programs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {programsToShow.map((program, idx) => {
              const title = program.title || program.name;
              const description = program.description;
              const isDbProgram = Boolean(program.id) && program.title;

              if (isDbProgram) {
                return (
                  <EnrollmentButton
                    key={program.id}
                    programType="course"
                    programId={program.id}
                    programName={title}
                    variant="secondary"
                    className={`bg-white rounded-xl p-6 border-2 ${colors.border} hover:shadow-lg transition-all text-left justify-between items-start`}
                  >
                    <div className="flex flex-col items-start">
                      <div className="flex items-start justify-between w-full gap-4">
                        <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                        <ArrowRight className={`w-5 h-5 ${colors.text}`} />
                      </div>
                      {description ? <p className="text-slate-600 mt-2">{description}</p> : null}
                      <div className={`mt-4 flex flex-wrap gap-3 text-sm ${colors.text}`}>
                        {program.level ? (
                          <span className={`inline-flex items-center gap-2 ${colors.bg} ${colors.border} border rounded-lg px-3 py-1`}>
                            <CheckCircle className="w-4 h-4" />
                            {program.level}
                          </span>
                        ) : null}
                        {program.duration_weeks ? (
                          <span className={`inline-flex items-center gap-2 ${colors.bg} ${colors.border} border rounded-lg px-3 py-1`}>
                            <Calendar className="w-4 h-4" />
                            {program.duration_weeks} weeks
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </EnrollmentButton>
                );
              }

              // Fallback: existing hardcoded programs
              return (
                <div
                  key={idx}
                  className={`bg-white rounded-xl p-6 border-2 ${colors.border} hover:shadow-lg transition-all cursor-pointer ${
                    activeProgram === idx ? 'ring-2 ring-offset-2 ' + colors.border : ''
                  }`}
                  onClick={() => setActiveProgram(activeProgram === idx ? null : idx)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-slate-800">{title}</h3>
                    <ArrowRight className={`w-5 h-5 ${colors.text} transition-transform ${activeProgram === idx ? 'rotate-90' : ''}`} />
                  </div>
                  {description ? <p className="text-slate-600 mb-4">{description}</p> : null}

                  {Array.isArray(program.features) ? (
                    <div className={`grid grid-cols-2 gap-2 ${activeProgram === idx ? '' : 'hidden md:grid'}`}>
                      {program.features.map((feature, fIdx) => (
                        <div key={fIdx} className={`flex items-center gap-2 text-sm ${colors.text}`}>
                          <CheckCircle className="w-4 h-4" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Objectives */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-800 mb-10">Key Objectives</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sector.objectives.map((objective, idx) => (
                <div key={idx} className={`flex items-start gap-3 p-4 ${colors.bg} ${colors.border} border rounded-lg`}>
                  <Target className={`w-5 h-5 ${colors.text} mt-0.5 flex-shrink-0`} />
                  <span className="text-slate-700">{objective}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact / Get Involved */}
      <section className={`py-16 bg-gradient-to-br ${colors.gradient} text-white`}>
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Get Involved</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our {sector.title} sector and be part of Fejrul Islam's mission to serve the Muslim community and spread the message of Islam.
          </p>
          
          {message.text && (
            <div className={`max-w-md mx-auto mb-6 p-4 rounded-lg ${
              message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {message.text}
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {loading ? (
              <div className="inline-flex items-center gap-2 px-8 py-4 bg-white/50 text-white rounded-xl font-bold">
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </div>
            ) : isEnrolled ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-800 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg"
              >
                <CheckCircle className="w-5 h-5 text-green-600" />
                Already Enrolled - Go to Dashboard
              </Link>
            ) : (
              <button
                onClick={handleEnroll}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-800 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg"
              >
                <UserPlus className="w-5 h-5" />
                {user ? 'Enroll Now' : 'Register & Enroll'}
              </button>
            )}
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/20 text-white rounded-xl font-bold hover:bg-white/30 transition-colors border-2 border-white/50"
            >
              <Mail className="w-5 h-5" />
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8">
            <h3 className="text-2xl font-bold text-slate-800 mb-2">Enroll in {sector.title}</h3>
            <p className="text-slate-600 mb-6">Please provide some information to complete your enrollment.</p>
            
            {message.text && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {message.text}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Why do you want to join this sector? *
                </label>
                <textarea
                  value={enrollmentData.motivation}
                  onChange={(e) => setEnrollmentData({ ...enrollmentData, motivation: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={3}
                  placeholder="Share your motivation..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Hours per week you can dedicate *
                </label>
                <select
                  value={enrollmentData.studyHours}
                  onChange={(e) => setEnrollmentData({ ...enrollmentData, studyHours: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="2">1-2 hours</option>
                  <option value="5">3-5 hours</option>
                  <option value="10">6-10 hours</option>
                  <option value="15">10+ hours</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Previous knowledge/experience (optional)
                </label>
                <textarea
                  value={enrollmentData.previousKnowledge}
                  onChange={(e) => setEnrollmentData({ ...enrollmentData, previousKnowledge: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  rows={2}
                  placeholder="Any relevant background..."
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowEnrollModal(false)}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitEnrollment}
                disabled={enrolling}
                className={`flex-1 px-6 py-3 bg-gradient-to-r ${colors.gradient} text-white rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
              >
                {enrolling ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Enrolling...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Complete Enrollment
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Related Sectors */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">Explore Other Sectors</h2>
          
          <div className="flex flex-wrap justify-center gap-4">
            {Object.entries(sectorsData)
              .filter(([key]) => key !== slug)
              .map(([key, s]) => {
                const SectorIcon = s.icon;
                const sectorColors = colorMap[s.color];
                return (
                  <Link
                    key={key}
                    href={`/sectors/${key}`}
                    className={`flex items-center gap-3 px-6 py-3 bg-white rounded-xl border ${sectorColors.border} hover:shadow-md transition-all`}
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${sectorColors.gradient}`}>
                      <SectorIcon className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-semibold text-slate-800">{s.title}</span>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
}

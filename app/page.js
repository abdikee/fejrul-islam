'use client';

import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, Users, Heart, MessageCircle, Shield, ArrowRight, 
  GraduationCap, Target, TrendingUp, Award, Calendar, Clock,
  CheckCircle, Star, Globe, Lightbulb
} from 'lucide-react';
import AnnouncementsList from '@/components/announcements/AnnouncementsList';
import CoursesList from '@/components/dashboard/CoursesList';

const sectors = [
  {
    id: 1,
    title: 'Qirat & Ilm',
    subtitle: 'Knowledge & Quranic Studies',
    description: 'Comprehensive Islamic education combining traditional Quranic studies with contemporary academic excellence',
    detailedDescription: 'Our flagship sector focuses on building strong foundations in Islamic knowledge through structured Quranic recitation, memorization, and understanding. Students engage with classical Islamic texts while developing critical thinking skills.',
    icon: BookOpen,
    color: 'emerald',
    href: '/sectors/qirat-ilm',
    features: ['Quran Memorization Track', 'Classical Islamic Texts', 'Islamic Essentials Program', 'Digital Resource Library'],
    stats: { students: '450+', courses: '25', completion: '92%' }
  },
  {
    id: 2,
    title: 'Literature & History',
    subtitle: 'Cultural Heritage & Expression',
    description: 'Preserving Islamic intellectual heritage while fostering creative expression and historical understanding',
    detailedDescription: 'This sector celebrates the rich tapestry of Islamic civilization through literature, poetry, and historical studies. Students explore classical works, engage in creative writing, and develop appreciation for Islamic cultural contributions.',
    icon: Users,
    color: 'amber',
    href: '/sectors/literature',
    features: ['Islamic History Studies', 'Creative Writing Workshops', 'Poetry & Literature Analysis', 'Cultural Research Projects'],
    stats: { students: '320+', courses: '18', completion: '88%' }
  },
  {
    id: 3,
    title: 'Tarbiya & Idad',
    subtitle: 'Character Development & Leadership',
    description: 'Nurturing spiritual growth, moral character, and leadership capabilities through structured programs',
    detailedDescription: 'Focused on holistic personal development, this sector combines spiritual purification (Tazkiyah) with practical leadership training. Students participate in mentorship programs, community service, and character-building activities.',
    icon: Heart,
    color: 'rose',
    href: '/sectors/tarbiya-idad',
    features: ['Spiritual Development Programs', 'Leadership Training', 'Mentorship Circles', 'Community Service Projects'],
    stats: { students: '380+', courses: '22', completion: '95%' }
  },
  {
    id: 4,
    title: 'Dawah & Comparative Religion',
    subtitle: 'Interfaith Dialogue & Outreach',
    description: 'Developing skills in Islamic advocacy, interfaith understanding, and intellectual discourse',
    detailedDescription: 'This sector equips students with knowledge and skills for effective Islamic outreach and interfaith dialogue. Students study comparative religion, develop communication skills, and engage in community dawah activities.',
    icon: MessageCircle,
    color: 'blue',
    href: '/sectors/comparative-religion',
    features: ['Comparative Religion Studies', 'Communication Skills Training', 'Community Outreach Programs', 'Interfaith Dialogue Sessions'],
    stats: { students: '280+', courses: '16', completion: '90%' }
  },
  {
    id: 5,
    title: 'Ziyara (Protected)',
    subtitle: 'Student Welfare & Support',
    description: 'Comprehensive student support system ensuring academic success and personal well-being',
    detailedDescription: 'Our dedicated welfare sector provides holistic support for student success. From academic counseling to personal guidance, we ensure every student receives the care and attention needed for their educational journey.',
    icon: Shield,
    color: 'purple',
    href: '/sectors/ziyara-enhanced',
    features: ['Academic Counseling', 'Personal Development Support', 'Career Guidance', 'Mental Health Resources'],
    stats: { students: '500+', services: '12', satisfaction: '97%' }
  }
];

const platformStats = [
  { label: 'Active Students', value: '1,200+', icon: Users, color: 'text-emerald-600' },
  { label: 'Courses Available', value: '85+', icon: BookOpen, color: 'text-blue-600' },
  { label: 'Completion Rate', value: '94%', icon: TrendingUp, color: 'text-rose-600' },
  { label: 'Years of Excellence', value: '15+', icon: Award, color: 'text-amber-600' }
];

const keyFeatures = [
  {
    title: 'Comprehensive Curriculum',
    description: 'Structured learning paths covering all aspects of Islamic education and personal development',
    icon: GraduationCap,
    color: 'emerald'
  },
  {
    title: 'Expert Mentorship',
    description: 'Learn from qualified scholars and experienced educators dedicated to your success',
    icon: Users,
    color: 'blue'
  },
  {
    title: 'Flexible Learning',
    description: 'Online and offline learning options designed to fit your schedule and learning style',
    icon: Clock,
    color: 'amber'
  },
  {
    title: 'Community Support',
    description: 'Join a vibrant community of learners committed to Islamic values and academic excellence',
    icon: Heart,
    color: 'rose'
  },
  {
    title: 'Modern Technology',
    description: 'State-of-the-art learning management system with interactive tools and resources',
    icon: Lightbulb,
    color: 'purple'
  },
  {
    title: 'Global Perspective',
    description: 'Connect with students worldwide and gain insights into diverse Islamic cultures',
    icon: Globe,
    color: 'indigo'
  }
];

const colorMap = {
  emerald: 'from-emerald-500 to-emerald-700 hover:from-emerald-600 hover:to-emerald-800',
  amber: 'from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800',
  rose: 'from-rose-500 to-rose-700 hover:from-rose-600 hover:to-rose-800',
  blue: 'from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800',
  purple: 'from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800',
  indigo: 'from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800'
};

const featureColorMap = {
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-100 text-amber-700 border-amber-200',
  rose: 'bg-rose-100 text-rose-700 border-rose-200',
  blue: 'bg-blue-100 text-blue-700 border-blue-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200'
};

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Islamic Greeting Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white py-2">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم - In the name of Allah, the Most Gracious, the Most Merciful</p>
        </div>
      </div>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.pexels.com/photos/10638082/pexels-photo-10638082.jpeg" 
            alt="Islamic Education" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-900/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          {/* Logo */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 mb-6">
              <Image
                src="/images/humsj-logo.svg"
                alt="HUMSJ Logo"
                width={128}
                height={128}
                className="w-full h-full drop-shadow-lg"
              />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 text-emerald-400">
            Fejrul Islam
          </h1>
          <p className="text-2xl md:text-3xl mb-2 font-light text-emerald-300">HUMSJ</p>
          <p className="text-lg md:text-xl mb-6 text-slate-300">Harvard University Muslim Students Association</p>
          <div className="mb-8 p-6 bg-black/40 rounded-xl backdrop-blur-sm border border-white/20">
            <p className="text-xl font-arabic mb-3 text-emerald-300">وَقُل رَّبِّ زِدْنِي عِلْمًا</p>
            <p className="text-sm text-slate-300 italic">"And say: My Lord, increase me in knowledge" - Quran 20:114</p>
          </div>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-8 text-slate-200 leading-relaxed">
            A comprehensive Islamic educational ecosystem fostering spiritual growth, academic excellence, 
            and leadership development through innovative learning methodologies and community engagement
          </p>
          <div className="flex flex-wrap gap-4 justify-center text-lg mb-8">
            <span className="px-6 py-3 bg-emerald-600/90 rounded-full backdrop-blur-sm border border-emerald-400/30">
              <Heart className="inline w-5 h-5 mr-2" />Faith & Spirituality
            </span>
            <span className="px-6 py-3 bg-blue-600/90 rounded-full backdrop-blur-sm border border-blue-400/30">
              <BookOpen className="inline w-5 h-5 mr-2" />Knowledge & Learning
            </span>
            <span className="px-6 py-3 bg-rose-600/90 rounded-full backdrop-blur-sm border border-rose-400/30">
              <Target className="inline w-5 h-5 mr-2" />Character Building
            </span>
            <span className="px-6 py-3 bg-amber-600/90 rounded-full backdrop-blur-sm border border-amber-400/30">
              <Users className="inline w-5 h-5 mr-2" />Community Service
            </span>
          </div>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link 
              href="/auth/login" 
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Start Your Journey
            </Link>
            <Link 
              href="/sectors" 
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg transition-all duration-300 backdrop-blur-sm border border-white/30"
            >
              Explore Sectors
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Statistics */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Building a thriving community of learners dedicated to Islamic excellence
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {platformStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-4xl font-bold text-slate-800 mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-600 font-medium">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-4">
              Why Choose Fejrul Islam?
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Experience a comprehensive Islamic education platform designed for modern learners
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-200">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${featureColorMap[feature.color]} border mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Announcements */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-4">
              Latest Announcements
            </h2>
            <p className="text-slate-600">Stay updated with important news and events</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <AnnouncementsList limit={5} audience="all" />
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-4">
              Featured Courses
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Discover our latest courses across all sectors designed to enhance your Islamic knowledge and character
            </p>
          </div>
          <CoursesList limit={6} />
        </div>
      </section>

      {/* Enhanced Introduction */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-serif font-bold text-slate-800 mb-6">
                Welcome to Fejrul Islam HUMSJ
              </h2>
              <div className="mb-8 p-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-200">
                <p className="text-2xl font-arabic mb-4 text-emerald-800">
                  إِنَّمَا يَخْشَى اللَّهَ مِنْ عِبَادِهِ الْعُلَمَاءُ
                </p>
                <p className="text-lg text-emerald-700 italic font-medium">
                  "Only those fear Allah, from among His servants, who have knowledge" - Quran 35:28
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6">Our Mission & Vision</h3>
                <p className="text-lg text-slate-600 leading-relaxed mb-6">
                  Fejrul Islam HUMSJ represents the dawn of Islamic enlightenment in modern education. 
                  We are committed to creating a comprehensive ecosystem where traditional Islamic 
                  scholarship meets contemporary academic excellence.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed mb-8">
                  Through our five integrated sectors, we nurture students who are spiritually grounded, 
                  intellectually curious, morally upright, and socially conscious. Our graduates become 
                  leaders who contribute meaningfully to both their communities and the global Ummah.
                </p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-emerald-600 mb-2">15+</div>
                    <div className="text-sm text-slate-600">Years of Excellence</div>
                  </div>
                  <div className="text-center p-4 bg-slate-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">50+</div>
                    <div className="text-sm text-slate-600">Expert Instructors</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white p-6 rounded-xl">
                  <h4 className="text-xl font-bold mb-3">Our Core Values</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <Star className="w-5 h-5 mr-3 text-emerald-200" />
                      <span>Excellence in Islamic Education</span>
                    </li>
                    <li className="flex items-center">
                      <Star className="w-5 h-5 mr-3 text-emerald-200" />
                      <span>Character Development & Spiritual Growth</span>
                    </li>
                    <li className="flex items-center">
                      <Star className="w-5 h-5 mr-3 text-emerald-200" />
                      <span>Community Service & Social Responsibility</span>
                    </li>
                    <li className="flex items-center">
                      <Star className="w-5 h-5 mr-3 text-emerald-200" />
                      <span>Innovation in Learning Methodologies</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
                  <h4 className="text-lg font-bold text-slate-800 mb-3">What Makes Us Different?</h4>
                  <p className="text-slate-600 leading-relaxed">
                    We combine traditional Islamic scholarship with modern pedagogical approaches, 
                    creating an environment where students can thrive academically while growing 
                    spiritually. Our holistic approach ensures graduates are prepared for leadership 
                    in both religious and secular contexts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Five Sectors */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-slate-800 mb-6">
              Our Five Educational Sectors
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Each sector represents a pillar of comprehensive Islamic education, designed to nurture 
              well-rounded individuals who excel in both religious knowledge and worldly pursuits
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {sectors.map((sector) => {
              const Icon = sector.icon;
              return (
                <div 
                  key={sector.id} 
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-200"
                >
                  <div className={`h-2 bg-gradient-to-r ${colorMap[sector.color]}`}></div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${colorMap[sector.color]} text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800">
                          {sector.title}
                        </h3>
                        <p className="text-sm text-emerald-600 font-semibold">
                          {sector.subtitle}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-slate-600 leading-relaxed">
                      {sector.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/50 to-blue-600/50"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <p className="text-2xl font-arabic mb-3 text-emerald-200">
                وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا
              </p>
              <p className="text-lg text-emerald-200 italic">
                "And whoever fears Allah, He will make for him a way out" - Quran 65:2
              </p>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
              Begin Your Journey of Excellence
            </h2>
            <p className="text-xl mb-8 text-emerald-100 leading-relaxed max-w-3xl mx-auto">
              Join thousands of students who have transformed their lives through our comprehensive 
              Islamic education platform. Start your path towards spiritual growth, academic excellence, 
              and meaningful contribution to the Ummah.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link 
                href="/auth/login" 
                className="px-10 py-4 bg-white text-emerald-700 font-bold rounded-xl hover:bg-emerald-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center justify-center gap-3"
              >
                <GraduationCap className="w-6 h-6" />
                Start Learning Today
              </Link>
              <Link 
                href="/sectors" 
                className="px-10 py-4 bg-emerald-700/50 hover:bg-emerald-700/70 text-white font-bold rounded-xl transition-all duration-300 backdrop-blur-sm border-2 border-white/30 hover:border-white/50 flex items-center justify-center gap-3"
              >
                <BookOpen className="w-6 h-6" />
                Explore Our Sectors
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Calendar className="w-8 h-8 mx-auto mb-3 text-emerald-300" />
                <h4 className="font-bold mb-2">Flexible Schedule</h4>
                <p className="text-sm text-emerald-100">Learn at your own pace with our adaptive learning system</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Users className="w-8 h-8 mx-auto mb-3 text-emerald-300" />
                <h4 className="font-bold mb-2">Expert Mentorship</h4>
                <p className="text-sm text-emerald-100">Get guidance from qualified Islamic scholars and educators</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <Award className="w-8 h-8 mx-auto mb-3 text-emerald-300" />
                <h4 className="font-bold mb-2">Recognized Certification</h4>
                <p className="text-sm text-emerald-100">Earn certificates valued by Islamic institutions worldwide</p>
              </div>
            </div>
            
            <div className="mt-12 text-emerald-200 text-lg">
              <p className="font-arabic mb-2">بارك الله فيكم وجزاكم الله خيراً</p>
              <p className="text-sm">May Allah bless you and reward you with goodness</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
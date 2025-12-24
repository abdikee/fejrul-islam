'use client';

import { useState } from 'react';
import { MessageCircle, Lightbulb, BookOpen, Users, ArrowRight, Calendar, User, Eye, ExternalLink } from 'lucide-react';
import { books } from '@/data/books';
import Link from 'next/link';

const subsections = [
  {
    title: 'Comparative Religion',
    icon: BookOpen,
    color: 'blue',
    items: ['Interfaith Dialogue', 'Ahl al-Kitab Studies', 'World Religions Overview']
  },
  {
    title: 'Modern Ideologies',
    icon: Lightbulb,
    color: 'purple',
    items: ['Atheism & Agnosticism', 'Nihilism', 'Materialism & Secularism']
  },
  {
    title: 'Revert Journey',
    icon: Users,
    color: 'emerald',
    items: ['Mentorship Programs', 'Integration Support', 'Basic Fiqh for Reverts']
  },
  {
    title: 'Debate & Dialogue',
    icon: MessageCircle,
    color: 'amber',
    items: ['Topic Registration', 'Logic & Burhan', 'Hikmah-based Discourse']
  }
];

const upcomingTopics = [
  {
    id: 1,
    title: 'Islam and Modern Atheism',
    date: 'January 25, 2025',
    time: '7:00 PM EST',
    description: 'Exploring responses to contemporary atheistic arguments',
    speaker: 'Dr. Ahmad Hassan',
    status: 'upcoming',
    registrations: 45
  },
  {
    id: 2,
    title: 'Science and Faith: A Muslim Perspective',
    date: 'February 8, 2025',
    time: '6:30 PM EST',
    description: 'Understanding the compatibility of Islamic belief and scientific inquiry',
    speaker: 'Prof. Fatima Al-Zahra',
    status: 'upcoming',
    registrations: 32
  },
  {
    id: 3,
    title: 'Interfaith Panel: Abrahamic Traditions',
    date: 'February 22, 2025',
    time: '8:00 PM EST',
    description: 'Dialogue with Christian and Jewish scholars on shared values',
    speaker: 'Panel Discussion',
    status: 'upcoming',
    registrations: 67
  }
];

const debateTopics = [
  {
    id: 1,
    title: 'Does God Exist? A Rational Examination',
    category: 'Philosophy',
    difficulty: 'Advanced',
    participants: 12,
    status: 'open'
  },
  {
    id: 2,
    title: 'Christianity vs Islam: Salvation Concepts',
    category: 'Comparative Religion',
    difficulty: 'Intermediate',
    participants: 8,
    status: 'open'
  },
  {
    id: 3,
    title: 'Secular Ethics vs Islamic Morality',
    category: 'Ethics',
    difficulty: 'Beginner',
    participants: 15,
    status: 'full'
  }
];

const resources = [
  {
    id: 1,
    title: 'Dawah Training Manual',
    type: 'PDF Guide',
    category: 'Training',
    downloads: 234,
    size: '2.4 MB'
  },
  {
    id: 2,
    title: 'Common Questions About Islam',
    type: 'FAQ Collection',
    category: 'Reference',
    downloads: 189,
    size: '1.8 MB'
  },
  {
    id: 3,
    title: 'Interfaith Dialogue Guidelines',
    type: 'Best Practices',
    category: 'Guidelines',
    downloads: 156,
    size: '1.2 MB'
  }
];

const colorClasses = {
  blue: 'bg-blue-100 text-blue-700 border-blue-300',
  purple: 'bg-purple-100 text-purple-700 border-purple-300',
  emerald: 'bg-emerald-100 text-emerald-700 border-emerald-300',
  amber: 'bg-amber-100 text-amber-700 border-amber-300'
};

export default function ComparativeReligionPage() {
  const [activeSection, setActiveSection] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDebate, setSelectedDebate] = useState(null);

  const handleSectionClick = (sectionId) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const renderSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'comparative':
        return (
          <div className="mt-6 p-6 bg-white rounded-lg border border-blue-200">
            <h4 className="text-xl font-bold text-blue-800 mb-4">Comparative Religion Studies</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-2">Christianity & Islam</h5>
                <p className="text-sm text-slate-600">Exploring theological similarities and differences</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-2">Judaism & Islam</h5>
                <p className="text-sm text-slate-600">Shared Abrahamic heritage and practices</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-2">Eastern Religions</h5>
                <p className="text-sm text-slate-600">Buddhism, Hinduism, and Islamic perspectives</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h5 className="font-semibold text-blue-900 mb-2">Modern Movements</h5>
                <p className="text-sm text-slate-600">New religious movements and Islamic response</p>
              </div>
            </div>
          </div>
        );
      
      case 'ideologies':
        return (
          <div className="mt-6 p-6 bg-white rounded-lg border border-purple-200">
            <h4 className="text-xl font-bold text-purple-800 mb-4">Modern Ideological Challenges</h4>
            <div className="space-y-4">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-900 mb-2">Atheism & Agnosticism</h5>
                <p className="text-sm text-slate-600 mb-2">Addressing arguments against theism with rational proofs</p>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 bg-purple-200 text-purple-800 rounded">Cosmological Argument</span>
                  <span className="text-xs px-2 py-1 bg-purple-200 text-purple-800 rounded">Design Argument</span>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-900 mb-2">Materialism & Secularism</h5>
                <p className="text-sm text-slate-600 mb-2">Islamic worldview vs materialistic philosophy</p>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 bg-purple-200 text-purple-800 rounded">Spiritual Dimension</span>
                  <span className="text-xs px-2 py-1 bg-purple-200 text-purple-800 rounded">Moral Framework</span>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'revert':
        return (
          <div className="mt-6 p-6 bg-white rounded-lg border border-emerald-200">
            <h4 className="text-xl font-bold text-emerald-800 mb-4">Revert Support Programs</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-emerald-50 rounded-lg">
                <h5 className="font-semibold text-emerald-900 mb-2">New Muslim Mentorship</h5>
                <p className="text-sm text-slate-600">One-on-one guidance for new converts</p>
                <button className="mt-2 text-xs px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700">
                  Request Mentor
                </button>
              </div>
              <div className="p-4 bg-emerald-50 rounded-lg">
                <h5 className="font-semibold text-emerald-900 mb-2">Basic Fiqh Classes</h5>
                <p className="text-sm text-slate-600">Essential Islamic practices and rulings</p>
                <button className="mt-2 text-xs px-3 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700">
                  Join Classes
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'debate':
        return (
          <div className="mt-6 p-6 bg-white rounded-lg border border-amber-200">
            <h4 className="text-xl font-bold text-amber-800 mb-4">Active Debate Topics</h4>
            <div className="space-y-3">
              {debateTopics.map((debate) => (
                <div key={debate.id} className="p-4 bg-amber-50 rounded-lg border border-amber-200 hover:border-amber-300 cursor-pointer transition-colors"
                     onClick={() => setSelectedDebate(debate)}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h5 className="font-semibold text-slate-800">{debate.title}</h5>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-1 bg-amber-200 text-amber-800 rounded">{debate.category}</span>
                        <span className="text-xs px-2 py-1 bg-slate-200 text-slate-700 rounded">{debate.difficulty}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-slate-600">{debate.participants} participants</p>
                      <span className={`text-xs px-2 py-1 rounded ${
                        debate.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {debate.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxib29rc3xlbnwwfHx8fDE3NjYwNTEwMjd8MA&ixlib=rb-4.1.0&q=85"
            alt="Dawah and Dialogue" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl font-serif font-bold mb-4">Dawah & Comparative Religion</h1>
          <p className="text-2xl font-light">Outreach, Logic, Intellectual Defense</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <span className="text-blue-600 font-semibold">Dawah & Comparative Religion</span>
          </div>
        </div>
      </div>

      {/* Overview */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-serif font-bold text-slate-800 mb-6">Engaging the World with Wisdom</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              The Dawah & Comparative Religion sector equips students with the knowledge and skills to 
              engage in meaningful dialogue, defend Islamic principles with wisdom and logic, and support 
              those entering or exploring Islam. We emphasize respectful discourse, intellectual rigor, 
              and the prophetic example of hikmah (wisdom) in all interactions.
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Subsections */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">Areas of Focus</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {subsections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
              const sectionId = section.title.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '').replace('comparative-religion', 'comparative').replace('modern-ideologies', 'ideologies').replace('revert-journey', 'revert').replace('debate--dialogue', 'debate');
              
              return (
                <div key={section.title} className="space-y-4">
                  <button
                    onClick={() => handleSectionClick(sectionId)}
                    className={`w-full rounded-xl p-6 border-2 ${colorClasses[section.color]} hover:shadow-lg transition-all text-left`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Icon className="w-8 h-8" />
                        <h3 className="text-2xl font-bold">{section.title}</h3>
                      </div>
                      <ArrowRight className={`w-5 h-5 transition-transform ${isActive ? 'rotate-90' : ''}`} />
                    </div>
                    <ul className="space-y-2">
                      {section.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="w-1.5 h-1.5 bg-current rounded-full mt-2"></span>
                          <span className="text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </button>
                  
                  {isActive && renderSectionContent(sectionId)}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Upcoming Events */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-10">Upcoming Discussions</h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            {upcomingTopics.map((topic) => (
              <div 
                key={topic.id}
                className="bg-blue-50 rounded-lg p-6 border border-blue-200 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedEvent(topic)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">{topic.title}</h3>
                    <p className="text-slate-600 mb-3">{topic.description}</p>
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {topic.date} at {topic.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {topic.speaker}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {topic.registrations} registered
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-3 py-1 rounded-full whitespace-nowrap">
                      {topic.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Digital Library */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-serif font-bold text-center text-slate-800 mb-4">Digital Library & Resources</h2>
          <p className="text-center text-slate-600 mb-10">Essential materials for dawah and comparative religion studies</p>
          
          {/* Resource Downloads */}
          <div className="max-w-4xl mx-auto mb-12">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Training Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resources.map((resource) => (
                <div key={resource.id} className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-slate-800">{resource.title}</h4>
                    <ExternalLink className="w-4 h-4 text-slate-400" />
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{resource.type}</p>
                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>{resource.downloads} downloads</span>
                    <span>{resource.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Book Library */}
          <div className="max-w-5xl mx-auto">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Recommended Books</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {books.slice(0, 6).map((book) => (
                <div 
                  key={book.id}
                  className="bg-white rounded-lg shadow-md border border-slate-200 p-5 hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {book.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-800 mt-3 mb-2">{book.title}</h3>
                  <p className="text-sm text-slate-600 mb-2">by {book.author}</p>
                  <p className="text-sm text-slate-500">{book.description}</p>
                  <button className="mt-3 text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                    Read More
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedEvent.title}</h2>
                  <div className="flex items-center gap-4 mt-2 text-slate-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {selectedEvent.date} at {selectedEvent.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {selectedEvent.speaker}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-slate-400 hover:text-slate-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  {selectedEvent.description}
                </p>
                <p className="text-slate-700 leading-relaxed">
                  This session will provide comprehensive coverage of the topic with interactive Q&A, 
                  practical examples, and resources for further study. All participants will receive 
                  supplementary materials and access to recorded sessions.
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>{selectedEvent.registrations} registered</span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                    {selectedEvent.status}
                  </span>
                </div>
                <button 
                  onClick={() => alert('Registration functionality coming soon!')}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Debate Detail Modal */}
      {selectedDebate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{selectedDebate.title}</h2>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-amber-100 text-amber-800 text-sm rounded">{selectedDebate.category}</span>
                    <span className="px-2 py-1 bg-slate-100 text-slate-700 text-sm rounded">{selectedDebate.difficulty}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDebate(null)}
                  className="text-slate-400 hover:text-slate-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="prose max-w-none">
                <p className="text-slate-700 leading-relaxed mb-4">
                  Join this structured debate to explore different perspectives and strengthen your argumentation skills. 
                  This is a {selectedDebate.difficulty.toLowerCase()}-level discussion suitable for participants with 
                  appropriate background knowledge.
                </p>
                
                <div className="bg-slate-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-slate-800 mb-2">Debate Guidelines:</h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Respectful discourse required at all times</li>
                    <li>• Evidence-based arguments preferred</li>
                    <li>• Time limits will be enforced for fairness</li>
                    <li>• Moderated by experienced facilitators</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-slate-600">
                  <span>{selectedDebate.participants} participants</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    selectedDebate.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedDebate.status}
                  </span>
                </div>
                <button 
                  onClick={() => alert(selectedDebate.status === 'open' ? 'Join debate functionality coming soon!' : 'This debate is currently full.')}
                  disabled={selectedDebate.status !== 'open'}
                  className={`px-6 py-2 rounded-lg transition-colors ${
                    selectedDebate.status === 'open' 
                      ? 'bg-amber-600 text-white hover:bg-amber-700' 
                      : 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {selectedDebate.status === 'open' ? 'Join Debate' : 'Full'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-12 bg-blue-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Join the Conversation</h2>
          <p className="text-xl mb-6 text-blue-100">Register for upcoming debates and dialogue sessions</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button 
              onClick={() => alert('Registration system coming soon!')}
              className="px-8 py-3 bg-white text-blue-700 font-bold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Register for Events
            </button>
            <button 
              onClick={() => alert('Debate registration coming soon!')}
              className="px-8 py-3 bg-blue-800 text-white font-bold rounded-lg hover:bg-blue-900 transition-colors border-2 border-white"
            >
              Join Debates
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
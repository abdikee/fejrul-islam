'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, Play, Download, Clock, Users, Star, Filter, Search } from 'lucide-react';

const knowledgeSeries = [
  {
    id: 1,
    title: 'Foundations of Islamic Faith',
    description: 'A comprehensive series covering the fundamental beliefs and practices of Islam',
    instructor: 'Sheikh Nuru',
    category: 'Aqeedah',
    level: 'Beginner',
    episodes: 12,
    duration: '45 min each',
    rating: 4.9,
    thumbnail: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400',
    topics: ['Tawhid', 'Prophethood', 'Day of Judgment', 'Divine Decree'],
    language: 'Afaan Oromo',
    status: 'Complete'
  },
  {
    id: 2,
    title: 'Quranic Tafsir Series',
    description: 'Deep dive into selected chapters of the Quran with contextual explanations',
    instructor: 'Sheikh Nuru',
    category: 'Tafsir',
    level: 'Intermediate',
    episodes: 24,
    duration: '60 min each',
    rating: 4.8,
    thumbnail: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?w=400',
    topics: ['Surah Al-Fatiha', 'Surah Al-Baqarah', 'Surah Al-Imran', 'Surah An-Nisa'],
    language: 'Amharic',
    status: 'Ongoing'
  },
  {
    id: 3,
    title: 'Prophetic Traditions (Hadith)',
    description: 'Study of authentic Hadith collections and their practical applications',
    instructor: 'Imam Abdullah',
    category: 'Hadith',
    level: 'Intermediate',
    episodes: 18,
    duration: '50 min each',
    rating: 4.7,
    thumbnail: 'https://images.unsplash.com/photo-1585036156171-384164a8c675?w=400',
    topics: ['Sahih Bukhari', 'Sahih Muslim', 'Hadith Sciences', 'Practical Applications'],
    language: 'Arabic/Amharic',
    status: 'Complete'
  },
  {
    id: 4,
    title: 'Islamic History & Civilization',
    description: 'Journey through Islamic history from the Prophet to modern times',
    instructor: 'Dr. Fatima Hassan',
    category: 'History',
    level: 'Beginner',
    episodes: 15,
    duration: '55 min each',
    rating: 4.6,
    thumbnail: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?w=400',
    topics: ['Prophetic Era', 'Rightly Guided Caliphs', 'Islamic Golden Age', 'Modern Challenges'],
    language: 'English',
    status: 'Complete'
  },
  {
    id: 5,
    title: 'Fiqh (Islamic Jurisprudence)',
    description: 'Practical Islamic law covering worship, transactions, and daily life',
    instructor: 'Sheikh Ahmad',
    category: 'Fiqh',
    level: 'Advanced',
    episodes: 20,
    duration: '70 min each',
    rating: 4.8,
    thumbnail: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=400',
    topics: ['Purification', 'Prayer', 'Zakat', 'Hajj', 'Marriage', 'Business Ethics'],
    language: 'Arabic/Afaan Oromo',
    status: 'Ongoing'
  },
  {
    id: 6,
    title: 'Spiritual Development (Tasawwuf)',
    description: 'Inner dimensions of Islam focusing on spiritual purification and growth',
    instructor: 'Sheikh Yusuf',
    category: 'Spirituality',
    level: 'Intermediate',
    episodes: 10,
    duration: '40 min each',
    rating: 4.9,
    thumbnail: 'https://images.unsplash.com/photo-1519817914152-22d216bb9170?w=400',
    topics: ['Dhikr', 'Meditation', 'Self-Purification', 'Spiritual Stations'],
    language: 'Afaan Oromo',
    status: 'Complete'
  },
  {
    id: 7,
    title: 'Contemporary Islamic Issues',
    description: 'Addressing modern challenges facing Muslims in the 21st century',
    instructor: 'Sheikh Nuru',
    category: 'Contemporary',
    level: 'Advanced',
    episodes: 16,
    duration: '65 min each',
    rating: 4.7,
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
    topics: ['Technology & Islam', 'Social Media Ethics', 'Modern Finance', 'Interfaith Relations'],
    language: 'Amharic/English',
    status: 'Ongoing'
  }
];

const categories = ['All', 'Aqeedah', 'Tafsir', 'Hadith', 'Fiqh', 'History', 'Spirituality', 'Contemporary'];
const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const languages = ['All', 'Afaan Oromo', 'Amharic', 'Arabic/Amharic', 'Arabic/Afaan Oromo', 'English'];

export default function KnowledgeSeriesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeries, setSelectedSeries] = useState(null);

  const filteredSeries = knowledgeSeries.filter(series => {
    const matchesCategory = selectedCategory === 'All' || series.category === selectedCategory;
    const matchesLevel = selectedLevel === 'All' || series.level === selectedLevel;
    const matchesLanguage = selectedLanguage === 'All' || series.language === selectedLanguage;
    const matchesSearch = series.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         series.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         series.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesLevel && matchesLanguage && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwxfHxrbm93bGVkZ2V8ZW58MHx8fHwxNzY2MDUxMDI3fDA&ixlib=rb-4.1.0&q=85"
            alt="Knowledge Series" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-900/70"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center text-white">
          <h1 className="text-5xl font-serif font-bold mb-4">Knowledge Series</h1>
          <p className="text-2xl font-light">Comprehensive Islamic Education Programs</p>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="bg-white py-4 border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/" className="hover:text-emerald-600">Home</Link>
            <span>/</span>
            <span className="text-emerald-600 font-semibold">Knowledge Series</span>
          </div>
        </div>
      </div>

      {/* Filter Section */}
      <section className="py-6 bg-white border-b border-slate-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-800">Educational Series</h2>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Search className="w-5 h-5 text-slate-600" />
                <input
                  type="text"
                  placeholder="Search series..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-600" />
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <select 
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                >
                  {languages.map(language => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Series Grid */}
      <section className="py-12 bg-slate-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSeries.map((series) => (
              <div 
                key={series.id}
                className="bg-white rounded-xl shadow-md border border-slate-200 hover:shadow-lg transition-shadow overflow-hidden"
              >
                <div className="relative">
                  <img 
                    src={series.thumbnail} 
                    alt={series.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-full">
                      {series.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                      series.status === 'Complete' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {series.status}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{series.title}</h3>
                  <p className="text-slate-600 mb-4 text-sm">{series.description}</p>
                  
                  <div className="space-y-2 text-sm text-slate-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {series.instructor}
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {series.episodes} episodes
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {series.duration}
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {series.rating}/5.0
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-slate-700 mb-2">Topics Covered:</p>
                    <div className="flex flex-wrap gap-1">
                      {series.topics.slice(0, 3).map((topic, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                          {topic}
                        </span>
                      ))}
                      {series.topics.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-full">
                          +{series.topics.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{series.language}</span>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setSelectedSeries(series)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-semibold flex items-center gap-1"
                      >
                        <Play className="w-4 h-4" />
                        Watch
                      </button>
                      <button className="px-3 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {filteredSeries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-500 text-lg">No series found matching your criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Series Detail Modal */}
      {selectedSeries && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-slate-800">{selectedSeries.title}</h2>
                  <p className="text-slate-600 mt-2">{selectedSeries.description}</p>
                </div>
                <button
                  onClick={() => setSelectedSeries(null)}
                  className="text-slate-400 hover:text-slate-600 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={selectedSeries.thumbnail} 
                    alt={selectedSeries.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-800 mb-2">Series Details:</h3>
                    <div className="space-y-2 text-sm text-slate-600">
                      <p><strong>Instructor:</strong> {selectedSeries.instructor}</p>
                      <p><strong>Category:</strong> {selectedSeries.category}</p>
                      <p><strong>Level:</strong> {selectedSeries.level}</p>
                      <p><strong>Episodes:</strong> {selectedSeries.episodes}</p>
                      <p><strong>Duration:</strong> {selectedSeries.duration}</p>
                      <p><strong>Language:</strong> {selectedSeries.language}</p>
                      <p><strong>Status:</strong> {selectedSeries.status}</p>
                      <p><strong>Rating:</strong> {selectedSeries.rating}/5.0</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">Topics Covered:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedSeries.topics.map((topic, idx) => (
                        <span key={idx} className="text-xs px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-200 text-center">
                <button 
                  onClick={() => alert('Video player coming soon!')}
                  className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold mr-4"
                >
                  Start Watching
                </button>
                <button 
                  onClick={() => alert('Download feature coming soon!')}
                  className="px-8 py-3 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors font-semibold"
                >
                  Download Series
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <section className="py-12 bg-emerald-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">Expand Your Islamic Knowledge</h2>
          <p className="text-xl mb-6 text-emerald-100">Join thousands of students learning from our comprehensive series</p>
          <Link 
            href="/auth/login" 
            className="inline-block px-8 py-3 bg-white text-emerald-700 font-bold rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Start Learning Today
          </Link>
        </div>
      </section>
    </div>
  );
}
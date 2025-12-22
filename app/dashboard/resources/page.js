'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Download, FileText, Video, Image, Music, Archive, ArrowLeft, Search, 
  Filter, Grid, List, Star, Eye, Clock, BookOpen, Play, Heart
} from 'lucide-react';
import StudentFooter from '@/components/dashboard/StudentFooter';

export default function StudentResources() {
  const [user, setUser] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const authResponse = await fetch('/api/auth/me');
        const authData = await authResponse.json();
        
        if (authData.success) {
          setUser(authData.user);
        }

        // Mock resources data
        const mockResources = [
          {
            id: 1,
            title: 'Complete Quran Recitation Guide',
            description: 'Comprehensive guide for proper Quranic recitation with Tajweed rules',
            resource_type: 'PDF',
            file_size: '15.2 MB',
            download_count: 1247,
            sector_name: 'Qirat & Ilm',
            sector_color: 'teal',
            created_at: '2024-12-20',
            rating: 4.8,
            is_favorite: true
          },
          {
            id: 2,
            title: 'Islamic Finance Principles Video Series',
            description: 'Complete video course on Islamic banking and finance principles',
            resource_type: 'Video',
            file_size: '2.1 GB',
            download_count: 892,
            sector_name: 'Tarbiya & Idad',
            sector_color: 'blue',
            created_at: '2024-12-18',
            rating: 4.9,
            is_favorite: false
          },
          {
            id: 3,
            title: 'Arabic Grammar Workbook',
            description: 'Interactive workbook for learning Arabic grammar fundamentals',
            resource_type: 'PDF',
            file_size: '8.7 MB',
            download_count: 654,
            sector_name: 'Literature',
            sector_color: 'green',
            created_at: '2024-12-15',
            rating: 4.6,
            is_favorite: false
          },
          {
            id: 4,
            title: 'Comparative Religion Study Materials',
            description: 'Comprehensive materials for understanding different religious perspectives',
            resource_type: 'Archive',
            file_size: '45.3 MB',
            download_count: 423,
            sector_name: 'Comparative Religion',
            sector_color: 'purple',
            created_at: '2024-12-12',
            rating: 4.7,
            is_favorite: true
          },
          {
            id: 5,
            title: 'Islamic History Timeline',
            description: 'Visual timeline of major events in Islamic history',
            resource_type: 'Image',
            file_size: '3.2 MB',
            download_count: 789,
            sector_name: 'Literature',
            sector_color: 'green',
            created_at: '2024-12-10',
            rating: 4.5,
            is_favorite: false
          },
          {
            id: 6,
            title: 'Nasheed Collection',
            description: 'Beautiful Islamic nasheeds for spiritual inspiration',
            resource_type: 'Audio',
            file_size: '156 MB',
            download_count: 1156,
            sector_name: 'Ziyara',
            sector_color: 'orange',
            created_at: '2024-12-08',
            rating: 4.9,
            is_favorite: true
          }
        ];
        
        setResources(mockResources);
      } catch (error) {
        console.error('Error fetching resources:', error);
        setUser({ firstName: 'Ahmad', gender: 'male' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDownload = async (resourceId) => {
    try {
      await fetch('/api/dashboard/student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'download_resource', resourceId })
      });
      
      // Update download count locally
      setResources(prev => prev.map(resource => 
        resource.id === resourceId 
          ? { ...resource, download_count: resource.download_count + 1 }
          : resource
      ));
    } catch (error) {
      console.error('Error tracking download:', error);
    }
  };

  const toggleFavorite = (resourceId) => {
    setResources(prev => prev.map(resource => 
      resource.id === resourceId 
        ? { ...resource, is_favorite: !resource.is_favorite }
        : resource
    ));
  };

  const getResourceIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf': return FileText;
      case 'video': return Video;
      case 'image': return Image;
      case 'audio': return Music;
      case 'archive': return Archive;
      default: return FileText;
    }
  };

  const filteredResources = resources
    .filter(resource => 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filter === 'all' || resource.resource_type.toLowerCase() === filter.toLowerCase() || 
       resource.sector_name.toLowerCase().includes(filter.toLowerCase()))
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.created_at) - new Date(a.created_at);
        case 'oldest': return new Date(a.created_at) - new Date(b.created_at);
        case 'popular': return b.download_count - a.download_count;
        case 'rating': return b.rating - a.rating;
        case 'name': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

  const genderColors = user?.gender === 'female' ? {
    primary: 'teal',
    secondary: 'purple',
    bgGradient: 'from-teal-50 to-purple-50'
  } : {
    primary: 'emerald',
    secondary: 'blue',
    bgGradient: 'from-emerald-50 to-blue-50'
  };

  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${genderColors.bgGradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`w-16 h-16 border-4 border-${genderColors.primary}-600 border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
          <p className="text-slate-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${genderColors.bgGradient}`}>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href={`/dashboard/${user?.gender}`}
                className={`p-2 hover:bg-${genderColors.primary}-100 rounded-lg transition-colors`}
              >
                <ArrowLeft className={`w-5 h-5 text-${genderColors.primary}-600`} />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Learning Resources</h1>
                <p className="text-sm text-slate-600">Access Islamic educational materials</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' 
                      ? `bg-${genderColors.primary}-600 text-white` 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' 
                      ? `bg-${genderColors.primary}-600 text-white` 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 lg:px-6 py-6">
        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-600" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="all">All Types</option>
                  <option value="pdf">PDF Documents</option>
                  <option value="video">Videos</option>
                  <option value="audio">Audio</option>
                  <option value="image">Images</option>
                  <option value="archive">Archives</option>
                </select>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Downloaded</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid/List */}
        <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'} gap-6`}>
          {filteredResources.map((resource) => {
            const Icon = getResourceIcon(resource.resource_type);
            
            if (viewMode === 'list') {
              return (
                <div key={resource.id} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 bg-${resource.sector_color}-100 rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 text-${resource.sector_color}-600`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800 mb-1">{resource.title}</h3>
                          <p className="text-slate-600 mb-2">{resource.description}</p>
                        </div>
                        <button
                          onClick={() => toggleFavorite(resource.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            resource.is_favorite 
                              ? 'text-red-500 hover:bg-red-50' 
                              : 'text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          <Heart className={`w-5 h-5 ${resource.is_favorite ? 'fill-current' : ''}`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                        <div className={`px-2 py-1 bg-${resource.sector_color}-100 text-${resource.sector_color}-700 rounded-full text-xs font-medium`}>
                          {resource.sector_name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Archive className="w-4 h-4" />
                          {resource.file_size}
                        </div>
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {resource.download_count.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          {resource.rating}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDownload(resource.id)}
                          className={`flex items-center gap-2 px-4 py-2 bg-${genderColors.primary}-600 text-white rounded-xl font-semibold hover:bg-${genderColors.primary}-700 transition-colors`}
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                        <button className={`flex items-center gap-2 px-4 py-2 border border-${genderColors.primary}-300 text-${genderColors.primary}-600 rounded-xl font-semibold hover:bg-${genderColors.primary}-50 transition-colors`}>
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div key={resource.id} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all group">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 bg-${resource.sector_color}-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 text-${resource.sector_color}-600`} />
                  </div>
                  <button
                    onClick={() => toggleFavorite(resource.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      resource.is_favorite 
                        ? 'text-red-500 hover:bg-red-50' 
                        : 'text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${resource.is_favorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className={`px-3 py-1 bg-${resource.sector_color}-100 text-${resource.sector_color}-700 rounded-full text-sm font-medium mb-3 inline-block`}>
                  {resource.sector_name}
                </div>
                
                <h3 className="text-lg font-bold text-slate-800 mb-2">{resource.title}</h3>
                <p className="text-slate-600 mb-4 line-clamp-2">{resource.description}</p>
                
                <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Archive className="w-4 h-4" />
                    <span>{resource.file_size}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    <span>{resource.download_count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{resource.rating}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleDownload(resource.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-${genderColors.primary}-600 text-white rounded-xl font-semibold hover:bg-${genderColors.primary}-700 transition-colors`}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button className={`px-4 py-3 border border-${genderColors.primary}-300 text-${genderColors.primary}-600 rounded-xl hover:bg-${genderColors.primary}-50 transition-colors`}>
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredResources.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-slate-200">
            <BookOpen className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No Resources Found</h3>
            <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
          </div>
        )}
      </div>

      <StudentFooter user={user} />
    </div>
  );
}
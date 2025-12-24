'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Calendar, User, Tag, ArrowRight, Search, Filter, 
  BookOpen, Clock, Eye, Heart, Share2, MessageSquare 
} from 'lucide-react';

export default function ArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadArticles();
  }, [selectedSector, sortBy]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        sector: selectedSector,
        sort: sortBy,
        search: searchTerm
      });
      
      const response = await fetch(`/api/articles?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setArticles(data.articles);
      }
    } catch (error) {
      console.error('Error loading articles:', error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadArticles();
  };

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sectors = [
    { id: 'all', name: 'All Sectors' },
    { id: 'qirat-ilm', name: 'Qirat & Ilm' },
    { id: 'literature-history', name: 'Literature & History' },
    { id: 'dawah-comparative-religion', name: 'Dawah & Comparative Religion' },
    { id: 'tarbiya-idad', name: 'Tarbiya & Idad' },
    { id: 'ziyara', name: 'Ziyara' }
  ];

  return (
    <div className="min-h-screen bg-gradient-light bg-gradient-dark">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 islamic-gradient-dark text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="w-16 h-16">
                <img
                  src="/logo.svg"
                  alt="Fejrul Islam Logo"
                  className="w-full h-full object-contain logo-image"
                />
              </div>
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold">Islamic Articles</h1>
                <p className="text-xl text-emerald-100 dark:text-emerald-200">Knowledge & Guidance from Fejrul Islam</p>
              </div>
            </div>
            <p className="text-xl text-emerald-100 dark:text-emerald-200 leading-relaxed">
              Explore our collection of Islamic articles, insights, and guidance materials 
              written by our scholars and educators to strengthen your faith and knowledge.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        {/* Search and Filters */}
        <div className="card-light card-dark rounded-2xl p-8 mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-primary w-full pl-12 pr-4 py-3 rounded-xl"
                />
              </form>
            </div>

            {/* Sector Filter */}
            <div>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="input-primary w-full px-4 py-3 rounded-xl"
              >
                {sectors.map(sector => (
                  <option key={sector.id} value={sector.id}>{sector.name}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-primary w-full px-4 py-3 rounded-xl"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            <p className="text-secondary-light text-secondary-dark mt-4">Loading articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-secondary-light text-secondary-dark mb-2">No Articles Found</h3>
            <p className="text-secondary-light text-secondary-dark">
              {searchTerm ? 'Try adjusting your search terms or filters.' : 'No articles have been published yet.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredArticles.length > 0 && (
          <div className="text-center mt-12">
            <button className="inline-flex items-center gap-2 px-8 py-4 btn-primary rounded-xl font-semibold transition-colors shadow-lg hover:shadow-xl">
              Load More Articles
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ArticleCard({ article }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadingTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <article className="card-light card-dark rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Article Image */}
        {article.image && (
          <div className="aspect-video overflow-hidden">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="p-6">
          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-secondary-light text-secondary-dark mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{getReadingTime(article.content)} min read</span>
            </div>
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-primary-light text-primary-dark mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
            {article.title}
          </h2>

          {/* Description */}
          <p className="text-secondary-light text-secondary-dark mb-4 line-clamp-3">
            {article.description}
          </p>

          {/* Tags */}
          {article.sector && (
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
                {article.sector}
              </span>
            </div>
          )}

          {/* Author and Stats */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span className="text-sm text-secondary-light text-secondary-dark">{article.author || 'Fejrul Islam'}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{article.views || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{article.likes || 0}</span>
              </div>
            </div>
          </div>

          {/* Read More */}
          <div className="mt-4">
            <span className="inline-flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold group-hover:gap-3 transition-all">
              Read Article
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
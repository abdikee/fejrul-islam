'use client';

import { useState } from 'react';
import { digitalLibrary } from '@/data/library';
import { BookOpen, Download, Search, Filter } from 'lucide-react';

const LibraryGrid = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState('all');

  const categories = ['all', ...new Set(digitalLibrary.map(book => book.category))];
  const languages = ['all', ...new Set(digitalLibrary.map(book => book.language))];

  const filteredBooks = digitalLibrary.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    const matchesLanguage = selectedLanguage === 'all' || book.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesLanguage && book.available;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search books..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Language Filter */}
          <div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>
                  {lang === 'all' ? 'All Languages' : lang}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-600">
          Showing <span className="font-bold text-blue-600">{filteredBooks.length}</span> of <span className="font-bold">{digitalLibrary.length}</span> books
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
          >
            {/* Book Cover */}
            <div className={`${book.coverColor} h-48 flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40 group-hover:from-black/30 group-hover:to-black/50 transition-all"></div>
              <BookOpen className="w-20 h-20 text-white/90 relative z-10" />
              <div className="absolute bottom-3 left-3 right-3 z-10">
                <span className="inline-block px-3 py-1 bg-white/90 text-slate-800 text-xs font-semibold rounded-full">
                  {book.category}
                </span>
              </div>
            </div>

            {/* Book Details */}
            <div className="p-5">
              <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {book.title}
              </h3>
              <p className="text-sm text-slate-600 mb-3">by {book.author}</p>
              <p className="text-sm text-slate-600 mb-4 line-clamp-2">{book.description}</p>
              
              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <span>{book.pages} pages</span>
                <span>{book.language}</span>
              </div>

              <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 group-hover:scale-105 transform transition-transform">
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-800 mb-2">No books found</h3>
          <p className="text-slate-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default LibraryGrid;

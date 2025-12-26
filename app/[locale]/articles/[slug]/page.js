'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  Calendar, User, Tag, ArrowLeft, Share2, Heart, 
  BookOpen, Clock, Eye, MessageSquare, ChevronRight,
  Facebook, Twitter, Linkedin, Copy, Check, Video, Download, FileText
} from 'lucide-react';

export default function ArticlePage() {
  const params = useParams();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params.slug) {
      loadArticle();
    }
  }, [params.slug]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/articles/${params.slug}`);
      const data = await response.json();
      
      if (data.success) {
        setArticle(data.article);
        setRelatedArticles(data.relatedArticles || []);
      }
    } catch (error) {
      console.error('Error loading article:', error);
    }
    setLoading(false);
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/articles/${params.slug}/like`, {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        setLiked(!liked);
        setArticle(prev => ({
          ...prev,
          likes: liked ? prev.likes - 1 : prev.likes + 1
        }));
      }
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = article?.title || '';
    
    const shareUrls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShareMenuOpen(false);
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-light bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="text-secondary-light text-secondary-dark mt-4">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-light bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="w-16 h-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-secondary-light text-secondary-dark mb-2">Article Not Found</h1>
          <p className="text-secondary-light text-secondary-dark mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-6 py-3 btn-primary rounded-xl font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-light bg-gradient-dark">
      {/* Breadcrumb */}
      <div className="header-light header-dark">
        <div className="container mx-auto px-6 py-4">
          <nav className="flex items-center gap-2 text-sm text-secondary-light text-secondary-dark">
            <Link href="/" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/articles" className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Articles</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-primary-light text-primary-dark font-medium truncate">{article.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-12">
            <div className="flex items-center gap-2 text-sm text-emerald-600 mb-4">
              <Tag className="w-4 h-4" />
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full font-medium">
                {article.sector || 'General'}
              </span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {article.title}
            </h1>

            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              {article.description}
            </p>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5" />
                <span className="font-medium">{article.author || 'Fejrul Islam'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(article.created_at)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{getReadingTime(article.content)} min read</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{article.views || 0} views</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${
                  liked 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                <span>{article.likes || 0}</span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShareMenuOpen(!shareMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>

                {shareMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-lg border border-slate-200 p-2 z-10">
                    <button
                      onClick={() => handleShare('facebook')}
                      className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Facebook className="w-5 h-5 text-blue-600" />
                      Facebook
                    </button>
                    <button
                      onClick={() => handleShare('twitter')}
                      className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Twitter className="w-5 h-5 text-blue-400" />
                      Twitter
                    </button>
                    <button
                      onClick={() => handleShare('linkedin')}
                      className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Linkedin className="w-5 h-5 text-blue-700" />
                      LinkedIn
                    </button>
                    <button
                      onClick={() => handleShare('copy')}
                      className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5 text-slate-600" />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Article Image */}
          {article.image_url && (
            <div className="mb-12">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-96 object-cover rounded-2xl shadow-lg"
              />
            </div>
          )}

          {/* Video & Attachment */}
          {(article.video_url || article.attachment_url) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {article.video_url && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Video className="w-5 h-5 text-red-600" />
                    Video Content
                  </h3>
                  <div className="aspect-video rounded-xl overflow-hidden bg-slate-100">
                    <iframe 
                      src={article.video_url.replace('watch?v=', 'embed/')} 
                      className="w-full h-full" 
                      allowFullScreen
                      title="Article Video"
                    />
                  </div>
                </div>
              )}
              
              {article.attachment_url && (
                <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5 text-blue-600" />
                    Downloadable Resource
                  </h3>
                  <div className="flex flex-col items-center justify-center h-48 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                    <FileText className="w-12 h-12 text-slate-400 mb-4" />
                    <a 
                      href={article.attachment_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download File
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg prose-slate max-w-none mb-12">
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
                {article.content}
              </div>
            </div>
          </div>

          {/* Article Footer */}
          <footer className="border-t border-slate-200 pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
                    liked 
                      ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                  {liked ? 'Liked' : 'Like'} ({article.likes || 0})
                </button>
              </div>

              <Link
                href="/articles"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Articles
              </Link>
            </div>
          </footer>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="max-w-6xl mx-auto mt-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedArticles.map((relatedArticle) => (
                <Link key={relatedArticle.id} href={`/articles/${relatedArticle.slug}`} className="group block">
                  <article className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    {relatedArticle.image_url && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={relatedArticle.image_url}
                          alt={relatedArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {relatedArticle.title}
                      </h3>
                      <p className="text-slate-600 mb-4 line-clamp-2">
                        {relatedArticle.description}
                      </p>
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>{formatDate(relatedArticle.created_at)}</span>
                        <span>{getReadingTime(relatedArticle.content)} min read</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
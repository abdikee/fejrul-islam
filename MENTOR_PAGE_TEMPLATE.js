// MENTOR PAGE TEMPLATE
// Copy this template to create new mentor pages
// Replace "NewPage" with your page name and customize the content

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  // Add your icons here from lucide-react
} from 'lucide-react';
import MentorFooter from '@/components/mentor/MentorFooter';

export default function NewPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user authentication
        const authResponse = await fetch('/api/auth/me');
        const authData = await authResponse.json();
        
        if (authData.success) {
          setUser(authData.user);
        }

        // Fetch your page-specific data here
        // const response = await fetch('/api/your-endpoint');
        // const result = await response.json();
        // setData(result.data);

        // Mock data for development
        setData([
          { id: 1, name: 'Sample Item 1' },
          { id: 2, name: 'Sample Item 2' },
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback data
        setUser({ firstName: 'Ahmad', lastName: 'Ibrahim', role: 'mentor' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-green-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/mentor/dashboard"
                className="p-2 hover:bg-green-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-green-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Page Title</h1>
                <p className="text-sm text-slate-600">Page description</p>
              </div>
            </div>
            {/* Optional: Add action button */}
            {/* <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
              Action Button
            </button> */}
          </div>
        </div>
      </header>

      {/* Navigation Bar - IMPORTANT: Keep this on all pages for consistency */}
      <nav className="bg-green-50 border-b border-green-200 sticky top-16 z-30">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-3">
            <Link 
              href="/mentor/dashboard" 
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
            >
              Dashboard
            </Link>
            <Link 
              href="/mentor/students" 
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
            >
              My Students
            </Link>
            <Link 
              href="/mentor/assignments" 
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
            >
              Assignments
            </Link>
            <Link 
              href="/mentor/submissions" 
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
            >
              Reviews
            </Link>
            <Link 
              href="/mentor/sessions" 
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
            >
              Sessions
            </Link>
            <Link 
              href="/mentor/sectors" 
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
            >
              Sectors
            </Link>
            <Link 
              href="/mentor/analytics" 
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors whitespace-nowrap"
            >
              Analytics
            </Link>
            {/* Add your new page link here and mark it as active */}
            {/* <Link 
              href="/mentor/new-page" 
              className="px-4 py-2 text-sm font-medium text-green-700 bg-green-100 rounded-lg whitespace-nowrap"
            >
              New Page
            </Link> */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-6 py-6">
        {/* Search/Filter Section (Optional) */}
        <div className="bg-white rounded-2xl p-6 border border-green-200 mb-6">
          <div className="flex gap-4">
            {/* Add search, filters, or other controls here */}
            <p className="text-slate-600">Add your filters and search here</p>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-4">
          {data.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl p-6 border border-green-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-bold text-slate-800">{item.name}</h3>
              {/* Add your content here */}
            </div>
          ))}
        </div>

        {/* Empty State (Optional) */}
        {data.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-600">No items found</p>
          </div>
        )}
      </main>

      {/* Footer - IMPORTANT: Keep this on all pages */}
      <MentorFooter user={user} />
    </div>
  );
}

/* 
CUSTOMIZATION CHECKLIST:
□ Replace "NewPage" with your component name
□ Update page title and description in header
□ Add your specific icons from lucide-react
□ Implement your data fetching logic
□ Customize the content section
□ Add your page to the navigation bar
□ Mark your page as active in navigation (text-green-700 bg-green-100)
□ Test loading state
□ Test empty state
□ Verify responsive design
*/

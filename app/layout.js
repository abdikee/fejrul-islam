import { Inter, Merriweather } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/navbar/Navbar';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const merriweather = Merriweather({ 
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  variable: '--font-merriweather',
});

export const metadata = {
  title: 'Fejrul Islam HUMSJ',
  description: 'Faith, Knowledge, and Character Development Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable} font-sans antialiased`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-slate-900 text-slate-300 py-12">
          <div className="container mx-auto px-6 text-center">
            <p className="text-lg font-semibold text-emerald-400 mb-2">Fejrul Islam HUMSJ</p>
            <p className="text-sm">Faith • Knowledge • Character • Service</p>
            <p className="text-xs mt-4 text-slate-400">© 2025 HUMSJ. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
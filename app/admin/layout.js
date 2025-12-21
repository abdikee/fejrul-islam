import { Inter, Merriweather } from 'next/font/google';

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
  title: 'Admin Dashboard - HUMSJ',
  description: 'Administrative control panel for HUMSJ platform',
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable} font-sans antialiased bg-slate-50`}>
        {/* No navbar or footer for admin - completely separate interface */}
        {children}
      </body>
    </html>
  );
}
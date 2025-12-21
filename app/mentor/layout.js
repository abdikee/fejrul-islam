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
  title: 'Mentor Dashboard - HUMSJ',
  description: 'Mentorship and guidance platform for HUMSJ mentors',
};

export default function MentorLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${merriweather.variable} font-sans antialiased bg-slate-50`}>
        {/* No navbar or footer for mentor - dedicated interface */}
        {children}
      </body>
    </html>
  );
}
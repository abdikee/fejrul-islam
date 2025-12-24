import './globals.css';

import { cookies } from 'next/headers';

export const metadata = {
  title: 'Fejrul Islam HUMSJ',
  description: 'Faith, Knowledge, and Character Development Platform',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  const cookieLocale = cookies().get('NEXT_LOCALE')?.value;
  const lang = ['en', 'ar', 'om', 'am'].includes(cookieLocale) ? cookieLocale : 'en';

  return (
    <html lang={lang}>
      <body className="font-sans antialiased bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
        {children}
      </body>
    </html>
  );
}

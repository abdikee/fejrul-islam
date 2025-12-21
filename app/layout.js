import { Inter, Merriweather } from 'next/font/google';
import './globals.css';
import { RealtimeProvider } from '@/components/realtime/RealtimeProvider';
import ConditionalLayout from '@/components/layout/ConditionalLayout';

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
        <RealtimeProvider userId={null}>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </RealtimeProvider>
      </body>
    </html>
  );
}
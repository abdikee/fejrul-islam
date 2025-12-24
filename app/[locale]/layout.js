import '../globals.css';
import { RealtimeProvider } from '@/components/realtime/RealtimeProvider';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

export const metadata = {
  title: 'Fejrul Islam HUMSJ',
  description: 'Faith, Knowledge, and Character Development Platform',
};

export default async function RootLayout({ children, params: {locale} }) {
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="font-sans antialiased bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <AuthProvider>
              <RealtimeProvider userId={null}>
                <ConditionalLayout>
                  {children}
                </ConditionalLayout>
              </RealtimeProvider>
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

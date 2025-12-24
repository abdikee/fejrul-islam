import { RealtimeProvider } from '@/components/realtime/RealtimeProvider';
import { AuthProvider } from '@/hooks/useAuth';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ConditionalLayout from '@/components/layout/ConditionalLayout';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages} from 'next-intl/server';

export default async function RootLayout({ children, params: {locale} }) {
  const messages = await getMessages();

  return (
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
  );
}

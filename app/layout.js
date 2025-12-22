import './globals.css';
import { RealtimeProvider } from '@/components/realtime/RealtimeProvider';
import ConditionalLayout from '@/components/layout/ConditionalLayout';

export const metadata = {
  title: 'Fejrul Islam HUMSJ',
  description: 'Faith, Knowledge, and Character Development Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <RealtimeProvider userId={null}>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
        </RealtimeProvider>
      </body>
    </html>
  );
}
import '../globals.css';

export const metadata = {
  title: 'Admin Portal - HUMSJ',
  description: 'Administrative dashboard for HUMSJ system management',
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-slate-50">
        {/* No general navbar or footer - admin has its own interface */}
        {children}
      </body>
    </html>
  );
}
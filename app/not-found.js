import Link from 'next/link';

export const runtime = 'nodejs';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Page not found</h1>
        <p className="mt-2 text-slate-600">
          The page you’re looking for doesn’t exist.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

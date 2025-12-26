'use client';

import Link from 'next/link';

export default function GlobalError({ error, reset }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-800">Something went wrong</h1>
        <p className="mt-2 text-slate-600">
          Please try again. If the problem continues, contact support.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 transition-colors"
          >
            Go home
          </Link>
        </div>
        {process.env.NODE_ENV !== 'production' ? (
          <pre className="mt-6 text-left text-xs text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-3 overflow-auto">
            {String(error?.message || error)}
          </pre>
        ) : null}
      </div>
    </div>
  );
}

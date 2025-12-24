'use client';

import { useEffect } from 'react';

export default function MaleLoginRedirect() {
  useEffect(() => {
    const qs = typeof window !== 'undefined' ? window.location.search : '';
    window.location.replace(qs ? `/auth/login${qs}` : '/auth/login');
  }, []);

  return null;
}
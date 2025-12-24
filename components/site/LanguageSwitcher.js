'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (e) => {
    const newLocale = e.target.value;
    // Remove current locale from path
    const pathWithoutLocale = pathname.replace(/^\/(en|ar|om|am)/, '') || '/';
    // Construct new path
    const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
    
    router.push(newPath);
  };

  return (
    <div className="flex items-center gap-2 px-2">
      <Globe className="w-4 h-4 text-slate-600" />
      <select
        value={locale}
        onChange={handleChange}
        className="bg-transparent text-sm font-medium text-slate-700 focus:outline-none cursor-pointer border-none outline-none"
      >
        <option value="en">English</option>
        <option value="ar">العربية</option>
        <option value="om">Afaan Oromoo</option>
        <option value="am">አማርኛ</option>
      </select>
    </div>
  );
}

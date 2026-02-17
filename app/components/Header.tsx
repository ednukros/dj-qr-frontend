'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';

  return (
    <header className="w-full bg-neutral-900 px-3 py-2 flex justify-center items-center relative">
      <Link href="/" className="hover:opacity-80 transition">
        <Logo />
      </Link>
      
      {!isHome && (
        <Link 
          href="/" 
          className="absolute right-3 text-neutral-400 hover:text-white transition text-sm font-medium"
        >
          ← Dashboard
        </Link>
      )}
    </header>
  );
}

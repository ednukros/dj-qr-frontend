import Link from 'next/link';
import Logo from './Logo';

export default function Header() {
  return (
    <header className="w-full bg-neutral-900 px-3 py-2 flex justify-between items-center">
      <Link href="/" className="hover:opacity-80 transition">
        <Logo />
      </Link>
      
      <Link 
        href="/" 
        className="text-neutral-400 hover:text-white transition text-sm font-medium"
      >
        ← Dashboard
      </Link>
    </header>
  );
}

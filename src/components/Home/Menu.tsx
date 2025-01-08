import Link from 'next/link';
import { LucideBriefcaseBusiness } from 'lucide-react';
import { Button } from '../ui/button';
import MobileMenu from './MobileMenu';

const Menu = () => {

  const menuItems = [
    { label: 'How it works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav className="bg-gray-950 border-b border-gray-800">
      <div className="container mx-auto px-4 py-5">
        <div className="flex justify-between items-center">

          <div className="flex-shrink-0">
            <Link href="/" className="font-bold flex items-center gap-2">
              <LucideBriefcaseBusiness className="w-6 h-6" /> Jobseeker
            </Link>
          </div>

          <div className="hidden md:flex gap-6">
            {menuItems.map((item) => (
              <Button variant="ghost" size="sm" key={item.href} className="hover:bg-gray-800/80 hover:text-white">
                <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}
          </div>

          <div className="hidden md:block">
            <Button variant="secondary" size="sm">
              <Link href="/register">Try for free</Link>
            </Button>
          </div>

          <div className="md:hidden">
            <MobileMenu menuItems={menuItems} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
